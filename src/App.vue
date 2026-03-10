<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Toolbar from './components/Toolbar.vue'
import MarkdownViewer from './components/MarkdownViewer.vue'
import TableOfContents from './components/TableOfContents.vue'
import { throttle } from './utils/throttle'
import { useFontSettings } from './composables/useFontSettings'
import { useTheme } from './composables/useTheme'

const { increaseFontSize, decreaseFontSize } = useFontSettings()
const { toggle: toggleTheme } = useTheme()

const SAMPLE = `# ModernReader 歡迎

這是一款基於 **Vue 3 + TypeScript** 打造的現代化 Markdown 閱讀器。

## 功能特色

### 目錄导航

側邊欄會自動從文章標題生成目錄，點擊可快速跳轉。

### 深色 / 淺色模式

點擊右上角月亮/太陽圖示切換主題，設定會自動儲存。

### 字體設定

可切換 **Serif**、**Sans-serif**、**Monospace** 三種字型，也可調整字體大小。

### 本機檔案上傳

點擊工具列的「開啟檔案」上傳 \`.md\` 檔案，即可在此閱讀。

---

## Markdown 語法示範

### 程式碼

\`\`\`typescript
interface Reader {
  content: string
  theme: 'light' | 'dark'
  fontSize: number
}

function render(reader: Reader): string {
  return \`字體大小: \${reader.fontSize}px\`
}
\`\`\`

內嵌程式碼：\`const greeting = "Hello, World!"\`

### 引言

> 好的設計是盡可能減少設計的存在。
>
> — Dieter Rams

### 表格

| 功能     | 說明               | 狀態  |
| -------- | ------------------ | ----- |
| Markdown | 完整語法支援       | ✅    |
| 深色模式 | CSS 變數主題切換   | ✅    |
| TOC      | 自動生成目錄       | ✅    |
| 字體設定 | 字型 + 大小調整    | ✅    |

### 清單

- Vue 3 Composition API
- TypeScript 類型安全
- markdown-it 渲染引擎
- highlight.js 語法高亮

1. 開啟 ModernReader
2. 上傳或貼入 Markdown
3. 享受舒適的閱讀體驗

---

## 關於

ModernReader 致力於提供沉浸式閱讀體驗，專注在排版與可讀性。

### 技術堆疊

- **前端框架**：Vue 3 + Vite
- **語言**：TypeScript
- **Markdown**：markdown-it
- **語法高亮**：highlight.js
`

const markdownContent = ref(SAMPLE)
const headings = ref<{ level: number; text: string; id: string }[]>([])
const activeId = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

// File upload with validation and error handling
function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  // Validate file type
  const validExtensions = ['.md', '.markdown', '.txt']
  const fileName = file.name.toLowerCase()
  const isValidType = validExtensions.some(ext => fileName.endsWith(ext))
  
  if (!isValidType) {
    errorMessage.value = '請上傳 .md、.markdown 或 .txt 格式的檔案'
    input.value = ''
    setTimeout(() => errorMessage.value = '', 3000)
    return
  }
  
  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    errorMessage.value = '檔案大小不能超過 5MB'
    input.value = ''
    setTimeout(() => errorMessage.value = '', 3000)
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      if (content) {
        markdownContent.value = content
      } else {
        throw new Error('無法讀取檔案內容')
      }
    } catch (err) {
      errorMessage.value = '讀取檔案時發生錯誤'
      setTimeout(() => errorMessage.value = '', 3000)
    } finally {
      isLoading.value = false
      input.value = ''
    }
  }
  
  reader.onerror = () => {
    errorMessage.value = '讀取檔案失敗'
    isLoading.value = false
    input.value = ''
    setTimeout(() => errorMessage.value = '', 3000)
  }
  
  reader.readAsText(file, 'utf-8')
}

// Scroll spy with throttling
const onScroll = throttle(() => {
  const ids = headings.value.map((h) => h.id)
  for (let i = ids.length - 1; i >= 0; i--) {
    const el = document.getElementById(ids[i])
    if (el && el.getBoundingClientRect().top <= 80) {
      activeId.value = ids[i]
      return
    }
  }
  activeId.value = ids[0] ?? ''
}, 100)

// Keyboard shortcuts
const fileInputRef = ref<HTMLInputElement | null>(null)

function handleKeydown(e: KeyboardEvent) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modifier = isMac ? e.metaKey : e.ctrlKey
  
  if (!modifier) return
  
  switch (e.key.toLowerCase()) {
    case 'k':
      e.preventDefault()
      toggleTheme()
      break
    case '=':
    case '+':
      e.preventDefault()
      increaseFontSize()
      break
    case '-':
      e.preventDefault()
      decreaseFontSize()
      break
    case 'o':
      e.preventDefault()
      fileInputRef.value?.click()
      break
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="app">
    <Toolbar @upload="handleUpload" :is-loading="isLoading" :file-input-ref="fileInputRef" />
    <transition name="fade">
      <div v-if="errorMessage" class="error-toast">{{ errorMessage }}</div>
    </transition>
    <div class="layout">
      <TableOfContents :headings="headings" :activeId="activeId" />
      <main class="content-area">
        <MarkdownViewer
          :content="markdownContent"
          @headings="headings = $event"
        />
      </main>
    </div>
  </div>
</template>

<style>
#app {
  min-height: 100vh;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--bg);
}
.layout {
  display: flex;
  padding-top: 56px;
  min-height: calc(100vh - 56px);
}
.content-area {
  flex: 1;
  overflow: auto;
  min-width: 0;
}
.error-toast {
  position: fixed;
  top: 72px;
  left: 50%;
  transform: translateX(-50%);
  background: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-weight: 500;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}
</style>
