import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/reviews?agent_slug=atlas
export async function GET(req: NextRequest) {
  const agent_slug = new URL(req.url).searchParams.get('agent_slug')
  if (!agent_slug)
    return NextResponse.json({ error: 'agent_slug required' }, { status: 400 })

  const { data, error } = await supabase.from('reviews').select('*')
    .eq('agent_slug', agent_slug).order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reviews: data ?? [] })
}

// POST /api/reviews   body: { workspace_id, agent_slug, author_name, company?, rating, body }
export async function POST(req: NextRequest) {
  const { workspace_id, agent_slug, author_name, company, rating, body } = await req.json()
  if (!workspace_id || !agent_slug || !author_name || !rating || !body)
    return NextResponse.json(
      { error: 'workspace_id, agent_slug, author_name, rating, body required' },
      { status: 400 }
    )

  const { data, error } = await supabase.from('reviews')
    .upsert({ workspace_id, agent_slug, author_name, company, rating, body })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ review: data }, { status: 201 })
}
