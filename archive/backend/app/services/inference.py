from typing import Dict, Any, Tuple, Callable


# Rule-based state classifier v1
Condition = Callable[[Dict[str, float]], bool]


def _calm_c1(f: Dict[str, float]) -> bool:
    return f.get("rms", 1.0) < 0.08 and f.get("zcr", 1.0) < 0.08


def _calm_c2(f: Dict[str, float]) -> bool:
    return f.get("temp", 100) < 25 and f.get("light", 10000) > 300


def _calm_c3(f: Dict[str, float]) -> bool:
    return f.get("motion_energy", 1.0) < 0.1


def _alert_c1(f: Dict[str, float]) -> bool:
    return f.get("rms", 0) > 0.2 or f.get("centroid", 0) > 2500


def _alert_c2(f: Dict[str, float]) -> bool:
    return f.get("motion_energy", 0) > 0.4


def _alert_c3(f: Dict[str, float]) -> bool:
    return f.get("edge_density", 0) > 0.5


def _chaotic_c1(f: Dict[str, float]) -> bool:
    return f.get("zcr", 0) > 0.15


def _chaotic_c2(f: Dict[str, float]) -> bool:
    return f.get("rms", 0) > 0.25 and f.get("zcr", 0) > 0.12


def _active_c1(f: Dict[str, float]) -> bool:
    return 0.12 < f.get("rms", 0) <= 0.2


def _active_c2(f: Dict[str, float]) -> bool:
    return f.get("temp", 20) > 30


def _active_c3(f: Dict[str, float]) -> bool:
    return f.get("speed", 0) > 2.0


def _active_c4(f: Dict[str, float]) -> bool:
    return 0.2 <= f.get("motion_energy", 0) <= 0.4


def _curious_c1(f: Dict[str, float]) -> bool:
    return 0.08 <= f.get("rms", 0) <= 0.12


def _curious_c2(f: Dict[str, float]) -> bool:
    return f.get("zcr", 0) > 0.08 and f.get("zcr", 0) <= 0.15


STATE_RULES: Dict[str, Dict[str, Any]] = {
    "calm": {"conditions": [_calm_c1, _calm_c2, _calm_c3], "weight": 1.0},
    "alert": {"conditions": [_alert_c1, _alert_c2, _alert_c3], "weight": 1.0},
    "chaotic": {"conditions": [_chaotic_c1, _chaotic_c2], "weight": 1.0},
    "active": {"conditions": [_active_c1, _active_c2, _active_c3, _active_c4], "weight": 1.0},
    "curious": {"conditions": [_curious_c1, _curious_c2], "weight": 0.8},
}
def classify_state(features: Dict[str, float]) -> Tuple[str, float]:
    """Vote-based classification. Returns (state, confidence)."""
    scores: Dict[str, float] = {name: 0.0 for name in STATE_RULES}

    for state, rule in STATE_RULES.items():
        match_count = sum(1 for cond in rule["conditions"] if cond(features))
        scores[state] = match_count * float(rule.get("weight", 1.0))

    total = sum(scores.values()) or 1.0
    best = max(scores.keys(), key=lambda k: scores[k])
    confidence = scores[best] / total

    # Default to curious if nothing matches strongly
    if scores[best] == 0:
        return "curious", 0.2

    return best, round(confidence, 3)

