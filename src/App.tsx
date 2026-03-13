import { ConfirmDialog } from '@/components/ConfirmDialog'
import Layout from '@/components/Layout'
import { ToastContainer } from '@/components/ui/Toast'
import FlashcardPage from '@/modules/annotations/FlashcardPage'
import NotebookPage from '@/modules/annotations/NotebookPage'
import LibraryPage from '@/modules/library/LibraryPage'
import ReaderPage from '@/modules/reader/ReaderPage'
import SettingsPage from '@/modules/settings/SettingsPage'
import { useAnnotationStore } from '@/store/annotationStore'
import { useLibraryStore } from '@/store/libraryStore'
import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function App() {
    const loadAll = useLibraryStore((s) => s.loadAll)
    const loadAnnotations = useAnnotationStore((s) => s.loadAll)

    useEffect(() => {
        loadAll()
        loadAnnotations()
    }, [loadAll, loadAnnotations])

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<LibraryPage />} />
                    <Route path="notebook" element={<NotebookPage />} />
                    <Route path="flashcards" element={<FlashcardPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
                <Route path="/reader/:bookId" element={<ReaderPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer />
            <ConfirmDialog />
        </>
    )
}
