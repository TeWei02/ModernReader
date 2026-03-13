import { Button } from '@/components/ui/Button'
import { storage } from '@/services/storage'
import { useReaderStore } from '@/store/readerStore'
import { useUIStore } from '@/store/uiStore'
import type { ReaderSettings } from '@/types/sync'
import { DEFAULT_READER_SETTINGS } from '@/types/sync'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'

type Section = 'reading' | 'data' | 'ai' | 'about'

const SECTIONS: { id: Section; label: string; icon: string }[] = [
    { id: 'reading', label: 'Reading', icon: '📖' },
    { id: 'data', label: 'Data', icon: '💾' },
    { id: 'ai', label: 'AI & Services', icon: '🤖' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
]

const FONT_FAMILIES = [
    { value: 'serif' as const, label: 'Serif' },
    { value: 'sans-serif' as const, label: 'Sans-Serif' },
    { value: 'monospace' as const, label: 'Monospace' },
]

const THEMES = [
    { id: 'light', label: 'Light', bg: '#ffffff', text: '#1a1a2e' },
    { id: 'dark', label: 'Dark', bg: '#1a1a2e', text: '#e2e8f0' },
    { id: 'sepia', label: 'Sepia', bg: '#f5f0e8', text: '#3d2b1f' },
    { id: 'high-contrast', label: 'Contrast', bg: '#000000', text: '#ffffff' },
] as const

export default function SettingsPage() {
    const settings = useReaderStore((s) => s.settings)
    const updateSettings = useReaderStore((s) => s.updateSettings)
    const addToast = useUIStore((s) => s.addToast)
    const openConfirm = useUIStore((s) => s.openConfirm)

    const [section, setSection] = useState<Section>('reading')
    const [apiKey, setApiKey] = useState('')
    const [editingApiKey, setEditingApiKey] = useState(false)
    const [exporting, setExporting] = useState(false)

    // Load API key from settings store (never store in plain localStorage)
    useEffect(() => {
        storage.getSetting<string>('ai_api_key_hint').then((hint) => {
            if (hint) setApiKey(hint)
        })
    }, [])

    const handleResetSettings = () => {
        openConfirm('Reset Reading Settings', 'This will restore all reading preferences to default values.', async () => {
            await updateSettings(DEFAULT_READER_SETTINGS)
            addToast('Reading settings reset', 'success')
        })
    }

    const handleExportData = async () => {
        setExporting(true)
        try {
            const [books, highlights, notes, bookmarks, flashcards, decks] = await Promise.all([
                storage.getAllBooks(),
                storage.getAllItems<object>('highlights'),
                storage.getAllItems<object>('notes'),
                storage.getAllItems<object>('bookmarks'),
                storage.getAllItems<object>('flashcards'),
                storage.getAllItems<object>('decks'),
            ])
            const payload = { exportedAt: new Date().toISOString(), books, highlights, notes, bookmarks, flashcards, decks }
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = `modernreader-backup-${new Date().toISOString().split('T')[0]}.json`
            a.click()
            URL.revokeObjectURL(a.href)
            addToast('Data exported', 'success')
        } catch {
            addToast('Export failed', 'error')
        } finally {
            setExporting(false)
        }
    }

    const handleClearData = () => {
        openConfirm(
            'Clear All Data',
            'This will permanently delete ALL books, annotations, and settings. This action cannot be undone.',
            async () => {
                await storage.clearAllData()
                addToast('All data cleared. Reload the app.', 'info', 5000)
            }
        )
    }

    const handleSaveApiKey = async () => {
        // Store hint only (first 6 chars + *) for display; never log full key
        const hint = apiKey.length > 6 ? apiKey.slice(0, 6) + '…' : apiKey
        await storage.setSetting('ai_api_key_hint', hint)
        // In a real backend integration, the full key would be sent to your backend securely
        setEditingApiKey(false)
        addToast('AI API key saved (backend integration pending)', 'info')
    }

    return (
        <div className="flex max-w-4xl mx-auto min-h-0 h-full">
            {/* Sidebar */}
            <nav className="w-44 shrink-0 pt-6 pr-4">
                <ul className="flex flex-col gap-1">
                    {SECTIONS.map((s) => (
                        <li key={s.id}>
                            <button
                                onClick={() => setSection(s.id)}
                                className={clsx(
                                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                                    section === s.id
                                        ? 'bg-accent-600/10 text-accent-700 dark:text-accent-400 font-medium'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                                )}
                            >
                                <span>{s.icon}</span>
                                {s.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Content */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
                {section === 'reading' && (
                    <ReadingSection settings={settings} onUpdate={updateSettings} onReset={handleResetSettings} />
                )}
                {section === 'data' && (
                    <DataSection exporting={exporting} onExport={handleExportData} onClear={handleClearData} />
                )}
                {section === 'ai' && (
                    <AISection
                        apiKey={apiKey}
                        editing={editingApiKey}
                        onKeyChange={setApiKey}
                        onEdit={() => setEditingApiKey(true)}
                        onSave={handleSaveApiKey}
                        onCancel={() => setEditingApiKey(false)}
                    />
                )}
                {section === 'about' && <AboutSection />}
            </div>
        </div>
    )
}

/* ---------- Sub-sections ---------- */

function SectionHeader({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-5">
            <h2 className="text-base font-semibold text-[var(--text-heading)]">{title}</h2>
            {description && <p className="text-sm text-[var(--text-secondary)] mt-0.5">{description}</p>}
        </div>
    )
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
            <span className="text-sm text-[var(--text-primary)]">{label}</span>
            <div className="flex items-center gap-2">{children}</div>
        </div>
    )
}

function ReadingSection({ settings, onUpdate, onReset }: {
    settings: ReaderSettings
    onUpdate: (s: Partial<ReaderSettings>) => void
    onReset: () => void
}) {
    return (
        <div>
            <SectionHeader title="Reading Preferences" description="These defaults apply to all books." />

            {/* Theme */}
            <div className="mb-4">
                <p className="text-sm text-[var(--text-primary)] mb-2">Theme</p>
                <div className="flex gap-2">
                    {THEMES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => onUpdate({ theme: t.id as typeof settings.theme })}
                            className={clsx(
                                'rounded-xl px-4 py-2 text-xs border-2 transition-all',
                                settings.theme === t.id ? 'border-accent-500 scale-105' : 'border-transparent hover:border-[var(--border)]'
                            )}
                            style={{ background: t.bg, color: t.text }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Font family */}
            <SettingRow label="Font Family">
                <div className="flex rounded-lg border border-[var(--border)] overflow-hidden text-xs">
                    {FONT_FAMILIES.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => onUpdate({ fontFamily: f.value })}
                            className={clsx(
                                'px-3 py-1.5 border-l border-[var(--border)] first:border-0 transition-colors',
                                settings.fontFamily === f.value
                                    ? 'bg-accent-600/10 text-accent-600 dark:text-accent-400 font-medium'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </SettingRow>

            {/* Font size */}
            <SettingRow label={`Font Size (${settings.fontSize}px)`}>
                <input
                    type="range" min={12} max={32} step={1} value={settings.fontSize}
                    onChange={(e) => onUpdate({ fontSize: +e.target.value })}
                    className="w-28"
                />
            </SettingRow>

            {/* Line height */}
            <SettingRow label={`Line Height (${settings.lineHeight.toFixed(1)})`}>
                <input
                    type="range" min={1.2} max={3.0} step={0.1} value={settings.lineHeight}
                    onChange={(e) => onUpdate({ lineHeight: +e.target.value })}
                    className="w-28"
                />
            </SettingRow>

            {/* Page width */}
            <SettingRow label={`Page Width (${settings.pageWidth}px)`}>
                <input
                    type="range" min={400} max={1200} step={20} value={settings.pageWidth}
                    onChange={(e) => onUpdate({ pageWidth: +e.target.value })}
                    className="w-28"
                />
            </SettingRow>

            <div className="mt-5">
                <Button variant="secondary" size="sm" onClick={onReset}>Reset to defaults</Button>
            </div>
        </div>
    )
}

function DataSection({ exporting, onExport, onClear }: { exporting: boolean; onExport: () => void; onClear: () => void }) {
    return (
        <div>
            <SectionHeader title="Data Management" description="Export or clear all locally stored data." />
            <div className="flex flex-col gap-4 max-w-md">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                    <p className="text-sm font-medium text-[var(--text-heading)] mb-1">Export All Data</p>
                    <p className="text-xs text-[var(--text-secondary)] mb-3">Download a JSON backup of all your books, annotations, flashcards, and settings.</p>
                    <Button size="sm" variant="secondary" onClick={onExport} disabled={exporting}>
                        {exporting ? 'Exporting…' : 'Download JSON Backup'}
                    </Button>
                </div>
                <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10 p-4">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Clear All Data</p>
                    <p className="text-xs text-[var(--text-secondary)] mb-3">Permanently delete every book, annotation, and setting from this device. Not reversible.</p>
                    <Button size="sm" variant="danger" onClick={onClear}>Clear Everything</Button>
                </div>
            </div>
        </div>
    )
}

function AISection({ apiKey, editing, onKeyChange, onEdit, onSave, onCancel }: {
    apiKey: string; editing: boolean;
    onKeyChange: (v: string) => void; onEdit: () => void; onSave: () => void; onCancel: () => void
}) {
    return (
        <div>
            <SectionHeader title="AI &amp; Services" description="Configure external AI providers (optional)." />
            <div className="max-w-md rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                <p className="text-sm font-medium text-[var(--text-heading)] mb-1">OpenAI API Key</p>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                    Currently running in <span className="font-medium text-amber-600 dark:text-amber-400">mock mode</span>. Provide an API key to enable real AI features. The key is stored locally only.
                </p>

                {editing ? (
                    <div className="flex flex-col gap-2">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => onKeyChange(e.target.value)}
                            placeholder="sk-…"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:ring-1 focus:ring-accent-500"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={onSave}>Save</Button>
                            <Button size="sm" variant="secondary" onClick={onCancel}>Cancel</Button>
                        </div>
                    </div>
                ) : (
                    <Button size="sm" variant="secondary" onClick={onEdit}>
                        {apiKey ? 'Update Key' : 'Set API Key'}
                    </Button>
                )}
            </div>

            <div className="mt-4 max-w-md rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                <p className="text-sm font-medium text-[var(--text-heading)] mb-1">AI Features Status</p>
                <ul className="text-xs text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                    <li>Chapter summaries — mock</li>
                    <li>Q&amp;A on current text — mock</li>
                    <li>Simplified explanations — mock</li>
                    <li>Translation — mock</li>
                    <li>Auto flashcard generation — mock</li>
                </ul>
            </div>
        </div>
    )
}

function AboutSection() {
    return (
        <div>
            <SectionHeader title="About ModernReader" />
            <div className="max-w-md flex flex-col gap-4">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex flex-col gap-2">
                    <p className="text-sm font-medium text-[var(--text-heading)]">ModernReader</p>
                    <p className="text-xs text-[var(--text-secondary)]">A cross-platform deep reading and learning platform for serious study, research, and inclusive education.</p>
                    <p className="text-xs text-[var(--text-secondary)]">Version: <span className="font-mono">1.0.0-alpha</span></p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex flex-col gap-2">
                    <p className="text-sm font-medium text-[var(--text-heading)]">Data &amp; Privacy</p>
                    <p className="text-xs text-[var(--text-secondary)]">All data is stored locally on your device using IndexedDB. No data is sent to any server unless you enable AI features and provide an API key.</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex flex-col gap-2">
                    <p className="text-sm font-medium text-[var(--text-heading)]">Tech Stack</p>
                    <ul className="text-xs text-[var(--text-secondary)] space-y-0.5 list-disc list-inside">
                        <li>React 18 + TypeScript + Vite</li>
                        <li>Tailwind CSS + Zustand</li>
                        <li>markdown-it + highlight.js</li>
                        <li>IndexedDB (local storage)</li>
                        <li>SM-2 spaced repetition</li>
                    </ul>
                </div>
                <a
                    href="https://github.com/TeWei02/ModernReader"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-accent-600 hover:underline"
                >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    GitHub — TeWei02/ModernReader
                </a>
            </div>
        </div>
    )
}
