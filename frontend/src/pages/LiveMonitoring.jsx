import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Grid2X2,
  List,
  RefreshCw,
  RotateCcw,
  Search,
  VideoOff,
  Wifi,
  Wrench,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

const PAN_LIMIT = 100
const TILT_LIMIT = 60
const PTZ_STEP = 10
const ZOOM_MIN = 1
const ZOOM_MAX = 5
const ZOOM_STEP = 0.5

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const cameras = [
  {
    id: 'CAM 01',
    shortId: '01',
    area: 'Conveyor 3 A/B TE',
    title: 'Conveyor 3 A/B TE (Crusher house -1)',
    location: 'Crusher house -1',
    mounting: 'Existing Structure & Angle',
    jb: 'JB-01 (Main)',
    status: 'safe',
    statusText: 'SAFE',
    detection: 'Safe — Normal Operation',
    note: 'Mounting: Existing Structure & Angle • AI Analysis: Clean operation, 0 violations.',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'CAM 02',
    shortId: '02',
    area: 'Conveyor 8 A/B TE',
    title: 'Conveyor 8 A/B TE (Crusher house -1)',
    location: 'Crusher house -1',
    mounting: 'Existing Structure & Angle',
    jb: 'JB-01 (Main)',
    status: 'safe',
    statusText: 'SAFE',
    detection: 'Safe — Normal Operation',
    note: 'Mounting: Structure & Angle • Normal continuous coal flow.',
    image:
      'https://images.unsplash.com/photo-1518709414768-a88981a4515d?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'CAM 03',
    shortId: '03',
    area: 'Area: Coal Gate',
    title: 'RP gate floor crusher house-1',
    location: 'Coal Gate',
    mounting: 'Wall & Angle',
    jb: 'JB No: 1',
    status: 'safe',
    statusText: 'SAFE',
    detection: 'Safe — Operation in Progress',
    note: 'Mounting: Structure Angle • Gate clearance verified, zero violations.',
    image:
      'https://images.unsplash.com/photo-1531053326607-9d349096d887?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'CAM 04',
    shortId: '04',
    area: 'Conveyor 2 A/B DE',
    title: 'Conveyor 2 A/B DE (Crusher house -1)',
    location: 'Crusher house -1',
    mounting: 'Wall & Angle',
    jb: 'JB No: 1',
    status: 'high',
    statusText: 'HIGH RISK',
    detection: 'Restricted Area Entry Detected (98%)',
    note: 'JB No: 1 (Wall & Angle) • Person in Restricted Rotating Zone',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85',
    detectionBox: {
      label: 'RESTRICTED ZONE 98%',
      className: 'right-[19%] top-[23%] h-[53%] w-[29%]',
    },
  },
  {
    id: 'CAM 05',
    shortId: '05',
    area: 'Crusher House 1 Top Floor',
    title: 'Crusher house 1 Top floor',
    location: 'Crusher House',
    mounting: 'Structure & Angle',
    jb: 'JB No: 2',
    status: 'safe',
    statusText: 'SAFE',
    detection: 'Safe — Normal Operation',
    note: 'Mounting: Structure & Angle • Chute feed normal, dust extractors running.',
    image:
      'https://images.unsplash.com/photo-1565619624098-cf4168a49993?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'CAM 06',
    shortId: '06',
    area: 'Conveyor 2 A/B Tail Pulley',
    title: 'Conveyor 2 A/B tail pulley',
    location: 'Crusher House',
    mounting: 'Structure & Angle',
    jb: 'JB No: 2',
    status: 'safe',
    statusText: 'SAFE',
    detection: 'Safe — Normal Operation',
    note: 'Mounting: Structure & Angle • Guard enclosure intact, bearing vibration normal.',
    image:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'CAM 07',
    shortId: '07',
    area: 'Conveyor 2 A/B TE (TP -1)',
    title: 'Conveyor 2 A/B TE (TP -1)',
    location: 'Transfer Point 1',
    mounting: 'Pole Mount',
    jb: 'JB No: 1',
    status: 'medium',
    statusText: 'MEDIUM',
    detection: 'Dust / Mist Threshold 87%',
    note: 'JB No: 1 (Wall Mount) • Minor Dust Concentration spike detected.',
    image:
      'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=85',
    detectionBox: {
      label: 'DUST / MIST THRESHOLD 87%',
      className: 'left-[25%] top-[29%] h-[34%] w-[47%]',
    },
  },
  {
    id: 'CAM 08',
    shortId: '08',
    area: 'Conveyor 10 A/B DE',
    title: 'Conveyor 10 A/B DE Centre',
    location: 'Conveyor 10',
    mounting: 'Wall Mount',
    jb: 'JB No: 1',
    status: 'safe',
    statusText: 'SAFE',
    detection: 'Safe — Clear Operation',
    note: 'Mounting: Structure Angle • Normal alignment, belt speed synced at 3.2 m/s.',
    image:
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'CAM 11',
    shortId: '11',
    area: 'Coal train unloading',
    title: 'Track Hopper 01 for monitoring unloading',
    location: 'Coal Train Unloading',
    mounting: 'Structural Stanchion',
    jb: 'JB No: 1',
    status: 'safe',
    statusText: 'SAFE',
    detection: 'Safe — Unloading in Progress',
    note: 'JB No: 1 • Coal rake unloading in progress, safety audio signal audible.',
    image:
      'https://images.unsplash.com/photo-1578319439584-104c94d37305?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'CAM 12',
    shortId: '12',
    area: 'Coal train unloading',
    title: 'Track Hopper 02 for monitoring unloading',
    location: 'Coal Train Unloading',
    mounting: 'Structural Stanchion',
    jb: 'JB No: 1',
    status: 'critical',
    statusText: 'CRITICAL',
    detection: 'Fire/Smoke Warning (99.4%)',
    note: 'JB No: 1 • Thermal AI: Smoldering Coal & Smoke Detected! Deluge system ready.',
    image:
      'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1200&q=85',
    detectionBox: {
      label: 'FIRE/SMOKE 99.4%',
      className: 'left-[28%] top-[21%] h-[48%] w-[48%]',
    },
  },
  {
    id: 'CAM 16',
    shortId: '16',
    area: 'TH-2 Conveyor 18 A/B CHANDI AREA',
    title: 'TH-2 Conveyor 18 A/B CHANDI AREA',
    location: 'Conveyor 18',
    mounting: 'Steel Gantry',
    jb: 'JB No: 1',
    status: 'medium',
    statusText: 'MEDIUM',
    detection: 'PPE: No Safety Footwear Detected',
    note: 'JB No: 1 • Safety PPE: Non-steel toe boot violation recorded.',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'CAM 24',
    shortId: '24',
    area: 'Conveyor 10 A/B DE (TP -7)',
    title: 'Conveyor 10 A/B DE (TP -7)',
    location: 'Conveyor 10',
    mounting: 'Wall Mount',
    jb: 'JB No: 1',
    status: 'offline',
    statusText: 'OFFLINE',
    detection: 'Signal Loss / Cable Inspection',
    note: 'JB No: 1 • Field technician dispatched for optic fiber drop inspection.',
  },
]

const inventoryRows = [
  cameras[0],
  cameras[3],
  cameras[8],
  cameras[9],
  cameras[10],
  cameras[11],
  {
    shortId: '34',
    title: 'Unit 6 Bunker 17 B',
    area: 'Coal Bunker Deck',
    mounting: 'Roof Cantilever',
    jb: 'JB No: 3',
    status: 'medium',
    detection: 'PPE: No Helmet Detected (Worker #42)',
  },
  {
    shortId: '42',
    title: 'Unit 4 Bunker 15 B',
    area: 'Coal Bunker Deck',
    mounting: 'Roof Cantilever',
    jb: 'JB No: 3',
    status: 'safe',
    detection: 'Safe — Normal Operation',
  },
  {
    shortId: '53',
    title: 'TP-27 Top floor towards coal yard',
    area: 'Transfer Point 27',
    mounting: 'Pole P1 (External)',
    jb: 'JB No: 4',
    status: 'safe',
    detection: 'Safe — Yard Visual Clear',
  },
  {
    shortId: '56',
    title: 'Conveyor 11 A DE (TP-8 ROOF)',
    area: 'TP-8 Roof Gantry',
    mounting: 'Pole P2 (External)',
    jb: 'JB No: 2',
    status: 'offline',
    detection: 'Offline / Switch Port Maintenance',
  },
  {
    shortId: '59',
    title: 'Conveyor 11 B DE (TP-9 ROOF)',
    area: 'TP-9 Roof Gantry',
    mounting: 'Pole P3 (External)',
    jb: 'JB No: 2',
    status: 'safe',
    detection: 'Safe — Clear Operation',
  },
]

export default function LiveCamera() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [area, setArea] = useState('all')
  const [view, setView] = useState('grid')
  const [activeCamera, setActiveCamera] = useState(null)

  const filteredCameras = useMemo(() => {
    return cameras.filter((camera) => {
      const q = search.toLowerCase()

      const matchesSearch =
        camera.id.toLowerCase().includes(q) ||
        camera.title.toLowerCase().includes(q) ||
        camera.area.toLowerCase().includes(q)

      const matchesStatus =
        status === 'all' || camera.status === status

      const matchesArea =
        area === 'all' || camera.location === area

      return matchesSearch && matchesStatus && matchesArea
    })
  }, [search, status, area])

  return (
    <div className="w-full space-y-4">

      {/* =========================================
          TITLE + KPI
      ========================================== */}
      <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#e4ebff] px-2.5 py-1">
            <Camera className="h-3 w-3 text-[#00288e]" />

            <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#00288e]">
              Thermal Power AI CCTV
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Camera className="h-5 w-5 text-[#00288e]" />

            <h1 className="text-[23px] font-bold leading-none tracking-tight text-[#0b1c30]">
              Live Camera
              <br />
              Monitoring
            </h1>
          </div>

          <p className="mt-2 max-w-[330px] text-[10px] leading-4 text-[#6b7280]">
            View and monitor all 60 cameras in real time
            across plant facilities
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard
            icon={Camera}
            value="60"
            label="TOTAL CAMERAS"
            type="blue"
          />

          <StatCard
            icon={CheckCircle2}
            value="58"
            label="ONLINE & ACTIVE"
            type="green"
          />

          <StatCard
            icon={VideoOff}
            value="2"
            label="OFFLINE / MAINT."
            type="gray"
          />

          <StatCard
            icon={AlertTriangle}
            value="5"
            label="ACTIVE ALERTS"
            type="red"
          />
        </div>
      </section>

      {/* =========================================
          FILTER BAR
      ========================================== */}
      <section className="rounded-xl bg-white p-3 shadow-[0_1px_8px_rgba(15,35,70,0.05)]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-[#e3e8f0] bg-white px-3 py-2">
            <Search className="h-3.5 w-3.5 text-[#94a0b2]" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by camera number, conveyor..."
              className="w-full bg-transparent text-[9px] text-[#25364d] outline-none placeholder:text-[#9aa3b2]"
            />
          </div>

          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="rounded-lg border border-[#e3e8f0] bg-[#f7f9fc] px-3 py-2 text-[8px] font-semibold text-[#334155] outline-none"
          >
            <option value="all">All Plant Areas (60)</option>
            <option value="Crusher house -1">Crusher House</option>
            <option value="Coal Train Unloading">Coal Train Unloading</option>
            <option value="Conveyor 10">Conveyor 10</option>
          </select>

          <div className="ml-auto flex gap-1">
            <button
              onClick={() => setView('grid')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-2 text-[8px] font-semibold ${
                view === 'grid'
                  ? 'bg-[#e8eeff] text-[#00288e]'
                  : 'text-[#64748b]'
              }`}
            >
              <Grid2X2 className="h-3 w-3" />
              Grid View
            </button>

            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-2 text-[8px] font-semibold ${
                view === 'table'
                  ? 'bg-[#e8eeff] text-[#00288e]'
                  : 'text-[#64748b]'
              }`}
            >
              <List className="h-3 w-3" />
              Inventory Table
            </button>

            <button className="grid h-8 w-8 place-items-center rounded-md border border-[#e3e8f0] text-[#64748b]">
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md bg-[#eef3ff] px-2 py-1.5 text-[7.5px] font-semibold text-[#334155] outline-none"
          >
            <option value="all">All Status (Online 58, Offline 2)</option>
            <option value="safe">Safe</option>
            <option value="medium">Medium</option>
            <option value="high">High Risk</option>
            <option value="critical">Critical</option>
            <option value="offline">Offline</option>
          </select>

          <span className="rounded-md bg-[#eef3ff] px-2 py-1.5 text-[7.5px] font-semibold text-[#334155]">
            All Alerts (Critical 1, High 2, Med 2)
          </span>
        </div>
      </section>

      {/* =========================================
          CAMERA MATRIX
      ========================================== */}
      {view === 'grid' && (
        <section>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[11px] font-bold text-[#0b1c30]">
                Real-Time Video Matrix
              </h2>

              <span className="text-[7px] text-[#8b95a5]">
                SHOWING 1-12 OF 60 CAMERAS
              </span>
            </div>

            <div className="flex items-center gap-4 text-[7px] font-semibold text-[#526174]">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00a36c]" />
                H.265 / RTSP Direct Streams
              </span>

              <span>Total Latency Avg: 38ms</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredCameras.map((camera) => (
              <CameraCard
                key={camera.id}
                camera={camera}
                onOpen={() => setActiveCamera(camera)}
              />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2">
            <p className="text-[7px] text-[#536174]">
              Showing 1-12 of 60 Total Cameras in Matrix
            </p>

            <Pagination />
          </div>
        </section>
      )}

      {/* =========================================
          INVENTORY TABLE
      ========================================== */}
      {(view === 'table' || view === 'grid') && (
        <InventoryTable />
      )}

      {activeCamera && (
        <PtzModal
          camera={activeCamera}
          onClose={() => setActiveCamera(null)}
        />
      )}
    </div>
  )
}

function StatCard({ icon: Icon, value, label, type }) {
  const styles = {
    blue: {
      bg: 'bg-[#eef3ff]',
      icon: 'text-[#00288e]',
      value: 'text-[#0b1c30]',
    },
    green: {
      bg: 'bg-[#e0f8eb]',
      icon: 'text-[#00a36c]',
      value: 'text-[#00714e]',
    },
    gray: {
      bg: 'bg-[#eef1f5]',
      icon: 'text-[#778397]',
      value: 'text-[#536174]',
    },
    red: {
      bg: 'bg-[#ffe4e1]',
      icon: 'text-[#ba1a1a]',
      value: 'text-[#93000a]',
    },
  }

  const style = styles[type]

  return (
    <div className="flex min-w-[105px] items-center gap-2 rounded-xl bg-white px-3 py-3 shadow-[0_1px_8px_rgba(15,35,70,0.05)]">
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${style.bg}`}
      >
        <Icon className={`h-4 w-4 ${style.icon}`} />
      </div>

      <div>
        <p className={`text-[19px] font-bold leading-none ${style.value}`}>
          {value}
        </p>

        <p className="mt-1 text-[6px] font-bold uppercase leading-[8px] tracking-[0.06em] text-[#64748b]">
          {label}
        </p>
      </div>
    </div>
  )
}

function CameraCard({ camera, onOpen }) {
  const isCritical = camera.status === 'critical'
  const isHigh = camera.status === 'high'
  const isMedium = camera.status === 'medium'
  const isOffline = camera.status === 'offline'

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white shadow-[0_1px_6px_rgba(15,35,70,0.06)] ${
        isCritical
          ? 'border-[#ef9a9a]'
          : 'border-[#e6ebf2]'
      }`}
    >
      {/* VIDEO */}
      {isOffline ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open PTZ control for ${camera.id} (offline)`}
          className="flex aspect-[16/8.4] w-full flex-col items-center justify-center bg-[#dbe8fb]"
        >
          <VideoOff className="h-7 w-7 text-[#8ba1be]" />

          <p className="mt-2 text-[9px] font-bold text-[#536174]">
            CAMERA OFFLINE
          </p>

          <p className="mt-1 text-[7px] text-[#7d8da3]">
            Signal lost from JB #1
          </p>
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open PTZ control for ${camera.id}`}
          className="group relative block aspect-[16/8.4] w-full overflow-hidden bg-[#1d2939]"
        >
          <img
            src={camera.image}
            alt={camera.title}
            className="h-full w-full object-cover"
          />

          {/* LIVE */}
          <div className="absolute left-2 top-2 flex items-center gap-1">
            <span
              className={`rounded px-1.5 py-0.5 text-[6px] font-bold text-white ${
                isCritical ? 'bg-[#ba1a1a]' : 'bg-[#009b69]'
              }`}
            >
              {isCritical ? 'ALARM ACTIVE' : '● LIVE'}
            </span>

            <span className="rounded bg-black/60 px-1.5 py-0.5 text-[6px] font-semibold text-white">
              PTZ
            </span>
          </div>

          <span className="absolute right-2 top-2 rounded bg-black/65 px-1.5 py-0.5 font-mono text-[6px] text-white">
            25 FPS • 1080p
          </span>

          {camera.detectionBox && (
            <div
              className={`absolute border-2 ${
                isCritical
                  ? 'border-red-500 bg-red-500/10'
                  : isHigh
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-yellow-500 bg-yellow-500/10'
              } ${camera.detectionBox.className}`}
            >
              <span
                className={`absolute -top-[17px] left-0 whitespace-nowrap px-1.5 py-0.5 text-[6px] font-bold text-white ${
                  isCritical
                    ? 'bg-red-600'
                    : isHigh
                      ? 'bg-orange-500'
                      : 'bg-yellow-600'
                }`}
              >
                {camera.detectionBox.label}
              </span>
            </div>
          )}

          <span className="absolute bottom-2 left-2 bg-black/60 px-1.5 py-0.5 font-mono text-[5.5px] text-white">
            2026-09-12 14:32:07:20
          </span>

          <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-[8px] font-bold uppercase tracking-[0.08em] text-transparent transition-colors group-hover:bg-black/35 group-hover:text-white">
            Open PTZ Control
          </span>
        </button>
      )}

      {/* DETAILS */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[7px] font-bold uppercase text-[#00288e]">
              {camera.id} · Area: {camera.area}
            </p>

            <h3 className="mt-1 text-[10px] font-bold leading-tight text-[#14243a]">
              {camera.title}
            </h3>
          </div>

          <StatusBadge camera={camera} />
        </div>

        <p
          className={`mt-1.5 text-[7px] leading-3 ${
            isCritical || isHigh
              ? 'font-semibold text-[#a1111c]'
              : 'text-[#657286]'
          }`}
        >
          {camera.note}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1">
            <button className="rounded-md border border-[#dfe5ee] px-2 py-1 text-[6.5px] font-semibold text-[#536174]">
              Snapshot
            </button>

            <button
              onClick={onOpen}
              className="rounded-md border border-[#dfe5ee] px-2 py-1 text-[6.5px] font-semibold text-[#536174] hover:bg-[#f7f9fc]"
            >
              PTZ Preset
            </button>

            {isCritical && (
              <button className="rounded-md bg-[#e32222] px-2 py-1 text-[6.5px] font-bold text-white">
                Auto-Dispatch
              </button>
            )}
          </div>

          <button
            onClick={onOpen}
            className="text-[6.5px] font-bold text-[#00288e] hover:underline"
          >
            Details →
          </button>
        </div>
      </div>
    </article>
  )
}

function StatusBadge({ camera }) {
  let style = 'bg-[#dcf7e8] text-[#00714e]'

  if (camera.status === 'critical') {
    style = 'bg-[#ffe1df] text-[#ba1a1a]'
  } else if (camera.status === 'high') {
    style = 'bg-[#fff0dc] text-[#9a5200]'
  } else if (camera.status === 'medium') {
    style = 'bg-[#fff4d7] text-[#856404]'
  } else if (camera.status === 'offline') {
    style = 'bg-[#edf0f5] text-[#64748b]'
  }

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[6px] font-bold ${style}`}
    >
      {camera.statusText}
    </span>
  )
}

function Pagination() {
  return (
    <div className="flex items-center gap-1">
      <button className="flex items-center gap-1 rounded-md bg-[#f1f4f9] px-2 py-1 text-[6.5px] text-[#536174]">
        <ChevronLeft className="h-2.5 w-2.5" />
        Previous
      </button>

      {[1, 2, 3, 4, 5].map((page) => (
        <button
          key={page}
          className={`grid h-5 w-5 place-items-center rounded text-[6.5px] font-bold ${
            page === 1
              ? 'bg-[#00288e] text-white'
              : 'bg-[#eef2f8] text-[#536174]'
          }`}
        >
          {page}
        </button>
      ))}

      <button className="flex items-center gap-1 rounded-md bg-[#f1f4f9] px-2 py-1 text-[6.5px] text-[#536174]">
        Next
        <ChevronRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}

function InventoryTable() {
  return (
    <section className="overflow-hidden rounded-xl border border-[#dfe5ee] bg-white shadow-[0_1px_8px_rgba(15,35,70,0.04)]">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-[#eef4ff] px-4 py-3">
        <div>
          <h2 className="text-[11px] font-bold text-[#10213a]">
            Camera Master Inventory & Telemetry Status
          </h2>

          <p className="mt-0.5 text-[7px] text-[#657286]">
            Comprehensive real-time telemetry from all designated camera nodes
            (Annexure inventory)
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-[7px] font-semibold text-[#00288e] shadow-sm">
          <Download className="h-3 w-3" />
          Export Telemetry CSV
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="bg-[#dce8fb] text-left">
              <Th>#</Th>
              <Th>CAMERA LOCATION</Th>
              <Th>AREA OF INTEREST</Th>
              <Th>MOUNTING / POLE</Th>
              <Th>JB DETAILS</Th>
              <Th>STATUS</Th>
              <Th>ACTIVE SAFETY DETECTION</Th>
              <Th>ACTION</Th>
            </tr>
          </thead>

          <tbody>
            {inventoryRows.map((row) => (
              <InventoryRow
                key={row.shortId}
                row={row}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#e5eaf1] bg-[#f6f8fc] px-4 py-2">
        <p className="text-[6.5px] text-[#536174]">
          Showing Annexure Master Inventory: 11 selected nodes of 60 total
          records
        </p>

        <div className="flex items-center gap-1">
          <span className="mr-1 text-[6.5px] font-bold">
            Page:
          </span>

          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`grid h-5 w-5 place-items-center rounded text-[6px] font-bold ${
                page === 1
                  ? 'bg-[#00288e] text-white'
                  : 'bg-[#e9eef6] text-[#334155]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function Th({ children }) {
  return (
    <th className="whitespace-nowrap px-3 py-2 text-[6px] font-bold uppercase tracking-[0.06em] text-[#334155]">
      {children}
    </th>
  )
}

function InventoryRow({ row }) {
  const critical = row.status === 'critical'
  const high = row.status === 'high'
  const medium = row.status === 'medium'
  const offline = row.status === 'offline'

  return (
    <tr className="border-t border-[#edf0f5] hover:bg-[#fafcff]">
      <td className="px-3 py-2 text-[7px] font-bold text-[#00288e]">
        {row.shortId}
      </td>

      <td className="px-3 py-2 text-[7px] font-medium text-[#25364d]">
        {row.title}
      </td>

      <td className="px-3 py-2 text-[7px] text-[#536174]">
        {row.area}
      </td>

      <td className="px-3 py-2 text-[7px] text-[#536174]">
        {row.mounting}
      </td>

      <td className="px-3 py-2 text-[7px] text-[#536174]">
        {row.jb}
      </td>

      <td className="px-3 py-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[5.5px] font-bold ${
            critical
              ? 'bg-[#ffe0de] text-[#ba1a1a]'
              : high
                ? 'bg-[#ffead2] text-[#995200]'
                : medium
                  ? 'bg-[#fff4d7] text-[#7a6200]'
                  : offline
                    ? 'bg-[#e8edf4] text-[#64748b]'
                    : 'bg-[#dcf7e8] text-[#00714e]'
          }`}
        >
          {!offline && (
            <span className="h-1 w-1 rounded-full bg-current" />
          )}

          {critical
            ? 'Critical'
            : high
              ? 'High Alert'
              : medium
                ? 'Medium'
                : offline
                  ? 'Offline'
                  : 'Online'}
        </span>
      </td>

      <td
        className={`px-3 py-2 text-[7px] font-medium ${
          critical
            ? 'text-[#ba1a1a]'
            : high
              ? 'text-[#9a5200]'
              : medium
                ? 'text-[#806700]'
                : offline
                  ? 'text-[#64748b]'
                  : 'text-[#00714e]'
        }`}
      >
        {row.detection}
      </td>

      <td className="px-3 py-2">
        <button
          className={`rounded px-2 py-1 text-[6px] font-bold ${
            critical
              ? 'bg-[#e32222] text-white'
              : high
                ? 'bg-[#e32222] text-white'
                : offline
                  ? 'bg-[#e7ebf2] text-[#64748b]'
                  : 'bg-[#e6edff] text-[#00288e]'
          }`}
        >
          {critical
            ? 'Dispatch'
            : high
              ? 'Respond'
              : offline
                ? 'Diag'
                : 'Stream'}
        </button>
      </td>
    </tr>
  )
}

function PtzModal({ camera, onClose }) {
  const [pan, setPan] = useState(0)
  const [tilt, setTilt] = useState(0)
  const [zoom, setZoom] = useState(1)
  const backdropRef = useRef(null)

  const isOffline = camera.status === 'offline'
  const isCritical = camera.status === 'critical'

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleBackdropClick = (event) => {
    if (event.target === backdropRef.current) onClose()
  }

  const resetPtz = () => {
    setPan(0)
    setTilt(0)
    setZoom(1)
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${camera.title} PTZ control`}
        className="w-full max-w-[720px] overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-[#e6ebf2] px-5 py-4">
          <div className="min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#00288e]">
              {camera.id} · {camera.area}
            </p>
            <h2 className="mt-1 truncate text-[14px] font-bold text-[#0b1c30]">
              {camera.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close PTZ control"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[#94a0b2] transition-colors hover:bg-[#f1f4f9] hover:text-[#0b1c30]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="relative aspect-video overflow-hidden bg-[#101828]">
          {isOffline ? (
            <div className="flex h-full flex-col items-center justify-center text-white">
              <VideoOff className="h-10 w-10 text-[#8ba1be]" />
              <p className="mt-3 text-[10px] font-bold">CAMERA OFFLINE</p>
              <p className="mt-1 text-[7px] text-[#94a3b8]">
                PTZ control unavailable — signal lost from JB #1
              </p>
            </div>
          ) : (
            <>
              <div className="h-full w-full overflow-hidden">
                <img
                  src={camera.image}
                  alt={camera.title}
                  className="h-full w-full object-cover transition-transform duration-150 ease-out"
                  style={{ transform: `translate(${pan}%, ${tilt}%) scale(${zoom})` }}
                />
              </div>

              <span
                className={`absolute left-3 top-3 rounded px-1.5 py-0.5 text-[7px] font-bold text-white ${
                  isCritical ? 'bg-[#ba1a1a]' : 'bg-[#009b69]'
                }`}
              >
                {isCritical ? 'ALARM ACTIVE' : '● LIVE'}
              </span>

              <span className="absolute bottom-3 left-3 rounded bg-black/65 px-2 py-1 font-mono text-[8px] text-white">
                PAN {pan > 0 ? '+' : ''}
                {pan}° · TILT {tilt > 0 ? '+' : ''}
                {tilt}° · ZOOM {zoom.toFixed(1)}×
              </span>

              <span className="absolute bottom-3 right-3 rounded bg-black/65 px-2 py-1 font-mono text-[8px] text-white">
                {new Date().toLocaleString()}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#e6ebf2] bg-[#f7f9fc] p-4">
          <PtzGroup label="Pan">
            <PtzIconButton
              disabled={isOffline}
              onClick={() => setPan((p) => clamp(p - PTZ_STEP, -PAN_LIMIT, PAN_LIMIT))}
              aria-label="Pan left"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </PtzIconButton>
            <PtzIconButton
              disabled={isOffline}
              onClick={() => setPan((p) => clamp(p + PTZ_STEP, -PAN_LIMIT, PAN_LIMIT))}
              aria-label="Pan right"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </PtzIconButton>
          </PtzGroup>

          <PtzGroup label="Tilt">
            <PtzIconButton
              disabled={isOffline}
              onClick={() => setTilt((t) => clamp(t - PTZ_STEP, -TILT_LIMIT, TILT_LIMIT))}
              aria-label="Tilt up"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </PtzIconButton>
            <PtzIconButton
              disabled={isOffline}
              onClick={() => setTilt((t) => clamp(t + PTZ_STEP, -TILT_LIMIT, TILT_LIMIT))}
              aria-label="Tilt down"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </PtzIconButton>
          </PtzGroup>

          <PtzGroup label="Zoom">
            <PtzIconButton
              disabled={isOffline}
              onClick={() => setZoom((z) => clamp(z - ZOOM_STEP, ZOOM_MIN, ZOOM_MAX))}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </PtzIconButton>
            <span className="min-w-[34px] text-center font-mono text-[10px] font-bold text-[#0b1c30]">
              {zoom.toFixed(1)}×
            </span>
            <PtzIconButton
              disabled={isOffline}
              onClick={() => setZoom((z) => clamp(z + ZOOM_STEP, ZOOM_MIN, ZOOM_MAX))}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </PtzIconButton>
          </PtzGroup>

          <button
            type="button"
            onClick={resetPtz}
            disabled={isOffline}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-[#dfe5ee] px-3 py-1.5 text-[8px] font-semibold text-[#536174] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  )
}

function PtzGroup({ label, children }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[7px] font-bold uppercase tracking-[0.1em] text-[#8b95a5]">
        {label}
      </span>
      {children}
    </div>
  )
}

function PtzIconButton({ children, ...props }) {
  return (
    <button
      type="button"
      className="grid h-8 w-8 place-items-center rounded-lg border border-[#e3e8f0] bg-white text-[#334155] transition-colors hover:bg-[#eef3ff] hover:text-[#00288e] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#334155]"
      {...props}
    >
      {children}
    </button>
  )
}