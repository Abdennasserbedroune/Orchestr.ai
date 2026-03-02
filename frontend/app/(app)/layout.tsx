// App shell — sidebar + BriefButton
// Applies to: /command  /stack  /stack/[slug]  /operations  /brief
// Does NOT apply to: /login  /register  (those use (public)/layout.tsx)
import { Sidebar } from '@/components/Sidebar'
import { BriefButton } from '@/components/BriefButton'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <BriefButton />
    </div>
  )
}
