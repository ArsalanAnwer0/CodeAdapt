import React, { useEffect, useState } from 'react'
import { Trophy, RotateCcw, Copy, CheckCircle2, Zap, Brain, MessageSquare, Code2, Clock, Check } from 'lucide-react'
import { SessionResult } from '../types'

interface ResultsScreenProps {
  result: SessionResult
  onReset: () => void
}

function formatDuration(s: number) { return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}` }
function formatEventTime(s: number) { return `${Math.floor(s/60)}m${String(s%60).padStart(2,'0')}s` }
function getGrade(s: number) { return s >= 90 ? 'A+' : s >= 80 ? 'A' : s >= 75 ? 'B+' : s >= 65 ? 'B' : s >= 50 ? 'C' : 'D' }
function getColor(s: number) { return s >= 70 ? 'var(--accent-blue)' : s >= 40 ? 'var(--accent-amber)' : 'var(--accent-orange)' }

function ScoreRing({ score }: { score: number }) {
  const r = 56, c = 2 * Math.PI * r
  const [show, setShow] = useState(false)
  const color = getColor(score)
  useEffect(() => { setTimeout(() => setShow(true), 400) }, [])

  return (
    <div className="relative flex items-center justify-center">
      <svg width="150" height="150" className="-rotate-90">
        <circle cx="75" cy="75" r={r} fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
        <circle cx="75" cy="75" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={show ? c - (score/100)*c : c}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[40px] font-bold leading-none" style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{score}</span>
        <span className="text-xs" style={{ color: 'var(--text-quaternary)' }}>/ 100</span>
        <span className="text-lg font-bold mt-0.5" style={{ color }}>{getGrade(score)}</span>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, barValue, barColor }: { icon: React.ReactNode; label: string; value: string | number; barValue?: number; barColor?: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color: 'var(--text-quaternary)' }}>{icon}</span>
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      </div>
      <p className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</p>
      {barValue !== undefined && barColor && (
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, barValue)}%`, background: barColor }} />
        </div>
      )}
    </div>
  )
}

export default function ResultsScreen({ result, onReset }: ResultsScreenProps) {
  const [copied, setCopied] = useState(false)
  const score = Math.round(result.metrics.adaptabilityScore * 0.4 + result.codeQualityScore * 0.35 + result.communicationScore * 0.25)

  const handleCopy = () => {
    navigator.clipboard.writeText(`CodeAdapt: ${score}/100 (${getGrade(score)}) | ${result.config.difficulty} ${result.config.topic} in ${result.config.language} | ${formatDuration(result.duration)}`).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.03] blur-[120px]"
          style={{ background: 'radial-gradient(circle, var(--accent-blue), transparent)' }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full" style={{
            background: 'rgba(9,105,218,0.06)', border: '1px solid rgba(9,105,218,0.12)',
          }}>
            <Trophy className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />
            <span className="text-[12px] font-medium" style={{ color: 'var(--accent-blue)' }}>Session Complete</span>
          </div>
          <h1 className="text-3xl font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Interview Results</h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{formatDuration(result.duration)}</span>
            {' · '}<span className="capitalize">{result.config.difficulty}</span>
            {' · '}<span className="capitalize">{result.config.topic.replace(/-/g, ' ')}</span>
            {' · '}<span className="capitalize">{result.config.language}</span>
          </p>
        </div>

        <div className="flex flex-col items-center mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <ScoreRing score={score} />
          <p className="text-sm italic mt-4 max-w-md text-center" style={{ color: 'var(--text-tertiary)' }}>"{result.aiSummary}"</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <StatCard icon={<CheckCircle2 className="w-4 h-4" />} label="Problems" value={`${result.metrics.problemsSolved}/${result.metrics.totalProblems}`} />
          <StatCard icon={<Clock className="w-4 h-4" />} label="Avg Response" value={`${result.metrics.avgResponseTime.toFixed(1)}m`} />
          <StatCard icon={<Zap className="w-4 h-4" />} label="Injections" value={result.metrics.injectionCount} />
          <StatCard icon={<Code2 className="w-4 h-4" />} label="Code Quality" value={result.codeQualityScore} barValue={result.codeQualityScore} barColor={getColor(result.codeQualityScore)} />
          <StatCard icon={<MessageSquare className="w-4 h-4" />} label="Communication" value={result.communicationScore} barValue={result.communicationScore} barColor={getColor(result.communicationScore)} />
          <StatCard icon={<Brain className="w-4 h-4" />} label="Adaptability" value={result.metrics.adaptabilityScore} barValue={result.metrics.adaptabilityScore} barColor={getColor(result.metrics.adaptabilityScore)} />
        </div>

        {/* Timeline */}
        {result.timeline.length > 0 && (
          <div className="rounded-xl mb-6 overflow-hidden animate-fade-in" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', animationDelay: '0.35s' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Timeline</h2>
            </div>
            <div className="overflow-x-auto p-4">
              <div className="flex items-start gap-0 min-w-max">
                {result.timeline.map((ev, i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-1.5" style={{ minWidth: '80px' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                        background: ev.type === 'problem' ? 'rgba(130,80,223,0.08)' : ev.type === 'injection' ? 'rgba(188,76,0,0.08)' : 'rgba(9,105,218,0.08)',
                        border: `1px solid ${ev.type === 'problem' ? 'rgba(130,80,223,0.15)' : ev.type === 'injection' ? 'rgba(188,76,0,0.15)' : 'rgba(9,105,218,0.15)'}`,
                      }}>
                        {ev.type === 'problem' && <Brain className="w-3.5 h-3.5" style={{ color: 'var(--accent-purple)' }} />}
                        {ev.type === 'injection' && <Zap className="w-3.5 h-3.5" style={{ color: 'var(--accent-orange)' }} />}
                        {ev.type === 'submission' && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />}
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>{ev.label}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-quaternary)' }}>{formatEventTime(ev.time)}</p>
                      </div>
                    </div>
                    {i < result.timeline.length - 1 && <div className="w-8 h-px mt-4" style={{ background: 'var(--border-primary)' }} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Injections Review */}
        {result.injections.length > 0 && (
          <div className="rounded-xl mb-8 overflow-hidden animate-fade-in" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', animationDelay: '0.4s' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Injections Review</h2>
            </div>
            {result.injections.map((inj) => (
              <div key={inj.id} className="px-4 py-3 flex items-start gap-2.5" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: inj.type === 'bug' ? 'var(--accent-orange)' : 'var(--accent-amber)' }} />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: inj.type === 'bug' ? 'var(--accent-orange)' : 'var(--accent-amber)' }}>
                    {inj.type === 'bug' ? 'Bug' : 'Change'}
                  </span>
                  <p className="text-[13px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{inj.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <button onClick={onReset}
            className="flex-1 py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{ background: 'var(--accent-blue)', boxShadow: '0 1px 3px rgba(9,105,218,0.3)' }}>
            <RotateCcw className="w-4 h-4" /> Practice Again
          </button>
          <button onClick={handleCopy}
            className="px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-150"
            style={{ border: '1px solid var(--border-primary)', color: 'var(--text-tertiary)' }}>
            {copied ? <><Check className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} /><span style={{ color: 'var(--accent-blue)' }}>Copied</span></> : <><Copy className="w-4 h-4" /> Copy</>}
          </button>
        </div>
      </div>
    </div>
  )
}
