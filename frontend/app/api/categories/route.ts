/**
 * Proxies /api/categories to the Zie619 live API.
 * Cached for 24 hours — categories rarely change.
 */
import { NextResponse } from 'next/server'
import { fetchCategories } from '@/lib/workflows-api'

export const revalidate = 86400 // 24 h ISR cache

export async function GET() {
  try {
    const categories = await fetchCategories()
    return NextResponse.json({ categories })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to fetch categories: ${message}` },
      { status: 502 },
    )
  }
}
