import { useEffect, useState } from 'react'
import {
  Menu,
  Search,
  Bell,
  UserRound,
  CircleCheck,
} from 'lucide-react'

import {
  alerts,
  siteSummary,
  workers,
} from '../data/mockData'

import { levelOf } from '../lib/levels'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

function useClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return now
}

export default function Topbar({ onMenu }) {
  const now = useClock()
  const summary = siteSummary()

  const tickerItems = [
    ...alerts.slice(0, 8),
    ...alerts.slice(0, 8),
  ]

  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [searchError, setSearchError] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()

    const query = search
      .trim()
      .toLowerCase()

    if (!query) return

    const worker = workers.find(
      (w) =>
        w.id.toLowerCase() === query ||
        w.id
          .toLowerCase()
          .includes(query) ||
        w.name
          .toLowerCase()
          .includes(query) ||
        w.zoneName
          .toLowerCase()
          .includes(query)
    )

    if (worker) {
      setSearchError('')
      setSearch('')
      navigate(`/worker/${worker.id}`)
      return
    }

    setSearchError(
      'No worker or zone found'
    )
  }

  return (
    <header className="sticky top-0 z-30 min-w-0 border-b border-[#e8edf5] bg-white/95 shadow-[0_1px_8px_rgba(15,35,70,0.04)] backdrop-blur">

      {/* =========================================
          LIVE PULSE TICKER
      ========================================== */}
      <div className="flex min-w-0 items-center gap-3 border-b border-[#edf1f7] bg-[#f8faff] px-4 py-1.5 sm:px-6">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00a36c] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00a36c]" />
          </span>

          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#00288e]">
            Live Pulse
          </span>
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker gap-8 whitespace-nowrap">
            {tickerItems.map((alert, index) => {
              const level =
                levelOf(alert.level)

              return (
                <span
                  key={index}
                  className={`text-[9.5px] font-medium ${level.text}`}
                >
                  {alert.workerId} ·{' '}
                  {alert.type} ·{' '}
                  {alert.zoneName}

                  <span className="ml-1 text-slate-400">
                    — {alert.time}
                  </span>
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* =========================================
          MAIN TOPBAR
      ========================================== */}
      <div className="flex min-h-[64px] min-w-0 items-center gap-3 px-4 sm:px-6">

        {/* Mobile Menu */}
        <button
          onClick={onMenu}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-[#f1f5fb] hover:text-[#00288e] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* =========================================
            SEARCH
        ========================================== */}
        <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-[440px]">
          <form
            onSubmit={handleSearch}
            className="flex h-10 min-w-0 items-center gap-2 rounded-lg bg-[#f1f5fb] px-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00288e]/20"
          >
            <Search className="h-[17px] w-[17px] shrink-0 text-slate-400" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                )
                setSearchError('')
              }}
              placeholder="Search worker ID, name, zone..."
              className="min-w-0 w-full bg-transparent text-[12px] text-[#10213a] outline-none placeholder:text-slate-400"
            />

            {search && (
              <button
                type="submit"
                className="shrink-0 rounded-md bg-[#e2eaff] px-2.5 py-1 text-[9px] font-bold text-[#00288e] transition hover:bg-[#d6e1ff]"
              >
                Go
              </button>
            )}
          </form>

          {searchError && (
            <div className="absolute left-0 top-full z-50 mt-1.5 w-full rounded-lg border border-[#fecaca] bg-white px-3 py-2 text-[10px] font-medium text-[#ba1a1a] shadow-lg">
              {searchError}
            </div>
          )}
        </div>

        {/* =========================================
            RIGHT CONTROLS
        ========================================== */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">

          {/* DATE / TIME */}
          <div className="hidden items-center gap-2 xl:flex">
            <div className="text-right">
              <p className="font-mono text-[11px] font-semibold tabular-nums text-[#334155]">
                {now.toLocaleDateString(
                  'en-IN',
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }
                )}{' '}
                |{' '}
                {now.toLocaleTimeString(
                  'en-IN',
                  {
                    hour12: false,
                  }
                )}
              </p>

              <p className="mt-0.5 text-[8.5px] uppercase tracking-[0.08em] text-slate-400">
                India Standard Time
              </p>
            </div>
          </div>

          {/* SYSTEM ONLINE */}
          <div className="hidden items-center gap-2 rounded-full bg-[#eef8f3] px-3 py-1.5 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00a36c] opacity-60" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00a36c]" />
            </span>

            <span className="text-[9px] font-bold text-[#00714e]">
              System Online
            </span>
          </div>

          {/* PLANT STATUS */}
          <div className="hidden rounded-full bg-[#eef2f8] px-3 py-1.5 text-[9px] font-semibold text-[#334155] lg:block">
            Normal Plant Operation
          </div>

          {/* NOTIFICATION */}
          <Link
            to="/alerts"
            className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-[#f1f5fb] hover:text-[#00288e]"
          >
            <Bell className="h-[18px] w-[18px]" />

            {summary.criticalAlerts >
              0 && (
              <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#ba1a1a] px-1 text-[8px] font-bold leading-none text-white">
                {
                  summary.criticalAlerts
                }
              </span>
            )}
          </Link>

          {/* =========================================
              OPERATOR
          ========================================== */}
          <Link
            to="/monitoring"
            className="flex items-center gap-2.5 rounded-lg py-1 pl-2 transition hover:bg-[#f7f9fd]"
          >
            <div className="hidden text-right md:block">
              <p className="text-[10.5px] font-semibold leading-tight text-[#10213a]">
                Operator Ramesh V.
              </p>

              <p className="mt-0.5 text-[8.5px] leading-tight text-slate-400">
                Chief Safety Desk
              </p>
            </div>

            <div className="relative">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#00288e]">
                <UserRound className="h-4 w-4 text-white" />
              </div>

              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#00a36c]" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}