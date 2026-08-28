import { Flame, Wind, Camera, Clock3, ScanSearch } from 'lucide-react'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import { fireSmokeEvents } from '../data/mockData'

export default function FireSmoke() {
  const active = fireSmokeEvents.filter((e) => e.detected && e.type !== 'White Steam')
  return (
    <div className="mx-auto min-w-0 w-full max-w-[1400px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">M1 · Vision Analytics</p>
        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Fire & Smoke Detection</h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">Visible plume detection, smoke-type classification and temporal confirmation. Simulated frontend feed.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><p className="text-[11px] text-[var(--color-text-dim)]">Active events</p><p className="mt-1 text-2xl font-bold text-white">{active.length}</p></div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><p className="text-[11px] text-[var(--color-text-dim)]">Highest confidence</p><p className="mt-1 text-2xl font-bold text-white">{Math.max(...fireSmokeEvents.map(e => e.confidence))}%</p></div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><p className="text-[11px] text-[var(--color-text-dim)]">Steam classified safe</p><p className="mt-1 text-2xl font-bold text-[var(--color-safe)]">1</p></div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><p className="text-[11px] text-[var(--color-text-dim)]">Temporal gate</p><p className="mt-1 text-2xl font-bold text-white">ON</p></div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {fireSmokeEvents.map((e) => (
          <Panel key={e.id} title={`${e.cameraId} · ${e.zone}`} eyebrow={e.id}>
            <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr]">
              <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--color-border)] bg-[radial-gradient(circle_at_55%_35%,#263852,#0a0f1a_62%)]">
                <div className="absolute inset-0 bg-grid opacity-25" />
                {e.detected && (
                  <div className={`absolute left-[42%] top-[20%] h-[42%] w-[30%] rounded-[45%] border-2 ${e.type === 'White Steam' ? 'border-white/60 bg-white/10' : 'border-[var(--color-danger)] bg-[var(--color-danger)]/10'}`} />
                )}
                <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 font-mono text-[9px] text-white"><Camera className="mr-1 inline h-3 w-3" />LIVE</span>
                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 font-mono text-[9px] text-white">{e.type} · {e.confidence}%</span>
              </div>
              <div className="space-y-3 text-[12px]">
                <div className="flex items-center justify-between"><span className="text-[var(--color-text-dim)]">Classification</span><span className="font-semibold text-white">{e.type}</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--color-text-dim)]">Opacity band</span><span className="text-white">{e.opacityBand}</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--color-text-dim)]">Duration</span><span className="text-white">{e.durationSec}s</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--color-text-dim)]">Confidence</span><span className="text-white">{e.confidence}%</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--color-text-dim)]">Severity</span><StatusBadge level={e.severity} pulse={e.status === 'Open'} /></div>
                <div className="flex items-center gap-1.5 border-t border-[var(--color-border-soft)] pt-3 font-mono text-[10px] text-[var(--color-text-faint)]"><Clock3 className="h-3 w-3" /> {e.time}</div>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Model Output Boundary" eyebrow="Operator note">
        <div className="flex items-start gap-3 text-[12.5px] text-[var(--color-text-dim)]">
          <ScanSearch className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
          <p>Frontend shows visual plume class, confidence, duration and relative severity only. Concentration values such as SO₂/NOx/CO₂ are not inferred from RGB video unless a sensor/CEMS feed is integrated.</p>
        </div>
      </Panel>
    </div>
  )
}
