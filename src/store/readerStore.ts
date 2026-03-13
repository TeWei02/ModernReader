import { storage } from '@/services/storage'
import type { ReaderSettings } from '@/types/sync'
import { DEFAULT_READER_SETTINGS } from '@/types/sync'
import { create } from 'zustand'

interface ReaderState {
    currentBookId: string | null
    settings: ReaderSettings
    tocVisible: boolean
    searchVisible: boolean
    annotationSidebarVisible: boolean
    aiPanelVisible: boolean
    typographyPanelVisible: boolean
    activeHeadingId: string
    searchQuery: string
    searchResults: string[]   // ids or text snippets
    isLoading: boolean

    // Actions
    openBook: (id: string) => void
    closeBook: () => void
    loadSettings: () => Promise<void>
    updateSettings: (changes: Partial<ReaderSettings>) => Promise<void>
    resetSettings: () => Promise<void>
    toggleToc: () => void
    toggleSearch: () => void
    toggleAnnotationSidebar: () => void
    toggleAiPanel: () => void
    toggleTypographyPanel: () => void
    setActiveHeading: (id: string) => void
    setSearchQuery: (q: string) => void
    setIsLoading: (v: boolean) => void
}

export const useReaderStore = create<ReaderState>((set, get) => ({
    currentBookId: null,
    settings: DEFAULT_READER_SETTINGS,
    tocVisible: true,
    searchVisible: false,
    annotationSidebarVisible: false,
    aiPanelVisible: false,
    typographyPanelVisible: false,
    activeHeadingId: '',
    searchQuery: '',
    searchResults: [],
    isLoading: false,

    openBook: (id) => {
        set({ currentBookId: id, isLoading: true })
        // Apply CSS variables from settings
        applySettingsToDom(get().settings)
    },

    closeBook: () => set({ currentBookId: null }),

    loadSettings: async () => {
        const raw = await storage.getSettings()
        if (raw?.value) {
            const saved = raw.value as Partial<ReaderSettings>
            const merged = { ...DEFAULT_READER_SETTINGS, ...saved }
            set({ settings: merged })
            applySettingsToDom(merged)
        }
    },

    updateSettings: async (changes) => {
        const updated = { ...get().settings, ...changes }
        set({ settings: updated })
        applySettingsToDom(updated)
        await storage.putSettings(updated)
    },

    resetSettings: async () => {
        set({ settings: DEFAULT_READER_SETTINGS })
        applySettingsToDom(DEFAULT_READER_SETTINGS)
        await storage.putSettings(DEFAULT_READER_SETTINGS)
    },

    toggleToc: () => set((s) => ({ tocVisible: !s.tocVisible })),
    toggleSearch: () => set((s) => ({ searchVisible: !s.searchVisible, annotationSidebarVisible: false, aiPanelVisible: false })),
    toggleAnnotationSidebar: () => set((s) => ({ annotationSidebarVisible: !s.annotationSidebarVisible, searchVisible: false, aiPanelVisible: false })),
    toggleAiPanel: () => set((s) => ({ aiPanelVisible: !s.aiPanelVisible, searchVisible: false, annotationSidebarVisible: false })),
    toggleTypographyPanel: () => set((s) => ({ typographyPanelVisible: !s.typographyPanelVisible })),
    setActiveHeading: (id) => set({ activeHeadingId: id }),
    setSearchQuery: (q) => set({ searchQuery: q }),
    setIsLoading: (v) => set({ isLoading: v }),
}))

const fontFamilyMap: Record<ReaderSettings['fontFamily'], string> = {
    'serif': '"Georgia", "Noto Serif TC", serif',
    'sans-serif': '"Inter", "Noto Sans TC", sans-serif',
    'monospace': '"JetBrains Mono", "Courier New", monospace',
}

function applySettingsToDom(s: ReaderSettings) {
    const root = document.documentElement
    root.setAttribute('data-theme', s.theme)
    root.style.setProperty('--reader-font-size', `${s.fontSize}px`)
    root.style.setProperty('--reader-font-family', fontFamilyMap[s.fontFamily])
    root.style.setProperty('--reader-line-height', String(s.lineHeight))
    root.style.setProperty('--reader-page-width', `${s.pageWidth}px`)
}
