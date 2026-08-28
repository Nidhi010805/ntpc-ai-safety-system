import { Activity, MapPin, Timer, Camera } from 'lucide-react'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import { manDownTracks } from '../data/mockData'

export default function ManDown() {
  return (
    <div className="mx-auto min-w-0 w-full max-w-[1300px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">M6 · Pose + Location</p>
        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Man-Down / Fallen Person Tracker</h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">Anonymous track states with persistence timing and ground-plane coordinates.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {manDownTracks.map((t) => (
          <Panel key={t.id} title={t.id} eyebrow={`${t.cameraId} · ${t.zone}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-dim)]">Current state</p>
                <p className={`mt-1 text-[22px] font-bold ${t.state === 'FALLEN' ? 'text-[var(--color-danger)]' : 'text-white'}`}>{t.state}</p>
              </div>
              <StatusBadge level={t.severity} pulse={t.state === 'FALLEN'} />
            </div>
            <div className="mt-4 space-y-2.5 text-[12px]">
              <p className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[var(--color-text-dim)]"><Activity className="h-3.5 w-3.5" /> Confidence</span><span className="text-white">{t.confidence}%</span></p>
              <p className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[var(--color-text-dim)]"><Timer className="h-3.5 w-3.5" /> Persistence</span><span className="text-white">{t.durationSec}s</span></p>
              <p className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[var(--color-text-dim)]"><MapPin className="h-3.5 w-3.5" /> Coordinate</span><span className="font-mono text-white">{t.x}, {t.y}</span></p>
              <p className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[var(--color-text-dim)]"><Camera className="h-3.5 w-3.5" /> Motion</span><span className="text-white">{t.motion}</span></p>
            </div>
            {t.state === 'FALLEN' && <button className="mt-4 w-full rounded-lg bg-[var(--color-danger)] px-3 py-2 text-[12px] font-semibold text-white">Dispatch Response</button>}
          </Panel>
        ))}
      </div>
    </div>
  )
}
