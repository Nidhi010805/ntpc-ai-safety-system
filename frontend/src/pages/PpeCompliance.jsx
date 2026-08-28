import { useState } from 'react'
import { Check, X, Camera } from 'lucide-react'
import Panel from '../components/Panel'
import { sitePpeDetections, workers } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'

const CAMS = ['CAM‑04 · Boiler Deck 4', 'CAM‑11 · Turbine Roof', 'CAM‑02 · Chimney Ladder', 'CAM‑07 · Switchyard']

export default function PpeCompliance() {
  const [cam, setCam] = useState(CAMS[0])
  const okCount = sitePpeDetections.filter((d) => d.ok).length
  const violations = workers.filter((w) => !w.ppeOk).slice(0, 6)

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">PPE Compliance</p>
        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Vision-Based PPE Detection</h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">Few-shot detection model · Helmet, Harness, Gloves, Glasses, Boots, Hi-Vis Vest</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          title="Live Camera Feed"
          eyebrow={cam}
          className="xl:col-span-2"
          action={
            <select
              value={cam}
              onChange={(e) => setCam(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2.5 py-1.5 text-[12px] text-white focus:outline-none"
            >
              {CAMS.map((c) => <option key={c}>{c}</option>)}
            </select>
          }
        >
          <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--color-border)] bg-[radial-gradient(circle_at_30%_20%,#16223A,#0A0F1A)]">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 animate-scan bg-gradient-to-b from-[var(--color-accent)]/25 to-transparent" />

            {/* stylised worker silhouette */}
            <svg viewBox="0 0 100 100" className="absolute left-1/2 top-1/2 h-[78%] -translate-x-1/2 -translate-y-1/2 opacity-80">
              <ellipse cx="42" cy="18" rx="9" ry="10" fill="#2A3A5C" />
              <rect x="30" y="28" width="24" height="34" rx="6" fill="#2A3A5C" />
              <rect x="22" y="32" width="8" height="26" rx="4" fill="#233251" />
              <rect x="54" y="32" width="8" height="26" rx="4" fill="#233251" />
              <rect x="33" y="62" width="8" height="30" rx="4" fill="#1E2C48" />
              <rect x="45" y="62" width="8" height="30" rx="4" fill="#1E2C48" />
            </svg>

            {sitePpeDetections.map((d) => (
              <div
                key={d.id}
                className="absolute"
                style={{ left: `${d.box.x}%`, top: `${d.box.y}%`, width: `${d.box.w}%`, height: `${d.box.h}%` }}
              >
                <div
                  className={`h-full w-full rounded-sm border-2 ${d.ok ? 'border-[var(--color-safe)]' : 'border-[var(--color-danger)]'}`}
                  style={{ boxShadow: `0 0 0 2000px transparent` }}
                />
                <span
                  className={`absolute -top-6 left-0 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-white ${d.ok ? 'bg-[var(--color-safe)]/90' : 'bg-[var(--color-danger)]/90'}`}
                >
                  {d.item} {d.confidence}%
                </span>
              </div>
            ))}

            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/50 px-2.5 py-1 font-mono text-[10.5px] text-white">
              <Camera className="h-3 w-3" /> REC · {cam.split(' · ')[0]}
            </div>
            <div className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2.5 py-1 font-mono text-[10.5px] text-[var(--color-safe)]">
              Model conf. 94.2%
            </div>
          </div>
        </Panel>

        <Panel title="Detection Breakdown" eyebrow={`${okCount}/${sitePpeDetections.length} items compliant`}>
          <ul className="space-y-2.5">
            {sitePpeDetections.map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className={`grid h-6 w-6 place-items-center rounded-full ${d.ok ? 'bg-[var(--color-safe-soft)] text-[var(--color-safe)]' : 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'}`}>
                    {d.ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  </span>
                  <span className="text-[13px] font-medium text-white">{d.item}</span>
                </div>
                <span className="font-mono text-[11.5px] text-[var(--color-text-dim)]">{d.confidence}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Site-Wide PPE Violations" eyebrow="Workers missing one or more required items" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-border-soft)] text-[11px] uppercase tracking-wide text-[var(--color-text-dim)]">
                <th className="px-5 py-3 font-medium">Worker</th>
                <th className="px-5 py-3 font-medium">Zone</th>
                <th className="px-5 py-3 font-medium">Missing Items</th>
                <th className="px-5 py-3 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-soft)]">
              {violations.map((w) => (
                <tr key={w.id} className="text-[13px] hover:bg-[var(--color-surface-2)]">
                  <td className="px-5 py-3">
                    <p className="font-medium text-white">{w.name}</p>
                    <p className="font-mono text-[11px] text-[var(--color-text-dim)]">{w.id}</p>
                  </td>
                  <td className="px-5 py-3 text-[var(--color-text-dim)]">{w.zoneName}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {w.ppeMissing.map((m) => (
                        <span key={m} className="rounded-full border border-[var(--color-amber)]/30 px-2 py-0.5 text-[11px] text-[var(--color-amber)]">{m}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3"><StatusBadge level={w.riskLevel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
