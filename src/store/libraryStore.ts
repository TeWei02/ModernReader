import { storage } from '@/services/storage'
import { enqueueSync } from '@/services/syncService'
import type { Book, Collection, SortField, SortOrder, ViewMode } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'

interface LibraryState {
    books: Book[]
    collections: Collection[]
    searchQuery: string
    selectedTags: string[]
    selectedCollectionId: string | null
    viewMode: ViewMode
    sortBy: SortField
    sortOrder: SortOrder
    isLoading: boolean
    error: string | null

    // Computed helpers
    filteredBooks: () => Book[]
    allTags: () => string[]

    // Actions
    loadAll: () => Promise<void>
    addBook: (book: Omit<Book, 'id' | 'addedAt'>) => Promise<Book>
    updateBook: (id: string, changes: Partial<Book>) => Promise<void>
    removeBook: (id: string) => Promise<void>
    markOpened: (id: string) => Promise<void>
    saveProgress: (id: string, progress: number) => Promise<void>

    setSearchQuery: (q: string) => void
    setSelectedTags: (tags: string[]) => void
    toggleTag: (tag: string) => void
    setViewMode: (mode: ViewMode) => void
    setSortBy: (field: SortField) => void
    setSortOrder: (order: SortOrder) => void
    setSelectedCollection: (id: string | null) => void

    addCollection: (name: string, description?: string) => Promise<Collection>
    updateCollection: (id: string, changes: Partial<Collection>) => Promise<void>
    removeCollection: (id: string) => Promise<void>
    addBookToCollection: (bookId: string, collectionId: string) => Promise<void>
    removeBookFromCollection: (bookId: string, collectionId: string) => Promise<void>
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
    books: [],
    collections: [],
    searchQuery: '',
    selectedTags: [],
    selectedCollectionId: null,
    viewMode: (localStorage.getItem('mr-view-mode') as ViewMode) ?? 'grid',
    sortBy: (localStorage.getItem('mr-sort-by') as SortField) ?? 'addedAt',
    sortOrder: (localStorage.getItem('mr-sort-order') as SortOrder) ?? 'desc',
    isLoading: false,
    error: null,

    filteredBooks: () => {
        const { books, searchQuery, selectedTags, selectedCollectionId, sortBy, sortOrder, collections } = get()
        let result = [...books]

        // Filter by collection
        if (selectedCollectionId) {
            const col = collections.find((c) => c.id === selectedCollectionId)
            if (col) result = result.filter((b) => col.bookIds.includes(b.id))
        }

        // Filter by search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            result = result.filter(
                (b) =>
                    b.title.toLowerCase().includes(q) ||
                    b.authors.some((a) => a.toLowerCase().includes(q)) ||
                    b.tags.some((t) => t.toLowerCase().includes(q)) ||
                    b.metadata.description?.toLowerCase().includes(q)
            )
        }

        // Filter by tags
        if (selectedTags.length > 0) {
            result = result.filter((b) => selectedTags.every((t) => b.tags.includes(t)))
        }

        // Sort
        result.sort((a, b) => {
            let av: string | number, bv: string | number
            if (sortBy === 'title') { av = a.title.toLowerCase(); bv = b.title.toLowerCase() }
            else if (sortBy === 'authors') { av = (a.authors[0] ?? '').toLowerCase(); bv = (b.authors[0] ?? '').toLowerCase() }
            else if (sortBy === 'lastOpenedAt') {
                av = a.lastOpenedAt ?? 0; bv = b.lastOpenedAt ?? 0
            }
            else { av = a.addedAt; bv = b.addedAt }

            if (av < bv) return sortOrder === 'asc' ? -1 : 1
            if (av > bv) return sortOrder === 'asc' ? 1 : -1
            return 0
        })

        return result
    },

    allTags: () => {
        const { books } = get()
        const tagSet = new Set<string>()
        books.forEach((b) => b.tags.forEach((t) => tagSet.add(t)))
        return Array.from(tagSet).sort()
    },

    loadAll: async () => {
        set({ isLoading: true, error: null })
        try {
            const [books, collections] = await Promise.all([
                storage.getAllBooks(),
                storage.getAllCollections(),
            ])
            set({ books, collections, isLoading: false })
        } catch (err) {
            set({ isLoading: false, error: String(err) })
        }
    },

    addBook: async (bookData) => {
        const book: Book = {
            ...bookData,
            id: uuidv4(),
            addedAt: Date.now(),
        }
        await storage.putBook(book)
        if (book.content) {
            await storage.putBookContent(book.id, book.content)
            // Don't keep large content in memory
            book.content = undefined
            book.contentRef = book.id
        }
        await enqueueSync('book', book.id, 'create', book)
        set((s) => ({ books: [...s.books, book] }))
        return book
    },

    updateBook: async (id, changes) => {
        const book = get().books.find((b) => b.id === id)
        if (!book) return
        const updated = { ...book, ...changes }
        await storage.putBook(updated)
        await enqueueSync('book', id, 'update', changes)
        set((s) => ({ books: s.books.map((b) => (b.id === id ? updated : b)) }))
    },

    removeBook: async (id) => {
        await storage.removeBook(id)
        await storage.removeBookContent(id)
        await enqueueSync('book', id, 'delete', {})
        set((s) => ({ books: s.books.filter((b) => b.id !== id) }))
    },

    markOpened: async (id) => {
        await get().updateBook(id, { lastOpenedAt: Date.now() })
    },

    saveProgress: async (id, progress) => {
        await storage.putProgress(id, progress)
        await enqueueSync('progress', id, 'update', { progress })
        set((s) => ({
            books: s.books.map((b) => (b.id === id ? { ...b, readingProgress: progress } : b)),
        }))
    },

    setSearchQuery: (q) => set({ searchQuery: q }),

    setSelectedTags: (tags) => set({ selectedTags: tags }),

    toggleTag: (tag) => {
        const { selectedTags } = get()
        set({
            selectedTags: selectedTags.includes(tag)
                ? selectedTags.filter((t) => t !== tag)
                : [...selectedTags, tag],
        })
    },

    setViewMode: (mode) => {
        localStorage.setItem('mr-view-mode', mode)
        set({ viewMode: mode })
    },

    setSortBy: (field) => {
        localStorage.setItem('mr-sort-by', field)
        set({ sortBy: field })
    },

    setSortOrder: (order) => {
        localStorage.setItem('mr-sort-order', order)
        set({ sortOrder: order })
    },

    setSelectedCollection: (id) => set({ selectedCollectionId: id }),

    addCollection: async (name, description) => {
        const col: Collection = {
            id: uuidv4(),
            name,
            description,
            bookIds: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
        await storage.putCollection(col)
        set((s) => ({ collections: [...s.collections, col] }))
        return col
    },

    updateCollection: async (id, changes) => {
        const col = get().collections.find((c) => c.id === id)
        if (!col) return
        const updated = { ...col, ...changes, updatedAt: Date.now() }
        await storage.putCollection(updated)
        set((s) => ({ collections: s.collections.map((c) => (c.id === id ? updated : c)) }))
    },

    removeCollection: async (id) => {
        await storage.removeCollection(id)
        set((s) => ({
            collections: s.collections.filter((c) => c.id !== id),
            selectedCollectionId: s.selectedCollectionId === id ? null : s.selectedCollectionId,
        }))
    },

    addBookToCollection: async (bookId, collectionId) => {
        const col = get().collections.find((c) => c.id === collectionId)
        if (!col || col.bookIds.includes(bookId)) return
        await get().updateCollection(collectionId, { bookIds: [...col.bookIds, bookId] })
    },

    removeBookFromCollection: async (bookId, collectionId) => {
        const col = get().collections.find((c) => c.id === collectionId)
        if (!col) return
        await get().updateCollection(collectionId, { bookIds: col.bookIds.filter((id) => id !== bookId) })
    },
}))
