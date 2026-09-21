# ModernReader — 現代化閱讀器

[![TypeScript](https://img.shields.io/badge/TypeScript-5-%233178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-%232496ED?logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

專為知識工作者設計的現代化閱讀與內容管理工具（**Project H.O.L.O.**：多感官故事重建引擎）。以純文字 Markdown 為核心，搭配分類整理、日期歸檔與多平台閱讀能力。

## 功能

- 純文字 Markdown 內容管理，跨平台相容
- 分類資料夾（tech / biz / design 等）與日期命名自動歸檔（YYYYMMDD_ 前綴）
- 核心解析器（`core/parser`）與執行環境（`core/runtime`）
- 移動端應用（`app/mobile`）
- Docker / docker-compose 容器化部署
- 完整 CI/CD 流程與文件

## 線上版本

- [ModernReader 正式版（PWA）](https://tewei02.github.io/ModernReader/) — 多感官智能閱讀器，支援 EPUB/TXT/MD 導入、語音導讀、情緒標記與 AI 摘要，可安裝為桌面／手機 App 並離線使用
- [互動專案報告](https://tewei02.github.io/ModernReader/) — 願景、HSP 引擎架構與開發進度總覽

## 快速開始

```bash
git clone https://github.com/TeWei02/ModernReader.git
cd ModernReader
```

直接以支援 Markdown 的編輯器（VS Code、Typora 等）開啟即可閱讀；或參考 [QUICK_START.md](QUICK_START.md) 使用容器化方式啟動。

## 相關文件

- [ARCHITECTURE.md](ARCHITECTURE.md) — 系統架構
- [IMPLEMENTATION.md](IMPLEMENTATION.md) — 實作細節
- [CHANGELOG.md](CHANGELOG.md) — 版本紀錄
- [CONTRIBUTING.md](CONTRIBUTING.md) — 貢獻指引

## 目錄結構

```
ModernReader/
├── core/           # 解析器與執行環境
│   ├── parser/     # 內容解析
│   └── runtime/    # 執行時環境
├── app/mobile/     # 移動端應用
├── docs/           # 技術文件
├── Dockerfile      # 容器映像
├── docker-compose.yml
└── demo.html       # 展示頁
```

## License

MIT
