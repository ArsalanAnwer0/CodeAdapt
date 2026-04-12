import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import TopBar from './TopBar'
import ProblemPanel from './ProblemPanel'
import CodeEditor from './CodeEditor'
import ChatPanel from './ChatPanel'
import type { ChatComposerHandle } from './ChatComposer'
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
import { api } from '../../services/api'
import { createLogger } from '../../lib/logger'

const log = createLogger('session')

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

  const composerRef = useRef<ChatComposerHandle>(null)
  const elapsedRef = useRef(0)

  // Mounted guard — every async call in this component checks this
  // before writing to state so we don't update after unmount (e.g. the
  // user ends the session while the interviewer was "thinking").
  const mountedRef = useRef(true)
  useEffect(() => () => { mountedRef.current = false }, [])
  /**
   * Tracks every pending `setTimeout` the session owns so we can
   * cancel them on unmount. Without this, a timer scheduled for
   * `settle` or `addAIMessage` can fire after the component has
   * already unmounted, which both leaks memory and (previously) was
   * one of the hairier classes of bugs when the user clicked "End
   * session" before the interviewer had finished thinking.
   */
  const pendingTimers = useRef<Set<number>>(new Set())
  const schedule = useCallback((fn: () => void, ms: number): void => {
    const id = window.setTimeout(() => {
      pendingTimers.current.delete(id)
      fn()
    }, ms)
    pendingTimers.current.add(id)
  }, [])
  useEffect(() => {
    return () => {
      pendingTimers.current.forEach((id) => window.clearTimeout(id))
      pendingTimers.current.clear()
    }
  }, [])
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
    api.getOpeningMessage(config, problem).then((text) => {
      if (!mountedRef.current) return
      addAIMessage(text, 'ai', 'question')
      interviewer.dispatch({ type: 'settle' })
      playSound('messageIn')
    }).catch((err) => log.error('opening message failed', err))
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
      api
        .sendMessage({
          sessionId: problem.id,
          content,
          problem,
          code,
        })
        .then((text) => {
          if (!mountedRef.current) return
          interviewer.dispatch({ type: 'settle' })
          addAIMessage(text, 'ai', 'reply')
          playSound('messageIn')
        })
        .catch((err) => log.error('reply failed', err))
    },
    [addMessage, addAIMessage, problem, code, interviewer, playSound]
  )

  const handleInject = useCallback(() => {
    // Delegate injection creation to the API — the mock builds a random
    // one locally, the real backend will draw from the problem context.
    api
      .createInjection({ sessionId: problem.id })
      .then((inj) => {
        if (!mountedRef.current) return

        setInjections((prev) => [...prev, inj])
        setMetrics((prev) => ({
          ...prev,
          injectionCount: prev.injectionCount + 1,
          adaptabilityScore: Math.max(10, prev.adaptabilityScore - 5),
        }))
        interviewer.markInjectionAt(elapsedRef.current)
        interviewer.dispatch({ type: 'startReviewing' })

        setTimeline((prev) => [
          ...prev,
          {
            type: 'injection',
            label:
              inj.type === 'bug'
                ? 'Bug appeared'
                : 'Requirements shifted',
            time: elapsedRef.current,
          },
        ])
        addMessage({
          id: generateId(),
          role: 'injection',
          content: inj.content,
          timestamp: new Date(),
        })
        playSound('followUp')
        if (!preferences.hasSeenFollowUpTip) setShowFollowUpTip(true)

        // Reading the code → thinking → follow-up message.
        schedule(() => {
          interviewer.dispatch({ type: 'startThinking' })
          api
            .getInjectionFollowUp({
              sessionId: problem.id,
              injection: inj,
            })
            .then((text) => {
              if (!mountedRef.current) return
              interviewer.dispatch({ type: 'settle' })
              addAIMessage(text, 'ai', 'follow-up')
              playSound('messageIn')
            })
            .catch((err) => log.error('follow-up failed', err))
        }, 900)
      })
      .catch((err) => log.error('injection failed', err))
  }, [
    addMessage,
    addAIMessage,
    interviewer,
    playSound,
    preferences.hasSeenFollowUpTip,
    schedule,
    problem.id,
  ])

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

    addMessage({
      id: generateId(),
      role: 'system',
      content: 'Session ended',
      timestamp: new Date(),
    })

    // Fire closing feedback + result build concurrently via the API.
    // The mock adapters mirror the old logic; the real backend will
    // aggregate scoring server-side.
    Promise.all([
      api.getClosingFeedback({ metrics: finalMetrics }),
      api.completeSession({
        config,
        metrics: finalMetrics,
        code,
        messages,
        injections,
        duration: elapsedRef.current,
      }),
    ])
      .then(([closingText, result]) => {
        if (!mountedRef.current) return
        // Attach client-side timeline — the server may not know about
        // it and the type already has a fallback for an empty array.
        const enriched: SessionResult = {
          ...result,
          timeline: result.timeline.length ? result.timeline : timeline,
        }
        addAIMessage(closingText, 'ai', 'reply')
        schedule(() => onEnd(enriched), 1300)
      })
      .catch((err) => {
        log.error('end session failed', err)
        // Fall through so the user isn't stuck on the overlay.
        schedule(() => onEnd({
          config,
          metrics: finalMetrics,
          duration: elapsedRef.current,
          messages,
          injections,
          codeQualityScore: 0,
          communicationScore: 0,
          timeline,
          aiSummary: 'Results could not be generated.',
        }), 1300)
      })
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
    schedule,
  ])

  // Global keyboard shortcuts for power users.
  // ⌘K jumps focus to the composer so you can reply without reaching
  // for the mouse — common "jump to chat" shortcut in editor tools.
  useKeyboardShortcut('mod+k', () => composerRef.current?.focus())
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
            ref={composerRef}
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
