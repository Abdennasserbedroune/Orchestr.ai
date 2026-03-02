import { NextRequest, NextResponse } from 'next/server'
import { N8N_WORKFLOWS_INDEX } from '@/lib/n8n-workflows-index'

export async function GET(req: NextRequest) {
  const agentSlug = req.nextUrl.searchParams.get('agent_slug')

  if (!agentSlug) {
    return NextResponse.json(
      { error: 'agent_slug query param is required' },
      { status: 400 }
    )
  }

  const workflows = N8N_WORKFLOWS_INDEX.filter(
    w => w.agent_slug === agentSlug
  )

  return NextResponse.json(workflows)
}
