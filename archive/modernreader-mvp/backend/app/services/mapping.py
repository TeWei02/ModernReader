from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml


DEFAULT_MAPPING: dict[str, dict[str, Any]] = {
    "calm": {"led": [0, 100, 50], "vibration": 0, "servo": 80},
    "curious": {"led": [0, 150, 150], "vibration": 50, "servo": 90},
    "active": {"led": [0, 255, 0], "vibration": 100, "servo": 110},
    "alert": {"led": [255, 100, 0], "vibration": 180, "servo": 150},
    "chaotic": {"led": [128, 0, 128], "vibration": 150, "servo": 40},
}


def _mapping_file_path() -> Path:
    backend_dir = Path(__file__).resolve().parents[2]
    project_root = backend_dir.parent
    return project_root / "configs" / "mapping.yaml"


def load_mapping() -> dict[str, dict[str, Any]]:
    path = _mapping_file_path()
    if not path.exists():
        return DEFAULT_MAPPING

    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}

    states = data.get("states", {})
    if not isinstance(states, dict) or not states:
        return DEFAULT_MAPPING

    return states


def map_state_to_tangible(state: str) -> dict[str, Any]:
    mapping = load_mapping()
    selected = mapping.get(state, mapping.get("curious", DEFAULT_MAPPING["curious"]))
    return {
        "led": selected.get("led", [0, 0, 0]),
        "vibration": int(selected.get("vibration", 0)),
        "servo": int(selected.get("servo", 90)),
        "label": state,
    }
