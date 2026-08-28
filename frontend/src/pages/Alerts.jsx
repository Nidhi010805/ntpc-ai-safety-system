import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, AlertOctagon } from 'lucide-react'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import { alerts as seedAlerts } from '../data/mockData'

const LEVELS = ['all', 'critical', 'high', 'elevated', 'nominal']
const STATUSES = ['all', 'Open', 'Acknowledged', 'Resolved']

export default function Alerts() {
  const [alerts, setAlerts] = useState(seedAlerts)
  const [level, setLevel] = useState('all')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(
    () => alerts
      .filter((a) => (level === 'all' ? true : a.level === level))
      .filter((a) => (status === 'all' ? true : a.status === status)),
    [alerts, level, status]
  )

  function acknowledge(id) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Acknowledged' } : a)))
  }
  function resolve(id) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a)))
  }

  const counts = {
    critical: alerts.filter((a) => a.level === 'critical' && a.status !== 'Resolved').length,
    high: alerts.filter((a) => a.level === 'high' && a.status !== 'Resolved').length,
    open: alerts.filter((a) => a.status === 'Open').length,
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">Alert Management</p>
        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Real-Time Safety Alerts</h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">{counts.open} open · {counts.critical} critical · {counts.high} high</p>
      </div>

      <Panel bodyClassName="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {LEVELS.map((lv) => (
              <button
                key={lv}
                onClick={() => setLevel(lv)}
                className={`rounded-full border px-3 py-1.5 text-[11.5px] font-medium capitalize ${level === lv ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-white' : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-white'}`}
              >
                {lv}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((st) => (
              <button
                key={st}
                onClick={() => setStatus(st)}
                className={`rounded-full border px-3 py-1.5 text-[11.5px] font-medium ${status === st ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-white' : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-white'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <div className="space-y-3">
        {filtered.map((a) => (
          <div key={a.id} className={`rounded-2xl border p-4 ${a.level === 'critical' && a.status === 'Open' ? 'border-[var(--color-danger)]/40 bg-[var(--color-danger-soft)]/30' : 'border-[var(--color-border)] bg-[var(--color-surface)]'}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${a.level === 'critical' ? 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]' : 'bg-[var(--color-surface-2)] text-[var(--color-text-dim)]'}`}>
                  <AlertOctagon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13.5px] font-semibold text-white">{a.type}</p>
                    <StatusBadge level={a.level} pulse={a.status === 'Open'} />
                  </div>
                  <p className="mt-1 text-[12px] text-[var(--color-text-dim)]">
                    <Link to={`/worker/${a.workerId}`} className="text-[var(--color-accent)] hover:underline">{a.workerName}</Link> · {a.zoneName}
                  </p>
                  <p className="mt-1 flex items-center gap-1 font-mono text-[10.5px] text-[var(--color-text-faint)]">
                    <Clock className="h-3 w-3" /> {a.time} · {a.id}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:ml-4">
                {a.status === 'Resolved' ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-safe-soft)] px-3 py-1.5 text-[11.5px] font-medium text-[var(--color-safe)]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
                  </span>
                ) : (
                  <>
                    {a.status === 'Open' && (
                      <button onClick={() => acknowledge(a.id)} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11.5px] font-medium text-[var(--color-text-dim)] hover:text-white">
                        Acknowledge
                      </button>
                    )}
                    <button onClick={() => resolve(a.id)} className="rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-[11.5px] font-semibold text-white hover:bg-[#2569D6]">
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] py-14 text-center text-[13px] text-[var(--color-text-dim)]">
            No alerts match these filters.
          </div>
        )}
      </div>
    </div>
  )
}
