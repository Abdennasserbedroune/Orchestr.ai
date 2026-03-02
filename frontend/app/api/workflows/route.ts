/**
 * Next.js API route — proxies workflow requests to the Zie619 live API.
 * Accepts all filter params and forwards them via fetchWorkflows().
 * This keeps credentials and API base URL server-side only.
 */
import { NextRequest, NextResponse } from 'next/server'
import { fetchWorkflows } from '@/lib/workflows-api'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams

  const page       = Number(sp.get('page')       ?? '1')
  const per_page   = Number(sp.get('per_page')    ?? '12')
  const trigger    = sp.get('trigger')    ?? 'all'
  const complexity = sp.get('complexity') ?? 'all'
  const search     = sp.get('search')     ?? ''
  const agent_slug = sp.get('agent_slug') ?? undefined
  const category   = sp.get('category')   ?? undefined

  if (!agent_slug && !category) {
    return NextResponse.json(
      { error: 'agent_slug or category query param is required' },
      { status: 400 },
    )
  }

  try {
    const result = await fetchWorkflows({
      page,
      per_page,
      trigger,
      complexity,
      search,
      agent_slug,
      category,
    })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Upstream API error: ${message}` },
      { status: 502 },
    )
  }
}
