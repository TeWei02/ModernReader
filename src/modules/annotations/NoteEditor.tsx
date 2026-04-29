import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { useAnnotationStore } from '@/store/annotationStore'
import { useUIStore } from '@/store/uiStore'
import type { Note } from '@/types/annotation'
import { useState } from 'react'

interface NoteEditorProps {
    note: Note
    onClose: () => void
}

export function NoteEditor({ note, onClose }: NoteEditorProps) {
    const updateNote = useAnnotationStore((s) => s.updateNote)
    const addToast = useUIStore((s) => s.addToast)
    const [content, setContent] = useState(note.content)
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        try {
            await updateNote(note.id, content)
            addToast('Note updated', 'success')
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="rounded-xl border border-accent-300 bg-[var(--bg-secondary)] p-3 mb-2">
            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Edit Note</p>
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autoFocus
                className="text-xs min-h-24"
            />
            <div className="flex justify-end gap-2 mt-2">
                <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                <Button size="sm" loading={loading} onClick={handleSave}>Save</Button>
            </div>
        </div>
    )
}
