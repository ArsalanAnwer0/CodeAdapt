import React, { useState, useEffect, useRef, Suspense, lazy } from 'react'
import SetupPanel from './components/SetupPanel'
import MobileWarning from './components/MobileWarning'

// Interview + results carry the Monaco editor and heavy chart code,
// so split them into their own chunks to keep the initial bundle lean.
const InterviewSession = lazy(() => import('./components/InterviewSession'))
const ResultsScreen = lazy(() => import('./components/ResultsScreen'))
const HistoryScreen = lazy(() => import('./components/HistoryScreen'))
import { useHistory } from './stores/history'
import { usePreferences } from './stores/preferences'
import { useMediaQuery } from './hooks/useMediaQuery'
import { MIN_INTERVIEW_WIDTH } from './lib/constants'
import { SessionConfig, SessionResult } from './types'

type AppState = 'setup' | 'interview' | 'results' | 'history'

function PageTransition({ children, state }: { children: React.ReactNode; state: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(false)
    const timer = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(timer)
  }, [state])

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.35s ease-out, transform 0.35s ease-out',
        height: '100%',
      }}
    >
      {children}
    </div>
  )
}

export default function App() {
  const isTooNarrow = useMediaQuery(`(max-width: ${MIN_INTERVIEW_WIDTH - 1}px)`)
  const [appState, setAppState] = useState<AppState>('setup')
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null)
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null)
  const { add: addToHistory } = useHistory()
  const { setPreference } = usePreferences()
  const persistedResultIds = useRef<Set<SessionResult>>(new Set())

  const handleStart = (config: SessionConfig) => {
    // Remember the last-used configuration for next time.
    setPreference('language', config.language)
    setPreference('topic', config.topic)
    setPreference('difficulty', config.difficulty)
    setSessionConfig(config)
    setAppState('interview')
  }

  const handleEndSession = (result: SessionResult) => {
    // Persist completed sessions to history exactly once.
    if (!persistedResultIds.current.has(result)) {
      persistedResultIds.current.add(result)
      addToHistory(result)
    }
    setSessionResult(result)
    setAppState('results')
  }

  const handleReset = () => {
    setSessionConfig(null)
    setSessionResult(null)
    setAppState('setup')
  }

  const renderContent = () => {
    if (appState === 'interview' && sessionConfig) {
      return <InterviewSession config={sessionConfig} onEnd={handleEndSession} />
    }
    if (appState === 'results' && sessionResult) {
      return <ResultsScreen result={sessionResult} onReset={handleReset} />
    }
    if (appState === 'history') {
      return (
        <HistoryScreen
          onBack={() => setAppState('setup')}
          onOpen={(stored) => {
            setSessionResult(stored)
            setAppState('results')
          }}
        />
      )
    }
    return (
      <SetupPanel
        onStart={handleStart}
        onViewHistory={() => setAppState('history')}
      />
    )
  }

  // Block the interview layout on tiny viewports. The setup and history
  // screens are narrow-friendly, so only guard `interview`.
  if (appState === 'interview' && isTooNarrow) {
    return <MobileWarning />
  }

  return (
    <PageTransition state={appState}>
      <Suspense fallback={<RouteFallback />}>{renderContent()}</Suspense>
    </PageTransition>
  )
}

function RouteFallback(): React.ReactElement {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div
        className="flex items-center gap-3 text-[12px] font-medium"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: 'var(--accent-blue)' }}
        />
        Loading…
      </div>
    </div>
  )
}
