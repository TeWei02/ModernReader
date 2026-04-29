# Project Story (MVP Demo Script)

## Story Goal

Show how an invisible world signal becomes a perceivable interaction.

## Scenario A: Quiet Library

- Inputs: low ambient sound, stable light
- Expected state flow: `calm -> curious -> calm`
- Tangible response:
  - LED: soft cool tone
  - Vibration: off/light
  - Servo: gentle angle

## Scenario B: Street Rush

- Inputs: louder sound, brighter and dynamic environment
- Expected state flow: `active -> alert -> active`
- Tangible response:
  - LED: brighter warm tone
  - Vibration: medium to strong
  - Servo: wider movement

## Scenario C: Lab Anomaly

- Inputs: sudden spectral jump and unstable environment features
- Expected state flow: `curious -> alert -> chaotic`
- Tangible response:
  - LED: aggressive flashing tendency
  - Vibration: pulsed strong pattern
  - Servo: rapid irregular movement

## 90-Second Demo Flow

1. Open dashboard and show websocket connected status.
2. Trigger Scenario A and explain "calm" mapping.
3. Trigger Scenario B and point to state + tangible payload update.
4. Trigger Scenario C and show physical output escalation.
5. Conclude with architecture slide:
   - Signal Nodes -> Gateway -> Meaning -> Mapping -> Output Nodes
