<div align="center">

# ModernReader

**Project H.O.L.O. — 故事的多感官重建引擎**

[![線上使用](https://img.shields.io/badge/線上使用-tewei02.github.io%2FModernReader-6ea8fe?style=flat-square&logo=githubpages&logoColor=white)](https://tewei02.github.io/ModernReader/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![PWA](https://img.shields.io/badge/PWA-可離線安裝-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://tewei02.github.io/ModernReader/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

> 「故事的核心在於體驗，而非僅是文字。」

</div>

ModernReader 是 **Project H.O.L.O.** 的參考實作。它不把閱讀視為「解碼文字」，而視為一條可被運算的體驗管道：以深度語意分析解構文本，再透過多模態語意建模重塑為聽覺與感官回饋。

---

## 目錄

- [核心概念](#核心概念)
- [線上版本](#線上版本)
- [功能](#功能)
- [快速開始](#快速開始)
- [技術架構](#技術架構)
- [文件](#文件)
- [授權](#授權)

---

## 核心概念

| 面向 | 說明 |
| :--- | :--- |
| **問題** | 敘事長期只能透過視覺解碼符號取得，讀者始終是旁觀者 |
| **方法** | 語意解構 → 多模態建模 → 聽覺與感官重建 |
| **模型** | Cognitive Rhythm Alignment (CRA)：即時追蹤閱讀行為、注意力與認知狀態，動態調適內容呈現方式 |
| **狀態** | 概念驗證（PoC）· 2026 海峽兩岸創業大賽決賽入圍 |

---

## 線上版本

**<https://tewei02.github.io/ModernReader/>**

多感官智能閱讀器，支援 EPUB / TXT / MD 匯入、語音導讀、情緒標記與 AI 摘要，可安裝為桌面／手機 App 並離線使用（PWA）。

---

## 功能

**內容管理**

- 純文字 Markdown 為核心，跨平台相容
- 分類資料夾（tech / biz / design 等）
- 日期命名自動歸檔（`YYYYMMDD_` 前綴）

**閱讀體驗**

- 語音導讀與情緒標記
- AI 摘要
- Cognitive Rhythm Alignment 動態調適

**匯入與部署**

- EPUB / TXT / MD 匯入
- 核心解析器（`core/parser`）與執行環境（`core/runtime`）
- 移動端應用（`app/mobile`）
- Docker / docker-compose 容器化部署
- 完整 CI/CD 流程

---

## 快速開始

```bash
git clone https://github.com/TeWei02/ModernReader.git
cd ModernReader
```

以支援 Markdown 的編輯器（VS Code、Typora 等）開啟即可閱讀；或參考 [QUICK_START.md](QUICK_START.md) 以容器化方式啟動。

---

## 技術架構

```
ModernReader/
├── core/           # 解析器與執行環境
│   ├── parser/     # 內容解析
│   └── runtime/    # 執行時環境
├── app/mobile/     # 移動端應用
├── web/frontend/   # 網頁前端（GitHub Pages 部署來源）
├── docs/           # 技術文件
├── Dockerfile
├── docker-compose.yml
└── demo.html       # 離線展示頁
```

---

## 文件

| 文件 | 內容 |
| :--- | :--- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 系統架構 |
| [IMPLEMENTATION.md](IMPLEMENTATION.md) | 實作細節 |
| [CHANGELOG.md](CHANGELOG.md) | 版本紀錄 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 貢獻指引 |
| [docs/](docs/) | 技術文件索引：產品願景、情緒分析、發行流程與開發紀錄 |

---

## 授權

本專案採用 [MIT License](LICENSE)。