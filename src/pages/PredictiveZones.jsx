import { useMemo, useState } from 'react'
import { AlertTriangle, Thermometer, Wind, Eye } from 'lucide-react'
import Panel from '../components/Panel'
import { zones } from '../data/mockData'
import { levelOf } from '../lib/levels'

const HORIZONS = [30, 60, 120]

function projectedLevel(baseLevel, horizon) {
  const order = ['safe', 'elevated', 'high', 'critical']
  let idx = order.indexOf(baseLevel === 'nominal' ? 'safe' : baseLevel)
  if (horizon >= 60 && (baseLevel === 'high' || baseLevel === 'elevated')) idx += 1
  if (horizon >= 120 && baseLevel !== 'safe') idx = Math.min(idx + 1, 3)
  return order[Math.min(idx, 3)]
}

export default function PredictiveZones() {
  const [horizon, setHorizon] = useState(60)

  const projected = useMemo(
    () => zones.map((z) => ({ ...z, projLevel: projectedLevel(z.level, horizon) })),
    [horizon]
  )
  const worsening = projected.filter((z) => z.projLevel !== z.level)

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">Predictive Intelligence</p>
        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Predictive Unsafe-Zone Forecast</h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">Projected zone conditions based on temperature, CO trend, and visibility change</p>
      </div>

      <Panel bodyClassName="p-4 sm:p-5">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-[13px] font-medium text-white">Forecast horizon</p>
          <div className="flex gap-2">
            {HORIZONS.map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`rounded-lg border px-4 py-2 text-[12.5px] font-semibold transition-colors ${
                  horizon === h ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-white' : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-white'
                }`}
              >
                +{h}s
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {projected.map((z) => {
          const now = levelOf(z.level)
          const proj = levelOf(z.projLevel)
          const worsens = z.projLevel !== z.level
          return (
            <div key={z.id} className={`rounded-2xl border p-4 ${worsens ? 'border-[var(--color-danger)]/40 bg-[var(--color-danger-soft)]/40' : 'border-[var(--color-border)] bg-[var(--color-surface)]'}`}>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-white">{z.name}</p>
                {worsens && <AlertTriangle className="h-4 w-4 text-[var(--color-danger)]" />}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11.5px]">
                <span className={`rounded-full px-2 py-1 ${now.bgSoft} ${now.text}`}>Now: {now.label}</span>
                <span className="text-[var(--color-text-faint)]">→</span>
                <span className={`rounded-full px-2 py-1 ${proj.bgSoft} ${proj.text}`}>+{horizon}s: {proj.label}</span>
              </div>
              <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-[var(--color-surface-2)] py-2">
                  <Thermometer className="mx-auto h-3.5 w-3.5 text-[var(--color-amber)]" />
                  <p className="mt-1 font-mono text-[10.5px] text-[var(--color-text-dim)]">{28 + (horizon / 20)}°C</p>
                </div>
                <div className="rounded-lg bg-[var(--color-surface-2)] py-2">
                  <Wind className="mx-auto h-3.5 w-3.5 text-[var(--color-text-dim)]" />
                  <p className="mt-1 font-mono text-[10.5px] text-[var(--color-text-dim)]">{(4 + horizon / 40).toFixed(1)} ppm CO</p>
                </div>
                <div className="rounded-lg bg-[var(--color-surface-2)] py-2">
                  <Eye className="mx-auto h-3.5 w-3.5 text-[var(--color-text-dim)]" />
                  <p className="mt-1 font-mono text-[10.5px] text-[var(--color-text-dim)]">{Math.max(20, 85 - horizon / 2)}% vis.</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Panel title="Zones Trending Worse" eyebrow={`At +${horizon}s horizon`}>
        {worsening.length === 0 ? (
          <p className="text-[13px] text-[var(--color-text-dim)]">No zones are projected to worsen at this horizon. Conditions are stable.</p>
        ) : (
          <ul className="space-y-2">
            {worsening.map((z) => (
              <li key={z.id} className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5 text-[13px]">
                <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--color-amber)]" />
                <span className="text-white">{z.name}</span>
                <span className="ml-auto text-[var(--color-text-dim)]">{levelOf(z.level).label} → {levelOf(z.projLevel).label}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  )
}
