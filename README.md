# Semantica + H.O.L.O.: Unified Semantic Narrative Engine

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

融合 **ModernReader (Semantica)** 的統一語義執行環境與 **AI-Reader (H.O.L.O.)** 的多模態敘事框架，打造 AI 驅動的下一代閱讀與敘事體驗。

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

## Documentation
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
