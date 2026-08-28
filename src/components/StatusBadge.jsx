import { levelOf } from '../lib/levels'

export default function StatusBadge({ level, pulse = false }) {
  const l = levelOf(level)
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${l.border} ${l.bgSoft} px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${l.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${l.bg} ${pulse && (level === 'critical' || level === 'high') ? 'pulse-danger' : ''}`}
      />
      {l.label}
    </span>
  )
}
