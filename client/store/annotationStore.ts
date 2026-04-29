import { storage } from '@/services/storage'
import { enqueueSync } from '@/services/syncService'
import type { Bookmark, Deck, Excerpt, Flashcard, Highlight, HighlightColor, Note } from '@/types/annotation'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'

interface AnnotationState {
    highlights: Highlight[]
    notes: Note[]
    bookmarks: Bookmark[]
    excerpts: Excerpt[]
    flashcards: Flashcard[]
    decks: Deck[]
    isLoaded: boolean

    // Computed
    highlightsForBook: (bookId: string) => Highlight[]
    notesForBook: (bookId: string) => Note[]
    bookmarksForBook: (bookId: string) => Bookmark[]

    // Load
    loadAll: () => Promise<void>
    loadForBook: (bookId: string) => Promise<void>

    // Highlights
    addHighlight: (bookId: string, text: string, context: string, color: HighlightColor, location: number) => Promise<Highlight>
    updateHighlight: (id: string, changes: Partial<Highlight>) => Promise<void>
    removeHighlight: (id: string) => Promise<void>

    // Notes
    addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>
    updateNote: (id: string, content: string) => Promise<void>
    removeNote: (id: string) => Promise<void>

    // Bookmarks
    addBookmark: (bookId: string, name: string, location: number) => Promise<Bookmark>
    removeBookmark: (id: string) => Promise<void>

    // Excerpts
    addExcerpt: (excerpt: Omit<Excerpt, 'id' | 'createdAt'>) => Promise<Excerpt>
    removeExcerpt: (id: string) => Promise<void>

    // Flashcards (SM-2 spaced repetition)
    addFlashcard: (card: Omit<Flashcard, 'id' | 'createdAt' | 'interval' | 'repetition' | 'efactor' | 'nextReviewAt'>) => Promise<Flashcard>
    reviewFlashcard: (id: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => Promise<void>
    removeFlashcard: (id: string) => Promise<void>
    getDueFlashcards: (deckId: string) => Flashcard[]

    // Decks
    addDeck: (name: string, description?: string, bookId?: string) => Promise<Deck>
    updateDeck: (id: string, changes: Partial<Deck>) => Promise<void>
    removeDeck: (id: string) => Promise<void>
}

export const useAnnotationStore = create<AnnotationState>((set, get) => ({
    highlights: [],
    notes: [],
    bookmarks: [],
    excerpts: [],
    flashcards: [],
    decks: [],
    isLoaded: false,

    highlightsForBook: (bookId) => get().highlights.filter((h) => h.bookId === bookId),
    notesForBook: (bookId) => get().notes.filter((n) => n.bookId === bookId),
    bookmarksForBook: (bookId) => get().bookmarks.filter((b) => b.bookId === bookId),

    loadAll: async () => {
        const [highlights, notes, bookmarks, excerpts, flashcards, decks] = await Promise.all([
            storage.getAllHighlights(),
            storage.getAllNotes(),
            storage.getAllBookmarks(),
            storage.getAllExcerpts(),
            storage.getAllFlashcards(),
            storage.getAllDecks(),
        ])
        set({ highlights, notes, bookmarks, excerpts, flashcards, decks, isLoaded: true })
    },

    loadForBook: async (bookId) => {
        const [highlights, notes, bookmarks] = await Promise.all([
            storage.getHighlightsForBook(bookId),
            storage.getNotesForBook(bookId),
            storage.getBookmarksForBook(bookId),
        ])
        set((s) => ({
            highlights: [...s.highlights.filter((h) => h.bookId !== bookId), ...highlights],
            notes: [...s.notes.filter((n) => n.bookId !== bookId), ...notes],
            bookmarks: [...s.bookmarks.filter((b) => b.bookId !== bookId), ...bookmarks],
        }))
    },

    addHighlight: async (bookId, text, context, color, location) => {
        const h: Highlight = {
            id: uuidv4(), bookId, text, context, color, location,
            tags: [], createdAt: Date.now(), updatedAt: Date.now(),
        }
        await storage.putHighlight(h)
        await enqueueSync('highlight', h.id, 'create', h)
        set((s) => ({ highlights: [...s.highlights, h] }))
        return h
    },

    updateHighlight: async (id, changes) => {
        const h = get().highlights.find((x) => x.id === id)
        if (!h) return
        const updated = { ...h, ...changes, updatedAt: Date.now() }
        await storage.putHighlight(updated)
        await enqueueSync('highlight', id, 'update', changes)
        set((s) => ({ highlights: s.highlights.map((x) => (x.id === id ? updated : x)) }))
    },

    removeHighlight: async (id) => {
        await storage.removeHighlight(id)
        await enqueueSync('highlight', id, 'delete', {})
        set((s) => ({ highlights: s.highlights.filter((x) => x.id !== id) }))
    },

    addNote: async (noteData) => {
        const n: Note = { ...noteData, id: uuidv4(), tags: noteData.tags ?? [], createdAt: Date.now(), updatedAt: Date.now() }
        await storage.putNote(n)
        await enqueueSync('note', n.id, 'create', n)
        set((s) => ({ notes: [...s.notes, n] }))
        return n
    },

    updateNote: async (id, content) => {
        const n = get().notes.find((x) => x.id === id)
        if (!n) return
        const updated = { ...n, content, updatedAt: Date.now() }
        await storage.putNote(updated)
        await enqueueSync('note', id, 'update', { content })
        set((s) => ({ notes: s.notes.map((x) => (x.id === id ? updated : x)) }))
    },

    removeNote: async (id) => {
        await storage.removeNote(id)
        await enqueueSync('note', id, 'delete', {})
        set((s) => ({ notes: s.notes.filter((x) => x.id !== id) }))
    },

    addBookmark: async (bookId, name, location) => {
        const b: Bookmark = { id: uuidv4(), bookId, name, location, createdAt: Date.now() }
        await storage.putBookmark(b)
        await enqueueSync('bookmark', b.id, 'create', b)
        set((s) => ({ bookmarks: [...s.bookmarks, b] }))
        return b
    },

    removeBookmark: async (id) => {
        await storage.removeBookmark(id)
        await enqueueSync('bookmark', id, 'delete', {})
        set((s) => ({ bookmarks: s.bookmarks.filter((x) => x.id !== id) }))
    },

    addExcerpt: async (excerptData) => {
        const e: Excerpt = { ...excerptData, id: uuidv4(), tags: excerptData.tags ?? [], createdAt: Date.now() }
        await storage.putExcerpt(e)
        set((s) => ({ excerpts: [...s.excerpts, e] }))
        return e
    },

    removeExcerpt: async (id) => {
        await storage.removeExcerpt(id)
        set((s) => ({ excerpts: s.excerpts.filter((x) => x.id !== id) }))
    },

    addFlashcard: async (cardData) => {
        const card: Flashcard = {
            ...cardData,
            id: uuidv4(),
            interval: 1,
            repetition: 0,
            efactor: 2.5,
            nextReviewAt: Date.now(),
            createdAt: Date.now(),
        }
        await storage.putFlashcard(card)
        set((s) => ({ flashcards: [...s.flashcards, card] }))
        return card
    },

    // SM-2 algorithm implementation
    reviewFlashcard: async (id, quality) => {
        const card = get().flashcards.find((c) => c.id === id)
        if (!card) return

        let { interval, repetition, efactor } = card
        if (quality >= 3) {
            if (repetition === 0) interval = 1
            else if (repetition === 1) interval = 6
            else interval = Math.round(interval * efactor)
            repetition += 1
        } else {
            repetition = 0
            interval = 1
        }
        efactor = Math.max(1.3, efactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

        const updated: Flashcard = {
            ...card, interval, repetition, efactor,
            lastReviewedAt: Date.now(),
            nextReviewAt: Date.now() + interval * 24 * 60 * 60 * 1000,
        }
        await storage.putFlashcard(updated)
        set((s) => ({ flashcards: s.flashcards.map((c) => (c.id === id ? updated : c)) }))
    },

    removeFlashcard: async (id) => {
        await storage.removeFlashcard(id)
        set((s) => ({ flashcards: s.flashcards.filter((c) => c.id !== id) }))
    },

    getDueFlashcards: (deckId) => {
        const now = Date.now()
        return get().flashcards.filter((c) => c.deckId === deckId && c.nextReviewAt <= now)
    },

    addDeck: async (name, description, bookId) => {
        const deck: Deck = { id: uuidv4(), name, description, bookId, cardIds: [], createdAt: Date.now(), updatedAt: Date.now() }
        await storage.putDeck(deck)
        set((s) => ({ decks: [...s.decks, deck] }))
        return deck
    },

    updateDeck: async (id, changes) => {
        const deck = get().decks.find((d) => d.id === id)
        if (!deck) return
        const updated = { ...deck, ...changes, updatedAt: Date.now() }
        await storage.putDeck(updated)
        set((s) => ({ decks: s.decks.map((d) => (d.id === id ? updated : d)) }))
    },

    removeDeck: async (id) => {
        await storage.removeDeck(id)
        set((s) => ({ decks: s.decks.filter((d) => d.id !== id) }))
    },
}))
