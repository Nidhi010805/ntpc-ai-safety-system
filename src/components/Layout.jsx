import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] bg-grid">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="min-w-0 w-full flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <Outlet />
        </main>
        <footer className="border-t border-[var(--color-border-soft)] px-6 py-3 text-center font-mono text-[10px] text-[var(--color-text-dim)]">
          HeightSafe‑X · Multimodal AI Digital Twin · Frontend build — for demonstration with simulated telemetry
        </footer>
      </div>
    </div>
  )
}
