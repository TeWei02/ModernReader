import { clsx } from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
    loading?: boolean
}

const variantCls: Record<Variant, string> = {
    primary: 'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 focus-visible:ring-accent-400',
    secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] border border-[var(--border)] focus-visible:ring-accent-400',
    ghost: 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] focus-visible:ring-accent-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-400',
}

const sizeCls: Record<Size, string> = {
    sm: 'h-7 px-3 text-xs gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
    lg: 'h-11 px-6 text-base gap-2',
    icon: 'h-9 w-9 p-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading, disabled, children, className, ...rest }, ref) => (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={clsx(
                'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                variantCls[variant],
                sizeCls[size],
                className
            )}
            {...rest}
        >
            {loading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : children}
        </button>
    )
)
Button.displayName = 'Button'
