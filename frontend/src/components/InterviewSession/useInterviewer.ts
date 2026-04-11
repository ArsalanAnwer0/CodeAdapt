import { useCallback, useMemo, useReducer, useRef } from 'react'
import {
  initialInterviewerState,
  interviewerReducer,
  isBusy,
  type InterviewerAction,
  type InterviewerState,
} from './interviewerState'

/**
 * Convenience hook that wires the interviewer reducer up with a few
 * derived values and a stable `dispatch`. The session shell consumes
 * this to replace the old `isTyping` boolean + `lastInjectionTime` ref
 * combo with a single state machine.
 *
 * Exposes:
 *   - `state`         — current interviewer state
 *   - `dispatch`      — stable dispatch function
 *   - `busy`          — whether the interviewer should look active
 *   - `isTyping`      — legacy-compatible derived boolean for old UI
 *   - `lastInjectionAt` — elapsed-seconds marker, written by callers
 *     when an injection fires. Kept inside the hook so the session
 *     file can stop juggling refs.
 */
export interface UseInterviewerResult {
  state: InterviewerState
  dispatch: (action: InterviewerAction) => void
  busy: boolean
  isTyping: boolean
  markInjectionAt: (elapsedSeconds: number) => void
  clearInjection: () => void
  injectionElapsedAt: () => number | null
}

export function useInterviewer(): UseInterviewerResult {
  const [state, dispatch] = useReducer(
    interviewerReducer,
    initialInterviewerState
  )
  const lastInjection = useRef<number | null>(null)

  const markInjectionAt = useCallback((elapsedSeconds: number): void => {
    lastInjection.current = elapsedSeconds
  }, [])

  const clearInjection = useCallback((): void => {
    lastInjection.current = null
  }, [])

  const injectionElapsedAt = useCallback((): number | null => {
    return lastInjection.current
  }, [])

  return useMemo<UseInterviewerResult>(
    () => ({
      state,
      dispatch,
      busy: isBusy(state),
      // "thinking" and "reviewingCode" both show typing dots; any other
      // busy state is a header cue only (e.g. "Wrapping up…").
      isTyping:
        state.kind === 'thinking' || state.kind === 'reviewingCode',
      markInjectionAt,
      clearInjection,
      injectionElapsedAt,
    }),
    [state, markInjectionAt, clearInjection, injectionElapsedAt]
  )
}
