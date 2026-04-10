import React from 'react'
import { Monitor, Zap } from 'lucide-react'
import { APP_NAME, MIN_INTERVIEW_WIDTH } from '../lib/constants'

/**
 * Fallback screen shown when the viewport is too narrow for the
 * three-pane interview layout. Kept intentionally minimal so it
 * loads instantly on mobile connections.
 */
export default function MobileWarning(): React.ReactElement {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 text-center"
      style={{
        background:
          'linear-gradient(160deg, #0969da 0%, #0550ae 40%, #6639ba 80%, #8250df 100%)',
      }}
    >
      <div className="max-w-sm w-full">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-5 shadow-lg">
          <Zap className="w-7 h-7 text-white" />
        </div>
        <h1
          className="text-2xl font-extrabold text-white tracking-tight mb-2"
          style={{ letterSpacing: '-0.02em' }}
        >
          {APP_NAME} needs more room
        </h1>
        <p className="text-[13px] text-white/75 leading-relaxed mb-6">
          The interview layout is designed for screens at least{' '}
          {MIN_INTERVIEW_WIDTH}px wide. Open {APP_NAME} on a laptop or desktop
          to get the full editor, problem description, and chat side-by-side.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-[12px] text-white/85 font-medium">
          <Monitor className="w-3.5 h-3.5" />
          Best on a desktop browser
        </div>
      </div>
    </div>
  )
}
