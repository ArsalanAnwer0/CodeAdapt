import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import TopBar from './TopBar'
import ProblemPanel from './ProblemPanel'
import CodeEditor from './CodeEditor'
import ChatPanel from './ChatPanel'
import MetricsBar from './MetricsBar'
import InjectionBanner from './InjectionBanner'
import WrapUpOverlay from './WrapUpOverlay'
import FollowUpTip from './FollowUpTip'
import SessionTour from './SessionTour'
import { usePreferences } from '../../stores/preferences'
import KeyboardShortcutsModal from '../KeyboardShortcutsModal'
import ConfirmEndSessionModal from '../ConfirmEndSessionModal'
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut'
import { useSound } from '../../hooks/useSound'
import { formatDurationHuman } from '../../lib/format'
import { useTheme } from '../../theme/ThemeProvider'
import { pickPersona } from './persona'
import { useInterviewer } from './useInterviewer'
import {
  pendingInjection,
  resolveLatest,
  resolvedCount,
} from './injectionHelpers'
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

export default function InterviewSession({
  config,
  onEnd,
}: InterviewSessionProps) {
  const { toggle: toggleTheme } = useTheme()
  const { play: playSound } = useSound()
  const { preferences, setPreference } = usePreferences()
  // Once the first injection lands and the user hasn't dismissed the
  // tip before, we flip this to true. Clicking X dismisses + persists.
  const [showFollowUpTip, setShowFollowUpTip] = useState(false)
  // Tour opens once on mount if the user hasn't seen it yet. We read
  // the flag into local state so dismissing doesn't cause a flicker
  // from the prefs round-trip.
  const [showTour, setShowTour] = useState<boolean>(
    () => !preferences.hasSeenSessionTour
  )
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showConfirmEnd, setShowConfirmEnd] = useState(false)
  const [problem] = useState<Problem>(() =>
    getRandomProblem(config.topic, config.difficulty)
  )
  const [code, setCode] = useState(() => problem.starterCode[config.language])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [injections, setInjections] = useState<Injection[]>([])
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // A stable persona per session so the candidate always sees the
  // same interviewer across reloads (deterministic seed).
  const persona = useMemo(
    () => pickPersona(`${config.topic}-${config.difficulty}-${problem.id}`),
    [config.topic, config.difficulty, problem.id]
  )

  // Single source of truth for "what is the interviewer doing right
  // now" — feeds the header, typing dots, avatar glow, and later the
  // code-reading sweep.
  const interviewer = useInterviewer()

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
  const lastUserMessageTime = useRef<number | null>(null)
  const userMessageCount = useRef(0)
  const openingMessageSent = useRef(false)

  // Derived: the single pending follow-up (if any). Drives the sticky
  // banner, the chat dim, and wrap-up eligibility.
  const pending = useMemo(() => pendingInjection(injections), [injections])

  useEffect(() => {
    const timer = setInterval(() => {
      elapsedRef.current += 1
      setElapsedSeconds((prev) => prev + 1)
      setMetrics((prev) => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1),
      }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Slow adaptability decay while a follow-up sits unaddressed.
  useEffect(() => {
    const checker = setInterval(() => {
      const injAt = interviewer.injectionElapsedAt()
      if (injAt !== null) {
        const since = elapsedRef.current - injAt
        if (since > 120 && since % 30 === 0) {
          setMetrics((prev) => ({
            ...prev,
            adaptabilityScore: Math.max(10, prev.adaptabilityScore - 2),
          }))
        }
      }
    }, 1000)
    return () => clearInterval(checker)
  }, [interviewer])

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg])
  }, [])

  const addAIMessage = useCallback(
    (
      content: string,
      role: ChatMessage['role'] = 'ai',
      kind?: ChatMessage['kind']
    ) => {
      addMessage({
        id: generateId(),
        role,
        content,
        timestamp: new Date(),
        kind,
      })
    },
    [addMessage]
  )

  useEffect(() => {
    if (openingMessageSent.current) return
    openingMessageSent.current = true
    interviewer.dispatch({ type: 'startGreeting' })
    const timer = setTimeout(() => {
      addAIMessage(getOpeningMessage(config, problem), 'ai', 'question')
      interviewer.dispatch({ type: 'settle' })
      playSound('messageIn')
    }, 800)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSendMessage = useCallback(
    (content: string) => {
      addMessage({
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
      })
      playSound('messageOut')
      userMessageCount.current += 1
      const now = elapsedRef.current

      const injAt = interviewer.injectionElapsedAt()
      if (injAt !== null) {
        const responseTime = now - injAt
        if (responseTime < 180) {
          setMetrics((prev) => ({
            ...prev,
            adaptabilityScore: Math.min(100, prev.adaptabilityScore + 5),
          }))
        }
        interviewer.clearInjection()
        // Mark the pending follow-up resolved so the banner disappears
        // and the chat un-dims.
        setInjections((prev) => resolveLatest(prev, new Date()))
      }

      if (lastUserMessageTime.current !== null) {
        const delta = (now - lastUserMessageTime.current) / 60
        setMetrics((prev) => {
          const count = userMessageCount.current
          return {
            ...prev,
            avgResponseTime:
              (prev.avgResponseTime * (count - 1) + delta) / count,
          }
        })
      }
      lastUserMessageTime.current = now

      interviewer.dispatch({ type: 'startThinking' })
      setTimeout(() => {
        interviewer.dispatch({ type: 'settle' })
        addAIMessage(
          getResponseToUserMessage(content, problem, code),
          'ai',
          'reply'
        )
        playSound('messageIn')
      }, 1000 + Math.random() * 1500)
    },
    [addMessage, addAIMessage, problem, code, interviewer, playSound]
  )

  const handleInject = useCallback(() => {
    const injection = getRandomInjection()
    const inj: Injection = {
      id: generateId(),
      content: injection.content,
      timestamp: new Date(),
      type: injection.type,
    }

    setInjections((prev) => [...prev, inj])
    setMetrics((prev) => ({
      ...prev,
      injectionCount: prev.injectionCount + 1,
      adaptabilityScore: Math.max(10, prev.adaptabilityScore - 5),
    }))
    interviewer.markInjectionAt(elapsedRef.current)
    // Brief "reading your code" beat before the follow-up card shows up.
    // This is what drives the editor sweep animation via the state
    // machine instead of a one-off flag.
    interviewer.dispatch({ type: 'startReviewing' })

    setTimeline((prev) => [
      ...prev,
      {
        type: 'injection',
        // Friendlier labels — the old "Bug Injected" sounded like a
        // system error, not a follow-up question from an interviewer.
        label:
          injection.type === 'bug'
            ? 'Bug appeared'
            : 'Requirements shifted',
        time: elapsedRef.current,
      },
    ])
    addMessage({
      id: generateId(),
      role: 'injection',
      content: injection.content,
      timestamp: new Date(),
    })
    playSound('followUp')
    if (!preferences.hasSeenFollowUpTip) setShowFollowUpTip(true)

    // Reading the code → thinking → follow-up. The two timeouts are
    // what the sweep + typing dots hang off of, so leaving them as
    // siblings of the state transitions keeps everything legible.
    setTimeout(() => {
      interviewer.dispatch({ type: 'startThinking' })
      setTimeout(() => {
        interviewer.dispatch({ type: 'settle' })
        addAIMessage(getInjectionFollowUp(inj), 'ai', 'follow-up')
        playSound('messageIn')
      }, 1500)
    }, 900)
  }, [addMessage, addAIMessage, interviewer, playSound, preferences.hasSeenFollowUpTip])

  const handleRun = useCallback(() => {
    setTimeline((prev) => [
      ...prev,
      { type: 'submission', label: 'Ran code', time: elapsedRef.current },
    ])
    if (code.trim().length > 200) {
      setMetrics((prev) => ({
        ...prev,
        problemsSolved: Math.min(prev.problemsSolved + 1, prev.totalProblems),
        adaptabilityScore: Math.min(100, prev.adaptabilityScore + 3),
      }))
      playSound('dingSoft')
    }
    // A run after an injection counts as addressing the follow-up.
    if (pending) {
      setInjections((prev) => resolveLatest(prev, new Date()))
      interviewer.clearInjection()
    }
  }, [code, pending, interviewer, playSound])

  const [wrappingUp, setWrappingUp] = useState(false)
  const handleEndSession = useCallback(() => {
    interviewer.dispatch({ type: 'startWrapUp' })
    playSound('wrapUp')
    setWrappingUp(true)
    const finalMetrics = {
      ...metrics,
      injectionCount: resolvedCount(injections),
    }
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
    addMessage({
      id: generateId(),
      role: 'system',
      content: 'Session ended',
      timestamp: new Date(),
    })
    addAIMessage(getClosingFeedback(finalMetrics), 'ai', 'reply')
    // Give the wrap-up overlay enough time to read as a moment, not
    // a flash — the CSS fill completes at 1.1s.
    setTimeout(() => onEnd(result), 1300)
  }, [
    metrics,
    code,
    messages,
    injections,
    timeline,
    config,
    onEnd,
    addMessage,
    addAIMessage,
    interviewer,
    playSound,
  ])

  // Global keyboard shortcuts for power users.
  useKeyboardShortcut('mod+i', () => handleInject())
  useKeyboardShortcut('mod+shift+e', () => setShowConfirmEnd(true))
  useKeyboardShortcut('mod+shift+l', () => toggleTheme())
  useKeyboardShortcut(['mod+/', 'mod+shift+?'], () =>
    setShowShortcuts((prev) => !prev)
  )

  const dimChat = Boolean(pending)

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <TopBar
        elapsedSeconds={elapsedSeconds}
        onInject={handleInject}
        onEndSession={() => setShowConfirmEnd(true)}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Problem — 20% */}
        <div
          className="flex-none overflow-hidden"
          style={{
            width: '20%',
            borderRight: '1px solid var(--border-secondary)',
            minWidth: '240px',
          }}
        >
          <ProblemPanel problem={problem} injections={injections} />
        </div>

        {/* Center: Code Editor + sticky InjectionBanner — 48% */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            borderRight: '1px solid var(--border-secondary)',
            minWidth: '400px',
          }}
        >
          <InjectionBanner injection={pending} />
          <FollowUpTip
            open={showFollowUpTip && Boolean(pending)}
            onDismiss={() => {
              setShowFollowUpTip(false)
              setPreference('hasSeenFollowUpTip', true)
            }}
          />
          <div className="flex-1 min-h-0 overflow-hidden">
            <CodeEditor
              language={config.language}
              problem={problem}
              code={code}
              onCodeChange={setCode}
              onRun={handleRun}
              sweeping={interviewer.state.kind === 'reviewingCode'}
            />
          </div>
        </div>

        {/* Right: Chat — 32% */}
        <div
          className={`flex-none overflow-hidden ${dimChat ? 'chat-dim' : ''}`}
          style={{ width: '32%', minWidth: '300px' }}
        >
          <ChatPanel
            messages={messages}
            isTyping={interviewer.isTyping}
            onSendMessage={handleSendMessage}
            persona={persona}
            interviewerState={interviewer.state}
            onComposerFocus={() =>
              interviewer.dispatch({ type: 'startListening' })
            }
            onComposerBlur={() => interviewer.dispatch({ type: 'settle' })}
          />
        </div>
      </div>

      <MetricsBar metrics={metrics} durationSeconds={elapsedSeconds} />

      <SessionTour
        open={showTour}
        persona={persona}
        onClose={() => {
          setShowTour(false)
          setPreference('hasSeenSessionTour', true)
        }}
      />

      <WrapUpOverlay
        open={wrappingUp}
        persona={persona}
        resolvedFollowUps={resolvedCount(injections)}
      />

      <KeyboardShortcutsModal
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      <ConfirmEndSessionModal
        open={showConfirmEnd}
        onClose={() => setShowConfirmEnd(false)}
        onConfirm={handleEndSession}
        summary={
          <>
            <strong style={{ color: 'var(--text-secondary)' }}>
              {formatDurationHuman(elapsedSeconds)}
            </strong>{' '}
            elapsed · {messages.length} messages · {injections.length}{' '}
            follow-ups
          </>
        }
      />
    </div>
  )
}
