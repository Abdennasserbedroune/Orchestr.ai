'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare } from 'lucide-react'

// Floating action button — hidden on /brief page itself
export function BriefButton() {
  const pathname = usePathname()
  if (pathname === '/brief') return null
  return (
    <Link
      href="/brief"
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-brand shadow-glow-sm flex items-center justify-center hover:bg-brand-hover transition-colors z-50"
      title="Open Brief"
    >
      <MessageSquare size={18} className="text-white" strokeWidth={1.8} />
    </Link>
  )
}
export default BriefButton
