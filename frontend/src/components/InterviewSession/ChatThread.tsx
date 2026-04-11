import React, { memo, useEffect, useRef } from 'react'
import { Zap, HelpCircle, Eye, ArrowRight, MessageCircle } from 'lucide-react'
import { ChatMessage, AIMessageKind } from '../../types'
import type { Persona } from './persona'

/**
 * Visual treatment per AI message kind. Keeping this as a pure lookup
 * means the switch lives in one place and the bubble component stays
 * declarative. Colors reference CSS variables so both themes track.
 */
interface AIKindStyle {
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  accent: string
  tint: string
}

const AI_KIND_STYLES: Record<AIMessageKind, AIKindStyle> = {
  reply: {
    label: 'Reply',
    icon: MessageCircle,
    accent: 'var(--accent-purple)',
    tint: 'rgba(130,80,223,0.05)',
  },
  question: {
    label: 'Question',
    icon: HelpCircle,
    accent: 'var(--accent-blue)',
    tint: 'rgba(9,105,218,0.05)',
  },
  'code-observation': {
    label: 'Observation',
    icon: Eye,
    accent: 'var(--accent-amber)',
    tint: 'rgba(191,135,0,0.06)',
  },
  'follow-up': {
    label: 'Follow-up',
    icon: ArrowRight,
    accent: 'var(--accent-orange)',
    tint: 'rgba(188,76,0,0.06)',
  },
}

export interface ChatThreadProps {
  messages: ChatMessage[]
  persona: Persona
  /** Show the animated typing indicator at the tail of the thread. */
  isTyping: boolean
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/**
 * System chip (e.g. "Session ended"). Centered, muted, non-intrusive.
 */
function SystemBubble({ message }: { message: ChatMessage }): React.ReactElement {
  return (
    <div className="flex justify-center animate-message py-1.5">
      <span
        className="text-[10px] font-medium px-3 py-1 rounded-full"
        style={{
          color: 'var(--text-quaternary)',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-secondary)',
        }}
      >
        {message.content}
      </span>
    </div>
  )
}

/**
 * Inline follow-up card shown in-thread when a chaos injection fires.
 * The sticky banner above the thread is the primary surface; this keeps
 * the history complete so the transcript reads linearly after the fact.
 */
function InjectionBubble({
  message,
}: {
  message: ChatMessage
}): React.ReactElement {
  return (
    <div
      className="animate-message animate-inject-glow mx-1 rounded-xl p-3.5"
      style={{
        background: 'rgba(188,76,0,0.05)',
        border: '1px solid rgba(188,76,0,0.12)',
        borderLeft: '3px solid var(--accent-orange)',
      }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Zap
          className="w-3.5 h-3.5 fill-current"
          style={{ color: 'var(--accent-orange)' }}
        />
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: 'var(--accent-orange)' }}
        >
          Follow-up
        </span>
        <span
          className="ml-auto text-[9px] font-mono"
          style={{ color: 'var(--text-quaternary)' }}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
      <p
        className="text-[12px] leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {message.content}
      </p>
    </div>
  )
}

function UserBubble({ message }: { message: ChatMessage }): React.ReactElement {
  return (
    <div className="flex justify-end animate-message">
      <div style={{ maxWidth: '82%' }}>
        <div
          className="rounded-2xl rounded-br-sm px-3.5 py-2.5"
          style={{
            background: 'rgba(9,105,218,0.07)',
            border: '1px solid rgba(9,105,218,0.1)',
          }}
        >
          <p
            className="text-[12.5px] leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--text-primary)' }}
          >
            {message.content}
          </p>
        </div>
        <p
          className="text-[9px] font-mono mt-1 text-right pr-1"
          style={{ color: 'var(--text-quaternary)' }}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}

function AIBubble({
  message,
  persona,
}: {
  message: ChatMessage
  persona: Persona
}): React.ReactElement {
  const [from, to] = persona.gradient
  const kind: AIMessageKind = message.kind ?? 'reply'
  const style = AI_KIND_STYLES[kind]
  const Icon = style.icon
  // Replies are the common case — don't chrome them up with a label.
  const showKindLabel = kind !== 'reply'
  return (
    <div className="flex items-start gap-2.5 animate-message">
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 text-white"
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
          boxShadow: '0 1px 2px rgba(1,4,9,0.2)',
        }}
        aria-hidden="true"
      >
        <span className="text-[8px] font-bold tracking-wide">
          {persona.initials}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="rounded-2xl rounded-tl-sm px-3.5 py-2.5"
          style={{
            background: showKindLabel ? style.tint : 'var(--bg-secondary)',
            border: '1px solid var(--border-secondary)',
            borderLeft: `2px solid ${style.accent}`,
          }}
        >
          {showKindLabel && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon
                className="w-3 h-3"
                style={{ color: style.accent }}
              />
              <span
                className="text-[9px] font-bold uppercase tracking-wider"
                style={{ color: style.accent }}
              >
                {style.label}
              </span>
            </div>
          )}
          <p
            className="text-[12.5px] leading-[1.65] whitespace-pre-wrap"
            style={{ color: 'var(--text-secondary)' }}
          >
            {message.content}
          </p>
        </div>
        <p
          className="text-[9px] font-mono mt-1 pl-1"
          style={{ color: 'var(--text-quaternary)' }}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}

/**
 * Three-dot typing indicator appended to the thread while the
 * interviewer is composing. Uses the shared `.typing-dots` class so
 * the animation stays in sync with any other indicators in the UI.
 */
function TypingIndicator({
  persona,
}: {
  persona: Persona
}): React.ReactElement {
  const [from, to] = persona.gradient
  return (
    <div className="flex items-start gap-2.5 animate-message">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-white"
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
          boxShadow: '0 1px 2px rgba(1,4,9,0.2)',
        }}
        aria-hidden="true"
      >
        <span className="text-[8px] font-bold tracking-wide">
          {persona.initials}
        </span>
      </div>
      <div
        className="rounded-2xl rounded-tl-sm px-3.5 py-3"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-secondary)',
        }}
        aria-label={`${persona.name} is typing`}
        role="status"
      >
        <span className="typing-dots">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  )
}

/**
 * Placeholder shown before the interviewer has sent their opening
 * message. Without this, the chat column looks broken for the ~800ms
 * between session start and the first AI bubble landing.
 */
function EmptyState({ persona }: { persona: Persona }): React.ReactElement {
  const [from, to] = persona.gradient
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white avatar-pulse"
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
          boxShadow: '0 2px 8px rgba(1,4,9,0.15)',
        }}
        aria-hidden="true"
      >
        <span className="text-[11px] font-bold tracking-wide">
          {persona.initials}
        </span>
      </div>
      <div>
        <p
          className="text-[12px] font-semibold mb-0.5"
          style={{ color: 'var(--text-secondary)' }}
        >
          {persona.name} is joining the room…
        </p>
        <p
          className="text-[11px] leading-relaxed"
          style={{ color: 'var(--text-quaternary)' }}
        >
          Your interviewer will open with a question in a moment.
        </p>
      </div>
    </div>
  )
}

function ChatThreadImpl({
  messages,
  persona,
  isTyping,
}: ChatThreadProps): React.ReactElement {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  if (messages.length === 0 && !isTyping) {
    return <EmptyState persona={persona} />
  }

  return (
    <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 min-h-0">
      {messages.map((msg) => {
        switch (msg.role) {
          case 'system':
            return <SystemBubble key={msg.id} message={msg} />
          case 'injection':
            return <InjectionBubble key={msg.id} message={msg} />
          case 'user':
            return <UserBubble key={msg.id} message={msg} />
          default:
            return <AIBubble key={msg.id} message={msg} persona={persona} />
        }
      })}
      {isTyping && <TypingIndicator persona={persona} />}
      <div ref={endRef} />
    </div>
  )
}

const ChatThread = memo(ChatThreadImpl)
export default ChatThread
