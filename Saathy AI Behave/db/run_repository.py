import sqlite3
import pandas as pd

def get_connection(db_path):
    return sqlite3.connect(db_path)

def save_test_run(db_path, prompt_version_id, provider, model, test_message, response_text,
                  input_tokens, output_tokens, cost_usd, latency_ms,
                  human_rating=None, human_notes=None, run_type='single', ab_group_id=None):
    """Saves a test run to the database."""
    with get_connection(db_path) as conn:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO test_runs (
                prompt_version_id, provider, model, test_message, response_text,
                input_tokens, output_tokens, cost_usd, latency_ms,
                human_rating, human_notes, run_type, ab_group_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            prompt_version_id, provider, model, test_message, response_text,
            input_tokens, output_tokens, cost_usd, latency_ms,
            human_rating, human_notes, run_type, ab_group_id
        ))
        conn.commit()
        return cur.lastrowid

def get_test_runs_dataframe(db_path, filters=None):
    """Retrieves test runs as a pandas DataFrame, with optional filtering."""
    query = """
        SELECT 
            tr.id,
            tr.prompt_version_id,
            pv.name AS prompt_name,
            pv.version_label AS prompt_version,
            tr.provider,
            tr.model,
            tr.test_message,
            tr.response_text,
            tr.input_tokens,
            tr.output_tokens,
            tr.cost_usd,
            tr.latency_ms,
            tr.human_rating,
            tr.human_notes,
            tr.run_type,
            tr.ab_group_id,
            tr.created_at
        FROM test_runs tr
        JOIN prompt_versions pv ON tr.prompt_version_id = pv.id
        WHERE 1=1
    """
    params = []
    
    if filters:
        if filters.get('provider'):
            query += " AND tr.provider = ?"
            params.append(filters['provider'])
        if filters.get('prompt_version_id'):
            query += " AND tr.prompt_version_id = ?"
            params.append(int(filters['prompt_version_id']))
        if filters.get('has_rating_only'):
            query += " AND tr.human_rating IS NOT NULL"
        if filters.get('start_date'):
            query += " AND tr.created_at >= ?"
            params.append(filters['start_date'])
        if filters.get('end_date'):
            query += " AND tr.created_at <= ?"
            params.append(filters['end_date'])
            
    query += " ORDER BY tr.id DESC"
    
    with get_connection(db_path) as conn:
        df = pd.read_sql_query(query, conn, params=params)
        return df

def get_crisis_runs(db_path):
    """
    Retrieves runs associated with synthetic crisis messages by joining
    test_runs and synthetic_test_sets.
    """
    query = """
        SELECT 
            tr.id,
            pv.name AS prompt_name,
            pv.version_label AS prompt_version,
            tr.provider,
            tr.model,
            tr.test_message,
            tr.response_text,
            tr.human_rating,
            tr.human_notes,
            tr.created_at,
            sts.category,
            sts.expected_tone
        FROM test_runs tr
        JOIN prompt_versions pv ON tr.prompt_version_id = pv.id
        JOIN synthetic_test_sets sts ON tr.test_message = sts.message_text
        WHERE sts.is_crisis_test = 1
        ORDER BY tr.id DESC
    """
    with get_connection(db_path) as conn:
        return pd.read_sql_query(query, conn)
