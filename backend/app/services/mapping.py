from typing import Dict, Any
from ..config import MAPPING


def get_tangible_output(state: str) -> Dict[str, Any]:
    """Map state to LED/vibration/servo values from config."""
    if not MAPPING or "states" not in MAPPING:
        # Fallback defaults
        defaults = {
            "calm": {"led": [0, 100, 50], "vibration": 0, "servo": 80, "label": "peace"},
            "curious": {"led": [0, 150, 150], "vibration": 50, "servo": 90, "label": "wonder"},
            "active": {"led": [0, 255, 0], "vibration": 100, "servo": 110, "label": "energy"},
            "alert": {"led": [255, 100, 0], "vibration": 180, "servo": 150, "label": "warning"},
            "chaotic": {"led": [128, 0, 128], "vibration": 150, "servo": 40, "label": "storm"},
        }
        return defaults.get(state, defaults["calm"])
    
    return MAPPING["states"].get(state, {"led": [0,0,0], "vibration": 0, "servo": 90, "label": "unknown"})

