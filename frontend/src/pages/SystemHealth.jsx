import { Server, WifiOff, Gauge, Cpu, Camera } from 'lucide-react'
import Panel from '../components/Panel'
import { cameraHealth } from '../data/mockData'

export default function SystemHealth() {
  const online = cameraHealth.filter(c => c.online).length
  const avgLatency = (cameraHealth.filter(c => c.online).reduce((s, c) => s + c.latency, 0) / online).toFixed(1)
  return (
    <div className="mx-auto min-w-0 w-full max-w-[1250px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">Platform Status</p>
        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">AI System Health</h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">Frontend representation of on-premise stream, inference and air-gap status.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><Server className="h-4 w-4 text-[var(--color-accent)]"/><p className="mt-2 text-[11px] text-[var(--color-text-dim)]">Streams online</p><p className="mt-1 text-2xl font-bold text-white">{online}/{cameraHealth.length}</p></div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><Gauge className="h-4 w-4 text-[var(--color-accent)]"/><p className="mt-2 text-[11px] text-[var(--color-text-dim)]">Analytics FPS</p><p className="mt-1 text-2xl font-bold text-white">10</p></div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><Cpu className="h-4 w-4 text-[var(--color-accent)]"/><p className="mt-2 text-[11px] text-[var(--color-text-dim)]">Avg latency</p><p className="mt-1 text-2xl font-bold text-white">{avgLatency}s</p></div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"><WifiOff className="h-4 w-4 text-[var(--color-safe)]"/><p className="mt-2 text-[11px] text-[var(--color-text-dim)]">Outbound packets</p><p className="mt-1 text-2xl font-bold text-[var(--color-safe)]">0</p></div>
      </div>
      <Panel title="Camera / Inference Nodes" eyebrow="Simulated status" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[12px]">
            <thead className="border-b border-[var(--color-border-soft)] text-[var(--color-text-dim)]"><tr><th className="px-5 py-3">Camera</th><th>Zone</th><th>Mode</th><th>Module</th><th>FPS</th><th>Latency</th><th>Status</th></tr></thead>
            <tbody>{cameraHealth.map(c => <tr key={c.id} className="border-b border-[var(--color-border-soft)] last:border-0"><td className="px-5 py-3 font-mono text-white"><Camera className="mr-1 inline h-3.5 w-3.5"/>{c.id}</td><td>{c.zone}</td><td>{c.mode}</td><td>{c.module}</td><td>{c.fps}</td><td>{c.online ? `${c.latency}s` : '—'}</td><td><span className={c.online ? 'text-[var(--color-safe)]' : 'text-[var(--color-danger)]'}>{c.online ? 'Online' : 'Offline'}</span></td></tr>)}</tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
