
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getSafetyAlerts,
  subscribeToSafetyAlerts,
  updateSafetyAlert,
} from '../lib/safetyAlerts'
import {
  AlertTriangle,
  Bell,
  Camera,
  CheckCircle2,
  Clock3,
  Download,
  Flame,
  Info,
  MapPin,
  Phone,
  Siren,
  Timer,
  Volume2,
  Wind,
} from 'lucide-react'

// ---------- CSV EXPORT HELPERS ----------
const csvCell = (value) => {
  let text = value == null ? '' : String(value)

  // Prevent spreadsheet formula injection.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`

  return `"${text.replace(/"/g, '""')}"`
}

function downloadCsv(rows, filename) {
  if (!rows.length) return

  const headers = Object.keys(rows[0])
  const csv = [
    headers.map(csvCell).join(','),
    ...rows.map((row) =>
      headers.map((header) => csvCell(row[header])).join(',')
    ),
  ].join('\r\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const severityOrder = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  safe: 4,
}

function getAlertTime(alert) {
  const value =
    alert.detectedAt || alert.createdAt || alert.timestamp || null

  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatAlertTime(alert) {
  const date = getAlertTime(alert)

  if (!date) return alert.time || 'Time unavailable'

  return (
    date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }) + ' IST'
  )
}

function normalizeAlert(alert) {
  const rawSeverity = String(alert.severity || 'medium').toLowerCase()
  const severity = ['critical', 'high', 'medium', 'low'].includes(rawSeverity)
    ? rawSeverity
    : 'medium'

  const location = alert.location || alert.where || 'Location unavailable'
  const title = alert.title || alert.detection || 'Safety event detected'

  return {
    ...alert,
    severity,
    location,
    title,
    cameraLabel:
      alert.cameraLabel || `CAM ${alert.cameraId ?? '—'}`,
    severityLabel:
      alert.severityLabel || `${severity.toUpperCase()} — SAFETY ALERT`,
    time: formatAlertTime(alert),
    what: alert.what || alert.details || title,
    where: alert.where || location,
    seriousness:
      alert.seriousness ||
      `${severity.toUpperCase()} risk detected. Verify the camera feed.`,
    directive:
      alert.directive ||
      'Verify the camera feed and follow the site safety procedure.',
    detection: alert.detection || title.toUpperCase(),
    extra: alert.extra || `Source: ${alert.source || 'Safety monitoring system'}`,
    telemetryLeft:
      alert.telemetryLeft || `Camera: ${alert.cameraId ?? '—'}`,
    telemetryRight:
      alert.telemetryRight ||
      (alert.acknowledged
        ? 'Acknowledged by operator'
        : 'Operator verification required'),
  }
}

export default function ActiveAlerts() {
  const navigate = useNavigate()

  const [severity, setSeverity] = useState('all')
  const [location, setLocation] = useState('all')
  const [sort, setSort] = useState('severity')
  const [alerts, setAlerts] = useState(() =>
    getSafetyAlerts()
      .filter((alert) => !alert.closed)
      .map(normalizeAlert)
  )

  // Subscribe to the shared alert store.
  useEffect(() => {
    const syncAlerts = () => {
      setAlerts(
        getSafetyAlerts()
          .filter((alert) => !alert.closed)
          .map(normalizeAlert)
      )
    }

    syncAlerts()
    return subscribeToSafetyAlerts(syncAlerts)
  }, [])

  const filteredAlerts = useMemo(() => {
    let result = [...alerts]

    if (severity === 'acknowledged') {
      result = result.filter((alert) => alert.acknowledged)
    } else if (severity !== 'all') {
      result = result.filter((alert) => alert.severity === severity)
    }

    if (location !== 'all') {
      result = result.filter((alert) =>
        String(alert.location || '')
          .toLowerCase()
          .includes(location.toLowerCase())
      )
    }

    if (sort === 'severity') {
      result.sort(
        (a, b) =>
          (severityOrder[a.severity] ?? 99) -
          (severityOrder[b.severity] ?? 99)
      )
    } else if (sort === 'recent') {
      result.sort(
        (a, b) =>
          (getAlertTime(b)?.getTime() || 0) -
          (getAlertTime(a)?.getTime() || 0)
      )
    }

    return result
  }, [alerts, severity, location, sort])

  const openCamera = (cameraId) => {
    if (cameraId == null) return
    navigate(`/camera?cam=${encodeURIComponent(cameraId)}`)
  }

  const acknowledgeAlert = (id) => {
    updateSafetyAlert(id, { acknowledged: true })
  }

  const acknowledgeHighs = () => {
    getSafetyAlerts()
      .filter(
        (alert) =>
          !alert.closed &&
          !alert.acknowledged &&
          ['critical', 'high'].includes(
            String(alert.severity || '').toLowerCase()
          )
      )
      .forEach((alert) => {
        updateSafetyAlert(alert.id, { acknowledged: true })
      })
  }

  const closeAlert = (id) => {
    updateSafetyAlert(id, {
      closed: true,
      acknowledged: true,
    })
  }

  const exportTriageCsv = () => {
    if (filteredAlerts.length === 0) return

    const rows = filteredAlerts.map((alert) => ({
      'Alert ID': alert.id,
      Severity: alert.severity.toUpperCase(),
      Status: alert.acknowledged ? 'Acknowledged' : 'Pending',
      Title: alert.title,
      Location: alert.location,
      Area: alert.area || alert.zone || '',
      Camera: alert.cameraLabel,
      Source: alert.source || 'unknown',
      Time: alert.time,
      'What Happened': alert.what,
      'How Serious': alert.seriousness,
      'Operator Directive': alert.directive,
      Detection: alert.detection,
    }))

    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
    downloadCsv(rows, `triage-alerts-${stamp}.csv`)
  }

  const criticalCount = alerts.filter(
    (alert) => alert.severity === 'critical'
  ).length

  const highCount = alerts.filter(
    (alert) => alert.severity === 'high'
  ).length

  const mediumCount = alerts.filter(
    (alert) => alert.severity === 'medium'
  ).length

  return (
    <div className="w-full space-y-5">
      {/* HEADER */}
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#64748b]">
            Operations Monitoring
            <span className="mx-2 text-slate-300">›</span>
            <span className="text-[#00288e]">
              Safety Intervention Queue
            </span>
          </p>

          <h1 className="mt-1 text-[25px] font-bold tracking-tight text-[#0b1c30]">
            Active Safety Alerts
          </h1>

          <p className="mt-1 text-[10px] text-[#64748b]">
            Safety alerts requiring operator verification and dispatch
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={acknowledgeHighs}
            className="rounded-lg bg-white px-3 py-2 text-[8px] font-semibold text-[#00288e] shadow-sm"
          >
            ✓ Acknowledge All Highs
          </button>

          <button
            onClick={exportTriageCsv}
            disabled={filteredAlerts.length === 0}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[8px] font-semibold text-[#334155] shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-3 w-3" />
            Export Triage CSV
          </button>

          <button
            type="button"
            disabled
            title="Connect a supported alarm integration to enable this action."
            className="flex items-center gap-1.5 rounded-lg bg-[#ffe1df] px-3 py-2 text-[8px] font-semibold text-[#93000a] opacity-75"
          >
            <Volume2 className="h-3 w-3" />
            Sound Master Horn
          </button>
        </div>
      </section>

      {/* KPI */}
      <section className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          title="Total Active"
          value={alerts.length}
          subtitle="In Queue"
          footer="Open safety alerts"
          icon={Bell}
        />

        <MetricCard
          title="Critical"
          value={criticalCount}
          subtitle="Immediate"
          footer="Critical hazards"
          icon={Flame}
          tone="red"
        />

        <MetricCard
          title="High Risk"
          value={highCount}
          subtitle="Urgent"
          footer="High-risk incidents"
          icon={AlertTriangle}
          tone="red"
        />

        <MetricCard
          title="Medium"
          value={mediumCount}
          subtitle="Caution"
          footer="Medium-risk incidents"
          icon={Info}
        />

        <MetricCard
          title="Acknowledged"
          value={alerts.filter((alert) => alert.acknowledged).length}
          subtitle="Reviewed"
          footer="Operator acknowledged"
          icon={CheckCircle2}
          tone="green"
        />

        <MetricCard
          title="Camera Coverage"
          value="60/60"
          subtitle=""
          footer="Configured camera streams"
          icon={Camera}
          tone="green"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* LEFT */}
        <div className="space-y-4 xl:col-span-9">
          {/* FILTER BAR */}
          <div className="flex flex-col justify-between gap-3 rounded-xl bg-white p-3 shadow-sm lg:flex-row lg:items-center">
            <div className="flex flex-wrap gap-1.5">
              <FilterButton
                label="All Alerts"
                count={alerts.length}
                active={severity === 'all'}
                onClick={() => setSeverity('all')}
              />

              <FilterButton
                label="Critical"
                count={criticalCount}
                active={severity === 'critical'}
                onClick={() => setSeverity('critical')}
              />

              <FilterButton
                label="High Risk"
                count={highCount}
                active={severity === 'high'}
                onClick={() => setSeverity('high')}
              />

              <FilterButton
                label="Medium"
                count={mediumCount}
                active={severity === 'medium'}
                onClick={() => setSeverity('medium')}
              />

              <FilterButton
                label="Acknowledged"
                count={alerts.filter((alert) => alert.acknowledged).length}
                active={severity === 'acknowledged'}
                onClick={() => setSeverity('acknowledged')}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="rounded-lg bg-[#eff4ff] px-3 py-2 text-[8px] font-semibold text-[#334155] outline-none"
              >
                <option value="all">All Plant Locations</option>
                <option value="Track Hopper">Track Hopper &amp; Pit</option>
                <option value="Crusher House">Crusher House -1</option>
                <option value="Bunker">Unit 6 Bunker Catwalks</option>
                <option value="Transfer Point">Transfer Points</option>
              </select>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-lg bg-[#eff4ff] px-3 py-2 text-[8px] font-semibold text-[#334155] outline-none"
              >
                <option value="severity">Sort: Highest Severity</option>
                <option value="recent">Sort: Most Recent</option>
              </select>
            </div>
          </div>

          {filteredAlerts.map((alert, index) => (
  <AlertCard
    key={`${String(alert.id ?? 'alert')}-${index}`}
    alert={alert}
    onOpenCamera={() => openCamera(alert.cameraId)}
    onAcknowledge={() => acknowledgeAlert(alert.id)}
    onClose={() => closeAlert(alert.id)}
  />
))}

          {filteredAlerts.length === 0 && (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
              <CheckCircle2 className="mx-auto h-8 w-8 text-[#00a36c]" />
              <p className="mt-3 text-[11px] font-semibold text-[#334155]">
                No alerts in this category
              </p>
              <p className="mt-1 text-[9px] text-[#64748b]">
                New alerts will appear here when they are added to the safety alert store.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <aside className="space-y-4 xl:col-span-3">
          <SideCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#93000a]">
                <Timer className="h-4 w-4" />
                <span className="text-[8px] font-bold uppercase">
                  Escalation Rule Engine
                </span>
              </div>
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#00a36c]" />
            </div>

            <div className="mt-3 rounded-lg bg-[#fff0ef] p-3">
              <div className="flex justify-between text-[7px] font-bold text-[#ba1a1a]">
                <span>Critical SLA</span>
                <span>Operator verification</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#dce9ff]">
                <div className="h-full w-[78%] rounded-full bg-[#ba1a1a]" />
              </div>

              <p className="mt-2 text-[7px] leading-3 text-[#536174]">
                Verify critical alerts promptly and follow the site's approved
                escalation procedure. The displayed progress is illustrative,
                not a live countdown.
              </p>
            </div>
          </SideCard>

          <SideCard>
            <h3 className="text-[9px] font-bold uppercase text-[#334155]">
              Emergency Escalation Contacts
            </h3>

            <div className="mt-3 space-y-2">
              <Contact
                initials="CHP"
                title="CHP Shift In-Charge"
                sub="Desk 1 · Coal Handling"
                number="4402"
              />

              <Contact
                initials="FIRE"
                title="Plant Fire Station"
                sub="Emergency Hot Line"
                number="101"
                danger
              />

              <Contact
                initials="MED"
                title="Chief Safety Officer"
                sub="Site Safety Command"
                number="4108"
              />

              <Contact
                initials="MED"
                title="Plant First-Aid Centre"
                sub="Ambulance Bay #2"
                number="4199"
              />
            </div>
          </SideCard>

          <SideCard>
            <h3 className="text-[9px] font-bold text-[#334155]">
              4-Step Triage SOP
            </h3>

            <div className="mt-3 space-y-3">
              <SopStep
                number="1"
                title="Observe"
                text="Verify the alert against the available camera feed."
              />
              <SopStep
                number="2"
                title="Localize"
                text="Confirm the camera, location, and affected area."
              />
              <SopStep
                number="3"
                title="Acknowledge"
                text="Record that an operator has reviewed the alert."
              />
              <SopStep
                number="4"
                title="Dispatch"
                text="Follow the approved site procedure for the confirmed hazard."
              />
            </div>
          </SideCard>

          <SideCard>
            <h3 className="text-[9px] font-bold uppercase text-[#334155]">
              Active Plant UHF Radios
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                ['CH 1', 'CHP Primary'],
                ['CH 2', 'Crusher Ops'],
                ['CH 3', 'Bunker Super'],
                ['CH 4', 'Fire / Rescue'],
              ].map(([channel, name]) => (
                <div key={channel} className="rounded-lg bg-[#eff4ff] p-2">
                  <p className="text-[6px] font-bold text-[#64748b]">
                    {channel}
                  </p>
                  <p className="mt-1 text-[7px] font-semibold text-[#00288e]">
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </SideCard>
        </aside>
      </section>
    </div>
  )
}

function MetricCard({ title, value, subtitle, footer, icon: Icon, tone }) {
  const valueClass =
    tone === 'red'
      ? 'text-[#ba1a1a]'
      : tone === 'green'
        ? 'text-[#00714e]'
        : 'text-[#0b1c30]'

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span
          className={`text-[7px] font-bold uppercase ${
            tone === 'red' ? 'text-[#ba1a1a]' : 'text-[#64748b]'
          }`}
        >
          {title}
        </span>
        <Icon
          className={`h-4 w-4 ${
            tone === 'red'
              ? 'text-[#ba1a1a]'
              : tone === 'green'
                ? 'text-[#00a36c]'
                : 'text-[#00288e]'
          }`}
        />
      </div>

      <div className="mt-2 flex items-end gap-2">
        <p className={`text-[27px] font-bold leading-none ${valueClass}`}>
          {value}
        </p>
        <span className={`text-[7px] font-semibold ${valueClass}`}>
          {subtitle}
        </span>
      </div>

      <p className="mt-2 truncate text-[7px] text-[#7b8798]">{footer}</p>
    </div>
  )
}

function FilterButton({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[8px] font-semibold ${
        active
          ? 'bg-[#00288e] text-white'
          : 'bg-[#eff4ff] text-[#334155]'
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[6px] font-bold ${
          active ? 'bg-white/20 text-white' : 'bg-white text-[#334155]'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function AlertCard({ alert, onOpenCamera, onAcknowledge, onClose }) {
  const critical = alert.severity === 'critical'
  const high = alert.severity === 'high'

  const sideColor = critical
    ? 'bg-[#ba1a1a]'
    : high
      ? 'bg-[#9b000d]'
      : 'bg-[#00a36c]'

  const badge = critical || high
    ? 'bg-[#ffe1df] text-[#93000a]'
    : 'bg-[#e5eeff] text-[#334155]'

  return (
    <article className="relative overflow-hidden rounded-xl bg-white shadow-sm">
      <div className={`absolute bottom-0 left-0 top-0 w-1.5 ${sideColor}`} />

      <div className="space-y-4 p-4 pl-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[7px] font-bold ${badge}`}>
              {alert.severityLabel}
            </span>

            <span className="flex items-center gap-1 text-[7px] text-[#64748b]">
              <Clock3 className="h-3 w-3" />
              {alert.time}
            </span>

            <span className="rounded-full bg-[#eff4ff] px-2 py-1 text-[6px] text-[#334155]">
              ID: {alert.id}
            </span>
          </div>

          {alert.acknowledged ? (
            <span className="rounded-full bg-[#dcf7e8] px-2.5 py-1 text-[7px] font-bold text-[#00714e]">
              ✓ Acknowledged
            </span>
          ) : (
            <span
              className={`rounded-lg px-2.5 py-1 text-[7px] font-semibold ${
                critical
                  ? 'bg-[#ba1a1a] text-white'
                  : 'bg-[#e5eeff] text-[#536174]'
              }`}
            >
              Pending Operator Verification
            </span>
          )}
        </div>

        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
          <h2 className="text-[16px] font-bold text-[#0b1c30]">
            {alert.title}
          </h2>
          <span className="flex items-center gap-1 text-[8px] text-[#536174]">
            <MapPin className="h-3.5 w-3.5" />
            {alert.location}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Alert evidence */}
          <div className="relative min-h-[200px] overflow-hidden rounded-lg bg-[#111827] lg:col-span-5">
            {alert.image || alert.evidenceUrl ? (
              <img
                src={alert.image || alert.evidenceUrl}
                alt={alert.title || 'Safety alert evidence'}
                className="h-full min-h-[200px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[200px] items-center justify-center text-sm text-white">
                <Camera className="mr-2 h-5 w-5" />
                Camera Alert
              </div>
            )}

            <div className="absolute inset-0 flex flex-col justify-between p-3">
              <div className="flex justify-between gap-2">
                <span className="rounded bg-white/90 px-2 py-1 text-[7px] font-bold text-[#0b1c30]">
                  {alert.cameraLabel}
                </span>
                <span className="rounded bg-black/70 px-2 py-1 text-[7px] font-bold text-white">
                  {alert.source === 'ai' ? 'AI DETECTION' : 'DEMO / TEST EVENT'}
                </span>
              </div>

              <div
                className={`mx-auto flex h-24 w-[60%] items-start border-2 p-1 ${
                  critical
                    ? 'border-[#ef4444] bg-red-500/10'
                    : high
                      ? 'border-[#d97706] bg-orange-500/10'
                      : 'border-[#00a36c] bg-emerald-500/10'
                }`}
              >
                <span
                  className={`w-fit px-1.5 py-0.5 text-[6px] font-bold text-white ${
                    critical
                      ? 'bg-[#ef4444]'
                      : high
                        ? 'bg-[#d97706]'
                        : 'bg-[#00714e]'
                  }`}
                >
                  {alert.detection}
                </span>
              </div>

              <div className="rounded bg-black/70 px-2 py-1 text-[7px] text-white">
                {alert.extra}
              </div>
            </div>
          </div>

          {/* ANALYSIS */}
          <div className="flex flex-col justify-between rounded-lg bg-[#eff4ff] p-3 lg:col-span-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Question number="1" title="What Happened?" text={alert.what} />
              <Question number="2" title="Where Did It Happen?" text={alert.where} />
              <Question
                number="3"
                title="How Serious Is It?"
                text={alert.seriousness}
                danger={critical || high}
              />
              <Question
                number="4"
                title="Operator Directive"
                text={alert.directive}
              />
            </div>

            <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-[#dce6f7] pt-2 text-[7px] text-[#536174]">
              <span>{alert.telemetryLeft}</span>
              <span
                className={
                  critical || high
                    ? 'font-bold text-[#ba1a1a]'
                    : 'font-bold text-[#00714e]'
                }
              >
                {alert.telemetryRight}
              </span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onOpenCamera}
              disabled={alert.cameraId == null}
              className="flex items-center gap-1.5 rounded-lg bg-[#00288e] px-3 py-2 text-[8px] font-semibold text-white disabled:opacity-50"
            >
              <Camera className="h-3.5 w-3.5" />
              View Camera &amp; PTZ
            </button>

            {critical && (
              <button
                type="button"
                title="Connect an approved control integration to enable this action."
                className="flex items-center gap-1.5 rounded-lg bg-[#700006] px-3 py-2 text-[8px] font-semibold text-white"
              >
                <Wind className="h-3.5 w-3.5" />
                Activate Water Deluge
              </button>
            )}

            {high && (
              <button
                type="button"
                title="Connect an approved alarm integration to enable this action."
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[8px] font-semibold text-[#93000a] shadow-sm"
              >
                <Siren className="h-3.5 w-3.5" />
                Sound Boundary Siren
              </button>
            )}

            {!alert.acknowledged && (
              <button
                onClick={onAcknowledge}
                className="rounded-lg bg-[#dce9ff] px-3 py-2 text-[8px] font-semibold text-[#334155]"
              >
                Acknowledge Alert
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-lg bg-[#dce9ff] px-3 py-2 text-[8px] font-semibold text-[#334155]"
            >
              Close Alert
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function Question({ number, title, text, danger }) {
  return (
    <div>
      <p className="text-[6px] font-bold uppercase tracking-[0.08em] text-[#8791a0]">
        {number}. {title}
      </p>
      <p
        className={`mt-1 text-[8px] leading-4 ${
          danger ? 'font-semibold text-[#93000a]' : 'text-[#25364d]'
        }`}
      >
        {text}
      </p>
    </div>
  )
}

function SideCard({ children }) {
  return <div className="rounded-xl bg-white p-4 shadow-sm">{children}</div>
}

function Contact({ initials, title, sub, number, danger }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[#eff4ff] p-2.5">
      <div className="flex items-center gap-2">
        <div
          className={`grid h-8 w-8 place-items-center rounded-lg text-[6px] font-bold ${
            danger
              ? 'bg-[#ffe1df] text-[#ba1a1a]'
              : 'bg-[#dce9ff] text-[#00288e]'
          }`}
        >
          {initials}
        </div>
        <div>
          <p className="text-[7px] font-bold text-[#334155]">{title}</p>
          <p className="text-[6px] text-[#7b8798]">{sub}</p>
        </div>
      </div>

      <a
        href={`tel:${number}`}
        className={`flex items-center gap-1 rounded px-2 py-1 text-[6px] font-bold text-white ${
          danger ? 'bg-[#ba1a1a]' : 'bg-[#00288e]'
        }`}
      >
        <Phone className="h-2.5 w-2.5" />
        {number}
      </a>
    </div>
  )
}

function SopStep({ number, title, text }) {
  return (
    <div className="flex gap-2">
      <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#e5eeff] text-[7px] font-bold text-[#00288e]">
        {number}
      </div>
      <div>
        <p className="text-[7px] font-bold text-[#334155]">{title}</p>
        <p className="mt-0.5 text-[6.5px] leading-3 text-[#7b8798]">
          {text}
        </p>
      </div>
    </div>
  )
}
