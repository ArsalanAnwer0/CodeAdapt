/**
 * Chat and injection domain types.
 *
 * `ChatMessage` models any bubble in the interview chat panel,
 * including user input, AI replies, system notices, and live injections.
 * `Injection` is a separate model for the structured injection feed.
 */

export type ChatRole = 'system' | 'ai' | 'user' | 'injection'

/**
 * Sub-kind of an AI bubble. Purely visual — lets the thread render
 * a question card differently from a plain reply or a code observation
 * without inventing new roles. Unset falls back to "reply".
 */
export type AIMessageKind =
  | 'reply'
  | 'question'
  | 'code-observation'
  | 'follow-up'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  timestamp: Date
  /** Only meaningful when role === 'ai'. */
  kind?: AIMessageKind
}

export type InjectionType = 'requirement' | 'bug'

export interface Injection {
  id: string
  content: string
  timestamp: Date
  type: InjectionType
  /**
   * When the candidate addressed this injection (by sending a reply or
   * shipping a code run after it landed). `undefined` means the
   * follow-up is still pending, which the sticky InjectionBanner reads
   * to decide whether it should be visible.
   */
  resolvedAt?: Date
}
