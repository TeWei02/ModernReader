export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink'

export interface Highlight {
    id: string
    bookId: string
    text: string               // selected text content
    context: string            // ~100 chars surrounding for re-location
    color: HighlightColor
    location: number           // scroll percentage 0-100
    locationLabel?: string     // e.g. "Chapter 3, §2"
    tags: string[]
    createdAt: number
    updatedAt: number
}

export interface Note {
    id: string
    bookId: string
    highlightId?: string       // linked highlight (optional)
    title?: string
    content: string            // markdown note content
    location: number           // scroll percentage
    locationLabel?: string
    tags: string[]
    createdAt: number
    updatedAt: number
}

export interface Bookmark {
    id: string
    bookId: string
    name: string
    location: number           // scroll percentage
    createdAt: number
}

export interface Excerpt {
    id: string
    bookId: string
    bookTitle: string
    text: string
    note?: string
    tags: string[]
    createdAt: number
}

export interface Flashcard {
    id: string
    deckId: string
    bookId?: string
    highlightId?: string
    front: string
    back: string
    tags: string[]
    // SM-2 spaced repetition fields
    interval: number           // days until next review
    repetition: number         // number of successful reviews
    efactor: number            // ease factor (default 2.5)
    nextReviewAt: number       // timestamp
    lastReviewedAt?: number
    createdAt: number
}

export interface Deck {
    id: string
    name: string
    description?: string
    bookId?: string
    cardIds: string[]
    createdAt: number
    updatedAt: number
}

export interface StudySession {
    id: string
    deckId: string
    startedAt: number
    endedAt?: number
    cardsReviewed: number
    cardsCorrect: number
}

export interface StudyPlan {
    id: string
    bookId: string
    title: string
    targetDate?: number
    dailyGoalMinutes: number
    createdAt: number
}
