import argparse
import json
import time
import urllib.request

import librosa
import numpy as np
import sounddevice as sd


def post_signal(base_url: str, payload: dict) -> None:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{base_url}/api/signals",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        print(resp.read().decode("utf-8"))


def extract_audio_features(samples: np.ndarray, sr: int) -> dict[str, float]:
    rms = float(np.sqrt(np.mean(np.square(samples))))
    zcr = float(librosa.feature.zero_crossing_rate(y=samples).mean())
    centroid = float(librosa.feature.spectral_centroid(y=samples, sr=sr).mean())
    return {"rms": rms, "zcr": zcr, "centroid": centroid}


def random_mode(base_url: str, interval: float) -> None:
    print("Random mode started. Press Ctrl+C to stop.")
    while True:
        features = {
            "rms": float(np.random.uniform(0.03, 0.35)),
            "zcr": float(np.random.uniform(0.02, 0.24)),
            "centroid": float(np.random.uniform(700, 3700)),
            "temp": float(np.random.uniform(23, 34)),
            "humidity": float(np.random.uniform(45, 88)),
            "light": float(np.random.uniform(180, 980)),
        }
        payload = {
            "node_id": "sim-random-node",
            "source_type": "audio_env",
            "timestamp": time.time(),
            "features": features,
        }
        post_signal(base_url, payload)
        time.sleep(interval)


def env_mode(base_url: str, interval: float) -> None:
    print("Env mode started. Press Ctrl+C to stop.")
    while True:
        features = {
            "temp": float(np.random.uniform(22, 35)),
            "humidity": float(np.random.uniform(42, 90)),
            "light": float(np.random.uniform(120, 1050)),
            # Keep minimal audio baseline to avoid always defaulting to calm.
            "rms": float(np.random.uniform(0.04, 0.16)),
            "zcr": float(np.random.uniform(0.03, 0.11)),
            "centroid": float(np.random.uniform(800, 2200)),
        }
        payload = {
            "node_id": "sim-env-node",
            "source_type": "env",
            "timestamp": time.time(),
            "features": features,
        }
        post_signal(base_url, payload)
        time.sleep(interval)


def mic_mode(base_url: str, interval: float, sample_rate: int, seconds: float) -> None:
    print("Mic mode started. Press Ctrl+C to stop.")
    while True:
        samples = sd.rec(int(sample_rate * seconds), samplerate=sample_rate, channels=1, dtype="float32")
        sd.wait()
        mono = np.asarray(samples).flatten()
        features = extract_audio_features(mono, sample_rate)
        features.update(
            {
                "temp": float(np.random.uniform(24, 31)),
                "humidity": float(np.random.uniform(48, 78)),
                "light": float(np.random.uniform(220, 930)),
            }
        )

        payload = {
            "node_id": "local-mic-node",
            "source_type": "audio",
            "timestamp": time.time(),
            "features": features,
        }
        post_signal(base_url, payload)
        time.sleep(interval)


def main() -> None:
    parser = argparse.ArgumentParser(description="ModernReader MVP signal simulator")
    parser.add_argument("--base-url", default="http://localhost:8000")
    parser.add_argument("--mode", choices=["random", "mic", "env"], default="random")
    parser.add_argument("--interval", type=float, default=1.5)
    parser.add_argument("--sample-rate", type=int, default=16000)
    parser.add_argument("--seconds", type=float, default=1.0)
    args = parser.parse_args()

    if args.mode == "mic":
        mic_mode(args.base_url, args.interval, args.sample_rate, args.seconds)
    elif args.mode == "env":
        env_mode(args.base_url, args.interval)
    else:
        random_mode(args.base_url, args.interval)


if __name__ == "__main__":
    main()
