import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Download,
  Grid2X2,
  List,
  RefreshCw,
  Search,
  VideoOff,
  WifiOff,
} from 'lucide-react'

const makeCamera = (
  tenderNo,
  location,
  area,
  {
    mounting = 'Existing Structure & Angle Require',
    jbNo = '1',
    poleNo = '',
    status = 'safe',
    streamUrl = '',
  } = {}
) => ({
  id: `CAM-${String(tenderNo).padStart(2, '0')}`,
  tenderNo,
  type: 'PTZ',
  location,
  area,
  mounting,
  jbNo,
  poleNo,
  status,
  streamUrl,
})

const CAMERAS = [
  makeCamera(8, 'Conveyor 3 A/B TE (Crusher house -1)', 'Conveyor 3 A/B TE'),
  makeCamera(9, 'Conveyor 8 A/B TE (Crusher house -1)', 'Conveyor 8 A/B TE'),
  makeCamera(7, 'RP gate floor crusher house-1', 'Coal Gate'),

  makeCamera(
    6,
    'Conveyor 2 A/B DE (Crusher house -1)',
    'Conveyor 2 A/B DE',
    {
      mounting: 'Wall & Angle Require',
      status: 'high',
    }
  ),

  makeCamera(55, 'Crusher house 1 Top floor', 'Coal Yard'),

  makeCamera(
    5,
    'Conveyor 2 A/B tail pulley',
    'Conveyor 2 A/B tail pulley'
  ),

  makeCamera(
    4,
    'Conveyor 2 A/B TE (TP -1)',
    'Conveyor 2 A/B TE',
    {
      mounting: 'Wall Mount',
    }
  ),

  makeCamera(
    1,
    'Conveyor 1 A/B DE Centre',
    'Conveyor 1 A/B DE',
    {
      mounting: 'Wall Mount',
    }
  ),

  makeCamera(
    2,
    'TH-1 - conveyor 1 A side (beam no 25)',
    'Conveyor 1 A side Middle'
  ),

  makeCamera(
    3,
    'TH-1 - conveyor 1 B side (beam no 25)',
    'Conveyor 1 B side Middle'
  ),

  makeCamera(
    59,
    'Track Hopper 01 for monitoring of unloading activity',
    'Coal train unloading'
  ),

  makeCamera(
    60,
    'Track Hopper 02 for monitoring of unloading activity',
    'Coal train unloading',
    {
      status: 'critical',
    }
  ),

  makeCamera(
    22,
    'TH-02 - Conveyor 18 A/B TE',
    'Conveyor 18 A/B TE'
  ),

  makeCamera(
    23,
    'TH-2 - conveyor 18 A side (beam no 25)',
    'Conveyor 18 A Middle'
  ),

  makeCamera(
    24,
    'TH-2 - conveyor 18 B side (beam no 25)',
    'Conveyor 18 B Middle'
  ),

  makeCamera(
    25,
    'TH-2 - conveyor 18 A/B CHANDI AREA',
    'Conveyor 18 A/B Middle',
    {
      status: 'medium',
    }
  ),

  makeCamera(
    26,
    'Conveyor 18 A/B DE (TP-17)',
    'Conveyor 18 A/B DE'
  ),

  makeCamera(
    27,
    'Conveyor 19 A/B TE (TP-17)',
    'Conveyor 19 A/B TE'
  ),

  makeCamera(56, 'Crusher house 2 Top floor', 'Coal Yard'),

  makeCamera(
    28,
    'Conveyor 19 A/B DE (Crusher house-2)',
    'Conveyor 19 A/B DE'
  ),

  makeCamera(
    29,
    'Conveyor 22 A/B TE (Crusher house-2) GROUND FLOOR',
    'Conveyor 22 A/B TE'
  ),

  makeCamera(
    30,
    'Conveyor 20 A/B TE (Crusher house-2)',
    'Conveyor 20 A/B TE'
  ),

  makeCamera(
    12,
    'Conveyor 9 A/B DE (TP -6)',
    'Conveyor 9 A/B DE'
  ),

  makeCamera(
    13,
    'Conveyor 10 A/B DE (TP -7)',
    'Conveyor 10 A/B DE'
  ),

  makeCamera(
    10,
    'Conveyor 8 A/B DE (TP -5)',
    'Conveyor 8 A/B DE'
  ),

  makeCamera(
    14,
    'Conveyor 23 A/B DE (TP -7A)',
    'Conveyor 23 A/B DE'
  ),

  makeCamera(
    54,
    'Conveyor 13 A/B DE (TP-2)',
    'Conveyor 13 A/B DE'
  ),

  makeCamera(
    15,
    'Conveyor 3 A/B DE (TP -2)',
    'Conveyor 3 A/B DE'
  ),

  makeCamera(
    16,
    'Conveyor 4 A/B TE (TP -2)',
    'Conveyor 4 A/B TE'
  ),

  makeCamera(
    17,
    'Conveyor 4 A/B DE (TP -3)',
    'Conveyor 4 A/B DE'
  ),

  makeCamera(
    18,
    'Conveyor 5 A/B DE (TP -4)',
    'Conveyor 5 A/B DE'
  ),

  makeCamera(
    19,
    '200 units bunker floor - 6 A/B TE',
    'Conveyor 6 A/B TE'
  ),

  makeCamera(
    20,
    '200 units bunker floor - 6 A/B DE',
    'Conveyor 6 A/B DE'
  ),

  makeCamera(
    44,
    'Unit 6 Bunker 17 B',
    'Conveyor 17 B DE',
    {
      status: 'medium',
    }
  ),

  makeCamera(
    11,
    'Conveyor 14 A/B (TP -16)',
    'Conveyor 14 A/B DE'
  ),

  makeCamera(
    43,
    'Conveyor 14 A/B (TP-15)',
    'Conveyor 14 A/B DE'
  ),

  makeCamera(
    42,
    'Unit 6 Bunker 17 A',
    'Conveyor 17 A TE'
  ),

  makeCamera(
    40,
    'Unit 5 Bunker 16 B',
    'Conveyor 16 B TE'
  ),

  makeCamera(
    41,
    'Conveyor 14 A/B (TP-14)',
    'Conveyor 14 A/B TE'
  ),

  makeCamera(
    38,
    'Conveyor 14 A/B (TP-13)',
    'Conveyor 14 A/B DE'
  ),

  makeCamera(
    39,
    'Unit 5 Bunker 16 A',
    'Conveyor 16 A TE'
  ),

  makeCamera(
    37,
    'Unit 4 Bunker 15 B',
    'Conveyor 15 A TE'
  ),

  makeCamera(
    35,
    'Conveyor 14 A/B (TP-12)',
    'Conveyor 14 A/B (TP-12) DE'
  ),

  makeCamera(
    36,
    'Unit 4 Bunker 15 A',
    'Conveyor 15 A TE'
  ),

  makeCamera(
    34,
    'Conveyor 14 A/B TE (TP-11)',
    'Conveyor 14 B TE'
  ),

  makeCamera(
    33,
    'Conveyor 21 A/B DE (TP-19)',
    'Conveyor 21 A/B DE'
  ),

  makeCamera(
    21,
    'Conveyor 7 A/B MIDDLE (TP-19)',
    'Conveyor 7 A/B MIDDLE'
  ),

  makeCamera(
    32,
    'Conveyor 21 A/B TE (TP-18)',
    'Conveyor 21 A/B (TP-18)'
  ),

  makeCamera(
    31,
    'Conveyor 20 A/B DE (TP-18)',
    'Conveyor 20 A/B DE'
  ),

  makeCamera(
    52,
    'Conveyor 12 A/B DE (TP-10)',
    'Conveyor 12 A/B DE'
  ),

  makeCamera(
    53,
    'Conveyor 13 A/B TE (TP-10)',
    'Conveyor 13 A/B TE'
  ),

  makeCamera(
    49,
    'Belt feeder A & B - Chute side (TP-27)',
    'Belt feeder A & B - Chute side'
  ),

  makeCamera(
    57,
    'TP-27 Top floor towards coal yard',
    'Towards coal yard',
    {
      mounting: 'Pole Mount',
      poleNo: 'P1',
    }
  ),

  makeCamera(
    46,
    'Conveyor 11 A DE (TP-8)',
    'Conveyor 11 A DE'
  ),

  makeCamera(
    51,
    'Conveyor 12 A/B MIDDLE (TP-8)',
    'Conveyor 12 A/B MIDDLE'
  ),

  makeCamera(
    45,
    'Conveyor 11 A DE (TP-8 ROOF)',
    'Conveyor 11 A DE',
    {
      mounting: 'Pole Mount',
      poleNo: 'P2',
      status: 'offline',
    }
  ),

  makeCamera(
    48,
    'Conveyor 11 B DE (TP-9)',
    'Conveyor 11 B DE'
  ),

  makeCamera(
    50,
    'Conveyor 12 A/B TE (TP-9)',
    'Conveyor 12 A/B TE'
  ),

  makeCamera(
    47,
    'Conveyor 11 B DE (TP-9 ROOF)',
    'Towards coal yard',
    {
      mounting: 'Pole Mount',
      poleNo: 'P3',
      status: 'offline',
    }
  ),

  makeCamera(
    58,
    'TP-24 Top floor towards coal yard',
    'Towards coal yard'
  ),
]

const CAMERA_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAlN44PGQcG5rD4mG36IU_rP_D9de06b0VGFOx0g1wO18B9bDWFUv-yUynpxFvzDrKiyknaWg-pp1BAfBtKn85qbTRjtUzHq0tcONZc2EBmZWZai0bK2Vq_3HCSBYmiptgkIpNO1fzlhXX8t_biD1SXCOjpD_CtEudEnCAh3RsUWbxIC4Jcy8LyD7m9iSeoH__44AuHcvV7TX1Mop6Awb66yizNoPUL94sHL_B1y7ztWxtVLoZq7vHcNQ',

  'https://lh3.googleusercontent.com/aida-public/AB6AXuDJEVxILO3FdNeDhVEzIQ6XMhsct8VIFDoKiLo-elfATs4Mj4-mpN6pV7uALelkYmxufD0qPkVHvVZSZxMAbZQHbJshyKVLayuDLBH9QoaF1ad4MEQlWT6yczbKSnhWk9en-jJthihjUFiTzAG_9aCkfMUBjL8SxfeZmDlP8K2ij26B0EKaqUGvfHUK_kELqVaZI8AIcNIgZzatiJFfCcUB2Gxv58B09l0J9ONAEUTH0NbbqbXvNzCg8w',

  'https://lh3.googleusercontent.com/aida-public/AB6AXuCeFUhM54vRFaEz1NMscOSi9yDs77Fj6QryiGVsmvMkoqQddvDwuqjSBTG0PmM6GGOIgcZFLgppuecx_WaMWj3ZhulhiQTiu8TjlbrQhcTF1lwURhs-qSnv-yAYZsuTVzSeYcc4Yb__XoTXiNzgv7a72zrHb3yN28ojawP3COzuz8fcxfsYSfMLf8vChaRGRVhnYBCoMO54UfwdzLE5iZUDZXD7YbBnWwQjbMC8wPXYWIUfor6PyO33-w',

  'https://lh3.googleusercontent.com/aida-public/AB6AXuAhLveQm1DAN9YYX_boN00xDVRNX6k8J5KCuDTMRpCAFbz9ZPY8BJC_NmysKcivqIk9G5H8L29_pDzEzKHiHCtMMHrkQUe6uaCOYtUBQFkpfJTu0y1zJyFg8-vm8D96oE5cUqzcqT6muIeG6oDUbGlUtxDf1_cBiBeVUmlCNBpC0jiNSsQo-qbKUu_f8cmZSHZquWHv-NQ6M247Lfqt-LbfME_Gn840FB4_gBLeO-QNuHSVO0avQUxsRA',

  'https://lh3.googleusercontent.com/aida-public/AB6AXuB_RhsvyU4S6dX-gcqNE7vycbAFvcBmNAM9Gp9acEuH05cqDpmaEeo1w5aP-6cgFh0dMLMzDLsXrqy8aZfexzKerwOWbzMd0UQlJs1NpR3133DmlA3stpJ2DOwq5pcBQnHke4UFaqvR_YPyoYQUAxnWxQmgfm45f58WUQsaZSJWpG4zLe2cDlJhSu1i5MvaMNBNIjZp8tCup-WrwjS6zYSy4ZYZ0yxBTm1HDXy7PNThkLWEDho277ztAg',
]

const ALERT_META = {
  critical: {
    detection: 'Fire / Smoke Detected',
  },

  high: {
    detection: 'Restricted Area Entry Detected',
  },

  medium: {
    detection: 'PPE / Safety Compliance Alert',
  },

  offline: {
    detection: 'Signal Loss / Cable Inspection',
  },

  safe: {
    detection: 'Safe — Normal Operation',
  },
}

export default function LiveCamera() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [area, setArea] = useState('all')
  const [view, setView] = useState('grid')
  const [selectedCamera, setSelectedCamera] = useState(null)

  const areas = useMemo(
    () =>
      [
        ...new Set(
          CAMERAS.map((camera) => camera.area)
        ),
      ].sort(),
    []
  )

  const filteredCameras = useMemo(() => {
    const query = search.trim().toLowerCase()

    return CAMERAS.filter((camera) => {
      const matchesSearch =
        !query ||
        camera.id.toLowerCase().includes(query) ||
        camera.location.toLowerCase().includes(query) ||
        camera.area.toLowerCase().includes(query) ||
        camera.type.toLowerCase().includes(query)

      const matchesStatus =
        status === 'all' ||
        camera.status === status

      const matchesArea =
        area === 'all' ||
        camera.area === area

      return (
        matchesSearch &&
        matchesStatus &&
        matchesArea
      )
    })
  }, [search, status, area])

  if (selectedCamera) {
    return (
      <CameraDetails
        camera={selectedCamera}
        onBack={() => setSelectedCamera(null)}
      />
    )
  }

  return (
    <div className="w-full space-y-5">

      {/* HEADER */}
      <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e4ebff] px-2.5 py-1">
            <Camera className="h-3 w-3 text-[#00288e]" />

            <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#00288e]">
              Thermal Power AI CCTV
            </span>
          </div>

          <div className="mt-2 flex items-start gap-2">
            <Camera className="mt-1 h-5 w-5 text-[#00288e]" />

            <div>
              <h1 className="text-[23px] font-bold leading-[25px] tracking-tight text-[#0b1c30]">
                Live Camera Monitoring
              </h1>

              <p className="mt-2 max-w-[420px] text-[10px] leading-4 text-[#6b7280]">
                View and monitor all 60 CCTV cameras across plant facilities in real time.
              </p>
            </div>
          </div>
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

      {/* FILTERS */}
      <section className="rounded-xl bg-white p-3 shadow-[0_1px_8px_rgba(15,35,70,0.05)]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-[#e3e8f0] px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-[#94a0b2]" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by camera number, conveyor, area..."
              className="w-full bg-transparent text-[9px] text-[#25364d] outline-none placeholder:text-[#9aa3b2]"
            />
          </div>

          <select
            value={area}
            onChange={(e) =>
              setArea(e.target.value)
            }
            className="max-w-[230px] rounded-lg border border-[#e3e8f0] bg-[#f7f9fc] px-3 py-2 text-[8px] font-semibold text-[#334155] outline-none"
          >
            <option value="all">
              All Plant Areas (60)
            </option>

            {areas.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-1">
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

            <button
              onClick={() => {
                setSearch('')
                setStatus('all')
                setArea('all')
              }}
              className="grid h-8 w-8 place-items-center rounded-md border border-[#e3e8f0] text-[#64748b] hover:bg-[#f5f7fb]"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="rounded-md bg-[#eef3ff] px-2 py-1.5 text-[7.5px] font-semibold text-[#334155] outline-none"
          >
            <option value="all">
              All Status
            </option>

            <option value="safe">
              Safe
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High Risk
            </option>

            <option value="critical">
              Critical
            </option>

            <option value="offline">
              Offline
            </option>
          </select>

          <span className="rounded-md bg-[#eef3ff] px-2 py-1.5 text-[7.5px] font-semibold text-[#334155]">
            Showing {filteredCameras.length} Cameras
          </span>
        </div>
      </section>

      {/* ALL CAMERA GRID */}
      {view === 'grid' && (
        <section>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[11px] font-bold text-[#0b1c30]">
                Real-Time Video Matrix
              </h2>

              <span className="text-[7px] font-semibold text-[#8b95a5]">
                SHOWING ALL {filteredCameras.length} CAMERAS
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[7px] font-semibold text-[#526174]">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00a36c]" />
                H.265 / RTSP Direct Streams
              </span>

              <span>
                Total Latency Avg: 38ms
              </span>
            </div>
          </div>

          {filteredCameras.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredCameras.map(
                (camera, index) => (
                  <CameraCard
                    key={camera.id}
                    camera={camera}
                    index={index}
                    onOpen={() => setSelectedCamera(camera)}
                  />
                )
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-white py-14 text-center shadow-sm">
              <Camera className="mx-auto h-7 w-7 text-[#94a3b8]" />

              <p className="mt-3 text-[11px] font-semibold text-[#334155]">
                No cameras found
              </p>

              <p className="mt-1 text-[9px] text-[#94a3b8]">
                Change search or filter options.
              </p>
            </div>
          )}
        </section>
      )}

      {/* TABLE VIEW */}
      {view === 'table' && (
        <InventoryTable cameras={filteredCameras} onOpenCamera={setSelectedCamera} />
      )}

      {/* Bottom table always in grid mode */}
      {view === 'grid' && (
        <InventoryTable cameras={filteredCameras} onOpenCamera={setSelectedCamera} />
      )}

    </div>
  )
}

function CameraCard({
  camera,
  index,
  onOpen,
}) {
  const offline =
    camera.status === 'offline'

  const alert =
    camera.status === 'critical' ||
    camera.status === 'high' ||
    camera.status === 'medium'

  const meta =
    ALERT_META[camera.status] ||
    ALERT_META.safe

  const image =
    CAMERA_IMAGES[
      index % CAMERA_IMAGES.length
    ]

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white shadow-[0_1px_6px_rgba(15,35,70,0.06)] ${
        camera.status === 'critical'
          ? 'border-[#ef9a9a]'
          : 'border-[#e6ebf2]'
      }`}
    >
      {offline ? (
        <div className="flex aspect-[16/8.5] flex-col items-center justify-center bg-[#dbe8fb]">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/60">
            <WifiOff className="h-5 w-5 text-[#7890ad]" />
          </div>

          <p className="mt-2 text-[9px] font-bold text-[#536174]">
            CAMERA OFFLINE
          </p>

          <p className="mt-1 text-[7px] text-[#7d8da3]">
            RTSP signal unavailable
          </p>
        </div>
      ) : (
        <div className="relative aspect-[16/8.5] overflow-hidden bg-[#172536]">
          <img
            src={image}
            alt={camera.location}
            className="h-full w-full object-cover"
          />

          <div className="absolute left-2 top-2 flex gap-1">
            <span
              className={`rounded px-1.5 py-0.5 text-[6px] font-bold text-white ${
                camera.status === 'critical'
                  ? 'bg-[#ba1a1a]'
                  : 'bg-[#009b69]'
              }`}
            >
              {camera.status === 'critical'
                ? 'ALARM ACTIVE'
                : '● LIVE'}
            </span>

            <span className="rounded bg-black/65 px-1.5 py-0.5 text-[6px] font-semibold text-white">
              PTZ
            </span>
          </div>

          <span className="absolute right-2 top-2 rounded bg-black/65 px-1.5 py-0.5 font-mono text-[6px] text-white">
            25 FPS • 1080p
          </span>

          {alert && (
            <DetectionOverlay status={camera.status} />
          )}

          <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[5.5px] text-white">
            LIVE STREAM
          </span>
        </div>
      )}

      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[7px] font-bold uppercase text-[#00288e]">
              {camera.id} · {camera.type}
            </p>

            <h3 className="mt-1 text-[10px] font-bold leading-tight text-[#14243a]">
              {camera.location}
            </h3>
          </div>

          <StatusBadge status={camera.status} />
        </div>

        <p className="mt-1.5 text-[7px] leading-3 text-[#657286]">
          Area of Interest:{' '}
          <span className="font-semibold">
            {camera.area}
          </span>
        </p>

        <p className="mt-0.5 text-[7px] leading-3 text-[#657286]">
          Mounting: {camera.mounting}
        </p>

        {camera.poleNo && (
          <p className="mt-0.5 text-[7px] text-[#657286]">
            Pole No: {camera.poleNo}
          </p>
        )}

        {camera.jbNo && (
          <p className="mt-0.5 text-[7px] text-[#657286]">
            JB No: {camera.jbNo}
          </p>
        )}

        {alert && (
          <p
            className={`mt-1 text-[7px] font-semibold ${
              camera.status === 'critical'
                ? 'text-[#ba1a1a]'
                : camera.status === 'high'
                  ? 'text-[#b45c00]'
                  : 'text-[#8b6d00]'
            }`}
          >
            AI: {meta.detection}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {!offline && (
              <>
                <button className="rounded-md border border-[#dfe5ee] px-2 py-1 text-[6.5px] font-semibold text-[#536174]">
                  Snapshot
                </button>

                <button className="rounded-md border border-[#dfe5ee] px-2 py-1 text-[6.5px] font-semibold text-[#536174]">
                  PTZ Preset
                </button>
              </>
            )}

            {camera.status === 'critical' && (
              <button className="rounded-md bg-[#e32222] px-2 py-1 text-[6.5px] font-bold text-white">
                Auto-Dispatch
              </button>
            )}
          </div>

          <button
            onClick={onOpen}
            className="shrink-0 text-[6.5px] font-bold text-[#00288e] hover:underline"
          >
            View Live →
          </button>
        </div>
      </div>
    </article>
  )
}

function DetectionOverlay({
  status,
}) {
  if (status === 'critical') {
    return (
      <div className="absolute left-[27%] top-[22%] h-[50%] w-[43%] border-2 border-red-500 bg-red-500/10">
        <span className="absolute -top-[17px] left-0 whitespace-nowrap bg-red-600 px-1.5 py-0.5 text-[6px] font-bold text-white">
          FIRE/SMOKE 99.4%
        </span>
      </div>
    )
  }

  if (status === 'high') {
    return (
      <div className="absolute right-[18%] top-[22%] h-[53%] w-[29%] border-2 border-orange-500 bg-orange-500/10">
        <span className="absolute -top-[17px] left-0 whitespace-nowrap bg-orange-500 px-1.5 py-0.5 text-[6px] font-bold text-white">
          RESTRICTED ZONE 98%
        </span>
      </div>
    )
  }

  return (
    <div className="absolute left-[26%] top-[28%] h-[38%] w-[40%] border-2 border-yellow-500 bg-yellow-500/10">
      <span className="absolute -top-[17px] left-0 whitespace-nowrap bg-[#c28b00] px-1.5 py-0.5 text-[6px] font-bold text-white">
        PPE / SAFETY ALERT
      </span>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    safe: 'bg-[#dcf7e8] text-[#00714e]',
    medium: 'bg-[#fff4d7] text-[#806700]',
    high: 'bg-[#fff0dc] text-[#9a5200]',
    critical: 'bg-[#ffe1df] text-[#ba1a1a]',
    offline: 'bg-[#edf0f5] text-[#64748b]',
  }

  const labels = {
    safe: 'SAFE',
    medium: 'MEDIUM',
    high: 'HIGH RISK',
    critical: 'CRITICAL',
    offline: 'OFFLINE',
  }

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[6px] font-bold ${
        styles[status]
      }`}
    >
      {labels[status]}
    </span>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
  type,
}) {
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
        <Icon
          className={`h-4 w-4 ${style.icon}`}
        />
      </div>

      <div>
        <p
          className={`text-[19px] font-bold leading-none ${style.value}`}
        >
          {value}
        </p>

        <p className="mt-1 text-[6px] font-bold uppercase leading-[8px] tracking-[0.06em] text-[#64748b]">
          {label}
        </p>
      </div>
    </div>
  )
}

function InventoryTable({
  cameras,
  onOpenCamera,
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#dfe5ee] bg-white shadow-[0_1px_8px_rgba(15,35,70,0.04)]">
      <div className="flex flex-col justify-between gap-2 bg-[#eef4ff] px-4 py-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-[11px] font-bold text-[#10213a]">
            Camera Master Inventory & Telemetry Status
          </h2>

          <p className="mt-0.5 text-[7px] text-[#657286]">
            Click any camera name or Live button to open monitoring
          </p>
        </div>

        <button className="flex w-fit items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-[7px] font-semibold text-[#00288e] shadow-sm">
          <Download className="h-3 w-3" />
          Export Telemetry CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-collapse">
          <thead>
            <tr className="bg-[#dce8fb] text-left">
              <Th>#</Th>
              <Th>CAMERA</Th>
              <Th>CAMERA LOCATION</Th>
              <Th>TYPE</Th>
              <Th>AREA OF INTEREST</Th>
              <Th>MOUNTING / POLE</Th>
              <Th>JB DETAILS</Th>
              <Th>STATUS</Th>
              <Th>ACTIVE SAFETY DETECTION</Th>
              <Th>ACTION</Th>
            </tr>
          </thead>

          <tbody>
            {cameras.map((camera) => (
              <InventoryRow
                key={camera.id}
                camera={camera}
                onOpen={() => onOpenCamera(camera)}
              />
            ))}
          </tbody>
        </table>
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

function InventoryRow({
  camera,
  onOpen,
}) {
  const meta =
    ALERT_META[camera.status] ||
    ALERT_META.safe

  return (
    <tr className="border-t border-[#edf0f5] hover:bg-[#fafcff]">
      <td className="px-3 py-2 text-[7px] font-bold text-[#00288e]">
        {camera.tenderNo}
      </td>

      <td className="px-3 py-2">
        <button
          onClick={onOpen}
          className="flex items-center gap-1.5 text-[7px] font-bold text-[#00288e] hover:underline"
        >
          <Camera className="h-3 w-3" />
          {camera.id}
        </button>
      </td>

      <td className="max-w-[220px] px-3 py-2">
        <button
          onClick={onOpen}
          className="text-left text-[7px] font-semibold text-[#25364d] hover:text-[#00288e] hover:underline"
        >
          {camera.location}
        </button>
      </td>

      <td className="px-3 py-2 text-[7px] text-[#536174]">
        {camera.type}
      </td>

      <td className="px-3 py-2 text-[7px] text-[#536174]">
        {camera.area}
      </td>

      <td className="px-3 py-2 text-[7px] text-[#536174]">
        {camera.mounting}

        {camera.poleNo && (
          <span className="block font-semibold text-[#00288e]">
            Pole {camera.poleNo}
          </span>
        )}
      </td>

      <td className="px-3 py-2 text-[7px] text-[#536174]">
        {camera.jbNo
          ? `JB No: ${camera.jbNo}`
          : '—'}
      </td>

      <td className="px-3 py-2">
        <StatusBadge
          status={camera.status}
        />
      </td>

      <td
        className={`px-3 py-2 text-[7px] font-medium ${
          camera.status === 'critical'
            ? 'text-[#ba1a1a]'
            : camera.status === 'high'
              ? 'text-[#9a5200]'
              : camera.status === 'medium'
                ? 'text-[#806700]'
                : camera.status === 'offline'
                  ? 'text-[#64748b]'
                  : 'text-[#00714e]'
        }`}
      >
        {meta.detection}
      </td>

      <td className="px-3 py-2">
        <ActionButton status={camera.status} onOpen={onOpen} />
      </td>
    </tr>
  )
}

function ActionButton({
  status,
  onOpen,
}) {
  if (status === 'critical') {
    return (
      <button onClick={onOpen} className="rounded bg-[#e32222] px-2 py-1 text-[6px] font-bold text-white">
        Dispatch
      </button>
    )
  }

  if (status === 'high') {
    return (
      <button onClick={onOpen} className="rounded bg-[#e32222] px-2 py-1 text-[6px] font-bold text-white">
        Respond
      </button>
    )
  }

  if (status === 'offline') {
    return (
      <button onClick={onOpen} className="rounded bg-[#e7ebf2] px-2 py-1 text-[6px] font-bold text-[#64748b]">
        Diag
      </button>
    )
  }

  return (
    <button onClick={onOpen} className="rounded bg-[#e6edff] px-2 py-1 text-[6px] font-bold text-[#00288e]">
      Live
    </button>
  )
}

function CameraDetails({ camera, onBack }) {
  const [zoom, setZoom] = useState(3.2)
  const [ptzSpeed, setPtzSpeed] = useState(50)
  const [acknowledged, setAcknowledged] = useState(false)

  const offline = camera.status === 'offline'
  const isAlert =
    camera.status === 'high' ||
    camera.status === 'critical' ||
    camera.status === 'medium'

  const cameraIndex = CAMERAS.findIndex((item) => item.id === camera.id)
  const image =
    CAMERA_IMAGES[Math.max(cameraIndex, 0) % CAMERA_IMAGES.length]

  const modules = [
    ['Fire / Smoke', 'Thermal and optical smoke monitoring active', camera.status === 'critical' ? 'TRIGGERED' : 'SAFE'],
    ['Helmet PPE', 'Mandatory hardhat compliance active', 'SAFE'],
    ['Safety Footwear', 'Steel-toe boot detection active', camera.status === 'medium' ? 'TRIGGERED' : 'SAFE'],
    ['Gloves Check', 'Hand protection compliance active', 'SAFE'],
    ['Safety Harness', 'Height work fall protection active', 'SAFE'],
    ['Restricted Zone', 'Unauthorized entry near rotating equipment', camera.status === 'high' ? 'TRIGGERED' : 'SAFE'],
    ['Fallen Person', 'Zero movement / slip-fall detection active', 'SAFE'],
    ['Ash/Dust Leak', 'Chute seal and particulate density normal', 'SAFE'],
  ]

  const recentEvents = [
    {
      title:
        camera.status === 'critical'
          ? 'Fire / Smoke Detection'
          : camera.status === 'high'
            ? 'Restricted Zone Entry'
            : camera.status === 'medium'
              ? 'PPE Compliance Alert'
              : 'Routine Camera Health Check',
      time: '14:32:08',
      text: `${camera.id} · ${camera.location}`,
      sub:
        camera.status === 'safe'
          ? 'Status: Normal operation'
          : 'Safety event logged by edge AI',
      severity:
        camera.status === 'safe'
          ? 'safe'
          : camera.status === 'medium'
            ? 'medium'
            : 'high',
    },
    {
      title: 'Shift Inspection Acknowledged',
      time: '12:15:20',
      text: 'Verified by Control Room Operator',
      sub: 'Status: Safe Compliance',
      severity: 'safe',
    },
    {
      title: 'Minor Dust Cloud Detected',
      time: '09:40:11',
      text: 'Transient plume during conveyor operation',
      sub: 'Status: Auto-resolved',
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

  return (
    <div className="w-full space-y-4">
      <section>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-[#00288e] hover:underline"
        >
          ← Back to Live Cameras
        </button>

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

            <p className="mt-1 max-w-[520px] text-[9px] leading-4 text-slate-500">
              Real-time AI video stream, hardware telemetry, PTZ operation and active safety detection modules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[7px] font-bold ${
                offline
                  ? 'bg-[#edf0f5] text-[#64748b]'
                  : 'bg-[#dcf7e8] text-[#00714e]'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  offline ? 'bg-[#94a3b8]' : 'bg-[#00a36c]'
                }`}
              />
              {offline ? 'STREAM OFFLINE' : 'LIVE STREAM'}
            </span>

            <span className="rounded-full bg-[#eef3ff] px-2.5 py-1.5 text-[7px] font-semibold text-[#00288e]">
              25 FPS · 1080p · RTSP
            </span>

            <span className="rounded-full bg-[#eef3ff] px-2.5 py-1.5 text-[7px] font-semibold text-[#334155]">
              JB No: {camera.jbNo || '—'} · {offline ? 'Disconnected' : 'Connected'}
            </span>

            {isAlert && (
              <button className="rounded-lg bg-[#9b000d] px-3 py-2 text-[8px] font-bold text-white">
                Report Hazard
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_8px_rgba(15,35,70,0.06)]">
            <div className="relative aspect-video overflow-hidden bg-[#101828]">
              {offline ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#182536] text-white">
                  <WifiOff className="h-12 w-12 text-[#8291a7]" />
                  <h3 className="mt-4 text-[15px] font-bold">Camera Offline</h3>
                  <p className="mt-1 text-[10px] text-[#94a3b8]">
                    RTSP stream unavailable
                  </p>
                </div>
              ) : camera.streamUrl ? (
                <video
                  src={camera.streamUrl}
                  autoPlay
                  muted
                  controls
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={image}
                  alt={camera.location}
                  className="h-full w-full object-cover"
                />
              )}

              {!offline && (
                <>
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
                      25 FPS · 1080p
                    </span>
                  </div>

                  {isAlert && <DetectionOverlay status={camera.status} />}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                    <div className="rounded bg-black/70 px-2 py-1 font-mono text-[7px] text-white">
                      PTZ AZIMUTH 184.2° | ELEVATION -14.6° | ZOOM {zoom.toFixed(1)}X
                    </div>

                    <div className="rounded bg-black/70 px-2 py-1 text-[7px] text-[#72f1b8]">
                      OPTICAL AI · CODEC H.265
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1f7] px-3 py-2.5">
              <div className="flex items-center gap-2">
                <button className="grid h-7 w-7 place-items-center rounded-md bg-[#eef3ff] text-[#00288e]">
                  ◉
                </button>
                <button className="grid h-7 w-7 place-items-center rounded-md bg-[#eef3ff] text-[#00288e]">
                  🔊
                </button>
                <span className="text-[7px] text-[#657286]">
                  Edge AI Latency: <b>19ms</b>
                </span>
              </div>

              {!offline && (
                <span className="rounded bg-[#ba1a1a] px-2 py-1 text-[6px] font-bold text-white">
                  LIVE
                </span>
              )}
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

          <section className="rounded-xl bg-white p-4 shadow-[0_1px_8px_rgba(15,35,70,0.05)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[11px] font-bold text-[#10213a]">
                  PTZ Camera Controls
                </h2>
                <p className="mt-1 text-[7px] text-slate-500">
                  Pan, tilt, optical zoom, focus and preset controls.
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
                  {ptzSpeed}%
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-lg bg-[#f4f7fc] p-4">
                <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-slate-400">
                  Pan & Tilt Direction Pad
                </p>

                <div className="mx-auto mt-3 grid w-[110px] grid-cols-3 gap-2">
                  <div />
                  <PtzButton text="↑" />
                  <div />
                  <PtzButton text="←" />
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-[#00288e] text-[6px] font-bold text-white">
                    HOME
                  </button>
                  <PtzButton text="→" />
                  <div />
                  <PtzButton text="↓" />
                  <div />
                </div>
              </div>

              <div className="rounded-lg bg-[#f4f7fc] p-4">
                <div className="grid grid-cols-2 gap-2">
                  <SmallTelemetry label="Optical Zoom" value={`${zoom.toFixed(1)}x`} />
                  <SmallTelemetry label="Optical" value="32x" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setZoom((value) => Math.min(32, value + 0.5))}
                    className="rounded-md bg-white px-2 py-2 text-[7px] font-semibold text-[#00288e]"
                  >
                    Zoom In (+)
                  </button>

                  <button
                    onClick={() => setZoom((value) => Math.max(1, value - 0.5))}
                    className="rounded-md bg-white px-2 py-2 text-[7px] font-semibold text-[#00288e]"
                  >
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
                      <span className="text-[#00288e]">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white p-4 shadow-[0_1px_8px_rgba(15,35,70,0.05)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[11px] font-bold text-[#10213a]">
                  AI Safety Detection Modules Running on {camera.id}
                </h2>
                <p className="mt-1 text-[7px] text-slate-500">
                  Real-time edge neural inference for personnel compliance and equipment hazards.
                </p>
              </div>

              <span className="rounded-full bg-[#e5edff] px-2.5 py-1 text-[7px] font-bold text-[#00288e]">
                8 Modules Deployed
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              {modules.map(([title, description, status]) => (
                <AiModule
                  key={title}
                  title={title}
                  description={description}
                  status={status}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 xl:col-span-4">
          {isAlert && (
            <section className="overflow-hidden rounded-xl bg-white shadow-[0_1px_8px_rgba(15,35,70,0.06)]">
              <div className="bg-[#fff2f1] p-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ffe0dc] px-2 py-1 text-[7px] font-bold text-[#9b000d]">
                    ⚠ HIGH SEVERITY ALERT
                  </span>
                  <span className="text-[7px] text-slate-500">14:32:08</span>
                </div>

                <div className="mt-4 space-y-4">
                  <AlertQuestion
                    number="1."
                    label="WHAT HAPPENED?"
                    value={ALERT_META[camera.status]?.detection || 'Safety event detected'}
                  />
                  <AlertQuestion
                    number="2."
                    label="WHERE?"
                    value={`${camera.id} — ${camera.location}`}
                  />
                  <AlertQuestion
                    number="3."
                    label="HOW SERIOUS?"
                    value="Safety boundary breached while monitored equipment is active"
                    danger
                  />
                  <AlertQuestion
                    number="4."
                    label="WHAT SHOULD OPERATOR DO?"
                    value="Acknowledge the event, verify the live feed and notify field patrol if required."
                    danger
                  />
                </div>
              </div>

              <div className="p-3">
                <button className="w-full rounded-lg bg-[#ba1a1a] py-2 text-[8px] font-bold text-white">
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

          <section className="rounded-xl bg-white p-4 shadow-[0_1px_8px_rgba(15,35,70,0.05)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold text-[#10213a]">
                Camera Hardware Profile
              </h2>
              <span className="rounded bg-[#eef3ff] px-2 py-1 text-[6px] font-semibold text-[#00288e]">
                Annexure 1
              </span>
            </div>

            <div className="mt-4 divide-y divide-[#edf1f7]">
              <HardwareRow label="Camera Number" value={camera.id} />
              <HardwareRow label="Tender Item No." value={`S/N ${camera.tenderNo || '—'}`} />
              <HardwareRow label="Location" value={camera.location} />
              <HardwareRow label="Area of Interest" value={camera.area} />
              <HardwareRow label="Camera Type" value="PTZ Industrial Dome (RTSP/IP67)" />
              <HardwareRow label="Pole Number" value={camera.poleNo || 'Not Applicable'} />
              <HardwareRow label="Mounting / Structure" value={camera.mounting} />
              <HardwareRow label="Junction Box" value={`JB No: ${camera.jbNo || '—'}`} />
              <HardwareRow label="Power Feed" value="UPS Power 230V AC backed (CHP Room)" />
              <HardwareRow label="IP / Port" value="10.14.82.104 : 554" />
              <HardwareRow label="Optical Spec" value="32x Optical / 120dB WDR" />
            </div>

            <div className="mt-3 rounded-lg bg-[#e8f8f0] px-3 py-2">
              <p className="text-[7px] font-semibold text-[#00714e]">
                ✓ Routine Inspection Completed
              </p>
              <p className="mt-0.5 text-[6px] text-[#536174]">
                Optics Clean · System Nominal
              </p>
            </div>
          </section>

          <section className="rounded-xl bg-white p-4 shadow-[0_1px_8px_rgba(15,35,70,0.05)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold text-[#10213a]">
                Recent Events Log
              </h2>
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
              <span>→</span>
            </button>
          </section>
        </aside>
      </section>
    </div>
  )
}

function PtzButton({ text }) {
  return (
    <button className="grid h-9 w-9 place-items-center rounded-lg bg-white text-sm font-bold text-[#00288e] shadow-sm transition hover:bg-[#e8eeff]">
      {text}
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

function AiModule({ title, description, status }) {
  const triggered = status === 'TRIGGERED'

  return (
    <div
      className={`rounded-lg border p-3 ${
        triggered
          ? 'border-[#ffd79d] bg-[#fff8e8]'
          : 'border-[#edf1f7] bg-[#f8faff]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[7px] ${triggered ? 'text-[#c77700]' : 'text-[#00714e]'}`}>
          ●
        </span>
        <span
          className={`text-[5.5px] font-bold ${
            triggered ? 'text-[#c77700]' : 'text-[#00714e]'
          }`}
        >
          {status}
        </span>
      </div>

      <p className="mt-2 text-[7px] font-bold text-[#25364d]">{title}</p>
      <p className="mt-1 text-[6px] leading-3 text-[#7b8798]">{description}</p>
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
      <span className="text-[6px] font-semibold text-[#8a94a4]">{label}:</span>
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
            <p className="text-[7px] font-bold text-[#25364d]">{event.title}</p>
            <span className="font-mono text-[5.5px] text-slate-400">{event.time}</span>
          </div>

          <p className="mt-1 text-[6px] leading-3 text-[#657286]">{event.text}</p>
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
