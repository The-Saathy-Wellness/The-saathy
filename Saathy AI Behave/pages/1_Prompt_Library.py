# NOTE: This tool is internal-only -- assume it runs on localhost or an internal network, not exposed publicly.

import streamlit as st
from db.prompt_repository import (
    create_prompt_version,
    update_prompt_version,
    get_prompt_versions,
    get_distinct_prompt_names,
    get_distinct_tags,
    activate_prompt_version
)

DB_PATH = "prompt_lab.db"

st.set_page_config(
    page_title="Saathy AI - Prompt Library",
    page_icon="📚",
    layout="wide"
)

st.title("📚 Prompt Library")
st.markdown("Create, view, edit, version, and activate system prompt templates.")

# Sidebar Filters
st.sidebar.header("🔍 Filters")

# Name filter
names = ["All"] + get_distinct_prompt_names(DB_PATH)
selected_name = st.sidebar.selectbox("Filter by Name", names)

# Language filter
languages = ["All", "en", "hi", "mr", "ta", "te"]
selected_lang = st.sidebar.selectbox("Filter by Language", languages)

# Support style filter
styles = ["All", "mixed", "grounding", "warm", "crisis", "directive"]
selected_style = st.sidebar.selectbox("Filter by Support Style", styles)

# Tag filter
all_tags = ["All"] + get_distinct_tags(DB_PATH)
selected_tag = st.sidebar.selectbox("Filter by Tag", all_tags)

# Compile filters
filters = {}
if selected_name != "All":
    filters['name'] = selected_name
if selected_lang != "All":
    filters['language'] = selected_lang
if selected_style != "All":
    filters['support_style'] = selected_style
if selected_tag != "All":
    filters['tag'] = selected_tag

# Retrieve prompt versions
versions = get_prompt_versions(DB_PATH, filters)

# Tab layout: View Library vs Create Prompt
tab_list, tab_create = st.tabs(["📋 View Library", "➕ Create Prompt"])

with tab_create:
    st.subheader("Create New System Prompt Version")
    with st.form("new_prompt_form"):
        new_name = st.text_input("Name", placeholder="e.g. saathy_v1_therapist")
        new_version = st.text_input("Version Label", placeholder="e.g. v1, v2-warmer-tone, v3-crisis-strict")
        new_text = st.text_area("System Prompt Text", height=300, placeholder="You are Saathy...")
        
        col1, col2 = st.columns(2)
        with col1:
            new_lang = st.selectbox("Language", ["en", "hi", "mr", "ta", "te"])
            new_style = st.selectbox("Support Style", ["mixed", "grounding", "warm", "crisis", "directive"])
        with col2:
            new_tags = st.text_input("Tags (comma separated)", placeholder="e.g. empathy, active-listening")
            new_notes = st.text_area("Version Notes", placeholder="e.g. Increased warm tone, added crisis redirect clauses.")
            
        submitted = st.form_submit_button("Create Prompt Version")
        
        if submitted:
            if not new_name or not new_version or not new_text:
                st.error("Name, Version Label, and Prompt Text are required fields.")
            else:
                try:
                    create_prompt_version(
                        db_path=DB_PATH,
                        name=new_name.strip(),
                        version_label=new_version.strip(),
                        prompt_text=new_text.strip(),
                        language=new_lang,
                        support_style=new_style,
                        tags=new_tags.strip(),
                        created_by="prompt-engineer",
                        notes=new_notes.strip()
                    )
                    st.success(f"Successfully created version '{new_version}' of prompt '{new_name}'!")
                    st.rerun()
                except Exception as e:
                    st.error(f"Error creating prompt version: {str(e)}")

with tab_list:
    st.subheader("Saved Prompt Versions")
    if not versions:
        st.info("No prompt versions match the active filters. Go to 'Create Prompt' to add one.")
    else:
        for idx, pv in enumerate(versions):
            active_badge = "🟢 ACTIVE" if pv['is_active'] == 1 else "⚪ INACTIVE"
            expander_title = f"{active_badge} | {pv['name']} - {pv['version_label']} ({pv['language']} - {pv['support_style']})"
            
            with st.expander(expander_title, expanded=False):
                col_info, col_actions = st.columns([3, 1])
                
                with col_info:
                    st.markdown("**Tags:** " + (pv['tags'] if pv['tags'] else "*None*"))
                    st.markdown("**Created At:** " + pv['created_at'])
                    st.markdown("**Notes:** " + (pv['notes'] if pv['notes'] else "*None*"))
                    
                    st.markdown("**Prompt Text:**")
                    st.code(pv['prompt_text'], language="text")
                    
                with col_actions:
                    st.markdown("### Actions")
                    
                    # Activate Button
                    if pv['is_active'] == 0:
                        if st.button("Activate Version", key=f"act_{pv['id']}"):
                            try:
                                activate_prompt_version(DB_PATH, pv['id'])
                                st.success(f"Prompt '{pv['name']}' version '{pv['version_label']}' is now active!")
                                st.rerun()
                            except Exception as e:
                                st.error(f"Error activating version: {str(e)}")
                    else:
                        st.info("This version is currently active for this prompt name.")
                        
                    st.markdown("---")
                    # Edit mode
                    show_edit = st.checkbox("Edit this version", key=f"edit_chk_{pv['id']}")
                    if show_edit:
                        with st.form(f"edit_form_{pv['id']}"):
                            edit_text = st.text_area("Prompt Text", value=pv['prompt_text'], height=200)
                            edit_lang = st.selectbox("Language", ["en", "hi", "mr", "ta", "te"], index=["en", "hi", "mr", "ta", "te"].index(pv['language']))
                            edit_style = st.selectbox("Support Style", ["mixed", "grounding", "warm", "crisis", "directive"], index=["mixed", "grounding", "warm", "crisis", "directive"].index(pv['support_style']))
                            edit_tags = st.text_input("Tags", value=pv['tags'])
                            edit_notes = st.text_area("Notes", value=pv['notes'])
                            
                            save_edit = st.form_submit_button("Save Changes")
                            if save_edit:
                                try:
                                    update_prompt_version(DB_PATH, pv['id'], edit_text, edit_lang, edit_style, edit_tags, edit_notes)
                                    st.success("Changes saved successfully!")
                                    st.rerun()
                                except Exception as e:
                                    st.error(f"Error updating prompt version: {str(e)}")
                                    
                    st.markdown("---")
                    # Duplicate Mode
                    show_dup = st.checkbox("Duplicate as new version", key=f"dup_chk_{pv['id']}")
                    if show_dup:
                        with st.form(f"dup_form_{pv['id']}"):
                            dup_version = st.text_input("New Version Label", placeholder="e.g. v2-tweaked")
                            dup_text = st.text_area("Prompt Text", value=pv['prompt_text'], height=200)
                            dup_lang = st.selectbox("Language", ["en", "hi", "mr", "ta", "te"], index=["en", "hi", "mr", "ta", "te"].index(pv['language']))
                            dup_style = st.selectbox("Support Style", ["mixed", "grounding", "warm", "crisis", "directive"], index=["mixed", "grounding", "warm", "crisis", "directive"].index(pv['support_style']))
                            dup_tags = st.text_input("Tags", value=pv['tags'])
                            dup_notes = st.text_area("Notes", value=f"Duplicated from {pv['version_label']}. " + pv['notes'])
                            
                            save_dup = st.form_submit_button("Create Duplicate")
                            if save_dup:
                                if not dup_version or not dup_text:
                                    st.error("Version Label and Prompt Text are required.")
                                else:
                                    try:
                                        create_prompt_version(
                                            DB_PATH,
                                            pv['name'],
                                            dup_version.strip(),
                                            dup_text.strip(),
                                            dup_lang,
                                            dup_style,
                                            dup_tags,
                                            "prompt-engineer",
                                            dup_notes
                                        )
                                        st.success(f"Created new duplicate version '{dup_version}'!")
                                        st.rerun()
                                    except Exception as e:
                                        st.error(f"Error duplicating prompt version: {str(e)}")
