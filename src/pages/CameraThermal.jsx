
import { useMemo, useRef, useState } from 'react'
import {
  Camera,
  Thermometer,
  Flame,
  User,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Crosshair,
  ShieldAlert,
  HardHat,
  Activity,
  Wifi,
  WifiOff,
  Eye,
  AlertTriangle,
} from 'lucide-react'

import Panel from '../components/Panel'

import {
  cameraHealth,
  manDownTracks,
  sitePpeDetections,
  fireSmokeEvents,
  switchyardEvents,
  ashLeakEvents,
  cameraDetections,
} from '../data/mockData'

const EXTRA_CAMERAS = [
  {
    id: 'CAM-02',
    zone: 'Chimney Access Ladder',
    mode: 'RGB',
    online: true,
    fps: 10,
    latency: 2.1,
    preset: 'LADDER',
    module: 'PPE + Harness',
  },
  {
    id: 'CAM-07',
    zone: 'Switchyard Gantry',
    mode: 'Thermal',
    online: true,
    fps: 10,
    latency: 2.0,
    preset: 'GANTRY',
    module: 'Switchyard',
  },
  {
    id: 'CAM-09',
    zone: 'Coal Conveyor',
    mode: 'RGB',
    online: true,
    fps: 10,
    latency: 2.6,
    preset: 'CONVEYOR',
    module: 'Fire / Smoke',
  },
  {
    id: 'CAM-13',
    zone: 'Cooling Tower Rim',
    mode: 'Thermal',
    online: true,
    fps: 10,
    latency: 2.3,
    preset: 'COOLING',
    module: 'Thermal',
  },
]

function severityStyles(severity) {
  if (severity === 'critical') {
    return {
      border: 'border-[var(--color-danger)]',
      text: 'text-[var(--color-danger)]',
      bg: 'bg-[var(--color-danger)]/10',
      badge: 'bg-[var(--color-danger)] text-white',
    }
  }

  if (severity === 'high' || severity === 'elevated') {
    return {
      border: 'border-[var(--color-amber)]',
      text: 'text-[var(--color-amber)]',
      bg: 'bg-[var(--color-amber)]/10',
      badge: 'bg-[var(--color-amber)] text-black',
    }
  }

  return {
    border: 'border-[var(--color-safe)]',
    text: 'text-[var(--color-safe)]',
    bg: 'bg-[var(--color-safe)]/10',
    badge: 'bg-[var(--color-safe)] text-black',
  }
}

function FeedPreview({ camera, selected, onClick }) {
  const detections = cameraDetections[camera.id] || []
  const critical = detections.some((d) => d.severity === 'critical')
  const thermal = camera.mode?.toLowerCase().includes('thermal')

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full overflow-hidden rounded-xl border text-left transition ${
        selected
          ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/60'
      }`}
    >
      <div
        className="relative aspect-video overflow-hidden"
        style={{
          background: thermal
            ? 'radial-gradient(circle at 45% 55%, #ff4757 0%, #ffb020 18%, #403271 48%, #080d18 82%)'
            : 'linear-gradient(145deg, #18253c 0%, #0b1220 45%, #070b13 100%)',
        }}
      >
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 animate-scan bg-gradient-to-b from-white/10 to-transparent" />

        <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-white">
          {camera.online ? (
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-safe)]" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-danger)]" />
          )}
          {camera.id}
        </div>

        <div className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-white">
          {camera.mode}
        </div>

        {detections.slice(0, 2).map((d) => {
          const style = severityStyles(d.severity)

          return (
            <div
              key={d.id}
              className={`absolute border ${style.border}`}
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: `${d.w}%`,
                height: `${d.h}%`,
              }}
            >
              <span
                className={`absolute -top-4 left-0 whitespace-nowrap px-1 py-0.5 font-mono text-[7px] ${style.badge}`}
              >
                {d.label}
              </span>
            </div>
          )
        })}

        {!camera.online && (
          <div className="absolute inset-0 grid place-items-center bg-black/75">
            <div className="text-center">
              <WifiOff className="mx-auto h-5 w-5 text-[var(--color-danger)]" />
              <p className="mt-1 font-mono text-[9px] text-white">
                FEED OFFLINE
              </p>
            </div>
          </div>
        )}

        {critical && camera.online && (
          <span className="absolute bottom-2 right-2 rounded bg-[var(--color-danger)] px-2 py-1 font-mono text-[8px] font-bold text-white">
            CRITICAL
          </span>
        )}
      </div>

      <div className="p-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[12px] font-semibold text-white">
              {camera.zone}
            </p>

            <p className="mt-0.5 text-[10px] text-[var(--color-text-dim)]">
              {camera.module}
            </p>
          </div>

          {camera.online ? (
            <Wifi className="h-3.5 w-3.5 text-[var(--color-safe)]" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-[var(--color-danger)]" />
          )}
        </div>
      </div>
    </button>
  )
}

export default function CameraThermal() {
  const monitorRef = useRef(null)

  const allCameras = useMemo(() => {
    const existingIds = new Set(cameraHealth.map((c) => c.id))

    return [
      ...cameraHealth,
      ...EXTRA_CAMERAS.filter((camera) => !existingIds.has(camera.id)),
    ]
  }, [])

  const [filter, setFilter] = useState('all')

  const [selectedId, setSelectedId] = useState(
    allCameras.find((c) => c.online)?.id || allCameras[0]?.id
  )

  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [autoTrack, setAutoTrack] = useState(true)
  const [selectedDetection, setSelectedDetection] = useState(null)

  const selectedCamera =
    allCameras.find((camera) => camera.id === selectedId) || allCameras[0]

  const detections = cameraDetections[selectedCamera?.id] || []

  const shownCameras = allCameras.filter((camera) => {
    if (filter === 'all') return true

    const mode = camera.mode?.toLowerCase() || ''

    if (filter === 'thermal') {
      return mode.includes('thermal')
    }

    if (filter === 'optical') {
      return mode.includes('rgb') || mode.includes('optical')
    }

    return true
  })

  const isThermal =
    selectedCamera?.mode?.toLowerCase().includes('thermal')

  const criticalDetections = detections.filter(
    (d) => d.severity === 'critical'
  )

  const zoomIn = () => {
    setZoom((value) => Math.min(value + 0.25, 3))
  }

  const zoomOut = () => {
    setZoom((value) => Math.max(value - 0.25, 1))
  }

  const resetView = () => {
    setZoom(1)
    setPanX(0)
    setPanY(0)
    setSelectedDetection(null)
  }

  const pan = (x, y) => {
    setPanX((value) =>
      Math.max(-35, Math.min(35, value + x))
    )

    setPanY((value) =>
      Math.max(-35, Math.min(35, value + y))
    )
  }

  const openCamera = (cameraId) => {
    setSelectedId(cameraId)
    resetView()
  }

  const focusDetection = (detection) => {
    setSelectedDetection(detection)

    const centerX = detection.x + detection.w / 2
    const centerY = detection.y + detection.h / 2

    setZoom(2)

    setPanX(
      Math.max(-30, Math.min(30, (50 - centerX) * 0.55))
    )

    setPanY(
      Math.max(-30, Math.min(30, (50 - centerY) * 0.55))
    )
  }

  const sendPtzCommand = (action) => {
    if (action === 'left') pan(-5, 0)
    if (action === 'right') pan(5, 0)
    if (action === 'up') pan(0, -5)
    if (action === 'down') pan(0, 5)
    if (action === 'zoom_in') zoomIn()
    if (action === 'zoom_out') zoomOut()

    /*
      Later backend PTZ:

      fetch(`/api/cameras/${selectedCamera.id}/ptz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
        }),
      })
    */
  }

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await monitorRef.current?.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  return (
    <div className="mx-auto min-w-0 w-full max-w-[1500px] space-y-5">
      <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            AI Surveillance
          </p>

          <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-white">
            CCTV & Thermal Command Center
          </h1>

          <p className="mt-1 text-[13px] text-[var(--color-text-dim)]">
            Live AI overlays · PPE · fallen-person · smoke · intrusion · thermal anomaly monitoring
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'optical', 'thermal'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-lg border px-3.5 py-2 text-[12px] font-medium capitalize transition ${
                filter === item
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-white'
                  : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {criticalDetections.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--color-danger)]" />

          <div>
            <p className="text-[13px] font-semibold text-[var(--color-danger)]">
              Critical AI detection on {selectedCamera.id}
            </p>

            <p className="mt-0.5 text-[11px] text-[var(--color-text-dim)]">
              {criticalDetections.map((d) => d.label).join(' · ')}
            </p>
          </div>
        </div>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0 space-y-4">
          <Panel
            title={`${selectedCamera.id} · ${selectedCamera.zone}`}
            eyebrow={`${selectedCamera.module} · ${selectedCamera.mode}`}
          >
            <div
              ref={monitorRef}
              className="overflow-hidden rounded-xl bg-black"
            >
              <div
                className="relative aspect-video overflow-hidden bg-[#070b12]"
                style={{
                  background: isThermal
                    ? 'radial-gradient(circle at 42% 55%, #ff4757 0%, #ffb020 15%, #49367f 45%, #090d19 82%)'
                    : 'linear-gradient(145deg, #18283f 0%, #0b1423 48%, #070a10 100%)',
                }}
              >
                <div
                  className="absolute inset-0 origin-center transition-transform duration-300"
                  style={{
                    transform: `scale(${zoom}) translate(${panX / zoom}%, ${panY / zoom}%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-grid opacity-25" />

                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.025] via-transparent to-black/30" />

                  <div className="absolute bottom-[18%] left-[8%] h-[42%] w-[13%] border border-white/10 bg-white/[0.025]" />

                  <div className="absolute bottom-[18%] left-[23%] h-[58%] w-[7%] border border-white/10 bg-white/[0.025]" />

                  <div className="absolute bottom-[18%] right-[12%] h-[34%] w-[28%] border border-white/10 bg-white/[0.025]" />

                  {detections.map((detection) => {
                    const style = severityStyles(
                      detection.severity
                    )

                    const active =
                      selectedDetection?.id === detection.id

                    return (
                      <button
                        key={detection.id}
                        type="button"
                        onClick={() =>
                          focusDetection(detection)
                        }
                        className={`absolute border-2 text-left transition ${style.border} ${
                          active
                            ? 'ring-2 ring-white/60'
                            : 'hover:ring-2 hover:ring-white/30'
                        }`}
                        style={{
                          left: `${detection.x}%`,
                          top: `${detection.y}%`,
                          width: `${detection.w}%`,
                          height: `${detection.h}%`,
                        }}
                      >
                        <span
                          className={`absolute -top-6 left-0 whitespace-nowrap rounded-sm px-1.5 py-1 font-mono text-[8px] font-bold ${style.badge}`}
                        >
                          {detection.label} · {detection.confidence}%
                        </span>
                      </button>
                    )
                  })}

                  <div className="pointer-events-none absolute inset-x-0 top-0 h-14 animate-scan bg-gradient-to-b from-white/10 to-transparent" />
                </div>

                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded bg-black/65 px-2 py-1 font-mono text-[10px] text-white">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        selectedCamera.online
                          ? 'bg-[var(--color-danger)]'
                          : 'bg-gray-500'
                      }`}
                    />
                    REC
                  </span>

                  <span className="rounded bg-black/65 px-2 py-1 font-mono text-[10px] text-white">
                    {selectedCamera.id}
                  </span>

                  <span className="rounded bg-black/65 px-2 py-1 font-mono text-[10px] text-white">
                    {selectedCamera.mode}
                  </span>
                </div>

                <div className="absolute right-3 top-3 flex gap-2">
                  <span className="rounded bg-black/65 px-2 py-1 font-mono text-[9px] text-white">
                    {selectedCamera.fps} FPS
                  </span>

                  <span className="rounded bg-black/65 px-2 py-1 font-mono text-[9px] text-white">
                    {selectedCamera.latency}s LATENCY
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 rounded bg-black/65 px-2 py-1 font-mono text-[9px] text-white">
                  ZOOM {zoom.toFixed(2)}×
                </div>

                <div className="absolute bottom-3 right-3 rounded bg-black/65 px-2 py-1 font-mono text-[9px] text-[var(--color-safe)]">
                  AI ANALYTICS ACTIVE
                </div>

                {!selectedCamera.online && (
                  <div className="absolute inset-0 z-30 grid place-items-center bg-black/80">
                    <div className="text-center">
                      <WifiOff className="mx-auto h-8 w-8 text-[var(--color-danger)]" />

                      <p className="mt-2 font-mono text-sm font-bold text-white">
                        CAMERA OFFLINE
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] bg-[var(--color-bg-raised)] p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      sendPtzCommand('zoom_out')
                    }
                    className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)] hover:text-white"
                    title="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>

                  <span className="min-w-[58px] text-center font-mono text-[11px] text-white">
                    {zoom.toFixed(2)}×
                  </span>

                  <button
                    onClick={() =>
                      sendPtzCommand('zoom_in')
                    }
                    className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)] hover:text-white"
                    title="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>

                  <button
                    onClick={resetView}
                    className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)] hover:text-white"
                    title="Reset view"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)] hover:text-white"
                    title="Fullscreen"
                  >
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() =>
                    setAutoTrack((value) => !value)
                  }
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-semibold ${
                    autoTrack
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-dim)]'
                  }`}
                >
                  <Crosshair className="h-4 w-4" />
                  Auto Track {autoTrack ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[12px] font-semibold text-white">
                  PTZ Controls
                </p>

                <p className="mt-1 text-[10.5px] text-[var(--color-text-dim)]">
                  Digital control active · backend ONVIF can replace these handlers
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <span />

                <button
                  onClick={() => sendPtzCommand('up')}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-white"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>

                <span />

                <button
                  onClick={() =>
                    sendPtzCommand('left')
                  }
                  className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={resetView}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                >
                  <Crosshair className="h-4 w-4" />
                </button>

                <button
                  onClick={() =>
                    sendPtzCommand('right')
                  }
                  className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <span />

                <button
                  onClick={() =>
                    sendPtzCommand('down')
                  }
                  className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-white"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>

                <span />
              </div>
            </div>
          </Panel>

          <Panel
            title="Plant Camera Grid"
            eyebrow={`${shownCameras.length} visible feeds`}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {shownCameras.map((camera) => (
                <FeedPreview
                  key={camera.id}
                  camera={camera}
                  selected={
                    camera.id === selectedCamera.id
                  }
                  onClick={() =>
                    openCamera(camera.id)
                  }
                />
              ))}
            </div>
          </Panel>
        </div>

        <div className="min-w-0 space-y-4">
          <Panel
            title="AI Detections"
            eyebrow={selectedCamera.id}
          >
            {detections.length === 0 ? (
              <div className="rounded-xl border border-[var(--color-safe)]/30 bg-[var(--color-safe)]/5 p-4">
                <p className="text-[12px] font-semibold text-[var(--color-safe)]">
                  No active hazards
                </p>

                <p className="mt-1 text-[11px] text-[var(--color-text-dim)]">
                  AI analytics are monitoring this camera.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {detections.map((detection) => {
                  const style = severityStyles(
                    detection.severity
                  )

                  return (
                    <button
                      key={detection.id}
                      onClick={() =>
                        focusDetection(detection)
                      }
                      className={`w-full rounded-xl border p-3 text-left transition ${style.border} ${style.bg} hover:bg-white/[0.04]`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${style.text}`}>
                          {detection.type === 'fallen' && (
                            <Activity className="h-4 w-4" />
                          )}

                          {detection.type === 'ppe' && (
                            <HardHat className="h-4 w-4" />
                          )}

                          {detection.type === 'smoke' && (
                            <Flame className="h-4 w-4" />
                          )}

                          {detection.type === 'thermal' && (
                            <Thermometer className="h-4 w-4" />
                          )}

                          {detection.type === 'intrusion' && (
                            <ShieldAlert className="h-4 w-4" />
                          )}

                          {detection.type === 'ash' && (
                            <AlertTriangle className="h-4 w-4" />
                          )}

                          {detection.type === 'safe' && (
                            <User className="h-4 w-4" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`text-[12px] font-semibold ${style.text}`}>
                            {detection.label}
                          </p>

                          <p className="mt-1 text-[10.5px] text-[var(--color-text-dim)]">
                            {detection.details}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="font-mono text-[9px] text-[var(--color-text-faint)]">
                              {detection.id}
                            </span>

                            <span className="font-mono text-[10px] text-white">
                              {detection.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </Panel>

          <Panel
            title="Camera Status"
            eyebrow="Telemetry"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--color-text-dim)]">
                  Status
                </span>

                <span
                  className={`font-mono text-[11px] font-semibold ${
                    selectedCamera.online
                      ? 'text-[var(--color-safe)]'
                      : 'text-[var(--color-danger)]'
                  }`}
                >
                  {selectedCamera.online
                    ? 'ONLINE'
                    : 'OFFLINE'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--color-text-dim)]">
                  Camera
                </span>

                <span className="font-mono text-[11px] text-white">
                  {selectedCamera.id}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--color-text-dim)]">
                  Mode
                </span>

                <span className="font-mono text-[11px] text-white">
                  {selectedCamera.mode}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--color-text-dim)]">
                  FPS
                </span>

                <span className="font-mono text-[11px] text-white">
                  {selectedCamera.fps}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--color-text-dim)]">
                  Latency
                </span>

                <span className="font-mono text-[11px] text-white">
                  {selectedCamera.latency}s
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--color-text-dim)]">
                  Preset
                </span>

                <span className="font-mono text-[11px] text-white">
                  {selectedCamera.preset}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--color-text-dim)]">
                  Analytics
                </span>

                <span className="text-right text-[10.5px] text-white">
                  {selectedCamera.module}
                </span>
              </div>
            </div>
          </Panel>

          <Panel
            title="Analytics Summary"
            eyebrow="Backend feeds"
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                <Flame className="h-4 w-4 text-[var(--color-danger)]" />

                <p className="mt-2 text-xl font-bold text-white">
                  {
                    fireSmokeEvents.filter(
                      (e) => e.detected
                    ).length
                  }
                </p>

                <p className="text-[10px] text-[var(--color-text-dim)]">
                  Smoke events
                </p>
              </div>

              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                <Activity className="h-4 w-4 text-[var(--color-danger)]" />

                <p className="mt-2 text-xl font-bold text-white">
                  {
                    manDownTracks.filter(
                      (t) => t.state === 'FALLEN'
                    ).length
                  }
                </p>

                <p className="text-[10px] text-[var(--color-text-dim)]">
                  Man down
                </p>
              </div>

              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                <ShieldAlert className="h-4 w-4 text-[var(--color-amber)]" />

                <p className="mt-2 text-xl font-bold text-white">
                  {
                    switchyardEvents.filter(
                      (e) =>
                        e.intrusion ||
                        e.climb ||
                        e.arcFlash
                    ).length
                  }
                </p>

                <p className="text-[10px] text-[var(--color-text-dim)]">
                  Switchyard
                </p>
              </div>

              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                <AlertTriangle className="h-4 w-4 text-[var(--color-amber)]" />

                <p className="mt-2 text-xl font-bold text-white">
                  {
                    ashLeakEvents.filter(
                      (e) => e.areaM2 > 0
                    ).length
                  }
                </p>

                <p className="text-[10px] text-[var(--color-text-dim)]">
                  Ash leakage
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-[var(--color-accent)]" />

                <span className="text-[11px] font-semibold text-white">
                  PPE Vision Model
                </span>
              </div>

              <p className="mt-2 font-mono text-[10px] text-[var(--color-text-dim)]">
                {sitePpeDetections.length} detection classes available for overlay
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

