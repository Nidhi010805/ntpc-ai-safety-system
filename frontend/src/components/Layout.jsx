import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar
          onMenu={() => setOpen(true)}
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}