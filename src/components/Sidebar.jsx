import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, ShieldCheck, Boxes, Flame, Route as RouteIcon,
  Camera, Bell, History, Radar, X, Activity, Zap, CloudFog, FileText, ServerCog,
} from 'lucide-react'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/monitoring', label: 'Live Monitoring', icon: Users },
  { to: '/fire-smoke', label: 'Fire / Smoke', icon: Flame },
  { to: '/ppe', label: 'PPE Compliance', icon: ShieldCheck },
  { to: '/man-down', label: 'Man Down', icon: Activity },
  { to: '/switchyard', label: 'Switchyard Safety', icon: Zap },
  { to: '/ash-leakage', label: 'Ash Leakage', icon: CloudFog },
  { to: '/digital-twin', label: 'Digital Twin', icon: Boxes },
  { to: '/heatmap', label: 'Risk Heatmap', icon: Flame },
  { to: '/predictive', label: 'Predictive Zones', icon: Radar },
  { to: '/evacuation', label: 'Evacuation Routes', icon: RouteIcon },
  { to: '/camera', label: 'Camera / Thermal', icon: Camera },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/incidents', label: 'Incident History', icon: History },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/system-health', label: 'System Health', icon: ServerCog },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-raised)] transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border-soft)] px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[#1149A8]">
              <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-[var(--font-display)] text-[15px] font-bold leading-none text-white">HeightSafe-X</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-dim)]">NTPC Safety Console</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)] lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${isActive ? 'bg-[var(--color-accent-soft)] text-white' : 'text-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-[var(--color-accent)]' : ''}`} strokeWidth={2} />
                  <span>{label}</span>
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[var(--color-border-soft)] p-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-dim)]">Plant</p>
            <p className="mt-1 text-[13px] font-semibold text-white">Vindhyachal STPS · Unit 7</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[var(--color-safe)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--color-safe)]" /> Sensor mesh online</p>
          </div>
        </div>
      </aside>
    </>
  )
}
