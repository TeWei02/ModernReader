# Semantica: The Universal Language

[![Release](https://img.shields.io/github/v/release/TeWei02/ModernReader?style=flat-square)](https://github.com/TeWei02/ModernReader/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

**One Language to Rule Them All** - Replacing React, Python, C, TypeScript with a unified semantic execution environment.

## Core Philosophy
- **No APIs**: Direct semantic intent declaration
- **Quantum-Native**: Built-in quantum simulation and execution
- **Agent-First**: Native multi-agent communication via Claw protocol
- **Zero Boilerplate**: Write what you mean, not how to do it

## Project Structure
```
/workspace
├── core/               # Semantics Runtime & Compiler
│   ├── parser/         # Syntax parser
│   ├── compiler/       # Semantic to Machine code
│   └── runtime/        # Execution engine (Quantum + Classical)
├── agents/             # Pre-built Agent Library
│   ├── reader/         # Document processing
│   ├── summarizer/     # Text summarization
│   └── quantum/        # Quantum algorithm agents
├── protocols/          # Communication Protocols
│   └── claw/           # Claw Protocol Implementation
├── moltbook/           # Shared Execution Environment
│   ├── registry/       # Agent Discovery
│   └── session/        # State Management
├── stdlib/             # Standard Library
│   ├── io/             # Input/Output
│   ├── quantum/        # Quantum primitives
│   └── ai/             # AI primitives
├── examples/           # Usage Examples
└── README.md           # This file
```

## Quick Start

### 1. Install Semantics Runtime
```bash
npm install -g semantica-runtime
```

### 2. Write Your First Program
```semantica
// hello.sm
intent greet {
  target: @user
  message: "Hello from Semantica!"
}

execute greet
```

### 3. Run It
```bash
semantica run hello.sm
```

## Key Features

### 🚀 Replace All Languages
- **Frontend**: Declarative UI via semantic intents
- **Backend**: Logic defined by agent capabilities
- **Systems**: Direct memory/quantum access when needed
- **Scripting**: Natural language-like syntax

### �� Agent Communication (Claw Protocol)
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

### 🆓 No API Costs
Everything runs locally or in the distributed Moltbook network. No external API calls needed.

## Documentation
- [Language Specification](docs/LANGUAGE_SPEC.md)
- [Claw Protocol](docs/CLAW_PROTOCOL.md)
- [Moltbook Environment](docs/MOLTBOOK_ENV.md)
- [Quantum Primitives](docs/QUANTUM_PRIMITIVES.md)

---

## 🚀 發行版本 (Releases)

### 自動化發布系統

本專案使用 GitHub Actions 實現自動化發布流程：

#### 📌 手動版本發布
要建立新的版本發布，請按照以下步驟：

```bash
# 1. 更新 VERSION 文件
echo "1.0.1" > VERSION

# 2. 提交變更
git add VERSION
git commit -m "Bump version to 1.0.1"
git push

# 3. 建立版本標籤
git tag -a v1.0.1 -m "Release version 1.0.1"
git push origin v1.0.1
```

推送版本標籤後，GitHub Actions 會自動：
- 建立 ZIP 壓縮檔
- 生成發布說明
- 建立 GitHub Release
- 上傳發布文件

#### 🤖 自動發布
每次推送到 `main` 分支並修改以下文件時，系統會自動建立發布：
- `index.html`
- `styles.css`
- `app.js`

自動發布使用日期和構建編號命名（例如：`v2025.12.22.build123`）

### 版本命名規則

- **手動版本**: `v{major}.{minor}.{patch}` (例如: v1.0.0, v2.1.3)
- **自動版本**: `v{YYYY}.{MM}.{DD}.build{count}` (例如: v2025.12.22.build45)

### 查看發布歷史

訪問 [Releases 頁面](https://github.com/TeWei02/ModernReader/releases) 查看所有發布版本和下載文件。

---

## License
MIT - Free for everyone, forever.
