/**
 * Chat and injection domain types.
 *
 * `ChatMessage` models any bubble in the interview chat panel,
 * including user input, AI replies, system notices, and live injections.
 * `Injection` is a separate model for the structured injection feed.
 */

export type ChatRole = 'system' | 'ai' | 'user' | 'injection'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  timestamp: Date
}

export type InjectionType = 'requirement' | 'bug'

export interface Injection {
  id: string
  content: string
  timestamp: Date
  type: InjectionType
}
