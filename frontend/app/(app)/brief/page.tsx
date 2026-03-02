'use client'
// Bug 2 fix: messagesRef prevents stale closure in sendMessage
// Bug 3 fix: correct mobile height offset (56px = h-14 top bar)
// Bug 4/5/6 fix: orange tokens replaced with brand indigo
import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Zap } from 'lucide-react'
import { ChatMessageBubble } from '@/components/ChatMessage'
import type { Message } from '@/components/ChatMessage'

const STARTERS = [
  { label: 'Automate outreach',   prompt: 'I need to automate my sales outreach. Which agent should I use?' },
  { label: 'Generate blog posts', prompt: 'I want to generate SEO-optimised blog posts at scale.' },
  { label: 'Analyse financials',  prompt: 'Help me analyse monthly financial reports automatically.' },
  { label: 'Screen candidates',   prompt: 'I need to screen job applicants and summarise CVs.' },
  { label: 'Monitor competitors', prompt: 'How can I track competitor pricing and news automatically?' },
  { label: 'Summarise research',  prompt: 'I need to summarise long research papers for my team.' },
]

function createId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function BriefPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "I'm Brief \u2014 your AI operations consultant inside Orchestrai.\n\nTell me what you need to automate or optimise, and I'll point you to the right agent from The Stack.",
    },
  ])
  const [input,   setInput  ] = useState('')
  const [loading, setLoading] = useState(false)

  const bottomRef   = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLInputElement>(null)
  const abortRef    = useRef<AbortController | null>(null)
  // Bug 2: mirror messages into a ref so sendMessage never closes over stale state
  const messagesRef = useRef(messages)
  useEffect(() => { messagesRef.current = messages }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { id: createId(), role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const assistantId = createId()
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', streaming: true }])

    // Bug 2: read from ref — always current, never stale
    const history = [...messagesRef.current, userMsg]
      .filter(m => m.id !== 'welcome')
      .map(({ role, content }) => ({ role, content }))

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) throw new Error(`API error ${res.status}`)

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: m.content + chunk } : m)
        )
      }

      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, streaming: false } : m)
      )
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: 'Something went wrong. Please try again.', streaming: false }
            : m
        )
      )
    } finally {
      setLoading(false)
      abortRef.current = null
      inputRef.current?.focus()
    }
  }, [loading]) // messages removed from deps — read via ref instead

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isFirstMessage = messages.length === 1

  return (
    // Bug 3: 56px offset for mobile top bar; full height on md+ (sidebar is sideways)
    <div className="flex flex-col h-[calc(100vh-56px)] md:h-screen max-h-[calc(100vh-56px)] md:max-h-screen">

      <div className="flex-1 overflow-y-auto px-4 md:px-8">
        <div className="max-w-[760px] mx-auto py-8 flex flex-col gap-6">

          {messages.map(msg => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}

          {isFirstMessage && (
            <div className="mt-2">
              <p className="section-label mb-3">Try asking</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTERS.map(s => (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.prompt)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 hover:-translate-y-0.5 group"
                    style={{
                      background: 'var(--color-panel)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    {/* Bug 4: brand indigo, not bitcoin orange */}
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(99,102,241,0.12)',
                        border: '1px solid rgba(99,102,241,0.25)',
                      }}
                    >
                      <Zap size={10} style={{ color: 'var(--color-brand)' }} />
                    </span>
                    <span className="text-sm text-muted group-hover:text-foreground transition-colors">
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div
        className="px-4 md:px-8 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-[760px] mx-auto">
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{
              background: 'var(--color-panel)',
              border: '1px solid rgba(255,255,255,0.1)',
              // Bug 5: brand indigo glow
              boxShadow: loading ? '0 0 20px rgba(99,102,241,0.18)' : 'none',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you need to automate?"
              className="flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-subtle"
              aria-label="Chat input"
              disabled={loading}
            />

            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                // Bug 6: brand indigo gradient, not orange
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #5254CC, #6366F1)'
                  : 'rgba(255,255,255,0.06)',
                boxShadow: input.trim() && !loading
                  ? '0 0 16px rgba(99,102,241,0.45)'
                  : 'none',
              }}
            >
              <Send size={15} className="text-white" />
            </button>
          </div>

          <p className="font-mono text-2xs text-subtle text-center mt-2 tracking-wider">
            Brief uses Groq \u00b7 llama-3.3-70b \u00b7 responses may be imperfect
          </p>
        </div>
      </div>

    </div>
  )
}
