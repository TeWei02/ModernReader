# ModernReader 專案結構說明

## 整理後的目錄結構

```
/workspace
├── client/              # 前端程式碼 (React + Vite)
│   ├── agents/          # AI Agents
│   ├── assets/          # 靜態資源
│   ├── components/      # React 元件
│   ├── data/            # 資料文件
│   ├── hooks/           # 自定義 Hooks
│   ├── images/          # 圖片資源
│   ├── modules/         # 功能模組
│   ├── pages/           # 頁面元件
│   ├── public/          # 公共資源 (index.html, vite.svg)
│   ├── services/        # API 服務
│   ├── store/           # 狀態管理 (Zustand)
│   ├── styles/          # 樣式文件
│   ├── types/           # TypeScript 類型定義
│   └── utils/           # 工具函數
│
├── server/              # 後端伺服器 (TypeScript + Express)
│   └── ai/              # AI 相關功能
│
├── archive/             # 歸檔的舊專案
│   ├── ModernReader-Universal/
│   ├── modernreader-final/
│   ├── modernreader-mvp/
│   └── backend/         # Python 後端 (已棄用)
│
├── docs/                # 專案文檔
├── tests/               # 測試檔案
│
├── package.json         # 專案依賴配置
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
├── tailwind.config.js   # Tailwind CSS 配置
└── vercel.json          # Vercel 部署配置
```

## 主要命令

```bash
# 開發模式
npm run dev              # 啟動前端開發伺服器
npm run dev:server       # 啟動後端開發伺服器

# 建構
npm run build            # 建構前端專案
npm run start:server     # 啟動生產環境後端

# 類型檢查
npm run type-check       # 檢查前端類型
npm run type-check:server # 檢查後端類型
```

## 路徑別名

- `@/*` 指向 `./client/*`

## 注意事項

1. 所有前端程式碼都在 `client/` 目錄下
2. `index.html` 位於 `client/public/`
3. 建構輸出會放在根目錄的 `dist/`
4. 舊專案已歸檔至 `archive/` 目錄，不再使用
