/**
 * Tiny leveled logger.
 *
 * Wraps console so we can (a) namespace every log, (b) silence below
 * a configured level in production, and (c) swap in a remote sink later
 * without touching call sites.
 */
import { env, type LogLevel } from './env'

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 99,
}

const minLevel = LEVEL_ORDER[env.logLevel]

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= minLevel
}

function stamp(namespace: string): string {
  return `%c[${namespace}]`
}

const NS_STYLE = 'color:#0969da;font-weight:600'

export interface Logger {
  debug: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  child: (subNamespace: string) => Logger
}

export function createLogger(namespace: string): Logger {
  const prefix = stamp(namespace)
  return {
    debug: (...args) => {
      if (shouldLog('debug')) console.debug(prefix, NS_STYLE, ...args)
    },
    info: (...args) => {
      if (shouldLog('info')) console.info(prefix, NS_STYLE, ...args)
    },
    warn: (...args) => {
      if (shouldLog('warn')) console.warn(prefix, NS_STYLE, ...args)
    },
    error: (...args) => {
      if (shouldLog('error')) console.error(prefix, NS_STYLE, ...args)
    },
    child: (sub) => createLogger(`${namespace}:${sub}`),
  }
}

/** Default application logger. Prefer `createLogger('feature')` in modules. */
export const log = createLogger('codeadapt')
