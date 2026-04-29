# Implementation Plan

## Overview

Refactor prototype to strict MVP structure matching spec: backend server first, dashboard, simulate client, output firmware. Modularize backend into app/ subdirs (main/routes/services/schemas), implement exact APIs (/api/signals POST, /ws, /api/state/latest), rule-based state (5 states), pure HTML/JS dash, ESP32 firmware with hardware mapping. Add SQLite for history, demo scenarios. Proves 4 MVP goals with audio/env sim → state → dash/ESP32.

Current prototype advanced; strip extras (3D/CV/GPS) for MVP purity, prepare INMP441/DHT22 firmware skeletons. No ML, heuristics only.

## Types

Pydantic models centralized in schemas.py.

**SignalPayload (schemas.py)**:

```python
from pydantic import BaseModel
from typing import Dict
from datetime import datetime

class SignalPayload(BaseModel):
    node_id: str
    source_type: str  # 'audio', 'env'
    timestamp: float
    features: Dict[str, float]

class StateResponse(BaseModel):
    state: str  # 'calm', 'curious', 'active', 'alert', 'chaotic'
    features: Dict[str, float]
    timestamp: float
    node_id: str
```

**No other types** - keep MVP simple.

## Files

Restructure backend to spec app/, simplify frontend, add missing.

**New files:**

- `/Users/kedewei/Desktop/modernreader-mvp/backend/app/__init__.py` (empty package)
- `/Users/kedewei/Desktop/modernreader-mvp/backend/app/main.py` (mount routes, serve)
- `/Users/kedewei/Desktop/modernreader-mvp/backend/app/routes/signals.py` ( /api/signals, /api/simulate)
- `/Users/kedewei/Desktop/modernreader-mvp/backend/app/routes/events.py` (/ws, /api/state/latest)
- `/Users/kedewei/Desktop/modernreader-mvp/backend/app/services/inference.py` (classify_state)
- `/Users/kedewei/Desktop/modernreader-mvp/backend/app/schemas.py` (models)
- `/Users/kedewei/Desktop/modernreader-mvp/backend/app/db.py` (SQLite history)
- `/Users/kedewei/Desktop/modernreader-mvp/backend/app/utils.py` (feature extract)
- `/Users/kedewei/Desktop/modernreader-mvp/firmware/esp32_audio_node/esp32_audio_node.ino` (INMP441 sim)
- `/Users/kedewei/Desktop/modernreader-mvp/firmware/esp32_env_node/esp32_env_node.ino` (DHT22/BH1750 sim)

**Modified files:**

- `backend/requirements.txt`: add sqlite3 if needed (std), scikit-learn no for MVP.
- `backend/main.py`: → slim launcher `from app.main import app`
- `frontend/dashboard.html`: pure HTML/JS, charts only, no 3D/CV.
- `firmware/esp32_output_node/esp32_output_node.ino`: load mapping.yaml? No Arduino, hardcode + exact pins.
- `README.md`: add quickstart, 2-3 scenarios (quiet room→calm LED slow, loud→chaotic vib).
- `configs/mapping.yaml`: loadable in services.
- `TODO.md`: update to Phase 2+.

**No deletions.**

**Config:** mapping.yaml expand with spec table.

## Functions

Modularize to services/routes.

**New functions:**

- `extract_audio_features(raw_audio)` (utils.py): librosa rms/zcr/centroid.
- `classify_state(features)` (inference.py): rules as spec.
- `save_history(state)` (db.py): SQLite insert.
- `get_history(node_id)` (db.py): query last 100.

**Modified:**

- `receive_signal(payload)` (routes/signals.py): call inference/save/broadcast.
- `websocket_endpoint` (routes/events.py): handle /ws.
- `broadcast_state()` (routes/events.py): json dump.

**No removals.**

## Classes

**No classes** - MVP procedural/services.

## Dependencies

No new; existing perfect (librosa, fastapi). SQLite stdlib.

## Testing

Manual: curl sim audio/env → dash state → WS sniff. Hardware: serial monitor ESP32 states.

New `tests/test_inference.py`: pytest unit rules, mock features.

## Implementation Order

Modular refactor first, test core loop, firmware/hardware prep.

1. Create backend/app/ subdirs/files skeleton.
2. Move logic to services/schemas/routes.
3. Add db/history.
4. Simplify dashboard to charts/sim buttons.
5. Update firmware with spec pins/mapping.
6. Enhance README/demo stories.
7. Test full loop, update TODO.
