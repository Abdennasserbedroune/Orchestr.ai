# Orchestrai

AI Agent Operating System — run your entire business on a team of AI agents.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 App Router |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Fonts | DM Sans · Plus Jakarta Sans · JetBrains Mono |
| Database | Supabase (PostgreSQL + RLS + Auth) |
| AI | Groq API — Llama 3.3 70B streaming |
| Deploy | Vercel |

## Quick Start

```bash
cd frontend
npm install
cp .env.example .env.local
# fill in .env.local with your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/command`.

## Env Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GROQ_API_KEY=your-groq-key
```

## Apply DB Schema

1. Supabase dashboard → SQL Editor
2. Paste contents of `supabase/schema.sql`
3. Run

## Project Structure

```
orchestrai-main/
├── frontend/
│   ├── app/
│   │   ├── (app)/          ← pages WITH sidebar (command, stack, operations, brief)
│   │   ├── (public)/       ← pages WITHOUT sidebar (login, register)
│   │   ├── api/            ← all API routes
│   │   ├── layout.tsx      ← root: fonts + globals only
│   │   └── globals.css     ← design tokens + component classes
│   ├── components/         ← UI components
│   └── lib/
│       ├── agents-data.ts  ← agent catalog (source of truth — not in DB)
│       ├── mock-data.ts    ← domain meta, mock agents/tasks/activity
│       └── supabase.ts     ← client + TypeScript types
└── supabase/
    └── schema.sql          ← DB tables with RLS
```
