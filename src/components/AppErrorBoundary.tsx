import React from 'react'

interface State {
    hasError: boolean
    message: string
    stack?: string
}

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
    state: State = {
        hasError: false,
        message: '',
    }

    static getDerivedStateFromError(error: unknown): State {
        const message = error instanceof Error ? error.message : 'Unknown render error'
        return { hasError: true, message }
    }

    componentDidCatch(error: unknown): void {
        const stack = error instanceof Error ? error.stack : undefined
        this.setState({ stack })
    }

    render(): React.ReactNode {
        if (!this.state.hasError) {
            return this.props.children
        }

        return (
            <div style={{
                minHeight: '100vh',
                background: '#fff7ed',
                color: '#7c2d12',
                padding: '24px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}>
                <h1 style={{ fontSize: 18, marginBottom: 8 }}>ModernReader Runtime Error</h1>
                <p style={{ marginBottom: 12 }}>{this.state.message}</p>
                {this.state.stack && (
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{this.state.stack}</pre>
                )}
            </div>
        )
    }
}
