// Public layout — no Sidebar, no BriefButton
// Applies to: /login  /register
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
