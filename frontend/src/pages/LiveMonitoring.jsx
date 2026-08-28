import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, MapPin, HeartPulse } from 'lucide-react'
import { workers, zones } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'
import RiskGauge from '../components/RiskGauge'
import Panel from '../components/Panel'

const LEVEL_FILTERS = ['all', 'critical', 'high', 'elevated', 'nominal']

export default function LiveMonitoring() {
  const [query, setQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [zoneFilter, setZoneFilter] = useState('all')

  const filtered = useMemo(() => {
    return workers
      .filter((w) => (levelFilter === 'all' ? true : w.riskLevel === levelFilter))
      .filter((w) => (zoneFilter === 'all' ? true : w.zoneId === zoneFilter))
      .filter((w) => (query ? (w.name + w.id).toLowerCase().includes(query.toLowerCase()) : true))
      .sort((a, b) => b.riskScore - a.riskScore)
  }, [query, levelFilter, zoneFilter])

  return (
    <div className="mx-auto min-w-0 w-full max-w-[1400px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">Live Monitoring</p>
        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Worker Roster — Real Time</h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">{filtered.length} of {workers.length} workers shown · updates every few seconds</p>
      </div>

      <Panel bodyClassName="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
            <Search className="h-4 w-4 text-[var(--color-text-dim)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or worker ID…"
              className="w-full bg-transparent text-[13px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none"
            />
          </div>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[12.5px] text-white focus:outline-none"
          >
            <option value="all">All zones</option>
            {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-[var(--color-text-dim)]" />
            {LEVEL_FILTERS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-medium capitalize transition-colors ${
                  levelFilter === lvl
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-white'
                    : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((w) => (
          <Link
            key={w.id}
            to={`/worker/${w.id}`}
            className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4.5 p-4 transition-colors hover:border-[var(--color-accent)]/50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[14.5px] font-semibold text-white">{w.name}</p>
                <p className="font-mono text-[11px] text-[var(--color-text-dim)]">{w.id} · {w.shift}</p>
              </div>
              <RiskGauge score={w.riskScore} level={w.riskLevel} size={52} />
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[12px] text-[var(--color-text-dim)]">
              <MapPin className="h-3.5 w-3.5" /> {w.zoneName} · {w.heightM} m
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[var(--color-text-dim)]">
              <HeartPulse className="h-3.5 w-3.5" /> {w.heartRate} bpm · {w.activity}
            </div>

            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              <StatusBadge level={w.riskLevel} pulse />
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${w.harnessConnected ? 'border-[var(--color-safe)]/30 text-[var(--color-safe)]' : 'border-[var(--color-danger)]/30 text-[var(--color-danger)]'}`}>
                Harness {w.harnessConnected ? 'OK' : 'Disconnected'}
              </span>
              {w.ppeMissing.length > 0 && (
                <span className="rounded-full border border-[var(--color-amber)]/30 px-2.5 py-1 text-[11px] font-medium text-[var(--color-amber)]">
                  {w.ppeMissing.length} PPE missing
                </span>
              )}
            </div>

            <p className="mt-3 font-mono text-[10px] text-[var(--color-text-faint)]">Updated {w.lastUpdate}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] py-16 text-center">
          <p className="text-[14px] text-[var(--color-text-dim)]">No workers match these filters.</p>
        </div>
      )}
    </div>
  )
}
