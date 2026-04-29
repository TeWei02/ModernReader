# ModernReader MVP TODO

## Phase 1: Core Software (Backend + Dashboard) ✅

- [x] Create project structure
- [x] Backend FastAPI + WS + classifier
- [x] Requirements + deps install
- [x] Dashboard HTML/JS
- [x] Fix imports/server start
- [x] Test: open dashboard, send sim signal, see state change
- [x] Add /api/simulate POST for easy testing

## Phase 2: Output Node Firmware

- [ ] Install Arduino IDE + ESP32 board + libs (ArduinoJson, ESP32Servo)
- [ ] Update WiFi/server IP in .ino
- [ ] Compile/upload to ESP32
- [ ] Test WS connection + actuators

## Phase 3: Hardware

- [ ] Wire LED/vib/servo to ESP32
- [ ] Test physical response

## Phase 4: Real Inputs

- [ ] ESP32 audio node (INMP441)
- [ ] Env sensor node (DHT22/BH1750)
- [ ] Mic simulate with sounddevice

## Phase 5: Polish + Demo

- [ ] SQLite history
- [ ] Spectrogram viz
- [ ] Video demo scenarios
- [ ] Full README + future vision

Current progress: Backend running, dashboard ready.
