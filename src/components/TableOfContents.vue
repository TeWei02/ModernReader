<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  headings: { level: number; text: string; id: string }[]
  activeId: string
}>()

const collapsed = ref(false)

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <nav class="toc" :class="{ collapsed }">
    <div class="toc-header">
      <span class="toc-title">目錄</span>
      <button class="collapse-btn" @click="collapsed = !collapsed" :title="collapsed ? '展開' : '收合'">
        {{ collapsed ? '▶' : '◀' }}
      </button>
    </div>
    <transition name="toc-fade">
      <ul v-if="!collapsed" class="toc-list">
        <li
          v-for="h in headings"
          :key="h.id"
          :class="['toc-item', `toc-h${h.level}`, { active: activeId === h.id }]"
          @click="scrollTo(h.id)"
        >
          {{ h.text }}
        </li>
      </ul>
    </transition>
  </nav>
</template>

<style scoped>
.toc {
  position: sticky;
  top: 64px;
  width: 260px;
  min-width: 260px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  padding: 1rem 0;
  transition: width 0.2s, min-width 0.2s;
  flex-shrink: 0;
}
.toc.collapsed {
  width: 48px;
  min-width: 48px;
}
.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem 0.75rem;
  border-bottom: 1px solid var(--border);
  gap: 0.5rem;
}
.toc-title {
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
}
.collapsed .toc-title { opacity: 0; width: 0; }
.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.75rem;
  padding: 4px;
  border-radius: 4px;
  flex-shrink: 0;
  transition: background 0.15s;
}
.collapse-btn:hover { background: var(--hover-bg); }

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}
.toc-item {
  cursor: pointer;
  padding: 0.3rem 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
  border-left: 3px solid transparent;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
  word-break: break-word;
}
.toc-item:hover { color: var(--accent); background: var(--hover-bg); }
.toc-item.active { color: var(--accent); border-left-color: var(--accent); font-weight: 600; }
.toc-h1 { padding-left: 1rem; }
.toc-h2 { padding-left: 1.5rem; }
.toc-h3 { padding-left: 2.25rem; font-size: 0.8rem; }
.toc-h4 { padding-left: 3rem; font-size: 0.78rem; }

.toc-fade-enter-active,
.toc-fade-leave-active { transition: opacity 0.2s; }
.toc-fade-enter-from,
.toc-fade-leave-to { opacity: 0; }

.toc::-webkit-scrollbar { width: 4px; }
.toc::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
</style>
