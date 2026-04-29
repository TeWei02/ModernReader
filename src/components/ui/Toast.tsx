import { useUIStore } from '@/store/uiStore'
import { clsx } from 'clsx'
import { createPortal } from 'react-dom'

const typeStyles = {
    success: 'border-l-4 border-green-500 bg-green-50 dark:bg-green-950/40 text-green-900 dark:text-green-100',
    error: 'border-l-4 border-red-500   bg-red-50   dark:bg-red-950/40   text-red-900   dark:text-red-100',
    warning: 'border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100',
    info: 'border-l-4 border-accent-500 bg-accent-50 dark:bg-accent-950/40 text-accent-900 dark:text-accent-100',
}

const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ',
}

export function ToastContainer() {
    const toasts = useUIStore((s) => s.toasts)
    const removeToast = useUIStore((s) => s.removeToast)

    if (!toasts.length) return null

    return createPortal(
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    role="alert"
                    className={clsx(
                        'flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg text-sm animate-slide-in',
                        typeStyles[toast.type]
                    )}
                >
                    <span className="shrink-0 font-bold">{icons[toast.type]}</span>
                    <span className="flex-1">{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        aria-label="Dismiss"
                        className="shrink-0 opacity-60 hover:opacity-100 leading-none"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>,
        document.body
    )
}
