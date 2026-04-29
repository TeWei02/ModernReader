from typing import Dict

def classify_state(features: Dict[str, float]) -> str:
    """Rule-based MVP state classification for audio + environment signals."""
    rms = features.get('rms', 0.0)
    zcr = features.get('zcr', 0.0)
    centroid = features.get('centroid', 0.0)

    temp = features.get('temp', 25.0)
    humidity = features.get('humidity', 55.0)
    light = features.get('light', 350.0)

    if zcr > 0.2 or rms > 0.32:
        return 'chaotic'
    if centroid > 2800 or rms > 0.24 or light > 900:
        return 'alert'
    if rms > 0.14 or temp > 30 or humidity > 80:
        return 'active'
    if rms < 0.08 and zcr < 0.08:
        return 'calm'
    return 'curious'



