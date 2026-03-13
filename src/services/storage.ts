/**
 * StorageService — IndexedDB-backed persistence layer.
 * All business logic goes through Zustand stores; this handles raw I/O.
 */

import type { Bookmark, Deck, Excerpt, Flashcard, Highlight, Note } from '@/types/annotation'
import type { Book, Collection } from '@/types/book'
import type { SyncRecord } from '@/types/sync'

const DB_NAME = 'modernreader'
const DB_VERSION = 1

type StoreName =
    | 'books'
    | 'book_content'
    | 'collections'
    | 'highlights'
    | 'notes'
    | 'bookmarks'
    | 'excerpts'
    | 'flashcards'
    | 'decks'
    | 'sync_queue'
    | 'settings'
    | 'progress'

let _db: IDBDatabase | null = null

function openDB(): Promise<IDBDatabase> {
    if (_db) return Promise.resolve(_db)

    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION)

        req.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result

            const createStore = (name: StoreName, keyPath = 'id') => {
                if (!db.objectStoreNames.contains(name)) {
                    return db.createObjectStore(name, { keyPath })
                }
                return req.transaction!.objectStore(name)
            }

            const books = createStore('books')
            createStore('book_content')
            const collections = createStore('collections')
            const highlights = createStore('highlights')
            const notes = createStore('notes')
            const bookmarks = createStore('bookmarks')
            createStore('excerpts')
            createStore('flashcards')
            createStore('decks')
            createStore('sync_queue')
            createStore('settings', 'key')
            createStore('progress', 'bookId')

            books.createIndex('addedAt', 'addedAt', { unique: false })
            books.createIndex('lastOpenedAt', 'lastOpenedAt', { unique: false })
            books.createIndex('format', 'format', { unique: false })

            highlights.createIndex('bookId', 'bookId', { unique: false })
            highlights.createIndex('createdAt', 'createdAt', { unique: false })

            notes.createIndex('bookId', 'bookId', { unique: false })
            notes.createIndex('createdAt', 'createdAt', { unique: false })

            bookmarks.createIndex('bookId', 'bookId', { unique: false })

            collections.createIndex('createdAt', 'createdAt', { unique: false })
        }

        req.onsuccess = (e) => {
            _db = (e.target as IDBOpenDBRequest).result
            resolve(_db)
        }

        req.onerror = () => reject(req.error)
    })
}

function tx(storeName: StoreName, mode: IDBTransactionMode = 'readonly') {
    return openDB().then((db) => {
        const transaction = db.transaction(storeName, mode)
        const store = transaction.objectStore(storeName)
        return store
    })
}

function wrap<T>(req: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
    })
}

async function getAll<T>(storeName: StoreName): Promise<T[]> {
    const store = await tx(storeName)
    return wrap(store.getAll())
}

async function get<T>(storeName: StoreName, key: string): Promise<T | undefined> {
    const store = await tx(storeName)
    return wrap(store.get(key))
}

async function put<T>(storeName: StoreName, value: T): Promise<void> {
    const store = await tx(storeName, 'readwrite')
    await wrap(store.put(value))
}

async function remove(storeName: StoreName, key: string): Promise<void> {
    const store = await tx(storeName, 'readwrite')
    await wrap(store.delete(key))
}

async function getByIndex<T>(storeName: StoreName, indexName: string, value: string): Promise<T[]> {
    const store = await tx(storeName)
    const index = store.index(indexName)
    return wrap(index.getAll(value))
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const storage = {
    // Books
    getAllBooks: (): Promise<Book[]> => getAll('books'),
    getBook: (id: string) => get<Book>('books', id),
    putBook: (book: Book) => put('books', book),
    removeBook: (id: string) => remove('books', id),

    // Book content (stored separately to keep books list fast)
    getBookContent: (id: string) => get<{ id: string; content: string }>('book_content', id),
    putBookContent: (id: string, content: string) => put('book_content', { id, content }),
    removeBookContent: (id: string) => remove('book_content', id),

    // Collections
    getAllCollections: (): Promise<Collection[]> => getAll('collections'),
    putCollection: (c: Collection) => put('collections', c),
    removeCollection: (id: string) => remove('collections', id),

    // Highlights
    getAllHighlights: (): Promise<Highlight[]> => getAll('highlights'),
    getHighlightsForBook: (bookId: string) => getByIndex<Highlight>('highlights', 'bookId', bookId),
    putHighlight: (h: Highlight) => put('highlights', h),
    removeHighlight: (id: string) => remove('highlights', id),

    // Notes
    getAllNotes: (): Promise<Note[]> => getAll('notes'),
    getNotesForBook: (bookId: string) => getByIndex<Note>('notes', 'bookId', bookId),
    putNote: (n: Note) => put('notes', n),
    removeNote: (id: string) => remove('notes', id),

    // Bookmarks
    getAllBookmarks: (): Promise<Bookmark[]> => getAll('bookmarks'),
    getBookmarksForBook: (bookId: string) => getByIndex<Bookmark>('bookmarks', 'bookId', bookId),
    putBookmark: (b: Bookmark) => put('bookmarks', b),
    removeBookmark: (id: string) => remove('bookmarks', id),

    // Excerpts
    getAllExcerpts: (): Promise<Excerpt[]> => getAll('excerpts'),
    putExcerpt: (e: Excerpt) => put('excerpts', e),
    removeExcerpt: (id: string) => remove('excerpts', id),

    // Flashcards
    getAllFlashcards: (): Promise<Flashcard[]> => getAll('flashcards'),
    putFlashcard: (f: Flashcard) => put('flashcards', f),
    removeFlashcard: (id: string) => remove('flashcards', id),

    // Decks
    getAllDecks: (): Promise<Deck[]> => getAll('decks'),
    putDeck: (d: Deck) => put('decks', d),
    removeDeck: (id: string) => remove('decks', id),

    // Sync queue
    getAllSyncRecords: (): Promise<SyncRecord[]> => getAll('sync_queue'),
    putSyncRecord: (r: SyncRecord) => put('sync_queue', r),
    removeSyncRecord: (id: string) => remove('sync_queue', id),

    // Settings
    getSettings: () => get<{ key: string; value: unknown }>('settings', 'reader'),
    putSettings: (value: unknown) => put('settings', { key: 'reader', value }),

    // Generic settings key/value
    getSetting: <T>(key: string) =>
        get<{ key: string; value: T }>('settings', key).then((r) => r?.value),
    setSetting: <T>(key: string, value: T) => put('settings', { key, value }),

    // Generic getAll for any store (used by data export)
    getAllItems: <T>(storeName: StoreName) => getAll<T>(storeName),

    // Wipe all stores (used by "clear all data")
    clearAllData: async () => {
        const db = await openDB()
        const stores: StoreName[] = [
            'books', 'book_content', 'collections', 'highlights', 'notes',
            'bookmarks', 'excerpts', 'flashcards', 'decks', 'sync_queue', 'settings', 'progress',
        ]
        const t = db.transaction(stores, 'readwrite')
        await Promise.all(stores.map((s) => wrap(t.objectStore(s).clear())))
    },

    // Progress
    getProgress: (bookId: string) => get<{ bookId: string; position: number; updatedAt: number }>('progress', bookId),
    putProgress: (bookId: string, position: number) =>
        put('progress', { bookId, position, updatedAt: Date.now() }),
}
