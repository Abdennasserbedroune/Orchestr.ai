import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/activity?workspace_id=xxx&limit=20
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const workspace_id = searchParams.get('workspace_id')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  if (!workspace_id)
    return NextResponse.json({ error: 'workspace_id required' }, { status: 400 })

  const { data, error } = await supabase.from('activity_log').select('*')
    .eq('workspace_id', workspace_id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ activity: data ?? [] })
}

// POST /api/activity   body: { workspace_id, agent_slug, action, metadata? }
export async function POST(req: NextRequest) {
  const { workspace_id, agent_slug, action, metadata } = await req.json()
  if (!workspace_id || !agent_slug || !action)
    return NextResponse.json(
      { error: 'workspace_id, agent_slug, action required' },
      { status: 400 }
    )

  const { data, error } = await supabase.from('activity_log')
    .insert({ workspace_id, agent_slug, action, metadata: metadata ?? null })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entry: data }, { status: 201 })
}
