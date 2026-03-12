// Claude-style chat bubbles with OrchestrAI logo avatar, code blocks with copy/download
import Image from 'next/image'
import { useState, useCallback } from 'react'
import { AGENTS_CATALOG } from '@/lib/agents-data'
import { DOMAIN_META } from '@/lib/mock-data'
import { Copy, Check, Download } from 'lucide-react'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

function detectAgentMentions(content: string) {
  return AGENTS_CATALOG.filter(agent =>
    content.toLowerCase().includes(agent.name.toLowerCase())
  )
}

function AgentMentionCard({ slug }: { slug: string }) {
  const agent = AGENTS_CATALOG.find(a => a.slug === slug)
  if (!agent) return null
  const meta = DOMAIN_META[agent.domain]
  const Icon = meta.icon
  return (
    <a
      href={`/stack/${agent.slug}`}
      className="flex items-center gap-3 mt-3 rounded-xl px-4 py-3 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: meta.bg,
        border: `1px solid ${meta.color}40`,
        boxShadow: `0 0 16px ${meta.color}15`,
        textDecoration: 'none',
      }}
    >
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
        style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}50` }}
      >
        <Icon size={14} style={{ color: meta.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{agent.name}</p>
        <p className="font-mono text-2xs text-muted tracking-wider uppercase truncate">
          {agent.role}
        </p>
      </div>
      <span className="font-mono text-2xs flex-shrink-0" style={{ color: meta.color }}>
        View &#x2192;
      </span>
    </a>
  )
}

/** Detects ```lang\n...code...\n``` blocks in content */
function parseContent(content: string): Array<{ type: 'text' | 'code'; value: string; lang?: string }> {
  const parts: Array<{ type: 'text' | 'code'; value: string; lang?: string }> = []
  const regex = /```(\w*)\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'code', lang: match[1] || 'text', value: match[2] })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) })
  }
  return parts
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code])

  const handleDownload = useCallback(() => {
    const ext = lang === 'json' ? 'json' : lang === 'javascript' || lang === 'js' ? 'js' :
                lang === 'typescript' || lang === 'ts' ? 'ts' :
                lang === 'python' || lang === 'py' ? 'py' :
                lang === 'bash' || lang === 'sh' ? 'sh' : 'txt'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orchestrai-output.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }, [code, lang])

  return (
    <div
      className="relative my-3 rounded-xl overflow-hidden"
      style={{
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#111111' }}
      >
        <span className="font-mono text-xs text-[#52525b] uppercase tracking-wider">{lang || 'code'}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-[#71717a] hover:text-[#a1a1aa] hover:bg-white/[0.06] transition-all duration-150"
            title="Download file"
          >
            <Download size={12} strokeWidth={2} />
            <span>Download</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all duration-150"
            style={{
              color: copied ? '#4ade80' : '#71717a',
              background: copied ? 'rgba(74,222,128,0.08)' : 'transparent',
            }}
            title="Copy code"
          >
            {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
      {/* Code body */}
      <pre
        className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed font-mono"
        style={{ color: '#e4e4e7', margin: 0, whiteSpace: 'pre' }}
      >
        <code>{code.trimEnd()}</code>
      </pre>
    </div>
  )
}

export function ChatMessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const isStreaming = message.streaming && !isUser
  const mentions = !isUser ? detectAgentMentions(message.content) : []
  const parts = parseContent(message.content)

  return (
    <div className={`flex gap-4 w-full ${isUser ? 'justify-end' : 'justify-start'}`}>

      {/* OrchestrAI logo avatar — left side for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <div
            className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, #1e1e2e, #12121a)',
              boxShadow: isStreaming
                ? '0 0 0 2px rgba(99,102,241,0.6), 0 0 20px rgba(99,102,241,0.4)'
                : '0 0 0 1.5px rgba(99,102,241,0.3), 0 0 12px rgba(99,102,241,0.15)',
            }}
          >
            {/* Pulsing ring when streaming */}
            {isStreaming && (
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: 'rgba(99,102,241,0.25)', animationDuration: '1.4s' }}
              />
            )}
            <Image
              src="/logo.jpg"
              alt="OrchestrAI"
              width={36}
              height={36}
              className="w-full h-full object-cover rounded-full relative z-10"
            />
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`flex flex-col gap-1.5 ${
          isUser ? 'items-end max-w-[72%]' : 'items-start max-w-[78%]'
        }`}
      >
        <span className="font-mono text-[10px] text-[#3f3f46] uppercase tracking-widest px-1">
          {isUser ? 'You' : 'OrchestrAI'}
        </span>

        {isUser ? (
          // User bubble
          <div
            className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(99,102,241,0.09))',
              border: '1px solid rgba(99,102,241,0.28)',
              color: 'var(--color-foreground)',
              borderBottomRightRadius: '6px',
            }}
          >
            <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
          </div>
        ) : (
          // Assistant bubble — Claude-style: no box, just clean text with code blocks
          <div
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-foreground)' }}
          >
            {parts.map((part, idx) =>
              part.type === 'code' ? (
                <CodeBlock key={idx} code={part.value} lang={part.lang || 'text'} />
              ) : (
                <span key={idx} style={{ whiteSpace: 'pre-wrap' }}>{part.value}</span>
              )
            )}
            {isStreaming && (
              <span
                className="inline-block w-[2px] h-[14px] ml-0.5 align-middle animate-pulse"
                style={{ background: 'var(--color-brand)', borderRadius: '1px' }}
                aria-hidden="true"
              />
            )}
          </div>
        )}

        {!isUser && !isStreaming && mentions.length > 0 && (
          <div className="w-full flex flex-col gap-1.5 mt-1">
            {mentions.map(agent => (
              <AgentMentionCard key={agent.slug} slug={agent.slug} />
            ))}
          </div>
        )}
      </div>

      {/* User avatar — right side */}
      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.12))',
              border: '1px solid rgba(99,102,241,0.3)',
            }}
          >
            <span className="font-mono text-xs font-bold text-[#818cf8]">U</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatMessageBubble
