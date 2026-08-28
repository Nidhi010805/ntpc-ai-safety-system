import { Link } from 'react-router-dom'
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  Siren,
  TrendingUp,
  ArrowUpRight,
  Camera,
  Wifi,
  AlertTriangle,
} from 'lucide-react'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts'

import StatCard from '../components/StatCard'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import RiskGauge from '../components/RiskGauge'

import {
  siteSummary,
  riskTrend,
  zoneRiskBars,
  workers,
  alerts,
  incidents,
  cameraHealth,
  cameraDetections,
  fireSmokeEvents,
  manDownTracks,
  switchyardEvents,
  ashLeakEvents,
} from '../data/mockData'

import { levelOf } from '../lib/levels'

export default function Dashboard() {
  const s = siteSummary()

  const atRiskWorkers = [...workers]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5)

  const recentAlerts = alerts.slice(0, 5)
  const recentIncidents = incidents.slice(0, 4)

  const allCameraDetections = Object.entries(cameraDetections).flatMap(
    ([cameraId, detections]) =>
      detections.map((detection) => ({
        cameraId,
        ...detection,
      }))
  )

  const criticalCameraEvents = allCameraDetections
    .filter((detection) => detection.severity === 'critical')
    .slice(0, 4)

  const onlineCameraList = cameraHealth.filter((camera) => camera.online)

  const onlineCameras = onlineCameraList.length

  const avgLatency =
    onlineCameraList.length > 0
      ? (
          onlineCameraList.reduce(
            (sum, camera) => sum + Number(camera.latency || 0),
            0
          ) / onlineCameraList.length
        ).toFixed(1)
      : '0.0'

  const moduleStats = [
    {
      label: 'Fire / Smoke',
      value: fireSmokeEvents.filter((event) => event.detected).length,
      tone: 'danger',
      path: '/fire-smoke',
    },
    {
      label: 'Man Down',
      value: manDownTracks.filter((track) => track.state === 'FALLEN').length,
      tone: 'danger',
      path: '/man-down',
    },
    {
      label: 'Switchyard',
      value: switchyardEvents.filter(
        (event) => event.intrusion || event.climb || event.arcFlash
      ).length,
      tone: 'amber',
      path: '/switchyard',
    },
    {
      label: 'Ash Leakage',
      value: ashLeakEvents.filter((event) => event.areaM2 > 0).length,
      tone: 'amber',
      path: '/ash-leakage',
    },
  ]

  const snapshotCameras = [
    ...cameraHealth
      .filter((camera) =>
        (cameraDetections[camera.id] || []).some(
          (event) => event.severity === 'critical'
        )
      )
      .slice(0, 2),

    ...cameraHealth
      .filter(
        (camera) =>
          !(cameraDetections[camera.id] || []).some(
            (event) => event.severity === 'critical'
          )
      )
      .slice(0, 2),
  ].slice(0, 4)

  return (
    <div className="mx-auto min-w-0 w-full max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Site Overview
          </p>

          <h1 className="mt-1 font-[var(--font-display)] text-[26px] font-bold text-white">
            Vindhyachal STPS — Unit 7
          </h1>

          <p className="mt-1 text-[12px] text-[var(--color-text-dim)]">
            AI-assisted safety operations · CCTV · PPE · fall · smoke ·
            switchyard · ash monitoring
          </p>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full border px-4 py-2 ${
            s.criticalAlerts > 0
              ? 'border-[var(--color-danger)]/40 bg-[var(--color-danger-soft)]'
              : 'border-[var(--color-safe)]/40 bg-[var(--color-safe-soft)]'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              s.criticalAlerts > 0
                ? 'bg-[var(--color-danger)] pulse-danger'
                : 'bg-[var(--color-safe)]'
            }`}
          />

          <span
            className={`text-[12.5px] font-semibold ${
              s.criticalAlerts > 0
                ? 'text-[var(--color-danger)]'
                : 'text-[var(--color-safe)]'
            }`}
          >
            {s.criticalAlerts > 0
              ? `${s.criticalAlerts} critical alert${
                  s.criticalAlerts > 1 ? 's' : ''
                } — action required`
              : 'Site risk level nominal'}
          </span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid min-w-0 grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          icon={Users}
          label="Total Workers"
          value={s.total}
          sub="On site right now"
        />

        <StatCard
          icon={ShieldCheck}
          label="Safe"
          value={s.safe}
          tone="safe"
          sub={`${Math.round((s.safe / s.total) * 100)}% of workforce`}
        />

        <StatCard
          icon={ShieldAlert}
          label="At Risk"
          value={s.atRisk}
          tone="danger"
          sub="High + critical risk score"
        />

        <StatCard
          icon={Siren}
          label="PPE Violations"
          value={s.ppeViolations}
          tone="amber"
          sub="Missing one or more items"
        />

        <StatCard
          icon={TrendingUp}
          label="Avg. Risk Score"
          value={s.avgRisk}
          tone={s.avgRisk > 55 ? 'danger' : 'default'}
          sub="Site-wide, last 5 min"
        />
      </div>

      {/* Critical AI events + system health */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          title="Critical AI Events"
          eyebrow="Immediate attention"
          className="xl:col-span-2"
          action={
            <Link
              to="/camera"
              className="flex items-center gap-1 text-[12px] font-medium text-[var(--color-accent)] hover:underline"
            >
              Open CCTV
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {criticalCameraEvents.length === 0 ? (
            <div className="rounded-xl border border-[var(--color-safe)]/30 bg-[var(--color-safe)]/5 p-4">
              <p className="text-[12px] font-semibold text-[var(--color-safe)]">
                No critical AI events
              </p>

              <p className="mt-1 text-[11px] text-[var(--color-text-dim)]">
                Camera analytics are operating normally.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {criticalCameraEvents.map((event) => (
                <Link
                  key={`${event.cameraId}-${event.id}`}
                  to="/camera"
                  className="rounded-xl border border-[var(--color-danger)]/35 bg-[var(--color-danger)]/5 p-3.5 transition hover:bg-[var(--color-danger)]/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12.5px] font-semibold text-[var(--color-danger)]">
                        {event.label}
                      </p>

                      <p className="mt-1 font-mono text-[10px] text-[var(--color-text-dim)]">
                        {event.cameraId}
                      </p>
                    </div>

                    <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--color-danger)]" />
                  </div>

                  <p className="mt-2 text-[11px] text-[var(--color-text-dim)]">
                    {event.details}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-white">
                      Confidence {event.confidence}%
                    </span>

                    <span className="font-mono text-[9px] uppercase text-[var(--color-danger)]">
                      Critical
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="System Health" eyebrow="Live infrastructure">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--color-text-dim)]">
                Cameras online
              </span>

              <span className="font-mono text-[12px] font-semibold text-[var(--color-safe)]">
                {onlineCameras}/{cameraHealth.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--color-text-dim)]">
                Avg latency
              </span>

              <span className="font-mono text-[12px] text-white">
                {avgLatency}s
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--color-text-dim)]">
                AI engine
              </span>

              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-safe)]">
                <Wifi className="h-3.5 w-3.5" />
                Online
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--color-text-dim)]">
                Active AI detections
              </span>

              <span className="font-mono text-[12px] text-white">
                {allCameraDetections.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--color-text-dim)]">
                Critical detections
              </span>

              <span className="font-mono text-[12px] font-semibold text-[var(--color-danger)]">
                {
                  allCameraDetections.filter(
                    (event) => event.severity === 'critical'
                  ).length
                }
              </span>
            </div>

            <Link
              to="/system-health"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-accent)] hover:underline"
            >
              View system health
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Panel>
      </div>

      {/* Charts */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          title="Site Risk Trend"
          eyebrow="Last 12 hours"
          className="xl:col-span-2"
        >
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart
              data={riskTrend}
              margin={{ left: -20, right: 10 }}
            >
              <defs>
                <linearGradient
                  id="riskFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#2D7DF6"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="100%"
                    stopColor="#2D7DF6"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#1A2540"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                stroke="#566588"
                tick={{
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono',
                }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#566588"
                tick={{
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono',
                }}
                tickLine={false}
                axisLine={false}
                width={30}
              />

              <Tooltip
                contentStyle={{
                  background: '#111A2B',
                  border: '1px solid #223052',
                  borderRadius: 10,
                  fontSize: 12,
                }}
                labelStyle={{
                  color: '#8291AD',
                }}
              />

              <Area
                type="monotone"
                dataKey="risk"
                stroke="#2D7DF6"
                strokeWidth={2.5}
                fill="url(#riskFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel
          title="Risk by Zone"
          eyebrow={`${zoneRiskBars.length} hazard zones`}
        >
          <ResponsiveContainer width="100%" height={230}>
            <BarChart
              data={zoneRiskBars}
              layout="vertical"
              margin={{
                left: 0,
                right: 16,
              }}
            >
              <XAxis
                type="number"
                hide
                domain={[0, 100]}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={100}
                stroke="#8291AD"
                tick={{
                  fontSize: 10.5,
                  fontFamily: 'Inter',
                }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                cursor={{
                  fill: 'rgba(255,255,255,0.03)',
                }}
                contentStyle={{
                  background: '#111A2B',
                  border: '1px solid #223052',
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />

              <Bar
                dataKey="score"
                radius={[0, 6, 6, 0]}
                barSize={14}
              >
                {zoneRiskBars.map((zone, i) => (
                  <Cell
                    key={`${zone.name}-${i}`}
                    fill={levelOf(zone.level).dot}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* CCTV + module status */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          title="Live CCTV Snapshot"
          eyebrow="Highest-priority feeds"
          className="xl:col-span-2"
          action={
            <Link
              to="/camera"
              className="flex items-center gap-1 text-[12px] font-medium text-[var(--color-accent)] hover:underline"
            >
              Camera center
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {snapshotCameras.map((camera) => {
              const cameraEvents =
                cameraDetections[camera.id] || []

              const hasCritical = cameraEvents.some(
                (event) => event.severity === 'critical'
              )

              const isThermal =
                camera.mode
                  ?.toLowerCase()
                  .includes('thermal') || false

              return (
                <Link
                  key={camera.id}
                  to="/camera"
                  className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] transition hover:border-[var(--color-accent)]/60"
                >
                  <div
                    className="relative aspect-video overflow-hidden"
                    style={{
                      background: isThermal
                        ? 'radial-gradient(circle at 45% 55%, #ff4757 0%, #ffb020 18%, #403271 48%, #080d18 82%)'
                        : 'linear-gradient(145deg, #18253c 0%, #0b1220 45%, #070b13 100%)',
                    }}
                  >
                    <div className="absolute inset-0 bg-grid opacity-20" />

                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/60 px-2 py-1 font-mono text-[9px] text-white">
                      <Camera className="h-3 w-3" />
                      {camera.id}
                    </div>

                    <div className="absolute right-2 top-2">
                      <span
                        className={`rounded px-2 py-1 font-mono text-[9px] ${
                          camera.online
                            ? 'bg-[var(--color-safe)]/85 text-black'
                            : 'bg-[var(--color-danger)]/85 text-white'
                        }`}
                      >
                        {camera.online ? 'LIVE' : 'OFFLINE'}
                      </span>
                    </div>

                    {cameraEvents.slice(0, 2).map((event) => {
                      const critical =
                        event.severity === 'critical'

                      const safe =
                        event.severity === 'safe'

                      return (
                        <div
                          key={event.id}
                          className={`absolute border ${
                            critical
                              ? 'border-[var(--color-danger)]'
                              : safe
                                ? 'border-[var(--color-safe)]'
                                : 'border-[var(--color-amber)]'
                          }`}
                          style={{
                            left: `${event.x}%`,
                            top: `${event.y}%`,
                            width: `${event.w}%`,
                            height: `${event.h}%`,
                          }}
                        >
                          <span
                            className={`absolute -top-4 left-0 whitespace-nowrap px-1 py-0.5 font-mono text-[7px] ${
                              critical
                                ? 'bg-[var(--color-danger)] text-white'
                                : safe
                                  ? 'bg-[var(--color-safe)] text-black'
                                  : 'bg-[var(--color-amber)] text-black'
                            }`}
                          >
                            {event.label}
                          </span>
                        </div>
                      )
                    })}

                    {hasCritical && camera.online && (
                      <span className="absolute bottom-2 right-2 rounded bg-[var(--color-danger)] px-2 py-1 font-mono text-[8px] font-bold text-white">
                        CRITICAL
                      </span>
                    )}

                    {!camera.online && (
                      <div className="absolute inset-0 grid place-items-center bg-black/70">
                        <span className="font-mono text-[10px] text-[var(--color-danger)]">
                          CAMERA OFFLINE
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-[12px] font-semibold text-white">
                      {camera.zone}
                    </p>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-[10px] text-[var(--color-text-dim)]">
                        {camera.module}
                      </p>

                      <span className="shrink-0 font-mono text-[9px] text-[var(--color-text-faint)]">
                        {camera.fps} FPS
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </Panel>

        <Panel
          title="AI Module Status"
          eyebrow="Active detections"
        >
          <div className="space-y-3">
            {moduleStats.map((module) => (
              <Link
                key={module.label}
                to={module.path}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 transition hover:border-[var(--color-accent)]/50"
              >
                <span className="text-[11.5px] text-white">
                  {module.label}
                </span>

                <span
                  className={`font-mono text-[13px] font-bold ${
                    module.tone === 'danger'
                      ? 'text-[var(--color-danger)]'
                      : 'text-[var(--color-amber)]'
                  }`}
                >
                  {module.value}
                </span>
              </Link>
            ))}

            <Link
              to="/camera"
              className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 transition hover:border-[var(--color-accent)]/50"
            >
              <span className="text-[11.5px] text-white">
                CCTV AI detections
              </span>

              <span className="font-mono text-[13px] font-bold text-[var(--color-accent)]">
                {allCameraDetections.length}
              </span>
            </Link>
          </div>
        </Panel>
      </div>

      {/* Workers + alerts */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          title="Highest Risk Workers"
          eyebrow="Ranked by live score"
          className="xl:col-span-2"
          bodyClassName="p-0"
          action={
            <Link
              to="/monitoring"
              className="flex items-center gap-1 text-[12px] font-medium text-[var(--color-accent)] hover:underline"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <ul className="divide-y divide-[var(--color-border-soft)]">
            {atRiskWorkers.map((worker) => (
              <li key={worker.id}>
                <Link
                  to={`/worker/${worker.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-surface-2)]"
                >
                  <RiskGauge
                    score={worker.riskScore}
                    level={worker.riskLevel}
                    size={44}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-white">
                      {worker.name}{' '}
                      <span className="font-mono text-[11px] font-normal text-[var(--color-text-dim)]">
                        · {worker.id}
                      </span>
                    </p>

                    <p className="truncate text-[12px] text-[var(--color-text-dim)]">
                      {worker.zoneName} · {worker.activity}
                    </p>
                  </div>

                  <StatusBadge
                    level={worker.riskLevel}
                    pulse
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Recent Alerts"
          eyebrow="Real-time feed"
          bodyClassName="p-0"
          action={
            <Link
              to="/alerts"
              className="flex items-center gap-1 text-[12px] font-medium text-[var(--color-accent)] hover:underline"
            >
              All alerts
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <ul className="divide-y divide-[var(--color-border-soft)]">
            {recentAlerts.map((alert) => (
              <li
                key={alert.id}
                className="px-5 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12.5px] font-medium text-white">
                    {alert.type}
                  </p>

                  <StatusBadge level={alert.level} />
                </div>

                <p className="mt-1 text-[11.5px] text-[var(--color-text-dim)]">
                  {alert.workerName} · {alert.zoneName} · {alert.time}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Recent incidents */}
      <Panel
        title="Recent Incidents"
        eyebrow="Logged for compliance"
        action={
          <Link
            to="/incidents"
            className="flex items-center gap-1 text-[12px] font-medium text-[var(--color-accent)] hover:underline"
          >
            Full history
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recentIncidents.map((incident) => (
            <div
              key={incident.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--color-text-dim)]">
                  {incident.id}
                </span>

                <StatusBadge level={incident.level} />
              </div>

              <p className="mt-2 text-[13px] font-semibold text-white">
                {incident.type}
              </p>

              <p className="mt-1 text-[11.5px] text-[var(--color-text-dim)]">
                {incident.workerName} · {incident.zoneName}
              </p>

              <p className="mt-1 font-mono text-[10.5px] text-[var(--color-text-faint)]">
                {incident.date} · {incident.time}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}