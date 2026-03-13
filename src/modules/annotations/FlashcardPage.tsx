import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAnnotationStore } from '@/store/annotationStore'
import { useUIStore } from '@/store/uiStore'
import type { Deck, Flashcard } from '@/types/annotation'
import { clsx } from 'clsx'
import { useState } from 'react'

type Mode = 'list' | 'review' | 'add-card'

export default function FlashcardPage() {
    const decks = useAnnotationStore((s) => s.decks)
    const flashcards = useAnnotationStore((s) => s.flashcards)
    const getDueFlashcards = useAnnotationStore((s) => s.getDueFlashcards)
    const addDeck = useAnnotationStore((s) => s.addDeck)
    const removeDeck = useAnnotationStore((s) => s.removeDeck)
    const addFlashcard = useAnnotationStore((s) => s.addFlashcard)
    const reviewFlashcard = useAnnotationStore((s) => s.reviewFlashcard)
    const removeFlashcard = useAnnotationStore((s) => s.removeFlashcard)
    const openConfirm = useUIStore((s) => s.openConfirm)
    const addToast = useUIStore((s) => s.addToast)

    const [mode, setMode] = useState<Mode>('list')
    const [activeDeckId, setActiveDeckId] = useState<string | null>(null)
    const [reviewQueue, setReviewQueue] = useState<Flashcard[]>([])
    const [reviewIdx, setReviewIdx] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const [newDeckName, setNewDeckName] = useState('')
    const [showNewDeck, setShowNewDeck] = useState(false)
    const [newFront, setNewFront] = useState('')
    const [newBack, setNewBack] = useState('')

    const activeDeck = decks.find((d) => d.id === activeDeckId)

    const startReview = (deckId: string) => {
        const due = getDueFlashcards(deckId)
        if (due.length === 0) { addToast('No cards due for review!', 'info'); return }
        setReviewQueue(due)
        setReviewIdx(0)
        setFlipped(false)
        setActiveDeckId(deckId)
        setMode('review')
    }

    const handleRate = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
        await reviewFlashcard(reviewQueue[reviewIdx].id, quality)
        if (reviewIdx + 1 >= reviewQueue.length) {
            addToast(`Review complete! ${reviewQueue.length} cards reviewed.`, 'success')
            setMode('list')
        } else {
            setReviewIdx(reviewIdx + 1)
            setFlipped(false)
        }
    }

    const handleAddCard = async () => {
        if (!activeDeckId || !newFront.trim() || !newBack.trim()) return
        await addFlashcard({ deckId: activeDeckId, front: newFront.trim(), back: newBack.trim(), tags: [] })
        setNewFront('')
        setNewBack('')
        addToast('Card added', 'success')
    }

    const handleCreateDeck = async () => {
        if (!newDeckName.trim()) return
        const deck = await addDeck(newDeckName.trim())
        setActiveDeckId(deck.id)
        setNewDeckName('')
        setShowNewDeck(false)
        addToast(`Deck "${deck.name}" created`, 'success')
    }

    // Review mode
    if (mode === 'review' && reviewQueue[reviewIdx]) {
        const card = reviewQueue[reviewIdx]
        return (
            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setMode('list')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">← Back</button>
                    <h2 className="font-semibold text-[var(--text-heading)]">{activeDeck?.name}</h2>
                    <span className="ml-auto text-sm text-[var(--text-secondary)]">{reviewIdx + 1} / {reviewQueue.length}</span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-[var(--border)] rounded-full mb-6">
                    <div className="h-1.5 bg-accent-500 rounded-full transition-all" style={{ width: `${(reviewIdx / reviewQueue.length) * 100}%` }} />
                </div>

                {/* Card */}
                <div
                    className={clsx(
                        'rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-secondary)] p-8 cursor-pointer text-center transition-all min-h-52 flex flex-col items-center justify-center gap-4',
                        'hover:border-accent-400 hover:shadow-lg'
                    )}
                    onClick={() => setFlipped((v) => !v)}
                >
                    {!flipped ? (
                        <>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Front</p>
                            <p className="text-xl text-[var(--text-heading)] font-medium leading-relaxed">{card.front}</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-2">Click to reveal answer</p>
                        </>
                    ) : (
                        <>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Back</p>
                            <p className="text-xl text-[var(--text-heading)] font-medium leading-relaxed">{card.back}</p>
                        </>
                    )}
                </div>

                {/* Rating buttons — only show after flip */}
                {flipped && (
                    <div className="mt-6">
                        <p className="text-xs text-center text-[var(--text-secondary)] mb-3">How well did you remember?</p>
                        <div className="grid grid-cols-4 gap-2">
                            {([
                                { q: 1 as const, label: 'Forgot', cls: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300' },
                                { q: 2 as const, label: 'Hard', cls: 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300' },
                                { q: 3 as const, label: 'Medium', cls: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300' },
                                { q: 5 as const, label: 'Easy', cls: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300' },
                            ]).map(({ q, label, cls }) => (
                                <button
                                    key={q}
                                    onClick={() => handleRate(q)}
                                    className={clsx('rounded-xl py-3 text-sm font-medium transition-colors', cls)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // Deck list
    return (
        <div className="max-w-3xl mx-auto px-6 py-6">
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-heading)]">Flashcard Decks</h2>
                <button
                    onClick={() => setShowNewDeck(true)}
                    className="ml-auto rounded-lg bg-accent-600 text-white text-sm px-3 py-1.5 hover:bg-accent-700 transition-colors flex items-center gap-1.5"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Deck
                </button>
            </div>

            {decks.length === 0 ? (
                <EmptyDecks onCreate={() => setShowNewDeck(true)} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {decks.map((deck) => {
                        const cards = flashcards.filter((c) => c.deckId === deck.id)
                        const due = getDueFlashcards(deck.id).length
                        return (
                            <DeckCard
                                key={deck.id}
                                deck={deck}
                                cardCount={cards.length}
                                dueCount={due}
                                onReview={() => startReview(deck.id)}
                                onAddCard={() => { setActiveDeckId(deck.id); setMode('add-card') }}
                                onDelete={() => openConfirm('Delete Deck', `Delete deck "${deck.name}" and all its cards?`, async () => {
                                    await removeDeck(deck.id)
                                    addToast('Deck deleted', 'info')
                                })}
                            />
                        )
                    })}
                </div>
            )}

            {/* Cards for selected deck */}
            {mode === 'add-card' && activeDeck && (
                <div className="border-t border-[var(--border)] pt-6">
                    <h3 className="font-semibold text-[var(--text-heading)] mb-4">Add cards to "{activeDeck.name}"</h3>
                    <div className="flex flex-col gap-3 max-w-md">
                        <Textarea label="Front (Question)" value={newFront} onChange={(e) => setNewFront(e.target.value)} placeholder="Question…" />
                        <Textarea label="Back (Answer)" value={newBack} onChange={(e) => setNewBack(e.target.value)} placeholder="Answer…" />
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setMode('list')}>Done</Button>
                            <Button onClick={handleAddCard} disabled={!newFront.trim() || !newBack.trim()}>Add Card</Button>
                        </div>
                    </div>
                    {/* Existing cards */}
                    <div className="mt-4 flex flex-col gap-2">
                        {flashcards.filter((c) => c.deckId === activeDeckId).map((c) => (
                            <div key={c.id} className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-xs group">
                                <div className="flex-1">
                                    <p className="font-medium text-[var(--text-heading)]">{c.front}</p>
                                    <p className="text-[var(--text-secondary)] mt-0.5">{c.back}</p>
                                </div>
                                <button
                                    onClick={() => openConfirm('Delete Card', 'Remove this flashcard?', () => removeFlashcard(c.id))}
                                    className="opacity-0 group-hover:opacity-100 text-[var(--text-secondary)] hover:text-red-500 transition-all"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New deck modal */}
            <Modal open={showNewDeck} title="New Deck" onClose={() => setShowNewDeck(false)} size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowNewDeck(false)}>Cancel</Button>
                        <Button onClick={handleCreateDeck} disabled={!newDeckName.trim()}>Create</Button>
                    </>
                }
            >
                <Input
                    label="Deck Name"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleCreateDeck() }}
                    autoFocus
                    placeholder="e.g. Chapter 1 Vocabulary"
                />
            </Modal>
        </div>
    )
}

function DeckCard({ deck, cardCount, dueCount, onReview, onAddCard, onDelete }: {
    deck: Deck; cardCount: number; dueCount: number;
    onReview: () => void; onAddCard: () => void; onDelete: () => void
}) {
    return (
        <div className="group rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 hover:border-accent-400 transition-all">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="font-semibold text-[var(--text-heading)]">{deck.name}</p>
                    {deck.description && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{deck.description}</p>}
                </div>
                <button onClick={onDelete} aria-label="Delete deck"
                    className="opacity-0 group-hover:opacity-100 text-[var(--text-secondary)] hover:text-red-500 transition-all text-lg leading-none">×</button>
            </div>
            <div className="flex gap-3 text-xs text-[var(--text-secondary)] mb-4">
                <span>{cardCount} cards</span>
                {dueCount > 0 && <span className="text-amber-500 font-medium">{dueCount} due</span>}
            </div>
            <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={onAddCard} className="flex-1">+ Card</Button>
                {dueCount > 0 && <Button size="sm" onClick={onReview} className="flex-1">Review ({dueCount})</Button>}
            </div>
        </div>
    )
}

function EmptyDecks({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="text-center py-16">
            <p className="text-5xl mb-4">🃏</p>
            <p className="text-lg font-semibold text-[var(--text-heading)] mb-2">No flashcard decks yet</p>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Create a deck and add cards to study with spaced repetition (SM-2).</p>
            <Button onClick={onCreate}>Create your first deck</Button>
        </div>
    )
}
