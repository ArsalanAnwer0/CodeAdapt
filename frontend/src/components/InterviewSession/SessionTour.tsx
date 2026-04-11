import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react'
import type { Persona } from './persona'

export interface SessionTourProps {
  open: boolean
  persona: Persona
  onClose: () => void
}

interface TourStep {
  title: string
  body: string
}

/**
 * First-run walkthrough shown once at the start of a user's first
 * interview. It's intentionally a centered modal instead of a true
 * spotlight overlay — pointing at live DOM nodes is brittle when the
 * layout shifts, and a modal keeps the copy readable at any size.
 *
 * Dismissal (X, "Skip", or finishing the last step) is persisted via
 * the `hasSeenSessionTour` preference flag by the parent.
 */
export default function SessionTour({
  open,
  persona,
  onClose,
}: SessionTourProps): React.ReactElement | null {
  const [index, setIndex] = useState<number>(0)

  if (!open) return null

  const steps: TourStep[] = [
    {
      title: `Meet ${persona.name}`,
      body: `${persona.name} is your ${persona.role}. They'll open with a question, react to your code as you type, and chime in when something stands out.`,
    },
    {
      title: 'Chat is the conversation',
      body:
        'Think out loud. The chat column on the right is where the interview actually happens — reply to their questions, explain your approach, ask for hints.',
    },
    {
      title: 'Follow-ups will surprise you',
      body:
        'Partway through, the interviewer will push a follow-up — a new requirement, a hidden bug, a tricky question. A sticky banner shows up above the editor when this happens.',
    },
    {
      title: 'Run code when you are ready',
      body:
        'Use Run to check your tests. A run after a follow-up counts as addressing it. Keyboard shortcuts: ⌘I triggers a practice follow-up, ⌘/ shows all shortcuts.',
    },
  ]

  const step = steps[index]
  const isLast = index === steps.length - 1

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-6 animate-fade-in"
      style={{ background: 'rgba(1,4,9,0.55)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Session walkthrough"
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 relative"
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)',
          boxShadow: '0 20px 60px rgba(1,4,9,0.35)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close walkthrough"
          className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition"
          style={{ color: 'var(--text-quaternary)' }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            }}
            aria-hidden="true"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-quaternary)' }}
          >
            Quick tour · {index + 1}/{steps.length}
          </span>
        </div>

        <h2
          className="text-[16px] font-bold mb-2"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
        >
          {step.title}
        </h2>
        <p
          className="text-[12.5px] leading-relaxed mb-5"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {step.body}
        </p>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-medium"
            style={{ color: 'var(--text-quaternary)' }}
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              aria-label="Previous step"
              className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5 transition"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (isLast) onClose()
                else setIndex((i) => i + 1)
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition hover:brightness-110"
              style={{ background: 'var(--accent-blue)' }}
            >
              {isLast ? 'Got it' : 'Next'}
              {!isLast && <ChevronRight className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {steps.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 18 : 6,
                background:
                  i === index
                    ? 'var(--accent-blue)'
                    : 'var(--border-primary)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
