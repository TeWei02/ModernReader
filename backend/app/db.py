import sqlite3
import json
from typing import List, Dict, Optional, Any
from .config import settings

def get_conn():
    conn = sqlite3.connect(settings.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_conn()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS states (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp REAL NOT NULL,
            node_id TEXT NOT NULL,
            source_type TEXT,
            state TEXT NOT NULL,
            features TEXT NOT NULL,
            confidence REAL DEFAULT 1.0
        );
        CREATE INDEX IF NOT EXISTS idx_states_timestamp ON states(timestamp DESC);
        CREATE INDEX IF NOT EXISTS idx_states_node ON states(node_id);

        CREATE TABLE IF NOT EXISTS nodes (
            node_id TEXT PRIMARY KEY,
            source_type TEXT,
            last_seen REAL,
            online INTEGER DEFAULT 0
        );
    """)
    conn.commit()
    conn.close()

def save_state(
    timestamp: float,
    node_id: str,
    source_type: str,
    state: str,
    features: Dict[str, Any],
    confidence: float = 1.0
):
    conn = get_conn()
    conn.execute(
        """INSERT INTO states (timestamp, node_id, source_type, state, features, confidence)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (timestamp, node_id, source_type, state, json.dumps(features), confidence)
    )
    conn.execute(
        """INSERT OR REPLACE INTO nodes (node_id, source_type, last_seen, online)
           VALUES (?, ?, ?, 1)""",
        (node_id, source_type, timestamp)
    )
    conn.commit()
    conn.close()

def get_latest_state() -> Optional[Dict[str, Any]]:
    conn = get_conn()
    row = conn.execute(
        "SELECT * FROM states ORDER BY timestamp DESC LIMIT 1"
    ).fetchone()
    conn.close()
    if row:
        return dict(row) | {"features": json.loads(row["features"])}
    return None

def get_history(limit: int = 100, node_id: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_conn()
    if node_id:
        rows = conn.execute(
            "SELECT * FROM states WHERE node_id = ? ORDER BY timestamp DESC LIMIT ?",
            (node_id, limit)
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM states ORDER BY timestamp DESC LIMIT ?",
            (limit,)
        ).fetchall()
    conn.close()
    return [dict(r) | {"features": json.loads(r["features"])} for r in rows]

def get_nodes() -> List[Dict[str, Any]]:
    conn = get_conn()
    rows = conn.execute("SELECT * FROM nodes ORDER BY last_seen DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

