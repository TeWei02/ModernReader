export interface ReaderSummarySidebarState {
    selectedText: string
    summary: string | null
    isLoading: boolean
    error: string | null
    onSummarize: () => void
    onClearSelection: () => void
}
