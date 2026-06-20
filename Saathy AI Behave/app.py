# NOTE: This tool is internal-only -- assume it runs on localhost or an internal network, not exposed publicly.

import streamlit as st
import os
from dotenv import load_dotenv

# Import database initialization and seeding scripts
from db.schema import init_db
from core.synthetic_messages import seed_synthetic_messages

# Load env variables from .env file
load_dotenv()

# Initialize DB on start
DB_PATH = "prompt_lab.db"
init_db(DB_PATH)
seed_synthetic_messages(DB_PATH)

st.set_page_config(
    page_title="Saathy AI Behave - Prompt Control Plane",
    page_icon="🧠",
    layout="wide"
)

# Helper to mask API keys
def get_masked_key(key_name: str) -> str:
    key_val = os.getenv(key_name)
    if not key_val:
        return "⚠️ Missing (Not Configured)"
    key_val = key_val.strip()
    if len(key_val) <= 4:
        return key_val
    return f"🟢 Configured (...{key_val[-4:]})"

# App Header
st.title("🧠 Saathy AI prompt engineering control plane")
st.markdown("""
Welcome to the prompt engineering control plane for **The Saathy** -- a hybrid AI + human emotional support SaaS. 

This internal console provides prompt engineers with tools to design, test, compare, and version-control the system prompts governing SaathyAI's behavior.
""")

# API Key Status panel
st.subheader("🔑 Local API Provider Status")
col1, col2 = st.columns(2)

with col1:
    st.info(f"**OpenAI API Key:** {get_masked_key('OPENAI_API_KEY')}")
with col2:
    st.info(f"**Anthropic API Key:** {get_masked_key('ANTHROPIC_API_KEY')}")

# Check if keys are missing and warn user
missing_keys = []
if not os.getenv("OPENAI_API_KEY"):
    missing_keys.append("OPENAI_API_KEY")
if not os.getenv("ANTHROPIC_API_KEY"):
    missing_keys.append("ANTHROPIC_API_KEY")

if missing_keys:
    st.warning(
        f"Some API keys are missing: {', '.join(missing_keys)}. "
        "Please create a `.env` file in this directory and populate these values. "
        "See `.env.example` for details."
    )

# Quick Nav
st.subheader("🗺️ Module Navigation")
nav_col1, nav_col2, nav_col3, nav_col4 = st.columns(4)

with nav_col1:
    st.markdown("### 📚 Prompt Library")
    st.write("Manage system prompt templates. Create new versions, write notes, assign tags, and activate versions.")
    
with nav_col2:
    st.markdown("### 🛝 Single Playground")
    st.write("Test a prompt template against synthetic test cases or custom inputs. Rate response quality and view cost/latency.")
    
with nav_col3:
    st.markdown("### ⚖️ A/B Comparison")
    st.write("Compare different versions of system prompts side-by-side, or compare OpenAI GPT-4o vs Anthropic Claude.")

with nav_col4:
    st.markdown("### 📊 Dashboard")
    st.write("Review run history, cost trends, average ratings, and validation runs on crisis-adjacent test cases.")

# Warning / Disclaimers
st.markdown("---")
st.caption("🔒 **Security & Context Disclaimer**")
st.caption(
    "This tool is restricted for internal use only. It is not connected to real production user databases or PII. "
    "Do not import real production user data without anonymization. This tool does not perform fine-tuning, training, "
    "or weight updates. Live FX rates for INR conversion are estimates (1 USD = 84.0 INR)."
)
