import { NextRequest, NextResponse } from 'next/server'
import { AGENTS_CATALOG } from '@/lib/agents-data'

// GET /api/agents/:slug
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const agent = AGENTS_CATALOG.find(a => a.slug === params.slug)
  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  return NextResponse.json({ agent })
}
