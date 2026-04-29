# ModernReader Universal: The Open Source World Interface

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hardware: CERN OHL](https://img.shields.io/badge/Hardware-CERN_OHL-blue.svg)](https://ohwr.org/)
[![Build Status](https://github.com/ModernReader/Universal/workflows/CI/badge.svg)](https://github.com/ModernReader/Universal/actions)
[![Discord](https://img.shields.io/discord/123456789?label=Community&logo=discord)](https://discord.gg/modernreader)

**讓任何人都能建造「讀懂世界」的介面系統**

ModernReader Universal 是一個完全開源的萬用介面平台，讓你能：
- 🎙️ **接收**來自生物、環境、物質的訊號
- 🧠 **理解**這些訊號背後的狀態與模式
- 💡 **回應**以多模態體驗（視覺、觸覺、聲音、動作）
- 🌐 **連接**到全球社群共享的模式庫

這不是產品，這是一場運動。我們相信「讀懂世界」的能力不該被大公司壟斷。

---

## 🚀 快速開始

### 選項 A: 軟體模擬版 (5 分鐘)
不需要硬體！先用電腦麥克風體驗核心功能。

```bash
# 1. 克隆專案
git clone https://github.com/ModernReader/Universal.git
cd ModernReader-Universal/software/backend

# 2. 安裝依賴
pip install -r requirements.txt

# 3. 啟動伺服器
python main.py

# 4. 開啟瀏覽器
open http://localhost:8000/dashboard
```

### 選項 B: 完整硬體版 (2-4 小時)
組裝自己的實體節點，感受真實世界的脈動。

#### 所需材料 (總成本 < $50 USD)
| 元件 | 數量 | 單價 | 總價 | 購買連結建議 |
|------|------|------|------|-------------|
| ESP32 DevKit v1 | 2 | $6 | $12 | [AliExpress](https://aliexpress.com) |
| INMP441 麥克風 | 1 | $3 | $3 | [AliExpress](https://aliexpress.com) |
| DHT22 溫濕度 | 1 | $2 | $2 | [AliExpress](https://aliexpress.com) |
| WS2812B RGB LED | 5 | $0.5 | $2.5 | [AliExpress](https://aliexpress.com) |
| SG90 伺服馬達 | 1 | $2 | $2 | [AliExpress](https://aliexpress.com) |
| 震動馬達 | 1 | $1 | $1 | [AliExpress](https://aliexpress.com) |
| 麵包板 + 杜邦線 | 1 | $5 | $5 | 本地電子店 |
| NPN 電晶體 (2N2222) | 2 | $0.1 | $0.2 | 本地電子店 |
| 外部 5V 電源 | 1 | $5 | $5 | 本地電子店 |
| **總計** | | | **~$32.7** | |

#### 組裝步驟
詳見 [硬體組裝指南](docs/assembly/hardware-build.md)

---

## 🏗️ 系統架構

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Signal Nodes   │────▶│  Signal Gateway  │────▶│  Meaning Engine │
│                 │     │                  │     │                 │
│ • Audio (I2S)   │     │ • FastAPI        │     │ • Feature Ext.  │
│ • Environment   │     │ • WebSocket      │     │ • State Class.  │
│ • Vision        │     │ • REST API       │     │ • Pattern Detect│
│ • External API  │     │ • Message Queue  │     │ • Semantica Lang│
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Output Nodes   │◀────│ Experience Engine│◀────│ Mapping Layer   │
│                 │     │                  │     │                 │
│ • LED / Display │     │ • Dashboard      │     │ • State→Action  │
│ • Haptic        │     │ • Podcast Gen    │     │ • Multimodal    │
│ • Servo/Robot   │     │ • AR/VR Scene    │     │ • Configurable  │
│ • Speaker       │     │ • Physical Node  │     │ • Semantica Rules│
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 核心模組

#### 1. Signal Nodes (訊號節點)
- **Audio Node**: ESP32 + INMP441 I2S 麥克風
- **Environment Node**: ESP32 + DHT22/BH1750
- **Software Client**: Python 模擬器，使用電腦麥克風

#### 2. Signal Gateway (訊號閘道)
- FastAPI 後端
- WebSocket 即時推送
- RESTful API 歷史查詢
- SQLite/PostgreSQL 儲存

#### 3. Meaning Engine (意義引擎)
- 音訊特徵萃取 (RMS, ZCR, Spectral Centroid, MFCC)
- 規則式狀態分類 (v1)
- 機器學習分類器 (v2, 可選)
- **Semantica 語言**: 通用語義表示法

#### 4. Experience Engine (體驗引擎)
- Web Dashboard (HTML/JS)
- CLI 工具
- Podcast 生成器 (未來)
- AR/VR 整合 (未來)

#### 5. Output Nodes (輸出節點)
- ESP32 控制 LED、震動、伺服馬達
- 支援 WS2812B 燈條
- 可擴充至更多致動器

---

## 📂 專案結構

```
ModernReader-Universal/
├── hardware/
│   ├── pcb/                  # KiCad PCB 設計檔案
│   │   ├── audio_node.kicad_pcb
│   │   ├── env_node.kicad_pcb
│   │   └── output_node.kicad_pcb
│   ├── enclosure/            # 3D 列印外殼設計
│   │   ├── node_case.stl
│   │   └── mount_bracket.stl
│   └── bom/                  # 物料清單
│       └── complete_bom.csv
│
├── firmware/
│   ├── core/                 # 共用函式庫
│   │   ├── websocket_client.cpp
│   │   └── sensor_utils.cpp
│   ├── audio_node/           # 音訊節點韌體
│   │   └── audio_node.ino
│   ├── env_node/             # 環境節點韌體
│   │   └── env_node.ino
│   └── output_node/          # 輸出節點韌體
│       └── output_node.ino
│
├── software/
│   ├── backend/              # Python FastAPI 後端
│   │   ├── main.py
│   │   ├── inference.py
│   │   ├── schemas.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── frontend/             # Web Dashboard
│   │   ├── dashboard.html
│   │   ├── styles.css
│   │   └── app.js
│   └── cli/                  # 命令列工具
│       └── modernreader-cli.py
│
├── docs/
│   ├── assembly/             # 組裝指南
│   │   ├── hardware-build.md
│   │   └── wiring-diagrams.md
│   ├── contribution/         # 貢獻指南
│   │   ├── how-to-contribute.md
│   │   └── code-of-conduct.md
│   └── theory/               # 理論基礎
│       ├── semantica-spec.md
│       └── state-machine.md
│
├── examples/
│   ├── basic/                # 基礎範例
│   │   ├── mic_to_led/
│   │   └── temp_to_vibration/
│   └── advanced/             # 進階範例
│       ├── multi_node_sync/
│       └── custom_classifier/
│
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfile.backend
│
├── LICENSE                   # MIT License
├── README.md                 # 本檔案
└── ROADMAP.md                # 發展路線圖
```

---

## 🔧 技術規格

### 後端 (Backend)
- **語言**: Python 3.9+
- **框架**: FastAPI + Uvicorn
- **資料庫**: SQLite (預設) / PostgreSQL (可選)
- **即時通訊**: WebSocket
- **AI/ML**: librosa, scikit-learn, numpy

### 韌體 (Firmware)
- **平台**: ESP32 (Arduino Framework)
- **通訊**: WiFi + WebSocket
- **感測器介面**: I2S, I2C, GPIO
- **致動器控制**: PWM, LEDC

### 前端 (Frontend)
- **技術**: 純 HTML/CSS/JavaScript (無框架依賴)
- **視覺化**: Chart.js / Plotly
- **即時更新**: WebSocket

### 硬體 (Hardware)
- **MCU**: ESP32-WROOM-32
- **麥克風**: INMP441 (I2S)
- **環境感測**: DHT22, BH1750
- **輸出**: WS2812B, SG90, 震動馬達
- **PCB**: 2 層板，CERN OHL 授權

---

## 🌍 社群與貢獻

我們歡迎所有形式的貢獻！

### 你可以貢獻：
- 🔌 **硬體設計**: 改進 PCB、設計新外殼
- 💻 **軟體開發**: 新功能、Bug 修復、效能優化
- 📚 **文件**: 翻譯、教學、範例
- 🧪 **研究**: 新的分類演算法、應用案例
- 🎨 **設計**: UI/UX 改進、品牌資產

### 開始貢獻
1. 閱讀 [貢獻指南](docs/contribution/how-to-contribute.md)
2. Fork 專案
3. 建立你的分支 (`git checkout -b feature/AmazingFeature`)
4. 提交變更 (`git commit -m 'Add AmazingFeature'`)
5. 推送到分支 (`git push origin feature/AmazingFeature`)
6. 開啟 Pull Request

### 行為準則
請參閱 [行為準則](docs/contribution/code-of-conduct.md)，我們致力於提供友善、包容的社群環境。

---

## 📜 授權條款

- **軟體**: [MIT License](LICENSE) - 自由使用、修改、散布
- **硬體設計**: [CERN Open Hardware Licence v1.2](https://ohwr.org/) - 自由製造、銷售
- **文件**: [Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

**為什麼完全開源？**
我們相信「讀懂世界」是基本人權，不該被專利或商業機密限制。透過開放協作，我們可以加速創新，讓更多人受益。

---

## 🗺️ 路線圖

### Phase 1: Core (現在 - 2024 Q2)
- ✅ MVP 驗證完成
- ✅ 基礎文件建立
- 🔄 社群建置
- ⬜ 100 個早期採用者

### Phase 2: Expansion (2024 Q3-Q4)
- ⬜ 更多感測器支援 (土壤濕度、氣體)
- ⬜ 機器學習分類器
- ⬜ 行動 App (React Native)
- ⬜ 雲端部署選項

### Phase 3: Intelligence (2025)
- ⬜ Semantica 語言完整實作
- ⬜ 自主好奇心引擎
- ⬜ 全球模式共享平台
- ⬜ AR/VR 整合

### Phase 4: Universal (2026+)
- ⬜ 大規模部署 (>10,000 節點)
- ⬜ 跨物種溝通應用
- ⬜ 變形皮膚硬體
- ⬜ 世界級研究合作

詳細路線圖請見 [ROADMAP.md](ROADMAP.md)

---

## 🤝 合作夥伴與贊助

### 需要贊助
我們是完全由社群驅動的專案，需要您的支持！

- **硬體贊助**: 提供元件樣品給開發者
- **雲端點數**: AWS/GCP/Azure credits
- **資金捐贈**: GitHub Sponsors / Open Collective

[![GitHub Sponsors](https://img.shields.io/github/sponsors/ModernReader?logo=GitHub)](https://github.com/sponsors/ModernReader)
[![Open Collective](https://opencollective.com/ModernReader/tiers/badge.svg)](https://opencollective.com/ModernReader)

### 學術合作
歡迎大學、研究機構加入合作網絡，共同發表論文、申請研究經費。

聯絡：research@modernreader.org

---

## 📞 聯絡方式

- **網站**: https://modernreader.org
- **Discord**: https://discord.gg/modernreader
- **Twitter**: @ModernReaderOrg
- **Email**: hello@modernreader.org
- **論壇**: https://forum.modernreader.org

---

## 🙏 致謝

感謝所有貢獻者、早期採用者、以及相信開放原始碼力量的你。

**特別感謝**:
- ESP32 社群
- FastAPI 團隊
- librosa 開發者
- CERN Open Hardware
- 全球 Maker 運動

---

<div align="center">

**Built with ❤️ by the Global Community**

[🏠 首頁](README.md) | [📚 文件](docs/) | [🛠️ 開始製作](docs/assembly/hardware-build.md) | [💬 加入社群](https://discord.gg/modernreader)

</div>
