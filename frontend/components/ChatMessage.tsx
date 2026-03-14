'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Copy, Check, Download, Loader2 } from 'lucide-react'

// ── Types ────────────────────────────────────────────────────
interface Agent {
  name: string
  role: string
  avatar?: string
  color?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
  agent?: Agent
  timestamp?: Date
}

// ── Inline renderer ──────────────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g
  const parts: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const raw = m[0]
    if (raw.startsWith('`')) {
      parts.push(
        <code key={key++} style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.82em',
          background: 'rgba(99,102,241,0.12)', color: '#a5b4fc',
          padding: '1px 6px', borderRadius: 5,
          border: '1px solid rgba(99,102,241,0.2)',
        }}>{raw.slice(1, -1)}</code>
      )
    } else {
      parts.push(<strong key={key++} style={{ color: '#e4e4e7', fontWeight: 600 }}>{raw.slice(2, -2)}</strong>)
    }
    last = re.lastIndex
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

// ── Block types ───────────────────────────────────────────────
type Block =
  | { kind: 'text';     lines: string[] }
  | { kind: 'code';     lang: string; code: string }
  | { kind: 'heading';  level: number; text: string }
  | { kind: 'bullet';   items: string[] }
  | { kind: 'numbered'; items: string[] }

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = []
  const rawLines = content.split('\n')
  let i = 0

  while (i < rawLines.length) {
    const line = rawLines[i]

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < rawLines.length && !rawLines[i].startsWith('```')) { codeLines.push(rawLines[i]); i++ }
      i++
      blocks.push({ kind: 'code', lang, code: codeLines.join('\n') })
      continue
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)/)
    if (headingMatch) {
      blocks.push({ kind: 'heading', level: headingMatch[1].length, text: headingMatch[2] })
      i++
      continue
    }

    if (line.match(/^\d+\.\s+/)) {
      const items: string[] = []
      while (i < rawLines.length && rawLines[i].match(/^\d+\.\s+/)) {
        items.push(rawLines[i].replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push({ kind: 'numbered', items })
      continue
    }

    if (line.match(/^[-*\u2022]\s+/)) {
      const items: string[] = []
      while (i < rawLines.length && rawLines[i].match(/^[-*\u2022]\s+/)) {
        items.push(rawLines[i].replace(/^[-*\u2022]\s+/, ''))
        i++
      }
      blocks.push({ kind: 'bullet', items })
      continue
    }

    const lines: string[] = []
    while (
      i < rawLines.length &&
      !rawLines[i].startsWith('```') &&
      !rawLines[i].match(/^#{1,3}\s+/) &&
      !rawLines[i].match(/^[-*\u2022]\s+/) &&
      !rawLines[i].match(/^\d+\.\s+/)
    ) { lines.push(rawLines[i]); i++ }
    if (lines.some(l => l.trim())) blocks.push({ kind: 'text', lines })
  }

  return blocks
}

// ── Code block ────────────────────────────────────────────────
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const copy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code])

  const download = useCallback(() => {
    setDownloading(true)
    const exts: Record<string, string> = {
      js: 'js', ts: 'ts', tsx: 'tsx', jsx: 'jsx', py: 'py', python: 'py',
      sh: 'sh', bash: 'sh', css: 'css', html: 'html', json: 'json', md: 'md',
    }
    const ext = exts[lang.toLowerCase()] ?? 'txt'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `code.${ext}`; a.click()
    URL.revokeObjectURL(url)
    setTimeout(() => setDownloading(false), 1000)
  }, [code, lang])

  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      border: '1px solid rgba(99,102,241,0.18)',
      background: '#0d0d10', margin: '8px 0',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 12px',
        background: 'rgba(99,102,241,0.07)',
        borderBottom: '1px solid rgba(99,102,241,0.12)',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6366f1', fontWeight: 600 }}>
          {lang || 'code'}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={copy} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 6,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
            color: copied ? '#22c55e' : '#6e6e7a', fontSize: 11, cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}>
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? 'Copié' : 'Copier'}
          </button>
          <button onClick={download} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 6,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
            color: '#6e6e7a', fontSize: 11, cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}>
            {downloading ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />}
          </button>
        </div>
      </div>
      <pre style={{
        margin: 0, padding: '14px 16px',
        overflowX: 'auto', fontSize: 13,
        fontFamily: 'var(--font-mono)',
        color: '#e4e4e7', lineHeight: 1.65,
      }}>
        <code>{code.trimEnd()}</code>
      </pre>
    </div>
  )
}

// ── Block renderer ────────────────────────────────────────────
function RenderBlock({ block }: { block: Block }) {
  if (block.kind === 'code') {
    return <CodeBlock code={block.code} lang={block.lang} />
  }
  if (block.kind === 'heading') {
    const sizes: Record<number, string> = { 1: '18px', 2: '16px', 3: '14px' }
    return (
      <p style={{
        fontSize: sizes[block.level] ?? '14px',
        fontWeight: 700, color: '#ededf0',
        margin: '10px 0 4px',
        fontFamily: 'var(--font-display)',
      }}>
        {renderInline(block.text)}
      </p>
    )
  }
  if (block.kind === 'bullet') {
    return (
      <ul style={{ margin: '4px 0', paddingLeft: 18, listStyleType: 'disc' }}>
        {block.items.map((item, i) => (
          <li key={i} style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.7, padding: '1px 0' }}>
            {renderInline(item)}
          </li>
        ))}
      </ul>
    )
  }
  if (block.kind === 'numbered') {
    return (
      <ol style={{ margin: '4px 0', paddingLeft: 18 }}>
        {block.items.map((item, i) => (
          <li key={i} style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.7, padding: '1px 0' }}>
            {renderInline(item)}
          </li>
        ))}
      </ol>
    )
  }
  // text block
  const text = block.lines.join(' ').trim()
  if (!text) return null
  return (
    <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.75, margin: '3px 0' }}>
      {renderInline(text)}
    </p>
  )
}

// ── Main export ───────────────────────────────────────────────
export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 0' }}>
        <div style={{
          maxWidth: '72%',
          background: 'rgba(99,102,241,0.13)',
          border: '1px solid rgba(99,102,241,0.22)',
          borderRadius: '18px 18px 4px 18px',
          padding: '10px 16px',
          fontSize: 14, color: '#ededf0', lineHeight: 1.65,
        }}>
          {message.content}
        </div>
      </div>
    )
  }

  const agent = message.agent ?? { name: 'OrchestrAI', role: 'Assistant', color: '#6366f1' }
  const blocks = parseBlocks(message.content)

  return (
    <div style={{ display: 'flex', gap: 12, padding: '6px 0', alignItems: 'flex-start' }}>
      {/* Avatar */}
      <div style={{ flexShrink: 0 }}>
        {agent.avatar ? (
          <Image src={agent.avatar} alt={agent.name} width={32} height={32}
            style={{ borderRadius: 10, objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: `linear-gradient(135deg, ${agent.color ?? '#6366f1'}33, ${agent.color ?? '#6366f1'}1a)`,
            border: `1px solid ${agent.color ?? '#6366f1'}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: agent.color ?? '#818cf8',
          }}>
            {agent.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7' }}>{agent.name}</span>
          <span style={{
            fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 500,
            color: agent.color ?? '#6366f1',
            background: `${agent.color ?? '#6366f1'}18`,
            border: `1px solid ${agent.color ?? '#6366f1'}28`,
            padding: '1px 6px', borderRadius: 99,
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>{agent.role}</span>
        </div>

        {/* Blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {blocks.map((block, i) => <RenderBlock key={i} block={block} />)}
          {message.streaming && (
            <span className="stream-cursor" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
