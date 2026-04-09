import { ChatMessage, Injection, Problem, SessionConfig, SessionMetrics } from '../types'

// ─── Opening messages ────────────────────────────────────────────────────────

const openingTemplates = [
  (config: SessionConfig, problem: Problem) =>
    `Welcome to your ${config.difficulty} ${config.topic.replace(/-/g, ' ')} session! Today we'll be working in ${config.language === 'cpp' ? 'C++' : config.language === 'typescript' ? 'TypeScript' : config.language.charAt(0).toUpperCase() + config.language.slice(1)}.\n\nYour first problem is **${problem.title}**. Take a moment to read through the description carefully. Once you have a plan, feel free to explain your approach before you start coding — I'll be here to guide you.`,
  (config: SessionConfig, problem: Problem) =>
    `Hi there! Ready to sharpen those ${config.topic.replace(/-/g, ' ')} skills? We have ${config.duration} minutes together.\n\nI've set up **${problem.title}** for you — a classic ${config.difficulty} problem. What's your initial thinking on this? Don't worry about getting to code immediately; let's discuss the approach first.`,
  (config: SessionConfig, problem: Problem) =>
    `Great, let's dive in! You're tackling **${problem.title}** in ${config.language === 'cpp' ? 'C++' : config.language}. This is a ${config.difficulty}-level ${config.topic.replace(/-/g, ' ')} problem.\n\nBefore writing any code, walk me through how you're thinking about this. What data structures come to mind?`,
]

export function getOpeningMessage(config: SessionConfig, problem: Problem): string {
  const template = openingTemplates[Math.floor(Math.random() * openingTemplates.length)]
  return template(config, problem)
}

// ─── Response to user messages ───────────────────────────────────────────────

const hints: Record<string, string[]> = {
  arrays: [
    'Have you considered a two-pointer approach? It often reduces time complexity for sorted arrays.',
    'Think about what information you need to track as you iterate. A hash map might help.',
    'Sliding window techniques are powerful for subarray problems. Could that apply here?',
    'Consider the edge cases: empty array, single element, all elements the same.',
  ],
  strings: [
    'For string problems, consider building a frequency map of characters first.',
    'Two pointers work great here — one from each end of the string.',
    'Think about what invariant you want to maintain as you traverse the string.',
    'Have you considered sorting the characters? It often simplifies comparisons.',
  ],
  trees: [
    'Recursion is natural for tree problems — what\'s your base case?',
    'Think about whether you need preorder, inorder, or postorder traversal here.',
    'Passing additional parameters down the recursive calls can be very helpful.',
    'BFS with a queue gives you level-order access — sometimes that\'s exactly what you need.',
  ],
  'dynamic-programming': [
    'Start by defining what your subproblem is. What does dp[i] represent?',
    'Think about the recurrence relation — how does dp[i] relate to dp[i-1] or dp[i-2]?',
    'Memoization top-down vs tabulation bottom-up — both are valid. Which feels more natural?',
    'Make sure you identify all base cases before filling your dp table.',
  ],
  'linked-lists': [
    'A dummy head node often simplifies the logic for edge cases.',
    'Two-pointer technique (fast and slow) is a key tool for linked list problems.',
    'Draw out the pointer manipulations on paper — it prevents bugs.',
    'Be careful about the order of pointer updates — it\'s easy to lose a reference.',
  ],
  default: [
    'Good thinking — keep going. What\'s your time complexity estimate so far?',
    'Walk me through that logic. Can you trace through one of the examples?',
    'That approach looks promising. How would you handle the edge cases?',
    'Interesting! Have you considered the space complexity of that solution?',
  ],
}

const encouragements = [
  'Good progress! Your reasoning is solid. Keep pushing.',
  'I like where this is going. You\'re on the right track.',
  'That\'s a valid approach. Let\'s refine it a bit.',
  'Nice! You\'re thinking about this the right way.',
  'Great question — that shows you\'re thinking about edge cases.',
]

const clarifyingQuestions = [
  'Can you explain the time complexity of your current approach?',
  'What happens when the input is empty or has only one element?',
  'How does your solution handle duplicate values?',
  'Can you trace through the second example with your current code?',
  'Is there a way to optimize your space usage here?',
  'What\'s the bottleneck in your algorithm right now?',
]

export function getResponseToUserMessage(
  userMessage: string,
  problem: Problem,
  codeContent: string
): string {
  const lower = userMessage.toLowerCase()
  const hasCode = codeContent.trim().length > 100

  // Check for specific keywords and give context-aware responses
  if (lower.includes('help') || lower.includes('hint') || lower.includes('stuck')) {
    const topicHints = hints[problem.topic] || hints.default
    return topicHints[Math.floor(Math.random() * topicHints.length)]
  }

  if (lower.includes('complexity') || lower.includes('time') || lower.includes('space')) {
    return `Good question about complexity! For this problem, the optimal solution typically achieves O(n) time complexity. What's your current estimate for your implementation? And have you thought about the space trade-offs?`
  }

  if (lower.includes('done') || lower.includes('finished') || lower.includes('complete')) {
    if (hasCode) {
      return `Let's verify your solution. Can you walk me through it with the first example? Trace through the input step by step and show me what your code does at each stage.`
    }
    return `It looks like you still have some code to write. What part are you stuck on? I'm happy to guide you.`
  }

  if (lower.includes('approach') || lower.includes('idea') || lower.includes('plan')) {
    return `That sounds like a reasonable approach. Before you code it, estimate the time and space complexity. Is there a more optimal solution, or is this already at the theoretical limit?`
  }

  // Rotate through different response types
  const rand = Math.random()
  if (rand < 0.35) {
    return encouragements[Math.floor(Math.random() * encouragements.length)]
  } else if (rand < 0.65) {
    return clarifyingQuestions[Math.floor(Math.random() * clarifyingQuestions.length)]
  } else {
    const topicHints = hints[problem.topic] || hints.default
    return topicHints[Math.floor(Math.random() * topicHints.length)]
  }
}

// ─── Injection follow-up messages ────────────────────────────────────────────

export function getInjectionFollowUp(injection: Injection): string {
  if (injection.type === 'bug') {
    return `There's a live issue that needs your attention. Take a moment to understand the bug report, then update your solution. Explain what you think is going wrong and how you'll fix it.`
  }
  return `Requirements have changed — this is a common scenario in real-world engineering. Adapt your current solution to meet the new spec. How will this affect your existing implementation?`
}

// ─── Closing feedback ────────────────────────────────────────────────────────

export function getClosingFeedback(metrics: SessionMetrics): string {
  const score = metrics.adaptabilityScore
  if (score >= 85) {
    return `Outstanding session! You adapted to every curveball with composure and efficiency. Your ability to pivot under pressure is a genuine strength. I'd be confident putting you forward for senior-level roles.`
  } else if (score >= 70) {
    return `Solid performance! You handled the dynamic requirements well and showed good algorithmic thinking. A few rough edges, but overall you demonstrated the adaptability that strong engineers need.`
  } else if (score >= 55) {
    return `Good effort. You got through the material, though the injections slowed you down more than ideal. Focus on building resilience to mid-session requirement changes — that's a critical interview skill.`
  } else {
    return `You showed some good fundamentals, but the session revealed areas for growth — particularly around adapting to changes quickly. Keep practicing under timed, dynamic conditions. You'll get there.`
  }
}

// ─── AI Summary ──────────────────────────────────────────────────────────────

const summaryTemplates = [
  (metrics: SessionMetrics) =>
    `Candidate demonstrated ${metrics.adaptabilityScore >= 70 ? 'strong' : 'developing'} adaptability, solving ${metrics.problemsSolved} problem${metrics.problemsSolved !== 1 ? 's' : ''} and handling ${metrics.injectionCount} runtime injection${metrics.injectionCount !== 1 ? 's' : ''} with an average response time of ${metrics.avgResponseTime.toFixed(1)} minutes.`,
  (metrics: SessionMetrics) =>
    `Session score: ${metrics.adaptabilityScore}/100. Candidate ${metrics.injectionCount > 0 ? `navigated ${metrics.injectionCount} mid-session disruption${metrics.injectionCount !== 1 ? 's' : ''} and` : ''} completed ${metrics.problemsSolved} of ${metrics.totalProblems} assigned problem${metrics.totalProblems !== 1 ? 's' : ''}.`,
  (metrics: SessionMetrics) =>
    `${metrics.adaptabilityScore >= 75 ? 'Recommended for next round.' : metrics.adaptabilityScore >= 55 ? 'Borderline — consider a follow-up.' : 'Needs further preparation.'} Adaptability: ${metrics.adaptabilityScore}/100, Problems solved: ${metrics.problemsSolved}/${metrics.totalProblems}.`,
]

export function generateAISummary(metrics: SessionMetrics): string {
  const template = summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)]
  return template(metrics)
}

// ─── Code quality heuristic ──────────────────────────────────────────────────

export function calculateCodeQuality(code: string): number {
  if (!code || code.trim().length === 0) return 0

  let score = 0
  const lines = code.split('\n').filter((l) => l.trim().length > 0)
  const totalChars = code.trim().length

  // Length: meaningful implementation
  if (totalChars > 200) score += 20
  else if (totalChars > 100) score += 10
  else score += 5

  // Comments present
  const commentLines = lines.filter(
    (l) => l.trim().startsWith('//') || l.trim().startsWith('#') || l.trim().startsWith('*')
  )
  const commentRatio = commentLines.length / Math.max(lines.length, 1)
  score += Math.min(20, Math.round(commentRatio * 60))

  // Variable naming (longer identifiers = more descriptive)
  const identifiers = code.match(/\b[a-zA-Z_]\w{3,}\b/g) || []
  score += Math.min(20, identifiers.length * 2)

  // Proper indentation (consistent spaces)
  const indentedLines = lines.filter((l) => l.startsWith('  ') || l.startsWith('\t'))
  if (indentedLines.length > lines.length * 0.3) score += 15

  // Has return statement
  if (code.includes('return')) score += 15

  // Penalize if still has starter comment "// Your code here"
  if (code.includes('Your code here')) score = Math.max(0, score - 30)

  return Math.min(100, Math.max(0, score))
}

// ─── Communication score ─────────────────────────────────────────────────────

export function calculateCommunicationScore(messages: ChatMessage[]): number {
  const userMessages = messages.filter((m) => m.role === 'user')
  const count = userMessages.length

  if (count === 0) return 10
  if (count === 1) return 30

  // Average message length
  const avgLength =
    userMessages.reduce((sum, m) => sum + m.content.length, 0) / count

  let score = 0

  // Participation bonus
  score += Math.min(40, count * 8)

  // Message quality (length suggests thought)
  if (avgLength > 100) score += 30
  else if (avgLength > 50) score += 20
  else if (avgLength > 20) score += 10

  // Engagement with key terms
  const allText = userMessages.map((m) => m.content.toLowerCase()).join(' ')
  const technicalTerms = [
    'complexity', 'algorithm', 'space', 'time', 'approach', 'optimize',
    'edge case', 'base case', 'recursion', 'iterate', 'hash', 'pointer',
  ]
  const termsUsed = technicalTerms.filter((t) => allText.includes(t)).length
  score += Math.min(30, termsUsed * 5)

  return Math.min(100, Math.max(0, score))
}
