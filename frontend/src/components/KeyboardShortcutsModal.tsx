import React from 'react'
import { Command } from 'lucide-react'
import Modal from './ui/Modal'

export interface KeyboardShortcutsModalProps {
  open: boolean
  onClose: () => void
}

interface Shortcut {
  label: string
  keys: string[]
}

interface Section {
  title: string
  shortcuts: Shortcut[]
}

const isMac =
  typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)
const MOD = isMac ? '⌘' : 'Ctrl'

const sections: Section[] = [
  {
    title: 'Session',
    shortcuts: [
      { label: 'Inject chaos', keys: [MOD, 'I'] },
      { label: 'End session', keys: [MOD, 'Shift', 'E'] },
      { label: 'Toggle theme', keys: [MOD, 'Shift', 'L'] },
      { label: 'Open shortcuts', keys: [MOD, '/'] },
    ],
  },
  {
    title: 'Editor',
    shortcuts: [
      { label: 'Run code', keys: [MOD, 'Enter'] },
      { label: 'Reset code', keys: [MOD, 'Shift', 'R'] },
      { label: 'Focus chat', keys: [MOD, 'K'] },
    ],
  },
]

/**
 * Modal listing every keyboard shortcut available in the app. Acts as
 * living documentation — add new bindings here whenever a feature
 * registers one via `useKeyboardShortcut`.
 */
export default function KeyboardShortcutsModal({
  open,
  onClose,
}: KeyboardShortcutsModalProps): React.ReactElement {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={
        <span className="flex items-center gap-2">
          <Command
            className="w-4 h-4"
            style={{ color: 'var(--accent-blue)' }}
          />
          Keyboard shortcuts
        </span>
      }
      description="Speed up your workflow with these bindings."
    >
      <div className="space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <div
              className="text-[10px] font-bold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-quaternary)' }}
            >
              {section.title}
            </div>
            <ul className="space-y-1.5">
              {section.shortcuts.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center justify-between gap-4 text-[12px]"
                >
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {s.label}
                  </span>
                  <span className="flex items-center gap-1">
                    {s.keys.map((k, i) => (
                      <kbd
                        key={i}
                        className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md text-[10px] font-semibold font-mono"
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-primary)',
                          color: 'var(--text-secondary)',
                          boxShadow: '0 1px 0 var(--border-secondary)',
                        }}
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Modal>
  )
}
