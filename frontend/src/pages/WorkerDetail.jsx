import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, HeartPulse, Ruler, Clock, ShieldCheck, ShieldX } from 'lucide-react'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import RiskGauge from '../components/RiskGauge'
import { workers, explainRisk } from '../data/mockData'
import { levelOf } from '../lib/levels'

export default function WorkerDetail() {
  const { id } = useParams()
  const worker = workers.find((w) => w.id === id) || workers[0]
  const reasons = explainRisk(worker)

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <Link to="/monitoring" className="flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--color-text-dim)] hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to live monitoring
      </Link>

      <Panel bodyClassName="p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <RiskGauge score={worker.riskScore} level={worker.riskLevel} size={72} />
            <div>
              <h1 className="font-[var(--font-display)] text-[22px] font-bold text-white">{worker.name}</h1>
              <p className="font-mono text-[12px] text-[var(--color-text-dim)]">{worker.id} · {worker.shift} · Supervisor {worker.supervisor}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge level={worker.riskLevel} pulse />
                <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${worker.harnessConnected ? 'border-[var(--color-safe)]/30 text-[var(--color-safe)]' : 'border-[var(--color-danger)]/30 text-[var(--color-danger)]'}`}>
                  {worker.harnessConnected ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldX className="h-3.5 w-3.5" />}
                  Harness {worker.harnessConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: MapPin, label: 'Zone', value: worker.zoneName },
          { icon: Ruler, label: 'Height', value: `${worker.heightM} m` },
          { icon: HeartPulse, label: 'Heart Rate', value: `${worker.heartRate} bpm` },
          { icon: Clock, label: 'Last Update', value: worker.lastUpdate },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <s.icon className="h-4 w-4 text-[var(--color-text-dim)]" />
            <p className="mt-2 text-[15px] font-semibold text-white">{s.value}</p>
            <p className="mt-0.5 text-[11px] text-[var(--color-text-dim)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Explainable AI panel */}
      <Panel title="Why This Risk Score?" eyebrow="Explainable AI — factor breakdown">
        <ul className="space-y-3">
          {reasons.map((r, i) => {
            const l = levelOf(r.severity)
            return (
              <li key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13.5px] font-medium text-white">{r.label}</p>
                  <span className={`shrink-0 font-mono text-[11.5px] ${l.text}`}>{r.weight}% weight</span>
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
                  <div className="h-full rounded-full" style={{ width: `${r.weight}%`, background: l.dot }} />
                </div>
              </li>
            )
          })}
        </ul>
      </Panel>

      <Panel title="PPE Status" eyebrow="Detected by vision model">
        <div className="flex flex-wrap gap-2">
          {['Helmet', 'Harness', 'Gloves', 'Safety Glasses', 'Boots', 'Hi-Vis Vest'].map((item) => {
            const missing = worker.ppeMissing.includes(item)
            return (
              <span key={item} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium ${missing ? 'border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)] text-[var(--color-danger)]' : 'border-[var(--color-safe)]/30 bg-[var(--color-safe-soft)] text-[var(--color-safe)]'}`}>
                {missing ? <ShieldX className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />} {item}
              </span>
            )
          })}
        </div>
      </Panel>

      <Panel title="Recommended Action" eyebrow="Auto-generated">
        <p className="text-[13.5px] leading-relaxed text-[var(--color-text-dim)]">
          {worker.riskLevel === 'critical'
            ? `Dispatch a supervisor to ${worker.zoneName} immediately and instruct ${worker.name.split(' ')[0]} to stop work until the harness is re-anchored and missing PPE is replaced.`
            : worker.riskLevel === 'high'
            ? `Radio ${worker.name.split(' ')[0]} to correct PPE and confirm harness anchoring before continuing work in ${worker.zoneName}.`
            : `No immediate action required. Continue routine monitoring for ${worker.name.split(' ')[0]} in ${worker.zoneName}.`}
        </p>
        <Link to="/evacuation" className="mt-4 inline-block rounded-lg border border-[var(--color-border)] px-4 py-2 text-[12.5px] font-medium text-[var(--color-text-dim)] hover:text-white">
          View evacuation route for this worker →
        </Link>
      </Panel>
    </div>
  )
}
