/**
 * Typed environment configuration.
 *
 * Vite exposes env vars prefixed with VITE_ through `import.meta.env`.
 * We parse and validate them once at module load so the rest of the app
 * can import a typed `env` object without touching `import.meta.env` again.
 */

interface ImportMetaEnvShape {
  readonly VITE_API_URL?: string
  readonly VITE_API_TIMEOUT_MS?: string
  readonly VITE_ENABLE_MOCK_API?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_LOG_LEVEL?: string
  readonly MODE?: string
  readonly DEV?: boolean
  readonly PROD?: boolean
}

const raw = (import.meta as unknown as { env: ImportMetaEnvShape }).env

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback
  return value === 'true' || value === '1'
}

function num(value: string | undefined, fallback: number): number {
  if (value == null) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function str(value: string | undefined, fallback: string): string {
  return value && value.length > 0 ? value : fallback
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'

function logLevel(value: string | undefined, fallback: LogLevel): LogLevel {
  const allowed: LogLevel[] = ['debug', 'info', 'warn', 'error', 'silent']
  return (allowed as string[]).includes(value ?? '') ? (value as LogLevel) : fallback
}

export const env = {
  /** Backend API base URL. Empty string means "use mock API only". */
  apiUrl: str(raw.VITE_API_URL, ''),
  /** HTTP request timeout in milliseconds. */
  apiTimeoutMs: num(raw.VITE_API_TIMEOUT_MS, 15_000),
  /** When true, all API calls are routed through the in-memory mock. */
  enableMockApi: bool(raw.VITE_ENABLE_MOCK_API, true),
  /** When true, lightweight analytics events are emitted. */
  enableAnalytics: bool(raw.VITE_ENABLE_ANALYTICS, false),
  /** Minimum log level that will be emitted by the logger. */
  logLevel: logLevel(raw.VITE_LOG_LEVEL, raw.DEV ? 'debug' : 'warn'),
  /** True in `vite dev`, false in production build. */
  isDev: !!raw.DEV,
  /** True in a production build. */
  isProd: !!raw.PROD,
  /** Raw mode string (development/production/etc). */
  mode: str(raw.MODE, 'development'),
} as const

export type Env = typeof env
