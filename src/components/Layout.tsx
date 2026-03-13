import { useUIStore } from '@/store/uiStore'
import { clsx } from 'clsx'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export default function Layout() {
    const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text-primary)]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div
                className={clsx(
                    'flex flex-1 flex-col overflow-hidden transition-all duration-200',
                    sidebarCollapsed ? 'ml-14' : 'ml-60'
                )}
            >
                <TopBar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
