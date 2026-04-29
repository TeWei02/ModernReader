import csv
import json
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[1] / "history.db"
OUT_DIR = Path(__file__).resolve().parents[2] / "datasets"
OUT_FILE = OUT_DIR / "signals_dataset.csv"

FEATURE_COLUMNS = [
    "rms",
    "zcr",
    "centroid",
    "temp",
    "humidity",
    "light",
]


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(str(DB_PATH))
    rows = conn.execute(
        "SELECT timestamp, node_id, state, features FROM states ORDER BY timestamp ASC"
    ).fetchall()
    conn.close()

    headers = ["timestamp", "node_id", "state", *FEATURE_COLUMNS]

    with OUT_FILE.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()

        for timestamp, node_id, state, features_json in rows:
            features = json.loads(features_json or "{}")
            record = {
                "timestamp": timestamp,
                "node_id": node_id,
                "state": state,
            }
            for col in FEATURE_COLUMNS:
                value = features.get(col)
                record[col] = "" if value is None else value
            writer.writerow(record)

    print(f"Exported {len(rows)} rows -> {OUT_FILE}")


if __name__ == "__main__":
    main()
