from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from typing import List
import json

router = APIRouter(tags=["events"])

connected_clients: List[WebSocket] = []

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in connected_clients:
            connected_clients.remove(websocket)

async def broadcast_state(state_dict: dict):
    state_json = json.dumps(state_dict)
    disconnected = []
    for client in connected_clients:
        try:
            await client.send_text(state_json)
        except Exception:
            disconnected.append(client)
    for client in disconnected:
        if client in connected_clients:
            connected_clients.remove(client)

