/**
 * Conditional className concatenation helper.
 *
 * Accepts strings, conditional expressions, arrays, and falsy values.
 * Useful for composing Tailwind classes without a dependency on clsx.
 *
 * @example
 * cn('base', isActive && 'active', ['foo', 'bar']) // "base active foo bar"
 */
export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []

  const walk = (value: ClassValue) => {
    if (!value) return
    if (typeof value === 'string' || typeof value === 'number') {
      out.push(String(value))
      return
    }
    if (Array.isArray(value)) {
      for (const v of value) walk(v)
    }
  }

  for (const input of inputs) walk(input)
  return out.join(' ')
}
