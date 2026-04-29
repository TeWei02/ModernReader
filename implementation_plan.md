# ModernReader — 最終版實作計畫

此文件針對你要求的「最終版」設計（不使用現成開發板或預訓練模型/公開資料集），提供從需求、驗收、系統架構、硬體平台、資料採集、模型訓練、韌體到部署的可執行實作步驟。

**前提條件**

- 不使用現成開發板（例如 ESP32/Raspberry Pi 等整板開發套件）。允許使用晶片/模組元件（SoC、Wi‑Fi 模組或 NPU 模組）但需在自訂電路板上整合。
- 不使用預訓練模型或公開資料集：所有訓練資料需自行蒐集、標註並從頭訓練模型。

--

**一、目標與驗收標準（Acceptance Criteria）**

- 目標：建立一個可擴充的 ModernReader 平台，能把真實世界多模態訊號（至少：音訊 + 環境感測）轉成語意狀態，並驅動至少一個具體實體輸出（LED / haptic / servo）與即時可視化。
- 驗收條件（最終版）：
 1. 可以連續蒐集真實感測資料並儲存（時序資料與原始 wave/sensor logs）。
 2. 從頭訓練出的模型能以 > baseline 精度分類出預定 state（calm/curious/active/alert/chaotic），並在真實輸入上穩定推論。
 3. 後端能即時廣播 state（WebSocket），前端 dashboard 可視化並同步更新；至少一個自製 output node 能即時反應。
 4. 系統整體設計允許未來接入更高階模組（聲景合成、AR、agent 層等）。

--

**二、高階系統架構（概念）**
Signal Nodes (custom PCBs with sensor front-ends) -> Network Gateway (secure transport) -> Core Compute (Meaning Engine: feature extraction + models) -> Mapping Layer -> Experience Engine (dashboard + output nodes)

各層重點：

- Signal Nodes：自訂 PCB，負責感測、前處理、打包 JSON 並用安全通道送到 Core（可用 Wi‑Fi 模組或有線以太網模組，非整板 devkit）。
- Gateway / Core：高性能 SoC 或 NPU 模組（例如 Jetson 系列模組或其他商用 NPU module），負責大量即時特徵運算與模型推論。
- Storage：時序 DB（InfluxDB 或 SQLite 起步），向量索引（Milvus / FAISS）供未來檢索使用。
- Orchestration：事件匯流可用 Kafka / Redis Streams（大型系統）或簡化的內部事件總線。

--

**三、硬體平台設計（要點與 BOM）**
設計原則：模組化、可維修、供電穩定、同步時序精準。

建議元件（範例 BOM，非 devboard）：

- 主處理模組（Core Compute，用於訓練/推論）：
 	- 選項 A（推論 +開發）：NVIDIA Jetson Orin NX/AGX module（直接使用 module，但需自製 carrier board）
 	- 選項 B（輕量推論）：NPU 模組（例如 Google Coral Edge TPU module 或其他商用 NPU module）搭配自製 carrier
- 感測前端（Signal Node PCB）：
 	- 高品質 MEMS 麥克風 IC（例：ICS‑43434 / SPH0645LM4H）
 	- 模擬/數位光感（TSL2591 / BH1750）
 	- 溫濕氣體感測（BME680 或 SHT4x）
 	- IMU（LSM6DS3 或 BNO055）
 	- ADC / I2S 解碼器、抗混訊濾波、麥克風電源濾波
 	- Wi‑Fi 無線通訊模組芯片（例如 Murata 或其他模組晶片，自己焊上 PCB，避免使用開發板）或有線以太網 PHY
- Output Node（自製 PCB）：
 	- WS2812 / NeoPixel 或 MOSFET 驅動 RGB LED
 	- Haptic driver（DRV2605L）
 	- Servo 驅動（PCA9685 或直接 PWM MOSFET 驅動，外部 5V 電源）

電源與供電規劃：

- 中央 5V/12V 電源供應，對於伺服/馬達使用獨立電源且共地。
- 使用 LDO 與 DC‑DC（降壓）確保數位/類比分區隔離，加入 ferrite 與 LC 濾波以降低噪訊。

PCB 設計要點：

- 麥克風附近避免大電流回路，給類比地 GND plane 並分割數位地。
- 若有 Wi‑Fi，要考慮天線布局與 EMC。

--

**四、資料採集與標註（從零開始）**
資料是最關鍵的資源。流程：

1. 建立資料規格：採樣率（音訊 16/24/48 kHz）、切片長度（0.5–2s）、欄位（node_id, timestamp, raw_wave, features, sensor_values, label）
2. 建立錄製設備：在實驗室與野外情境錄製多通道原始 wave 與同步感測器數據（光照、溫度、IMU）—每個情境至少數小時資料。
3. 標註工具：輕量 web 工具（前端 + 後端）讓標註者聽音、看 sensor timeline，標註 state 與事件（可用 Flask/FastAPI +簡單前端）。
4. 標註規範：定義每個 state 定義與範例，確保標註一致性。
5. 資料擴增：時間軸切片、加噪、pitch shift、time-stretch（音訊），模擬不同 sensor drift。

儲存：原始 wave 與同步 sensor 存到可查詢儲存（NFS 或 object store），index metadata 放時序 DB。

--

**五、Model 與訓練（從頭訓練）**
策略：分段式建構，先做單模（audio-only）baseline，再做 multimodal fusion。

模型候選（從零開始）：

- Audio frontend：短時間傅立葉 (STFT) → Spectrogram → 2D CNN（ResNet 複小型架構）
- Time-series sensors：小型 1D CNN / Transformer 或 LSTM
- Fusion：late-fusion（各自 embed 後 concat → MLP），之後可做 cross-attention fusion

訓練流程：

1. Preprocess：產生 log‑mel spectrogram、标准化、切片與 label。
2. Training infra：PyTorch，使用多 GPU（若無則租用雲 GPU）訓練，寫好 reproducible pipeline（config、seed、checkpoint）。
3. Metrics：accuracy、F1、confusion matrix、calibration（confidence）與 latency（推論延遲）。
4. Model export：訓練完成後匯出 ONNX / TorchScript，並做量化（INT8）以便部署在 NPU/Edge。

注意：所有模型與資料都需版本管理（使用 DVC 或 Git LFS + metadata）。

--

**六、韌體與低層驅動**
設計理念：Signal Node 與 Output Node 採用輕量 RTOS（FreeRTOS）實現感測、前處理、穩定通訊與容錯重試。核心計算部署在 Core Compute 模組。

要點：

- I2S / PDM 驅動：直接使用 MEMS 麥克風 IC 與 MCU 的 I2S 硬體，或外接音頻 CODEC。
- 精確時間對齊（timestamps）：使用 RTC 或 PTP（若有以太網）。
- 通訊安全性：TLS 或 DTLS，token-based 認證。

輸出節點驅動：PWM / servo 驅動、I2C 控制 PCA9685、HAPTIC via I2C DRV2605L，驅動模組要有過流保護。

--

**七、後端、API 與 Dashboard**
後端建議採用 FastAPI + Uvicorn，事件系統可先用 Redis Pub/Sub 簡化實作。

必備 API：

- POST `/api/signals`（接收節點送來的原始與前處理資料）
- GET `/api/state/latest`（回傳最新推論狀態）
- WS `/ws/events`（廣播 state 與 timeline event）

Dashboard（前端）：純 HTML/JS 起步，使用 WebSocket 接收實時事件，顯示 spectrogram、state、confidence 與簡單控制面板。

--

**八、Mapping Layer 與 Experience Engine**
Mapping 應為可配置的 YAML / JSON，將 `state` map 為 tangible payload（led color, vibration pattern, servo angle, audio cue）。

Experience Engine 支援多通路輸出（dashboard, output nodes, audio）並實作 priority/decay 與多節點協調。

--

**九、整合測試、驗證與 demo**
測試分類器在真實錄音/感測下的穩定性、延遲（端到端目標 < 200–500 ms 視硬體而定）、與 mapping 的可辨識性。示範腳本應包含 2–3 個情境故事（scenario），錄製影片並附上解說。

--

**十、執行順序建議（第一階段到第三階段）**
Phase 0（規劃）：產出此文件、確認元件清單、資料標註規範、建立 repo 與版控策略。
Phase 1（核心系統）：自製 Signal Node PCB v0（感測 + Wi‑Fi module）、Core Compute carrier + module、基本後端 API、資料錄製/標註工具、baseline audio model 訓練與部署到 Core。
Phase 2（擴充）：Output Node PCB、mapping 引擎、dashboard 改良、更多資料、multimodal fusion。
Phase 3（成品化）：PCBs 精修、外殼、量產準備、完整 demo 與文件。

--

**下一步（我可以立刻幫你做）**

1. 產出第一版的 System Spec（包含 `signals` payload schema、mapping.yaml 例子、API contract）。
2. 或者我可以直接產出 Signal Node 與 Output Node 的 reference schematic（原理圖草案）與元件清單（BOM）。

請選一項讓我開始：

- 回覆「spec」→ 我立刻建立 API 與 payload schema、`mapping.yaml` 範例與 repo 檔案藍圖。
- 回覆「hw」→ 我立刻產出 reference schematic 與 BOM（可用 KiCad 格式草稿，並列出關鍵接腳與 layout 注意事項）。

# ModernReader MVP Full-Stack Implementation Plan

## Overview

Build professional full-stack MVP proving 4 core goals: real signal input → state inference → multi-modal response → scalable architecture. Restructure to exact spec layout: backend/app/ (routes/services), frontend/ Vite React app (Dashboard/History pages), firmware/ ESP32 nodes.

Current state: backend modular but incomplete imports/CV, static HTML frontend. Refactor backend fixes, replace frontend with React Vite (live mic/camera/GPS → real-time charts/3D), add sqlite history, hardware firmware pins/mapping.yaml.

High-level: FastAPI gateway collects signals (mic/env/vision sim), inference rules → state → React dashboard + WS to ESP32 outputs (LED/vib/servo). 2-3 demos: quiet→calm, motion→alert, noise→chaotic.

## Types

Pydantic models (schemas.py):

- SignalPayload: node_id str, source_type enum('audio'|'env'|'vision'), timestamp float, features Dict[str,float]
- State: state enum('calm'|'curious'|'active'|'alert'|'chaotic'), confidence float 0-1
- Tangible: state, led [int;3], vibration int(0-255), servo int(0-180)
- HistoryEntry: id, timestamp, node_id, state, features JSON

React types (src/types.ts): Signal, State, History[].

## Files

**New:**

- backend/app/routers/**init**.py
- backend/app/services/audio.py (librosa live mic)
- backend/app/routers/health.py (/health, /nodes)
- frontend/package.json (Vite React)
