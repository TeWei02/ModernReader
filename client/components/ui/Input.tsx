import { clsx } from 'clsx'
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: ReactNode
    wrapperClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, wrapperClassName, className, id, ...rest }, ref) => {
        const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`
        return (
            <div className={clsx('flex flex-col gap-1', wrapperClassName)}>
                {label && (
                    <label htmlFor={inputId} className="text-xs font-medium text-[var(--text-secondary)]">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-[var(--text-secondary)]">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={clsx(
                            'w-full rounded-lg border bg-[var(--bg)] text-[var(--text-primary)] text-sm',
                            'px-3 py-2 transition-colors placeholder:text-[var(--text-secondary)]',
                            'border-[var(--border)] focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500',
                            icon && 'pl-8',
                            error && 'border-red-500',
                            className
                        )}
                        {...rest}
                    />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        )
    }
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className, id, ...rest }, ref) => {
        const textareaId = id ?? `ta-${Math.random().toString(36).slice(2)}`
        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={textareaId} className="text-xs font-medium text-[var(--text-secondary)]">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={clsx(
                        'w-full rounded-lg border bg-[var(--bg)] text-[var(--text-primary)] text-sm',
                        'px-3 py-2 transition-colors placeholder:text-[var(--text-secondary)] resize-y min-h-[80px]',
                        'border-[var(--border)] focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500',
                        error && 'border-red-500',
                        className
                    )}
                    {...rest}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        )
    }
)
Textarea.displayName = 'Textarea'
