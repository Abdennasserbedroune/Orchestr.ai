'use client'
import Image from 'next/image'
import { useState, useCallback, useEffect, useRef } from 'react'
import { AGENTS_CATALOG } from '@/lib/agents-data'
import { DOMAIN_META } from '@/lib/mock-data'
import { Copy, Check, Download } from 'lucide-react'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

// ── Typing animation ──────────────────────────────────────────────────
function useTypingAnimation(content: string, streaming?: boolean) {
  const [displayed, setDisplayed] = useState('')
  const [animating, setAnimating] = useState(false)
  const prevContent = useRef('')
  useEffect(() => {
    if (streaming) { setDisplayed(content); setAnimating(true); prevContent.current = content; return }
    if (content !== prevContent.current) {
      prevContent.current = content
      const words = content.split(' ')
      let i = 0; setDisplayed(''); setAnimating(true)
      const iv = setInterval(() => {
        i++; setDisplayed(words.slice(0, i).join(' '))
        if (i >= words.length) { clearInterval(iv); setAnimating(false) }
      }, 18)
      return () => clearInterval(iv)
    }
  }, [content, streaming])
  return { displayed, animating }
}

// ── Agent mention card ──────────────────────────────────────────────
function detectAgentMentions(content: string) {
  return AGENTS_CATALOG.filter(a => content.toLowerCase().includes(a.name.toLowerCase()))
}

function AgentMentionCard({ slug }: { slug: string }) {
  const agent = AGENTS_CATALOG.find(a => a.slug === slug)
  if (!agent) return null
  const meta = DOMAIN_META[agent.domain]
  const Icon = meta.icon
  return (
    <a href={`/stack/${agent.slug}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, marginTop: 10,
        borderRadius: 14, padding: '10px 14px',
        background: meta.bg, border: `1px solid ${meta.color}40`,
        boxShadow: `0 0 16px ${meta.color}15`,
        textDecoration: 'none', transition: 'transform 0.18s ease',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'}
      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'}
    >
      <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${meta.color}20`, border: `1px solid ${meta.color}50`, flexShrink: 0 }}>
        <Icon size={14} style={{ color: meta.color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.name}</p>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#52525b', margin: 0 }}>{agent.role}</p>
      </div>
      <span style={{ fontFamily: 'monospace', fontSize: 10, color: meta.color, flexShrink: 0 }}>Voir →</span>
    </a>
  )
}

// ── Markdown-like content parser ──────────────────────────────────────
function parseContent(content: string): Array<{ type: 'text' | 'code'; value: string; lang?: string }> {
  const parts: Array<{ type: 'text' | 'code'; value: string; lang?: string }> = []
  const regex = /```(\w*)\n?([\s\S]*?)```/g
  let lastIndex = 0; let match: RegExpExecArray | null
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'text', value: content.slice(lastIndex, match.index) })
    parts.push({ type: 'code', lang: match[1] || 'text', value: match[2] })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < content.length) parts.push({ type: 'text', value: content.slice(lastIndex) })
  return parts
}

// ── Code block ─────────────────────────────────────────────────────────
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }, [code])
  const handleDownload = useCallback(() => {
    const ext = lang === 'json' ? 'json' : ['javascript','js'].includes(lang) ? 'js' :
      ['typescript','ts'].includes(lang) ? 'ts' : ['python','py'].includes(lang) ? 'py' :
      ['bash','sh'].includes(lang) ? 'sh' : 'txt'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `orchestrai-output.${ext}`; a.click()
    URL.revokeObjectURL(url)
  }, [code, lang])
  return (
    <div style={{ position: 'relative', margin: '12px 0', borderRadius: 14, overflow: 'hidden', background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#111' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#52525b' }}>{lang || 'code'}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={handleDownload}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, border: 'none', background: 'transparent', color: '#71717a', fontSize: 12, fontFamily: 'monospace', cursor: 'pointer', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#a1a1aa'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#71717a'}
          >
            <Download size={12} strokeWidth={2} /><span>Télécharger</span>
          </button>
          <button onClick={handleCopy}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, border: 'none', background: copied ? 'rgba(74,222,128,0.08)' : 'transparent', color: copied ? '#4ade80' : '#71717a', fontSize: 12, fontFamily: 'monospace', cursor: 'pointer', transition: 'all 0.15s' }}
          >
            {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2} />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>
      </div>
      <pre style={{ overflowX: 'auto', padding: '14px 16px', fontSize: 13, lineHeight: 1.65, fontFamily: 'monospace', color: '#e4e4e7', margin: 0, whiteSpace: 'pre' }}>
        <code>{code.trimEnd()}</code>
      </pre>
    </div>
  )
}

// ── Logo avatar with orbit animation while streaming ───────────────────
function OrchestrAIAvatar({ animating }: { animating: boolean }) {
  return (
    <div style={{ flexShrink: 0, position: 'relative', width: 40, height: 40, marginTop: 2 }}>
      {animating && (
        <span style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '2px dashed rgba(99,102,241,0.55)', animation: 'spin 1.8s linear infinite' }} />
      )}
      <div style={{
        width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
        boxShadow: animating
          ? '0 0 0 2px rgba(99,102,241,0.7), 0 0 24px rgba(99,102,241,0.45)'
          : '0 0 0 1.5px rgba(99,102,241,0.25)',
        transition: 'box-shadow 0.4s ease',
      }}>
        <Image src="/logo.jpg" alt="OrchestrAI" width={40} height={40}
          style={{ width: '100%', height: '100%', objectFit: 'cover',
            filter: animating ? 'brightness(1.15)' : 'brightness(1)',
            transition: 'filter 0.4s ease',
          }} />
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────
export function ChatMessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const { displayed, animating } = useTypingAnimation(message.content, message.streaming)
  const mentions = !isUser ? detectAgentMentions(message.content) : []
  const parts = parseContent(isUser ? message.content : displayed)

  // ── USER message — right-aligned, clearly readable
  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <div style={{
          maxWidth: '72%',
          background: '#1a1a2e',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '18px 18px 4px 18px',
          padding: '10px 16px',
        }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: '#e4e4e7', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {message.content}
          </p>
        </div>
      </div>
    )
  }

  // ── ASSISTANT message — logo + text on SAME baseline grid
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, width: '100%' }}>
      <OrchestrAIAvatar animating={animating} />

      {/* Content column — left-aligned to avatar */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>

        {/* Name label */}
        <p style={{ margin: '0 0 6px 0', fontSize: 12, fontWeight: 600, color: '#6366f1', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          OrchestrAI
        </p>

        {/* Message text */}
        <div style={{ fontSize: 15, lineHeight: 1.75, color: '#d4d4d8' }}>
          {parts.map((part, idx) =>
            part.type === 'code' ? (
              <CodeBlock key={idx} code={part.value} lang={part.lang || 'text'} />
            ) : (
              <span key={idx} style={{ whiteSpace: 'pre-wrap' }}>{part.value}</span>
            )
          )}
          {animating && (
            <span style={{ display: 'inline-block', marginLeft: 2, verticalAlign: 'middle', width: 2, height: 15, background: '#6366f1', borderRadius: 1, animation: 'blink 0.9s step-end infinite' }} aria-hidden />
          )}
        </div>

        {/* Agent mention cards */}
        {!animating && mentions.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mentions.map(agent => <AgentMentionCard key={agent.slug} slug={agent.slug} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessageBubble
