import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'

export interface ConfirmEndSessionModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  /** Show a short progress summary, e.g. "12 minutes, 8 messages". */
  summary?: React.ReactNode
}

/**
 * Confirmation dialog shown when the user clicks "End Session".
 * Separates the click-to-end action from the actual destructive
 * navigation so a mis-click doesn't trash an in-flight session.
 */
export default function ConfirmEndSessionModal({
  open,
  onClose,
  onConfirm,
  summary,
}: ConfirmEndSessionModalProps): React.ReactElement {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title={
        <span className="flex items-center gap-2">
          <AlertTriangle
            className="w-4 h-4"
            style={{ color: 'var(--accent-orange)' }}
          />
          End this session?
        </span>
      }
      description="You'll be taken to the results screen. This can't be undone."
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Keep going
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            End session
          </Button>
        </>
      }
    >
      {summary && (
        <div
          className="rounded-lg px-3 py-2 text-[11px]"
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-secondary)',
            color: 'var(--text-tertiary)',
          }}
        >
          {summary}
        </div>
      )}
    </Modal>
  )
}
