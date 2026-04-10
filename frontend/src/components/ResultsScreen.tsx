import React, { useEffect, useState } from 'react'
import { Trophy, RotateCcw, Copy, CheckCircle2, Zap, Brain, MessageSquare, Code2, Clock, Check } from 'lucide-react'
import { SessionResult } from '../types'
import Confetti from './Confetti'

interface ResultsScreenProps {
  result: SessionResult
  onReset: () => void
}

function formatDuration(s: number) { return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}` }
function formatEventTime(s: number) { return `${Math.floor(s/60)}m${String(s%60).padStart(2,'0')}s` }
function getGrade(s: number) { return s >= 90 ? 'A+' : s >= 80 ? 'A' : s >= 75 ? 'B+' : s >= 65 ? 'B' : s >= 50 ? 'C' : 'D' }
function getColor(s: number) { return s >= 70 ? 'var(--accent-blue)' : s >= 40 ? 'var(--accent-amber)' : 'var(--accent-orange)' }

function ScoreRing({ score }: { score: number }) {
  const r = 58, c = 2 * Math.PI * r
  const [show, setShow] = useState(false)
  const color = getColor(score)
  useEffect(() => { setTimeout(() => setShow(true), 400) }, [])

  return (
    <div className="relative flex items-center justify-center">
      <svg width="160" height="160" className="-rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--bg-tertiary)" strokeWidth="7" />
        <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={show ? c - (score/100)*c : c}
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color}40)` }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[42px] font-extrabold leading-none" style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>{score}</span>
        <span className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--text-quaternary)' }}>out of 100</span>
        <span className="text-lg font-extrabold mt-1 px-2 py-0.5 rounded-md" style={{ color, background: `${color}10` }}>{getGrade(score)}</span>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, barValue, barColor }: { icon: React.ReactNode; label: string; value: string | number; barValue?: number; barColor?: string }) {
  return (
    <div className="rounded-xl p-4 transition-all duration-200 hover:shadow-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="p-1 rounded-md" style={{ color: barColor || 'var(--text-quaternary)', background: barColor ? `${barColor}10` : 'var(--bg-tertiary)' }}>{icon}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <p className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{value}</p>
      {barValue !== undefined && barColor && (
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, barValue)}%`, background: barColor }} />
        </div>
      )}
    </div>
  )
}

export default function ResultsScreen({ result, onReset }: ResultsScreenProps) {
  const [copied, setCopied] = useState(false)
  const score = Math.round(result.metrics.adaptabilityScore * 0.4 + result.codeQualityScore * 0.35 + result.communicationScore * 0.25)
  const [celebrate, setCelebrate] = useState(score >= 80)

  const handleCopy = () => {
    navigator.clipboard.writeText(`CodeAdapt: ${score}/100 (${getGrade(score)}) | ${result.config.difficulty} ${result.config.topic} in ${result.config.language} | ${formatDuration(result.duration)}`).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen overflow-y-auto relative" style={{ background: 'var(--bg-primary)' }}>
      {celebrate && <Confetti onDone={() => setCelebrate(false)} />}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.04] blur-[100px]"
          style={{ background: 'radial-gradient(circle, var(--accent-blue), var(--accent-purple), transparent)' }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full" style={{
            background: 'rgba(9,105,218,0.06)', border: '1px solid rgba(9,105,218,0.1)',
          }}>
            <Trophy className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />
            <span className="text-[11px] font-semibold" style={{ color: 'var(--accent-blue)' }}>Session Complete</span>
          </div>
          <h1 className="text-[32px] font-extrabold mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Interview Results</h1>
          <div className="flex items-center justify-center gap-2 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
            <span className="font-mono font-semibold px-2 py-0.5 rounded-md" style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>{formatDuration(result.duration)}</span>
            <span>·</span>
            <span className="capitalize">{result.config.difficulty}</span>
            <span>·</span>
            <span className="capitalize">{result.config.topic.replace(/-/g, ' ')}</span>
            <span>·</span>
            <span className="capitalize">{result.config.language}</span>
          </div>
        </div>

        <div className="flex flex-col items-center mb-10 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <ScoreRing score={score} />
          <div className="mt-5 max-w-md text-center px-4 py-3 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-[13px] italic leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>"{result.aiSummary}"</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.25s' }}>
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
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
              <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-quaternary)' }} />
              <h2 className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Session Timeline</h2>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md ml-auto" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-quaternary)' }}>{result.timeline.length} events</span>
            </div>
            <div className="overflow-x-auto p-5">
              <div className="flex items-start gap-0 min-w-max">
                {result.timeline.map((ev, i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-2" style={{ minWidth: '90px' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110" style={{
                        background: ev.type === 'problem' ? 'rgba(130,80,223,0.08)' : ev.type === 'injection' ? 'rgba(188,76,0,0.08)' : 'rgba(9,105,218,0.08)',
                        border: `1.5px solid ${ev.type === 'problem' ? 'rgba(130,80,223,0.2)' : ev.type === 'injection' ? 'rgba(188,76,0,0.2)' : 'rgba(9,105,218,0.2)'}`,
                      }}>
                        {ev.type === 'problem' && <Brain className="w-4 h-4" style={{ color: 'var(--accent-purple)' }} />}
                        {ev.type === 'injection' && <Zap className="w-4 h-4" style={{ color: 'var(--accent-orange)' }} />}
                        {ev.type === 'submission' && <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />}
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{ev.label}</p>
                        <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-quaternary)' }}>{formatEventTime(ev.time)}</p>
                      </div>
                    </div>
                    {i < result.timeline.length - 1 && (
                      <div className="flex items-center mt-4.5">
                        <div className="w-10 h-px" style={{ background: 'linear-gradient(to right, var(--border-primary), var(--border-secondary))' }} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Injections Review */}
        {result.injections.length > 0 && (
          <div className="rounded-xl mb-8 overflow-hidden animate-fade-in" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', animationDelay: '0.4s' }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
              <Zap className="w-3.5 h-3.5" style={{ color: 'var(--accent-orange)' }} />
              <h2 className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Injections Review</h2>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-auto" style={{ background: 'rgba(188,76,0,0.08)', color: 'var(--accent-orange)' }}>{result.injections.length}</span>
            </div>
            {result.injections.map((inj, idx) => (
              <div key={inj.id} className="px-4 py-3.5 flex items-start gap-3" style={{ borderBottom: idx < result.injections.length - 1 ? '1px solid var(--border-secondary)' : 'none' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                  background: inj.type === 'bug' ? 'rgba(188,76,0,0.08)' : 'rgba(191,135,0,0.08)',
                  border: `1px solid ${inj.type === 'bug' ? 'rgba(188,76,0,0.15)' : 'rgba(191,135,0,0.15)'}`,
                }}>
                  {inj.type === 'bug' ? <span className="text-[10px]">🐛</span> : <Zap className="w-3 h-3" style={{ color: 'var(--accent-amber)' }} />}
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: inj.type === 'bug' ? 'var(--accent-orange)' : 'var(--accent-amber)' }}>
                    {inj.type === 'bug' ? 'Bug Report' : 'Requirement Change'}
                  </span>
                  <p className="text-[12.5px] mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{inj.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <button onClick={onReset}
            className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] group"
            style={{ background: 'linear-gradient(135deg, var(--accent-blue), #0550ae)', boxShadow: '0 2px 8px rgba(9,105,218,0.3), 0 1px 2px rgba(9,105,218,0.2)' }}>
            <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-180" /> Practice Again
          </button>
          <button onClick={handleCopy}
            className="px-6 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-200 hover:shadow-card active:scale-[0.98]"
            style={{ border: '1px solid var(--border-primary)', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)' }}>
            {copied ? <><Check className="w-4 h-4" style={{ color: 'var(--accent-green)' }} /><span style={{ color: 'var(--accent-green)' }}>Copied!</span></> : <><Copy className="w-4 h-4" /> Copy Results</>}
          </button>
        </div>
      </div>
    </div>
  )
}
