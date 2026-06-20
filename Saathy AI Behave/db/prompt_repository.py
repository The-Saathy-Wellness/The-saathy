import sqlite3
import os

def get_connection(db_path):
    return sqlite3.connect(db_path)

def create_prompt_version(db_path, name, version_label, prompt_text, language='en', support_style='mixed', tags='', created_by='system', notes=''):
    """Creates a new prompt version. By default it is NOT active (is_active=0)."""
    with get_connection(db_path) as conn:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO prompt_versions (name, version_label, prompt_text, language, support_style, tags, is_active, created_by, notes)
            VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
        """, (name, version_label, prompt_text, language, support_style, tags, created_by, notes))
        conn.commit()
        return cur.lastrowid

def update_prompt_version(db_path, prompt_id, prompt_text, language, support_style, tags, notes):
    """Updates an existing prompt version's details."""
    with get_connection(db_path) as conn:
        cur = conn.cursor()
        cur.execute("""
            UPDATE prompt_versions
            SET prompt_text = ?, language = ?, support_style = ?, tags = ?, notes = ?
            WHERE id = ?
        """, (prompt_text, language, support_style, tags, notes, prompt_id))
        conn.commit()

def get_prompt_versions(db_path, filters=None):
    """Retrieves all prompt versions, optionally filtered by name, language, support_style, or tag."""
    with get_connection(db_path) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        
        query = "SELECT * FROM prompt_versions WHERE 1=1"
        params = []
        
        if filters:
            if filters.get('name'):
                query += " AND name = ?"
                params.append(filters['name'])
            if filters.get('language'):
                query += " AND language = ?"
                params.append(filters['language'])
            if filters.get('support_style'):
                query += " AND support_style = ?"
                params.append(filters['support_style'])
            if filters.get('tag'):
                query += " AND tags LIKE ?"
                params.append(f"%{filters['tag']}%")
                
        query += " ORDER BY id DESC"
        cur.execute(query, params)
        rows = cur.fetchall()
        return [dict(row) for row in rows]

def get_prompt_by_id(db_path, prompt_id):
    """Gets a specific prompt version by its ID."""
    with get_connection(db_path) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM prompt_versions WHERE id = ?", (prompt_id,))
        row = cur.fetchone()
        return dict(row) if row else None

def get_active_prompt_by_name(db_path, name):
    """Gets the active prompt version for a given name."""
    with get_connection(db_path) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM prompt_versions WHERE name = ? AND is_active = 1", (name,))
        row = cur.fetchone()
        return dict(row) if row else None

def get_distinct_prompt_names(db_path):
    """Gets list of distinct prompt names currently in the database."""
    with get_connection(db_path) as conn:
        cur = conn.cursor()
        cur.execute("SELECT DISTINCT name FROM prompt_versions ORDER BY name")
        return [row[0] for row in cur.fetchall()]

def get_distinct_tags(db_path):
    """Gets list of all unique tags in the database."""
    with get_connection(db_path) as conn:
        cur = conn.cursor()
        cur.execute("SELECT DISTINCT tags FROM prompt_versions WHERE tags IS NOT NULL AND tags != ''")
        tags_set = set()
        for row in cur.fetchall():
            for tag in row[0].split(','):
                tag_cleaned = tag.strip()
                if tag_cleaned:
                    tags_set.add(tag_cleaned)
        return sorted(list(tags_set))

def activate_prompt_version(db_path, prompt_id):
    """
    Activates a prompt version. First gets the name of the prompt_id,
    sets is_active=0 for all prompt versions with that name,
    then sets is_active=1 for the specified prompt_id, in a single transaction.
    """
    with get_connection(db_path) as conn:
        cur = conn.cursor()
        
        # 1. Get the name of this prompt version
        cur.execute("SELECT name FROM prompt_versions WHERE id = ?", (prompt_id,))
        row = cur.fetchone()
        if not row:
            raise ValueError(f"Prompt version with ID {prompt_id} not found.")
        name = row[0]
        
        # 2. Perform the update in a transaction
        try:
            # Set all prompts with this name to inactive
            cur.execute("UPDATE prompt_versions SET is_active = 0 WHERE name = ?", (name,))
            # Set this specific one to active
            cur.execute("UPDATE prompt_versions SET is_active = 1 WHERE id = ?", (prompt_id,))
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
