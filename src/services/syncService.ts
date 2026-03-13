/**
 * SyncService — Local-only implementation now; interface ready for cloud backend.
 * Replace LocalSyncService with a RemoteSyncService when backend is available.
 */

import type { ISyncService, SyncConflict, SyncRecord, SyncStatus } from '@/types/sync'
import { v4 as uuidv4 } from 'uuid'
import { storage } from './storage'

// ─── Local (no-op) implementation ─────────────────────────────────────────────

class LocalSyncService implements ISyncService {
    private status: SyncStatus = 'offline'
    private subscribers: Set<(s: SyncStatus) => void> = new Set()

    getStatus(): SyncStatus {
        return this.status
    }

    async push(records: SyncRecord[]): Promise<{ success: boolean; conflicts: SyncConflict[] }> {
        // In local mode: just mark all records as synced
        for (const r of records) {
            await storage.putSyncRecord({ ...r, synced: true })
        }
        this.notify('synced')
        return { success: true, conflicts: [] }
    }

    async pull(): Promise<SyncRecord[]> {
        // In local mode: nothing to pull from remote
        return []
    }

    async resolveConflict(_conflictId: string, _resolution: 'local-wins' | 'remote-wins'): Promise<void> {
        // no-op in local mode
    }

    subscribe(callback: (status: SyncStatus) => void): () => void {
        this.subscribers.add(callback)
        callback(this.status)
        return () => this.subscribers.delete(callback)
    }

    private notify(status: SyncStatus) {
        this.status = status;
        this.subscribers.forEach((cb) => cb(status))
    }
}

// ─── Sync queue helpers ────────────────────────────────────────────────────────

export async function enqueueSync(
    entityType: SyncRecord['entityType'],
    entityId: string,
    operation: SyncRecord['operation'],
    payload: unknown
): Promise<void> {
    const record: SyncRecord = {
        id: uuidv4(),
        entityType,
        entityId,
        operation,
        payload,
        localTimestamp: Date.now(),
        synced: false,
        retries: 0,
    }
    await storage.putSyncRecord(record)
}

export async function flushSyncQueue(service: ISyncService): Promise<void> {
    const pending = (await storage.getAllSyncRecords()).filter((r) => !r.synced)
    if (pending.length === 0) return

    const { success, conflicts } = await service.push(pending)

    if (success) {
        for (const r of pending) {
            await storage.removeSyncRecord(r.id)
        }
    }

    if (conflicts.length > 0) {
        console.warn('[Sync] Conflicts detected:', conflicts)
    }
}

// ─── Exported singleton ────────────────────────────────────────────────────────

export const syncService: ISyncService = new LocalSyncService()
