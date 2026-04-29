import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useLibraryStore } from '@/store/libraryStore'
import { useUIStore } from '@/store/uiStore'
import type { Book } from '@/types/book'
import { useRef, useState } from 'react'

const ACCEPTED_EXTS = ['.md', '.txt', '.epub']
const MAX_SIZE_MB = 50

function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file, 'UTF-8')
    })
}

function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
    })
}

function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length
}

export function ImportButton() {
    const closeImportModal = useUIStore((s) => s.closeImportModal)
    const addBook = useLibraryStore((s) => s.addBook)
    const addToast = useUIStore((s) => s.addToast)

    const fileRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState('')
    const [authors, setAuthors] = useState('')
    const [tags, setTags] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isDragging, setIsDragging] = useState(false)

    const selectFile = (f: File) => {
        // Validate extension
        const ext = '.' + f.name.split('.').pop()?.toLowerCase()
        if (!ACCEPTED_EXTS.includes(ext)) {
            setError(`Unsupported file type. Supported: ${ACCEPTED_EXTS.join(', ')}`)
            return
        }
        // Validate size
        if (f.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`File too large. Maximum size is ${MAX_SIZE_MB} MB.`)
            return
        }
        setError('')
        setFile(f)
        // Auto-fill title from filename
        const baseName = f.name.replace(/\.[^.]+$/, '')
        setTitle((t) => t || baseName)
    }

    const handleImport = async () => {
        if (!file) { setError('Please select a file.'); return }
        if (!title.trim()) { setError('Title is required.'); return }

        setLoading(true)
        setError('')
        try {
            const ext = '.' + file.name.split('.').pop()?.toLowerCase()
            const format = ext === '.epub' ? 'epub' : ext === '.pdf' ? 'pdf' : ext === '.md' ? 'markdown' : 'txt'

            let content: string | undefined
            if (format === 'markdown' || format === 'txt') {
                content = await readFileAsText(file)
            }
            // For EPUB, we'll store the raw base64 and handle parsing in reader
            let contentData: string | undefined
            if (format === 'epub') {
                contentData = await readFileAsDataURL(file)
            }

            const bookData: Omit<Book, 'id' | 'addedAt'> = {
                title: title.trim(),
                authors: authors.split(',').map((a) => a.trim()).filter(Boolean),
                tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                format,
                source: 'local',
                metadata: {
                    description: description.trim() || undefined,
                },
                content: content ?? contentData,
                totalWords: content ? countWords(content) : undefined,
            }

            await addBook(bookData)
            addToast(`"${title.trim()}" imported successfully`, 'success')
            closeImportModal()
        } catch (err) {
            setError(`Import failed: ${String(err)}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            open={true}
            title="Import Book"
            onClose={closeImportModal}
            size="md"
            footer={
                <>
                    <Button variant="secondary" onClick={closeImportModal}>Cancel</Button>
                    <Button onClick={handleImport} loading={loading} disabled={!file}>
                        Import
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                {/* Drop zone */}
                <div
                    className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${isDragging ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20' : 'border-[var(--border)] hover:border-accent-400'
                        }`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault()
                        setIsDragging(false)
                        const dropped = e.dataTransfer.files[0]
                        if (dropped) selectFile(dropped)
                    }}
                >
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".md,.txt,.epub"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) selectFile(f) }}
                    />
                    {file ? (
                        <div>
                            <p className="text-sm font-medium text-[var(--text-heading)]">📄 {file.name}</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-4xl mb-2">📥</p>
                            <p className="text-sm font-medium text-[var(--text-primary)]">Drop a file here or click to browse</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Supports .md, .txt, .epub (max {MAX_SIZE_MB} MB)</p>
                        </div>
                    )}
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Input
                    label="Title *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Book title"
                />
                <Input
                    label="Author(s)"
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                    placeholder="Author name, co-author…"
                />
                <Input
                    label="Tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="fiction, history, science…"
                />
                <Textarea
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description…"
                />
            </div>
        </Modal>
    )
}
