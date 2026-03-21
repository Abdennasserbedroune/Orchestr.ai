import { NextRequest, NextResponse } from 'next/server'

// GET /api/github?path=...
// Proxies requests to api.github.com/repos/Zie619/n8n-workflows/contents/...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') ?? 'workflows'
  
  // Basic path sanitization to prevent directory traversal outside Zie619/n8n-workflows
  // Only allows alphanumeric, hyphens, underscores, slashes, and .json
  if (!/^[a-zA-Z0-9\-_/. ]+$/.test(path)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'OrchestrAI-App',
  }

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`
  }

  try {
    const targetUrl = `https://api.github.com/repos/Zie619/n8n-workflows/contents/${path}`
    const response = await fetch(targetUrl, { headers })

    if (response.status === 403) {
      return NextResponse.json(
        { error: 'GitHub API rate limit reached. Please try again later.' },
        { status: 403 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch from GitHub' },
      { status: 500 }
    )
  }
}
