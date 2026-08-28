import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Radar, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="grid min-h-screen bg-[var(--color-bg)] bg-grid lg:grid-cols-[1.1fr_1fr]">
      {/* Left — brand / thesis panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-[var(--color-border)] bg-[var(--color-bg-raised)] p-10 lg:flex xl:p-14">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
        <div className="absolute -bottom-32 left-0 h-96 w-96 rounded-full bg-[var(--color-amber)]/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[#1149A8]">
            <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-[var(--font-display)] text-lg font-bold text-white">HeightSafe‑X</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-dim)]">NTPC Predictive Safety Console</p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)]">Live at Vindhyachal STPS · Unit 7</p>
          <h1 className="mt-4 font-[var(--font-display)] text-[40px] font-bold leading-[1.08] text-white xl:text-[46px]">
            Know who's at risk, why, and what to do — before it happens.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-text-dim)]">
            Vision intelligence, PPE detection, mmWave radar and wearable sensors fused into a
            single digital twin of every worker-at-height on site — refreshed in real time for the control room.
          </p>

          <div className="mt-9 grid grid-cols-3 gap-4">
            {[
              { label: 'Workers tracked', value: '20' },
              { label: 'Hazard zones', value: '8' },
              { label: 'Avg. detection latency', value: '0.4s' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4">
                <p className="font-mono text-2xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-[11px] text-[var(--color-text-dim)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[11px] text-[var(--color-text-dim)]">
          <Radar className="h-4 w-4 text-[var(--color-accent)]" />
          Sensor mesh nominal · Last sync 2s ago
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[#1149A8]">
              <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <p className="font-[var(--font-display)] text-base font-bold text-white">HeightSafe‑X</p>
          </div>

          <h2 className="font-[var(--font-display)] text-2xl font-bold text-white">Control room sign in</h2>
          <p className="mt-1.5 text-[13.5px] text-[var(--color-text-dim)]">Authorized safety personnel only. Access is logged.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-[var(--color-text-dim)]">Employee ID</label>
              <input
                required
                defaultValue="NTPC-SO-4471"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-[14px] text-white placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)] focus:outline-none"
                placeholder="e.g. NTPC-SO-4471"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-[var(--color-text-dim)]">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPw ? 'text' : 'password'}
                  defaultValue="••••••••••"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 pr-10 text-[14px] text-white focus:border-[var(--color-accent)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] hover:text-white"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[12.5px]">
              <label className="flex items-center gap-2 text-[var(--color-text-dim)]">
                <input type="checkbox" defaultChecked className="h-3.5 w-3.5 rounded border-[var(--color-border)] accent-[var(--color-accent)]" />
                Keep this console open
              </label>
              <a href="#" className="text-[var(--color-accent)] hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] py-2.75 text-[14px] font-semibold text-white transition-colors hover:bg-[#2569D6]"
            >
              Enter control room <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-[var(--color-text-faint)]">
            Protected under NTPC IT Security Policy · Session recorded for compliance
          </p>
        </div>
      </div>
    </div>
  )
}
