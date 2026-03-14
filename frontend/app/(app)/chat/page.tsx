'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Paperclip, Mic, CornerDownLeft, X, Loader2, Sparkles } from 'lucide-react'
import { ChatMessage, Message } from '@/components/ChatMessage'

// ── Domain chips ─────────────────────────────────────────────
const DOMAINS = [
  { label: 'Contenu',    color: 'var(--color-domain-content)'  },
  { label: 'Ventes',     color: 'var(--color-domain-sales)'    },
  { label: 'Ops',        color: 'var(--color-domain-ops)'      },
  { label: 'Recherche',  color: 'var(--color-domain-research)' },
  { label: 'Finance',    color: 'var(--color-domain-finance)'  },
  { label: 'RH',         color: 'var(--color-domain-hr)'       },
  { label: 'Tech',       color: 'var(--color-domain-tech)'     },
]

const ORCHESTRAI_AGENT = { name: 'OrchestrAI', role: 'Assistant', color: '#6366f1' }

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [focused, setFocused]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [domain, setDomain]     = useState<string | null>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + 'px'
    }
  }, [input])

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      streaming: true,
      agent: ORCHESTRAI_AGENT,
    }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: text }] }),
      })

      if (!res.ok || !res.body) throw new Error('API error')

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              const token  = parsed.choices?.[0]?.delta?.content ?? ''
              accumulated += token
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m)
              )
            } catch { /* skip malformed */ }
          }
        }
      }

      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, streaming: false } : m)
      )
    } catch {
      setMessages(prev =>
        prev.map(m => m.id === assistantId
          ? { ...m, content: 'Une erreur est survenue. Veuillez réessayer.', streaming: false }
          : m
        )
      )
    } finally {
      setLoading(false)
    }
  }, [input, loading])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const inputActive = focused || input.length > 0
  const isEmpty = messages.length === 0

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(5,5,7,0.8)', backdropFilter: 'blur(16px)' }}>
          <div className="flex items-center gap-3">
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={14} style={{ color: '#818cf8' }} />
            </div>
            <div>
              <p className="text-[14px] font-semibold" style={{ color: 'var(--color-foreground)' }}>Chat IA</p>
              <p className="text-[11px] font-mono" style={{ color: 'var(--color-muted)' }}>OrchestrAI · Groq LLM</p>
            </div>
          </div>

          {/* Domain chips */}
          <div className="hidden sm:flex items-center gap-1.5">
            {DOMAINS.map(d => (
              <button key={d.label} onClick={() => setDomain(domain === d.label ? null : d.label)}
                style={{
                  padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500, cursor: 'pointer',
                  border: `1px solid ${domain === d.label ? d.color : 'rgba(255,255,255,0.07)'}`,
                  background: domain === d.label ? `${d.color}18` : 'transparent',
                  color: domain === d.label ? d.color : 'var(--color-muted)',
                  transition: 'all 0.15s ease',
                }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6" style={{ scrollbarWidth: 'thin' }}>
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 animate-fade-in">
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(99,102,241,0.15)',
              }}>
                <Sparkles size={24} style={{ color: '#818cf8' }} />
              </div>
              <div className="text-center">
                <p className="text-[16px] font-semibold" style={{ color: 'var(--color-foreground)' }}>Décrivez votre besoin</p>
                <p className="text-[13px] mt-1" style={{ color: 'var(--color-muted)' }}>
                  {domain ? `Domaine sélectionné : ${domain}` : 'Choisissez un domaine ou lancez directement.'}
                </p>
              </div>
              {/* Mobile domain chips */}
              <div className="flex sm:hidden flex-wrap items-center justify-center gap-1.5 px-4">
                {DOMAINS.map(d => (
                  <button key={d.label} onClick={() => setDomain(domain === d.label ? null : d.label)}
                    style={{
                      padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                      border: `1px solid ${domain === d.label ? d.color : 'rgba(255,255,255,0.07)'}`,
                      background: domain === d.label ? `${d.color}18` : 'transparent',
                      color: domain === d.label ? d.color : 'var(--color-muted)',
                      transition: 'all 0.15s ease',
                    }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-[24px] transition-all duration-300"
              style={{
                background: 'var(--color-surface)',
                border: `1px solid ${inputActive ? 'rgba(99,102,241,0.35)' : 'var(--color-border)'}`,
                boxShadow: inputActive ? '0 0 0 3px rgba(99,102,241,0.08)' : 'none',
              }}>
              <div className="px-4 pt-3 pb-[52px]">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Décrivez votre besoin ou choisissez un domaine…"
                  rows={1}
                  className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#3f3f46] resize-none overflow-hidden leading-relaxed"
                  style={{ color: 'var(--color-foreground)', border: 'none', boxShadow: 'none', minHeight: '28px', maxHeight: '160px' }}
                  aria-label="Message"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Attach"
                    className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
                    style={{ color: 'var(--color-subtle)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-muted)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-subtle)')}>
                    <Paperclip size={16} strokeWidth={1.5} />
                  </button>
                  <button type="button" aria-label="Voice"
                    className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
                    style={{ color: 'var(--color-subtle)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-muted)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-subtle)')}>
                    <Mic size={16} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {domain && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                      background: 'rgba(99,102,241,0.12)',
                      border: '1px solid rgba(99,102,241,0.25)',
                      color: '#818cf8', display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      {domain}
                      <button onClick={() => setDomain(null)} style={{ color: '#6366f1', cursor: 'pointer', lineHeight: 1 }}>
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  <button type="button" onClick={sendMessage} disabled={!input.trim() || loading}
                    aria-label="Send"
                    className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
                    style={{
                      background: input.trim() && !loading ? '#6366f1' : 'rgba(255,255,255,0.05)',
                      color: input.trim() && !loading ? '#fff' : 'var(--color-subtle)',
                      cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                      boxShadow: input.trim() && !loading ? '0 0 16px rgba(99,102,241,0.4)' : 'none',
                    }}>
                    {loading
                      ? <Loader2 size={15} className="animate-spin" />
                      : <CornerDownLeft size={15} strokeWidth={2} />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-center text-[11px] mt-2" style={{ color: 'var(--color-subtle)' }}>
              Les conversations ne sont pas sauvegardées — elles disparaissent si vous quittez.
              <span className="mx-1.5">·</span>
              OrchestrAI peut commettre des erreurs — vérifiez les informations importantes.
            </p>
          </div>
        </div>
      </div>

      {/* MCP Panel */}
      <div className="hidden xl:flex flex-col w-[220px] flex-shrink-0"
        style={{ borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <p className="section-label">Connexions MCP</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center gap-3">
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={16} style={{ color: '#6366f1' }} />
          </div>
          <p className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
            Connectez vos outils — disponibles prochainement.
          </p>
        </div>
      </div>

    </div>
  )
}
