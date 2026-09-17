import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Camera,
  AlertTriangle,
  History,
  BarChart3,
  Map,
  FileText,
  Settings,
  Cctv,
  ShieldCheck,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

const NAV = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/camera',
    label: 'Live Cameras',
    icon: Camera,
    badge: '60',
  },
  {
    to: '/alerts',
    label: 'Active Alerts',
    icon: AlertTriangle,
    badge: '5',
    danger: true,
  },
  {
    to: '/incidents',
    label: 'Event History',
    icon: History,
  },
  {
    to: '/predictive',
    label: 'Safety Analytics',
    icon: BarChart3,
  },
  {
    to: '/digital-twin',
    label: 'Plant Map',
    icon: Map,
  },
  {
    to: '/reports',
    label: 'Reports',
    icon: FileText,
  },
  {
    to: '/system-health',
    label: 'Camera Management',
    icon: Cctv,
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
  },
]

export default function Sidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          border-r border-[#e7ebf2]
          bg-white
          transition-all duration-300
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0

          ${collapsed ? 'w-[74px]' : 'w-[220px]'}
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#edf0f5] px-3 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#00288e]">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>

            {!collapsed && (
              <div>
                <p className="text-[13px] font-bold text-[#00288e]">
                  HeightX-Safe
                </p>

                <p className="text-[6.5px] font-bold uppercase tracking-[0.08em] text-slate-400">
                  Thermal Power AI CCTV
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* COLLAPSE BUTTON */}
        <div
          className={`px-2 pt-3 ${
            collapsed ? 'flex justify-center' : ''
          }`}
        >
          <button
            onClick={onToggleCollapse}
            className={`
              flex items-center rounded-lg
              bg-[#f2f5fa]
              text-[#536174]
              transition hover:bg-[#e7edf6]
              hover:text-[#00288e]

              ${
                collapsed
                  ? 'h-9 w-9 justify-center'
                  : 'w-full gap-2 px-3 py-2'
              }
            `}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span className="text-[9px] font-semibold">
                  Collapse Sidebar
                </span>
              </>
            )}
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <div className="space-y-1">
            {NAV.map(
              ({
                to,
                label,
                icon: Icon,
                end,
                badge,
                danger,
              }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  title={collapsed ? label : ''}
                  className={({ isActive }) =>
                    `
                    group flex items-center
                    rounded-lg
                    transition-colors

                    ${
                      collapsed
                        ? 'h-10 justify-center px-2'
                        : 'h-9 gap-2.5 px-3'
                    }

                    ${
                      isActive
                        ? 'bg-[#00288e] text-white'
                        : 'text-[#536174] hover:bg-[#f2f5fa] hover:text-[#10213a]'
                    }
                  `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="relative">
                        <Icon
                          className={`
                            h-[16px] w-[16px]
                            ${
                              isActive
                                ? 'text-white'
                                : 'text-[#68778c]'
                            }
                          `}
                        />

                        {collapsed && badge && (
                          <span
                            className={`
                              absolute -right-2.5 -top-2
                              grid h-4 min-w-4
                              place-items-center
                              rounded-full px-1
                              text-[6px] font-bold text-white

                              ${
                                danger
                                  ? 'bg-[#ba1a1a]'
                                  : 'bg-[#00288e]'
                              }
                            `}
                          >
                            {badge}
                          </span>
                        )}
                      </div>

                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate text-[9.5px] font-semibold">
                            {label}
                          </span>

                          {badge && (
                            <span
                              className={`
                                rounded-full px-2 py-0.5
                                text-[7px] font-bold

                                ${
                                  isActive
                                    ? 'bg-white/20 text-white'
                                    : danger
                                      ? 'bg-[#ba1a1a] text-white'
                                      : 'bg-[#e4eaff] text-[#00288e]'
                                }
                              `}
                            >
                              {badge}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                </NavLink>
              )
            )}
          </div>
        </nav>

        {/* BOTTOM */}
        {!collapsed && (
          <div className="border-t border-[#edf0f5] p-3">
            <div className="rounded-lg bg-[#f2f5fa] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[7px] font-bold uppercase text-slate-400">
                  Shift Status
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-[#00a36c]" />
              </div>

              <p className="mt-1.5 text-[9px] font-semibold text-[#25364d]">
                Shift B (Day) · Desk #1
              </p>

              <p className="mt-1.5 text-[7px] font-semibold text-[#8b0010]">
                Emergency: Ext. 4402
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}