// ─────────────────────────────────────────────────────────────
// PLACEHOLDER — Frontend will implement this page
// ─────────────────────────────────────────────────────────────
// REQUIRED imports when you build this out:
//   import { AGENTS_CATALOG } from '@/lib/agents-data'
//   import { DOMAIN_META } from '@/lib/mock-data'
//
// API: POST /api/brief — streaming response (ReadableStream)
// FEATURES: starter prompts · message bubbles · streaming cursor ·
//           inline agent cards auto-appear when Brief mentions an agent
// ─────────────────────────────────────────────────────────────
export default function BriefPage() {
  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold text-foreground">Brief</h1>
      <p className="text-muted text-sm">Tell us what you need. We find the right agent.</p>
      <p className="text-subtle text-xs">[ Frontend placeholder — replace with full implementation ]</p>
    </div>
  )
}
