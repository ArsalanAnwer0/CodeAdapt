/**
 * Interviewer state machine.
 *
 * Every visible piece of "the interviewer" (status dot, avatar glow,
 * typing indicator, header subtitle, editor sweep) reads from this
 * single source of truth. Previously these signals were scattered
 * across booleans like `isTyping` and refs like `lastInjectionTime`,
 * which made it impossible to coordinate animations cleanly.
 */

export type InterviewerState =
  | { kind: 'idle' }
  | { kind: 'greeting' }
  | { kind: 'listening' }
  | { kind: 'thinking'; since: number }
  | { kind: 'reviewingCode' }
  | { kind: 'askingFollowUp'; injectionId: string }
  | { kind: 'wrappingUp' }

export type InterviewerAction =
  | { type: 'reset' }
  | { type: 'startGreeting' }
  | { type: 'startListening' }
  | { type: 'startThinking' }
  | { type: 'startReviewing' }
  | { type: 'startFollowUp'; injectionId: string }
  | { type: 'startWrapUp' }
  | { type: 'settle' }

export const initialInterviewerState: InterviewerState = { kind: 'idle' }

export function interviewerReducer(
  state: InterviewerState,
  action: InterviewerAction
): InterviewerState {
  switch (action.type) {
    case 'reset':
      return { kind: 'idle' }
    case 'startGreeting':
      return { kind: 'greeting' }
    case 'startListening':
      return { kind: 'listening' }
    case 'startThinking':
      return { kind: 'thinking', since: Date.now() }
    case 'startReviewing':
      return { kind: 'reviewingCode' }
    case 'startFollowUp':
      return { kind: 'askingFollowUp', injectionId: action.injectionId }
    case 'startWrapUp':
      return { kind: 'wrappingUp' }
    case 'settle':
      // Don't clobber the wrap-up state — the session is ending.
      if (state.kind === 'wrappingUp') return state
      return { kind: 'idle' }
    default:
      return state
  }
}

/**
 * Human-readable status line rendered under the interviewer's name.
 * Kept here so the mapping stays colocated with the state definition.
 */
export function statusLabel(state: InterviewerState): string {
  switch (state.kind) {
    case 'idle':
      return 'Online'
    case 'greeting':
      return 'Opening the interview…'
    case 'listening':
      return 'Listening'
    case 'thinking':
      return 'Thinking…'
    case 'reviewingCode':
      return 'Reviewing your code…'
    case 'askingFollowUp':
      return 'Raising a follow-up…'
    case 'wrappingUp':
      return 'Wrapping up the interview…'
  }
}

/**
 * Whether the status should be represented as an active/pulsing dot.
 * The header card uses this to decide between the steady "online"
 * indicator and the animated "busy" one.
 */
export function isBusy(state: InterviewerState): boolean {
  return state.kind !== 'idle' && state.kind !== 'listening'
}
