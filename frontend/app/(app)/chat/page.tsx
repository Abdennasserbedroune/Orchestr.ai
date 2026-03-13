'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Paperclip, CornerDownLeft, Mic, Plug, X, Square } from 'lucide-react'
import { ChatMessageBubble } from '@/components/ChatMessage'
import type { Message } from '@/components/ChatMessage'
import Image from 'next/image'

// ── Data ────────────────────────────────────────────────────────────
const CATEGORIES = [
  'Marketing digital',
  'Ventes & prospection',
  'Support client',
  'Recherche & veille',
  'Analyse de données',
  'Création de contenu',
  'Automatisation métier',
]

// Each MCP tool — SVG inline so no broken img load, pure crisp brand marks
const MCP_TOOLS = [
  {
    id: 'github', name: 'GitHub', desc: 'Code & repos',
    color: '#e4e4e7',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  },
  {
    id: 'notion', name: 'Notion', desc: 'Pages & bases',
    color: '#e4e4e7',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>`,
  },
  {
    id: 'n8n', name: 'n8n', desc: 'Workflows',
    color: '#ea4b71',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  },
  {
    id: 'slack', name: 'Slack', desc: 'Notifications',
    color: '#e01e5a',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>`,
  },
  {
    id: 'googledrive', name: 'Drive', desc: 'Fichiers',
    color: '#34a853',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.433 22.396l2.474-4.265H24l-2.475 4.265zm3.052-4.265L4.16 12.246 0 19.331l.032.053zm.932-1.539L14.56 7.25l-2.475-4.265L1.932 12.8zM12.086 2.985l2.474 4.265H24L21.524 2.985zM12 8.517l5.96 10.323H6.04z"/></svg>`,
  },
  {
    id: 'airtable', name: 'Airtable', desc: 'Tables',
    color: '#18bfff',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.955.592L.592 4.64a.592.592 0 0 0 .028 1.118l11.42 3.91a.592.592 0 0 0 .382 0l11.42-3.91a.592.592 0 0 0 .028-1.118L12.37.593a.592.592 0 0 0-.414 0zm10.483 7.26l-3.161 1.08-6.38 2.188a.592.592 0 0 1-.383 0L6.134 8.932 2.974 7.852a.592.592 0 0 0-.782.56v7.028a.592.592 0 0 0 .382.557l9.977 3.612a.592.592 0 0 0 .404 0l9.977-3.612a.592.592 0 0 0 .382-.557V8.412a.592.592 0 0 0-.782-.56z"/></svg>`,
  },
  {
    id: 'linear', name: 'Linear', desc: 'Projets',
    color: '#5e6ad2',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 14.008L9.99 24l14.003-14.003-9.99-9.99L0 14.008zM12.007 0L24 11.993 11.993 24 0 12.007 12.007 0z"/></svg>`,
  },
  {
    id: 'calendly', name: 'Calendly', desc: 'Agenda',
    color: '#006bff',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>`,
  },
]

function createId() { return Math.random().toString(36).slice(2, 10) }

function getGreeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12)  return 'Orchestrez vos agents. Automatisez l\u2019avenir.'
  if (h >= 12 && h < 18) return 'Vos agents travaillent. Vous dirigez.'
  if (h >= 18 && h < 22) return 'L\u2019orchestration ne dort jamais.'
  return 'Pendant que vous dormez, vos agents agissent.'
}

// ── Disclaimer ─────────────────────────────────────────────────────
function DisclaimerBanner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, marginBottom: 32, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <span style={{ fontSize: 13, color: '#3f3f46', flexShrink: 0 }}>\u26a0\ufe0f</span>
      <p style={{ margin: 0, fontSize: 12.5, color: '#3f3f46', lineHeight: 1.5 }}>
        Les conversations ne sont <strong style={{ color: '#52525b', fontWeight: 500 }}>pas sauvegard\u00e9es</strong> \u2014 elles disparaissent si vous quittez la page.
      </p>
    </div>
  )
}

// ── MCP Tools drawer (sheet from bottom) ─────────────────────────────
function ToolsDrawer({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<string | null>(null)

  function tap(id: string) {
    setActive(id)
    setTimeout(() => setActive(null), 1400)
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'fadeIn 0.15s ease' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 760, margin: '0 16px', background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px 20px 0 0', padding: '24px 24px 32px', animation: 'slideUp 0.2s cubic-bezier(.4,0,.2,1)', boxShadow: '0 -24px 80px rgba(0,0,0,0.8)' }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.1)', margin: '0 auto 20px' }} />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#f4f4f5', letterSpacing: '-0.01em' }}>Connexions MCP</p>
            <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#3f3f46' }}>Liez vos outils \u2014 chaque int\u00e9gration arrive bient\u00f4t.</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.05)', color: '#52525b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Tool list — single row of compact chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
          {MCP_TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => tap(tool.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '9px 14px', borderRadius: 12,
                background: active === tool.id ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active === tool.id ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
                cursor: 'pointer', transition: 'all 0.15s ease',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)' }}
              onMouseLeave={e => { if (active !== tool.id) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)' } }}
            >
              {/* Icon dot with brand color */}
              <span
                style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${tool.color}12` }}
                dangerouslySetInnerHTML={{ __html: tool.svg.replace('currentColor', tool.color) }}
              />
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#d4d4d8', lineHeight: 1.2 }}>{tool.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#3f3f46', lineHeight: 1.2 }}>{tool.desc}</p>
              </div>
              {/* Coming-soon shimmer when tapped */}
              {active === tool.id && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.12), transparent)', animation: 'shimmer 0.8s ease' }} />
              )}
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ margin: '20px 0 0', fontSize: 11.5, color: '#27272a', textAlign: 'center' }}>
          Cliquer sur un outil vous permettra de le connecter lorsque cette fonctionnalit\u00e9 sera disponible.
        </p>
      </div>
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────
export default function ChatPage() {
  const [messages, setMessages]         = useState<Message[]>([])
  const [input, setInput]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [focused, setFocused]           = useState(false)
  const [greeting, setGreeting]         = useState('')
  const [greetingDone, setGreetingDone] = useState(false)
  const [showTools, setShowTools]       = useState(false)
  const [collapsed, setCollapsed]       = useState(false)

  const bottomRef   = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLTextAreaElement>(null)
  const abortRef    = useRef<AbortController | null>(null)
  const messagesRef = useRef(messages)
  const streamingId = useRef<string | null>(null)

  // Greeting typewriter
  useEffect(() => {
    if (messages.length > 0) return
    const full = getGreeting()
    setGreeting(''); setGreetingDone(false)
    let i = 0
    const t = setInterval(() => {
      if (i < full.length) { setGreeting(c => c + full.charAt(i)); i++ }
      else { clearInterval(t); setGreetingDone(true) }
    }, 34)
    return () => clearInterval(t)
  }, [messages.length])

  useEffect(() => { messagesRef.current = messages }, [messages])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current; if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 180) + 'px'
  }, [input])

  // Stop streaming
  const stopStream = useCallback(() => {
    abortRef.current?.abort()
    if (streamingId.current) {
      setMessages(prev => prev.map(m =>
        m.id === streamingId.current
          ? { ...m, content: (m.content || '').trimEnd() + '\n\n*R\u00e9ponse interrompue.*', streaming: false }
          : m
      ))
      streamingId.current = null
    }
    setLoading(false)
  }, [])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const userMsg: Message = { id: createId(), role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setCollapsed(true)
    const aId = createId()
    streamingId.current = aId
    setMessages(prev => [...prev, { id: aId, role: 'assistant', content: '', streaming: true }])
    const history = [...messagesRef.current, userMsg].map(({ role, content }) => ({ role, content }))
    abortRef.current = new AbortController()
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }), signal: abortRef.current.signal,
      })
      if (!res.ok || !res.body) throw new Error(`Erreur ${res.status}`)
      const reader = res.body.getReader(), decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read(); if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages(prev => prev.map(m => m.id === aId ? { ...m, content: m.content + chunk } : m))
      }
      setMessages(prev => prev.map(m => m.id === aId ? { ...m, streaming: false } : m))
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setMessages(prev => prev.map(m =>
        m.id === aId ? { ...m, content: 'Une erreur est survenue. Veuillez r\u00e9essayer.', streaming: false } : m
      ))
    } finally {
      setLoading(false); streamingId.current = null; abortRef.current = null
      inputRef.current?.focus()
    }
  }, [loading])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const isFirstMessage = messages.length === 0
  const isActive       = focused || input.length > 0
  const canSend        = input.trim().length > 0 && !loading
  const CHAT_WIDTH     = 720

  return (
    <>
      <style>{`
        @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp  { from { transform:translateY(32px);opacity:0 } to { transform:translateY(0);opacity:1 } }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin     { to { transform:rotate(360deg) } }
        @keyframes shimmer  { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.35} }
        ::-webkit-scrollbar { width:4px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.07); border-radius:4px }
        ::placeholder { color:#2a2a2e !important }
      `}</style>

      <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'#09090b' }}>

        {/* ambient glow */}
        <div aria-hidden style={{ position:'fixed', top:'35%', left:'50%', transform:'translate(-50%,-50%)', width:'60vw', height:'50vh', background:'radial-gradient(circle,rgba(99,102,241,0.045) 0%,transparent 70%)', filter:'blur(90px)', pointerEvents:'none', zIndex:0 }} />

        {showTools && <ToolsDrawer onClose={() => setShowTools(false)} />}

        {/* ── SCROLL AREA ── */}
        <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', zIndex:1 }}>
          <div style={{ maxWidth:CHAT_WIDTH, margin:'0 auto', padding:'48px 24px 24px', display:'flex', flexDirection:'column' }}>

            {isFirstMessage ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:32 }}>
                <div style={{ width:80, height:80, borderRadius:'50%', overflow:'hidden', marginBottom:24, boxShadow:'0 0 0 2px rgba(99,102,241,0.4), 0 0 40px rgba(99,102,241,0.15)' }}>
                  <Image src="/logo.jpg" alt="OrchestrAI" width={80} height={80} style={{ width:'100%', height:'100%', objectFit:'cover' }} priority />
                </div>
                <h1 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:700, color:'#f4f4f5', textAlign:'center', letterSpacing:'-0.03em', lineHeight:1.2, marginBottom:12, minHeight:'1.25em' }}>
                  {greeting}{!greetingDone && <span style={{ display:'inline-block', width:2.5, height:'0.78em', background:'#6366f1', borderRadius:1, marginLeft:3, verticalAlign:'middle', animation:'blink 0.85s step-end infinite' }} />}
                </h1>
                <p style={{ fontSize:15, color:'#52525b', textAlign:'center', marginBottom:28, lineHeight:1.6, maxWidth:440 }}>
                  D\u00e9crivez votre besoin ou choisissez un domaine pour commencer.
                </p>
                <DisclaimerBanner />
                {/* chips */}
                <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:7, maxWidth:520 }}>
                  {CATEGORIES.map((cat, i) => (
                    <button key={i}
                      onClick={() => { setInput(cat); setCollapsed(false); setTimeout(() => inputRef.current?.focus(), 30) }}
                      style={{ padding:'8px 16px', borderRadius:100, border:'1px solid rgba(255,255,255,0.08)', background:'transparent', color:'#71717a', fontSize:13.5, fontWeight:450, cursor:'pointer', transition:'all 0.15s ease', outline:'none' }}
                      onMouseEnter={e => { const b=e.currentTarget as HTMLButtonElement; b.style.background='rgba(255,255,255,0.05)'; b.style.color='#e4e4e7'; b.style.borderColor='rgba(255,255,255,0.14)' }}
                      onMouseLeave={e => { const b=e.currentTarget as HTMLButtonElement; b.style.background='transparent'; b.style.color='#71717a'; b.style.borderColor='rgba(255,255,255,0.08)' }}
                    >{cat}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:28, paddingBottom:8 }}>
                {messages.map(msg => <ChatMessageBubble key={msg.id} message={msg} />)}
              </div>
            )}

            <div ref={bottomRef} style={{ height:4 }} />
          </div>
        </div>

        {/* ── PINNED INPUT AREA ── */}
        <div style={{ flexShrink:0, zIndex:10, padding:'6px 24px 18px', background:'linear-gradient(to top, #09090b 72%, transparent)' }}>
          <div style={{ maxWidth:CHAT_WIDTH, margin:'0 auto' }}>

            {/* Collapsed pill */}
            {collapsed && !isActive && !loading && (
              <button
                onClick={() => { setCollapsed(false); setTimeout(() => inputRef.current?.focus(), 30) }}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px 20px', borderRadius:14, background:'#0f0f0f', border:'1px solid rgba(255,255,255,0.08)', color:'#3f3f46', fontSize:14.5, cursor:'pointer', transition:'all 0.18s ease' }}
                onMouseEnter={e => { const b=e.currentTarget as HTMLButtonElement; b.style.borderColor='rgba(255,255,255,0.15)'; b.style.color='#71717a' }}
                onMouseLeave={e => { const b=e.currentTarget as HTMLButtonElement; b.style.borderColor='rgba(255,255,255,0.08)'; b.style.color='#3f3f46' }}
              >
                <CornerDownLeft size={14} strokeWidth={2} />
                <span>Continuer la conversation\u2026</span>
              </button>
            )}

            {/* Full input box */}
            {(!collapsed || isActive || loading) && (
              <div style={{
                background:'#0f0f0f',
                border:`1px solid ${isActive ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius:16,
                boxShadow: isActive
                  ? '0 0 0 3px rgba(99,102,241,0.08), 0 8px 40px rgba(0,0,0,0.6)'
                  : '0 2px 20px rgba(0,0,0,0.5)',
                transition:'border-color 0.18s ease, box-shadow 0.18s ease',
                overflow:'hidden',
              }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => { setFocused(true); setCollapsed(false) }}
                  onBlur={() => setFocused(false)}
                  placeholder="D\u00e9crivez ce dont vous avez besoin\u2026"
                  rows={1}
                  disabled={loading}
                  autoComplete="off"
                  aria-label="Message"
                  style={{
                    width:'100%', background:'transparent', border:'none', outline:'none',
                    resize:'none', fontSize:16, lineHeight:1.65, color:'#f4f4f5',
                    caretColor:'#6366f1', padding:'14px 16px 6px',
                    minHeight:28, maxHeight:180, overflowY:'auto',
                    fontFamily:'inherit', display:'block', boxSizing:'border-box',
                  }}
                />

                {/* Toolbar */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 8px 10px 10px' }}>
                  {/* Left tools */}
                  <div style={{ display:'flex', alignItems:'center', gap:1 }}>
                    <TBtn title="Joindre un fichier">
                      <Paperclip size={16} strokeWidth={1.8} />
                    </TBtn>
                    <TBtn title="Connexions MCP" onClick={() => setShowTools(true)} accent>
                      <Plug size={16} strokeWidth={1.8} />
                    </TBtn>
                    <TBtn title="Microphone">
                      <Mic size={16} strokeWidth={1.8} />
                    </TBtn>
                  </div>

                  {/* Send / Stop — same button position, toggles on loading */}
                  <button
                    onClick={loading ? stopStream : () => sendMessage(input)}
                    disabled={!loading && !canSend}
                    title={loading ? 'Arr\u00eater la g\u00e9n\u00e9ration' : 'Envoyer'}
                    style={{
                      width:34, height:34, borderRadius:10, border:'none',
                      background: loading
                        ? 'rgba(239,68,68,0.12)'
                        : canSend ? '#6366f1' : '#161616',
                      color: loading ? '#ef4444' : canSend ? '#fff' : '#2a2a2e',
                      cursor: (loading || canSend) ? 'pointer' : 'not-allowed',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'all 0.18s ease', flexShrink:0,
                      boxShadow: canSend && !loading ? '0 0 14px rgba(99,102,241,0.45)' : 'none',
                    }}
                    onMouseEnter={e => { if (canSend || loading) (e.currentTarget as HTMLButtonElement).style.opacity='0.85' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity='1' }}
                  >
                    {loading
                      ? <Square size={13} fill="#ef4444" strokeWidth={0} />
                      : <CornerDownLeft size={15} strokeWidth={2.5} />}
                  </button>
                </div>
              </div>
            )}

            <p style={{ textAlign:'center', fontSize:11, color:'#1c1c1e', marginTop:6, letterSpacing:'0.01em' }}>
              OrchestrAI peut commettre des erreurs. V\u00e9rifiez les informations importantes.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Toolbar icon button ───────────────────────────────────────────────────
function TBtn({ children, title, onClick, accent }: { children: React.ReactNode; title: string; onClick?: () => void; accent?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{ width:32, height:32, borderRadius:8, border:'none', background:'transparent', color: accent ? '#6366f1' : '#2e2e33', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'color 0.13s, background 0.13s' }}
      onMouseEnter={e => { const b=e.currentTarget as HTMLButtonElement; b.style.color = accent ? '#818cf8' : '#52525b'; b.style.background='rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { const b=e.currentTarget as HTMLButtonElement; b.style.color = accent ? '#6366f1' : '#2e2e33'; b.style.background='transparent' }}
    >
      {children}
    </button>
  )
}
