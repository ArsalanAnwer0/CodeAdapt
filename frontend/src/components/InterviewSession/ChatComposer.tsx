import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Send } from 'lucide-react'
import type { Persona } from './persona'

export interface ChatComposerProps {
  persona: Persona
  disabled?: boolean
  onSend: (content: string) => void
  /** Fired when the composer gains focus — used to cue "Listening…". */
  onFocus?: () => void
  /** Fired when the composer loses focus. */
  onBlur?: () => void
}

/**
 * Imperative handle exposed to parents so a keyboard shortcut like
 * ⌘K can jump focus into the composer without prop-drilling a ref
 * through ChatPanel.
 */
export interface ChatComposerHandle {
  focus: () => void
}

/**
 * Message input at the bottom of the chat column.
 *
 * Pulled out of the old monolithic ChatPanel so the composer can own
 * its own autosize logic, focus state, and keyboard handling without
 * dragging the thread view along for the ride. Parent owns the
 * interviewer state machine; the composer just announces focus.
 */
const ChatComposer = forwardRef<ChatComposerHandle, ChatComposerProps>(
  function ChatComposer(
    { persona, disabled = false, onSend, onFocus, onBlur },
    ref
  ): React.ReactElement {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(
    ref,
    () => ({
      focus: (): void => {
        textareaRef.current?.focus()
      },
    }),
    []
  )

  const resize = (el: HTMLTextAreaElement): void => {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  const send = useCallback((): void => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [value, disabled, onSend])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div
      className="chat-composer flex-shrink-0 p-3"
      style={{
        borderTop: '1px solid var(--border-secondary)',
        background: 'var(--bg-primary)',
      }}
    >
      <div
        className="flex items-end gap-2 rounded-xl px-3.5 py-2.5"
        style={{
          background: 'var(--bg-secondary)',
          border: `1px solid ${
            focused ? 'var(--accent-blue)' : 'var(--border-primary)'
          }`,
          boxShadow: focused
            ? '0 0 0 3px rgba(9,105,218,0.12)'
            : '0 1px 3px rgba(31,35,40,0.04)',
          transition:
            'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            setValue(e.target.value)
            resize(e.target)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setFocused(true)
            onFocus?.()
          }}
          onBlur={() => {
            setFocused(false)
            onBlur?.()
          }}
          placeholder={`Message ${persona.name}…`}
          rows={1}
          className="flex-1 bg-transparent text-[12.5px] resize-none outline-none min-h-[24px] max-h-[120px] leading-6"
          style={{ color: 'var(--text-primary)' }}
          aria-label={`Message ${persona.name}`}
        />
        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          aria-label="Send message"
          className="flex-shrink-0 p-1.5 rounded-lg text-white transition-all duration-200 disabled:opacity-20 active:scale-[0.93]"
          style={{
            background: canSend
              ? 'var(--accent-blue)'
              : 'var(--border-primary)',
          }}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
      <p
        className="text-[9px] text-center mt-1.5"
        style={{ color: 'var(--text-quaternary)' }}
      >
        Press <kbd className="font-mono">Enter</kbd> to send ·{' '}
        <kbd className="font-mono">Shift+Enter</kbd> for newline
      </p>
    </div>
  )
  }
)

export default ChatComposer
