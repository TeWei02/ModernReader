import type { SyncStatus } from '@/types/sync'
import { create } from 'zustand'

interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    duration?: number
}

export type AccessibilityMode = 'standard' | 'kids' | 'senior'

interface UIState {
    syncStatus: SyncStatus
    toasts: Toast[]
    sidebarCollapsed: boolean
    isImportModalOpen: boolean
    isNewCollectionModalOpen: boolean
    accessibilityMode: AccessibilityMode
    confirmDialog: {
        open: boolean
        title: string
        message: string
        onConfirm: (() => void) | null
    }

    // Actions
    setSyncStatus: (s: SyncStatus) => void
    addToast: (msg: string, type?: Toast['type'], duration?: number) => void
    removeToast: (id: string) => void
    toggleSidebar: () => void
    setSidebarCollapsed: (v: boolean) => void
    openImportModal: () => void
    closeImportModal: () => void
    openNewCollectionModal: () => void
    closeNewCollectionModal: () => void
    openConfirm: (title: string, message: string, onConfirm: () => void) => void
    closeConfirm: () => void
    loadAccessibilityMode: () => void
    setAccessibilityMode: (mode: AccessibilityMode) => void
    cycleAccessibilityMode: () => void
}

let toastCounter = 0

export const useUIStore = create<UIState>((set) => ({
    syncStatus: 'offline',
    toasts: [],
    sidebarCollapsed: false,
    isImportModalOpen: false,
    isNewCollectionModalOpen: false,
    accessibilityMode: 'standard',
    confirmDialog: { open: false, title: '', message: '', onConfirm: null },

    setSyncStatus: (s) => set({ syncStatus: s }),

    addToast: (message, type = 'info', duration = 3500) => {
        const id = `toast-${++toastCounter}`
        set((s) => ({ toasts: [...s.toasts, { id, message, type, duration }] }))
        if (duration > 0) {
            setTimeout(() => {
                set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
            }, duration)
        }
    },

    removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

    openImportModal: () => set({ isImportModalOpen: true }),
    closeImportModal: () => set({ isImportModalOpen: false }),
    openNewCollectionModal: () => set({ isNewCollectionModalOpen: true }),
    closeNewCollectionModal: () => set({ isNewCollectionModalOpen: false }),

    openConfirm: (title, message, onConfirm) =>
        set({ confirmDialog: { open: true, title, message, onConfirm } }),

    closeConfirm: () =>
        set({ confirmDialog: { open: false, title: '', message: '', onConfirm: null } }),

    loadAccessibilityMode: () => {
        const raw = safeGetMode()
        const mode: AccessibilityMode = raw === 'kids' || raw === 'senior' ? raw : 'standard'
        applyAccessibilityModeToDom(mode)
        set({ accessibilityMode: mode })
    },

    setAccessibilityMode: (mode) => {
        safeSetMode(mode)
        applyAccessibilityModeToDom(mode)
        set({ accessibilityMode: mode })
    },

    cycleAccessibilityMode: () =>
        set((s) => {
            const next: AccessibilityMode = s.accessibilityMode === 'standard'
                ? 'kids'
                : s.accessibilityMode === 'kids'
                    ? 'senior'
                    : 'standard'
            safeSetMode(next)
            applyAccessibilityModeToDom(next)
            return { accessibilityMode: next }
        }),
}))

function safeGetMode(): string | null {
    try {
        return localStorage.getItem('mr-accessibility-mode')
    } catch {
        return null
    }
}

function safeSetMode(mode: AccessibilityMode): void {
    try {
        localStorage.setItem('mr-accessibility-mode', mode)
    } catch {
        // Ignore storage failures (private mode / restricted browser contexts).
    }
}

function applyAccessibilityModeToDom(mode: AccessibilityMode) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('data-accessibility-mode', mode)
    }
}
