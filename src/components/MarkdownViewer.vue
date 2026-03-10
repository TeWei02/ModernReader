<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'

// Import only commonly used languages
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import php from 'highlight.js/lib/languages/php'
import ruby from 'highlight.js/lib/languages/ruby'
import bash from 'highlight.js/lib/languages/bash'
import shell from 'highlight.js/lib/languages/shell'
import sql from 'highlight.js/lib/languages/sql'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import markdown from 'highlight.js/lib/languages/markdown'
import yaml from 'highlight.js/lib/languages/yaml'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c++', cpp)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('cs', csharp)
hljs.registerLanguage('go', go)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('php', php)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('rb', ruby)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('sh', shell)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('md', markdown)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('yml', yaml)

const props = defineProps<{ content: string }>()
const emit = defineEmits<{
  headings: [headings: { level: number; text: string; id: string }[]]
}>()

const containerRef = ref<HTMLElement | null>(null)

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<pre class="hljs-block"><code class="hljs language-${lang}">` +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        )
      } catch {}
    }
    return `<pre class="hljs-block"><code class="hljs">` + md.utils.escapeHtml(str) + '</code></pre>'
  },
})

// Collect headings during parsing
let headingsCache: { level: number; text: string; id: string }[] = []

// Patch renderer to add IDs on headings and collect them
const defaultHeadingRender =
  md.renderer.rules.heading_open ||
  function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options)
  }

md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const inlineToken = tokens[idx + 1]
  const text = inlineToken ? inlineToken.content : ''
  const level = parseInt(token.tag.substring(1))
  const id = text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  
  token.attrSet('id', id)
  
  // Collect heading during render (only h1-h4)
  if (level <= 4) {
    headingsCache.push({ level, text, id })
  }
  
  return defaultHeadingRender(tokens, idx, options, env, self)
}

const rendered = computed(() => {
  headingsCache = []
  const html = md.render(props.content)
  emit('headings', [...headingsCache])
  return html
})

// Add copy buttons to code blocks
function addCopyButtons() {
  if (!containerRef.value) return
  
  const codeBlocks = containerRef.value.querySelectorAll('pre.hljs-block')
  codeBlocks.forEach((block) => {
    // Skip if copy button already exists
    if (block.querySelector('.copy-btn')) return
    
    const button = document.createElement('button')
    button.className = 'copy-btn'
    button.innerHTML = `
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
    `
    button.title = '複製程式碼'
    
    button.addEventListener('click', async () => {
      const code = block.querySelector('code')?.textContent || ''
      try {
        await navigator.clipboard.writeText(code)
        button.classList.add('copied')
        button.innerHTML = `
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        `
        setTimeout(() => {
          button.classList.remove('copied')
          button.innerHTML = `
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          `
        }, 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    })
    
    ;(block as HTMLElement).style.position = 'relative'
    block.appendChild(button)
  })
}

// Watch for content changes and add copy buttons
onMounted(() => {
  addCopyButtons()
  // Use MutationObserver to detect when content changes
  const observer = new MutationObserver(() => {
    addCopyButtons()
  })
  if (containerRef.value) {
    observer.observe(containerRef.value, { childList: true, subtree: true })
  }
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div ref="containerRef" class="markdown-body" v-html="rendered" />
</template>

<style scoped>
.markdown-body {
  font-size: var(--reader-font-size, 17px);
  font-family: var(--reader-font-family, serif);
  line-height: 1.8;
  color: var(--text-primary);
  max-width: 780px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  word-break: break-word;
}
:deep(h1),
:deep(h2),
:deep(h3),
:deep(h4) {
  color: var(--text-heading);
  font-weight: 700;
  margin: 2rem 0 0.75rem;
  line-height: 1.3;
  scroll-margin-top: 80px;
}
:deep(h1) { font-size: 2em; border-bottom: 2px solid var(--border); padding-bottom: 0.3em; }
:deep(h2) { font-size: 1.5em; border-bottom: 1px solid var(--border); padding-bottom: 0.2em; }
:deep(h3) { font-size: 1.2em; }
:deep(h4) { font-size: 1em; }
:deep(p) { margin: 0 0 1em; }
:deep(a) { color: var(--accent); text-decoration: underline; }
:deep(blockquote) {
  border-left: 4px solid var(--accent);
  margin: 1.2em 0;
  padding: 0.5em 1em;
  background: var(--blockquote-bg);
  border-radius: 0 6px 6px 0;
  color: var(--text-secondary);
}
:deep(.hljs-block) {
  background: var(--code-bg);
  border-radius: 8px;
  padding: 1em 1.2em;
  overflow-x: auto;
  margin: 1em 0;
  font-size: 0.875em;
  line-height: 1.6;
  position: relative;
}
:deep(.copy-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--hover-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 8px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.hljs-block:hover .copy-btn) {
  opacity: 1;
}
:deep(.copy-btn:hover) {
  background: var(--inline-code-bg);
  color: var(--text-primary);
}
:deep(.copy-btn.copied) {
  color: var(--accent);
  border-color: var(--accent);
}
:deep(code):not(:deep(.hljs-block) code) {
  background: var(--inline-code-bg);
  color: var(--inline-code-color);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.88em;
  font-family: "JetBrains Mono", monospace;
}
:deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
  font-size: 0.95em;
}
:deep(th),
:deep(td) {
  border: 1px solid var(--border);
  padding: 0.5em 0.8em;
  text-align: left;
}
:deep(th) {
  background: var(--table-header-bg);
  font-weight: 600;
}
:deep(tr:nth-child(even) td) { background: var(--table-row-alt); }
:deep(ul), :deep(ol) { padding-left: 1.5em; margin: 0.5em 0 1em; }
:deep(li) { margin: 0.25em 0; }
:deep(hr) { border: none; border-top: 1px solid var(--border); margin: 2em 0; }
:deep(img) { max-width: 100%; border-radius: 6px; }
</style>
