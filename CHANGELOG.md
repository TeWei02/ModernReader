# 更新日誌 Changelog

本文檔記錄 ModernReader 的所有重要更新。

## [2.0.0] - 2026-03-10

### 重構 Refactor
- 🗂️ **Repository 整理**：移除所有與 Vue 3 應用無關的舊版 Vanilla JavaScript 遺留程式碼
- 🗑️ 刪除 `components/`（舊版 JS 元件：carousel、dropdown、loader、modal、toast、tooltip）
- 🗑️ 刪除 `hooks/`（舊版事件鉤子系統）
- 🗑️ 刪除 `plugins/`（舊版插件系統）
- 🗑️ 刪除 `services/`（舊版 API/Auth/Sync 服務）
- 🗑️ 刪除 `utils/`（舊版工具函數：analytics、animation、audio、format、i18n、keyboard、share、storage、validation）
- 🗑️ 刪除 `config/`（舊版設定檔）
- 🗑️ 刪除 `styles/` 目錄與根目錄 `styles.css`（舊版 CSS 結構）
- 🗑️ 刪除 `app.js`（舊版主程式，28KB）
- 🗑️ 刪除 `assets/`（舊版資源目錄，圖示與圖片未被 Vue 應用使用）
- 🗑️ 刪除 `data/`（舊版 JSON 資料，未被 Vue 應用使用）
- 🗑️ 刪除 `tests/`（舊版測試，測試已刪除的 Vanilla JS 模組）

### 更新 Changed
- 🔧 **service-worker.js**：更新預緩存路徑為 Vite 構建輸出路徑，移除舊版資源參照
- 📱 **manifest.json**：更新為 Vue 3 應用的正確設定，修正圖示路徑
- 🌐 **index.html**：修正語言設定（`lang="zh-TW"`）、更新標題與加入 PWA manifest 連結
- 📚 **docs/API.md**：重寫為 Vue 3 元件與組合式函數的完整文檔

---

## [1.2.0] - 2024-12-21

### 新增 Added
- ✨ **utils/audio.js** - 音效播放引擎
- ✨ **utils/animation.js** - 動畫工具函數 (fade, slide, shake, typewriter 等)
- ✨ **utils/validation.js** - 表單驗證工具
- ✨ **utils/format.js** - 日期/數字格式化工具
- ✨ **components/tooltip.js** - 工具提示組件
- ✨ **components/dropdown.js** - 下拉選單組件
- ✨ **components/carousel.js** - 輪播組件
- ✨ **services/auth.js** - 用戶認證服務
- ✨ **services/sync.js** - 雲端同步服務
- ✨ **data/themes.json** - 自定義主題配置 (5 個主題)
- ✨ **data/sounds.json** - 音效配置檔 (6 個音景 + UI 音效)
- ✨ **docs/API.md** - 完整 API 文檔
- ✨ **CHANGELOG.md** - 版本更新日誌
- ✨ **tests/e2e.test.js** - 端對端測試
- ✨ **.github/workflows/** - CI/CD 自動化
- 📂 **docs/** - 技術文檔目錄
- 📂 **styles/** - CSS 模組化目錄
- 📂 **hooks/** - 自定義事件鉤子目錄
- 📂 **plugins/** - 可擴展插件系統目錄

### 改進 Changed
- 📦 package.json 版本升級至 1.2.0

---

## [1.1.0] - 2024-12-21

### 新增 Added
- ✨ **utils/i18n.js** - 國際化多語言支援 (繁體中文/English)
- ✨ **utils/keyboard.js** - 鍵盤快捷鍵支援
- ✨ **utils/share.js** - 社群分享功能 (Web Share API)
- ✨ **components/modal.js** - 可重用模態框組件
- ✨ **components/loader.js** - 載入動畫組件
- ✨ **services/api.js** - API 服務層 (H.O.L.O. 整合)
- ✨ **data/books.json** - 書籍數據 (6 本書)
- ✨ **manifest.json** - PWA 支援
- ✨ **service-worker.js** - 離線功能
- ✨ **tests/unit.test.js** - 單元測試框架
- ✨ **.eslintrc.json** - ESLint 程式碼規範
- ✨ **CONTRIBUTING.md** - 貢獻指南 (雙語)
- 🎨 8 個 SVG 圖標 (bookmark, settings, share, sun, moon, menu, close, search)

---

## [1.0.0] - 2024-12-21

### 新增 Added
- ✨ **package.json** - Node.js 專案配置
- ✨ **.gitignore** - Git 忽略規則
- ✨ **LICENSE** - MIT 授權
- ✨ **utils/storage.js** - 本地存儲工具 (ReadingProgress, Bookmarks, UserPreferences)
- ✨ **utils/analytics.js** - 使用分析工具
- ✨ **components/toast.js** - Toast 通知組件
- ✨ **config/settings.js** - 集中式設定
- 🎨 深色/淺色模式切換按鈕
- 💾 用戶偏好設置持久化
- 📖 閱讀進度自動保存
- 🔖 書籤功能
- 📂 **assets/** - 靜態資源目錄結構

---

## 版本說明

### 版本號規則

採用 [語義化版本](https://semver.org/lang/zh-TW/)：

- **主版本號 (Major)**: 不相容的 API 變更
- **次版本號 (Minor)**: 新增功能，向下相容
- **修訂號 (Patch)**: 向下相容的問題修正

### 標籤說明

- ✨ 新功能
- 🐛 Bug 修復
- 📝 文檔更新
- 🎨 樣式更新
- ♻️ 程式碼重構
- ⚡ 效能改進
- 🔧 配置更新
- 📦 依賴更新
- 🗑️ 移除功能
- 📂 目錄結構
- 💾 資料相關
