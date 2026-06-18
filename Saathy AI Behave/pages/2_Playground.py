# NOTE: This tool is internal-only -- assume it runs on localhost or an internal network, not exposed publicly.

import streamlit as st
import os
import re
import uuid
from db.prompt_repository import get_prompt_versions, get_prompt_by_id
from db.run_repository import save_test_run
from core.synthetic_messages import get_synthetic_messages
from core.cost_calculator import calculate_cost, calculate_inr_estimate
from core.prompt_renderer import render_prompt
from providers.openai_provider import OpenAIProvider
from providers.anthropic_provider import AnthropicProvider

DB_PATH = "prompt_lab.db"

st.set_page_config(
    page_title="Saathy AI - Single Playground",
    page_icon="🛝",
    layout="wide"
)

st.title("🛝 Single Playground")
st.markdown("Test a system prompt against real or synthetic messages on a selected provider.")

# Initialize session state for playground run results
if "last_run" not in st.session_state:
    st.session_state.last_run = None

col_left, col_right = st.columns([1, 1.2])

with col_left:
    st.subheader("Configure Test Run")
    
    # 1. Select Prompt Version
    all_versions = get_prompt_versions(DB_PATH)
    if not all_versions:
        st.error("No prompt versions available. Please create one in the Prompt Library first.")
        st.stop()
        
    prompt_options = {
        pv['id']: f"{pv['name']} - {pv['version_label']} ({'Active' if pv['is_active'] else 'Inactive'})"
        for pv in all_versions
    }
    selected_prompt_id = st.selectbox(
        "System Prompt Version", 
        options=list(prompt_options.keys()), 
        format_func=lambda x: prompt_options[x]
    )
    
    # Show prompt preview
    selected_prompt = next(pv for pv in all_versions if pv['id'] == selected_prompt_id)
    with st.expander("👁️ View System Prompt", expanded=False):
        st.code(selected_prompt['prompt_text'], language="text")
        
    # 2. Select Provider and Model
    provider_name = st.selectbox("Provider", ["openai", "anthropic"])
    
    # Instantiate providers to list models and verify keys
    openai_key = os.getenv("OPENAI_API_KEY", "")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY", "")
    
    if provider_name == "openai":
        if not openai_key:
            st.error("OpenAI API key is missing from `.env`.")
            provider_inst = None
        else:
            provider_inst = OpenAIProvider(api_key=openai_key)
    else:
        if not anthropic_key:
            st.error("Anthropic API key is missing from `.env`.")
            provider_inst = None
        else:
            provider_inst = AnthropicProvider(api_key=anthropic_key)
            
    if provider_inst:
        available_models = provider_inst.list_models()
        selected_model = st.selectbox("Model", available_models)
    else:
        st.selectbox("Model", ["(No API key configured)"], disabled=True)
        selected_model = None
        
    # 3. Test Message Selection
    message_source = st.radio("Test Message Source", ["✍️ Custom Input", "📚 Synthetic Messages Bank"])
    test_message_text = ""
    
    if message_source == "📚 Synthetic Messages Bank":
        synthetic_msgs = get_synthetic_messages(DB_PATH)
        if not synthetic_msgs:
            st.warning("No synthetic messages found in database.")
        else:
            msg_options = {
                m['id']: f"[{m['category'].upper()}] {m['message_text'][:60]}..."
                for m in synthetic_msgs
            }
            selected_msg_id = st.selectbox(
                "Choose Seed Message", 
                options=list(msg_options.keys()),
                format_func=lambda x: msg_options[x]
            )
            selected_msg = next(m for m in synthetic_msgs if m['id'] == selected_msg_id)
            test_message_text = selected_msg['message_text']
            st.caption(f"**Expected Tone Guidelines:** {selected_msg['expected_tone']}")
            
    test_message = st.text_area("Test Message Content", value=test_message_text, height=120)
    
    # 4. Hyperparameters
    col_param1, col_param2 = st.columns(2)
    with col_param1:
        temperature = st.slider("Temperature", 0.0, 1.0, 0.7, step=0.1)
    with col_param2:
        max_tokens = st.slider("Max Tokens", 100, 1000, 500, step=50)

    # 5. Variable Injection (Render prompt if contains placeholders)
    # Exclude user_message if we want, or map user_message automatically
    placeholders = re.findall(r"\{\{(.*?)\}\}", selected_prompt['prompt_text'])
    placeholders = list(set([p.strip() for p in placeholders]))
    
    injected_vars = {}
    if placeholders:
        st.markdown("**Prompt Template Variables Detected:**")
        for placeholder in placeholders:
            if placeholder == "user_message":
                injected_vars[placeholder] = test_message
                st.caption("`{{user_message}}` mapped automatically to the test message content above.")
            else:
                injected_vars[placeholder] = st.text_input(
                    f"Value for {{{{{placeholder}}}}}",
                    key=f"var_{placeholder}"
                )
                
    # Run Test Button
    can_run = provider_inst is not None and selected_model is not None and len(test_message.strip()) > 0
    if st.button("🚀 Run Test", type="primary", disabled=not can_run):
        try:
            with st.spinner("Calling API..."):
                # Render template
                # If template doesn't use placeholders, it will just be the system prompt.
                # If it does, we inject variables.
                final_system_prompt = selected_prompt['prompt_text']
                if placeholders:
                    final_system_prompt = render_prompt(final_system_prompt, injected_vars)
                
                # Execute generation
                res = provider_inst.generate(
                    system_prompt=final_system_prompt,
                    user_message=test_message,
                    model=selected_model,
                    max_tokens=max_tokens,
                    temperature=temperature
                )
                
                # Calculate cost
                cost = calculate_cost(provider_name, selected_model, res.input_tokens, res.output_tokens)
                
                # Store in session state
                st.session_state.last_run = {
                    "prompt_version_id": selected_prompt_id,
                    "provider": provider_name,
                    "model": selected_model,
                    "test_message": test_message,
                    "response_text": res.response_text,
                    "input_tokens": res.input_tokens,
                    "output_tokens": res.output_tokens,
                    "cost_usd": cost,
                    "latency_ms": res.latency_ms
                }
        except KeyError as ke:
            st.error(f"Cost calculation key error: {str(ke)}")
        except Exception as e:
            st.error(f"API Execution Error: {str(e)}")

with col_right:
    st.subheader("Test Run Output")
    
    run_data = st.session_state.last_run
    if not run_data:
        st.info("Run a test configuration on the left to see results here.")
    else:
        # Display response container with styled styling
        st.markdown("##### Assistant Response")
        st.info(run_data["response_text"])
        
        # Display metrics
        st.markdown("##### Metrics")
        col_m1, col_m2, col_m3, col_m4 = st.columns(4)
        col_m1.metric("Latency", f"{run_data['latency_ms']} ms")
        col_m2.metric("Input Tokens", run_data['input_tokens'])
        col_m3.metric("Output Tokens", run_data['output_tokens'])
        
        cost_inr = calculate_inr_estimate(run_data['cost_usd'])
        col_m4.metric("Cost (Est.)", f"${run_data['cost_usd']:.6f}", f"₹{cost_inr:.4f}")
        st.caption("Note: INR conversion is based on a fixed estimate (1 USD = 84 INR) and is not live FX.")
        
        # Review Quality Panel
        st.markdown("##### Response Quality Rating (Manual Review)")
        
        # We use st.form to capture human notes and rating
        # Rating must not be auto-populated to maintain manual input requirement.
        with st.form("manual_rating_form"):
            rating = st.slider("Quality Score (1 = Poor, 5 = Excellent)", min_value=1, max_value=5, value=3)
            notes = st.text_area("Reviewer Notes", placeholder="Tone was helpful but slightly clinical...")
            
            save_clicked = st.form_submit_button("💾 Save Run & Rating")
            if save_clicked:
                try:
                    run_id = save_test_run(
                        db_path=DB_PATH,
                        prompt_version_id=run_data["prompt_version_id"],
                        provider=run_data["provider"],
                        model=run_data["model"],
                        test_message=run_data["test_message"],
                        response_text=run_data["response_text"],
                        input_tokens=run_data["input_tokens"],
                        output_tokens=run_data["output_tokens"],
                        cost_usd=run_data["cost_usd"],
                        latency_ms=run_data["latency_ms"],
                        human_rating=rating,
                        human_notes=notes.strip(),
                        run_type='single',
                        ab_group_id=None
                    )
                    st.success(f"Run saved successfully in database (ID: {run_id})!")
                    st.session_state.last_run = None # clear output on successful save
                    st.rerun()
                except Exception as e:
                    st.error(f"Error saving run to database: {str(e)}")
