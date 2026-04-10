import React from 'react'
import { Brain, CheckCircle2, Zap, Timer, Clock } from 'lucide-react'
import { SessionMetrics } from '../../types'

interface MetricsBarProps {
  metrics: SessionMetrics
  durationSeconds: number
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function MetricsBar({ metrics }: MetricsBarProps) {
  const isLowTime = metrics.timeRemaining <= 300
  const scoreColor = metrics.adaptabilityScore >= 70 ? 'var(--accent-blue)' : metrics.adaptabilityScore >= 40 ? 'var(--accent-amber)' : 'var(--accent-orange)'

  return (
    <div className="flex-shrink-0 flex items-center h-10 px-2" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderTop: '1px solid var(--border-secondary)', boxShadow: '0 -1px 3px rgba(31,35,40,0.03)' }}>
      {/* Adaptability */}
      <div className="flex items-center gap-1.5 px-3 text-[11px]">
        <Brain className="w-3.5 h-3.5" style={{ color: scoreColor }} />
        <span className="font-medium" style={{ color: 'var(--text-quaternary)' }}>Adapt</span>
        <span className="font-bold" style={{ color: scoreColor, fontVariantNumeric: 'tabular-nums' }}>{metrics.adaptabilityScore}</span>
        <div className="w-14 h-1.5 rounded-full overflow-hidden ml-0.5" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${metrics.adaptabilityScore}%`, background: scoreColor }} />
        </div>
      </div>

      <div className="w-px h-4" style={{ background: 'var(--border-secondary)' }} />

      <div className="flex items-center gap-1.5 px-3 text-[11px]">
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: metrics.problemsSolved > 0 ? 'var(--accent-green)' : 'var(--text-quaternary)' }} />
        <span className="font-medium" style={{ color: 'var(--text-quaternary)' }}>Solved</span>
        <span className="font-bold" style={{ color: metrics.problemsSolved > 0 ? 'var(--accent-green)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{metrics.problemsSolved}/{metrics.totalProblems}</span>
      </div>

      <div className="w-px h-4" style={{ background: 'var(--border-secondary)' }} />

      <div className="flex items-center gap-1.5 px-3 text-[11px]">
        <Zap className="w-3.5 h-3.5" style={{ color: metrics.injectionCount > 0 ? 'var(--accent-orange)' : 'var(--text-quaternary)' }} />
        <span className="font-medium" style={{ color: 'var(--text-quaternary)' }}>Injections</span>
        <span className="font-bold" style={{ color: metrics.injectionCount > 0 ? 'var(--accent-orange)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{metrics.injectionCount}</span>
      </div>

      <div className="w-px h-4" style={{ background: 'var(--border-secondary)' }} />

      <div className="flex items-center gap-1.5 px-3 text-[11px]">
        <Timer className="w-3.5 h-3.5" style={{ color: 'var(--text-quaternary)' }} />
        <span className="font-medium" style={{ color: 'var(--text-quaternary)' }}>Avg</span>
        <span className="font-bold" style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{metrics.avgResponseTime.toFixed(1)}m</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-[11px]" style={{
        background: isLowTime ? 'rgba(188,76,0,0.06)' : 'var(--bg-secondary)',
        border: isLowTime ? '1px solid rgba(188,76,0,0.12)' : '1px solid var(--border-secondary)',
      }}>
        <Clock className="w-3.5 h-3.5" style={{ color: isLowTime ? 'var(--accent-orange)' : 'var(--text-quaternary)' }} />
        <span className="font-mono font-bold tracking-wider" style={{
          color: isLowTime ? 'var(--accent-orange)' : 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}>{formatTime(metrics.timeRemaining)}</span>
      </div>
    </div>
  )
}
