<script setup lang="ts">
import { useFontSettings } from '../composables/useFontSettings'
import { useTheme } from '../composables/useTheme'
import type { FontFamily } from '../composables/useFontSettings'
import type { Ref } from 'vue'

defineProps<{ 
  isLoading?: boolean
  fileInputRef?: Ref<HTMLInputElement | null>
}>()
defineEmits<{ upload: [event: Event] }>()

const { theme, toggle } = useTheme()
const { fontSize, fontFamily, increaseFontSize, decreaseFontSize, setFontFamily } = useFontSettings()

const fontOptions: { value: FontFamily; label: string }[] = [
  { value: 'serif', label: '襯線 Serif' },
  { value: 'sans-serif', label: '無襯線 Sans' },
  { value: 'monospace', label: '等寬 Mono' },
]
</script>

<template>
  <header class="toolbar">
    <div class="toolbar-brand">
      <span class="brand-icon">📖</span>
      <span class="brand-name">ModernReader</span>
    </div>
    <div class="toolbar-controls">
      <!-- File Upload -->
      <label class="btn btn-ghost" :class="{ 'btn-loading': isLoading }" title="上傳 .md 檔案 (⌘O)">
        <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 2a.5.5 0 0 1 .5.5v5.793l1.646-1.647a.5.5 0 0 1 .708.708l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5a.5.5 0 0 1 .708-.708L7.5 8.293V2.5A.5.5 0 0 1 8 2z"/>
          <path d="M4.406 10.342a2.5 2.5 0 0 0 1.677 4.27 2.5 2.5 0 0 0 2.5-2.5h-1a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 1.5-1.5v-1a2.5 2.5 0 0 0-1.677.73z"/>
          <path d="M12 3H9.5a.5.5 0 0 0 0 1H12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2.5a.5.5 0 0 0 0-1H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
        </svg>
        <span class="spinner" v-else></span>
        <span>{{ isLoading ? '讀取中...' : '開啟檔案' }}</span>
        <input 
          ref="fileInputRef" 
          type="file" 
          accept=".md,.markdown,.txt" 
          class="file-input" 
          @change="$emit('upload', $event)" 
          :disabled="isLoading" 
        />
      </label>

      <div class="divider" />

      <!-- Font Family -->
      <select
        class="select-control"
        :value="fontFamily"
        @change="setFontFamily(($event.target as HTMLSelectElement).value as FontFamily)"
        title="字型"
      >
        <option v-for="o in fontOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>

      <!-- Font Size -->
      <div class="font-size-ctrl">
        <button class="btn btn-icon" @click="decreaseFontSize" title="縮小字體 (⌘-)">A-</button>
        <span class="font-size-value">{{ fontSize }}</span>
        <button class="btn btn-icon" @click="increaseFontSize" title="放大字體 (⌘+)">A+</button>
      </div>

      <div class="divider" />

      <!-- Theme Toggle -->
      <button class="btn btn-icon" @click="toggle" :title="theme === 'light' ? '切換深色模式 (⌘K)' : '切換淺色模式 (⌘K)'">
        <span v-if="theme === 'light'">🌙</span>
        <span v-else>☀️</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background: var(--toolbar-bg);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.toolbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.brand-icon { font-size: 1.3rem; }
.brand-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.toolbar-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 6px 10px;
  transition: background 0.15s, color 0.15s;
  color: var(--text-primary);
  background: none;
  font-family: inherit;
}
.btn:hover { background: var(--hover-bg); }
.btn-icon { padding: 6px 8px; font-weight: 600; }
.btn-ghost { border: 1px solid var(--border); }
.file-input {
  display: none;
}
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.btn-loading {
  opacity: 0.7;
  cursor: not-allowed;
}
.select-control {
  background: var(--hover-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  padding: 5px 8px;
  font-size: 0.82rem;
  cursor: pointer;
  font-family: inherit;
}
.font-size-ctrl {
  display: flex;
  align-items: center;
  gap: 2px;
}
.font-size-value {
  font-size: 0.82rem;
  min-width: 22px;
  text-align: center;
  color: var(--text-secondary);
}
.divider {
  width: 1px;
  height: 20px;
  background: var(--border);
  margin: 0 4px;
}
</style>
