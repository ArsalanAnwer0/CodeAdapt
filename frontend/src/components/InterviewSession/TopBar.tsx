import React from 'react'
import { Zap, Clock, Square, Sparkles, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../theme/ThemeProvider'
import Tooltip from '../ui/Tooltip'

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
  const { theme, toggle } = useTheme()
  return (
    <div className="flex-shrink-0 flex items-center justify-between h-12 px-4 glass"
      style={{ borderBottom: '1px solid var(--border-secondary)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-blue), #0550ae)' }}>
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>CodeAdapt</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
          style={{ background: 'rgba(9,105,218,0.06)', color: 'var(--accent-blue)', border: '1px solid rgba(9,105,218,0.1)' }}>
          Live
        </span>
      </div>

      <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
        <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-quaternary)' }} />
        <span className="font-mono text-[15px] font-semibold tracking-wider" style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
          {formatTime(elapsedSeconds)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-[0.94] hover:brightness-110"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', border: '1px solid var(--border-primary)' }}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </Tooltip>
        <button onClick={onInject}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:bg-[rgba(188,76,0,0.12)] active:scale-[0.97] group"
          style={{ background: 'rgba(188,76,0,0.07)', color: 'var(--accent-orange)', border: '1px solid rgba(188,76,0,0.18)' }}>
          <Sparkles className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" />
          Inject Chaos
        </button>
        <button onClick={onEndSession}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:bg-[rgba(207,34,46,0.1)] active:scale-[0.97]"
          style={{ background: 'rgba(207,34,46,0.05)', color: 'var(--accent-severe)', border: '1px solid rgba(207,34,46,0.15)' }}>
          <Square className="w-3 h-3 fill-current" />
          End Session
        </button>
      </div>
    </div>
  )
}
