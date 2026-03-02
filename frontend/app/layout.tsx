import type { Metadata } from 'next'
import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Orchestrai — AI Agent Operating System',
  description: 'Run your entire business on a team of AI agents.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
