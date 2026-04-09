import React from 'react'
import { Zap, Clock, Square, Sparkles } from 'lucide-react'

interface TopBarProps {
  elapsedSeconds: number
  onInject: () => void
  onEndSession: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function TopBar({ elapsedSeconds, onInject, onEndSession }: TopBarProps) {
  return (
    <div className="flex-shrink-0 flex items-center justify-between h-12 px-4"
      style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-secondary)' }}>
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-blue)' }}>
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>CodeAdapt</span>
        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-quaternary)' }}>
          Interview
        </span>
      </div>

      <div className="flex items-center gap-2 px-3 py-1 rounded-md" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
        <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-quaternary)' }} />
        <span className="font-mono text-base font-semibold tracking-widest" style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
          {formatTime(elapsedSeconds)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onInject}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150"
          style={{ background: 'rgba(188,76,0,0.08)', color: 'var(--accent-orange)', border: '1px solid rgba(188,76,0,0.2)' }}>
          <Sparkles className="w-3.5 h-3.5" />
          Inject Chaos
        </button>
        <button onClick={onEndSession}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150"
          style={{ background: 'rgba(207,34,46,0.06)', color: 'var(--accent-severe)', border: '1px solid rgba(207,34,46,0.15)' }}>
          <Square className="w-3 h-3 fill-current" />
          End Session
        </button>
      </div>
    </div>
  )
}
