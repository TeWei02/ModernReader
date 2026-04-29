export interface Book {
    id: string
    title: string
    authors: string[]
    tags: string[]
    format: 'markdown' | 'txt' | 'epub' | 'pdf'
    source: 'local' | 'opds' | 'bookstore' | 'library'
    addedAt: number
    lastOpenedAt?: number
    readingProgress?: number  // 0-100 percentage
    totalWords?: number
    metadata: {
        cover?: string           // base64 or URL
        description?: string
        language?: string
        publisher?: string
        publishedDate?: string
        isbn?: string
        pageCount?: number
    }
    content?: string           // full text (markdown/txt); large files use IndexedDB only
    contentRef?: string        // key for IndexedDB large-content store
}

export interface Collection {
    id: string
    name: string
    description?: string
    icon?: string
    bookIds: string[]
    createdAt: number
    updatedAt: number
}

export interface Tag {
    id: string
    name: string
    color: string
}

export type SortField = 'title' | 'addedAt' | 'lastOpenedAt' | 'authors'
export type SortOrder = 'asc' | 'desc'
export type ViewMode = 'grid' | 'list'
export type BookFormat = Book['format']
export type BookSource = Book['source']
