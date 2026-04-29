# ModernReader Core MVP

ModernReader Core: `Signal -> Meaning -> Tangible Response`

This MVP proves 4 things:

1. The system receives real-world signals.
2. The system converts signals into meaningful states.
3. The system responds with multimodal output.
4. The architecture is extensible for future AR/VR/speculative modules.

## Implemented MVP Modules

1. Signal Input

- Local mic input (via `simulate_client.py --mode mic`)
- Environment context fields (`temp`, `humidity`, `light`) in each payload
- Dedicated environment simulation mode (`simulate_client.py --mode env`)

1. Signal Gateway

- FastAPI backend
- REST: `POST /api/signals`, `GET /api/state/latest`, `GET /api/history`
- WebSocket: `WS /ws`

1. Meaning Engine

- Rule-based state inference:
  - `calm`, `curious`, `active`, `alert`, `chaotic`
- Audio features used:
  - RMS, ZCR, Spectral Centroid

1. Experience Output

- Web dashboard (`frontend/dashboard.html`)
- ESP32 output node firmware (`firmware/esp32_output_node/esp32_output_node.ino`)

1. Mapping Layer

- State-to-tangible mapping in `configs/mapping.yaml`
- Backend loads mapping and returns `tangible` payload in each event

1. Project Story

- Three ready-to-demo scenarios in dashboard buttons:
  - Quiet library
  - Street rush
  - Lab anomaly

## Folder Structure

```text
modernreader-mvp/
├── backend/
│   ├── main.py
│   ├── simulate_client.py
│   ├── run_demo.py
│   ├── research/
│   └── app/
├── frontend/
│   └── dashboard.html
├── firmware/
│   ├── esp32_audio_node/
│   ├── esp32_env_node/
│   └── esp32_output_node/
├── configs/
│   └── mapping.yaml
└── docs/
    ├── hardware.md
    └── mit_level_phase_plan.md
```

## Quick Start

1. Backend setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

1. Open dashboard

- Open `frontend/dashboard.html` in browser.
- It connects to `ws://localhost:8000/ws` and fetches `/api/state/latest`.

1. Simulate signals

```bash
cd backend
python simulate_client.py --mode random
```

or use local microphone:

```bash
cd backend
python simulate_client.py --mode mic
```

or run environment-only simulation:

```bash
cd backend
python simulate_client.py --mode env
```

1. One-click demo run + logs

```bash
cd backend
python run_demo.py
```

- Writes event logs to `backend/demo_logs/demo_events_<run_id>.jsonl`.
- Writes summary stats to `backend/demo_logs/demo_summary_<run_id>.json`.

1. Optional: connect ESP32 output node

- Update Wi-Fi and backend IP in `firmware/esp32_output_node/esp32_output_node.ino`.
- Upload firmware and observe LED/vibration/servo following incoming states.

## API Summary

- `POST /api/signals`
  - Accepts node payload and returns inferred state + tangible mapping.
- `POST /api/simulate`
  - Alias for quick simulation.
- `POST /api/signals/audio-upload`
  - Upload audio file and extract RMS/ZCR/Centroid.
- `GET /api/state/latest`
  - Current inferred state.
- `GET /api/history?limit=100`
  - Recent history stored in SQLite.
- `GET /api/history?limit=100&node_id=env-01`
  - Node-specific history query for debugging audio/env streams.
- `GET /api/history/stats?limit=200`
  - State count and ratio summary for dashboard distribution bars.
- `WS /ws`
  - Broadcasts realtime state events to dashboard/output nodes.

## Example Payloads

Signal input:

```json
{
  "node_id": "audio-node-01",
  "source_type": "audio",
  "timestamp": 1713840000,
  "features": {
    "rms": 0.18,
    "zcr": 0.09,
    "centroid": 2100.4,
    "temp": 29.2,
    "humidity": 62.1,
    "light": 540.0
  }
}
```

Output event:

```json
{
  "state": "alert",
  "features": {
    "rms": 0.26,
    "zcr": 0.12,
    "centroid": 3000.0
  },
  "timestamp": 1713840001,
  "node_id": "audio-node-01",
  "tangible": {
    "led": [255, 100, 0],
    "vibration": 180,
    "servo": 150,
    "label": "alert"
  }
}
```

## MVP+ Sprint 2 Additions

1. Environment node pipeline

- Added `firmware/esp32_env_node/esp32_env_node.ino` for DHT22 + BH1750 uploads.

1. Realtime observability

- Dashboard includes state timeline and environment calibration metrics.

1. Node-level debugging

- Backend history endpoint supports `node_id` filtering.

1. One-click demo automation

- Added `backend/run_demo.py` to run 3 scenarios and archive logs.

## Toward MIT-Level Project

1. Long-term phase plan

- See `docs/mit_level_phase_plan.md`.

1. Dataset export pipeline

```bash
cd backend
python research/export_dataset.py
```

- Exports `datasets/signals_dataset.csv` from `history.db` for baseline ML experiments.

## Next Expansion Path

This MVP can scale to:

1. More signal nodes (vision, datasets, external APIs)
2. Better meaning engine (ML and multimodal fusion)
3. New experience outputs (AR/VR, soundscapes, speculative modules)
4. Agent/memory layers for long-term exploration
