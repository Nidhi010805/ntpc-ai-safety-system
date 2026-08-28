import { CloudFog, Camera, Ruler, MapPin } from 'lucide-react'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import { ashLeakEvents } from '../data/mockData'

export default function AshLeakage() {
  return (
    <div className="mx-auto min-w-0 w-full max-w-[1300px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">M5 · Segmentation</p>
        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">Ash Leakage & Spillage</h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">Segmented ash/slurry region status with estimated visible area and source-location tags.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {ashLeakEvents.map((e) => (
          <Panel key={e.id} title={e.kind} eyebrow={e.id}>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--color-border)] bg-[radial-gradient(circle_at_50%_65%,#5a554f,#171b24_60%,#0a0f1a)]">
              <div className="absolute inset-0 bg-grid opacity-20" />
              {e.areaM2 > 0 && <div className="absolute bottom-[18%] left-[24%] h-[28%] w-[48%] rounded-[45%] border-2 border-[var(--color-amber)] bg-[var(--color-amber)]/15" />}
              <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 font-mono text-[9px] text-white"><Camera className="mr-1 inline h-3 w-3" />{e.cameraId}</span>
            </div>
            <div className="mt-4 space-y-2.5 text-[12px]">
              <p className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[var(--color-text-dim)]"><MapPin className="h-3.5 w-3.5" />Location</span><span className="max-w-[60%] text-right text-white">{e.location}</span></p>
              <p className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[var(--color-text-dim)]"><Ruler className="h-3.5 w-3.5" />Visible area</span><span className="text-white">{e.areaM2} m²</span></p>
              <p className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[var(--color-text-dim)]"><CloudFog className="h-3.5 w-3.5" />Confidence</span><span className="text-white">{e.confidence}%</span></p>
              <p className="flex items-center justify-between"><span className="text-[var(--color-text-dim)]">Severity</span><StatusBadge level={e.severity} pulse={e.status === 'Open'} /></p>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  )
}
