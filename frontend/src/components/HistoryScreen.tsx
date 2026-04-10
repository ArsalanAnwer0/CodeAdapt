import React, { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Clock,
  Code2,
  MessageSquare,
  Sparkles,
  Trash2,
  History as HistoryIcon,
} from 'lucide-react'
import { useHistory } from '../stores/history'
import { formatDurationHuman, formatRelative } from '../lib/format'
import { APP_NAME } from '../lib/constants'
import Button from './ui/Button'
import Card from './ui/Card'
import Badge from './ui/Badge'
import IconButton from './ui/IconButton'
import ConfirmEndSessionModal from './ConfirmEndSessionModal'
import type { StoredResult } from '../types'

export interface HistoryScreenProps {
  onBack: () => void
  onOpen?: (result: StoredResult) => void
}

function difficultyTone(d: StoredResult['config']['difficulty']) {
  if (d === 'easy') return 'success' as const
  if (d === 'medium') return 'warning' as const
  return 'danger' as const
}

/**
 * Browse past session results. Acts as a lightweight dashboard —
 * click an entry to re-open its results screen.
 */
export default function HistoryScreen({
  onBack,
  onOpen,
}: HistoryScreenProps): React.ReactElement {
  const { history, remove, clear } = useHistory()
  const [confirmClear, setConfirmClear] = useState(false)

  const stats = useMemo(() => {
    if (history.length === 0) {
      return { count: 0, avgScore: 0, totalMinutes: 0 }
    }
    const total = history.reduce(
      (acc, r) => acc + r.metrics.adaptabilityScore,
      0
    )
    const minutes = history.reduce((acc, r) => acc + r.duration / 60, 0)
    return {
      count: history.length,
      avgScore: Math.round(total / history.length),
      totalMinutes: Math.round(minutes),
    }
  }, [history])

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <IconButton
              aria-label="Back to setup"
              icon={<ArrowLeft />}
              onClick={onBack}
              variant="subtle"
            />
            <div>
              <h1
                className="text-xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Session history
              </h1>
              <p
                className="text-[12px]"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Your recent {APP_NAME} runs
              </p>
            </div>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => setConfirmClear(true)}
            >
              Clear all
            </Button>
          )}
        </div>

        {history.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatCard label="Sessions" value={stats.count} />
            <StatCard label="Avg score" value={stats.avgScore} />
            <StatCard
              label="Time practiced"
              value={`${stats.totalMinutes}m`}
            />
          </div>
        )}

        {history.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-2">
            {history.map((r) => (
              <li key={r.id}>
                <Card
                  interactive={Boolean(onOpen)}
                  onClick={() => onOpen?.(r)}
                  padding="md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge tone={difficultyTone(r.config.difficulty)} size="sm">
                          {r.config.difficulty}
                        </Badge>
                        <Badge tone="info" size="sm">
                          {r.config.topic}
                        </Badge>
                        <Badge tone="neutral" size="sm">
                          {r.config.language}
                        </Badge>
                        <span
                          className="text-[11px]"
                          style={{ color: 'var(--text-quaternary)' }}
                        >
                          {formatRelative(new Date(r.completedAt))}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-4 text-[11px]"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDurationHuman(r.duration)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {r.messages.length} messages
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {r.injections.length} injections
                        </span>
                        <span className="flex items-center gap-1">
                          <Code2 className="w-3 h-3" />
                          {r.codeQualityScore}/100
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className="text-right min-w-[56px]"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <div className="text-lg font-bold leading-none">
                          {r.metrics.adaptabilityScore}
                        </div>
                        <div
                          className="text-[9px] uppercase tracking-wider mt-0.5"
                          style={{ color: 'var(--text-quaternary)' }}
                        >
                          Score
                        </div>
                      </div>
                      <IconButton
                        aria-label="Delete session"
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 />}
                        onClick={(e) => {
                          e.stopPropagation()
                          remove(r.id)
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmEndSessionModal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={clear}
        summary={`This will delete all ${history.length} stored sessions.`}
      />
    </div>
  )
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}): React.ReactElement {
  return (
    <Card padding="md">
      <div
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-quaternary)' }}
      >
        {label}
      </div>
      <div
        className="text-2xl font-bold mt-1"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </div>
    </Card>
  )
}

function EmptyState(): React.ReactElement {
  return (
    <Card padding="lg" className="text-center">
      <div
        className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3"
        style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-secondary)',
        }}
      >
        <HistoryIcon
          className="w-5 h-5"
          style={{ color: 'var(--text-quaternary)' }}
        />
      </div>
      <h3
        className="text-sm font-bold"
        style={{ color: 'var(--text-primary)' }}
      >
        No sessions yet
      </h3>
      <p
        className="text-[12px] mt-1"
        style={{ color: 'var(--text-tertiary)' }}
      >
        Completed interviews will show up here.
      </p>
    </Card>
  )
}
