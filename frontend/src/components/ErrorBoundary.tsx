import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { createLogger } from '../lib/logger'

const log = createLogger('error-boundary')

interface ErrorBoundaryProps {
  children: React.ReactNode
  /** Optional custom fallback renderer. */
  fallback?: (error: Error, reset: () => void) => React.ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * React error boundary. Catches render-phase errors anywhere in its
 * subtree and shows a recoverable fallback UI. All caught errors are
 * forwarded to our logger so we can wire them to a remote sink later.
 */
export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    log.error('Unhandled render error', error, info.componentStack)
  }

  private handleReset = (): void => {
    this.setState({ error: null })
  }

  render(): React.ReactNode {
    const { error } = this.state
    if (!error) return this.props.children

    if (this.props.fallback) {
      return this.props.fallback(error, this.handleReset)
    }

    return (
      <div
        role="alert"
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div
          className="max-w-md w-full rounded-xl p-6 text-center"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-secondary)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
            style={{
              background: 'rgba(207,34,46,0.08)',
              border: '1px solid rgba(207,34,46,0.15)',
            }}
          >
            <AlertTriangle
              className="w-6 h-6"
              style={{ color: 'var(--accent-severe)' }}
            />
          </div>
          <h2
            className="text-lg font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Something went wrong
          </h2>
          <p
            className="text-sm mb-5 leading-relaxed"
            style={{ color: 'var(--text-tertiary)' }}
          >
            An unexpected error crashed this view. You can try again, or
            reload the page if the problem persists.
          </p>
          <pre
            className="text-[11px] font-mono text-left p-3 rounded-lg mb-4 overflow-x-auto"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-tertiary)',
              maxHeight: '120px',
            }}
          >
            {error.message}
          </pre>
          <div className="flex gap-2 justify-center">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 active:scale-[0.97]"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent-blue), #0550ae)',
                boxShadow: '0 1px 3px rgba(9,105,218,0.25)',
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.97]"
              style={{
                border: '1px solid var(--border-primary)',
                color: 'var(--text-tertiary)',
                background: 'var(--bg-primary)',
              }}
            >
              Reload page
            </button>
          </div>
        </div>
      </div>
    )
  }
}
