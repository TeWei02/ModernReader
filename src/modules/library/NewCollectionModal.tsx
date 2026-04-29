import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useLibraryStore } from '@/store/libraryStore'
import { useUIStore } from '@/store/uiStore'
import { useState } from 'react'

interface NewCollectionModalProps {
    open: boolean
    onClose: () => void
}

export function NewCollectionModal({ open, onClose }: NewCollectionModalProps) {
    const addCollection = useLibraryStore((s) => s.addCollection)
    const addToast = useUIStore((s) => s.addToast)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleCreate = async () => {
        if (!name.trim()) { setError('Name is required.'); return }
        setLoading(true)
        setError('')
        try {
            await addCollection(name.trim(), description.trim() || undefined)
            addToast(`Collection "${name.trim()}" created`, 'success')
            setName('')
            setDescription('')
            onClose()
        } catch (err) {
            setError(String(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            open={open}
            title="New Collection"
            onClose={onClose}
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleCreate} loading={loading}>Create</Button>
                </>
            }
        >
            <div className="flex flex-col gap-3">
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Input
                    label="Name *"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError('') }}
                    placeholder="e.g. Research 2025"
                    autoFocus
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
