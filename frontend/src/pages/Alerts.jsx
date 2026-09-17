import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Bell,
  Camera,
  CheckCircle2,
  Clock3,
  Download,
  Flame,
  Footprints,
  HardHat,
  Info,
  MapPin,
  Phone,
  Radio,
  ShieldAlert,
  Siren,
  Timer,
  Users,
  Volume2,
  Wind,
} from 'lucide-react'

const ALERTS = [
  {
    id: 'ALT-2026-0912-8801',
    cameraId: '60',
    cameraLabel: 'CAM 60',
    severity: 'critical',
    severityLabel: 'CRITICAL — IMMEDIATE ACTION REQUIRED',
    time: '2m ago (14:33:04 IST)',
    title: 'Smoldering Coal / High Heat & Smoke Detected',
    location: 'Track Hopper 02 — Coal Train Unloading Pit',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_1AkiJ2TgyF9zQLkga3wI4u5unvHMaxe2HlclVOm7NgXfJbASX87danQx_-jv75jPqQ0vYcrKp1B-UUlU-xFlEs88kx1-dcLETgnz6wSB6OPKhecpI2bGrZlG84nfcO9uBA7AHFtS7fBBUPdGlc6gYOQtpammiWc9w4qzmqJEdO_2CXRWNtipef_jiLiZ_SUq4qkb41nG2B7PjNjwgrXD-aKT_ZknFkLVYeRS_LRmdN38GEZ9zo8MCg',
    what:
      'Thermal optical sensor detected continuous thermal radiation (182°C) and visible smoke plume accumulating in Coal Discharge Hopper #2.',
    where:
      'CAM 60 (Tender No 60) • Track Hopper 02 Coal Train Unloading Pit • JB No: 1.',
    seriousness:
      'CRITICAL HAZARD — Immediate risk of rapid spontaneous combustion and airborne coal dust explosion in confined pit.',
    directive:
      'Verify CCTV feed, trigger Deluge Water Spray System immediately, and dispatch Fire Marshal via Emergency Ext. 101.',
    detection: 'SMOKE / THERMAL DETECTED 99.4%',
    extra: '182°C SURFACE HOTSPOT',
    telemetryLeft: 'Combustion Sensor: TH-PT-04 (Alarm Triggered)',
    telemetryRight: 'HOTSPOT: +42°C/min RATE',
    acknowledged: false,
  },

  {
    id: 'ALT-2026-0912-8798',
    cameraId: '06',
    cameraLabel: 'CAM 06',
    severity: 'high',
    severityLabel: 'HIGH RISK — SAFETY BOUNDARY BREACH',
    time: '4m ago (14:31:12 IST)',
    title: 'Person in Restricted Rotating Machinery Zone',
    location: 'Crusher House -1, Drive End Conveyor 2 A/B',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATrQr3ckm53cS_b7htbhSqcgJts3Phcq-lz4r-lajPlBL2dM6Z9D_uL0IDxcKTiLnXTRnqvDl6SIvTKMZtsXl_Y5j5M-7JSNy-xzbx3sgv7jDNW8_tRLjbPhwn82R3Yj3iNdISi7itBAz4Tu5w2AXBJpPnYHMzIbTWNGISsQAnwkBbDNdPAn4DzWGtgqycd2ur4wGf-eINcCJkgvIU8EwCKkdIjU1xtWKwskQLNXR6pQ1qHRNJwd8ABg',
    what:
      'Unauthorized personnel crossed yellow laser safety perimeter into high-risk rotating belt drive zone while conveyor was active.',
    where:
      'CAM 06 (Tender No 6) • Conveyor 2 A/B DE (Crusher house -1) • JB No: 1.',
    seriousness:
      'High Risk — Moving machinery entrapment hazard; severe limb/crush vulnerability within 1.2m of nip point.',
    directive:
      'Trigger localized Boundary Horn, announce immediate evacuation over Crusher House PA, and dispatch floor patrol.',
    detection: 'RESTRICTED ZONE 98.2%',
    extra: 'Conveyor Drive State: RUNNING',
    telemetryLeft: 'Interlock Status: Ready for Emergency Trip',
    telemetryRight: 'Siren Speaker: Horn #04 Standby',
    acknowledged: false,
  },

  {
    id: 'ALT-2026-0912-8789',
    cameraId: '44',
    cameraLabel: 'CAM 44',
    severity: 'high',
    severityLabel: 'HIGH RISK — PPE MANDATORY BREACH',
    time: '8m ago (14:27:30 IST)',
    title: 'Worker Operating Without Safety Helmet',
    location: 'Unit 6 Bunker 17 B',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCE0RRD5PqA67gctojCh0Is0D9N4cmnDUcT3dp5XtZ0PYvE5munZ-vo5enKYa8-hAkY7yXrwJSAFvsqm44FxtqKToSnEDKj-y8jzlomf_SO8_sVyQN0yD-PPf1BbA9U0yEJ6oydLUCdjr-41aldErzk79jsCGEJEVp8_l6HgR0K1DKya6xljy4u5_RphZ6gBQOzhtrnbESOe4fPSodcK9rLfGtLdh6_aq6W09sKmO8YQq6nVm0NF1h2lw',
    what:
      'Field technician detected at height catwalk without mandatory type-1 hardhat safety head protection.',
    where:
      'CAM 44 (Tender No 44) • Unit 6 Bunker 17 B floor catwalk.',
    seriousness:
      'High Risk — Overhead falling coal clinker and structural bolt hazard on bunker floor.',
    directive:
      'Issue automated push notification to Bunker Supervisor and file non-conformance log.',
    detection: 'NO HELMET 96.4%',
    extra: 'Confidence: HIGH · PPE Compliance',
    telemetryLeft: 'Contract Agency: Tri-Tech Industrial Services',
    telemetryRight: 'Supervisor Notified',
    acknowledged: true,
  },

  {
    id: 'ALT-2026-0912-8772',
    cameraId: '25',
    cameraLabel: 'CAM 25',
    severity: 'medium',
    severityLabel: 'MEDIUM WARNING — PPE INCOMPLETE',
    time: '15m ago (14:20:10 IST)',
    title: 'Non-Compliant Footwear Detected',
    location: 'Conveyor 18 A/B Middle (Steel Gantry)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDYdWB-P5AS7jE_Y8yHCaOEVDmKX7kgCiXhXJroLw-41IZW0wJOEzQOsMbMNACqPSinDXMoH0WwqEk3qUGJKtb7BTo-NnkfLWEtfvQEXBbKjZlWJejvPd4otmz4u7tMYwF_GML9Jdp4cJu6aSqmZ9OFx1-sE0lQHItXRiZ8ULChaL_fHlJBEW3d_qsoEtoFHjMNl7UR55bYVDsHMPuGy4c6ECqh9SN_OsjHux6WvRHD4s0lbVH6iQfIGw',
    what:
      'Contract technician observed in active conveyor gantry wearing soft canvas shoes instead of steel-toe boots.',
    where:
      'CAM 25 (Tender No 25) • TH-2 conveyor 18 A/B CHANDI AREA • JB No: 1.',
    seriousness:
      'Medium Warning — Foot puncture or crush risk on serrated industrial steel floor grating.',
    directive:
      'Tag worker ID on security gate terminal for safety briefing upon shift exit.',
    detection: 'NO SAFETY SHOES 92%',
    extra: 'Object: Soft Athletic Footwear',
    telemetryLeft: 'Gate Marshal Desk: Station 2',
    telemetryRight: 'Auto-Logged to Incident Diary',
    acknowledged: false,
  },

  {
    id: 'ALT-2026-0912-8761',
    cameraId: '04',
    cameraLabel: 'CAM 04',
    severity: 'medium',
    severityLabel: 'MEDIUM WARNING — ENVIRONMENTAL DUST',
    time: '26m ago (14:09:44 IST)',
    title: 'Minor Dust Cloud / Mist Accumulation',
    location: 'Transfer Point 1 (Conveyor 2 A/B TE Chute)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlN44PGQcG5rD4mG36IU_rP_D9de06b0VGFOx0g1wO18B9bDWFUv-yUynpxFvzDrKiyknaWg-pp1BAfBtKn85qbTRjtUzHq0tcONZc2EBmZWZai0bK2Vq_3HCSBYmiptgkIpNO1fzlhXX8t_biD1SXCOjpD_CtEudEnCAh3RsUWbxIC4Jcy8LyD7m9iSeoH__44AuHcvV7TX1Mop6Awb66yizNoPUL94sHL_B1y7ztWxtVLoZq7vHcNQ',
    what:
      'Particulate density sensor and optical haze algorithm identified diffuse coal dust accumulation near transfer chute.',
    where:
      'CAM 04 • Conveyor 2 A/B TE (TP-1).',
    seriousness:
      'Medium Warning — Airborne dust threshold elevation with potential visibility reduction.',
    directive:
      'Maintain automated high-pressure mist cycle and check skirt mechanical clamp during next scheduled belt stop.',
    detection: 'DUST / MIST THRESHOLD',
    extra: 'Misting Sprayers Active',
    telemetryLeft: 'Mist System #01: ACTIVE',
    telemetryRight: 'Dust Density Falling (-14%)',
    acknowledged: false,
  },
]

export default function ActiveAlerts() {
  const navigate = useNavigate()

  const [severity, setSeverity] = useState('all')
  const [location, setLocation] = useState('all')
  const [sort, setSort] = useState('severity')
  const [alerts, setAlerts] = useState(ALERTS)

  const filteredAlerts = useMemo(() => {
    let result = [...alerts]

    if (severity !== 'all') {
      if (severity === 'acknowledged') {
        result = result.filter((alert) => alert.acknowledged)
      } else {
        result = result.filter((alert) => alert.severity === severity)
      }
    }

    if (location !== 'all') {
      result = result.filter((alert) =>
        alert.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (sort === 'severity') {
      const order = {
        critical: 0,
        high: 1,
        medium: 2,
      }

      result.sort(
        (a, b) =>
          order[a.severity] - order[b.severity]
      )
    }

    return result
  }, [alerts, severity, location, sort])

  const openCamera = (cameraId) => {
    navigate(`/camera?cam=${cameraId}`)
  }

  const acknowledgeAlert = (id) => {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              acknowledged: true,
            }
          : alert
      )
    )
  }

  const acknowledgeHighs = () => {
    setAlerts((current) =>
      current.map((alert) =>
        alert.severity === 'critical' ||
        alert.severity === 'high'
          ? {
              ...alert,
              acknowledged: true,
            }
          : alert
      )
    )
  }

  const closeAlert = (id) => {
    setAlerts((current) =>
      current.filter((alert) => alert.id !== id)
    )
  }

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
            Real-time detection alerts requiring immediate operator verification
            and dispatch
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={acknowledgeHighs}
            className="rounded-lg bg-white px-3 py-2 text-[8px] font-semibold text-[#00288e] shadow-sm"
          >
            ✓ Acknowledge All Highs
          </button>

          <button className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[8px] font-semibold text-[#334155] shadow-sm">
            <Download className="h-3 w-3" />
            Export Triage CSV
          </button>

          <button
            disabled
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
          footer="Plant Units 1–6"
          icon={Bell}
        />

        <MetricCard
          title="Critical"
          value={alerts.filter((a) => a.severity === 'critical').length}
          subtitle="Immediate"
          footer="Smoldering Coal Hotspot"
          icon={Flame}
          tone="red"
        />

        <MetricCard
          title="High Risk"
          value={alerts.filter((a) => a.severity === 'high').length}
          subtitle="Urgent"
          footer="Boundary & PPE Breach"
          icon={AlertTriangle}
          tone="red"
        />

        <MetricCard
          title="Medium"
          value={alerts.filter((a) => a.severity === 'medium').length}
          subtitle="Caution"
          footer="Footwear & Dust Spurt"
          icon={Info}
        />

        <MetricCard
          title="Mean Triage"
          value="42"
          subtitle="sec"
          footer="Target: < 90s SLA"
          icon={Timer}
          tone="green"
        />

        <MetricCard
          title="AI Coverage"
          value="60/60"
          subtitle=""
          footer="All Streams Operational"
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
                count={alerts.filter((a) => a.severity === 'critical').length}
                active={severity === 'critical'}
                onClick={() => setSeverity('critical')}
              />

              <FilterButton
                label="High Risk"
                count={alerts.filter((a) => a.severity === 'high').length}
                active={severity === 'high'}
                onClick={() => setSeverity('high')}
              />

              <FilterButton
                label="Medium"
                count={alerts.filter((a) => a.severity === 'medium').length}
                active={severity === 'medium'}
                onClick={() => setSeverity('medium')}
              />

              <FilterButton
                label="Acknowledged"
                count={alerts.filter((a) => a.acknowledged).length}
                active={severity === 'acknowledged'}
                onClick={() => setSeverity('acknowledged')}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-lg bg-[#eff4ff] px-3 py-2 text-[8px] font-semibold text-[#334155] outline-none"
              >
                <option value="all">
                  All Plant Locations
                </option>

                <option value="Track Hopper">
                  Track Hopper & Pit
                </option>

                <option value="Crusher House">
                  Crusher House -1
                </option>

                <option value="Bunker">
                  Unit 6 Bunker Catwalks
                </option>

                <option value="Transfer Point">
                  Transfer Points
                </option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg bg-[#eff4ff] px-3 py-2 text-[8px] font-semibold text-[#334155] outline-none"
              >
                <option value="severity">
                  Sort: Highest Severity
                </option>

                <option value="recent">
                  Sort: Most Recent
                </option>
              </select>
            </div>
          </div>

          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
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
                <span>Critical SLA Timer</span>
                <span>00:56 remaining</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#dce9ff]">
                <div className="h-full w-[78%] rounded-full bg-[#ba1a1a]" />
              </div>

              <p className="mt-2 text-[7px] leading-3 text-[#536174]">
                Critical hazards unacknowledged past 3 minutes automatically
                page the Plant Superintendent & CHP Shift In-Charge.
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
                text="Confirm anomaly via secondary PTZ angle and check thermal baseline."
              />

              <SopStep
                number="2"
                title="Localize"
                text="Cross-reference tender camera code with junction box and zone logs."
              />

              <SopStep
                number="3"
                title="Acknowledge"
                text="Stop escalation SLA countdown within 90 seconds."
              />

              <SopStep
                number="4"
                title="Dispatch"
                text="Execute automated deluge, siren warning, or field patrol."
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
                <div
                  key={channel}
                  className="rounded-lg bg-[#eff4ff] p-2"
                >
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

function MetricCard({
  title,
  value,
  subtitle,
  footer,
  icon: Icon,
  tone,
}) {
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
            tone === 'red'
              ? 'text-[#ba1a1a]'
              : 'text-[#64748b]'
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

      <p className="mt-2 truncate text-[7px] text-[#7b8798]">
        {footer}
      </p>
    </div>
  )
}

function FilterButton({
  label,
  count,
  active,
  onClick,
}) {
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
          active
            ? 'bg-white/20 text-white'
            : 'bg-white text-[#334155]'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function AlertCard({
  alert,
  onOpenCamera,
  onAcknowledge,
  onClose,
}) {
  const critical = alert.severity === 'critical'
  const high = alert.severity === 'high'

  const sideColor =
    critical
      ? 'bg-[#ba1a1a]'
      : high
        ? 'bg-[#9b000d]'
        : 'bg-[#00a36c]'

  const badge =
    critical
      ? 'bg-[#ffe1df] text-[#93000a]'
      : high
        ? 'bg-[#ffe1df] text-[#9b000d]'
        : 'bg-[#e5eeff] text-[#334155]'

  return (
    <article className="relative overflow-hidden rounded-xl bg-white shadow-sm">
      <div className={`absolute bottom-0 left-0 top-0 w-1.5 ${sideColor}`} />

      <div className="space-y-4 p-4 pl-5">

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[7px] font-bold ${badge}`}
            >
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
          ) : critical ? (
            <span className="animate-pulse rounded-lg bg-[#ba1a1a] px-2.5 py-1 text-[7px] font-bold text-white">
              Auto-Escalate in 56s
            </span>
          ) : (
            <span className="rounded-full bg-[#e5eeff] px-2.5 py-1 text-[7px] font-semibold text-[#536174]">
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

          {/* IMAGE */}
          <div className="relative min-h-[200px] overflow-hidden rounded-lg bg-[#111827] lg:col-span-5">
            <img
              src={alert.image}
              alt={alert.title}
              className="h-full min-h-[200px] w-full object-cover"
            />

            <div className="absolute inset-0 flex flex-col justify-between p-3">
              <div className="flex justify-between gap-2">
                <span className="rounded bg-white/90 px-2 py-1 text-[7px] font-bold text-[#0b1c30]">
                  {alert.cameraLabel}
                </span>

                <span
                  className={`rounded px-2 py-1 text-[7px] font-bold text-white ${
                    critical
                      ? 'bg-[#ba1a1a]'
                      : high
                        ? 'bg-[#9b000d]'
                        : 'bg-[#00714e]'
                  }`}
                >
                  LIVE AI FEED
                </span>
              </div>

              <div
                className={`mx-auto flex h-24 w-[60%] flex-col justify-between border-2 p-1 ${
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
              <Question
                number="1"
                title="What Happened?"
                text={alert.what}
              />

              <Question
                number="2"
                title="Where Did It Happen?"
                text={alert.where}
              />

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
                  critical
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
              className="flex items-center gap-1.5 rounded-lg bg-[#00288e] px-3 py-2 text-[8px] font-semibold text-white"
            >
              <Camera className="h-3.5 w-3.5" />
              View Camera & PTZ
            </button>

            {critical && (
              <button className="flex items-center gap-1.5 rounded-lg bg-[#700006] px-3 py-2 text-[8px] font-semibold text-white">
                <Wind className="h-3.5 w-3.5" />
                Activate Water Deluge
              </button>
            )}

            {high && (
              <button className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[8px] font-semibold text-[#93000a] shadow-sm">
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

            {alert.severity === 'medium' && (
              <button
                onClick={onClose}
                className="rounded-lg bg-[#dce9ff] px-3 py-2 text-[8px] font-semibold text-[#334155]"
              >
                Close Alert
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function Question({
  number,
  title,
  text,
  danger,
}) {
  return (
    <div>
      <p className="text-[6px] font-bold uppercase tracking-[0.08em] text-[#8791a0]">
        {number}. {title}
      </p>

      <p
        className={`mt-1 text-[8px] leading-4 ${
          danger
            ? 'font-semibold text-[#93000a]'
            : 'text-[#25364d]'
        }`}
      >
        {text}
      </p>
    </div>
  )
}

function SideCard({ children }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      {children}
    </div>
  )
}

function Contact({
  initials,
  title,
  sub,
  number,
  danger,
}) {
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
          <p className="text-[7px] font-bold text-[#334155]">
            {title}
          </p>

          <p className="text-[6px] text-[#7b8798]">
            {sub}
          </p>
        </div>
      </div>

      <a
        href={`tel:${number}`}
        className={`flex items-center gap-1 rounded px-2 py-1 text-[6px] font-bold text-white ${
          danger
            ? 'bg-[#ba1a1a]'
            : 'bg-[#00288e]'
        }`}
      >
        <Phone className="h-2.5 w-2.5" />
        {number}
      </a>
    </div>
  )
}

function SopStep({
  number,
  title,
  text,
}) {
  return (
    <div className="flex gap-2">
      <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#e5eeff] text-[7px] font-bold text-[#00288e]">
        {number}
      </div>

      <div>
        <p className="text-[7px] font-bold text-[#334155]">
          {title}
        </p>

        <p className="mt-0.5 text-[6.5px] leading-3 text-[#7b8798]">
          {text}
        </p>
      </div>
    </div>
  )
}