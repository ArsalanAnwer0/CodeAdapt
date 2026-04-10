/// <reference types="vite/client" />

/**
 * Ambient declarations for Vite's `import.meta.env`. Adding a new
 * variable here makes it type-checked at every call site.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_API_TIMEOUT_MS?: string
  readonly VITE_ENABLE_MOCK_API?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error' | 'silent'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
