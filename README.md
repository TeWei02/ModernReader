```markdown
# ModernReader — 現代化閱讀器

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Language](https://img.shields.io/badge/Language-Markdown-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Cross--platform-lightgrey)
![Status](https://img.shields.io/badge/Status-Active-success)

**ModernReader** 是一個專為知識工作者設計的現代化閱讀與內容管理工具。它將命令行效率與商業洞察無縫融合，幫助你以最簡潔的方式整理、閱讀和分享高品質文件。

---

## 📦 安裝

```bash
git clone https://github.com/your-username/ModernReader.git
cd ModernReader
# 無需額外依賴，所有內容均為純文本 Markdown 格式
```

> 若需本地預覽，建議使用支援 Markdown 的編輯器（如 VS Code、Typora），或透過 `pandoc` 轉換為 HTML / PDF。

---

## 🚀 使用方式

### 瀏覽今日產出內容

倉庫預設包含最新的技術與商業類文檔，可直接透過任何 Markdown 閱讀器開啟：

```bash
# 技術類
open tech/20260617_Linux命令行技巧：提升效率的10個組.md

# 商業類
open biz/20260617_訂閱制商業模式深度解析.md
```

### 自定義閱讀流程

1. 將你的 `.md` 文件放入對應分類資料夾（`tech/`、`biz/`、`design/` 等）。
2. 使用 `grep`、`find` 等命令行工具快速檢索內容。
3. 搭配 `pandoc` 或 `mdbook` 生成精美電子書。

---

## ✨ 功能特色

- **雙軌內容結構**：技術（tech）與商業（biz）分離，便於聚焦學習。
- **日期標記**：文件名採用 `YYYYMMDD_` 前綴，自動歸檔與時間線瀏覽。
- **純文本格式**：無需專有軟體，任何環境皆可閱讀。
- **可擴展分類**：支援任意自定義資料夾，滿足個人知識庫需求。
- **自動化生成**：每日內容由 Davin Portfolio Engine 自動產出，確保新鮮度。

---

## 📄 授權條款

本專案採用 **MIT License**。詳細內容請參閱 [LICENSE](./LICENSE) 文件。

---

## 📅 最新更新

| 日期 | 類別 | 標題 |
|------|------|------|
| 2026-06-17 | tech | Linux命令行技巧：提升效率的10個組 |
| 2026-06-17 | biz  | 訂閱制商業模式深度解析 |

---

*Automated by Davin Portfolio Engine*
```