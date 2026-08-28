import { useMemo, useState } from 'react'
import { Search, Download } from 'lucide-react'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import { incidents as seed } from '../data/mockData'

export default function IncidentHistory() {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('all')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(() => {
    return seed
      .filter((i) => (level === 'all' ? true : i.level === level))
      .filter((i) => (status === 'all' ? true : i.status === status))
      .filter((i) => (query ? (i.workerName + i.type + i.id).toLowerCase().includes(query.toLowerCase()) : true))
  }, [query, level, status])

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">Compliance Log</p>
          <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Incident & Alert History</h1>
          <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">{filtered.length} of {seed.length} records</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3.5 py-2 text-[12.5px] font-medium text-[var(--color-text-dim)] hover:text-white">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <Panel bodyClassName="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
            <Search className="h-4 w-4 text-[var(--color-text-dim)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search worker, type, or incident ID…"
              className="w-full bg-transparent text-[13px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none"
            />
          </div>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[12.5px] text-white focus:outline-none">
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="elevated">Elevated</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[12.5px] text-white focus:outline-none">
            <option value="all">All statuses</option>
            <option value="Closed">Closed</option>
            <option value="Under Review">Under Review</option>
            <option value="Escalated">Escalated</option>
          </select>
        </div>
      </Panel>

      <Panel bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-border-soft)] text-[11px] uppercase tracking-wide text-[var(--color-text-dim)]">
                <th className="px-5 py-3 font-medium">Incident</th>
                <th className="px-5 py-3 font-medium">Worker</th>
                <th className="px-5 py-3 font-medium">Zone</th>
                <th className="px-5 py-3 font-medium">Date / Time</th>
                <th className="px-5 py-3 font-medium">Severity</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-soft)]">
              {filtered.map((i) => (
                <tr key={i.id} className="text-[13px] hover:bg-[var(--color-surface-2)]">
                  <td className="px-5 py-3">
                    <p className="font-medium text-white">{i.type}</p>
                    <p className="font-mono text-[11px] text-[var(--color-text-dim)]">{i.id}</p>
                  </td>
                  <td className="px-5 py-3 text-[var(--color-text-dim)]">{i.workerName}</td>
                  <td className="px-5 py-3 text-[var(--color-text-dim)]">{i.zoneName}</td>
                  <td className="px-5 py-3 font-mono text-[12px] text-[var(--color-text-dim)]">{i.date} {i.time}</td>
                  <td className="px-5 py-3"><StatusBadge level={i.level} /></td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                      i.status === 'Closed' ? 'border-[var(--color-safe)]/30 text-[var(--color-safe)]' :
                      i.status === 'Escalated' ? 'border-[var(--color-danger)]/30 text-[var(--color-danger)]' :
                      'border-[var(--color-amber)]/30 text-[var(--color-amber)]'
                    }`}>
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-14 text-center text-[13px] text-[var(--color-text-dim)]">No records match these filters.</div>
        )}
      </Panel>
    </div>
  )
}
