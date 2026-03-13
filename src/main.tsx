import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { useReaderStore } from './store/readerStore'
import './styles/global.css'

// Apply saved theme and reader settings before first render
useReaderStore.getState().loadSettings().catch(() => {
    // First-time users: apply defaults
    const { settings } = useReaderStore.getState()
    document.documentElement.setAttribute('data-theme', settings.theme)
})

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root not found')

createRoot(root).render(
    <StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </StrictMode>
)
