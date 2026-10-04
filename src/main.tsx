import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { useReaderStore } from './store/readerStore'
import { useUIStore } from './store/uiStore'
import './styles/global.css'

// Apply saved theme and reader settings before first render
useReaderStore.getState().loadSettings().catch(() => {
    // First-time users: apply defaults
    const { settings } = useReaderStore.getState()
    document.documentElement.setAttribute('data-theme', settings.theme)
})

// Apply accessibility mode before first render; never block app startup if storage is restricted.
try {
    useUIStore.getState().loadAccessibilityMode()
} catch {
    document.documentElement.setAttribute('data-accessibility-mode', 'standard')
}

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root not found')

createRoot(root).render(
    <StrictMode>
        <AppErrorBoundary>
            <HashRouter>
                <App />
            </HashRouter>
        </AppErrorBoundary>
    </StrictMode>
)
