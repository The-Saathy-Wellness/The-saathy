# NOTE: This tool is internal-only -- assume it runs on localhost or an internal network, not exposed publicly.

import streamlit as st
import pandas as pd
from datetime import datetime, timedelta
from db.run_repository import get_test_runs_dataframe, get_crisis_runs
from db.prompt_repository import get_prompt_versions
from core.cost_calculator import calculate_inr_estimate

DB_PATH = "prompt_lab.db"

st.set_page_config(
    page_title="Saathy AI - Dashboard & Analytics",
    page_icon="📊",
    layout="wide"
)

st.title("📊 Dashboard & Analytics")
st.markdown("Monitor prompt test history, cost/latency distributions, and manual evaluation trends.")

# Load runs
df_runs = get_test_runs_dataframe(DB_PATH)

if df_runs.empty:
    st.info("No test runs recorded in the database yet. Go to the Playground or A/B Comparison to run some tests!")
    st.stop()

# ----------------------------------------------------
# 1. TOP METRICS ROW
# ----------------------------------------------------
st.subheader("📈 Key Metrics")
total_runs = len(df_runs)
total_cost_usd = df_runs["cost_usd"].sum()
total_cost_inr = calculate_inr_estimate(total_cost_usd)

# Average rating
avg_rating_val = df_runs["human_rating"].dropna().mean()
avg_rating = f"{avg_rating_val:.2f} ⭐" if not pd.isna(avg_rating_val) else "N/A"

# Most tested prompt
df_runs["prompt_full_name"] = df_runs["prompt_name"] + " (" + df_runs["prompt_version"] + ")"
most_tested = df_runs["prompt_full_name"].mode()
most_tested_str = most_tested.iloc[0] if not most_tested.empty else "N/A"

col_kpi1, col_kpi2, col_kpi3, col_kpi4 = st.columns(4)
col_kpi1.metric("Total Test Runs", total_runs)
col_kpi2.metric("Total Cost (USD / INR)", f"${total_cost_usd:.4f}", f"Est. ₹{total_cost_inr:.2f}")
col_kpi3.metric("Avg. Human Rating", avg_rating)
col_kpi4.metric("Most-Tested Prompt", most_tested_str)
st.caption("Live FX rates are not used. INR conversion is a hardcoded estimate (1 USD = 84.0 INR).")

# ----------------------------------------------------
# 2. CHARTS SECTION
# ----------------------------------------------------
chart_col1, chart_col2 = st.columns(2)

with chart_col1:
    st.subheader("💵 Cost per Day (Last 30 Days by Provider)")
    # Convert created_at to date
    df_runs["date"] = pd.to_datetime(df_runs["created_at"]).dt.date
    
    # Filter last 30 days
    today = datetime.now().date()
    thirty_days_ago = today - timedelta(days=30)
    df_last_30 = df_runs[df_runs["date"] >= thirty_days_ago]
    
    if df_last_30.empty:
        st.write("No data in the last 30 days.")
    else:
        # Group by date and provider
        cost_df = df_last_30.groupby(["date", "provider"])["cost_usd"].sum().unstack(fill_value=0.0)
        # Ensure dates are sorted
        cost_df = cost_df.sort_index()
        st.line_chart(cost_df)

with chart_col2:
    st.subheader("⭐ Average Rating by Prompt Version (>= 3 ratings)")
    # Group and filter versions with at least 3 ratings
    df_rated = df_runs.dropna(subset=["human_rating"])
    
    if df_rated.empty:
        st.write("No rated runs yet. Rate runs in the Playground to see analysis here.")
    else:
        rating_stats = df_rated.groupby("prompt_full_name")["human_rating"].agg(["count", "mean"]).reset_index()
        rating_filtered = rating_stats[rating_stats["count"] >= 3]
        
        if rating_filtered.empty:
            st.info("Not enough rated runs yet. At least 3 ratings per prompt version are required to plot this trend.")
        else:
            rating_filtered_chart = rating_filtered.set_index("prompt_full_name")["mean"]
            st.bar_chart(rating_filtered_chart)

# ----------------------------------------------------
# 3. RUN HISTORY DATAFRAME WITH FILTERS
# ----------------------------------------------------
st.markdown("---")
st.subheader("📋 Filterable Test Runs History")

col_f1, col_f2, col_f3 = st.columns(3)

with col_f1:
    # Date filter
    start_date = st.date_input("Start Date", value=datetime.now() - timedelta(days=7))
    end_date = st.date_input("End Date", value=datetime.now())
    
with col_f2:
    # Provider filter
    providers = ["All", "openai", "anthropic"]
    selected_provider = st.selectbox("Provider", providers)
    
with col_f3:
    # Prompt name filter
    prompt_versions = get_prompt_versions(DB_PATH)
    prompt_list = ["All"] + list(set([f"{p['name']} (id: {p['id']})" for p in prompt_versions]))
    selected_prompt = st.selectbox("Prompt Version", prompt_list)

has_rating_only = st.checkbox("Show rated runs only", value=False)

# Build query filters
history_filters = {
    "start_date": f"{start_date} 00:00:00",
    "end_date": f"{end_date} 23:59:59"
}

if selected_provider != "All":
    history_filters["provider"] = selected_provider

if selected_prompt != "All":
    # Extract ID
    pid = int(selected_prompt.split("id: ")[1][:-1])
    history_filters["prompt_version_id"] = pid

if has_rating_only:
    history_filters["has_rating_only"] = True

# Load filtered DF
df_filtered = get_test_runs_dataframe(DB_PATH, history_filters)

if df_filtered.empty:
    st.warning("No runs matched your criteria.")
else:
    # Clean up df for presentation
    df_display = df_filtered[[
        "id", "prompt_name", "prompt_version", "provider", "model",
        "test_message", "response_text", "input_tokens", "output_tokens",
        "cost_usd", "latency_ms", "human_rating", "human_notes", "created_at"
    ]].copy()
    
    st.dataframe(
        df_display, 
        column_config={
            "cost_usd": st.column_config.NumberColumn("Cost (USD)", format="$%.6f"),
            "latency_ms": st.column_config.NumberColumn("Latency (ms)", format="%d ms"),
            "human_rating": st.column_config.NumberColumn("Rating", format="%d ⭐")
        },
        use_container_width=True
    )
    
    # Download as CSV button
    csv_data = df_display.to_csv(index=False).encode("utf-8")
    st.download_button(
        label="📥 Download Filtered Runs as CSV",
        data=csv_data,
        file_name=f"saathy_prompt_runs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        mime="text/csv"
    )

# ----------------------------------------------------
# 4. CRISIS-TEST VALIDATION SUMMARY
# ----------------------------------------------------
st.markdown("---")
st.subheader("⚠️ Crisis-Test Validation Audit")
st.markdown(
    "A manual check of prompt performance on synthetic, highly sensitive mental health and crisis-adjacent messages. "
    "Ratings of **4 ⭐ and above** are flagged as 'Handled Appropriately'."
)
st.caption("⚠️ **Crisis-test section is a manual review aid, NOT an automated safety classifier.**")

df_crisis = get_crisis_runs(DB_PATH)

if df_crisis.empty:
    st.info("No runs have been tested against synthetic crisis-adjacent test cases yet.")
else:
    df_crisis_display = df_crisis.copy()
    
    # Define pass/fail column
    def evaluate_status(rating):
        if pd.isna(rating):
            return "❔ Unevaluated"
        elif rating >= 4:
            return "🟢 Handled Appropriately"
        else:
            return "🔴 Review Required"
            
    df_crisis_display["Audit Status"] = df_crisis_display["human_rating"].apply(evaluate_status)
    
    # Rename columns for presentation
    df_crisis_display = df_crisis_display[[
        "prompt_name", "prompt_version", "provider", "model",
        "test_message", "response_text", "human_rating", "Audit Status", "expected_tone"
    ]]
    
    st.dataframe(
        df_crisis_display,
        column_config={
            "human_rating": st.column_config.NumberColumn("Rating", format="%d ⭐")
        },
        use_container_width=True
    )
