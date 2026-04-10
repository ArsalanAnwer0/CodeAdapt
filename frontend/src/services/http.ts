/**
 * Thin typed HTTP client built on `fetch`.
 *
 * Responsibilities:
 *   - Apply the configured base URL and timeout.
 *   - Serialize JSON bodies and parse JSON responses.
 *   - Surface non-2xx responses as typed `HttpError`s.
 *   - Abort requests that exceed the timeout.
 *
 * This client is intentionally minimal. Richer concerns (auth headers,
 * retry, request IDs) should be layered on via interceptors in services.
 */
import { env } from '../lib/env'
import { createLogger } from '../lib/logger'

const log = createLogger('http')

export class HttpError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, message: string, body: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }

  get isNetworkError(): boolean {
    return this.status === 0
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }

  get isServerError(): boolean {
    return this.status >= 500
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
  /** Overrides the default timeout for this request. */
  timeoutMs?: number
  /** Optional AbortSignal to merge with the timeout. */
  signal?: AbortSignal
}

function joinUrl(base: string, path: string): string {
  if (!base) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const b = base.endsWith('/') ? base.slice(0, -1) : base
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, timeoutMs, signal } = opts

  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    timeoutMs ?? env.apiTimeoutMs
  )

  // Compose the caller's signal with our timeout signal if provided.
  if (signal) {
    if (signal.aborted) controller.abort()
    else signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  const url = joinUrl(env.apiUrl, path)
  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  }
  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  log.debug(`${method} ${url}`)

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeout)
    const message =
      err instanceof Error ? err.message : 'Network request failed'
    log.error(`${method} ${url} — network error`, message)
    throw new HttpError(0, message, null)
  }

  clearTimeout(timeout)

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json().catch(() => null) : await response.text()

  if (!response.ok) {
    log.warn(`${method} ${url} — ${response.status}`)
    const message =
      (isJson && payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message?: unknown }).message)
        : null) ?? `Request failed with status ${response.status}`
    throw new HttpError(response.status, message, payload)
  }

  return payload as T
}

export const http = {
  get: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method'>) =>
    request<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method'>) =>
    request<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method'>) =>
    request<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'DELETE' }),
}
