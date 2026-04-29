from __future__ import annotations

from typing import Any

LATEST_STATE: dict[str, Any] = {
    "state": "calm",
    "features": {},
    "timestamp": 0.0,
    "node_id": "system",
    "tangible": {
        "led": [0, 100, 50],
        "vibration": 0,
        "servo": 80,
        "label": "calm",
    },
}


def set_latest_state(state: dict[str, Any]) -> None:
    global LATEST_STATE
    LATEST_STATE = state


def get_latest_state() -> dict[str, Any]:
    return LATEST_STATE
