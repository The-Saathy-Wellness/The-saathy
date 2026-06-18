# NOTE: This tool is internal-only -- assume it runs on localhost or an internal network, not exposed publicly.
import sqlite3

def init_db(db_path="prompt_lab.db"):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # TABLE 1: prompt_versions
    # Stores every saved version of a system prompt. Provider-agnostic --
    # the same prompt_text is sent to both OpenAI and Anthropic (with
    # provider-specific wrapping handled in providers/*.py, not stored here).
    cur.execute("""
        CREATE TABLE IF NOT EXISTS prompt_versions (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            name            TEXT NOT NULL,
            version_label   TEXT NOT NULL,   -- e.g. 'v1', 'v2-warmer-tone', 'v3-crisis-strict'
            prompt_text     TEXT NOT NULL,   -- the system prompt itself
            language        TEXT DEFAULT 'en',
            support_style   TEXT DEFAULT 'mixed',
            tags            TEXT,
            is_active       INTEGER DEFAULT 0,
            created_by      TEXT,
            created_at      TEXT DEFAULT (datetime('now')),
            notes           TEXT
        )
    """)

    # TABLE 2: test_runs
    # Every playground/comparison execution is logged here for the dashboard.
    cur.execute("""
        CREATE TABLE IF NOT EXISTS test_runs (
            id                INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt_version_id INTEGER NOT NULL REFERENCES prompt_versions(id),
            provider          TEXT NOT NULL,
            model             TEXT NOT NULL,
            test_message      TEXT NOT NULL,
            response_text     TEXT NOT NULL,
            input_tokens      INTEGER,
            output_tokens     INTEGER,
            cost_usd          REAL,
            latency_ms        INTEGER,
            human_rating      INTEGER,
            human_notes       TEXT,
            run_type          TEXT DEFAULT 'single',
            ab_group_id       TEXT,
            created_at        TEXT DEFAULT (datetime('now'))
        )
    """)

    # TABLE 3: synthetic_test_sets (pre-loaded message bank, seeded once)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS synthetic_test_sets (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            category        TEXT NOT NULL,
            message_text    TEXT NOT NULL,
            expected_tone   TEXT,
            is_crisis_test  INTEGER DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()
