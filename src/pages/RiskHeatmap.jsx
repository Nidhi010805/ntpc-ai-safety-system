import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import { zones, workers } from '../data/mockData'
import { levelOf } from '../lib/levels'

export default function RiskHeatmap() {
  const countInZone = (zid) => workers.filter((w) => w.zoneId === zid).length

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">Risk Intelligence</p>
        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Risk & Hazard Heatmap</h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">Color-coded exposure across all zones, combining fall risk, gas, and PPE compliance</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <Panel bodyClassName="p-3 sm:p-4" title="Site Heatmap" eyebrow="Updated continuously">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[#0A0F1A]">
            <div className="absolute inset-0 bg-grid opacity-40" />
            {zones.map((z) => {
              const l = levelOf(z.level)
              return (
                <div
                  key={z.id}
                  className="absolute flex flex-col justify-between rounded-lg border p-2"
                  style={{
                    left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%`,
                    background: `radial-gradient(circle at 50% 40%, ${l.dot}55, ${l.dot}12)`,
                    borderColor: `${l.dot}55`,
                  }}
                >
                  <span className="font-mono text-[10px] font-semibold text-white drop-shadow">{z.name}</span>
                  <span className="self-end rounded bg-black/40 px-1.5 py-0.5 font-mono text-[9.5px] text-white">{countInZone(z.id)} workers</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] text-[var(--color-text-dim)]">Low</span>
            <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-[#2ED573] via-[#FFB020] to-[#FF4757]" />
            <span className="text-[11px] text-[var(--color-text-dim)]">Critical</span>
          </div>
        </Panel>

        <Panel title="Zone Breakdown" eyebrow="8 hazard zones" bodyClassName="p-0">
          <ul className="divide-y divide-[var(--color-border-soft)]">
            {zones.map((z) => (
              <li key={z.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-[13px] font-medium text-white">{z.name}</p>
                  <p className="text-[11px] text-[var(--color-text-dim)]">{countInZone(z.id)} workers present</p>
                </div>
                <StatusBadge level={z.level} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="What Drives Zone Risk" eyebrow="Model factors">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Fall exposure', desc: 'Unprotected edges, ladder access, working height relative to fall-arrest coverage.' },
            { label: 'Gas & thermal', desc: 'CO concentration, temperature spikes, visibility from smoke or steam.' },
            { label: 'PPE compliance', desc: 'Missing helmet, harness, gloves, or glasses detected by camera fusion.' },
            { label: 'Worker density', desc: 'Number of personnel in a zone relative to safe occupancy limits.' },
          ].map((f) => (
            <div key={f.label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
              <p className="text-[13px] font-semibold text-white">{f.label}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--color-text-dim)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
