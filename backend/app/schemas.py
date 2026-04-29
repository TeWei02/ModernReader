from dataclasses import dataclass, field
from typing import Dict, Optional, List


@dataclass
class SignalPayload:
    node_id: str
    source_type: str
    timestamp: float
    features: Dict[str, float] = field(default_factory=lambda: {})  # type: ignore


@dataclass
class StateResponse:
    state: str
    features: Dict[str, float]
    timestamp: float
    node_id: str
    confidence: Optional[float] = 1.0


@dataclass
class TangibleOutput:
    state: str
    led: List[int] = field(default_factory=lambda: [0, 0, 0])
    vibration: int = 0
    servo: int = 90
    label: str = ""


@dataclass
class HistoryEntry:
    id: int
    timestamp: float
    node_id: str
    state: str
    features: Dict[str, float] = field(default_factory=lambda: {})  # type: ignore


@dataclass
class NodeStatus:
    node_id: str
    online: bool
    last_seen: Optional[float] = None

