# ModernReader - 下一代語義化閱讀平台

## 🚀 願景

用 **Semantica** 統一語義層取代所有 API，讓 AI Agent 在 **Moltbook** 環境中透過 **Claw** 協議直接交流，實現：
- ✅ 零 API 整合成本
- ✅ 免費高效運行
- ✅ 原生量子計算支援
- ✅ 多 Agent 無縫協作

## 📁 專案結構

```
/workspace
├── client/              # React 前端應用
├── server/              # TypeScript 後端服務
├── semantica/           # 語義語言核心 ⭐
│   ├── parser/          # 語法解析器
│   ├── runtime/         # 執行環境（含量子模擬）
│   └── ...
├── claw/                # Agent 通訊協議 ⭐
│   ├── protocol/        # Claw 協議實現
│   └── ...
├── moltbook/            # Agent 執行環境 ⭐
│   ├── environment/     # 環境管理
│   └── ...
├── docs/                # 文檔
├── archive/             # 歸檔的舊專案
└── tests/               # 測試
```

## 🔥 快速開始

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
# 啟動前端
npm run dev

# 啟動後端
npm run dev:server
```

### 使用 Semantica
```typescript
import { SemanticaParser } from './semantica/parser'
import { MoltbookEnvironment } from './moltbook/environment'
import { ClawProtocol } from './claw/protocol'

const parser = new SemanticaParser()
const moltbook = new MoltbookEnvironment()
const claw = new ClawProtocol()

// 解析語義代碼
const ast = parser.parse(`
intent read {
  source: "article.txt"
  agent: @summarizer
}
`)
```

## 📚 文檔

- [新架構說明](./docs/NEW_ARCHITECTURE.md)
- [Semantica 語言規範](./docs/SEMANTICA_LANGUAGE.md)
- [API 參考](./docs/API.md)

## 🌟 核心特性

### 1. Semantica 語義語言
聲明式語法表達意圖，無需學習複雜 API。

```semantica
intent summarize {
  source: "document.pdf"
  agent: @summarizer
  output: @user.format
}
```

### 2. Claw 通訊協議
Agent 間原生通訊，支援語義路由、優先級、TTL。

```typescript
await claw.send({
  from: '@user',
  to: '@researcher',
  semanticRoute: '@researcher/search',
  content: { query: '...' },
  priority: 'high'
})
```

### 3. Moltbook 執行環境
Agent 註冊、發現、會話管理一應俱全。

```typescript
moltbook.registerAgent({
  id: '@summarizer',
  capabilities: ['summarize', 'extract'],
  status: 'active'
})
```

### 4. 量子計算整合
原生支援量子電路模擬與優化。

```typescript
const circuit = quantum.createCircuit(2)
quantum.hadamard(circuit.id, 0)
quantum.cnot(circuit.id, 0, 1)
const result = quantum.simulate(circuit.id)
```

## 🛠️ 技術棧

- **前端**: React 18 + TypeScript + Vite + TailwindCSS
- **後端**: TypeScript + Express
- **語義層**: Semantics (自研)
- **通訊**: Claw Protocol (自研)
- **環境**: Moltbook (自研)
- **狀態管理**: Zustand
- **路由**: React Router

## 📈 開發路線圖

- [x] Phase 1: 核心基礎架構
- [ ] Phase 2: 功能完善
- [ ] Phase 3: 整合 ModernReader
- [ ] Phase 4: 生態系統建設

## 🤝 貢獻

歡迎貢獻！請查看 [NEW_ARCHITECTURE.md](./docs/NEW_ARCHITECTURE.md) 了解詳細計劃。

## 📄 授權

MIT License
