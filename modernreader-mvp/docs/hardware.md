# ModernReader MVP Hardware Guide

## Minimum BOM

- ESP32 DevKit x2 (one input, one output)
- INMP441 x1
- DHT22 or BH1750 x1
- LED or WS2812 x1
- Vibration motor x1
- SG90 servo x1
- NPN transistor or MOSFET x1
- Flyback diode x1
- External 5V power supply
- Breadboard + wires

## Node Split Recommendation

1. Audio Node

- ESP32 + INMP441
- Sends signal features to backend

1. Environment Node

- ESP32 + DHT22/BH1750
- Sends context features (`temp`, `humidity`, `light`)

1. Output Node

- ESP32 + LED + vibration + servo
- Subscribes to `WS /ws` and executes tangible mapping

## INMP441 -> ESP32 (Common Mapping)

- `VDD -> 3.3V`
- `GND -> GND`
- `SCK -> GPIO26`
- `WS -> GPIO22`
- `SD -> GPIO21`
- `L/R -> GND` (select one channel)

Note: ESP32 I2S pins are remappable. Keep firmware pin config and wiring consistent.

## Output Node Wiring

### SG90 Servo

- `Signal -> GPIO19`
- `Red -> external 5V`
- `Brown -> GND`

Use external 5V for servo. Do not power servo directly from ESP32 3.3V.

### Vibration Motor

- ESP32 pin drives transistor/MOSFET gate/base
- Motor power from external 5V
- Add flyback diode across motor terminals

Do not connect motor directly to ESP32 GPIO.

### LED / WS2812

- Data pin -> one digital GPIO (default firmware uses GPIO2)
- If WS2812 uses external 5V, keep common GND with ESP32

## Grounding Rule

All grounds must be common:

- ESP32 GND
- External 5V GND
- Servo GND
- Motor driver GND

Without common ground, PWM and control signals are unstable.

## Firmware Notes

- `firmware/esp32_output_node/esp32_output_node.ino`
  - update `ssid`, `password`, `websocket_server`, `websocket_port`
  - listens on `ws://<server>:8000/ws`
- `firmware/esp32_audio_node/esp32_audio_node.ino`
  - update Wi-Fi and backend host settings before upload
- `firmware/esp32_env_node/esp32_env_node.ino`
  - update Wi-Fi and backend host settings before upload
  - default pins: `DHT22 -> GPIO4`, `BH1750 -> I2C (SDA/SCL)`
  - sends `temp/humidity/light` to `POST /api/signals`

## Demo Checklist

1. Backend is running and reachable from ESP32 network.
2. Dashboard receives realtime state updates.
3. ESP32 output node receives WS events.
4. LED/vibration/servo respond to state changes.
5. At least one real signal source drives state transitions.
