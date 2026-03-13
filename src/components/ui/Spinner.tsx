import { clsx } from 'clsx'

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    label?: string
}

const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }

export function Spinner({ size = 'md', className, label = 'Loading…' }: SpinnerProps) {
    return (
        <span role="status" aria-label={label} className={clsx('inline-block', className)}>
            <svg
                className={clsx('animate-spin text-accent-500', sizes[size])}
                viewBox="0 0 24 24"
                fill="none"
            >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </span>
    )
}

interface FullPageSpinnerProps {
    label?: string
}

export function FullPageSpinner({ label = 'Loading…' }: FullPageSpinnerProps) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-[var(--text-secondary)]">
            <Spinner size="lg" />
            <p className="text-sm">{label}</p>
        </div>
    )
}
