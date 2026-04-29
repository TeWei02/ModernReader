import json
import time
import urllib.request
from pathlib import Path
from typing import Any

BASE_URL = "http://localhost:8000"

STATE_PRESETS = {
    "calm": {"rms": 0.05, "zcr": 0.03, "centroid": 1000, "temp": 24, "humidity": 55, "light": 300},
    "curious": {"rms": 0.10, "zcr": 0.08, "centroid": 1700, "temp": 26, "humidity": 58, "light": 420},
    "active": {"rms": 0.16, "zcr": 0.10, "centroid": 2100, "temp": 31, "humidity": 70, "light": 600},
    "alert": {"rms": 0.25, "zcr": 0.13, "centroid": 3000, "temp": 29, "humidity": 65, "light": 980},
    "chaotic": {"rms": 0.34, "zcr": 0.23, "centroid": 3600, "temp": 33, "humidity": 86, "light": 800},
}

SCENARIOS = {
    "scenario_a_quiet_library": ["calm", "curious", "calm"],
    "scenario_b_street_rush": ["active", "alert", "active"],
    "scenario_c_lab_anomaly": ["curious", "alert", "chaotic"],
}


def post_json(path: str, payload: dict[str, Any]) -> dict[str, Any]:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=8) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_json(path: str) -> dict[str, Any]:
    with urllib.request.urlopen(f"{BASE_URL}{path}", timeout=8) as resp:
        return json.loads(resp.read().decode("utf-8"))


def send_state(state: str, node_id: str) -> dict[str, Any]:
    payload = {
        "node_id": node_id,
        "source_type": "demo-runner",
        "timestamp": time.time(),
        "features": STATE_PRESETS[state],
    }
    return post_json("/api/signals", payload)


def run() -> None:
    out_dir = Path("demo_logs")
    out_dir.mkdir(parents=True, exist_ok=True)
    run_id = int(time.time())
    events_path = out_dir / f"demo_events_{run_id}.jsonl"
    summary_path = out_dir / f"demo_summary_{run_id}.json"

    print("Starting one-click demo run...")
    all_events: list[dict[str, Any]] = []

    for scenario_name, states in SCENARIOS.items():
        print(f"Running {scenario_name}...")
        for state in states:
            result = send_state(state, node_id=f"demo-{scenario_name}")
            result["scenario"] = scenario_name
            all_events.append(result)
            with events_path.open("a", encoding="utf-8") as f:
                f.write(json.dumps(result, ensure_ascii=True) + "\n")
            time.sleep(1.0)

    stats = get_json("/api/history/stats?limit=200")

    summary = {
        "run_id": run_id,
        "events_count": len(all_events),
        "scenarios": list(SCENARIOS.keys()),
        "state_stats": stats,
        "events_file": str(events_path),
    }
    summary_path.write_text(json.dumps(summary, ensure_ascii=True, indent=2), encoding="utf-8")

    print("Demo run complete.")
    print(f"Events: {events_path}")
    print(f"Summary: {summary_path}")


if __name__ == "__main__":
    run()
