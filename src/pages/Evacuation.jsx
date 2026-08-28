import { useState } from 'react'
import { DoorOpen, Navigation2 } from 'lucide-react'
import Panel from '../components/Panel'
import { workers, zones } from '../data/mockData'
import { levelOf } from '../lib/levels'

const EXITS = [
  { id: 'E1', name: 'Gate 2 Muster Point', x: 4, y: 90 },
  { id: 'E2', name: 'Turbine Hall Exit', x: 60, y: 92 },
  { id: 'E3', name: 'North Assembly Point', x: 92, y: 8 },
]

export default function Evacuation() {
  const atRisk = workers.filter((w) => w.riskLevel === 'critical' || w.riskLevel === 'high')
  const [selected, setSelected] = useState(atRisk[0]?.id || workers[0].id)
  const worker = workers.find((w) => w.id === selected)
  const exit = EXITS[worker.zoneId.charCodeAt(1) % EXITS.length]

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">Emergency Response</p>
        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Safe Route & Evacuation Guidance</h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">Dynamically routed away from unsafe zones toward the nearest muster point</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <Panel bodyClassName="p-3 sm:p-4" title="Route Preview" eyebrow={`For ${worker.name} · ${worker.id}`}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[#0A0F1A]">
            <div className="absolute inset-0 bg-grid opacity-40" />

            {zones.map((z) => {
              const l = levelOf(z.level)
              const unsafe = z.level === 'critical' || z.level === 'high'
              return (
                <div
                  key={z.id}
                  className="absolute rounded-lg border"
                  style={{
                    left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%`,
                    borderColor: unsafe ? '#FF475766' : '#22305240',
                    background: unsafe ? 'repeating-linear-gradient(45deg, rgba(255,71,87,0.08) 0px, rgba(255,71,87,0.08) 6px, transparent 6px, transparent 12px)' : 'transparent',
                  }}
                >
                  {unsafe && <span className="absolute -top-5 left-0 font-mono text-[9px] text-[var(--color-danger)]">{z.name} — avoid</span>}
                </div>
              )
            })}

            {/* route line */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points={`${worker.x},${worker.y} ${(worker.x + exit.x) / 2},${(worker.y + exit.y) / 2 + 10} ${exit.x},${exit.y}`}
                fill="none"
                stroke="#2ED573"
                strokeWidth="1.2"
                strokeDasharray="3 2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* worker marker */}
            <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${worker.x}%`, top: `${worker.y}%` }}>
              <span className="block h-3.5 w-3.5 animate-pulse rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-accent)]/25" />
            </div>

            {/* exits */}
            {EXITS.map((e) => (
              <div key={e.id} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${e.x}%`, top: `${e.y}%` }}>
                <div className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-safe)] text-black">
                  <DoorOpen className="h-4 w-4" />
                </div>
                <span className="mt-1 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[9px] text-white">{e.name}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Select Worker" eyebrow="Prioritized: high & critical risk first" bodyClassName="p-0">
          <ul className="max-h-[420px] divide-y divide-[var(--color-border-soft)] overflow-y-auto">
            {[...atRisk, ...workers.filter((w) => !atRisk.includes(w))].map((w) => (
              <li key={w.id}>
                <button
                  onClick={() => setSelected(w.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left ${selected === w.id ? 'bg-[var(--color-accent-soft)]' : 'hover:bg-[var(--color-surface-2)]'}`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: levelOf(w.riskLevel).dot }} />
                  <span className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-medium text-white">{w.name}</p>
                    <p className="truncate text-[11px] text-[var(--color-text-dim)]">{w.zoneName}</p>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Guidance Instructions" eyebrow="Auto-generated for this route">
        <div className="flex items-start gap-3">
          <Navigation2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-safe)]" />
          <div className="space-y-1.5 text-[13px] text-[var(--color-text-dim)]">
            <p><span className="text-white">1.</span> Move away from <span className="text-white">{worker.zoneName}</span> toward the marked route, avoiding red hatched zones.</p>
            <p><span className="text-white">2.</span> Proceed to <span className="text-white">{exit.name}</span> — the nearest clear muster point.</p>
            <p><span className="text-white">3.</span> Confirm arrival via wearable check-in beacon so the control room can close this alert.</p>
          </div>
        </div>
      </Panel>
    </div>
  )
}
