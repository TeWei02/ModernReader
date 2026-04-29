import yaml
from pathlib import Path
from dataclasses import dataclass
from typing import Any, Dict


@dataclass
class Settings:
    PROJECT_NAME: str = "ModernReader Core"
    VERSION: str = "1.0.0"
    DB_PATH: str = "modernreader.db"
    WS_HEARTBEAT: float = 30.0
    HISTORY_LIMIT: int = 500


settings = Settings()

# Load mapping config
CONFIG_DIR = Path(__file__).parent.parent.parent / "configs"

def load_mapping() -> Dict[str, Any]:
    mapping_path = CONFIG_DIR / "mapping.yaml"
    if mapping_path.exists():
        with open(mapping_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    return {}

def load_nodes() -> Dict[str, Any]:
    nodes_path = CONFIG_DIR / "nodes.yaml"
    if nodes_path.exists():
        with open(nodes_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    return {}

MAPPING = load_mapping()
NODES = load_nodes()

