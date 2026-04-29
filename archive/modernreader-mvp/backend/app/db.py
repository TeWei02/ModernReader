import sqlite3
import json
from typing import Any

DB_PATH = 'history.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS states (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp REAL,
            node_id TEXT,
            state TEXT,
            features TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_history(state: str, features: dict[str, Any], node_id: str, timestamp: float) -> None:
    conn = sqlite3.connect(DB_PATH)
    conn.execute('INSERT INTO states (timestamp, node_id, state, features) VALUES (?, ?, ?, ?)',
                 (timestamp, node_id, state, json.dumps(features)))
    conn.commit()
    conn.close()

def get_history(limit: int = 100, node_id: str | None = None) -> list[dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    if node_id:
        cursor = conn.execute(
            'SELECT * FROM states WHERE node_id = ? ORDER BY timestamp DESC LIMIT ?',
            (node_id, limit),
        )
    else:
        cursor = conn.execute('SELECT * FROM states ORDER BY timestamp DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [{'timestamp': r[1], 'node_id': r[2], 'state': r[3], 'features': json.loads(r[4])} for r in rows]


def get_state_stats(limit: int = 300, node_id: str | None = None) -> dict[str, Any]:
    conn = sqlite3.connect(DB_PATH)
    if node_id:
        rows = conn.execute(
            '''
            SELECT state, COUNT(*)
            FROM (
                SELECT state FROM states
                WHERE node_id = ?
                ORDER BY timestamp DESC
                LIMIT ?
            )
            GROUP BY state
            ''',
            (node_id, limit),
        ).fetchall()
    else:
        rows = conn.execute(
            '''
            SELECT state, COUNT(*)
            FROM (
                SELECT state FROM states
                ORDER BY timestamp DESC
                LIMIT ?
            )
            GROUP BY state
            ''',
            (limit,),
        ).fetchall()
    conn.close()

    counts = {row[0]: int(row[1]) for row in rows}
    total = sum(counts.values())
    ratios = {
        state: (count / total if total else 0.0)
        for state, count in counts.items()
    }
    return {
        "counts": counts,
        "ratios": ratios,
        "total": total,
    }

