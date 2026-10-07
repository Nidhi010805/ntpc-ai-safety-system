import {
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Circle,
  Download,
  Eye,
  EyeOff,
  Grid2X2,
  List,
  LocateFixed,
  Maximize,
  Minimize,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Square,
  Trash2,
  VideoOff,
  Volume2,
  VolumeX,
  WifiOff,
  X,
} from 'lucide-react'
import {
  MAX_PRESETS,
  PRESET_NAME_MAX,
  TILT_MAX,
  TILT_MIN,
  ZOOM_MAX,
  ZOOM_MIN,
  captureSnapshot,
  clamp,
  clockTime,
  currentSecond,
  downloadCsv,
  enterDocumentFullscreen,
  exitDocumentFullscreen,
  fileStamp,
  getPresets,
  nextPresetId,
  osdTime,
  ptzView,
  round1,
  setCameraPresets,
  subscribeToPresets,
  subscribeToSeconds,
  viewTransform,
  wrapDegrees,
} from '../lib/cameraOps'

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

const CAMERA_INDEX = new Map(CAMERAS.map((camera, index) => [camera.id, index]))
const CAMERA_BY_ID = new Map(CAMERAS.map((camera) => [camera.id, camera]))

const imageFor = (camera) =>
  CAMERA_IMAGES[(CAMERA_INDEX.get(camera.id) ?? 0) % CAMERA_IMAGES.length]

// Box geometry is in % of the frame so the same data drives the overlay and the snapshot.
const DETECTIONS = {
  critical: {
    left: 27, top: 22, width: 43, height: 50,
    label: 'FIRE/SMOKE 99.4%',
    border: '#ef4444', fill: 'rgba(239, 68, 68, 0.1)', labelBg: '#dc2626',
  },
  high: {
    left: 53, top: 22, width: 29, height: 53,
    label: 'RESTRICTED ZONE 98%',
    border: '#f97316', fill: 'rgba(249, 115, 22, 0.1)', labelBg: '#f97316',
  },
  medium: {
    left: 26, top: 28, width: 40, height: 38,
    label: 'PPE / SAFETY ALERT',
    border: '#eab308', fill: 'rgba(234, 179, 8, 0.1)', labelBg: '#c28b00',
  },
}

const homePosition = (camera) => ({
  pan: wrapDegrees(camera.tenderNo * 47.3 + 12.5),
  tilt: round1(-8 - ((camera.tenderNo * 3.7) % 14)),
  zoom: 1,
})

const MAX_EVENTS = 12
let eventSeq = 0

function seedEvents(camera) {
  const titles = {
    critical: 'Fire / Smoke Detection',
    high: 'Restricted Zone Entry',
    medium: 'PPE Compliance Alert',
  }

  return [
    {
      id: `seed-${camera.id}-1`,
      title: titles[camera.status] || 'Routine Camera Health Check',
      time: '14:32:08',
      text: `${camera.id} · ${camera.location}`,
      sub: camera.status === 'safe' ? 'Status: Normal operation' : 'Safety event logged by edge AI',
      severity: camera.status === 'safe' ? 'safe' : camera.status === 'medium' ? 'medium' : 'high',
    },
    {
      id: `seed-${camera.id}-2`,
      title: 'Shift Inspection Acknowledged',
      time: '12:15:20',
      text: 'Verified by Control Room Operator',
      sub: 'Status: Safe Compliance',
      severity: 'safe',
    },
    {
      id: `seed-${camera.id}-3`,
      title: 'Minor Dust Cloud Detected',
      time: '09:40:11',
      text: 'Transient plume during conveyor operation',
      sub: 'Status: Auto-resolved',
      severity: 'medium',
    },
    {
      id: `seed-${camera.id}-4`,
      title: 'Shift B Diagnostics Passed',
      time: '06:00:00',
      text: 'PTZ motor calibration, optical wiper & AI sync nominal',
      sub: 'Status: 100% Operational',
      severity: 'safe',
    },
  ]
}

const DEFAULT_OPS = new Map()
const NO_PRESETS = []

// Per-camera operational state (PTZ position, alert actions, event log).
// Kept above the page views so a camera stays where the operator left it.
// Saved presets are separate: they live in the cameraOps preset store and survive reloads.
function defaultOps(camera) {
  if (!DEFAULT_OPS.has(camera.id)) {
    const home = homePosition(camera)

    DEFAULT_OPS.set(camera.id, {
      home,
      ptz: home,
      focus: { mode: 'auto', value: 50 },
      activePreset: null,
      acknowledged: false,
      dispatched: false,
      hazardReported: false,
      events: seedEvents(camera),
    })
  }

  return DEFAULT_OPS.get(camera.id)
}

const focusBlur = (focus) =>
  focus.mode === 'auto' ? 0 : Math.abs(focus.value - 50) / 10

async function takeSnapshot({ camera, ops, aspect, showBoxes }) {
  const detection = DETECTIONS[camera.status]
  const fileName = `${camera.id}_${fileStamp()}.jpg`
  const { pan, tilt, zoom } = ops.ptz

  await captureSnapshot({
    imageUrl: imageFor(camera),
    aspect,
    view: ptzView(ops.ptz, ops.home),
    blurPx: focusBlur(ops.focus),
    boxes: showBoxes && detection ? [detection] : [],
    caption: {
      left: `${camera.id} · ${camera.area}`,
      right: `AZ ${pan.toFixed(1)}° EL ${tilt.toFixed(1)}° ${zoom.toFixed(1)}X · ${new Date().toLocaleString('en-GB')}`,
    },
    fileName,
  })

  return fileName
}

export default function LiveCamera() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [area, setArea] = useState('all')
  const [view, setView] = useState('grid')
  const [selectedCamera, setSelectedCamera] = useState(null)
  // Where the fullscreen viewer was opened from ('grid' | 'details'), so exit returns there.
  const [fullscreenFrom, setFullscreenFrom] = useState(null)
  const [ops, setOps] = useState({})
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const gridScroll = useRef(0)
  const presets = useSyncExternalStore(subscribeToPresets, getPresets)

  const opsFor = (camera) => ops[camera.id] ?? defaultOps(camera)
  const presetsFor = (camera) => presets[camera.id] ?? NO_PRESETS

  const updateOps = useCallback((id, change) => {
    setOps((prev) => {
      const current = prev[id] ?? defaultOps(CAMERA_BY_ID.get(id))
      return { ...prev, [id]: { ...current, ...change(current) } }
    })
  }, [])

  const logEvent = useCallback(
    (id, event) => {
      eventSeq += 1
      const entry = {
        id: `evt-${eventSeq}`,
        time: clockTime(),
        severity: 'safe',
        ...event,
      }
      updateOps(id, (current) => ({
        events: [entry, ...current.events].slice(0, MAX_EVENTS),
      }))
    },
    [updateOps]
  )

  const notify = useCallback((title, message, tone = 'success') => {
    clearTimeout(toastTimer.current)
    setToast({ title, message, tone })
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }, [])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const openCamera = (camera) => {
    gridScroll.current = window.scrollY
    setSelectedCamera(camera)
  }

  useLayoutEffect(() => {
    window.scrollTo(0, selectedCamera ? 0 : gridScroll.current)
  }, [selectedCamera])

  useEffect(() => exitDocumentFullscreen, [])

  const openFullscreenFromGrid = (camera) => {
    enterDocumentFullscreen()
    openCamera(camera)
    setFullscreenFrom('grid')
  }

  const enterFullscreen = () => {
    enterDocumentFullscreen()
    setFullscreenFrom('details')
  }

  const exitFullscreen = () => {
    exitDocumentFullscreen()
    if (fullscreenFrom === 'grid') setSelectedCamera(null)
    setFullscreenFrom(null)
  }

  // preset === null means the camera's home position.
  const openAtPosition = (camera, preset) => {
    updateOps(camera.id, (current) => ({
      ptz: preset ? preset.position : current.home,
      activePreset: preset ? preset.id : null,
    }))
    openCamera(camera)
  }

  const snapshot = async (camera, aspect, showBoxes) => {
    try {
      const fileName = await takeSnapshot({
        camera,
        ops: opsFor(camera),
        aspect,
        showBoxes,
      })
      logEvent(camera.id, {
        title: 'Snapshot Captured',
        text: fileName,
        sub: 'Evidence image exported by operator',
      })
      notify('Snapshot saved', `${fileName} downloaded`)
    } catch (error) {
      notify('Snapshot failed', error.message, 'error')
    }
  }

  const dispatchTeam = (camera) => {
    updateOps(camera.id, () => ({ dispatched: true }))
    logEvent(camera.id, {
      title: 'Response Team Dispatched',
      text: `${camera.id} · ${camera.location}`,
      sub: 'Status: Field patrol en route',
      severity: 'high',
    })
    notify(
      'Response team dispatched',
      `Field patrol en route to ${camera.id} · ${camera.area}`
    )
  }

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

  const exportTelemetry = () => {
    const header = [
      'Tender No',
      'Camera',
      'Location',
      'Type',
      'Area of Interest',
      'Mounting',
      'Pole No',
      'JB No',
      'Status',
      'Active Safety Detection',
      'PTZ Azimuth (deg)',
      'PTZ Elevation (deg)',
      'Zoom (x)',
    ]

    const rows = filteredCameras.map((camera) => {
      const { ptz } = opsFor(camera)

      return [
        camera.tenderNo,
        camera.id,
        camera.location,
        camera.type,
        camera.area,
        camera.mounting,
        camera.poleNo,
        camera.jbNo ? `JB No: ${camera.jbNo}` : '',
        camera.status.toUpperCase(),
        (ALERT_META[camera.status] || ALERT_META.safe).detection,
        ptz.pan.toFixed(1),
        ptz.tilt.toFixed(1),
        ptz.zoom.toFixed(1),
      ]
    })

    const fileName = `camera-telemetry_${fileStamp()}.csv`
    downloadCsv(fileName, header, rows)
    notify('Telemetry exported', `${rows.length} cameras written to ${fileName}`)
  }

  const toastNode = (
    <Toast toast={toast} onClose={() => setToast(null)} />
  )

  if (selectedCamera) {
    return (
      <>
        <CameraDetails
          key={selectedCamera.id}
          camera={selectedCamera}
          ops={opsFor(selectedCamera)}
          presets={presetsFor(selectedCamera)}
          onUpdate={(change) => updateOps(selectedCamera.id, change)}
          onLog={(event) => logEvent(selectedCamera.id, event)}
          onSnapshot={(showBoxes) => snapshot(selectedCamera, 16 / 9, showBoxes)}
          onDispatch={() => dispatchTeam(selectedCamera)}
          notify={notify}
          fullscreen={fullscreenFrom !== null}
          onEnterFullscreen={enterFullscreen}
          onExitFullscreen={exitFullscreen}
          onBack={() => setSelectedCamera(null)}
        />
        {toastNode}
      </>
    )
  }

  return (
    <div className="w-full space-y-5">
      {toastNode}

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
              {filteredCameras.map((camera) => (
                <CameraCard
                  key={camera.id}
                  camera={camera}
                  ops={opsFor(camera)}
                  presets={presetsFor(camera)}
                  onOpen={() => openCamera(camera)}
                  onFullscreen={() => openFullscreenFromGrid(camera)}
                  onOpenAt={(preset) => openAtPosition(camera, preset)}
                  onSnapshot={() => snapshot(camera, 16 / 8.5, true)}
                  onDispatch={() => dispatchTeam(camera)}
                />
              ))}
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

      {/* Inventory table: its own view, and also shown under the grid */}
      <InventoryTable
        cameras={filteredCameras}
        onOpenCamera={openCamera}
        onExport={exportTelemetry}
      />

    </div>
  )
}

function CameraCard({
  camera,
  ops,
  presets,
  onOpen,
  onFullscreen,
  onOpenAt,
  onSnapshot,
  onDispatch,
}) {
  const [presetMenuOpen, setPresetMenuOpen] = useState(false)
  const actionsRef = useRef(null)

  useEffect(() => {
    if (!presetMenuOpen) return

    const onPointer = (event) => {
      if (!actionsRef.current?.contains(event.target)) setPresetMenuOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setPresetMenuOpen(false)
    }

    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [presetMenuOpen])

  const offline =
    camera.status === 'offline'

  const alert =
    camera.status === 'critical' ||
    camera.status === 'high' ||
    camera.status === 'medium'

  const meta =
    ALERT_META[camera.status] ||
    ALERT_META.safe

  const activePreset = presets.find((preset) => preset.id === ops.activePreset)

  const choosePreset = (preset) => {
    setPresetMenuOpen(false)
    onOpenAt(preset)
  }

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white shadow-[0_1px_6px_rgba(15,35,70,0.06)] ${
        camera.status === 'critical'
          ? 'border-[#ef9a9a]'
          : 'border-[#e6ebf2]'
      }`}
    >
      {offline ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open ${camera.id} diagnostics`}
          className="flex aspect-[16/8.5] w-full flex-col items-center justify-center bg-[#dbe8fb] transition hover:bg-[#d2e1f7]"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/60">
            <WifiOff className="h-5 w-5 text-[#7890ad]" />
          </div>

          <p className="mt-2 text-[9px] font-bold text-[#536174]">
            CAMERA OFFLINE
          </p>

          <p className="mt-1 text-[7px] text-[#7d8da3]">
            RTSP signal unavailable
          </p>
        </button>
      ) : (
        <div className="relative aspect-[16/8.5] overflow-hidden bg-[#172536]">
          <button
            type="button"
            onClick={onOpen}
            aria-label={`View ${camera.id} live`}
            className="group absolute inset-0 block h-full w-full"
          >
            <CameraFrame
              camera={camera}
              ptz={ops.ptz}
              home={ops.home}
              blur={focusBlur(ops.focus)}
              overlayMode="boxes"
              crosshair={false}
            />

            <div className="absolute left-2 top-2 flex gap-1">
              <span
                className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[6px] font-bold text-white ${
                  camera.status === 'critical'
                    ? 'bg-[#ba1a1a]'
                    : 'bg-[#009b69]'
                }`}
              >
                <LiveDot className="h-1 w-1 bg-white" />
                {camera.status === 'critical'
                  ? 'ALARM ACTIVE'
                  : 'LIVE'}
              </span>

              <span className="rounded bg-black/65 px-1.5 py-0.5 text-[6px] font-semibold text-white">
                PTZ
              </span>
            </div>

            <span className="absolute right-2 top-2 rounded bg-black/65 px-1.5 py-0.5 font-mono text-[6px] text-white">
              25 FPS • 1080p
            </span>

            <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[5.5px] text-white">
              <LiveClock />
              {activePreset && ` · ${activePreset.name}`}
            </span>

            <span className="absolute inset-0 grid place-items-center bg-black/0 text-[8px] font-bold uppercase tracking-[0.08em] text-transparent transition-colors group-hover:bg-black/35 group-hover:text-white">
              Open Live View & PTZ
            </span>
          </button>

          <button
            type="button"
            onClick={onFullscreen}
            aria-label={`View ${camera.id} fullscreen`}
            title="Fullscreen"
            className="absolute bottom-2 right-2 grid h-6 w-6 place-items-center rounded-md bg-black/60 text-white transition hover:bg-[#00288e]"
          >
            <Maximize className="h-3.5 w-3.5" />
          </button>
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
          <div ref={actionsRef} className="relative flex flex-wrap gap-1">
            {!offline && (
              <>
                <button
                  onClick={onSnapshot}
                  className="rounded-md border border-[#dfe5ee] px-2 py-1 text-[6.5px] font-semibold text-[#536174] hover:bg-[#f7f9fc]"
                >
                  Snapshot
                </button>

                <button
                  onClick={() => setPresetMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={presetMenuOpen}
                  className={`rounded-md border px-2 py-1 text-[6.5px] font-semibold ${
                    presetMenuOpen
                      ? 'border-[#c7d5f5] bg-[#eef3ff] text-[#00288e]'
                      : 'border-[#dfe5ee] text-[#536174] hover:bg-[#f7f9fc]'
                  }`}
                >
                  PTZ Preset
                </button>

                {presetMenuOpen && (
                  <div
                    role="menu"
                    className="absolute bottom-full left-0 z-20 mb-1 w-[190px] rounded-lg border border-[#e3e8f0] bg-white p-1 shadow-[0_8px_24px_rgba(15,35,70,0.16)]"
                  >
                    <p className="px-2 pb-1 pt-1.5 text-[6px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Move {camera.id} to
                    </p>

                    {presets.length === 0 && (
                      <p className="px-2 py-1.5 text-[7px] text-slate-400">
                        No presets saved for this camera yet.
                      </p>
                    )}

                    {presets.map((preset, index) => (
                      <button
                        key={preset.id}
                        role="menuitem"
                        onClick={() => choosePreset(preset)}
                        title={describePosition(preset.position)}
                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[7px] font-semibold ${
                          ops.activePreset === preset.id
                            ? 'bg-[#eef3ff] text-[#00288e]'
                            : 'text-[#334155] hover:bg-[#f4f7fc]'
                        }`}
                      >
                        <span className="font-mono text-slate-400">{index + 1}</span>
                        <span className="min-w-0 flex-1 truncate">{preset.name}</span>
                        <span className="text-[#00288e]">→</span>
                      </button>
                    ))}

                    <button
                      role="menuitem"
                      onClick={() => choosePreset(null)}
                      className="mt-0.5 flex w-full items-center justify-between rounded-md border-t border-[#edf1f7] px-2 py-1.5 text-left text-[7px] font-semibold text-[#334155] hover:bg-[#f4f7fc]"
                    >
                      Home position
                      <span className="text-[#00288e]">→</span>
                    </button>

                    <button
                      role="menuitem"
                      onClick={() => {
                        setPresetMenuOpen(false)
                        onOpen()
                      }}
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[7px] font-semibold text-[#00288e] hover:bg-[#f4f7fc]"
                    >
                      Manage presets
                      <span>→</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {camera.status === 'critical' && (
              <button
                onClick={onDispatch}
                disabled={ops.dispatched}
                className={`rounded-md px-2 py-1 text-[6.5px] font-bold ${
                  ops.dispatched
                    ? 'bg-[#dcf7e8] text-[#00714e]'
                    : 'bg-[#e32222] text-white hover:bg-[#c81d1d]'
                }`}
              >
                {ops.dispatched ? 'Dispatched ✓' : 'Auto-Dispatch'}
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

function LiveClock() {
  const second = useSyncExternalStore(subscribeToSeconds, currentSecond)
  return osdTime(new Date(second * 1000))
}

function LiveDot({ className }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full motion-safe:animate-rec-blink ${className}`}
    />
  )
}

// The camera image at the current PTZ position, with focus blur and AI overlays.
// Fills its positioned parent; used by the grid, the details view and fullscreen.
function CameraFrame({
  camera,
  ptz,
  home,
  blur = 0,
  overlayMode = 'all',
  motionDuration = 0,
  audioOn = false,
  crosshair = true,
  large = false,
}) {
  const showBoxes = overlayMode === 'all' || overlayMode === 'boxes'
  const showHeatmap = overlayMode === 'all' || overlayMode === 'heatmap'
  const mediaStyle = {
    filter: blur > 0 ? `blur(${blur}px)` : 'none',
    transition: 'filter 350ms ease-out',
  }

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          transform: viewTransform(ptzView(ptz, home)),
          transition: motionDuration ? `transform ${motionDuration}ms ease-out` : undefined,
        }}
      >
        {camera.streamUrl ? (
          <video
            src={camera.streamUrl}
            autoPlay
            loop
            muted={!audioOn}
            playsInline
            className="h-full w-full object-cover"
            style={mediaStyle}
          />
        ) : (
          <img
            src={imageFor(camera)}
            alt={camera.location}
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
            style={mediaStyle}
          />
        )}

        {showHeatmap && <HeatmapOverlay status={camera.status} />}
        {showBoxes && <DetectionOverlay status={camera.status} large={large} />}
      </div>

      {crosshair && overlayMode !== 'clean' && (
        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
            large ? 'h-10 w-10' : 'h-6 w-6'
          }`}
        >
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/60" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/60" />
        </div>
      )}
    </>
  )
}

function DetectionOverlay({ status, large = false }) {
  const box = DETECTIONS[status]
  if (!box) return null

  return (
    <div
      className="absolute border-2"
      style={{
        left: `${box.left}%`,
        top: `${box.top}%`,
        width: `${box.width}%`,
        height: `${box.height}%`,
        borderColor: box.border,
        backgroundColor: box.fill,
      }}
    >
      <span
        className={`absolute bottom-full left-0 mb-1 whitespace-nowrap px-1.5 py-0.5 font-bold text-white ${
          large ? 'text-[11px]' : 'text-[6px]'
        }`}
        style={{ backgroundColor: box.labelBg }}
      >
        {box.label}
      </span>
    </div>
  )
}

function HeatmapOverlay({ status }) {
  const box = DETECTIONS[status]
  const hot = box
    ? { x: box.left + box.width / 2, y: box.top + box.height / 2 }
    : { x: 55, y: 62 }
  const intensity =
    { critical: 0.55, high: 0.45, medium: 0.35 }[status] ?? 0.2

  // A safe camera shows only low-risk (yellow/green) density, never a red hot spot.
  const core = box
    ? `rgba(239, 68, 68, ${intensity})`
    : `rgba(250, 204, 21, ${intensity})`
  const ring = box
    ? `rgba(250, 204, 21, ${intensity * 0.6})`
    : 'rgba(34, 197, 94, 0.16)'

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(circle at ${hot.x}% ${hot.y}%, ${core} 0%, ${ring} 20%, rgba(34, 197, 94, 0.12) 40%, transparent 62%), radial-gradient(circle at 18% 78%, rgba(250, 204, 21, 0.18), transparent 28%)`,
      }}
    />
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
  onExport,
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

        <button
          onClick={onExport}
          disabled={cameras.length === 0}
          className="flex w-fit items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-[7px] font-semibold text-[#00288e] shadow-sm hover:bg-[#f7f9ff] disabled:cursor-not-allowed disabled:opacity-50"
        >
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

const OVERLAY_MODES = [
  ['all', 'All'],
  ['boxes', 'Bounding Boxes'],
  ['heatmap', 'Safety Heatmap'],
  ['clean', 'Clean Feed'],
]

const formatDuration = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

const describePosition = ({ pan, tilt, zoom }) =>
  `AZ ${pan.toFixed(1)}° · EL ${tilt.toFixed(1)}° · ${zoom.toFixed(1)}x`

const samePosition = (a, b) =>
  a.pan === b.pan && a.tilt === b.tilt && a.zoom === b.zoom

function CameraDetails({
  camera,
  ops,
  presets,
  onUpdate,
  onLog,
  onSnapshot,
  onDispatch,
  notify,
  fullscreen,
  onEnterFullscreen,
  onExitFullscreen,
  onBack,
}) {
  const navigate = useNavigate()
  const [ptzSpeed, setPtzSpeed] = useState(50)
  const [overlayMode, setOverlayMode] = useState('all')
  const [motion, setMotion] = useState({ duration: 150, label: null })
  const [focusing, setFocusing] = useState(false)
  const [audioOn, setAudioOn] = useState(false)
  const [recordingSince, setRecordingSince] = useState(null)
  const [now, setNow] = useState(() => Date.now())
  const [sirenOn, setSirenOn] = useState(false)
  const [snapshotBusy, setSnapshotBusy] = useState(false)
  // null when closed; { preset } when editing, {} when adding.
  const [presetForm, setPresetForm] = useState(null)
  const motionTimer = useRef(null)
  const focusTimer = useRef(null)
  const siren = useSiren()
  const hold = useHoldRepeat()

  useEffect(
    () => () => {
      clearTimeout(motionTimer.current)
      clearTimeout(focusTimer.current)
    },
    []
  )

  useEffect(() => {
    if (!recordingSince) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [recordingSince])

  const offline = camera.status === 'offline'
  const isAlert =
    camera.status === 'high' ||
    camera.status === 'critical' ||
    camera.status === 'medium'

  const { ptz, home, focus } = ops
  const blur = focusing ? 2.5 : focusBlur(focus)
  const showBoxes = overlayMode === 'all' || overlayMode === 'boxes'
  const recElapsed = recordingSince
    ? Math.max(0, Math.floor((now - recordingSince) / 1000))
    : 0

  const movePtz = (change) =>
    onUpdate((current) => ({ ptz: change(current.ptz), activePreset: null }))

  const step = Math.max(0.5, ptzSpeed / 10)

  const nudge = (panDirection, tiltDirection) =>
    movePtz((position) => ({
      ...position,
      pan: wrapDegrees(position.pan + panDirection * step),
      tilt: clamp(round1(position.tilt + tiltDirection * step), TILT_MIN, TILT_MAX),
    }))

  const zoomBy = (direction) =>
    movePtz((position) => {
      const factor = 1 + ptzSpeed / 500
      const next =
        direction > 0
          ? Math.max(position.zoom * factor, position.zoom + 0.1)
          : Math.min(position.zoom / factor, position.zoom - 0.1)
      return { ...position, zoom: clamp(round1(next), ZOOM_MIN, ZOOM_MAX) }
    })

  // Preset/home moves travel at a speed set by the PTZ Speed slider, like a real dome.
  const goTo = (position, label, presetId = null) => {
    const duration = 400 + (100 - ptzSpeed) * 10
    clearTimeout(motionTimer.current)
    setMotion({ duration, label })
    onUpdate(() => ({ ptz: position, activePreset: presetId }))
    motionTimer.current = setTimeout(
      () => setMotion({ duration: 150, label: null }),
      duration
    )
  }

  const recallPreset = (preset) =>
    goTo(preset.position, preset.name.toUpperCase(), preset.id)

  // existing is the preset being edited; undefined when adding a new one.
  const savePreset = ({ name, position }, existing) => {
    const saved = existing
      ? { ...existing, name, position }
      : { id: nextPresetId(), name, position }

    setCameraPresets(
      camera.id,
      existing
        ? presets.map((item) => (item.id === saved.id ? saved : item))
        : [...presets, saved]
    )

    // Highlight the preset only if the camera is actually sitting on it.
    const atPreset = samePosition(position, ptz)
    onUpdate((current) => ({
      activePreset: atPreset
        ? saved.id
        : current.activePreset === saved.id
          ? null
          : current.activePreset,
    }))

    onLog({
      title: existing ? 'PTZ Preset Updated' : 'PTZ Preset Saved',
      text: name,
      sub: describePosition(position),
    })
    notify(existing ? 'Preset updated' : 'Preset saved', `${name} · ${describePosition(position)}`)
  }

  const deletePreset = (preset) => {
    setCameraPresets(camera.id, presets.filter((item) => item.id !== preset.id))
    onUpdate((current) => ({
      activePreset: current.activePreset === preset.id ? null : current.activePreset,
    }))
    onLog({
      title: 'PTZ Preset Deleted',
      text: preset.name,
      sub: describePosition(preset.position),
    })
    notify('Preset deleted', `${preset.name} removed from ${camera.id}`)
  }

  const autoFocus = () => {
    onUpdate(() => ({ focus: { mode: 'auto', value: 50 } }))
    clearTimeout(focusTimer.current)
    setFocusing(true)
    focusTimer.current = setTimeout(() => setFocusing(false), 350)
  }

  const manualFocus = (direction) =>
    onUpdate((current) => ({
      focus: {
        mode: 'manual',
        value: clamp(current.focus.value + direction * 5, 0, 100),
      },
    }))

  const toggleRecording = () => {
    if (recordingSince) {
      const duration = formatDuration(
        Math.max(1, Math.floor((Date.now() - recordingSince) / 1000))
      )
      setRecordingSince(null)
      onLog({
        title: 'Manual Clip Recorded',
        text: `${camera.id} · duration ${duration}`,
        sub: 'Status: Saved to NVR evidence store',
      })
      notify('Recording stopped', `${duration} clip from ${camera.id} saved to NVR`)
      return
    }

    const start = Date.now()
    setRecordingSince(start)
    setNow(start)
    notify('Recording started', `Manual clip recording on ${camera.id}`)
  }

  const toggleAudio = () => {
    setAudioOn(!audioOn)
    notify(
      audioOn ? 'Audio muted' : 'Audio monitoring on',
      `${camera.id} field microphone ${audioOn ? 'muted' : 'is now live'}`
    )
  }

  const handleSnapshot = async () => {
    setSnapshotBusy(true)
    await onSnapshot(showBoxes)
    setSnapshotBusy(false)
  }

  const toggleSiren = () => {
    if (sirenOn) {
      siren.stop()
      setSirenOn(false)
      onLog({
        title: 'Broadcast Siren Stopped',
        text: `${camera.area} PA zone`,
        sub: 'Status: Siren silenced by operator',
      })
      notify('Siren stopped', `PA siren silenced for ${camera.area}`)
      return
    }

    if (!siren.start()) {
      notify('Siren unavailable', 'This browser cannot play audio alerts', 'error')
      return
    }

    setSirenOn(true)
    onLog({
      title: 'Broadcast Siren Activated',
      text: `${camera.area} PA zone`,
      sub: 'Status: Evacuation tone sounding',
      severity: 'high',
    })
    notify('Broadcast siren sounding', `PA siren active for ${camera.area}`)
  }

  const acknowledge = () => {
    onUpdate(() => ({ acknowledged: true }))
    onLog({
      title: 'Alert Acknowledged',
      text: `${ALERT_META[camera.status].detection} · ${camera.id}`,
      sub: 'Status: Acknowledged by operator',
    })
    notify('Alert acknowledged', `${camera.id} alert marked as acknowledged`)
  }

  const reportHazard = () => {
    const reference = `HZ-${String(camera.tenderNo).padStart(2, '0')}-${clockTime().replace(/:/g, '')}`
    onUpdate(() => ({ hazardReported: reference }))
    onLog({
      title: 'Hazard Report Filed',
      text: `${reference} · ${camera.location}`,
      sub: 'Status: Sent to shift safety officer',
      severity: 'high',
    })
    notify('Hazard reported', `${reference} filed for ${camera.id}`)
  }

  // toggleRecording goes to the viewer as its own prop: the purity lint can't tell
  // a function inside an object only runs on click (it calls Date.now).
  const viewerControls = {
    speed: ptzSpeed,
    setSpeed: setPtzSpeed,
    step,
    hold,
    nudge,
    zoomBy,
    goHome: () => goTo(home, 'HOME'),
    presets,
    recallPreset,
    savePreset,
    deletePreset,
    focusing,
    autoFocus,
    manualFocus,
    overlayMode,
    setOverlayMode,
    snapshotBusy,
    snapshot: handleSnapshot,
    recording: Boolean(recordingSince),
    recElapsed,
    audioOn,
    toggleAudio,
  }

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
              <button
                onClick={reportHazard}
                disabled={Boolean(ops.hazardReported)}
                className={`rounded-lg px-3 py-2 text-[8px] font-bold ${
                  ops.hazardReported
                    ? 'bg-[#dcf7e8] text-[#00714e]'
                    : 'bg-[#9b000d] text-white hover:bg-[#82000b]'
                }`}
              >
                {ops.hazardReported
                  ? `Reported · ${ops.hazardReported}`
                  : 'Report Hazard'}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_8px_rgba(15,35,70,0.06)]">
            <div
              className="relative aspect-video select-none overflow-hidden bg-[#101828]"
              onDoubleClick={offline ? undefined : onEnterFullscreen}
            >
              {offline ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#182536] text-white">
                  <WifiOff className="h-12 w-12 text-[#8291a7]" />
                  <h3 className="mt-4 text-[15px] font-bold">Camera Offline</h3>
                  <p className="mt-1 text-[10px] text-[#94a3b8]">
                    RTSP stream unavailable
                  </p>
                </div>
              ) : (
                // The fullscreen viewer draws the frame while open, so a real stream never plays twice.
                !fullscreen && (
                  <CameraFrame
                    camera={camera}
                    ptz={ptz}
                    home={home}
                    blur={blur}
                    overlayMode={overlayMode}
                    motionDuration={motion.duration}
                    audioOn={audioOn}
                  />
                )
              )}

              {!offline && (
                <>
                  <div className="absolute left-3 top-3 flex items-center gap-1.5">
                    <span className="flex items-center gap-1 rounded bg-[#ba1a1a] px-2 py-1 text-[7px] font-bold text-white">
                      <LiveDot className="h-1.5 w-1.5 bg-white" />
                      REC
                    </span>
                    {recordingSince && (
                      <span className="animate-pulse rounded bg-[#ba1a1a] px-2 py-1 font-mono text-[7px] font-bold text-white">
                        ● CLIP {formatDuration(recElapsed)}
                      </span>
                    )}
                    <span className="rounded bg-black/70 px-2 py-1 text-[7px] font-bold text-white">
                      {camera.id} · {camera.area}
                    </span>
                  </div>

                  <div className="absolute right-3 top-3 flex gap-1">
                    {audioOn && (
                      <span className="flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-[7px] font-bold text-white">
                        <Volume2 className="h-2.5 w-2.5" /> AUDIO
                      </span>
                    )}
                    <span className="rounded bg-[#009b69] px-2 py-1 text-[7px] font-bold text-white">
                      LIVE FEED
                    </span>
                    <span className="rounded bg-black/70 px-2 py-1 font-mono text-[7px] text-white">
                      25 FPS · 1080p
                    </span>
                  </div>

                  {motion.label && (
                    <span className="absolute left-1/2 top-11 -translate-x-1/2 rounded bg-[#00288e]/90 px-2 py-1 font-mono text-[7px] font-bold text-white">
                      PTZ MOVING → {motion.label}
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                    <div className="rounded bg-black/70 px-2 py-1 font-mono text-[7px] text-white">
                      PTZ AZIMUTH {ptz.pan.toFixed(1)}° | ELEVATION {ptz.tilt.toFixed(1)}° | ZOOM {ptz.zoom.toFixed(1)}X
                      {focus.mode === 'manual' && ` | MF ${focus.value}%`}
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="rounded bg-black/70 px-2 py-1 font-mono text-[7px] text-white">
                        <LiveClock />
                      </div>

                      <div className="rounded bg-black/70 px-2 py-1 text-[7px] text-[#72f1b8]">
                        OPTICAL AI · CODEC H.265
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1f7] px-3 py-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleRecording}
                  disabled={offline}
                  aria-label={recordingSince ? 'Stop clip recording' : 'Record clip'}
                  title={recordingSince ? 'Stop clip recording' : 'Record clip'}
                  className={`grid h-7 w-7 place-items-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    recordingSince
                      ? 'bg-[#ba1a1a] text-white'
                      : 'bg-[#eef3ff] text-[#ba1a1a] hover:bg-[#e2e9ff]'
                  }`}
                >
                  {recordingSince ? (
                    <Square className="h-3 w-3 fill-current" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 fill-current" />
                  )}
                </button>

                <button
                  onClick={toggleAudio}
                  disabled={offline}
                  aria-label={audioOn ? 'Mute audio' : 'Listen to audio'}
                  title={audioOn ? 'Mute audio' : 'Listen to audio'}
                  className={`grid h-7 w-7 place-items-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    audioOn
                      ? 'bg-[#00288e] text-white'
                      : 'bg-[#eef3ff] text-[#00288e] hover:bg-[#e2e9ff]'
                  }`}
                >
                  {audioOn ? (
                    <Volume2 className="h-3.5 w-3.5" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" />
                  )}
                </button>

                <button
                  onClick={handleSnapshot}
                  disabled={offline || snapshotBusy}
                  aria-label="Take snapshot"
                  title="Take snapshot"
                  className="grid h-7 w-7 place-items-center rounded-md bg-[#eef3ff] text-[#00288e] transition hover:bg-[#e2e9ff] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>

                <span className="text-[7px] text-[#657286]">
                  Edge AI Latency: <b>19ms</b>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onEnterFullscreen}
                  disabled={offline}
                  title="Fullscreen (or double-click the video)"
                  className="flex items-center gap-1 rounded-md bg-[#00288e] px-2.5 py-1.5 text-[7px] font-bold text-white transition hover:bg-[#001f6e] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Maximize className="h-3 w-3" />
                  Fullscreen
                </button>

                {!offline && (
                  <span className="rounded bg-[#ba1a1a] px-2 py-1 text-[6px] font-bold text-white">
                    LIVE
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 border-t border-[#edf1f7] px-3 py-2">
              {OVERLAY_MODES.map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => setOverlayMode(mode)}
                  disabled={offline}
                  aria-pressed={overlayMode === mode}
                  className={`rounded-md px-2.5 py-1 text-[6.5px] font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                    overlayMode === mode
                      ? 'bg-[#00288e] text-white'
                      : 'bg-[#eef2f8] text-[#536174] hover:bg-[#e2e8f2]'
                  }`}
                >
                  {label}
                </button>
              ))}

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
                  {offline
                    ? 'Camera offline — PTZ commands cannot reach the dome.'
                    : 'Pan, tilt, optical zoom, focus and preset controls. Hold a button to keep moving.'}
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
                  disabled={offline}
                  onChange={(e) => setPtzSpeed(Number(e.target.value))}
                  aria-label="PTZ speed"
                  className="w-24 accent-[#00288e] disabled:opacity-40"
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
                  <PtzButton text="↑" label="Tilt up" disabled={offline} {...hold(() => nudge(0, 1), offline)} />
                  <div />
                  <PtzButton text="←" label="Pan left" disabled={offline} {...hold(() => nudge(-1, 0), offline)} />
                  <button
                    onClick={() => goTo(home, 'HOME')}
                    disabled={offline}
                    aria-label="Return to home position"
                    title="Return to home position"
                    className="grid h-9 w-9 place-items-center rounded-full bg-[#00288e] text-[6px] font-bold text-white transition hover:bg-[#001f6e] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    HOME
                  </button>
                  <PtzButton text="→" label="Pan right" disabled={offline} {...hold(() => nudge(1, 0), offline)} />
                  <div />
                  <PtzButton text="↓" label="Tilt down" disabled={offline} {...hold(() => nudge(0, -1), offline)} />
                  <div />
                </div>

                <p className="mt-3 text-center font-mono text-[6.5px] font-semibold text-[#536174]">
                  AZ {ptz.pan.toFixed(1)}° · EL {ptz.tilt.toFixed(1)}°
                </p>
                <p className="mt-0.5 text-center text-[6px] text-slate-400">
                  Step {step.toFixed(1)}° per click at {ptzSpeed}% speed
                </p>
              </div>

              <div className="rounded-lg bg-[#f4f7fc] p-4">
                <div className="grid grid-cols-2 gap-2">
                  <SmallTelemetry label="Optical Zoom" value={`${ptz.zoom.toFixed(1)}x`} />
                  <SmallTelemetry label="Optical" value={`${ZOOM_MAX}x`} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    disabled={offline || ptz.zoom >= ZOOM_MAX}
                    {...hold(() => zoomBy(1), offline)}
                    className="rounded-md bg-white px-2 py-2 text-[7px] font-semibold text-[#00288e] transition hover:bg-[#e8eeff] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Zoom In (+)
                  </button>

                  <button
                    disabled={offline || ptz.zoom <= ZOOM_MIN}
                    {...hold(() => zoomBy(-1), offline)}
                    className="rounded-md bg-white px-2 py-2 text-[7px] font-semibold text-[#00288e] transition hover:bg-[#e8eeff] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Zoom Out (-)
                  </button>
                </div>

                <div className="mt-3">
                  <p className="text-[7px] font-bold uppercase text-slate-400">
                    Lens Focus
                  </p>

                  <div className="mt-2 flex gap-1">
                    <button
                      onClick={autoFocus}
                      disabled={offline}
                      aria-pressed={focus.mode === 'auto'}
                      className={`rounded-md px-2 py-1.5 text-[6px] font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        focus.mode === 'auto'
                          ? 'bg-[#00288e] text-white'
                          : 'bg-white text-[#536174] hover:bg-[#e8eeff]'
                      }`}
                    >
                      Auto Focus
                    </button>
                    <button
                      disabled={offline}
                      {...hold(() => manualFocus(1), offline)}
                      className={`rounded-md px-2 py-1.5 text-[6px] transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        focus.mode === 'manual'
                          ? 'bg-[#e8eeff] font-bold text-[#00288e]'
                          : 'bg-white text-[#536174] hover:bg-[#e8eeff]'
                      }`}
                    >
                      Manual +
                    </button>
                    <button
                      disabled={offline}
                      {...hold(() => manualFocus(-1), offline)}
                      className={`rounded-md px-2 py-1.5 text-[6px] transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        focus.mode === 'manual'
                          ? 'bg-[#e8eeff] font-bold text-[#00288e]'
                          : 'bg-white text-[#536174] hover:bg-[#e8eeff]'
                      }`}
                    >
                      Manual -
                    </button>
                  </div>

                  <p className="mt-2 text-[6px] text-slate-500">
                    {focus.mode === 'auto'
                      ? focusing
                        ? 'Auto focus: searching…'
                        : 'Auto focus: locked'
                      : `Manual focus: ${focus.value}% (sharpest at 50%)`}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-[#f4f7fc] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[7px] font-bold uppercase text-slate-400">
                    PTZ Camera Quick Presets
                  </p>
                  <span className="text-[7px] font-bold text-[#00288e]">
                    {presets.length} / {MAX_PRESETS}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {presets.length === 0 && !presetForm && (
                    <p className="rounded-md border border-dashed border-[#cfd8e6] bg-white px-2.5 py-3 text-center text-[7px] leading-3 text-slate-500">
                      No presets saved yet. Point the camera, then save the view with a name.
                    </p>
                  )}

                  {presets.map((preset, index) => {
                    const active = ops.activePreset === preset.id
                    const editing = presetForm?.preset?.id === preset.id

                    return (
                      <div key={preset.id} className="flex items-stretch gap-1">
                        <button
                          onClick={() => recallPreset(preset)}
                          disabled={offline}
                          aria-label={`Go to preset ${preset.name}`}
                          className={`flex min-w-0 flex-1 items-center gap-2 rounded-md px-2.5 py-1.5 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                            active
                              ? 'bg-[#00288e] text-white'
                              : editing
                                ? 'bg-[#e8eeff] text-[#00288e]'
                                : 'bg-white text-[#334155] hover:bg-[#e8eeff]'
                          }`}
                        >
                          <span
                            className={`grid h-4 w-4 shrink-0 place-items-center rounded font-mono text-[7px] font-bold ${
                              active ? 'bg-white text-[#00288e]' : 'bg-[#eef3ff] text-[#00288e]'
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[7px] font-semibold">
                              {preset.name}
                            </span>
                            <span className="block font-mono text-[6px] opacity-70">
                              {describePosition(preset.position)}
                            </span>
                          </span>
                          <span className={active ? 'text-white' : 'text-[#00288e]'}>
                            {active ? '●' : '→'}
                          </span>
                        </button>

                        <button
                          onClick={() => setPresetForm({ preset })}
                          disabled={offline}
                          aria-label={`Edit preset ${preset.name}`}
                          title="Edit or delete this preset"
                          className="grid w-7 shrink-0 place-items-center rounded-md bg-white text-[#64748b] transition hover:bg-[#e8eeff] hover:text-[#00288e] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>

                {presetForm ? (
                  <PresetForm
                    key={presetForm.preset?.id ?? 'new'}
                    preset={presetForm.preset}
                    current={ptz}
                    presets={presets}
                    onSave={(draft) => {
                      savePreset(draft, presetForm.preset)
                      setPresetForm(null)
                    }}
                    onDelete={() => {
                      deletePreset(presetForm.preset)
                      setPresetForm(null)
                    }}
                    onCancel={() => setPresetForm(null)}
                  />
                ) : (
                  <button
                    onClick={() => setPresetForm({})}
                    disabled={offline || presets.length >= MAX_PRESETS}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-[#00288e] px-2.5 py-2 text-[7px] font-bold text-white transition hover:bg-[#001f6e] disabled:cursor-not-allowed disabled:bg-[#c7d2e5]"
                  >
                    <Plus className="h-3 w-3" />
                    {presets.length >= MAX_PRESETS
                      ? `Preset limit reached (${MAX_PRESETS}/${MAX_PRESETS})`
                      : 'Save current view as preset'}
                  </button>
                )}

                <p className="mt-2 text-[6px] leading-3 text-slate-400">
                  Up to {MAX_PRESETS} named views per camera, kept on this browser. Click one to move the camera there.
                </p>
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
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[7px] font-bold ${
                      ops.acknowledged
                        ? 'bg-[#dcf7e8] text-[#00714e]'
                        : 'bg-[#ffe0dc] text-[#9b000d]'
                    }`}
                  >
                    {ops.acknowledged ? '✓ ALERT ACKNOWLEDGED' : '⚠ HIGH SEVERITY ALERT'}
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
                <button
                  onClick={toggleSiren}
                  aria-pressed={sirenOn}
                  className={`w-full rounded-lg py-2 text-[8px] font-bold text-white transition ${
                    sirenOn
                      ? 'animate-pulse bg-[#7a0009]'
                      : 'bg-[#ba1a1a] hover:bg-[#9e1616]'
                  }`}
                >
                  {sirenOn ? '■ Stop Broadcast Siren' : 'Sound Broadcast Siren'}
                </button>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={acknowledge}
                    disabled={ops.acknowledged}
                    className={`rounded-lg py-2 text-[7px] font-bold ${
                      ops.acknowledged
                        ? 'bg-[#dcf7e8] text-[#00714e]'
                        : 'bg-[#00288e] text-white hover:bg-[#001f6e]'
                    }`}
                  >
                    {ops.acknowledged ? 'Alert Acknowledged ✓' : 'Acknowledge Alert'}
                  </button>

                  <button
                    onClick={onDispatch}
                    disabled={ops.dispatched}
                    className={`rounded-lg py-2 text-[7px] font-semibold ${
                      ops.dispatched
                        ? 'bg-[#dcf7e8] font-bold text-[#00714e]'
                        : 'bg-[#eef2f8] text-[#334155] hover:bg-[#e2e8f2]'
                    }`}
                  >
                    {ops.dispatched ? 'Patrol Dispatched ✓' : 'Dispatch Patrol'}
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
              {ops.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <button
              onClick={() => navigate('/incidents')}
              className="mt-3 flex w-full items-center justify-between rounded-lg bg-[#eef3ff] px-3 py-2 text-[7px] font-semibold text-[#00288e] hover:bg-[#e2e9ff]"
            >
              View Complete CCTV Event Audit Log
              <span>→</span>
            </button>
          </section>
        </aside>
      </section>

      {fullscreen && !offline && (
        <FullscreenViewer
          camera={camera}
          ops={ops}
          motion={motion}
          blur={blur}
          controls={viewerControls}
          onToggleRecording={toggleRecording}
          onExit={onExitFullscreen}
        />
      )}
    </div>
  )
}

const COORDINATE_FIELDS = [
  { key: 'pan', label: 'Azimuth', unit: '°', min: 0, max: 360 },
  { key: 'tilt', label: 'Elevation', unit: '°', min: TILT_MIN, max: TILT_MAX },
  { key: 'zoom', label: 'Zoom', unit: 'x', min: ZOOM_MIN, max: ZOOM_MAX },
]

const toFields = (position) => ({
  pan: position.pan.toFixed(1),
  tilt: position.tilt.toFixed(1),
  zoom: position.zoom.toFixed(1),
})

const PRESET_FORM_TONES = {
  light: {
    form: 'mt-3 space-y-2 rounded-md border border-[#dfe5ee] bg-white p-2.5',
    title: 'text-[7px] font-bold uppercase tracking-[0.06em] text-[#00288e]',
    label: 'text-[6px] font-bold uppercase tracking-[0.06em] text-slate-400',
    input: 'h-6 w-full rounded border border-[#dfe5ee] bg-white px-1.5 text-[8px] text-[#0b1c30] outline-none focus:border-[#00288e]',
    link: 'flex items-center gap-1 text-[7px] font-semibold text-[#00288e] hover:underline',
    error: 'text-[7px] font-semibold text-[#ba1a1a]',
    danger: 'flex items-center gap-1 rounded px-1.5 py-1 text-[7px] font-semibold text-[#ba1a1a] hover:bg-[#fff1f0]',
    secondary: 'rounded px-2 py-1 text-[7px] font-semibold text-[#536174] hover:bg-[#f1f4f9]',
    primary: 'rounded bg-[#00288e] px-2.5 py-1 text-[7px] font-bold text-white hover:bg-[#001f6e]',
  },
  dark: {
    form: 'space-y-2.5',
    title: 'text-[10px] font-bold uppercase tracking-[0.1em] text-white/70',
    label: 'text-[9px] font-bold uppercase tracking-[0.1em] text-white/55',
    input: 'h-7 w-full rounded-md border border-white/15 bg-white/10 px-2 text-[12px] text-white outline-none focus:border-white/60',
    link: 'flex items-center gap-1 text-[10px] font-semibold text-[#9db8ff] hover:underline',
    error: 'text-[10px] font-semibold text-[#ff9b8f]',
    danger: 'flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold text-[#ff9b8f] hover:bg-white/10',
    secondary: 'rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-white/80 hover:bg-white/10',
    primary: 'rounded-md bg-white px-3 py-1.5 text-[11px] font-bold text-[#00288e] hover:bg-white/90',
  },
}

// Add or edit a named preset. Coordinates start at the preset's values (edit) or the
// camera's current position (add) and can be typed directly.
function PresetForm({ preset, current, presets, tone = 'light', onSave, onDelete, onCancel }) {
  const [name, setName] = useState(preset?.name ?? '')
  const [fields, setFields] = useState(() => toFields(preset?.position ?? current))
  const [error, setError] = useState('')
  const styles = PRESET_FORM_TONES[tone]

  const submit = (event) => {
    event.preventDefault()

    const trimmed = name.trim()
    const values = Object.fromEntries(
      COORDINATE_FIELDS.map(({ key }) => [key, fields[key] === '' ? NaN : Number(fields[key])])
    )
    const outOfRange = COORDINATE_FIELDS.find(
      ({ key, min, max }) => !(values[key] >= min && values[key] <= max)
    )
    const duplicate = presets.some(
      (item) => item.id !== preset?.id && item.name.toLowerCase() === trimmed.toLowerCase()
    )

    let problem = ''
    if (!trimmed) problem = 'Give the preset a name.'
    else if (duplicate) problem = `"${trimmed}" is already used on this camera.`
    else if (outOfRange) {
      problem = `${outOfRange.label} must be between ${outOfRange.min}${outOfRange.unit} and ${outOfRange.max}${outOfRange.unit}.`
    }

    if (problem) {
      setError(problem)
      return
    }

    onSave({
      name: trimmed,
      position: {
        pan: wrapDegrees(values.pan),
        tilt: round1(values.tilt),
        zoom: round1(values.zoom),
      },
    })
  }

  return (
    <form
      onSubmit={submit}
      onKeyDown={(event) => {
        // Esc closes the form instead of reaching the fullscreen viewer's Esc-to-exit.
        if (event.key === 'Escape') {
          event.stopPropagation()
          onCancel()
        }
      }}
      noValidate
      aria-label={preset ? `Edit preset ${preset.name}` : 'New preset'}
      className={styles.form}
    >
      <p className={styles.title}>{preset ? 'Edit preset' : 'New preset'}</p>

      <label className="block">
        <span className={styles.label}>Name</span>
        <input
          autoFocus
          value={name}
          maxLength={PRESET_NAME_MAX}
          placeholder="e.g. Drive motor"
          onChange={(event) => {
            setName(event.target.value)
            setError('')
          }}
          className={`mt-1 ${styles.input}`}
        />
      </label>

      <div className="grid grid-cols-3 gap-1.5">
        {COORDINATE_FIELDS.map(({ key, label, unit, min, max }) => (
          <label key={key} className="block min-w-0">
            <span className={styles.label}>
              {label} {unit}
            </span>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min={min}
              max={max}
              value={fields[key]}
              onChange={(event) => {
                const value = event.target.value
                setFields((previous) => ({ ...previous, [key]: value }))
                setError('')
              }}
              className={`mt-1 ${styles.input}`}
            />
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setFields(toFields(current))
          setError('')
        }}
        className={styles.link}
      >
        <LocateFixed className="h-3 w-3" />
        Use current camera position
      </button>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <div className="flex items-center gap-1.5">
        {preset && (
          <button type="button" onClick={onDelete} className={styles.danger}>
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        )}

        <button type="button" onClick={onCancel} className={`ml-auto ${styles.secondary}`}>
          Cancel
        </button>

        <button type="submit" className={styles.primary}>
          {preset ? 'Save changes' : 'Save preset'}
        </button>
      </div>
    </form>
  )
}

const KEY_MOVES = {
  ArrowLeft: { pan: -1, tilt: 0 },
  ArrowRight: { pan: 1, tilt: 0 },
  ArrowUp: { pan: 0, tilt: 1 },
  ArrowDown: { pan: 0, tilt: -1 },
  '+': { zoom: 1 },
  '=': { zoom: 1 },
  '-': { zoom: -1 },
  _: { zoom: -1 },
}

function FullscreenViewer({
  camera,
  ops,
  motion,
  blur,
  controls,
  onToggleRecording,
  onExit,
}) {
  const [controlsVisible, setControlsVisible] = useState(true)
  // null when closed; { preset } when editing, {} when adding.
  const [presetForm, setPresetForm] = useState(null)
  const rootRef = useRef(null)
  const lastKeyMove = useRef(0)
  const { ptz, focus } = ops
  const { hold, nudge, zoomBy } = controls
  const detection = DETECTIONS[camera.status]
    ? ALERT_META[camera.status].detection
    : null

  // Lock the page scroll behind the viewer and move focus into it; restore both on close.
  useEffect(() => {
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    const opener = document.activeElement
    root.style.overflow = 'hidden'
    rootRef.current?.focus({ preventScroll: true })

    return () => {
      root.style.overflow = previousOverflow
      if (opener instanceof HTMLElement && opener.isConnected) {
        opener.focus({ preventScroll: true })
      }
    }
  }, [])

  // Esc or the browser's own exit control left fullscreen: close the viewer with it.
  const onFullscreenChange = useEffectEvent(() => {
    if (!document.fullscreenElement) onExit()
  })

  const onKeyDown = useEffectEvent((event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return

    if (event.key === 'Escape') {
      event.preventDefault()
      onExit()
      return
    }

    // A focused slider keeps its own arrow-key behaviour.
    if (event.target instanceof Element && event.target.closest('input, select, textarea')) return

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
    const move = KEY_MOVES[key]

    if (move) {
      event.preventDefault()
      // Held keys repeat at the OS rate; pace them like a held on-screen button.
      if (event.repeat && event.timeStamp - lastKeyMove.current < HOLD_INTERVAL) return
      lastKeyMove.current = event.timeStamp
      if (move.zoom) zoomBy(move.zoom)
      else nudge(move.pan, move.tilt)
      return
    }

    if (event.repeat) return

    const preset = /^[1-4]$/.test(key) ? controls.presets[Number(key) - 1] : null

    if (key === 'h' || key === 'Home') controls.goHome()
    else if (key === 'c') setControlsVisible((visible) => !visible)
    else if (preset) controls.recallPreset(preset)
    else return

    event.preventDefault()
  })

  useEffect(() => {
    const handleFullscreenChange = () => onFullscreenChange()
    const handleKeyDown = (event) => onKeyDown(event)

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${camera.id} fullscreen live view`}
      tabIndex={-1}
      className="fixed inset-0 z-[300] flex select-none items-center justify-center bg-black text-white outline-none"
    >
      <div
        className="relative aspect-video overflow-hidden bg-[#101828]"
        style={{ width: 'min(100vw, calc(100dvh * 16 / 9))' }}
        onDoubleClick={onExit}
      >
        <CameraFrame
          camera={camera}
          ptz={ptz}
          home={ops.home}
          blur={blur}
          overlayMode={controls.overlayMode}
          motionDuration={motion.duration}
          audioOn={controls.audioOn}
          large
        />
      </div>

      {motion.label && (
        <span className="pointer-events-none absolute left-1/2 top-28 -translate-x-1/2 rounded-md bg-[#00288e]/90 px-3 py-1.5 font-mono text-[11px] font-bold">
          PTZ MOVING → {motion.label}
        </span>
      )}

      {controlsVisible ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 bg-gradient-to-b from-black/80 via-black/45 to-transparent px-5 pb-12 pt-4">
            <div className="pointer-events-auto flex min-w-0 items-start gap-3">
              <span className="shrink-0 rounded-md bg-[#00288e] px-2 py-1 text-[11px] font-bold">
                {camera.id}
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[14px] font-bold leading-tight">
                    {camera.location}
                  </h2>
                  <StatusBadge status={camera.status} />
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-white/75">
                  <span className="flex items-center gap-1.5 text-[#5ee6a8]">
                    <LiveDot className="h-1.5 w-1.5 bg-[#00c47f]" />
                    LIVE · 25 FPS · 1080p
                  </span>

                  <span className="font-mono text-white">
                    <LiveClock />
                  </span>

                  <span className="font-mono">
                    AZ {ptz.pan.toFixed(1)}° · EL {ptz.tilt.toFixed(1)}° · ZOOM {ptz.zoom.toFixed(1)}X
                  </span>

                  {controls.recording && (
                    <span className="animate-pulse rounded bg-[#ba1a1a] px-1.5 py-0.5 font-mono text-white">
                      ● CLIP {formatDuration(controls.recElapsed)}
                    </span>
                  )}

                  {controls.audioOn && (
                    <span className="flex items-center gap-1">
                      <Volume2 className="h-3 w-3" /> AUDIO
                    </span>
                  )}
                </div>

                {detection && (
                  <p className="mt-1 text-[10px] font-bold text-[#ff9b8f]">
                    AI: {detection}
                  </p>
                )}
              </div>
            </div>

            <div className="pointer-events-auto flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label="Video overlays"
                className="flex rounded-lg bg-white/10 p-0.5"
              >
                {OVERLAY_MODES.map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => controls.setOverlayMode(mode)}
                    aria-pressed={controls.overlayMode === mode}
                    className={`rounded-md px-2.5 py-1 text-[10px] font-semibold transition ${
                      controls.overlayMode === mode
                        ? 'bg-white text-[#00288e]'
                        : 'text-white/80 hover:bg-white/15'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <ViewerButton
                label="Take snapshot"
                onClick={controls.snapshot}
                disabled={controls.snapshotBusy}
              >
                <Camera className="h-4 w-4" />
              </ViewerButton>

              <ViewerButton
                label={controls.recording ? 'Stop clip recording' : 'Record clip'}
                active={controls.recording}
                aria-pressed={controls.recording}
                onClick={onToggleRecording}
              >
                {controls.recording ? (
                  <Square className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Circle className="h-3.5 w-3.5 fill-[#ff5c5c] text-[#ff5c5c]" />
                )}
              </ViewerButton>

              <ViewerButton
                label={controls.audioOn ? 'Mute audio' : 'Listen to audio'}
                active={controls.audioOn}
                aria-pressed={controls.audioOn}
                onClick={controls.toggleAudio}
              >
                {controls.audioOn ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </ViewerButton>

              <ViewerButton
                label="Hide controls (C)"
                onClick={() => setControlsVisible(false)}
              >
                <EyeOff className="h-4 w-4" />
              </ViewerButton>

              <button
                type="button"
                onClick={onExit}
                className="flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-[11px] font-bold text-[#0b1c30] transition hover:bg-white/85"
              >
                <Minimize className="h-3.5 w-3.5" />
                Exit fullscreen
              </button>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-1.5 px-4 pb-4">
            <div className="pointer-events-auto flex max-w-full flex-wrap items-start justify-center gap-x-6 gap-y-3 rounded-2xl border border-white/10 bg-black/65 px-5 py-3 shadow-2xl backdrop-blur-md">
              <DockGroup label="Pan & Tilt">
                <div className="grid grid-cols-3 gap-1">
                  <span />
                  <ViewerButton label="Tilt up" {...hold(() => nudge(0, 1))}>↑</ViewerButton>
                  <span />
                  <ViewerButton label="Pan left" {...hold(() => nudge(-1, 0))}>←</ViewerButton>
                  <button
                    type="button"
                    onClick={controls.goHome}
                    aria-label="Return to home position"
                    title="Return to home position (H)"
                    className="grid h-8 w-8 place-items-center rounded-full bg-[#00288e] text-[7px] font-bold transition hover:bg-[#1a44b8]"
                  >
                    HOME
                  </button>
                  <ViewerButton label="Pan right" {...hold(() => nudge(1, 0))}>→</ViewerButton>
                  <span />
                  <ViewerButton label="Tilt down" {...hold(() => nudge(0, -1))}>↓</ViewerButton>
                  <span />
                </div>
              </DockGroup>

              <DockGroup label="Zoom">
                <div className="flex items-center gap-1.5">
                  <ViewerButton
                    label="Zoom out"
                    disabled={ptz.zoom <= ZOOM_MIN}
                    {...hold(() => zoomBy(-1), ptz.zoom <= ZOOM_MIN)}
                  >
                    −
                  </ViewerButton>
                  <span className="w-12 text-center font-mono text-[14px] font-bold">
                    {ptz.zoom.toFixed(1)}x
                  </span>
                  <ViewerButton
                    label="Zoom in"
                    disabled={ptz.zoom >= ZOOM_MAX}
                    {...hold(() => zoomBy(1), ptz.zoom >= ZOOM_MAX)}
                  >
                    +
                  </ViewerButton>
                </div>
                <DockNote>Optical {ZOOM_MAX}x max</DockNote>
              </DockGroup>

              <DockGroup label={`Speed ${controls.speed}%`}>
                {/* Mouse users get focus dropped after a drag, so arrow keys go back to pan/tilt. */}
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={controls.speed}
                  onChange={(event) => controls.setSpeed(Number(event.target.value))}
                  onPointerUp={(event) => event.currentTarget.blur()}
                  aria-label="PTZ speed"
                  className="mt-2 w-28 accent-white"
                />
                <DockNote>Step {controls.step.toFixed(1)}° per press</DockNote>
              </DockGroup>

              <DockGroup label="Focus">
                <div className="flex gap-1">
                  <ViewerButton
                    label="Auto focus"
                    active={focus.mode === 'auto'}
                    aria-pressed={focus.mode === 'auto'}
                    onClick={controls.autoFocus}
                  >
                    <span className="text-[11px]">AF</span>
                  </ViewerButton>
                  <ViewerButton label="Manual focus −" {...hold(() => controls.manualFocus(-1))}>
                    −
                  </ViewerButton>
                  <ViewerButton label="Manual focus +" {...hold(() => controls.manualFocus(1))}>
                    +
                  </ViewerButton>
                </div>
                <DockNote>
                  {focus.mode === 'auto'
                    ? controls.focusing
                      ? 'AF searching…'
                      : 'AF locked'
                    : `MF ${focus.value}% · sharpest at 50%`}
                </DockNote>
              </DockGroup>

              <DockGroup label={`Presets ${controls.presets.length}/${MAX_PRESETS}`}>
                <div className="relative flex w-[368px] max-w-full flex-col gap-1">
                  {controls.presets.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1">
                      {controls.presets.map((preset, index) => {
                        const active = ops.activePreset === preset.id

                        return (
                          <div key={preset.id} className="flex min-w-0 gap-0.5">
                            <button
                              type="button"
                              onClick={() => controls.recallPreset(preset)}
                              aria-label={`Go to preset ${preset.name}`}
                              title={`${preset.name} · ${describePosition(preset.position)}`}
                              className={`flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-md px-2 text-left text-[10px] font-semibold transition ${
                                active
                                  ? 'bg-white text-[#00288e]'
                                  : 'bg-white/10 hover:bg-white/20'
                              }`}
                            >
                              <span
                                className={`grid h-4 w-4 shrink-0 place-items-center rounded font-mono text-[9px] font-bold ${
                                  active ? 'bg-[#00288e] text-white' : 'bg-white/20'
                                }`}
                              >
                                {index + 1}
                              </span>
                              <span className="truncate">{preset.name}</span>
                            </button>

                            <ViewerButton
                              label={`Edit preset ${preset.name}`}
                              size="sm"
                              onClick={() => setPresetForm({ preset })}
                            >
                              <Pencil className="h-3 w-3" />
                            </ViewerButton>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="py-1.5 text-center text-[10px] text-white/60">
                      No presets yet for this camera
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setPresetForm({})}
                    disabled={controls.presets.length >= MAX_PRESETS}
                    className="flex h-7 items-center justify-center gap-1.5 rounded-md border border-dashed border-white/25 text-[10px] font-semibold text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3" />
                    {controls.presets.length >= MAX_PRESETS
                      ? `Preset limit reached (${MAX_PRESETS}/${MAX_PRESETS})`
                      : 'Save current view as preset'}
                  </button>

                  {presetForm && (
                    <div className="absolute bottom-full right-0 mb-10 w-[320px] max-w-[calc(100vw-32px)] rounded-xl border border-white/15 bg-[#0b1220]/95 p-3 text-left shadow-2xl backdrop-blur-md">
                      <PresetForm
                        key={presetForm.preset?.id ?? 'new'}
                        tone="dark"
                        preset={presetForm.preset}
                        current={ptz}
                        presets={controls.presets}
                        onSave={(draft) => {
                          controls.savePreset(draft, presetForm.preset)
                          setPresetForm(null)
                        }}
                        onDelete={() => {
                          controls.deletePreset(presetForm.preset)
                          setPresetForm(null)
                        }}
                        onCancel={() => setPresetForm(null)}
                      />
                    </div>
                  )}
                </div>
              </DockGroup>
            </div>

            <p className="hidden rounded-full bg-black/55 px-3 py-0.5 text-[10px] font-medium text-white/75 backdrop-blur md:block">
              ← ↑ → ↓ pan / tilt · + / − zoom · H home · 1–4 presets · C hide controls · Esc exit
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-lg bg-black/55 px-2.5 py-1.5 font-mono text-[11px] font-semibold backdrop-blur">
            <LiveDot className="h-2 w-2 bg-[#ff4d4d]" />
            {camera.id}
            <span className="text-white/80">
              <LiveClock />
            </span>
          </div>

          <div className="absolute right-4 top-4 flex gap-1 rounded-xl bg-black/60 p-1 backdrop-blur">
            <button
              type="button"
              onClick={() => setControlsVisible(true)}
              className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold transition hover:bg-white/15"
            >
              <Eye className="h-3.5 w-3.5" />
              Show controls
            </button>

            <ViewerButton label="Exit fullscreen" onClick={onExit}>
              <Minimize className="h-4 w-4" />
            </ViewerButton>
          </div>
        </>
      )}
    </div>
  )
}

function ViewerButton({ label, active = false, size = 'md', children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`grid touch-none select-none place-items-center rounded-lg font-bold transition disabled:cursor-not-allowed disabled:opacity-35 ${
        size === 'sm' ? 'h-7 w-7 text-[11px]' : 'h-8 min-w-8 px-2 text-[14px]'
      } ${
        active
          ? 'bg-white text-[#00288e]'
          : 'bg-white/10 text-white hover:bg-white/20'
      }`}
      {...props}
    >
      {children}
    </button>
  )
}

function DockGroup({ label, children }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/55">
        {label}
      </p>
      {children}
    </div>
  )
}

function DockNote({ children }) {
  return (
    <p className="text-[9px] font-medium text-white/60">
      {children}
    </p>
  )
}

function PtzButton({ text, label, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="grid h-9 w-9 touch-none select-none place-items-center rounded-lg bg-white text-sm font-bold text-[#00288e] shadow-sm transition hover:bg-[#e8eeff] active:bg-[#dbe5ff] disabled:cursor-not-allowed disabled:opacity-40"
      {...props}
    >
      {text}
    </button>
  )
}

const HOLD_DELAY = 350
const HOLD_INTERVAL = 90

// Press-and-hold behaviour for PTZ buttons: one step on press, then repeat until release.
// Release is watched on window so it still ends if the button becomes disabled mid-hold.
function useHoldRepeat() {
  const stopRef = useRef(null)

  const stop = useCallback(() => {
    stopRef.current?.()
    stopRef.current = null
  }, [])

  useEffect(() => stop, [stop])

  return useCallback(
    (action, disabled = false) => ({
      onPointerDown: (event) => {
        if (disabled || event.button !== 0) return

        stop()
        action()

        let repeat
        const delay = setTimeout(() => {
          repeat = setInterval(action, HOLD_INTERVAL)
        }, HOLD_DELAY)

        window.addEventListener('pointerup', stop)
        window.addEventListener('pointercancel', stop)
        window.addEventListener('blur', stop)

        stopRef.current = () => {
          clearTimeout(delay)
          clearInterval(repeat)
          window.removeEventListener('pointerup', stop)
          window.removeEventListener('pointercancel', stop)
          window.removeEventListener('blur', stop)
        }
      },
      // Keyboard activation (Enter/Space) produces a click with detail 0.
      onClick: (event) => {
        if (event.detail === 0 && !disabled) action()
      },
    }),
    [stop]
  )
}

function useSiren() {
  const sirenRef = useRef(null)

  const stop = useCallback(() => {
    const siren = sirenRef.current
    if (!siren) return

    clearInterval(siren.timer)
    siren.oscillator.stop()
    siren.context.close()
    sirenRef.current = null
  }, [])

  const start = useCallback(() => {
    if (sirenRef.current) return true

    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return false

    const context = new AudioCtx()
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = 'triangle'
    oscillator.frequency.value = 650
    gain.gain.value = 0.06
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()

    let high = false
    const timer = setInterval(() => {
      high = !high
      oscillator.frequency.setValueAtTime(high ? 960 : 650, context.currentTime)
    }, 450)

    sirenRef.current = { context, oscillator, timer }
    return true
  }, [])

  useEffect(() => stop, [stop])

  return useMemo(() => ({ start, stop }), [start, stop])
}

function Toast({ toast, onClose }) {
  if (!toast) return null

  const error = toast.tone === 'error'

  return (
    <div
      role="status"
      className="fixed right-5 top-20 z-[400] w-[350px] max-w-[calc(100%-40px)] rounded-xl border border-blue-100 bg-white p-4 shadow-2xl"
    >
      <div className="flex gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            error ? 'bg-red-100 text-[#ba1a1a]' : 'bg-blue-100 text-[#00288e]'
          }`}
        >
          {error ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-[#0b1c30]">{toast.title}</p>
          <p className="mt-1 break-words text-xs leading-5 text-slate-500">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="ml-auto h-fit rounded-md p-1 text-slate-400 hover:bg-slate-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
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
