import { ref, watch } from 'vue'

export type FontFamily = 'serif' | 'sans-serif' | 'monospace'

const fontSize = ref<number>(
  parseInt(localStorage.getItem('mr-font-size') ?? '17')
)
const fontFamily = ref<FontFamily>(
  (localStorage.getItem('mr-font-family') as FontFamily) ?? 'serif'
)

const fontFamilyMap: Record<FontFamily, string> = {
  serif: '"Georgia", "Noto Serif TC", serif',
  'sans-serif': '"Inter", "Noto Sans TC", sans-serif',
  monospace: '"JetBrains Mono", "Courier New", monospace',
}

watch([fontSize, fontFamily], () => {
  document.documentElement.style.setProperty('--reader-font-size', `${fontSize.value}px`)
  document.documentElement.style.setProperty('--reader-font-family', fontFamilyMap[fontFamily.value])
  localStorage.setItem('mr-font-size', String(fontSize.value))
  localStorage.setItem('mr-font-family', fontFamily.value)
}, { immediate: true })

export function useFontSettings() {
  function increaseFontSize() {
    if (fontSize.value < 28) fontSize.value += 1
  }
  function decreaseFontSize() {
    if (fontSize.value > 12) fontSize.value -= 1
  }
  function setFontFamily(val: FontFamily) {
    fontFamily.value = val
  }
  return { fontSize, fontFamily, increaseFontSize, decreaseFontSize, setFontFamily }
}
