import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Camera,
  CheckCircle2,
  Flame,
  Footprints,
  HardHat,
  Server,
  ShieldCheck,
  UserRoundCheck,
  VideoOff,
  WifiOff,
} from 'lucide-react'

const cameras = [
  {
    id: 'CAM-01',
    name: 'Crusher House - Conveyor 3 A/B TE',
    area: 'Crusher House',
    status: 'safe',
    message: 'SAFE — No Safety Issues',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlN44PGQcG5rD4mG36IU_rP_D9de06b0VGFOx0g1wO18B9bDWFUv-yUynpxFvzDrKiyknaWg-pp1BAfBtKn85qbTRjtUzHq0tcONZc2EBmZWZai0bK2Vq_3HCSBYmiptgkIpNO1fzlhXX8t_biD1SXCOjpD_CtEudEnCAh3RsUWbxIC4Jcy8LyD7m9iSeoH__44AuHcvV7TX1Mop6Awb66yizNoPUL94sHL_B1y7ztWxtVLoZq7vHcNQ',
    fps: '60 FPS',
    latency: '24ms',
  },
  {
    id: 'CAM-12',
    name: 'Track Hopper 02 (Unloading)',
    area: 'Coal Train Bay',
    status: 'critical',
    message: 'CRITICAL — Smoke / Heat Warning',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDJEVxILO3FdNeDhVEzIQ6XMhsct8VIFDoKiLo-elfATs4Mj4-mpN6pV7uALelkYmxufD0qPkVHvVZSZxMAbZQHbJshyKVLayuDLBH9QoaF1ad4MEQlWT6yczbKSnhWk9en-jJthihjUFiTzAG_9aCkfMUBjL8SxfeZmDlP8K2ij26B0EKaqUGvfHUK_kELqVaZI8AIcNIgZzatiJFfCcUB2Gxv58B09l0J9ONAEUTH0NbbqbXvNzCg8w',
    fps: '59 FPS',
    latency: '19ms',
    box: {
      label: 'SMOKE DETECTED — 98.2%',
      className: 'left-[13%] top-[23%] h-[35%] w-[46%]',
    },
  },
  {
    id: 'CAM-34',
    name: 'Unit 6 Bunker 17 B',
    area: 'Conveyor 17 B DE',
    status: 'high',
    message: 'HIGH — Missing Helmet Detected',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCeFUhM54vRFaEz1NMscOSi9yDs77Fj6QryiGVsmvMkoqQddvDwuqjSBTG0PmM6GGOIgcZFLgppuecx_WaMWj3ZhulhiQTiu8TjlbrQhcTF1lwURhs-qSnv-yAYZsuTVzSeYcc4Yb__XoTXiNzgv7a72zrHb3yN28ojawP3COzuz8fcxfsYSfMLf8vChaRGRVhnYBCoMO54UfwdzLE5iZUDZXD7YbBnWwQjbMC8wPXYWIUfor6PyO33-w',
    fps: '60 FPS',
    latency: '22ms',
    box: {
      label: 'NO HELMET — 94.6%',
      className: 'left-[35%] top-[18%] h-[52%] w-[25%]',
    },
  },
  {
    id: 'CAM-04',
    name: 'Conveyor 2 A/B DE (Crusher -1)',
    area: 'Crusher House -1',
    status: 'high',
    message: 'HIGH — Restricted Zone Entry',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhLveQm1DAN9YYX_boN00xDVRNX6k8J5KCuDTMRpCAFbz9ZPY8BJC_NmysKcivqIk9G5H8L29_pDzEzKHiHCtMMHrkQUe6uaCOYtUBQFkpfJTu0y1zJyFg8-vm8D96oE5cUqzcqT6muIeG6oDUbGlUtxDf1_cBiBeVUmlCNBpC0jiNSsQo-qbKUu_f8cmZSHZquWHv-NQ6M247Lfqt-LbfME_Gn840FB4_gBLeO-QNuHSVO0avQUxsRA',
    fps: '60 FPS',
    latency: '20ms',
    box: {
      label: 'ZONE INTRUSION 91%',
      className: 'right-[16%] bottom-[12%] h-[55%] w-[29%]',
    },
  },
  {
    id: 'CAM-16',
    name: 'TH-2 Conveyor 18 A/B Chandi',
    area: 'Conveyor 18 Mid',
    status: 'medium',
    message: 'MEDIUM — Non-Compliant Footwear',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB_RhsvyU4S6dX-gcqNE7vycbAFvcBmNAM9Gp9acEuH05cqDpmaEeo1w5aP-6cgFh0dMLMzDLsXrqy8aZfexzKerwOWbzMd0UQlJs1NpR3133DmlA3stpJ2DOwq5pcBQnHke4UFaqvR_YPyoYQUAxnWxQmgfm45f58WUQsaZSJWpG4zLe2cDlJhSu1i5MvaMNBNIjZp8tCup-WrwjS6zYSy4ZYZ0yxBTm1HDXy7PNThkLWEDho277ztAg',
    fps: '60 FPS',
    latency: '26ms',
    box: {
      label: 'NO SAFETY SHOES 89%',
      className: 'left-[22%] bottom-[15%] h-[44%] w-[26%]',
    },
  },
  {
    id: 'CAM-24',
    name: 'Conveyor 10 A/B DE (TP -7)',
    area: 'Transfer Point 7',
    status: 'offline',
    message: 'OFFLINE — Signal Loss',
  },
]

const safetyAlerts = [
  {
    severity: 'critical',
    badge: 'CRITICAL HAZARD',
    time: '2 mins ago',
    title: 'Fire / Smoke Detected',
    location: 'Camera 12 — Track Hopper 02',
    action:
      'Verify feed & activate localized suppression water spray.',
  },
  {
    severity: 'high',
    badge: 'HIGH SEVERITY',
    time: '6 mins ago',
    title: 'No Helmet Detected',
    location: 'Camera 34 — Unit 6 Bunker 17 B',
    action:
      'Broadcast PA announcement & log supervisor memo.',
  },
  {
    severity: 'high',
    badge: 'HIGH SEVERITY',
    time: '14 mins ago',
    title: 'Person in Restricted Zone',
    location: 'Camera 04 — Conveyor 2 A/B DE Crusher',
    action:
      'Sound boundary siren & dispatch patrol team.',
  },
  {
    severity: 'medium',
    badge: 'MEDIUM SEVERITY',
    time: '28 mins ago',
    title: 'No Safety Footwear',
    location: 'Camera 16 — Conveyor 18 CHANDI Area',
    action:
      'Flag for safety marshal routine catwalk check.',
  },
  {
    severity: 'medium',
    badge: 'MEDIUM SEVERITY',
    time: '42 mins ago',
    title: 'Minor Smoke / Dust Haze',
    location: 'Camera 07 — Conveyor 2 A/B TE (TP -1)',
    action:
      'Monitor air quality sensor feedback and damper.',
  },
]

export default function Dashboard() {
  return (
    <div className="w-full space-y-5">
      {/* TOP HEADER */}
      <section className="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#dde5ff] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#001453]">
              Thermal Generation Unit Surveillance
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-[#00a36c]" />

            <span className="text-[10px] text-[#757684]">
              Real-time Node 04-A
            </span>
          </div>

          <h1 className="mt-2 text-[23px] font-bold leading-tight tracking-tight text-[#0b1c30]">
            Welcome to HeightX-Safe
          </h1>

          <p className="mt-0.5 text-[11px] text-[#667085]">
            Real-time AI surveillance for a safer, smarter workplace
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="rounded-lg bg-[#8b0010] px-3 py-2 text-[10px] font-semibold text-white">
            Acknowledge Alerts (5)
          </button>

          <button className="rounded-lg bg-white px-3 py-2 text-[10px] font-semibold text-[#334155] shadow-sm">
            Export Shift Summary
          </button>

          <button className="rounded-lg bg-[#00288e] px-3 py-2 text-[10px] font-semibold text-white">
            Report Incident
          </button>
        </div>
      </section>

      {/* KPI ROW */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-7">
        <Kpi
          eyebrow="Infrastructure"
          value="60"
          title="Total Cameras"
          text="All plant locations mapped"
          icon={Camera}
        />

        <Kpi
          eyebrow="Operational"
          value="58"
          title="Online"
          text="0% packet loss (RTSP)"
          icon={CheckCircle2}
          green
        />

        <Kpi
          eyebrow="Unreachable"
          value="2"
          title="Offline Feeds"
          text="Cam 24, Cam 56 pending"
          icon={VideoOff}
        />

        <Kpi
          eyebrow="Attention"
          value="5"
          title="Active Alerts"
          text="1 Crit, 2 High, 2 Med"
          icon={AlertTriangle}
          danger
        />

        <Kpi
          eyebrow="Thermal/Comb"
          value="1"
          title="Fire / Smoke Event"
          text="TH-02 Response en route"
          icon={Flame}
          danger
        />

        <Kpi
          eyebrow="Shift Rate"
          value="92%"
          title="PPE Compliance"
          text="Target: 95% (+3.4%)"
          icon={HardHat}
          green
        />

        <Kpi
          eyebrow="Man-Down"
          value="0"
          title="Fallen Persons"
          text="Zero events detected"
          icon={UserRoundCheck}
          green
        />
      </section>

      {/* MAIN 65 / 35 */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* LEFT */}
        <div className="space-y-3 lg:col-span-8">
          <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div>
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-[#00288e]" />

                <h2 className="text-[13px] font-bold text-[#0b1c30]">
                  LIVE CAMERA PREVIEW
                </h2>
              </div>

              <p className="mt-0.5 text-[9px] text-[#757684]">
                Showing 6 high-priority inspection points across Plant Units
              </p>
            </div>

            <Link
              to="/camera"
              className="flex items-center gap-1.5 rounded-lg bg-[#eff4ff] px-3 py-2 text-[9px] font-semibold text-[#00288e]"
            >
              View All 60 Cameras
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {cameras.map((camera) => (
              <CameraCard
                key={camera.id}
                camera={camera}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4">
          <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="bg-[#f4f7fc] px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-[#8b0010]" />

                  <h2 className="text-[13px] font-bold text-[#0b1c30]">
                    RECENT SAFETY ALERTS
                  </h2>
                </div>

                <span className="rounded-full bg-[#ba1a1a] px-2 py-0.5 text-[8px] font-bold text-white">
                  5 Active
                </span>
              </div>

              <p className="mt-1 text-[9px] text-[#757684]">
                Answering What, Where, Severity, and Recommended Action
              </p>
            </div>

            <div className="divide-y divide-[#edf1f7]">
              {safetyAlerts.map((alert) => (
                <SafetyAlert
                  key={`${alert.title}-${alert.time}`}
                  alert={alert}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM */}
      <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <BottomCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#00714e]" />
              <h3 className="text-[11px] font-bold">
                PPE Compliance Breakdown (Today)
              </h3>
            </div>

            <span className="text-[8px] font-bold text-[#00714e]">
              Shift Rate: 92%
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <Progress label="Safety Helmet" value={95} color="#00a36c" />
            <Progress label="Industrial Gloves" value={88} color="#00288e" />
            <Progress label="Safety Footwear" value={86} color="#3755c3" />
            <Progress label="Harness (Height Work)" value={90} color="#00a36c" />
          </div>

          <div className="mt-4 flex justify-between border-t border-[#edf1f7] pt-3 text-[8px] text-[#757684]">
            <span>Sample size: 1,420 detections</span>
            <span className="font-bold text-[#00714e]">
              +3.4% vs Prior Day
            </span>
          </div>
        </BottomCard>

        <BottomCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#8b0010]" />
              <h3 className="text-[11px] font-bold">
                Alerts by Hazard Type (24 Hours)
              </h3>
            </div>

            <span className="text-[8px] text-[#757684]">
              Total: 23 Events
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <Hazard label="PPE Violations" count="14 Incidents" width="61%" color="#00288e" />
            <Hazard label="Restricted Area Intrusion" count="5 Incidents" width="22%" color="#9b000d" />
            <Hazard label="Machinery Proximity Danger" count="3 Incidents" width="13%" color="#3755c3" />
            <Hazard label="Fire / Smoke Detected" count="1 Incident" width="4%" color="#ba1a1a" />
          </div>

          <div className="mt-4 flex justify-between border-t border-[#edf1f7] pt-3 text-[8px] text-[#757684]">
            <span>Auto-categorized by AI engine</span>
            <span className="font-bold text-[#00288e]">
              Audit log compliant
            </span>
          </div>
        </BottomCard>

        <BottomCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-[#00288e]" />
              <h3 className="text-[11px] font-bold">
                Control Room System Diagnostics
              </h3>
            </div>

            <span className="rounded-full bg-[#daf7e8] px-2 py-0.5 text-[8px] font-bold text-[#00714e]">
              NORMAL
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Diagnostic
              title="Server Latency"
              value="18 ms"
              text="Optimal"
              green
            />

            <Diagnostic
              title="Edge AI Inference"
              value="60 FPS"
              text="Across 58 feeds"
            />

            <Diagnostic
              title="Storage Retention"
              value="28 Days"
              text="RAID Array: 74% free"
            />

            <Diagnostic
              title="Redundant Power"
              value="100%"
              text="UPS Bank Normal"
              green
            />
          </div>

          <div className="mt-4 flex justify-between border-t border-[#edf1f7] pt-3 text-[8px] text-[#757684]">
            <span>Hardware Engine: Cluster 01</span>
            <span className="font-mono font-bold text-[#0b1c30]">
              Uptime: 99.98%
            </span>
          </div>
        </BottomCard>
      </section>
    </div>
  )
}

function Kpi({
  eyebrow,
  value,
  title,
  text,
  icon: Icon,
  green,
  danger,
}) {
  return (
    <div className="min-w-0 rounded-xl bg-white p-3 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <span
          className={`text-[7px] font-bold uppercase tracking-[0.1em] ${
            danger
              ? 'text-[#93000a]'
              : green
                ? 'text-[#00714e]'
                : 'text-[#757684]'
          }`}
        >
          {eyebrow}
        </span>

        <div
          className={`grid h-7 w-7 place-items-center rounded-lg ${
            danger
              ? 'bg-[#ffdad6]'
              : green
                ? 'bg-[#d8f7e7]'
                : 'bg-[#e8eef9]'
          }`}
        >
          <Icon
            className={`h-3.5 w-3.5 ${
              danger
                ? 'text-[#ba1a1a]'
                : green
                  ? 'text-[#00714e]'
                  : 'text-[#00288e]'
            }`}
          />
        </div>
      </div>

      <div className="mt-3">
        <p
          className={`text-[21px] font-bold leading-none ${
            danger
              ? 'text-[#93000a]'
              : green
                ? 'text-[#00714e]'
                : 'text-[#0b1c30]'
          }`}
        >
          {value}
        </p>

        <p className="mt-1 text-[9px] font-semibold text-[#0b1c30]">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[7.5px] text-[#8a93a3]">
          {text}
        </p>
      </div>
    </div>
  )
}

function CameraCard({ camera }) {
  const critical = camera.status === 'critical'
  const high = camera.status === 'high'
  const medium = camera.status === 'medium'
  const offline = camera.status === 'offline'

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_7px_rgba(0,0,0,0.05)]">
      <div
        className={`flex items-center justify-between px-3 py-2 ${
          critical ? 'bg-[#fff0ef]' : 'bg-[#f7f9fc]'
        }`}
      >
        <div className="min-w-0 flex items-center gap-1.5">
          <span
            className={`text-[9px] font-bold ${
              critical ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'
            }`}
          >
            {camera.id}
          </span>

          <span className="text-[8px] text-[#9aa3b2]">
            |
          </span>

          <span className="truncate text-[8px] text-[#536174]">
            {camera.name}
          </span>
        </div>

        <span
          className={`ml-2 flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[7px] font-bold ${
            offline
              ? 'bg-[#e9edf3] text-[#64748b]'
              : critical
                ? 'bg-[#ba1a1a] text-white'
                : 'bg-[#d9f5e7] text-[#00714e]'
          }`}
        >
          {!offline && (
            <span className="h-1 w-1 rounded-full bg-current" />
          )}

          {offline ? 'OFFLINE' : 'LIVE'}
        </span>
      </div>

      {offline ? (
        <div className="flex aspect-video flex-col items-center justify-center bg-[#e6ebf2] text-center">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#d7dde6]">
            <WifiOff className="h-5 w-5 text-[#6b7280]" />
          </div>

          <p className="mt-2 text-[9px] font-bold text-[#334155]">
            RTSP Video Stream Lost
          </p>

          <p className="mt-1 text-[7px] text-[#747f90]">
            Angle Mount Transmitter Timeout (Retry #4 in 12s)
          </p>

          <button className="mt-2 rounded bg-white px-2 py-1 text-[7px] font-semibold text-[#00288e] shadow-sm">
            Force Reconnect
          </button>
        </div>
      ) : (
        <div className="relative aspect-video overflow-hidden bg-[#213145]">
          <img
            src={camera.image}
            alt={camera.name}
            className="h-full w-full object-cover"
          />

          {camera.box && (
            <div
              className={`absolute border-2 ${
                critical
                  ? 'border-[#ef4444] bg-red-500/10'
                  : high
                    ? 'border-[#9b000d] bg-red-700/10'
                    : 'border-[#64748b] bg-slate-400/10'
              } ${camera.box.className}`}
            >
              <span
                className={`absolute -top-[17px] left-0 whitespace-nowrap px-1.5 py-0.5 text-[6px] font-bold text-white ${
                  critical
                    ? 'bg-[#ef4444]'
                    : high
                      ? 'bg-[#9b000d]'
                      : 'bg-[#64748b]'
                }`}
              >
                {camera.box.label}
              </span>
            </div>
          )}

          <div className="absolute bottom-2 left-2 rounded bg-[#172536]/80 px-1.5 py-0.5 font-mono text-[6px] text-white">
            1080p • {camera.fps} • {camera.latency}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[7px] font-semibold ${
            critical
              ? 'bg-[#ba1a1a] text-white'
              : high
                ? 'bg-[#ffe2df] text-[#93000a]'
                : medium
                  ? 'bg-[#edf1f7] text-[#475569]'
                  : offline
                    ? 'bg-[#e8edf4] text-[#64748b]'
                    : 'bg-[#d9f5e7] text-[#00714e]'
          }`}
        >
          {camera.message}
        </span>

        <span className="truncate text-right text-[7px] text-[#8791a0]">
          Area: {camera.area}
        </span>
      </div>
    </div>
  )
}

function SafetyAlert({ alert }) {
  const critical = alert.severity === 'critical'
  const high = alert.severity === 'high'

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-2 py-0.5 text-[7px] font-bold ${
            critical
              ? 'bg-[#ba1a1a] text-white'
              : high
                ? 'bg-[#9b000d] text-white'
                : 'bg-[#e6ebf2] text-[#475569]'
          }`}
        >
          {alert.badge}
        </span>

        <span className="text-[7px] text-[#8b95a5]">
          {alert.time}
        </span>
      </div>

      <h3 className="mt-2 text-[10px] font-bold text-[#0b1c30]">
        {alert.title}
      </h3>

      <p className="mt-1 text-[8px] text-[#536174]">
        {alert.location}
      </p>

      <div
        className={`mt-2 rounded-md px-2 py-1.5 text-[7.5px] leading-3.5 ${
          critical ? 'bg-[#fff0ef]' : 'bg-[#f0f4fa]'
        }`}
      >
        <strong
          className={
            critical ? 'text-[#ba1a1a]' : 'text-[#00288e]'
          }
        >
          Action:
        </strong>{' '}
        {alert.action}
      </div>

      <div className="mt-2 flex gap-2">
        <button className="flex-1 rounded-md bg-[#e8eef8] py-1.5 text-[7px] font-bold text-[#00288e]">
          View Camera
        </button>

        <button
          className={`flex-1 rounded-md py-1.5 text-[7px] font-bold ${
            critical
              ? 'bg-[#8b0010] text-white'
              : 'bg-[#dfe5ee] text-[#334155]'
          }`}
        >
          Acknowledge
        </button>
      </div>
    </div>
  )
}

function BottomCard({ children }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {children}
    </div>
  )
}

function Progress({ label, value, color }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[8px]">
        <span className="font-medium text-[#334155]">
          {label}
        </span>

        <span
          className="font-bold"
          style={{ color }}
        >
          {value}%
        </span>
      </div>

      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#e7edf5]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}

function Hazard({
  label,
  count,
  width,
  color,
}) {
  return (
    <div>
      <div className="flex justify-between text-[8px]">
        <span className="font-medium text-[#334155]">
          {label}
        </span>

        <span className="font-bold text-[#334155]">
          {count}
        </span>
      </div>

      <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#e7edf5]">
        <div
          className="h-full rounded-full"
          style={{
            width,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}

function Diagnostic({
  title,
  value,
  text,
  green,
}) {
  return (
    <div className="rounded-lg bg-[#f2f5fa] p-3">
      <p className="text-[7px] text-[#7e8898]">
        {title}
      </p>

      <p
        className={`mt-1 text-[17px] font-bold ${
          green ? 'text-[#00714e]' : 'text-[#0b1c30]'
        }`}
      >
        {value}
      </p>

      <p
        className={`mt-1 text-[7px] ${
          green ? 'text-[#00714e]' : 'text-[#7e8898]'
        }`}
      >
        {text}
      </p>
    </div>
  )
}