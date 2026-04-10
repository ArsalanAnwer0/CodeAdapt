import React, { useRef, useEffect } from 'react'
import { Activity, Zap, Bug, FileText } from 'lucide-react'
import { Problem, Injection } from '../../types'

interface ProblemPanelProps {
  problem: Problem
  injections: Injection[]
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function ProblemPanel({ problem, injections }: ProblemPanelProps) {
  const injectionsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    injectionsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [injections])

  const diffColors: Record<string, string> = {
    easy: 'var(--accent-blue)',
    medium: 'var(--accent-amber)',
    hard: 'var(--accent-orange)',
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 h-10" style={{ borderBottom: '1px solid var(--border-secondary)', background: 'var(--bg-secondary)' }}>
        <FileText className="w-3.5 h-3.5" style={{ color: 'var(--accent-purple)' }} />
        <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Problem</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md tracking-wide" style={{
            background: `${diffColors[problem.difficulty]}10`,
            color: diffColors[problem.difficulty],
            border: `1px solid ${diffColors[problem.difficulty]}20`,
          }}>{problem.difficulty}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md capitalize" style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-quaternary)',
          }}>{problem.topic.replace(/-/g, ' ')}</span>
        </div>
      </div>

      {/* Problem Content */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <h2 className="text-[14px] font-bold mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{problem.title}</h2>
        <p className="text-[12px] leading-[1.7] mb-4 whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
          {problem.description}
        </p>

        {/* Examples */}
        <div className="mb-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-quaternary)', letterSpacing: '0.08em' }}>Examples</h3>
          <div className="space-y-2.5">
            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-lg p-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                <div className="font-mono text-[11px] space-y-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--text-quaternary)', minWidth: '42px' }}>Input</span>
                    <span style={{ color: 'var(--accent-purple)', wordBreak: 'break-all' }}>{ex.input}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--text-quaternary)', minWidth: '42px' }}>Output</span>
                    <span style={{ color: 'var(--accent-blue)' }}>{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="pt-1.5 mt-1 text-[10px] leading-relaxed" style={{ borderTop: '1px solid var(--border-secondary)', color: 'var(--text-quaternary)' }}>{ex.explanation}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-quaternary)', letterSpacing: '0.08em' }}>Constraints</h3>
          <ul className="space-y-1.5">
            {problem.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2 font-mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                <span className="mt-[6px] w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--accent-purple)', opacity: 0.5 }} />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Live Feed */}
      <div className="flex-shrink-0" style={{ borderTop: '1px solid var(--border-secondary)', maxHeight: '35%', minHeight: '100px' }}>
        <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid var(--border-secondary)', background: 'var(--bg-secondary)' }}>
          <Activity className="w-3 h-3" style={{ color: 'var(--accent-orange)' }} />
          <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Live Feed</span>
          {injections.length > 0 && (
            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{
              background: 'rgba(188,76,0,0.1)', color: 'var(--accent-orange)', border: '1px solid rgba(188,76,0,0.15)',
            }}>{injections.length}</span>
          )}
        </div>
        <div className="overflow-y-auto p-2.5 space-y-2" style={{ maxHeight: 'calc(100% - 33px)' }}>
          {injections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 gap-1.5">
              <Activity className="w-4 h-4" style={{ color: 'var(--border-primary)' }} />
              <p className="text-[11px]" style={{ color: 'var(--text-quaternary)' }}>No injections yet</p>
            </div>
          ) : (
            injections.map((inj, idx) => (
              <div key={inj.id} className={`rounded-lg p-2.5 transition-all duration-300 ${idx === injections.length - 1 ? 'animate-inject-glow' : ''}`}
                style={{
                  background: inj.type === 'bug' ? 'rgba(188,76,0,0.04)' : 'rgba(191,135,0,0.04)',
                  borderLeft: `2.5px solid ${inj.type === 'bug' ? 'var(--accent-orange)' : 'var(--accent-amber)'}`,
                  border: `1px solid ${inj.type === 'bug' ? 'rgba(188,76,0,0.08)' : 'rgba(191,135,0,0.08)'}`,
                  borderLeftWidth: '2.5px',
                  borderLeftColor: inj.type === 'bug' ? 'var(--accent-orange)' : 'var(--accent-amber)',
                }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {inj.type === 'bug' ? <Bug className="w-3 h-3" style={{ color: 'var(--accent-orange)' }} /> : <Zap className="w-3 h-3" style={{ color: 'var(--accent-amber)' }} />}
                    <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: inj.type === 'bug' ? 'var(--accent-orange)' : 'var(--accent-amber)' }}>
                      {inj.type === 'bug' ? 'Bug Report' : 'Req Change'}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono" style={{ color: 'var(--text-quaternary)' }}>{formatTime(inj.timestamp)}</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{inj.content}</p>
              </div>
            ))
          )}
          <div ref={injectionsEndRef} />
        </div>
      </div>
    </div>
  )
}
