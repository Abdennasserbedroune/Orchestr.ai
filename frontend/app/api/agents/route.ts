import { NextRequest, NextResponse } from 'next/server'
import { AGENTS_CATALOG } from '@/lib/agents-data'
import type { Domain } from '@/lib/mock-data'

// GET /api/agents
// Query params: ?domain=content  ?search=quill
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const domain = searchParams.get('domain') as Domain | null
  const search = searchParams.get('search')?.toLowerCase() ?? ''

  let results = AGENTS_CATALOG
  if (domain) results = results.filter(a => a.domain === domain)
  if (search) results = results.filter(a =>
    a.name.toLowerCase().includes(search) ||
    a.role.toLowerCase().includes(search) ||
    a.tagline.toLowerCase().includes(search) ||
    a.skills.some(s => s.toLowerCase().includes(search))
  )

  return NextResponse.json({ agents: results, total: results.length })
}
