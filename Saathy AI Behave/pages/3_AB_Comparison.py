# NOTE: This tool is internal-only -- assume it runs on localhost or an internal network, not exposed publicly.

import streamlit as st
import os
import uuid
import re
from db.prompt_repository import get_prompt_versions
from db.run_repository import save_test_run
from core.synthetic_messages import get_synthetic_messages
from core.cost_calculator import calculate_cost, calculate_inr_estimate
from core.prompt_renderer import render_prompt
from providers.openai_provider import OpenAIProvider
from providers.anthropic_provider import AnthropicProvider

DB_PATH = "prompt_lab.db"

st.set_page_config(
    page_title="Saathy AI - A/B Comparison",
    page_icon="⚖️",
    layout="wide"
)

st.title("⚖️ A/B Comparison")
st.markdown("Compare two models side-by-side: same prompt on different providers, or two prompts on the same provider.")

# Initialize session state for A/B comparison run
if "ab_run" not in st.session_state:
    st.session_state.ab_run = None

# Select Mode
ab_mode = st.radio(
    "Select Comparison Mode",
    ["Mode A: Same Prompt, Two Providers (OpenAI vs Anthropic)", "Mode B: Two Prompt Versions, Same Provider"],
    horizontal=True
)

all_versions = get_prompt_versions(DB_PATH)
if not all_versions:
    st.error("No prompt versions available. Please create one in the Prompt Library first.")
    st.stop()

# Build dictionary for dropdown
prompt_options = {
    pv['id']: f"{pv['name']} - {pv['version_label']} ({'Active' if pv['is_active'] else 'Inactive'})"
    for pv in all_versions
}

openai_key = os.getenv("OPENAI_API_KEY", "")
anthropic_key = os.getenv("ANTHROPIC_API_KEY", "")

# We will compile inputs inside a clean layout
st.subheader("Comparison Inputs & Parameters")
input_col1, input_col2 = st.columns(2)

with input_col1:
    # Mode-specific configuration
    if ab_mode.startswith("Mode A"):
        # Mode A: Same Prompt, Two Providers
        st.markdown("**Prompt & Provider Settings**")
        selected_prompt_id = st.selectbox(
            "System Prompt Version", 
            options=list(prompt_options.keys()), 
            format_func=lambda x: prompt_options[x],
            key="ab_mode_a_prompt"
        )
        
        # Display provider settings
        col_prov_a1, col_prov_a2 = st.columns(2)
        with col_prov_a1:
            openai_model = st.selectbox("OpenAI Model", ["gpt-4o", "gpt-4o-mini"])
        with col_prov_a2:
            anthropic_model = st.selectbox("Anthropic Model", ["claude-sonnet-4-6", "claude-haiku-4-5-20251001"])
            
    else:
        # Mode B: Two Prompt Versions, Same Provider
        st.markdown("**Prompt Settings (Select two versions to compare)**")
        col_pb1, col_pb2 = st.columns(2)
        with col_pb1:
            prompt_id_left = st.selectbox(
                "Prompt Version Left (Side A)", 
                options=list(prompt_options.keys()), 
                format_func=lambda x: prompt_options[x],
                key="ab_prompt_left"
            )
        with col_pb2:
            prompt_id_right = st.selectbox(
                "Prompt Version Right (Side B)", 
                options=list(prompt_options.keys()), 
                format_func=lambda x: prompt_options[x],
                key="ab_prompt_right"
            )
            
        st.markdown("**Provider Settings**")
        col_prov_b1, col_prov_b2 = st.columns(2)
        with col_prov_b1:
            provider_name = st.selectbox("Provider", ["openai", "anthropic"], key="ab_mode_b_provider")
        with col_prov_b2:
            if provider_name == "openai":
                selected_model = st.selectbox("Model", ["gpt-4o", "gpt-4o-mini"], key="ab_mode_b_model")
            else:
                selected_model = st.selectbox("Model", ["claude-sonnet-4-6", "claude-haiku-4-5-20251001"], key="ab_mode_b_model")

with input_col2:
    st.markdown("**Message Setup**")
    # Message Selection
    message_source = st.radio("Test Message Source", ["✍️ Custom Input", "📚 Synthetic Messages Bank"], key="ab_msg_src")
    test_message_text = ""
    
    if message_source == "📚 Synthetic Messages Bank":
        synthetic_msgs = get_synthetic_messages(DB_PATH)
        if synthetic_msgs:
            msg_options = {
                m['id']: f"[{m['category'].upper()}] {m['message_text'][:50]}..."
                for m in synthetic_msgs
            }
            selected_msg_id = st.selectbox(
                "Choose Seed Message", 
                options=list(msg_options.keys()),
                format_func=lambda x: msg_options[x],
                key="ab_msg_select"
            )
            selected_msg = next(m for m in synthetic_msgs if m['id'] == selected_msg_id)
            test_message_text = selected_msg['message_text']
            st.caption(f"**Expected Tone Guidelines:** {selected_msg['expected_tone']}")
            
    test_message = st.text_area("Test Message Content", value=test_message_text, height=80, key="ab_test_msg")
    
    # Common hyperparameters
    col_p1, col_p2 = st.columns(2)
    with col_p1:
        temperature = st.slider("Temperature", 0.0, 1.0, 0.7, step=0.1, key="ab_temp")
    with col_p2:
        max_tokens = st.slider("Max Tokens", 100, 1000, 500, step=50, key="ab_tokens")

# Validation and Execution
can_run = False
error_message = None

if ab_mode.startswith("Mode A"):
    # Requires both API keys
    if not openai_key:
        error_message = "OpenAI API key is missing. Add it to `.env` to compare."
    elif not anthropic_key:
        error_message = "Anthropic API key is missing. Add it to `.env` to compare."
    elif len(test_message.strip()) == 0:
        error_message = "Test message cannot be empty."
    else:
        can_run = True
else:
    # Mode B: requires single provider API key
    if provider_name == "openai" and not openai_key:
        error_message = "OpenAI API key is missing. Add it to `.env` to compare."
    elif provider_name == "anthropic" and not anthropic_key:
        error_message = "Anthropic API key is missing. Add it to `.env` to compare."
    elif len(test_message.strip()) == 0:
        error_message = "Test message cannot be empty."
    else:
        can_run = True

if error_message:
    st.error(error_message)

# Run Comparison button
if st.button("⚖️ Run Comparison", type="primary", disabled=not can_run):
    try:
        with st.spinner("Generating responses in parallel..."):
            ab_group_id = str(uuid.uuid4())
            
            # Setup Providers
            openai_provider = OpenAIProvider(openai_key) if openai_key else None
            anthropic_provider = AnthropicProvider(anthropic_key) if anthropic_key else None
            
            left_res, right_res = None, None
            left_info, right_info = {}, {}
            
            if ab_mode.startswith("Mode A"):
                # Mode A: Same prompt, two providers
                prompt_obj = next(pv for pv in all_versions if pv['id'] == selected_prompt_id)
                prompt_text = prompt_obj['prompt_text']
                
                # Check for placeholders
                placeholders = re.findall(r"\{\{(.*?)\}\}", prompt_text)
                final_prompt = prompt_text
                if placeholders:
                    # Map {{user_message}}
                    variables = {p.strip(): test_message for p in placeholders}
                    final_prompt = render_prompt(prompt_text, variables)
                
                # Run OpenAI (Left)
                left_res = openai_provider.generate(
                    system_prompt=final_prompt,
                    user_message=test_message,
                    model=openai_model,
                    max_tokens=max_tokens,
                    temperature=temperature
                )
                left_cost = calculate_cost("openai", openai_model, left_res.input_tokens, left_res.output_tokens)
                
                left_info = {
                    "prompt_version_id": selected_prompt_id,
                    "prompt_name": prompt_obj['name'],
                    "prompt_version": prompt_obj['version_label'],
                    "provider": "openai",
                    "model": openai_model,
                    "response_text": left_res.response_text,
                    "input_tokens": left_res.input_tokens,
                    "output_tokens": left_res.output_tokens,
                    "cost_usd": left_cost,
                    "latency_ms": left_res.latency_ms
                }
                
                # Run Anthropic (Right)
                right_res = anthropic_provider.generate(
                    system_prompt=final_prompt,
                    user_message=test_message,
                    model=anthropic_model,
                    max_tokens=max_tokens,
                    temperature=temperature
                )
                right_cost = calculate_cost("anthropic", anthropic_model, right_res.input_tokens, right_res.output_tokens)
                
                right_info = {
                    "prompt_version_id": selected_prompt_id,
                    "prompt_name": prompt_obj['name'],
                    "prompt_version": prompt_obj['version_label'],
                    "provider": "anthropic",
                    "model": anthropic_model,
                    "response_text": right_res.response_text,
                    "input_tokens": right_res.input_tokens,
                    "output_tokens": right_res.output_tokens,
                    "cost_usd": right_cost,
                    "latency_ms": right_res.latency_ms
                }
                
            else:
                # Mode B: Two prompts, same provider
                prompt_left_obj = next(pv for pv in all_versions if pv['id'] == prompt_id_left)
                prompt_right_obj = next(pv for pv in all_versions if pv['id'] == prompt_id_right)
                
                # Setup provider
                prov_inst = openai_provider if provider_name == "openai" else anthropic_provider
                
                # Render prompts
                left_prompt_text = prompt_left_obj['prompt_text']
                placeholders_left = re.findall(r"\{\{(.*?)\}\}", left_prompt_text)
                final_left_prompt = left_prompt_text
                if placeholders_left:
                    variables = {p.strip(): test_message for p in placeholders_left}
                    final_left_prompt = render_prompt(left_prompt_text, variables)
                    
                right_prompt_text = prompt_right_obj['prompt_text']
                placeholders_right = re.findall(r"\{\{(.*?)\}\}", right_prompt_text)
                final_right_prompt = right_prompt_text
                if placeholders_right:
                    variables = {p.strip(): test_message for p in placeholders_right}
                    final_right_prompt = render_prompt(right_prompt_text, variables)
                
                # Run Left Prompt
                left_res = prov_inst.generate(
                    system_prompt=final_left_prompt,
                    user_message=test_message,
                    model=selected_model,
                    max_tokens=max_tokens,
                    temperature=temperature
                )
                left_cost = calculate_cost(provider_name, selected_model, left_res.input_tokens, left_res.output_tokens)
                left_info = {
                    "prompt_version_id": prompt_id_left,
                    "prompt_name": prompt_left_obj['name'],
                    "prompt_version": prompt_left_obj['version_label'],
                    "provider": provider_name,
                    "model": selected_model,
                    "response_text": left_res.response_text,
                    "input_tokens": left_res.input_tokens,
                    "output_tokens": left_res.output_tokens,
                    "cost_usd": left_cost,
                    "latency_ms": left_res.latency_ms
                }
                
                # Run Right Prompt
                right_res = prov_inst.generate(
                    system_prompt=final_right_prompt,
                    user_message=test_message,
                    model=selected_model,
                    max_tokens=max_tokens,
                    temperature=temperature
                )
                right_cost = calculate_cost(provider_name, selected_model, right_res.input_tokens, right_res.output_tokens)
                right_info = {
                    "prompt_version_id": prompt_id_right,
                    "prompt_name": prompt_right_obj['name'],
                    "prompt_version": prompt_right_obj['version_label'],
                    "provider": provider_name,
                    "model": selected_model,
                    "response_text": right_res.response_text,
                    "input_tokens": right_res.input_tokens,
                    "output_tokens": right_res.output_tokens,
                    "cost_usd": right_cost,
                    "latency_ms": right_res.latency_ms
                }
                
            st.session_state.ab_run = {
                "ab_group_id": ab_group_id,
                "test_message": test_message,
                "left": left_info,
                "right": right_info,
                "mode": "Mode A" if ab_mode.startswith("Mode A") else "Mode B"
            }
    except KeyError as ke:
        st.error(f"Cost calculation key error: {str(ke)}")
    except Exception as e:
        st.error(f"Execution Error: {str(e)}")

# Display Outputs side-by-side
ab_data = st.session_state.ab_run
if ab_data:
    st.markdown("---")
    st.subheader("Comparison Outputs")
    
    col_out_left, col_out_right = st.columns(2)
    
    with col_out_left:
        st.markdown(f"### 🅰️ Side A: {ab_data['left']['provider'].upper()} ({ab_data['left']['model']})")
        st.markdown(f"**Prompt version:** {ab_data['left']['prompt_name']} ({ab_data['left']['prompt_version']})")
        st.info(ab_data['left']['response_text'])
        
        # Metrics Left
        st.markdown("**Side A Metrics**")
        ml1, ml2, ml3 = st.columns(3)
        ml1.metric("Latency", f"{ab_data['left']['latency_ms']} ms")
        ml2.metric("Tokens (I/O)", f"{ab_data['left']['input_tokens']} / {ab_data['left']['output_tokens']}")
        
        l_cost_inr = calculate_inr_estimate(ab_data['left']['cost_usd'])
        ml3.metric("Cost", f"${ab_data['left']['cost_usd']:.6f}", f"₹{l_cost_inr:.4f}")
        
    with col_out_right:
        st.markdown(f"### 🅱️ Side B: {ab_data['right']['provider'].upper()} ({ab_data['right']['model']})")
        st.markdown(f"**Prompt version:** {ab_data['right']['prompt_name']} ({ab_data['right']['prompt_version']})")
        st.info(ab_data['right']['response_text'])
        
        # Metrics Right
        st.markdown("**Side B Metrics**")
        mr1, mr2, mr3 = st.columns(3)
        mr1.metric("Latency", f"{ab_data['right']['latency_ms']} ms")
        mr2.metric("Tokens (I/O)", f"{ab_data['right']['input_tokens']} / {ab_data['right']['output_tokens']}")
        
        r_cost_inr = calculate_inr_estimate(ab_data['right']['cost_usd'])
        mr3.metric("Cost", f"${ab_data['right']['cost_usd']:.6f}", f"₹{r_cost_inr:.4f}")

    # Human rating panel
    st.markdown("---")
    st.subheader("⚖️ Side-by-Side Review Panel")
    
    with st.form("ab_rating_form"):
        col_rate1, col_rate2 = st.columns(2)
        
        with col_rate1:
            st.markdown("**Rate Side A**")
            rating_left = st.slider("Side A Quality (1-5)", min_value=1, max_value=5, value=3, key="rating_left")
            notes_left = st.text_area("Side A Reviewer Notes", placeholder="Better emotional depth...", key="notes_left")
            
        with col_rate2:
            st.markdown("**Rate Side B**")
            rating_right = st.slider("Side B Quality (1-5)", min_value=1, max_value=5, value=3, key="rating_right")
            notes_right = st.text_area("Side B Reviewer Notes", placeholder="Slightly robotic tone...", key="notes_right")
            
        save_ab = st.form_submit_button("💾 Save A/B Comparison")
        
        if save_ab:
            try:
                # Save Left side
                save_test_run(
                    db_path=DB_PATH,
                    prompt_version_id=ab_data['left']['prompt_version_id'],
                    provider=ab_data['left']['provider'],
                    model=ab_data['left']['model'],
                    test_message=ab_data['test_message'],
                    response_text=ab_data['left']['response_text'],
                    input_tokens=ab_data['left']['input_tokens'],
                    output_tokens=ab_data['left']['output_tokens'],
                    cost_usd=ab_data['left']['cost_usd'],
                    latency_ms=ab_data['left']['latency_ms'],
                    human_rating=rating_left,
                    human_notes=notes_left.strip(),
                    run_type='ab_comparison',
                    ab_group_id=ab_data['ab_group_id']
                )
                
                # Save Right side
                save_test_run(
                    db_path=DB_PATH,
                    prompt_version_id=ab_data['right']['prompt_version_id'],
                    provider=ab_data['right']['provider'],
                    model=ab_data['right']['model'],
                    test_message=ab_data['test_message'],
                    response_text=ab_data['right']['response_text'],
                    input_tokens=ab_data['right']['input_tokens'],
                    output_tokens=ab_data['right']['output_tokens'],
                    cost_usd=ab_data['right']['cost_usd'],
                    latency_ms=ab_data['right']['latency_ms'],
                    human_rating=rating_right,
                    human_notes=notes_right.strip(),
                    run_type='ab_comparison',
                    ab_group_id=ab_data['ab_group_id']
                )
                
                st.success("Successfully logged both comparison runs under group ID: " + ab_data['ab_group_id'])
                st.session_state.ab_run = None # Clear comparison on save
                st.rerun()
            except Exception as e:
                st.error(f"Error saving A/B comparison: {str(e)}")
