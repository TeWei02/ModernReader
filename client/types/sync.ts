export type SyncStatus = 'offline' | 'syncing' | 'synced' | 'conflict' | 'error'

export type EntityType =
    | 'book'
    | 'highlight'
    | 'note'
    | 'bookmark'
    | 'excerpt'
    | 'flashcard'
    | 'deck'
    | 'progress'
    | 'settings'

export type SyncOperation = 'create' | 'update' | 'delete'

export interface SyncRecord {
    id: string
    entityType: EntityType
    entityId: string
    operation: SyncOperation
    payload: unknown
    localTimestamp: number
    synced: boolean
    retries: number
    conflictResolution?: 'local-wins' | 'remote-wins' | 'manual'
}

export interface SyncConflict {
    id: string
    entityType: EntityType
    entityId: string
    localVersion: unknown
    remoteVersion: unknown
    detectedAt: number
    resolved: boolean
}

/** Abstract sync service interface — swap out for real backend later */
export interface ISyncService {
    getStatus(): SyncStatus
    push(records: SyncRecord[]): Promise<{ success: boolean; conflicts: SyncConflict[] }>
    pull(): Promise<SyncRecord[]>
    resolveConflict(conflictId: string, resolution: 'local-wins' | 'remote-wins'): Promise<void>
    subscribe(callback: (status: SyncStatus) => void): () => void
}

export interface UserAccount {
    id: string
    email?: string
    displayName?: string
    avatarUrl?: string
    createdAt: number
    plan: 'local' | 'cloud-free' | 'cloud-pro'
}

export interface ReaderSettings {
    fontSize: number           // px, 12–32
    fontFamily: 'serif' | 'sans-serif' | 'monospace'
    lineHeight: number         // 1.2–3.0
    pageWidth: number          // px, 400–1200
    theme: 'light' | 'dark' | 'sepia' | 'high-contrast'
    readingMode: 'scroll' | 'paginated'
    showWordCount: boolean
    showReadingTime: boolean
    highlightOnSelect: boolean
    autoBookmark: boolean
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
    fontSize: 17,
    fontFamily: 'serif',
    lineHeight: 1.8,
    pageWidth: 720,
    theme: 'light',
    readingMode: 'scroll',
    showWordCount: true,
    showReadingTime: true,
    highlightOnSelect: false,
    autoBookmark: true,
}
