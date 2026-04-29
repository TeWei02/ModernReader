import io
import librosa
import numpy as np
from typing import Any

def extract_audio_features(audio_data: bytes, sr: int = 22050) -> dict[str, float]:
    """Extract MVP audio features: RMS, ZCR, Spectral Centroid."""
    y, _ = librosa.load(io.BytesIO(audio_data), sr=sr)
    return {
        'rms': float(np.mean(librosa.feature.rms(y=y))),
        'zcr': float(librosa.feature.zero_crossing_rate(y).mean()),
        'centroid': float(librosa.feature.spectral_centroid(y=y, sr=sr).mean())
    }

def extract_env_features(raw_data: dict[str, Any]) -> dict[str, float]:
    """Normalize environment features from DHT22/BH1750 style inputs."""
    # Placeholder for real sensor
    return {
        'temp': float(raw_data.get('temp', 22.0)),
        'humidity': float(raw_data.get('humidity', 50.0)),
        'light': float(raw_data.get('light', 500.0))
    }

