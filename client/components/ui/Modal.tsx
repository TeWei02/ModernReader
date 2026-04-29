import { clsx } from 'clsx'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'

interface ModalProps {
    open: boolean
    title: string
    onClose: () => void
    children: ReactNode
    footer?: ReactNode
    size?: 'sm' | 'md' | 'lg'
}

const sizeCls = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
}

export function Modal({ open, title, onClose, children, footer, size = 'md' }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)

    // Trap focus and handle ESC
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, onClose])

    if (!open) return null

    return createPortal(
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Panel */}
            <div className={clsx('relative z-10 w-full rounded-xl bg-[var(--bg)] shadow-2xl border border-[var(--border)] flex flex-col', sizeCls[size])}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
                    <h2 className="text-base font-semibold text-[var(--text-heading)]">{title}</h2>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 flex-1 overflow-y-auto">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border)]">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}

// Convenience wrapper for simple confirm modals
interface AlertModalProps {
    open: boolean
    title: string
    message: string
    onClose: () => void
    onConfirm: () => void
    confirmLabel?: string
    danger?: boolean
}

export function AlertModal({ open, title, message, onClose, onConfirm, confirmLabel = 'Confirm', danger }: AlertModalProps) {
    return (
        <Modal
            open={open}
            title={title}
            onClose={onClose}
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose() }}>
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            <p className="text-sm text-[var(--text-secondary)]">{message}</p>
        </Modal>
    )
}
