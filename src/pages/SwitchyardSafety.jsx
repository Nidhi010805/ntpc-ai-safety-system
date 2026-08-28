import { Zap, ShieldAlert, Camera, TriangleAlert } from 'lucide-react'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import { switchyardEvents } from '../data/mockData'

export default function SwitchyardSafety() {
  return (
    <div className="mx-auto min-w-0 w-full max-w-[1350px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">M4 · Restricted-zone Analytics</p>
        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Switchyard Safety</h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">Intrusion, climb and arc-flash visual anomaly monitoring across restricted bays.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {switchyardEvents.map((e) => (
          <Panel key={e.id} title={e.bay} eyebrow={`${e.id} · ${e.cameraId}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 text-[12.5px]">
                <p><span className="text-[var(--color-text-dim)]">Detected object:</span> <span className="font-semibold text-white">{e.object}</span></p>
                <p><span className="text-[var(--color-text-dim)]">Restricted intrusion:</span> <span className={e.intrusion ? 'text-[var(--color-danger)]' : 'text-[var(--color-safe)]'}>{e.intrusion ? 'YES' : 'NO'}</span></p>
                <p><span className="text-[var(--color-text-dim)]">Climb detected:</span> <span className={e.climb ? 'text-[var(--color-amber)]' : 'text-white'}>{e.climb ? 'YES' : 'NO'}</span></p>
                <p><span className="text-[var(--color-text-dim)]">Arc-flash anomaly:</span> <span className={e.arcFlash ? 'text-[var(--color-danger)]' : 'text-white'}>{e.arcFlash ? 'YES' : 'NO'}</span></p>
                <p><span className="text-[var(--color-text-dim)]">Confidence:</span> <span className="text-white">{e.confidence}%</span></p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <StatusBadge level={e.severity} pulse={e.status === 'Open'} />
                {e.arcFlash ? <Zap className="h-8 w-8 text-[var(--color-danger)]" /> : e.intrusion ? <ShieldAlert className="h-8 w-8 text-[var(--color-danger)]" /> : <TriangleAlert className="h-8 w-8 text-[var(--color-amber)]" />}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border-soft)] pt-3 font-mono text-[10px] text-[var(--color-text-faint)]"><span className="flex items-center gap-1"><Camera className="h-3 w-3" /> {e.cameraId}</span><span>{e.time}</span></div>
          </Panel>
        ))}
      </div>
    </div>
  )
}
