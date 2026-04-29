import { useReaderStore } from '@/store/readerStore'

export function TypographyPanel() {
    const settings = useReaderStore((s) => s.settings)
    const updateSettings = useReaderStore((s) => s.updateSettings)
    const resetSettings = useReaderStore((s) => s.resetSettings)

    return (
        <div className="p-4 flex flex-col gap-5">
            {/* Font size */}
            <Setting label={`Font Size — ${settings.fontSize}px`}>
                <input
                    type="range"
                    min={12} max={32} step={1}
                    value={settings.fontSize}
                    onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                    className="w-full accent-accent-500"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
                    <span>12</span><span>32</span>
                </div>
            </Setting>

            {/* Line height */}
            <Setting label={`Line Height — ${settings.lineHeight}`}>
                <input
                    type="range"
                    min={1.2} max={3.0} step={0.1}
                    value={settings.lineHeight}
                    onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) })}
                    className="w-full accent-accent-500"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
                    <span>1.2</span><span>3.0</span>
                </div>
            </Setting>

            {/* Page width */}
            <Setting label={`Page Width — ${settings.pageWidth}px`}>
                <input
                    type="range"
                    min={400} max={1200} step={20}
                    value={settings.pageWidth}
                    onChange={(e) => updateSettings({ pageWidth: Number(e.target.value) })}
                    className="w-full accent-accent-500"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
                    <span>400</span><span>1200</span>
                </div>
            </Setting>

            {/* Font family */}
            <Setting label="Font Family">
                <div className="flex gap-2 flex-wrap">
                    {(['serif', 'sans-serif', 'monospace'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => updateSettings({ fontFamily: f })}
                            className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${settings.fontFamily === f
                                    ? 'border-accent-500 bg-accent-600/15 text-accent-600 dark:text-accent-400'
                                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                                }`}
                            style={{ fontFamily: f === 'serif' ? 'Georgia, serif' : f === 'sans-serif' ? 'Inter, sans-serif' : 'monospace' }}
                        >
                            {f === 'serif' ? 'Serif' : f === 'sans-serif' ? 'Sans' : 'Mono'}
                        </button>
                    ))}
                </div>
            </Setting>

            {/* Theme */}
            <Setting label="Theme">
                <div className="grid grid-cols-2 gap-2">
                    {(['light', 'dark', 'sepia', 'high-contrast'] as const).map((t) => {
                        const palette: Record<string, { bg: string; text: string }> = {
                            light: { bg: '#fafaf9', text: '#1a1a1a' },
                            dark: { bg: '#1a1917', text: '#e8e6e1' },
                            sepia: { bg: '#f4efe6', text: '#3d2b1f' },
                            'high-contrast': { bg: '#000', text: '#fff' },
                        }
                        const p = palette[t]
                        return (
                            <button
                                key={t}
                                onClick={() => updateSettings({ theme: t })}
                                className={`rounded-lg border px-2 py-2 text-xs transition-all flex items-center gap-2 ${settings.theme === t ? 'border-accent-500 ring-1 ring-accent-500' : 'border-[var(--border)]'
                                    }`}
                                style={{ background: p.bg, color: p.text }}
                            >
                                <span className="h-3 w-3 rounded-full border" style={{ background: p.bg, borderColor: p.text }} />
                                <span className="capitalize">{t}</span>
                            </button>
                        )
                    })}
                </div>
            </Setting>

            <button
                onClick={resetSettings}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-center"
            >
                Reset to defaults
            </button>
        </div>
    )
}

function Setting({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">{label}</p>
            {children}
        </div>
    )
}
