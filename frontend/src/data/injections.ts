export interface InjectionTemplate {
  type: 'requirement' | 'bug'
  content: string
}

export const INJECTIONS: InjectionTemplate[] = [
  {
    type: 'requirement',
    content:
      'New requirement: Your solution must now handle Unicode characters and emojis correctly. Update your string processing logic accordingly.',
  },
  {
    type: 'requirement',
    content:
      'Change of spec: The function must now return results sorted in descending order instead of ascending. Update your output logic.',
  },
  {
    type: 'bug',
    content:
      'Production alert: Your deployed code is causing a memory leak on inputs larger than 10,000 elements. Identify and fix the issue immediately.',
  },
  {
    type: 'requirement',
    content:
      'New requirement: Add support for negative numbers in your input handling. The current implementation only handles non-negative integers.',
  },
  {
    type: 'requirement',
    content:
      'Client request: The API contract has changed — the function must now accept both an array and a single value as input, handling both cases gracefully.',
  },
  {
    type: 'bug',
    content:
      'Critical bug report: Off-by-one error detected in edge cases. When the input array has exactly one element, the function returns incorrect results.',
  },
  {
    type: 'requirement',
    content:
      'Compliance update: All operations must be O(log n) or better. Review your current time complexity and optimize if needed.',
  },
  {
    type: 'bug',
    content:
      'QA flagged: Your solution fails when the input contains duplicate values. Fix the handling of duplicate entries.',
  },
  {
    type: 'requirement',
    content:
      'Performance requirement added: The solution must now run in O(n) space complexity or less. No additional data structures beyond O(1) space allowed.',
  },
  {
    type: 'requirement',
    content:
      'New constraint: The input array could now be empty. Ensure your solution handles empty input without throwing exceptions.',
  },
  {
    type: 'bug',
    content:
      'Stack overflow reported: Your recursive implementation causes a stack overflow on large inputs (n > 10,000). Refactor to an iterative approach.',
  },
  {
    type: 'requirement',
    content:
      'Internationalization: The function must now correctly handle null and undefined values in the input without crashing.',
  },
  {
    type: 'bug',
    content:
      'Security audit finding: Integer overflow possible when values exceed 2^31 - 1. Implement proper overflow checking.',
  },
  {
    type: 'requirement',
    content:
      'API versioning: Return type has changed from an array to an object with a `result` key and a `count` key. Update your return statement.',
  },
  {
    type: 'bug',
    content:
      'Race condition discovered: The function is not thread-safe when called concurrently. Refactor to ensure thread safety.',
  },
  {
    type: 'requirement',
    content:
      'New feature request: Add memoization to your solution to cache repeated subproblem results and improve performance on subsequent calls.',
  },
  {
    type: 'requirement',
    content:
      'Accessibility requirement: All error messages must now be returned as structured objects with a `code` and `message` field instead of throwing exceptions.',
  },
  {
    type: 'bug',
    content:
      'Regression: Recent changes broke the function for inputs containing the value zero. Fix the zero-handling logic.',
  },
]

export function getRandomInjection(): InjectionTemplate {
  return INJECTIONS[Math.floor(Math.random() * INJECTIONS.length)]
}
