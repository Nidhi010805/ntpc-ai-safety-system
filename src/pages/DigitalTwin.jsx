import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw, Layers } from 'lucide-react'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import { workers, zones } from '../data/mockData'
import { levelOf } from '../lib/levels'

export default function DigitalTwin() {
  const [selected, setSelected] = useState(null)
  const [showZones, setShowZones] = useState(true)
  const worker = workers.find((w) => w.id === selected)

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">Digital Twin</p>
          <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Unit 7 — Site Twin</h1>
          <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">Top-down plant model · worker positions refresh live from mmWave + vision fusion</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowZones((s) => !s)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium ${showZones ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-[var(--color-border)] text-[var(--color-text-dim)]'}`}
          >
            <Layers className="h-3.5 w-3.5" /> Hazard zones
          </button>
          <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-[12px] font-medium text-[var(--color-text-dim)] hover:text-white">
            <RotateCcw className="h-3.5 w-3.5" /> Reset view
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <Panel bodyClassName="p-3 sm:p-4" eyebrow="Plant footprint" title="Interactive Twin">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[radial-gradient(circle_at_50%_0%,#152036,#0A0F1A)]">
            <div className="absolute inset-0 bg-grid opacity-50" />

            {/* structures */}
            <div className="absolute left-[38%] top-[35%] h-[30%] w-[24%] rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)]/70" />
            <p className="absolute left-[40%] top-[48%] font-mono text-[9px] uppercase tracking-wide text-[var(--color-text-faint)]">Turbine Hall</p>
            <div className="absolute left-[10%] top-[15%] h-[35%] w-[18%] rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)]/70" />
            <p className="absolute left-[11%] top-[30%] font-mono text-[9px] uppercase tracking-wide text-[var(--color-text-faint)]">Boiler</p>
            <div className="absolute left-[68%] top-[10%] h-[45%] w-[10%] rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)]/70" />
            <p className="absolute left-[67%] top-[32%] rotate-90 font-mono text-[9px] uppercase tracking-wide text-[var(--color-text-faint)]">Chimney</p>

            {showZones && zones.map((z) => {
              const l = levelOf(z.level)
              return (
                <div
                  key={z.id}
                  className={`absolute rounded-lg border ${l.border}`}
                  style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%`, background: `${l.dot}14` }}
                >
                  <span className={`absolute -top-5 left-0 whitespace-nowrap font-mono text-[9px] ${l.text}`}>{z.name}</span>
                </div>
              )
            })}

            {workers.map((w) => {
              const l = levelOf(w.riskLevel)
              const active = selected === w.id
              return (
                <button
                  key={w.id}
                  onClick={() => setSelected(w.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
                  style={{ left: `${w.x}%`, top: `${w.y}%` }}
                  title={w.name}
                >
                  <span
                    className={`block h-3 w-3 rounded-full ring-2 ring-[var(--color-bg)] ${active ? 'scale-150' : ''}`}
                    style={{ background: l.dot, boxShadow: active ? `0 0 0 4px ${l.dot}44` : 'none' }}
                  />
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-[11.5px] text-[var(--color-text-dim)]">
            {['critical', 'high', 'elevated', 'safe'].map((lv) => (
              <span key={lv} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: levelOf(lv).dot }} /> {levelOf(lv).label}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title={worker ? 'Selected Worker' : 'Tap a worker'} eyebrow="Twin inspector">
          {worker ? (
            <div className="space-y-3">
              <div>
                <p className="text-[15px] font-semibold text-white">{worker.name}</p>
                <p className="font-mono text-[11.5px] text-[var(--color-text-dim)]">{worker.id}</p>
              </div>
              <StatusBadge level={worker.riskLevel} pulse />
              <dl className="space-y-2 text-[12.5px]">
                {[
                  ['Zone', worker.zoneName],
                  ['Activity', worker.activity],
                  ['Height', `${worker.heightM} m`],
                  ['Edge distance', `${worker.edgeDistanceM} m`],
                  ['Heart rate', `${worker.heartRate} bpm`],
                  ['Harness', worker.harnessConnected ? 'Connected' : 'Disconnected'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-[var(--color-border-soft)] pb-2">
                    <dt className="text-[var(--color-text-dim)]">{k}</dt>
                    <dd className="font-medium text-white">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link to={`/worker/${worker.id}`} className="block rounded-lg bg-[var(--color-accent)] py-2.5 text-center text-[13px] font-semibold text-white hover:bg-[#2569D6]">
                Open full profile
              </Link>
            </div>
          ) : (
            <p className="text-[13px] text-[var(--color-text-dim)]">Select any marker on the twin to inspect that worker's live status, vitals and PPE state.</p>
          )}
        </Panel>
      </div>
    </div>
  )
}
