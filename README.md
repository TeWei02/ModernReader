# Semantica + H.O.L.O.: Unified Semantic Narrative Engine

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

融合 **ModernReader (Semantica)** 的統一語義執行環境與 **AI-Reader (H.O.L.O.)** 的多模態敘事框架，打造 AI 驅動的下一代閱讀與敘事體驗。

> **ModernReader 是一個把長篇文字變成「多感官、可呼吸節奏」的閱讀系統，專門為高壓、大量閱讀場景設計。** — [完整產品願景](docs/PRODUCT_VISION.md)

## Core Philosophy

- **Semantica**: 統一語義執行環境 — 無 API，直接語義意圖宣告
- **H.O.L.O.**: 多模態敘事框架 — Python 語義分析 + 多模態生成
- **Agent-First**: 透過 Claw 協議實現原生多 agent 通訊
- **Quantum-Native**: 內建量子模擬與執行
- **Zero Boilerplate**: 寫你所想，而非如何實現

## Project Structure

```
/
├── core/                  # Semantica 語義執行時 & 編譯器
│   ├── parser/            # 語法解析器
│   └── runtime/           # 執行引擎 (Quantum + Classical)
├── semantica/             # Semantica 語言核心
│   ├── parser/            # 語義解析器
│   └── runtime/           # 執行環境
├── protocols/             # 通訊協議
│   └── claw/              # Claw 協議實現
├── moltbook/              # 共享執行環境
│   ├── registry/          # Agent 發現
│   └── environment/       # 執行環境管理
├── claw/                  # Claw 協議核心
│   └── protocol/          # 協議定義
├── modernreader-core/     # ModernReader 核心模組
│   ├── engine/            # 渲染引擎
│   ├── actions/           # 行為系統
│   ├── mcp/               # MCP 整合
│   └── academic/          # 學術工具
├── holo/                  # H.O.L.O. 多模態敘事引擎 (AI-Reader)
│   ├── ingestion/         # 內容攝取
│   ├── sensory/           # 感官模態
│   ├── auditory/          # 聽覺分析
│   ├── lang/              # 語言處理
│   ├── quantum/           # 量子語義分析
│   ├── recommendations/   # 推薦系統
│   ├── social/            # 社群互動
│   ├── history/           # 閱讀歷史
│   ├── bookmarks/         # 書籤管理
│   ├── database/          # 資料持久層
│   └── auth/              # 認證模組
├── docs/                  # 技術文檔
├── examples/              # 使用範例
├── tests/                 # 測試（合併後）
├── .github/               # CI/CD 工作流
└── README.md
```

## Quick Start

### Semantica Runtime
```bash
npm install
npx semantica run examples/hello.sm
```

Write your first program:
```semantica
// hello.sm
intent greet {
  target: @user
  message: "Hello from Semantica!"
}

execute greet
```

### H.O.L.O. Narrative Engine
```bash
pip install -r requirements-dev.txt
python holo/main.py
```

## Key Features

### 🚀 Semantica — Replace All Languages
- **Frontend**: Declarative UI via semantic intents
- **Backend**: Logic defined by agent capabilities
- **Systems**: Direct memory/quantum access when needed
- **Scripting**: Natural language-like syntax

### 📖 H.O.L.O. — Multimodal Narrative
- **Multi-Sensory**: Auditory, visual, and textual modality analysis
- **Semantic Ingestion**: Intelligent content parsing and structuring
- **Quantum Analysis**: Quantum-inspired semantic similarity computation
- **Social Reading**: Collaborative annotations, shared bookmarks

### 🤝 Agent Communication (Claw Protocol)
```semantica
// Define agent interaction
flow research {
  @researcher fetch(topic: "quantum computing")
  @summarizer condense(result, length: short)
  @presenter visualize(result, format: slide)
}
```

### ⚛️ Quantum Native
```semantica
// Quantum algorithm in pure Semantica
algorithm grover_search {
  param database: List[String]
  param target: String

  qubits n = log2(database.length)
  superposition(all qubits)

  oracle mark(target)
  diffusion amplify()

  measure result
  return database[result]
}
```

## 🗺️ ModernReader Ecosystem

ModernReader 不是一個孤立的引擎 — 它是一個由 **13 個項目** 組成的 AI 原生系統生態，從底層通信到前端交互、從資料分析到自主機器人，全部圍繞語義理解與多模態敘事展開。

### Ecosystem Architecture

```
                        ModernReader Core
              Semantica · H.O.L.O. · Claw Protocol
        ┌───────────────┬───────┼───────┬───────────────┐
        ▼               ▼       │       ▼               ▼
  Infrastructure   Frontend     │   Analytics   Vertical Domains
   (4 repos)       (2 repos)    │  (2 repos)     (4 repos)
                                │
                        ┌───────▼───────┐
                        │  ModernReader  │
                        │    Ecosystem   │
                        │  (total: 13)   │
                        └───────────────┘
```

---

### 🔧 Infrastructure & Systems — 底層基礎設施

| 倉庫 | 描述 | 在 Ecosystem 中的角色 |
|------|------|----------------------|
| [agent_full](https://github.com/TeWei02/agent_full) | AI Agent 編排框架 | ModernReader 的 Claw 協議原生 Agent 層 — 多 Agent 協作、任務派發、記憶管理 |
| [multithreaded-file-transfer-scheduler-simulator](https://github.com/TeWei02/multithreaded-file-transfer-scheduler-simulator) | 多執行緒排程模擬器 | ModernReader 的分散式內容分發引擎 — 併發檔案傳輸與調度 |
| [Real-time-Packet-Monitoring](https://github.com/TeWei02/Real-time-Packet-Monitoring) | 即時封包監控系統 | ModernReader 的網路資料管道 — 即時封包捕獲與協議分析 |
| [qbridge](https://github.com/TeWei02/qbridge) | 量子計算橋接層 | ModernReader 的量子加速後端 — 向量語義相似度量子模擬 |

### 🖥️ Frontend & User Experience — 前端體驗層

| 倉庫 | 描述 | 在 Ecosystem 中的角色 |
|------|------|----------------------|
| [sensory-shield](https://github.com/TeWei02/sensory-shield) | 瀏覽器內容感知擴展 | ModernReader 的消費端介面 — 智慧內容過濾、改寫與感官調節 |
| [TeWei02.github.io](https://github.com/TeWei02/TeWei02.github.io) | 專案入口網站 | ModernReader 生態的統一展示門戶 — 所有專案的互動式總覽 |

### 📊 Data & Analytics — 資料分析層

| 倉庫 | 描述 | 在 Ecosystem 中的角色 |
|------|------|----------------------|
| [StatSigCalculator](https://github.com/TeWei02/StatSigCalculator) | A/B 測試顯著性計算器 | ModernReader 的內容實驗引擎 — 閱讀行為 A/B 測試與統計驗證 |
| [calc-tracker](https://github.com/TeWei02/calc-tracker) | 微積分錯題管理工具 | ModernReader 的教育分析模組 — 學習行為追蹤與錯誤模式識別 |

### 🌍 Vertical Domains — 垂直應用領域

| 倉庫 | 描述 | 在 Ecosystem 中的角色 |
|------|------|----------------------|
| [Carbon.Negtive](https://github.com/TeWei02/Carbon.Negtive) | 負碳技術與環境平台 | ModernReader 的環境內容領域 — 碳足跡追蹤與永續敘事生成 |
| [Robotic-Navigation-and-Exploration](https://github.com/TeWei02/Robotic-Navigation-and-Exploration) | 強化學習自主導航 | ModernReader 的自主感知模組 — RL-based 環境探索與路徑規劃 |
| [From-Signal-to-System](https://github.com/TeWei02/From-Signal-to-System) | 通信感知一體化系統 | ModernReader 的信號處理層 — 從物理信號到語義理解的完整管線 |
| [final-project-ros2-navigatio](https://github.com/TeWei02/final-project-ros2-navigatio) | ROS2 自主導航系統 | ModernReader 的機器人整合 — ROS2 節點下的語義導航與決策 |

---

### 🔗 跨專案關聯圖

```
ModernReader Core (語言引擎)
│
├── 基礎設施層 ──────────────────────────────────────
│   agent_full ────────────► Agent 通訊與協作
│   multithreaded-scheduler ► 內容分發排程
│   packet-monitoring ─────► 網路數據捕獲
│   qbridge ───────────────► 量子語義加速
│
├── 前端體驗層 ──────────────────────────────────────
│   sensory-shield ────────► 瀏覽器內容感知
│   TeWei02.github.io ─────► 生態入口門戶
│
├── 資料分析層 ──────────────────────────────────────
│   StatSigCalculator ─────► 內容 A/B 實驗
│   calc-tracker ──────────► 學習行為分析
│
└── 垂直應用層 ──────────────────────────────────────
    Carbon.Negtive ─────────► 環境敘事生成
    Robotic-Navigation ─────► 自主空間探索
    Signal-to-System ───────► 信號語義管線
    ros2-navigatio ────────► 機器人語義導航
```

> **設計理念**：每個子專案都可以獨立運作，但透過 ModernReader 的語義引擎與 Agent 協議串聯後，形成一個從物理信號到人類可讀敘事的完整 AI 管線。

---

## Documentation
- [產品定位與願景](docs/PRODUCT_VISION.md) — 核心痛點、設計原則、功能模組與未來路線圖
- [Language Specification](docs/LANGUAGE_SPEC.md)
- [Release System](docs/RELEASE_SYSTEM_SUMMARY.md)

---

## 🚀 發行版本 (Releases)

### 版本命名規則
- **手動版本**: `v{major}.{minor}.{patch}` (例如: v1.0.0, v2.1.3)

### 查看發布歷史
訪問 [Releases 頁面](https://github.com/TeWei02/ModernReader/releases) 查看所有發布版本。

---

## License
MIT - Free for everyone, forever.
