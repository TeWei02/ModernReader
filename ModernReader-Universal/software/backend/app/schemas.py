from pydantic import BaseModel
from typing import Dict


class TangiblePayload(BaseModel):
    led: list[int]
    vibration: int
    servo: int
    label: str

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
    tangible: TangiblePayload

