import time
from typing import Any

from fastapi import APIRouter, UploadFile, File

from app.db import save_history
from app.schemas import SignalPayload, StateResponse
from app.services.inference import classify_state
from app.services.mapping import map_state_to_tangible
from app.services.state_store import set_latest_state, get_latest_state
from app.utils import extract_audio_features

router = APIRouter(prefix="/api", tags=["signals"])

@router.post("/signals")
async def receive_signal(payload: SignalPayload) -> StateResponse:
    state = classify_state(payload.features)
    current_state = {
        "state": state,
        "features": payload.features,
        "timestamp": payload.timestamp,
        "node_id": payload.node_id,
        "tangible": map_state_to_tangible(state),
    }
    set_latest_state(current_state)
    save_history(state, payload.features, payload.node_id, payload.timestamp)
    # broadcast via events
    from app.routes.events import broadcast_state
    await broadcast_state(current_state)
    return StateResponse(**current_state)

@router.post("/simulate")
async def simulate(payload: SignalPayload) -> StateResponse:
    """Simulate signal for testing."""
    return await receive_signal(payload)


@router.post("/signals/audio-upload")
async def upload_audio(file: UploadFile = File(...)) -> StateResponse:
    audio_bytes = await file.read()
    features = extract_audio_features(audio_bytes)
    payload = SignalPayload(
        node_id="mic-upload",
        source_type="audio",
        timestamp=time.time(),
        features=features,
    )
    return await receive_signal(payload)

@router.get("/history")
async def history(limit: int = 100, node_id: str | None = None) -> list[dict[str, Any]]:
    from app.db import get_history
    return get_history(limit, node_id=node_id)


@router.get("/history/stats")
async def history_stats(limit: int = 300, node_id: str | None = None) -> dict[str, Any]:
    from app.db import get_state_stats
    return get_state_stats(limit=limit, node_id=node_id)


@router.get("/state/latest")
async def latest_state() -> StateResponse:
    return StateResponse(**get_latest_state())

