# ModernReader API 文檔

> ModernReader Vue 3 + TypeScript 元件與組合式函數參考文檔

## 目錄

- [元件 Components](#元件-components)
  - [App.vue](#appvue)
  - [Toolbar.vue](#toolbarvue)
  - [MarkdownViewer.vue](#markdownviewervue)
  - [TableOfContents.vue](#tableofcontentsvue)
- [組合式函數 Composables](#組合式函數-composables)
  - [useTheme](#usetheme)
  - [useFontSettings](#usefontsettings)
- [工具函數 Utils](#工具函數-utils)
  - [throttle](#throttle)

---

## 元件 Components

### App.vue

應用程式根元件，負責整合工具列、Markdown 閱讀器和目錄側邊欄。

**功能：**
- 管理 Markdown 內容狀態
- 處理本地檔案上傳（`.md`、`.markdown`、`.txt`）
- 追蹤捲動位置以高亮對應目錄項目
- 全域鍵盤快捷鍵處理

**鍵盤快捷鍵：**

| 快捷鍵 | 功能 |
|--------|------|
| `⌘/Ctrl + K` | 切換深色/淺色模式 |
| `⌘/Ctrl + +` | 放大字體 |
| `⌘/Ctrl + -` | 縮小字體 |
| `⌘/Ctrl + O` | 開啟檔案選擇器 |

---

### Toolbar.vue

固定於頂部的工具列元件。

**Props：**

| 名稱 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `isLoading` | `boolean` | `false` | 是否顯示載入狀態 |
| `fileInputRef` | `Ref<HTMLInputElement \| null>` | — | 檔案輸入框的 ref |

**Emits：**

| 事件 | 參數 | 說明 |
|------|------|------|
| `upload` | `Event` | 使用者選擇檔案時觸發 |

**功能：**
- 檔案上傳按鈕（支援 `.md`、`.markdown`、`.txt`）
- 字型選擇（Serif、Sans-serif、Monospace）
- 字體大小調整（A- / A+）
- 深色/淺色主題切換

---

### MarkdownViewer.vue

核心 Markdown 渲染元件。

**Props：**

| 名稱 | 型別 | 說明 |
|------|------|------|
| `content` | `string` | 要渲染的 Markdown 字串 |

**Emits：**

| 事件 | 參數 | 說明 |
|------|------|------|
| `headings` | `Heading[]` | 渲染完成後發出解析到的標題列表 |

**Heading 型別：**

```typescript
interface Heading {
  id: string
  text: string
  level: number
}
```

**功能：**
- 使用 `markdown-it` 渲染 Markdown
- 按需加載 `highlight.js` 進行語法高亮（支援 18+ 語言）
- 程式碼區塊懸停顯示一鍵複製按鈕
- 自動提取標題並產生錨點 id

---

### TableOfContents.vue

文章目錄側邊欄元件。

**Props：**

| 名稱 | 型別 | 說明 |
|------|------|------|
| `headings` | `Heading[]` | 標題列表（由 `MarkdownViewer` 提供） |
| `activeId` | `string` | 目前捲動位置對應的標題 id |

**功能：**
- 根據標題層級（h1–h3）顯示縮排目錄
- 點擊目錄項目平滑捲動至對應標題
- 高亮目前閱讀位置

---

## 組合式函數 Composables

### useTheme

管理應用程式深色/淺色主題。

```typescript
import { useTheme } from './composables/useTheme'

const { theme, toggle } = useTheme()
```

**返回值：**

| 名稱 | 型別 | 說明 |
|------|------|------|
| `theme` | `Ref<'light' \| 'dark'>` | 目前主題 |
| `toggle` | `() => void` | 切換主題 |

**說明：**
- 主題以 `data-theme` 屬性設置在 `<html>` 元素上
- 使用 `localStorage`（`mr-theme`）持久化設定

---

### useFontSettings

管理字體大小和字型設定。

```typescript
import { useFontSettings } from './composables/useFontSettings'

const { fontSize, fontFamily, increaseFontSize, decreaseFontSize, setFontFamily } = useFontSettings()
```

**返回值：**

| 名稱 | 型別 | 說明 |
|------|------|------|
| `fontSize` | `Ref<number>` | 目前字體大小（px），範圍 12–28 |
| `fontFamily` | `Ref<FontFamily>` | 目前字型 |
| `increaseFontSize` | `() => void` | 放大字體（+1px，最大 28） |
| `decreaseFontSize` | `() => void` | 縮小字體（-1px，最小 12） |
| `setFontFamily` | `(val: FontFamily) => void` | 設定字型 |

**FontFamily 型別：**

```typescript
type FontFamily = 'serif' | 'sans-serif' | 'monospace'
```

**CSS 變數：**

| 變數 | 說明 |
|------|------|
| `--reader-font-size` | 閱讀區字體大小 |
| `--reader-font-family` | 閱讀區字型 |

**說明：**
- 設定以 `localStorage`（`mr-font-size`、`mr-font-family`）持久化

---

## 工具函數 Utils

### throttle

節流函數，用於限制函數呼叫頻率。

```typescript
import { throttle } from './utils/throttle'

const handler = throttle((event: Event) => {
  // ...
}, 100)
```

**簽名：**

```typescript
function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void
```

**參數：**

| 名稱 | 型別 | 說明 |
|------|------|------|
| `func` | `T` | 要節流的函數 |
| `wait` | `number` | 最小呼叫間隔（毫秒） |

**說明：**
- 採用前緣 + 後緣觸發模式
- 主要用於捲動事件以提升渲染效能

---

## 授權

MIT License
