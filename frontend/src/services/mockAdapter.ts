/**
 * Mock adapter implementing the `Api` interface.
 *
 * This sits between the UI and the legacy mock utility modules so the
 * UI never needs to know whether it's hitting a real server or not.
 * All calls are async with a small simulated latency to match the
 * feel of real network I/O.
 */
import {
  getOpeningMessage as genOpening,
  getResponseToUserMessage as genReply,
  getInjectionFollowUp as genInjectionFollowUp,
  getClosingFeedback as genClosing,
  generateAISummary,
  calculateCodeQuality,
  calculateCommunicationScore,
} from '../utils/mockAI'
import { getRandomProblem } from '../data/problems'
import { getRandomInjection } from '../data/injections'
import type { Injection, SessionResult } from '../types'
import type {
  Api,
  CompleteSessionPayload,
  FetchProblemParams,
  InjectionPayload,
  InjectionFollowUpPayload,
  ClosingFeedbackPayload,
  SendMessagePayload,
} from './api'
import type { SessionConfig } from '../types'
import type { Problem } from '../types'

/** Simulate realistic network latency so loading states are exercised. */
function delay<T>(value: T, minMs = 120, maxMs = 320): Promise<T> {
  const ms = minMs + Math.random() * (maxMs - minMs)
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const mockApi: Api = {
  fetchProblem: ({ topic, difficulty }: FetchProblemParams) =>
    delay(getRandomProblem(topic, difficulty)),

  getOpeningMessage: (config: SessionConfig, problem: Problem) =>
    delay(genOpening(config, problem), 300, 600),

  sendMessage: ({ content, problem, code }: SendMessagePayload) =>
    delay(genReply(content, problem, code), 600, 1400),

  createInjection: (_payload: InjectionPayload): Promise<Injection> => {
    const raw = getRandomInjection()
    const injection: Injection = {
      id: genId(),
      content: raw.content,
      timestamp: new Date(),
      type: raw.type,
    }
    return delay(injection, 100, 200)
  },

  getInjectionFollowUp: ({ injection }: InjectionFollowUpPayload) =>
    delay(genInjectionFollowUp(injection), 600, 1400),

  getClosingFeedback: ({ metrics }: ClosingFeedbackPayload) =>
    delay(genClosing(metrics), 300, 600),

  completeSession: (payload: CompleteSessionPayload): Promise<SessionResult> => {
    const codeQualityScore = calculateCodeQuality(payload.code)
    const communicationScore = calculateCommunicationScore(payload.messages)
    const result: SessionResult = {
      config: payload.config,
      metrics: payload.metrics,
      duration: payload.duration,
      messages: payload.messages,
      injections: payload.injections,
      codeQualityScore,
      communicationScore,
      timeline: [], // timeline is tracked on the client
      aiSummary: generateAISummary(payload.metrics),
    }
    return delay(result, 200, 400)
  },
}
