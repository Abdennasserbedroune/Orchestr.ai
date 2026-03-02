// ─────────────────────────────────────────────────────────────
// PLACEHOLDER — Frontend will implement this page
// ─────────────────────────────────────────────────────────────
// REQUIRED imports when you build this out:
//   import { AGENTS_CATALOG } from '@/lib/agents-data'
//   import { DOMAIN_META } from '@/lib/mock-data'
//   import { notFound } from 'next/navigation'
//
// SECTIONS: header · about + skills · compatible tools ·
//           playbook steps · try-it input · reviews
// NOTE: use notFound() if AGENTS_CATALOG.find() returns undefined
// ─────────────────────────────────────────────────────────────
export default function AgentDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold text-foreground">Agent: {params.slug}</h1>
      <p className="text-subtle text-xs">[ Frontend placeholder — replace with full implementation ]</p>
    </div>
  )
}
