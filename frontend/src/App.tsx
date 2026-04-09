import React, { useState } from 'react'
import SetupPanel from './components/SetupPanel'
import InterviewSession from './components/InterviewSession'
import ResultsScreen from './components/ResultsScreen'
import { SessionConfig, SessionResult } from './types'

type AppState = 'setup' | 'interview' | 'results'

export default function App() {
  const [appState, setAppState] = useState<AppState>('setup')
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null)
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null)

  const handleStart = (config: SessionConfig) => {
    setSessionConfig(config)
    setAppState('interview')
  }

  const handleEndSession = (result: SessionResult) => {
    setSessionResult(result)
    setAppState('results')
  }

  const handleReset = () => {
    setSessionConfig(null)
    setSessionResult(null)
    setAppState('setup')
  }

  if (appState === 'setup') {
    return <SetupPanel onStart={handleStart} />
  }

  if (appState === 'interview' && sessionConfig) {
    return (
      <InterviewSession
        config={sessionConfig}
        onEnd={handleEndSession}
      />
    )
  }

  if (appState === 'results' && sessionResult) {
    return <ResultsScreen result={sessionResult} onReset={handleReset} />
  }

  // Fallback
  return <SetupPanel onStart={handleStart} />
}
