# ModernReader - 現代化 Markdown 閱讀器

基於 **Vue 3 + TypeScript + Vite** 打造的高性能 Markdown 閱讀器。

## ✨ 特色功能

- 📖 **優雅排版**：專注於閱讀體驗的精美設計
- 🌓 **深色模式**：支援淺色/深色主題自動切換
- 📑 **智能目錄**：自動生成可點擊的文章目錄
- 🎨 **字體設定**：支援 Serif、Sans-serif、Monospace 三種字型
- 📏 **字體大小**：可自由調整閱讀字體大小
- 📂 **本機上傳**：支援 .md、.markdown、.txt 檔案
- 📋 **一鍵複製**：程式碼區塊懸停即顯示複製按鈕
- ⌨️ **快捷鍵**：完整鍵盤操作支援

## ⌨️ 鍵盤快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `⌘/Ctrl + K` | 切換深色/淺色模式 |
| `⌘/Ctrl + +` | 放大字體 |
| `⌘/Ctrl + -` | 縮小字體 |
| `⌘/Ctrl + O` | 開啟檔案選擇器 |

## 🚀 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build

# 預覽生產構建
npm run preview
```

## 🛠️ 技術堆疊

- **前端框架**：Vue 3 (Composition API)
- **語言**：TypeScript
- **構建工具**：Vite
- **Markdown 引擎**：markdown-it
- **語法高亮**：highlight.js (按需加載)

## 📊 性能優化

ModernReader 經過深度優化，提供極致的閱讀體驗：

- ✅ 標題提取優化（減少 DOM 操作）
- ✅ 滾動事件節流（提升流暢度）
- ✅ highlight.js 按需加載（bundle 減少 60%）
- ✅ 智能錯誤處理和用戶反饋
- ✅ 程式碼區塊一鍵複製功能

詳見 [OPTIMIZATION.md](./OPTIMIZATION.md) 了解所有優化細節。

## 📝 使用說明

1. **上傳文件**：點擊工具列「開啟檔案」按鈕，或按 `⌘/Ctrl + O`
2. **切換主題**：點擊月亮/太陽圖示，或按 `⌘/Ctrl + K`
3. **調整字體**：使用工具列的字體選擇器和大小按鈕
4. **目錄導航**：點擊左側目錄項目快速跳轉
5. **複製程式碼**：懸停在程式碼區塊上，點擊複製按鈕

## 🎯 支援的程式語言

語法高亮支援 18 種常用程式語言：

JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, Bash, Shell, SQL, JSON, XML, HTML, CSS, Markdown, YAML

## 📄 授權

MIT License

## 🙏 致謝

本專案使用以下優秀的開源項目：

- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [markdown-it](https://github.com/markdown-it/markdown-it)
- [highlight.js](https://highlightjs.org/)

---

**享受舒適的 Markdown 閱讀體驗！** 📖✨
