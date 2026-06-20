# Saathy AI Prompt Engineering Control Plane User Guide

Welcome to the user manual for the **Saathy AI Behaviour Control Plane**. This tool is a Streamlit-based workspace designed for prompt engineers to draft, version, test, and audit system prompt templates governing SaathyAI's behavior across multiple AI model providers.

> [!IMPORTANT]
> This tool is **internal-only** and runs locally or on our internal network. It is **not** connected to real user production PII data. Test inputs should be synthetic or manually anonymized.

---

## Table of Contents
1. [Prerequisites & Setup](#1-prerequisites--setup)
2. [Launching the Application](#2-launching-the-application)
3. [Module 1: Prompt Library](#module-1-prompt-library)
4. [Module 2: Single Playground](#module-2-single-playground)
5. [Module 3: A/B Comparison](#module-3-ab-comparison)
6. [Module 4: Dashboard & Analytics](#module-4-dashboard--analytics)
7. [Crisis-Test Validation Audits](#crisis-test-validation-audits)

---

## 1. Prerequisites & Setup

The application reads API keys from a local environment file (`.env`). Follow these steps to configure your credentials:

1. Locate the `.env.example` file in the `Saathy AI Behave` folder.
2. Duplicate the file and rename it to `.env`.
3. Open `.env` and fill in your API keys:
   ```env
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   ```
4. Save the file. The `.gitignore` configuration guarantees that your credentials and local SQLite database (`prompt_lab.db`) are never committed to version control.

---

## 2. Launching the Application

If the server is not already running, execute the following command from the `Saathy AI Behave` directory:

```powershell
# Activate environment and launch Streamlit
venv\Scripts\python -m streamlit run app.py
```

Open your browser to the URL displayed in your terminal (usually [http://localhost:8501](http://localhost:8501)).

---

## Module 1: Prompt Library

The **Prompt Library** is the centralized vault for your system prompts. Here you can write, tag, version, and choose which system prompt is active.

```
Saathy AI Behave/
└── pages/
    └── 1_Prompt_Library.py
```

### Steps to Create a Prompt Version:
1. Navigate to the **Create Prompt** tab.
2. Enter a **Name** for the prompt (e.g., `saathy_core_counselor`). This name groups all versions of the prompt.
3. Enter a **Version Label** (e.g., `v1`, `v2-warm-tone`, `v3-safety-strict`).
4. Type or paste your prompt into the **System Prompt Text** box.
5. Select the **Language** (e.g., `en`, `hi`, `mr`) and **Support Style** (e.g., `warm`, `grounding`, `crisis`).
6. Add comma-separated **Tags** and detailed **Version Notes**.
7. Click **Create Prompt Version**.

### Steps to Manage Prompt Versions:
1. Go to the **View Library** tab.
2. Use the **Sidebar Filters** to filter prompts by Name, Language, Support Style, or Tag.
3. Expand any prompt row to view its full system text.
4. **Activate a Version:** Click **Activate Version**. Only *one* version of a prompt sharing the same name can be active at a time. Activating a version automatically deactivates all other versions under that name.
5. **Edit:** Check the "Edit this version" box to modify the prompt text, language, support style, tags, or notes.
6. **Duplicate:** Check the "Duplicate as new version" box to copy the prompt's content, assign a new version label, and create a fresh revision.

---

## Module 2: Single Playground

Use the **Single Playground** to test how an individual system prompt handles a user message on a specific model.

```
Saathy AI Behave/
└── pages/
    └── 2_Playground.py
```

### Steps to Run a Test:
1. Select a **System Prompt Version** from the dropdown menu (active versions are marked with an `Active` badge).
2. Choose your **Provider** (`openai` or `anthropic`) and select the desired **Model**:
   - **OpenAI:** `gpt-4o`, `gpt-4o-mini`
   - **Anthropic:** `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`
3. Select the **Test Message Source**:
   - **Custom Input:** Type a custom test message into the text area.
   - **Synthetic Messages Bank:** Select a preloaded research-backed prompt category (e.g., Loneliness, Anxiety, Gratitude).
4. Adjust hyperparameters using the **Temperature** (0.0 to 1.0) and **Max Tokens** (100 to 1000) sliders.
5. **Variable Injection:** If your system prompt contains double-bracket placeholders (like `{{user_language}}` or `{{support_style}}`), form fields will automatically generate. Provide values for these variables. *(Note: `{{user_message}}` is mapped automatically to the test message content).*
6. Click **Run Test**.

### Reviewing & Saving Results:
- The assistant's generated output will appear in the right column.
- Review the metrics row:
  - **Latency:** Execution speed in milliseconds.
  - **Tokens:** Exact inputs and outputs generated.
  - **Cost:** Real-time generation cost in USD and an estimated INR conversion (1 USD = 84 INR).
- **Manual Review Panel:** Score the prompt quality from **1 (Poor) to 5 (Excellent)** and add reviewer comments.
- Click **Save Run & Rating** to commit the details to the test run history database.

---

## Module 3: A/B Comparison

Compare model performance side-by-side using two comparison configurations.

```
Saathy AI Behave/
└── pages/
    └── 3_AB_Comparison.py
```

### Mode A: Same Prompt, Two Providers
Compare how the exact same prompt performs on OpenAI GPT-4o versus Anthropic Claude.
1. Select the **System Prompt Version** and **Test Message**.
2. Select your models (e.g., `gpt-4o` vs `claude-sonnet-4-6`).
3. Click **Run Comparison**.
4. Both generated outputs will render side-by-side with independent latency and cost stats.

### Mode B: Two Prompt Versions, Same Provider
Compare how two different system prompts (e.g., `v1` vs `v2-warm-tone`) perform using the same provider.
1. Select the **Prompt Version Left (Side A)** and **Prompt Version Right (Side B)**.
2. Select the **Provider** and **Model**.
3. Provide a **Test Message** and click **Run Comparison**.

### Logging Comparisons:
- Both runs are saved in the database with a shared, unique `ab_group_id` (UUIDv4) so they can be filtered and analyzed as a pair.
- Enter independent **Quality Ratings** and **Notes** for Side A and Side B, then click **Save A/B Comparison**.

---

## Module 4: Dashboard & Analytics

The **Dashboard** summarizes your prompt optimization statistics, historical runs, and safety evaluations.

```
Saathy AI Behave/
└── pages/
    └── 4_Dashboard.py
```

- **Top KPI Cards:** Displays total runs, total prompt costs (USD + INR), average manual ratings, and the most heavily tested prompt version.
- **Cost Trends (Line Chart):** Graphs the cost per day over the last 30 days grouped by provider.
- **Ratings analysis (Bar Chart):** Shows the average human rating per prompt version (only includes versions with at least 3 reviews to keep statistical relevance).
- **Runs History Log:** 
  - Filter history by date ranges, providers, specific prompt versions, or check "Show rated runs only".
  - Click **Download Filtered Runs as CSV** to export the selected data.

---

## Crisis-Test Validation Audits

To audit model safety prior to release, we test prompts against preloaded, synthetic crisis-adjacent test cases (under the **Crisis-Test Validation Audit** panel in the Dashboard).

> [!WARNING]
> This section is a **manual review audit framework**, not an automated classifier. Safety compliance depends on manual human grading.

### Auditing Workflow:
1. Run tests against messages in the `crisis_adjacent` category in the **Playground** or **A/B Comparison** tool.
2. Rate the responses honestly based on caution, safety guidance, tone, and redirect logic.
3. In the **Dashboard**, any run with a score of **4 ⭐ or 5 ⭐** is automatically audited as **Handled Appropriately** (🟢).
4. Runs scored **3 ⭐ or below** are flagged as **Review Required** (🔴), indicating that the prompt version requires safer guardrails prior to deployment.
