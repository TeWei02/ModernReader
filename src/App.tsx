import { ConfirmDialog } from '@/components/ConfirmDialog'
import Layout from '@/components/Layout'
import { ToastContainer } from '@/components/ui/Toast'
import { PUBLIC_DEMO_BOOKS } from '@/data/publicDemoBooks'
import AgentsPage from '@/modules/agents/AgentsPage'
import FlashcardPage from '@/modules/annotations/FlashcardPage'
import NotebookPage from '@/modules/annotations/NotebookPage'
import LibraryPage from '@/modules/library/LibraryPage'
import SettingsPage from '@/modules/settings/SettingsPage'
import ReaderPage from '@/pages/ReaderPage'
import { storage } from '@/services/storage'
import { useAnnotationStore } from '@/store/annotationStore'
import { useLibraryStore } from '@/store/libraryStore'
import { useUIStore } from '@/store/uiStore'
import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function App() {
    const loadAll = useLibraryStore((s) => s.loadAll)
    const addBook = useLibraryStore((s) => s.addBook)
    const books = useLibraryStore((s) => s.books)
    const loadAnnotations = useAnnotationStore((s) => s.loadAll)
    const addToast = useUIStore((s) => s.addToast)
    const seededRef = useRef(false)

    useEffect(() => {
        const bootstrap = async () => {
            await Promise.all([loadAll(), loadAnnotations()])
        }
        bootstrap()
    }, [loadAll, loadAnnotations])

    useEffect(() => {
        if (seededRef.current) return
        seededRef.current = true

        const seedPublicDemo = async () => {
            // Only seed for first-run demo and when library is empty.
            if (books.length > 0) return

            const alreadySeeded = await storage.getSetting<boolean>('mr-public-demo-seeded')
            if (alreadySeeded) return

            for (const demoBook of PUBLIC_DEMO_BOOKS) {
                await addBook(demoBook)
            }

            await storage.setSetting('mr-public-demo-seeded', true)
            addToast('Public demo library imported automatically.', 'success', 4200)
        }

        seedPublicDemo().catch(() => {
            addToast('Failed to import public demo library.', 'warning', 4200)
        })
    }, [addBook, addToast, books.length])

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<LibraryPage />} />
                    <Route path="notebook" element={<NotebookPage />} />
                    <Route path="flashcards" element={<FlashcardPage />} />
                    <Route path="agents" element={<AgentsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
                <Route path="/reader/:id" element={<ReaderPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer />
            <ConfirmDialog />
        </>
    )
}
