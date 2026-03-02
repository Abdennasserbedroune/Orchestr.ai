// Bug 9 fix: check Supabase session before redirecting
// Unauthenticated users go to /login; authenticated users go to /command
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export default async function Home() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // read-only in Server Component
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  redirect(session ? '/command' : '/login')
}
