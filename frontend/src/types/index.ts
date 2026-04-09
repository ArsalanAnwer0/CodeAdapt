export type Language = 'javascript' | 'python' | 'java' | 'cpp' | 'go' | 'typescript' | 'rust'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type Topic = 'arrays' | 'strings' | 'trees' | 'graphs' | 'dynamic-programming' | 'linked-lists' | 'sorting' | 'binary-search' | 'recursion' | 'stacks-queues'
export type SessionDuration = 15 | 30 | 45 | 60

export interface SessionConfig {
  language: Language
  difficulty: Difficulty
  topic: Topic
  duration: SessionDuration
}

export interface Problem {
  id: string
  title: string
  difficulty: Difficulty
  topic: Topic
  description: string
  examples: Array<{ input: string; output: string; explanation?: string }>
  constraints: string[]
  starterCode: Record<Language, string>
}

export interface ChatMessage {
  id: string
  role: 'system' | 'ai' | 'user' | 'injection'
  content: string
  timestamp: Date
}

export interface Injection {
  id: string
  content: string
  timestamp: Date
  type: 'requirement' | 'bug'
}

export interface SessionMetrics {
  adaptabilityScore: number
  problemsSolved: number
  totalProblems: number
  injectionCount: number
  avgResponseTime: number // in minutes
  timeRemaining: number // in seconds
}

export interface SessionResult {
  config: SessionConfig
  metrics: SessionMetrics
  duration: number // actual session duration in seconds
  messages: ChatMessage[]
  injections: Injection[]
  codeQualityScore: number
  communicationScore: number
  timeline: TimelineEvent[]
  aiSummary: string
}

export interface TimelineEvent {
  type: 'problem' | 'injection' | 'submission'
  label: string
  time: number // seconds from session start
}
