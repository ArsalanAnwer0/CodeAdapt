import React, { useState, useEffect, useRef, useCallback } from 'react'
import TopBar from './TopBar'
import ProblemPanel from './ProblemPanel'
import CodeEditor from './CodeEditor'
import ChatPanel from './ChatPanel'
import MetricsBar from './MetricsBar'
import {
  SessionConfig,
  ChatMessage,
  Injection,
  SessionMetrics,
  SessionResult,
  TimelineEvent,
  Problem,
} from '../../types'
import { getRandomProblem } from '../../data/problems'
import { getRandomInjection } from '../../data/injections'
import {
  getOpeningMessage,
  getResponseToUserMessage,
  getInjectionFollowUp,
  getClosingFeedback,
  generateAISummary,
  calculateCodeQuality,
  calculateCommunicationScore,
} from '../../utils/mockAI'

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

interface InterviewSessionProps {
  config: SessionConfig
  onEnd: (result: SessionResult) => void
}

export default function InterviewSession({ config, onEnd }: InterviewSessionProps) {
  const [problem] = useState<Problem>(() => getRandomProblem(config.topic, config.difficulty))
  const [code, setCode] = useState(() => problem.starterCode[config.language])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [injections, setInjections] = useState<Injection[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [metrics, setMetrics] = useState<SessionMetrics>({
    adaptabilityScore: 70,
    problemsSolved: 0,
    totalProblems: 1,
    injectionCount: 0,
    avgResponseTime: 0,
    timeRemaining: config.duration * 60,
  })
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    { type: 'problem', label: problem.title, time: 0 },
  ])

  const elapsedRef = useRef(0)
  const lastInjectionTime = useRef<number | null>(null)
  const lastUserMessageTime = useRef<number | null>(null)
  const userMessageCount = useRef(0)
  const openingMessageSent = useRef(false)

  useEffect(() => {
    const timer = setInterval(() => {
      elapsedRef.current += 1
      setElapsedSeconds((prev) => prev + 1)
      setMetrics((prev) => ({ ...prev, timeRemaining: Math.max(0, prev.timeRemaining - 1) }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const checker = setInterval(() => {
      if (lastInjectionTime.current !== null) {
        const since = elapsedRef.current - lastInjectionTime.current
        if (since > 120 && since % 30 === 0) {
          setMetrics((prev) => ({ ...prev, adaptabilityScore: Math.max(10, prev.adaptabilityScore - 2) }))
        }
      }
    }, 1000)
    return () => clearInterval(checker)
  }, [])

  useEffect(() => {
    if (openingMessageSent.current) return
    openingMessageSent.current = true
    const timer = setTimeout(() => {
      addAIMessage(getOpeningMessage(config, problem))
    }, 800)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addMessage = useCallback((msg: ChatMessage) => { setMessages((prev) => [...prev, msg]) }, [])

  const addAIMessage = useCallback((content: string, role: ChatMessage['role'] = 'ai') => {
    addMessage({ id: generateId(), role, content, timestamp: new Date() })
  }, [addMessage])

  const handleSendMessage = useCallback((content: string) => {
    addMessage({ id: generateId(), role: 'user', content, timestamp: new Date() })
    userMessageCount.current += 1
    const now = elapsedRef.current

    if (lastInjectionTime.current !== null) {
      const responseTime = now - lastInjectionTime.current
      if (responseTime < 180) {
        setMetrics((prev) => ({ ...prev, adaptabilityScore: Math.min(100, prev.adaptabilityScore + 5) }))
      }
      lastInjectionTime.current = null
    }

    if (lastUserMessageTime.current !== null) {
      const delta = (now - lastUserMessageTime.current) / 60
      setMetrics((prev) => {
        const count = userMessageCount.current
        return { ...prev, avgResponseTime: (prev.avgResponseTime * (count - 1) + delta) / count }
      })
    }
    lastUserMessageTime.current = now

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addAIMessage(getResponseToUserMessage(content, problem, code))
    }, 1000 + Math.random() * 1500)
  }, [addMessage, addAIMessage, problem, code])

  const handleInject = useCallback(() => {
    const injection = getRandomInjection()
    const inj: Injection = { id: generateId(), content: injection.content, timestamp: new Date(), type: injection.type }

    setInjections((prev) => [...prev, inj])
    setMetrics((prev) => ({ ...prev, injectionCount: prev.injectionCount + 1, adaptabilityScore: Math.max(10, prev.adaptabilityScore - 5) }))
    lastInjectionTime.current = elapsedRef.current

    setTimeline((prev) => [...prev, { type: 'injection', label: injection.type === 'bug' ? 'Bug Injected' : 'Req Changed', time: elapsedRef.current }])
    addMessage({ id: generateId(), role: 'injection', content: injection.content, timestamp: new Date() })

    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        addAIMessage(getInjectionFollowUp(inj))
      }, 1500)
    }, 500)
  }, [addMessage, addAIMessage])

  const handleRun = useCallback(() => {
    setTimeline((prev) => [...prev, { type: 'submission', label: 'Code Run', time: elapsedRef.current }])
    if (code.trim().length > 200) {
      setMetrics((prev) => ({
        ...prev,
        problemsSolved: Math.min(prev.problemsSolved + 1, prev.totalProblems),
        adaptabilityScore: Math.min(100, prev.adaptabilityScore + 3),
      }))
    }
  }, [code])

  const handleEndSession = useCallback(() => {
    const finalMetrics = { ...metrics }
    const result: SessionResult = {
      config,
      metrics: finalMetrics,
      duration: elapsedRef.current,
      messages,
      injections,
      codeQualityScore: calculateCodeQuality(code),
      communicationScore: calculateCommunicationScore(messages),
      timeline,
      aiSummary: generateAISummary(finalMetrics),
    }
    addMessage({ id: generateId(), role: 'system', content: 'Session ended', timestamp: new Date() })
    addAIMessage(getClosingFeedback(finalMetrics))
    setTimeout(() => onEnd(result), 1000)
  }, [metrics, code, messages, injections, timeline, config, onEnd, addMessage, addAIMessage])

  return (
    <div className="flex flex-col h-screen overflow-hidden animate-fade-in" style={{ background: 'var(--bg-secondary)' }}>
      <TopBar elapsedSeconds={elapsedSeconds} onInject={handleInject} onEndSession={handleEndSession} />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Problem — 22% */}
        <div className="flex-none overflow-hidden" style={{ width: '22%', borderRight: '1px solid var(--border-secondary)' }}>
          <ProblemPanel problem={problem} injections={injections} />
        </div>

        {/* Center: Code Editor — 50% */}
        <div className="flex-none overflow-hidden" style={{ width: '50%', borderRight: '1px solid var(--border-secondary)' }}>
          <CodeEditor language={config.language} problem={problem} code={code} onCodeChange={setCode} onRun={handleRun} />
        </div>

        {/* Right: Chat — 28% */}
        <div className="flex-none overflow-hidden" style={{ width: '28%' }}>
          <ChatPanel messages={messages} isTyping={isTyping} onSendMessage={handleSendMessage} />
        </div>
      </div>

      <MetricsBar metrics={metrics} durationSeconds={elapsedSeconds} />
    </div>
  )
}
