import { levelOf } from '../lib/levels'

export default function RiskGauge({ score, level, size = 88 }) {
  const l = levelOf(level)
  const r = (size - 10) / 2
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth="7" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={l.dot}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-mono text-[15px] font-bold tabular text-white">{score}</span>
      </div>
    </div>
  )
}
