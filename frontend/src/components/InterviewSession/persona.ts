/**
 * Interviewer persona.
 *
 * The candidate sees a named, avatared interviewer so the experience
 * reads as "I'm talking to Alex" rather than "I'm using a chatbot."
 * Keeping this in one module means we can later parameterize it by
 * difficulty, company style, or a backend-provided persona without
 * touching any UI components.
 */

export interface Persona {
  /** First name shown in the header card and composer placeholder. */
  name: string
  /** One-line role shown beneath the name. */
  role: string
  /** Initials rendered inside the avatar circle. */
  initials: string
  /** Gradient stops for the avatar background. */
  gradient: [string, string]
}

const PERSONAS: Persona[] = [
  {
    name: 'Alex',
    role: 'Senior Engineer · CodeAdapt',
    initials: 'AL',
    gradient: ['#0969da', '#8250df'],
  },
  {
    name: 'Sam',
    role: 'Staff Engineer · CodeAdapt',
    initials: 'SM',
    gradient: ['#1a7f37', '#0969da'],
  },
  {
    name: 'Jordan',
    role: 'Principal Engineer · CodeAdapt',
    initials: 'JD',
    gradient: ['#bc4c00', '#cf222e'],
  },
]

/**
 * Deterministic pick so a given session always sees the same
 * interviewer across reloads. Good for future session replay.
 */
export function pickPersona(seed: string): Persona {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return PERSONAS[hash % PERSONAS.length]
}

export const defaultPersona: Persona = PERSONAS[0]
