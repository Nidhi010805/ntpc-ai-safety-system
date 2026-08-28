export default function Panel({ title, eyebrow, action, children, className = '', bodyClassName = '' }) {
  return (
    <section className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between border-b border-[var(--color-border-soft)] px-5 py-4">
          <div>
            {eyebrow && (
              <p className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-dim)]">
                {eyebrow}
              </p>
            )}
            {title && <h2 className="font-[var(--font-display)] text-[15px] font-semibold text-[var(--color-text)]">{title}</h2>}
          </div>
          {action}
        </header>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </section>
  )
}
