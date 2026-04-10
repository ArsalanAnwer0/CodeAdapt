import React, { useState } from 'react'
import { Zap, ChevronRight, Terminal, Brain, Timer, Sparkles } from 'lucide-react'
import { Language, Difficulty, Topic, SessionDuration, SessionConfig } from '../types'

interface SetupPanelProps {
  onStart: (config: SessionConfig) => void
}

const LANGUAGES: { id: Language; label: string; icon: string }[] = [
  { id: 'javascript', label: 'JavaScript', icon: 'JS' },
  { id: 'typescript', label: 'TypeScript', icon: 'TS' },
  { id: 'python', label: 'Python', icon: 'PY' },
  { id: 'java', label: 'Java', icon: 'JA' },
  { id: 'cpp', label: 'C++', icon: 'C+' },
  { id: 'go', label: 'Go', icon: 'GO' },
  { id: 'rust', label: 'Rust', icon: 'RS' },
]

const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: 'easy', label: 'Easy', desc: 'Fundamentals' },
  { id: 'medium', label: 'Medium', desc: 'Core concepts' },
  { id: 'hard', label: 'Hard', desc: 'Advanced' },
]

const TOPICS: { id: Topic; label: string }[] = [
  { id: 'arrays', label: 'Arrays' },
  { id: 'strings', label: 'Strings' },
  { id: 'trees', label: 'Trees' },
  { id: 'graphs', label: 'Graphs' },
  { id: 'dynamic-programming', label: 'Dynamic Programming' },
  { id: 'linked-lists', label: 'Linked Lists' },
  { id: 'sorting', label: 'Sorting' },
  { id: 'binary-search', label: 'Binary Search' },
  { id: 'recursion', label: 'Recursion' },
  { id: 'stacks-queues', label: 'Stacks & Queues' },
]

const DURATIONS: SessionDuration[] = [15, 30, 45, 60]

export default function SetupPanel({ onStart }: SetupPanelProps) {
  const [language, setLanguage] = useState<Language>('javascript')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [topic, setTopic] = useState<Topic>('arrays')
  const [duration, setDuration] = useState<SessionDuration>(30)

  const handleStart = () => onStart({ language, difficulty, topic, duration })

  const diffColors: Record<string, string> = {
    easy: 'var(--accent-blue)',
    medium: 'var(--accent-amber)',
    hard: 'var(--accent-orange)',
  }

  return (
    <div className="h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-[44%] relative overflow-hidden flex-col justify-between p-10"
        style={{ background: 'linear-gradient(155deg, #0969da 0%, #0550ae 35%, #6639ba 70%, #8250df 100%)' }}>

        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }} />

        {/* Subtle radial glow */}
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(130,80,223,0.6), transparent 70%)' }} />
        <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(9,105,218,0.8), transparent 70%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg shadow-black/10">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">CodeAdapt</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-[2.75rem] font-extrabold text-white leading-[1.15] mb-5" style={{ letterSpacing: '-0.035em' }}>
            Practice coding interviews that adapt in real-time
          </h1>
          <p className="text-[15px] text-white/65 leading-relaxed mb-8">
            An AI interviewer that throws curveballs, changes requirements mid-session, and scores your adaptability.
          </p>

          <div className="space-y-2.5">
            {[
              { icon: Brain, label: 'AI Interviewer', desc: 'Real-time feedback and adaptive questions' },
              { icon: Sparkles, label: 'Live Injections', desc: 'Mid-session requirement changes and bugs' },
              { icon: Timer, label: 'Timed Sessions', desc: '15-60 min sessions with live scoring' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.08] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.12] hover:border-white/[0.15] transition-all duration-200 group">
                <div className="w-9 h-9 rounded-lg bg-white/[0.12] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.18] transition-colors duration-200">
                  <f.icon className="w-4 h-4 text-white/90" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{f.label}</p>
                  <p className="text-[11px] text-white/50 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/40">Built for developers · No sign-up required</p>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
        <div className="lg:hidden p-6 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-blue)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>CodeAdapt</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-md animate-fade-in">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Configure Session</h2>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Set up your practice interview</p>
            </div>

            {/* Language */}
            <div className="mb-6">
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>Language</label>
              <div className="grid grid-cols-4 gap-2">
                {LANGUAGES.map((lang) => {
                  const active = language === lang.id
                  return (
                    <button key={lang.id} onClick={() => setLanguage(lang.id)}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg transition-all duration-200 hover:shadow-soft"
                      style={{
                        background: active ? 'rgba(9,105,218,0.07)' : 'var(--bg-secondary)',
                        border: active ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-secondary)',
                        boxShadow: active ? '0 0 0 3px rgba(9,105,218,0.08)' : 'none',
                      }}>
                      <span className="text-xs font-mono font-bold transition-colors duration-200" style={{ color: active ? 'var(--accent-blue)' : 'var(--text-quaternary)' }}>{lang.icon}</span>
                      <span className="text-[10px] font-medium transition-colors duration-200" style={{ color: active ? 'var(--accent-blue)' : 'var(--text-quaternary)' }}>{lang.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((diff) => {
                  const active = difficulty === diff.id
                  return (
                    <button key={diff.id} onClick={() => setDifficulty(diff.id)}
                      className="flex flex-col items-center gap-1 py-3.5 rounded-lg transition-all duration-200"
                      style={{
                        background: active ? `${diffColors[diff.id]}10` : 'var(--bg-secondary)',
                        border: active ? `1.5px solid ${diffColors[diff.id]}` : '1px solid var(--border-secondary)',
                        boxShadow: active ? `0 0 0 3px ${diffColors[diff.id]}12` : 'none',
                      }}>
                      <span className="text-sm font-semibold transition-colors duration-200" style={{ color: active ? diffColors[diff.id] : 'var(--text-tertiary)' }}>{diff.label}</span>
                      <span className="text-[10px]" style={{ color: active ? `${diffColors[diff.id]}aa` : 'var(--text-quaternary)' }}>{diff.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Topic */}
            <div className="mb-6">
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>Topic</label>
              <div className="grid grid-cols-2 gap-1.5">
                {TOPICS.map((t) => {
                  const active = topic === t.id
                  return (
                    <button key={t.id} onClick={() => setTopic(t.id)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200"
                      style={{
                        background: active ? 'rgba(130,80,223,0.06)' : 'transparent',
                        border: active ? '1px solid rgba(130,80,223,0.3)' : '1px solid transparent',
                      }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200" style={{
                        background: active ? 'var(--accent-purple)' : 'var(--border-primary)',
                        boxShadow: active ? '0 0 0 2px rgba(130,80,223,0.15)' : 'none',
                      }} />
                      <span className="text-xs font-medium transition-colors duration-200" style={{ color: active ? 'var(--accent-purple)' : 'var(--text-tertiary)' }}>{t.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Duration */}
            <div className="mb-8">
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>Duration</label>
              <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
                {DURATIONS.map((d, i) => (
                  <button key={d} onClick={() => setDuration(d)}
                    className="flex-1 py-2.5 text-sm font-medium transition-all duration-200 relative"
                    style={{
                      background: duration === d ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                      color: duration === d ? '#ffffff' : 'var(--text-tertiary)',
                      borderRight: i < DURATIONS.length - 1 ? '1px solid var(--border-primary)' : 'none',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                    {d}m
                  </button>
                ))}
              </div>
            </div>

            {/* Start */}
            <button onClick={handleStart}
              className="w-full group flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, var(--accent-blue) 0%, #0550ae 100%)',
                boxShadow: '0 2px 8px rgba(9,105,218,0.3), 0 1px 2px rgba(9,105,218,0.2)',
              }}>
              <Terminal className="w-4 h-4" />
              Start Interview
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <p className="text-center text-[11px] mt-4" style={{ color: 'var(--text-quaternary)' }}>No account required · Session data stays local</p>
          </div>
        </div>
      </div>
    </div>
  )
}
