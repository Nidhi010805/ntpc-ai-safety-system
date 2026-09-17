import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Flame,
  Focus,
  HardHat,
  Maximize2,
  Minus,
  MoveDown,
  Plus,
  Radio,
  RotateCcw,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Speaker,
  UserRound,
  Video,
  Wifi,
  Wrench,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

const FALLBACK_CAMERA = {
  id: 'CAM-04',
  tenderNo: 6,
  type: 'PTZ',
  location: 'Conveyor 2 A/B DE (Crusher house -1)',
  area: 'Conveyor 2 A/B DE',
  mounting: 'Existing Structure & Angle Require',
  jbNo: '1',
  poleNo: '',
  status: 'high',
  streamUrl: '',
}

const CCTV_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAhLveQm1DAN9YYX_boN00xDVRNX6k8J5KCuDTMRpCAFbz9ZPY8BJC_NmysKcivqIk9G5H8L29_pDzEzKHiHCtMMHrkQUe6uaCOYtUBQFkpfJTu0y1zJyFg8-vm8D96oE5cUqzcqT6muIeG6oDUbGlUtxDf1_cBiBeVUmlCNBpC0jiNSsQo-qbKUu_f8cmZSHZquWHv-NQ6M247Lfqt-LbfME_Gn840FB4_gBLeO-QNuHSVO0avQUxsRA',
]

const aiModules = [
  {
    title: 'Fire / Smoke',
    description: 'Thermal and optical smoke monitoring active',
    status: 'SAFE',
    icon: Flame,
  },
  {
    title: 'Helmet PPE',
    description: 'Mandatory hardhat compliance active',
    status: 'SAFE',
    icon: HardHat,
  },
  {
    title: 'Safety Footwear',
    description: 'Steel-toe boot detection active',
    status: 'SAFE',
    icon: ShieldCheck,
  },
  {
    title: 'Gloves Check',
    description: 'Hand protection compliance active',
    status: 'SAFE',
    icon: ShieldCheck,
  },
  {
    title: 'Safety Harness',
    description: 'Height work fall protection active',
    status: 'SAFE',
    icon: UserRound,
  },
  {
    title: 'Restricted Zone',
    description: 'Unauthorized entry near rotating equipment',
    status: 'TRIGGERED',
    icon: AlertTriangle,
  },
  {
    title: 'Fallen Person',
    description: 'Zero movement / slip-fall detection active',
    status: 'SAFE',
    icon: UserRound,
  },
  {
    title: 'Ash/Dust Leak',
    description: 'Chute seal and particulate density normal',
    status: 'SAFE',
    icon: Radio,
  },
]

const recentEvents = [
  {
    title: 'Restricted Zone Entry',
    time: '14:32:08',
    text: 'Alert Triggered by Worker #44',
    sub: '(Breach belt line)',
    severity: 'high',
  },
  {
    title: 'Shift Inspection Acknowledged',
    time: '12:15:20',
    text: 'Verified by Operator Ramesh V.',
    sub: 'Desk #1',
    severity: 'safe',
  },
  {
    title: 'Minor Dust Cloud Detected',
    time: '09:40:11',
    text: 'Transient plume during Chute start sequence',
    sub: 'Status: Auto-resolved in 45 sec',
    severity: 'medium',
  },
  {
    title: 'Shift B Diagnostics Passed',
    time: '06:00:00',
    text: 'PTZ motor calibration, optical wiper & AI sync nominal',
    sub: 'Status: 100% Operational',
    severity: 'safe',
  },
]

export default function CameraDetail() {
  const { cameraId } = useParams()
  const locationState = useLocation()

  const camera = {
    ...FALLBACK_CAMERA,
    ...(locationState.state?.camera || {}),
    id: locationState.state?.camera?.id || cameraId || FALLBACK_CAMERA.id,
  }

  const [zoom, setZoom] = useState(3.2)
  const [ptzSpeed, setPtzSpeed] = useState(50)
  const [acknowledged, setAcknowledged] = useState(false)

  const isCritical = camera.status === 'critical'
  const isAlert =
    camera.status === 'high' ||
    camera.status === 'critical' ||
    camera.status === 'medium'

  return (
    <div className="w-full space-y-4">
      {/* =====================================================
          TOP
      ====================================================== */}
      <section>
        <Link
          to="/camera"
          className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-[#00288e] hover:underline"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Live Cameras
        </Link>

        <div className="mt-2 flex flex-col justify-between gap-3 xl:flex-row xl:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[8px] font-bold uppercase text-[#00288e]">
                {camera.id}
              </span>

              <span className="text-[8px] text-slate-400">|</span>

              <span className="text-[8px] font-semibold text-slate-500">
                {camera.area}
              </span>
            </div>

            <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[#0b1c30]">
              Camera Details & PTZ Control
            </h1>

            <p className="mt-1 max-w-[500px] text-[9px] leading-4 text-slate-500">
              Real-time AI video stream, hardware telemetry, PTZ operation,
              and active safety detection modules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcf7e8] px-2.5 py-1.5 text-[7px] font-bold text-[#00714e]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00a36c]" />
              LIVE STREAM
            </span>

            <span className="rounded-full bg-[#eef3ff] px-2.5 py-1.5 text-[7px] font-semibold text-[#00288e]">
              25 FPS · 1080p · RTSP
            </span>

            <span className="rounded-full bg-[#eef3ff] px-2.5 py-1.5 text-[7px] font-semibold text-[#334155]">
              JB No: {camera.jbNo || '—'} · Connected
            </span>

            {isAlert && (
              <button className="rounded-lg bg-[#9b000d] px-3 py-2 text-[8px] font-bold text-white">
                Report Hazard
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* LEFT */}
        <div className="space-y-4 xl:col-span-8">
          {/* VIDEO */}
          <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_8px_rgba(15,35,70,0.06)]">
            <div className="relative aspect-video overflow-hidden bg-[#101828]">
              {camera.streamUrl ? (
                <video
                  src={camera.streamUrl}
                  autoPlay
                  muted
                  controls
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={CCTV_IMAGES[0]}
                  alt={camera.location}
                  className="h-full w-full object-cover"
                />
              )}

              {/* Top CCTV labels */}
              <div className="absolute left-3 top-3 flex items-center gap-1.5">
                <span className="rounded bg-[#ba1a1a] px-2 py-1 text-[7px] font-bold text-white">
                  ● REC
                </span>

                <span className="rounded bg-black/70 px-2 py-1 text-[7px] font-bold text-white">
                  {camera.id} · {camera.area}
                </span>
              </div>

              <div className="absolute right-3 top-3 flex gap-1">
                <span className="rounded bg-[#009b69] px-2 py-1 text-[7px] font-bold text-white">
                  LIVE FEED
                </span>

                <span className="rounded bg-black/70 px-2 py-1 font-mono text-[7px] text-white">
                  2026-09-12 · 14:32:07
                </span>
              </div>

              {/* Detection */}
              {isAlert && (
                <div className="absolute left-[48%] top-[25%] h-[50%] w-[25%] border-2 border-[#ef4444] bg-red-500/10">
                  <span className="absolute -top-5 left-0 whitespace-nowrap bg-[#ef4444] px-2 py-1 text-[6px] font-bold text-white">
                    RESTRICTED ZONE 98.2%
                  </span>
                </div>
              )}

              {/* Bottom telemetry */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="rounded bg-black/70 px-2 py-1 font-mono text-[7px] text-white">
                  PTZ AZIMUTH 184.2° | ELEVATION -14.6° | ZOOM {zoom.toFixed(1)}X
                </div>

                <div className="rounded bg-black/70 px-2 py-1 text-[7px] text-[#72f1b8]">
                  OPTICAL AI · CODEC H.265
                </div>
              </div>
            </div>

            {/* Video toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1f7] px-3 py-2.5">
              <div className="flex items-center gap-2">
                <button className="grid h-7 w-7 place-items-center rounded-md bg-[#eef3ff] text-[#00288e]">
                  <Video className="h-3.5 w-3.5" />
                </button>

                <button className="grid h-7 w-7 place-items-center rounded-md bg-[#eef3ff] text-[#00288e]">
                  <Speaker className="h-3.5 w-3.5" />
                </button>

                <span className="text-[7px] text-[#657286]">
                  Edge AI Latency: <b>19ms</b>
                </span>
              </div>

              <span className="rounded bg-[#ba1a1a] px-2 py-1 text-[6px] font-bold text-white">
                LIVE
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 border-t border-[#edf1f7] px-3 py-2">
              {['All', 'Bounding Boxes', 'Safety Heatmap', 'Clean Feed'].map(
                (item, index) => (
                  <button
                    key={item}
                    className={`rounded-md px-2.5 py-1 text-[6.5px] font-semibold ${
                      index === 0
                        ? 'bg-[#00288e] text-white'
                        : 'bg-[#eef2f8] text-[#536174]'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

              <span className="ml-auto rounded bg-[#eef2f8] px-2 py-1 text-[6px] text-[#536174]">
                1080p 60fps
              </span>
            </div>
          </div>

          {/* PTZ */}
          <section className="rounded-xl bg-white p-4 shadow-[0_1px_8px_rgba(15,35,70,0.05)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-[#00288e]" />

                  <h2 className="text-[11px] font-bold text-[#10213a]">
                    PTZ Camera Controls
                  </h2>
                </div>

                <p className="mt-1 text-[7px] text-slate-500">
                  Simple PTZ controls for camera pan, tilt and optical zoom
                  inspection.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[7px] font-semibold text-[#536174]">
                  PTZ Speed:
                </span>

                <input
                  type="range"
                  min="10"
                  max="100"
                  value={ptzSpeed}
                  onChange={(e) => setPtzSpeed(Number(e.target.value))}
                  className="w-24 accent-[#00288e]"
                />

                <span className="text-[7px] font-bold text-[#00288e]">
                  Medium ({ptzSpeed}%)
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* PAN TILT */}
              <div className="rounded-lg bg-[#f4f7fc] p-4">
                <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-slate-400">
                  Pan & Tilt Direction Pad
                </p>

                <div className="mx-auto mt-3 grid w-[110px] grid-cols-3 gap-2">
                  <div />

                  <ControlButton icon={ArrowUp} />

                  <div />

                  <ControlButton icon={ChevronLeft} />

                  <button className="grid h-9 w-9 place-items-center rounded-full bg-[#00288e] text-[6px] font-bold text-white">
                    HOME
                  </button>

                  <ControlButton icon={ChevronRight} />

                  <div />

                  <ControlButton icon={ArrowDown} />

                  <div />
                </div>
              </div>

              {/* ZOOM */}
              <div className="rounded-lg bg-[#f4f7fc] p-4">
                <div className="grid grid-cols-2 gap-2">
                  <SmallTelemetry
                    label="Optical Zoom"
                    value={`${zoom.toFixed(1)}x`}
                  />

                  <SmallTelemetry
                    label="Optical"
                    value="32x"
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setZoom((value) => Math.min(32, value + 0.5))
                    }
                    className="flex items-center justify-center gap-1 rounded-md bg-white px-2 py-2 text-[7px] font-semibold text-[#00288e]"
                  >
                    <ZoomIn className="h-3 w-3" />
                    Zoom In (+)
                  </button>

                  <button
                    onClick={() =>
                      setZoom((value) => Math.max(1, value - 0.5))
                    }
                    className="flex items-center justify-center gap-1 rounded-md bg-white px-2 py-2 text-[7px] font-semibold text-[#00288e]"
                  >
                    <ZoomOut className="h-3 w-3" />
                    Zoom Out (-)
                  </button>
                </div>

                <div className="mt-3">
                  <p className="text-[7px] font-bold uppercase text-slate-400">
                    Lens Focus
                  </p>

                  <div className="mt-2 flex gap-1">
                    <button className="rounded-md bg-[#00288e] px-2 py-1.5 text-[6px] font-bold text-white">
                      Auto Focus
                    </button>

                    <button className="rounded-md bg-white px-2 py-1.5 text-[6px] text-[#536174]">
                      Manual +
                    </button>

                    <button className="rounded-md bg-white px-2 py-1.5 text-[6px] text-[#536174]">
                      Manual -
                    </button>
                  </div>
                </div>
              </div>

              {/* PRESETS */}
              <div className="rounded-lg bg-[#f4f7fc] p-4">
                <p className="text-[7px] font-bold uppercase text-slate-400">
                  PTZ Camera Quick Presets
                </p>

                <div className="mt-3 space-y-2">
                  {[
                    'Preset 1: Conveyor Drive Motor',
                    'Preset 2: Discharge Chute & Scraper',
                    'Preset 3: Catwalk & Access Ladder',
                    'Preset 4: Take-up Pulley Area',
                  ].map((item) => (
                    <button
                      key={item}
                      className="flex w-full items-center justify-between rounded-md bg-white px-2.5 py-2 text-left text-[7px] font-semibold text-[#334155]"
                    >
                      {item}
                      <ArrowRight className="h-3 w-3 text-[#00288e]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* AI MODULES */}
          <section className="rounded-xl bg-white p-4 shadow-[0_1px_8px_rgba(15,35,70,0.05)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#00288e]" />

                  <h2 className="text-[11px] font-bold text-[#10213a]">
                    AI Safety Detection Modules Running on {camera.id}
                  </h2>
                </div>

                <p className="mt-1 text-[7px] text-slate-500">
                  Real-time edge neural inference for plant personnel compliance
                  and equipment hazards.
                </p>
              </div>

              <span className="rounded-full bg-[#e5edff] px-2.5 py-1 text-[7px] font-bold text-[#00288e]">
                8 Modules Deployed
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              {aiModules.map((module) => (
                <AiModule key={module.title} module={module} />
              ))}
            </div>
          </section>
        </div>

        {/* =====================================================
            RIGHT COLUMN
        ====================================================== */}
        <aside className="space-y-4 xl:col-span-4">
          {/* ALERT */}
          {isAlert && (
            <section className="overflow-hidden rounded-xl bg-white shadow-[0_1px_8px_rgba(15,35,70,0.06)]">
              <div className="bg-[#fff2f1] p-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ffe0dc] px-2 py-1 text-[7px] font-bold text-[#9b000d]">
                    <AlertTriangle className="h-3 w-3" />
                    HIGH SEVERITY ALERT
                  </span>

                  <span className="text-[7px] text-slate-500">
                    14:32:08
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <AlertQuestion
                    number="1."
                    label="WHAT HAPPENED?"
                    value="Person in Restricted Rotating Machinery Zone"
                  />

                  <AlertQuestion
                    number="2."
                    label="WHERE?"
                    value={`${camera.id} — ${camera.location}`}
                  />

                  <AlertQuestion
                    number="3."
                    label="HOW SERIOUS?"
                    value="High Risk — Safety boundary breached while conveyor is energized"
                    danger
                  />

                  <AlertQuestion
                    number="4."
                    label="WHAT SHOULD OPERATOR DO?"
                    value="Immediately sound the boundary broadcast siren and notify field patrol marshal."
                    danger
                  />
                </div>
              </div>

              <div className="p-3">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ba1a1a] py-2 text-[8px] font-bold text-white">
                  <Siren className="h-3.5 w-3.5" />
                  Sound Broadcast Siren
                </button>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAcknowledged(true)}
                    className={`rounded-lg py-2 text-[7px] font-bold ${
                      acknowledged
                        ? 'bg-[#dcf7e8] text-[#00714e]'
                        : 'bg-[#00288e] text-white'
                    }`}
                  >
                    {acknowledged ? 'Alert Acknowledged' : 'Acknowledge Alert'}
                  </button>

                  <button className="rounded-lg bg-[#eef2f8] py-2 text-[7px] font-semibold text-[#334155]">
                    Dispatch Patrol
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* HARDWARE */}
          <section className="rounded-xl bg-white p-4 shadow-[0_1px_8px_rgba(15,35,70,0.05)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#00288e]" />

                <h2 className="text-[11px] font-bold text-[#10213a]">
                  Camera Hardware Profile
                </h2>
              </div>

              <span className="rounded bg-[#eef3ff] px-2 py-1 text-[6px] font-semibold text-[#00288e]">
                Annexure 1
              </span>
            </div>

            <div className="mt-4 divide-y divide-[#edf1f7]">
              <HardwareRow label="Camera Number" value={camera.id} />

              <HardwareRow
                label="Tender Item No."
                value={`S/N ${camera.tenderNo || '—'}`}
              />

              <HardwareRow label="Location" value={camera.location} />

              <HardwareRow label="Area of Interest" value={camera.area} />

              <HardwareRow
                label="Camera Type"
                value="PTZ Industrial Dome (RTSP/IP67)"
              />

              <HardwareRow
                label="Pole Number"
                value={camera.poleNo || 'Not Applicable'}
              />

              <HardwareRow
                label="Mounting / Structure"
                value={camera.mounting}
              />

              <HardwareRow
                label="Junction Box"
                value={`JB No: ${camera.jbNo || '—'}`}
              />

              <HardwareRow
                label="JB Mounting Details"
                value="Wall & Angle Require"
              />

              <HardwareRow
                label="Power Feed"
                value="UPS Power 230V AC backed (CHP Room)"
              />

              <HardwareRow
                label="IP / Port"
                value="10.14.82.104 : 554"
              />

              <HardwareRow
                label="Optical Spec"
                value="32x Optical / 120dB WDR"
              />
            </div>

            <div className="mt-3 rounded-lg bg-[#e8f8f0] px-3 py-2">
              <p className="text-[7px] font-semibold text-[#00714e]">
                ✓ Routine Inspection Completed
              </p>

              <p className="mt-0.5 text-[6px] text-[#536174]">
                28 Aug 2026 · Optics Clean
              </p>
            </div>
          </section>

          {/* EVENTS */}
          <section className="rounded-xl bg-white p-4 shadow-[0_1px_8px_rgba(15,35,70,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-[#00288e]" />

                  <h2 className="text-[11px] font-bold text-[#10213a]">
                    Recent Events Log
                  </h2>
                </div>
              </div>

              <span className="text-[6px] font-semibold text-slate-500">
                Past 24 Hours
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {recentEvents.map((event) => (
                <EventCard key={`${event.title}-${event.time}`} event={event} />
              ))}
            </div>

            <button className="mt-3 flex w-full items-center justify-between rounded-lg bg-[#eef3ff] px-3 py-2 text-[7px] font-semibold text-[#00288e]">
              View Complete CCTV Event Audit Log
              <ArrowRight className="h-3 w-3" />
            </button>
          </section>

          <div className="rounded-xl bg-[#eef3ff] p-4">
            <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-[#64748b]">
              Edge CCTV Engine
            </p>

            <p className="mt-1 text-[10px] font-bold text-[#10213a]">
              HeightX-Safe AI Surveillance
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}

/* =====================================================
   HELPERS
===================================================== */

function ControlButton({ icon: Icon }) {
  return (
    <button className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#00288e] shadow-sm transition hover:bg-[#e8eeff]">
      <Icon className="h-4 w-4" />
    </button>
  )
}

function SmallTelemetry({ label, value }) {
  return (
    <div className="rounded-md bg-white p-2">
      <p className="text-[6px] uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-[9px] font-bold text-[#00288e]">{value}</p>
    </div>
  )
}

function AiModule({ module }) {
  const Icon = module.icon
  const triggered = module.status === 'TRIGGERED'

  return (
    <div
      className={`rounded-lg border p-3 ${
        triggered
          ? 'border-[#ffd79d] bg-[#fff8e8]'
          : 'border-[#edf1f7] bg-[#f8faff]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <Icon
          className={`h-3.5 w-3.5 ${
            triggered ? 'text-[#c77700]' : 'text-[#00714e]'
          }`}
        />

        <span
          className={`text-[5.5px] font-bold ${
            triggered ? 'text-[#c77700]' : 'text-[#00714e]'
          }`}
        >
          {module.status}
        </span>
      </div>

      <p className="mt-2 text-[7px] font-bold text-[#25364d]">
        {module.title}
      </p>

      <p className="mt-1 text-[6px] leading-3 text-[#7b8798]">
        {module.description}
      </p>
    </div>
  )
}

function AlertQuestion({ number, label, value, danger }) {
  return (
    <div>
      <p className="text-[6px] font-bold uppercase tracking-[0.07em] text-[#8a94a4]">
        {number} {label}
      </p>

      <p
        className={`mt-1 text-[8px] font-semibold leading-4 ${
          danger ? 'text-[#9b000d]' : 'text-[#26384f]'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function HardwareRow({ label, value }) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-3 py-2">
      <span className="text-[6px] font-semibold text-[#8a94a4]">
        {label}:
      </span>

      <span className="text-right text-[7px] font-semibold leading-3 text-[#26384f]">
        {value}
      </span>
    </div>
  )
}

function EventCard({ event }) {
  const dot =
    event.severity === 'high'
      ? 'bg-[#ba1a1a]'
      : event.severity === 'medium'
        ? 'bg-[#d18b00]'
        : 'bg-[#00a36c]'

  return (
    <div className="rounded-lg bg-[#f4f7fc] p-2.5">
      <div className="flex items-start gap-2">
        <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />

        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-2">
            <p className="text-[7px] font-bold text-[#25364d]">
              {event.title}
            </p>

            <span className="font-mono text-[5.5px] text-slate-400">
              {event.time}
            </span>
          </div>

          <p className="mt-1 text-[6px] leading-3 text-[#657286]">
            {event.text}
          </p>

          <p
            className={`mt-0.5 text-[5.5px] font-semibold ${
              event.severity === 'high'
                ? 'text-[#ba1a1a]'
                : event.severity === 'safe'
                  ? 'text-[#00714e]'
                  : 'text-[#936700]'
            }`}
          >
            {event.sub}
          </p>
        </div>
      </div>
    </div>
  )
}