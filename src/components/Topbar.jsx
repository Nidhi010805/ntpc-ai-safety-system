import { useEffect, useState } from 'react'
import { Menu, Search, Bell } from 'lucide-react'
import { alerts, siteSummary, workers } from '../data/mockData'
import { levelOf } from '../lib/levels'
import { Link, useNavigate } from 'react-router-dom'

function useClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return now
}

export default function Topbar({ onMenu }) {
  const now = useClock()
  const summary = siteSummary()
  const tickerItems = [...alerts.slice(0, 8), ...alerts.slice(0, 8)]

  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [searchError, setSearchError] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()

    const query = search.trim().toLowerCase()

    if (!query) return

    const worker = workers.find(
      (w) =>
        w.id.toLowerCase() === query ||
        w.id.toLowerCase().includes(query) ||
        w.name.toLowerCase().includes(query) ||
        w.zoneName.toLowerCase().includes(query)
    )

    if (worker) {
      setSearchError('')
      setSearch('')
      navigate(`/worker/${worker.id}`)
      return
    }

    setSearchError('No worker or zone found')
  }

  return (
    <div className="sticky top-0 z-30 min-w-0 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur">

      {/* Signature: scrolling live risk pulse ticker */}
      <div className="flex min-w-0 items-center gap-3 border-b border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] px-4 py-1.5 sm:px-6">
        <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
          ● Live Pulse
        </span>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker gap-8 whitespace-nowrap">
            {tickerItems.map((a, i) => {
              const l = levelOf(a.level)

              return (
                <span
                  key={i}
                  className={`font-mono text-[11px] ${l.text}`}
                >
                  {a.workerId} · {a.type} · {a.zoneName}{' '}
                  <span className="text-[var(--color-text-faint)]">
                    — {a.time}
                  </span>
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Topbar */}
      <div className="flex min-w-0 items-center gap-3 px-4 py-3 sm:px-6">
        <button
          onClick={onMenu}
          className="rounded-md p-1.5 text-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="relative hidden flex-1 sm:block sm:max-w-xs">
          <form
            onSubmit={handleSearch}
            className="flex min-w-0 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
          >
            <Search className="h-4 w-4 shrink-0 text-[var(--color-text-dim)]" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setSearchError('')
              }}
              placeholder="Search worker ID, name, zone…"
              className="min-w-0 w-full bg-transparent text-[13px] text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:outline-none"
            />

            {search && (
              <button
                type="submit"
                className="shrink-0 rounded-md px-2 py-1 text-[11px] font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
              >
                Go
              </button>
            )}
          </form>

          {searchError && (
            <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-bg-raised)] px-3 py-2 text-[11px] text-[var(--color-danger)] shadow-lg">
              {searchError}
            </div>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
          <div className="hidden text-right sm:block">
            <p className="font-mono text-[13px] font-semibold tabular-nums text-white">
              {now.toLocaleTimeString('en-IN', {
                hour12: false,
              })}
            </p>

            <p className="text-[10px] text-[var(--color-text-dim)]">
              {now.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}{' '}
              IST
            </p>
          </div>

          <Link
            to="/alerts"
            className="relative rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-text-dim)] hover:text-white"
          >
            <Bell className="h-[18px] w-[18px]" />

            {summary.criticalAlerts > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[var(--color-danger)] text-[9px] font-bold text-white">
                {summary.criticalAlerts}
              </span>
            )}
          </Link>

          <Link
            to="/monitoring"
            className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-1.5 pr-3"
          >
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[var(--color-accent-soft)] font-mono text-[11px] font-bold text-[var(--color-accent)]">
              SO
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-[12px] font-medium leading-none text-white">
                Control Room
              </p>

              <p className="mt-0.5 text-[10px] leading-none text-[var(--color-text-dim)]">
                Safety Officer
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}