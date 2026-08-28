import { FileDown, FileText, Table2, Clock3 } from 'lucide-react'
import Panel from '../components/Panel'
import { reportRuns, siteSummary, incidents, alerts } from '../data/mockData'

export default function Reports() {
  const s = siteSummary()
  const resolved = alerts.filter(a => a.status === 'Resolved').length
  const closureRate = Math.round((resolved / Math.max(alerts.length, 1)) * 100)

  return (
    <div className="mx-auto min-w-0 w-full max-w-[1250px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">Compliance & Analytics</p>
        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Reports</h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">Daily/weekly safety summaries and export-ready simulated report records.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><p className="text-[11px] text-[var(--color-text-dim)]">PPE violations</p><p className="mt-1 text-2xl font-bold text-white">{s.ppeViolations}</p></div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><p className="text-[11px] text-[var(--color-text-dim)]">Active alerts</p><p className="mt-1 text-2xl font-bold text-white">{s.activeAlerts}</p></div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><p className="text-[11px] text-[var(--color-text-dim)]">Incidents logged</p><p className="mt-1 text-2xl font-bold text-white">{incidents.length}</p></div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><p className="text-[11px] text-[var(--color-text-dim)]">Alert closure rate</p><p className="mt-1 text-2xl font-bold text-white">{closureRate}%</p></div>
      </div>

      <Panel title="Generated Reports" eyebrow="Local intranet">
        <div className="divide-y divide-[var(--color-border-soft)]">
          {reportRuns.map((r) => (
            <div key={r.id} className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-accent)]"><FileText className="h-4 w-4" /></span>
                <div><p className="text-[13px] font-semibold text-white">{r.title}</p><p className="mt-0.5 text-[11px] text-[var(--color-text-dim)]">{r.period} · {r.id} · {r.generated}</p></div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11.5px] text-[var(--color-text-dim)] hover:text-white"><Table2 className="h-3.5 w-3.5" /> CSV</button>
                <button disabled={r.status !== 'Ready'} className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-[11.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><FileDown className="h-3.5 w-3.5" /> PDF</button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Scheduled Generation" eyebrow="Demo configuration">
        <div className="flex items-center gap-3 text-[12.5px] text-[var(--color-text-dim)]"><Clock3 className="h-4 w-4 text-[var(--color-accent)]" /> Daily 23:55 · Shift-end summary · Weekly Monday 06:00</div>
      </Panel>
    </div>
  )
}
