/**
 * Public API surface used by the UI.
 *
 * The rest of the app should import from `services/api` and never touch
 * `http`, `mockAdapter`, or data files directly. The concrete backing
 * implementation is chosen here based on `env.enableMockApi`, so flipping
 * from the mock to a real server is a one-line change.
 */
import type {
  ChatMessage,
  Difficulty,
  Injection,
  Problem,
  SessionConfig,
  SessionMetrics,
  SessionResult,
  Topic,
} from '../types'
import { env } from '../lib/env'
import { createLogger } from '../lib/logger'
import { mockApi } from './mockAdapter'
import { http } from './http'

const log = createLogger('api')

export interface FetchProblemParams {
  topic: Topic
  difficulty: Difficulty
}

export interface SendMessagePayload {
  sessionId: string
  content: string
  problem: Problem
  code: string
}

export interface InjectionPayload {
  sessionId: string
}

export interface InjectionFollowUpPayload {
  sessionId: string
  injection: Injection
}

export interface ClosingFeedbackPayload {
  metrics: SessionMetrics
}

export interface CompleteSessionPayload {
  config: SessionConfig
  metrics: SessionMetrics
  code: string
  messages: ChatMessage[]
  injections: Injection[]
  duration: number
}

export interface Api {
  /** Pick a problem matching the topic/difficulty. */
  fetchProblem(params: FetchProblemParams): Promise<Problem>
  /** Generate the opening interviewer message. */
  getOpeningMessage(config: SessionConfig, problem: Problem): Promise<string>
  /** Reply to a user message. */
  sendMessage(payload: SendMessagePayload): Promise<string>
  /** Emit a new chaos injection. */
  createInjection(payload: InjectionPayload): Promise<Injection>
  /** Get the AI follow-up for an injection. */
  getInjectionFollowUp(payload: InjectionFollowUpPayload): Promise<string>
  /** Get closing feedback when the session ends. */
  getClosingFeedback(payload: ClosingFeedbackPayload): Promise<string>
  /** Finalize the session and return a SessionResult. */
  completeSession(payload: CompleteSessionPayload): Promise<SessionResult>
}

/**
 * Real API client — talks to the backend.
 * Currently a stub that forwards to the HTTP client; the backend is WIP.
 */
const httpApi: Api = {
  fetchProblem: (params) => http.post<Problem>('/problems/pick', params),
  getOpeningMessage: (config, problem) =>
    http
      .post<{ message: string }>('/interview/opening', { config, problem })
      .then((r) => r.message),
  sendMessage: (payload) =>
    http
      .post<{ message: string }>('/interview/message', payload)
      .then((r) => r.message),
  createInjection: (payload) => http.post<Injection>('/interview/inject', payload),
  getInjectionFollowUp: (payload) =>
    http
      .post<{ message: string }>('/interview/inject/follow-up', payload)
      .then((r) => r.message),
  getClosingFeedback: (payload) =>
    http
      .post<{ message: string }>('/interview/closing', payload)
      .then((r) => r.message),
  completeSession: (payload) =>
    http.post<SessionResult>('/interview/complete', payload),
}

/** The active implementation, chosen once at module load. */
export const api: Api = env.enableMockApi ? mockApi : httpApi

log.info(`API mode: ${env.enableMockApi ? 'mock' : 'http'} (${env.apiUrl || 'no base URL'})`)
