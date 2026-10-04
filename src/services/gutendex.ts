export interface BookAuthor {
    name: string
    birth_year?: number | null
    death_year?: number | null
}

export interface Book {
    id: number
    title: string
    authors: BookAuthor[]
    formats: Record<string, string>
    download_count: number
}

interface GutendexResponse {
    count: number
    next: string | null
    previous: string | null
    results: Book[]
}

export async function fetchBooks(query: string): Promise<Book[]> {
    const trimmed = query.trim()
    const endpoint = trimmed
        ? `https://gutendex.com/books/?search=${encodeURIComponent(trimmed)}`
        : 'https://gutendex.com/books/'

    const response = await fetch(endpoint)
    if (!response.ok) {
        throw new Error(`Gutendex request failed: ${response.status}`)
    }

    const data = (await response.json()) as GutendexResponse
    return data.results
}
