'use client'
import { useState, useEffect } from 'react'
import { MOCK_AGENTS } from '@/lib/mock-data'
import { AgentCard } from '@/components/AgentCard'
import { OperationsBoard } from '@/components/OperationsBoard'
import { LiveActivity } from '@/components/LiveActivity'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function getToday(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function CommandPage() {
  const [greeting, setGreeting] = useState('Welcome back')
  const [today,    setToday   ] = useState('')

  useEffect(() => {
    setGreeting(getGreeting())
    setToday(getToday())
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Ambient glow */}
      <div className="glow-blob w-[700px] h-[400px] -top-20 left-1/2 -translate-x-1/2 opacity-40" />

      <div className="relative p-8 max-w-[1200px] mx-auto flex flex-col gap-10">

        {/* ── Header ─────────────────────────────── */}
        <header className="animate-fade-in">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            {greeting},{' '}
            <span className="text-gradient">Abdennasser</span>
          </h1>
          <p className="font-mono text-2xs text-subtle tracking-widest uppercase mt-1.5">
            {today}
            {today && <span className="mx-2 opacity-40">·</span>}
            Mission Control
          </p>
        </header>

        {/* ── Agent Team Grid ─────────────────────── */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <p className="section-label">Your Team</p>
            <span className="chip font-mono">{MOCK_AGENTS.length} agents</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MOCK_AGENTS.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </section>

        {/* ── Operations Board ────────────────────── */}
        <section>
          <p className="section-label mb-4">Operations</p>
          <OperationsBoard />
        </section>

        {/* ── Live Activity ───────────────────────── */}
        <section className="pb-10">
          <div className="flex items-center justify-between mb-4">
            <p className="section-label">Live Activity</p>
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--color-status-active)' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--color-status-active)' }} />
              </span>
              <span className="font-mono text-2xs text-muted tracking-widest uppercase">Live</span>
            </div>
          </div>
          <LiveActivity />
        </section>

      </div>
    </div>
  )
}
