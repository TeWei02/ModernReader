import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const theme = ref<Theme>(
  (localStorage.getItem('mr-theme') as Theme) ?? 'light'
)

watch(theme, (val) => {
  document.documentElement.setAttribute('data-theme', val)
  localStorage.setItem('mr-theme', val)
}, { immediate: true })

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  return { theme, toggle }
}
