import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Bot, Send, Zap, MessageSquare } from 'lucide-react'
import { ChatMessage } from '../../types'

interface ChatPanelProps {
  messages: ChatMessage[]
  isTyping: boolean
  onSendMessage: (content: string) => void
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === 'system') {
    return (
      <div className="flex justify-center animate-message py-1.5">
        <span className="text-[10px] font-medium px-3 py-1 rounded-full" style={{ color: 'var(--text-quaternary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}>
          {message.content}
        </span>
      </div>
    )
  }

  if (message.role === 'injection') {
    return (
      <div className="animate-message animate-inject-glow mx-1 rounded-xl p-3.5" style={{
        background: 'rgba(188,76,0,0.05)',
        border: '1px solid rgba(188,76,0,0.12)',
        borderLeft: '3px solid var(--accent-orange)',
      }}>
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="w-3.5 h-3.5 fill-current" style={{ color: 'var(--accent-orange)' }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-orange)' }}>Chaos Injected</span>
          <span className="ml-auto text-[9px] font-mono" style={{ color: 'var(--text-quaternary)' }}>{formatTime(message.timestamp)}</span>
        </div>
        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{message.content}</p>
      </div>
    )
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end animate-message">
        <div style={{ maxWidth: '82%' }}>
          <div className="rounded-2xl rounded-br-sm px-3.5 py-2.5" style={{
            background: 'rgba(9,105,218,0.07)',
            border: '1px solid rgba(9,105,218,0.1)',
          }}>
            <p className="text-[12.5px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>{message.content}</p>
          </div>
          <p className="text-[9px] font-mono mt-1 text-right pr-1" style={{ color: 'var(--text-quaternary)' }}>{formatTime(message.timestamp)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2.5 animate-message">
      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{
        background: 'rgba(130,80,223,0.07)', border: '1px solid rgba(130,80,223,0.1)',
      }}>
        <Bot className="w-3 h-3" style={{ color: 'var(--accent-purple)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5" style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)',
        }}>
          <p className="text-[12.5px] leading-[1.65] whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{message.content}</p>
        </div>
        <p className="text-[9px] font-mono mt-1 pl-1" style={{ color: 'var(--text-quaternary)' }}>{formatTime(message.timestamp)}</p>
      </div>
    </div>
  )
}

export default function ChatPanel({ messages, isTyping, onSendMessage }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return
    onSendMessage(trimmed)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [input, onSendMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-10 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-secondary)', background: 'var(--bg-secondary)' }}>
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(130,80,223,0.08)', border: '1px solid rgba(130,80,223,0.12)' }}>
          <Bot className="w-3 h-3" style={{ color: 'var(--accent-purple)' }} />
        </div>
        <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>AI Interviewer</span>
        <div className="ml-auto flex items-center gap-1.5">
          {isTyping ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(188,76,0,0.06)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-orange)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--accent-orange)' }}>Typing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(26,127,55,0.06)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-green)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-quaternary)' }}>Online</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        {isTyping && (
          <div className="flex items-start gap-2 animate-message">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
              background: 'rgba(130,80,223,0.08)', border: '1px solid rgba(130,80,223,0.12)',
            }}>
              <Bot className="w-3.5 h-3.5" style={{ color: 'var(--accent-purple)' }} />
            </div>
            <div className="rounded-2xl rounded-tl-md px-4 py-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--text-quaternary)', animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--text-quaternary)', animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--text-quaternary)', animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-3" style={{ borderTop: '1px solid var(--border-secondary)' }}>
        <div className="flex items-end gap-2 rounded-xl px-3 py-2 transition-colors duration-200" style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
        }}>
          <textarea ref={textareaRef} value={input}
            onChange={(e) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px' }}
            onKeyDown={handleKeyDown} placeholder="Message the interviewer..." rows={1}
            className="flex-1 bg-transparent text-[13px] resize-none outline-none min-h-[24px] max-h-[100px] leading-6"
            style={{ color: 'var(--text-primary)' }}
          />
          <button onClick={handleSend} disabled={!input.trim()}
            className="flex-shrink-0 p-1.5 rounded-lg text-white transition-all duration-150 disabled:opacity-20"
            style={{ background: 'var(--accent-blue)' }}>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
