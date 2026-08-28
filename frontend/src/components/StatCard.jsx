export default function StatCard({ icon: Icon, label, value, sub, tone = 'default' }) {
  const toneMap = {
    default: 'text-white',
    danger: 'text-[var(--color-danger)]',
    amber: 'text-[var(--color-amber)]',
    safe: 'text-[var(--color-safe)]',
  }
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4.5 p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-dim)]">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-[var(--color-text-dim)]" strokeWidth={2} />}
      </div>
      <p className={`mt-2 font-[var(--font-display)] text-[30px] font-bold leading-none tabular ${toneMap[tone]}`}>{value}</p>
      {sub && <p className="mt-2 text-[11.5px] text-[var(--color-text-dim)]">{sub}</p>}
    </div>
  )
}
