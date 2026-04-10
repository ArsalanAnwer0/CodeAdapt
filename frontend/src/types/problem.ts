/**
 * Problem domain types.
 *
 * A Problem is a single coding exercise presented during an interview
 * session. It carries its own starter code per language so the editor
 * can hydrate correctly at session start.
 */
import type { Difficulty, Language, Topic } from './session'

export interface ProblemExample {
  input: string
  output: string
  explanation?: string
}

export interface Problem {
  id: string
  title: string
  difficulty: Difficulty
  topic: Topic
  description: string
  examples: ProblemExample[]
  constraints: string[]
  starterCode: Record<Language, string>
}
