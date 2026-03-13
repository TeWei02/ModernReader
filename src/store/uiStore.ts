import type { SyncStatus } from '@/types/sync'
import { create } from 'zustand'

interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    duration?: number
}

interface UIState {
    syncStatus: SyncStatus
    toasts: Toast[]
    sidebarCollapsed: boolean
    isImportModalOpen: boolean
    isNewCollectionModalOpen: boolean
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
}

let toastCounter = 0

export const useUIStore = create<UIState>((set) => ({
    syncStatus: 'offline',
    toasts: [],
    sidebarCollapsed: false,
    isImportModalOpen: false,
    isNewCollectionModalOpen: false,
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
}))
