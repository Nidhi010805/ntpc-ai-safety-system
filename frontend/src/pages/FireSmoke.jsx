
import { useEffect, useRef, useState } from 'react'
import {
  Upload,
  Download,
  FileVideo,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Clock3,
  ScanSearch,
} from 'lucide-react'

import {
  checkFireSmokeHealth,
  uploadFireSmokeVideo,
  getFireSmokeJob,
  getFireSmokeJobs,
  getFireSmokeResults,
  getAnnotatedVideoUrl,
  downloadAnnotatedVideo,
  downloadFireSmokeCSV,
} from '../services/fireSmokeApi'

// Result format written by fire_smoke_worker/worker.py.
const VERDICTS = {
  fire: { label: 'Fire detected', tone: 'text-red-600' },
  smoke: { label: 'Smoke detected', tone: 'text-slate-700' },
  possible_hidden_fire: { label: 'Possible hidden fire', tone: 'text-amber-600' },
  clear: { label: 'No fire or smoke', tone: 'text-emerald-600' },
}

const EVENT_LABELS = {
  ALARM_ON: (event) => ({
    label: `${event.class === 'fire' ? 'Fire' : 'Smoke'} alarm`,
    tone: event.class === 'fire' ? 'text-red-600' : 'text-slate-700',
  }),
  ALARM_OFF: () => ({ label: 'Alarm cleared', tone: 'text-emerald-600' }),
  OCCLUDED_FIRE_CUE: () => ({ label: 'Possible hidden fire', tone: 'text-amber-600' }),
  OCCLUDED_FIRE_CLEAR: () => ({ label: 'Hidden-fire cue cleared', tone: 'text-emerald-600' }),
}

function formatTime(seconds) {
  if (seconds == null) return '—'
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${(seconds % 60).toFixed(1).padStart(4, '0')}`
}

const formatPercent = (score) => (score == null ? '—' : `${Math.round(score * 100)}%`)

export default function FireSmoke() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [job, setJob] = useState(null)
  const [results, setResults] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [backendOnline, setBackendOnline] = useState(null)
  const [worker, setWorker] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const videoRef = useRef(null)

  const jobId = job?.job_id
  const status = job?.status

  const isCompleted = status === 'completed'
  const isProcessing = status === 'processing' || status === 'queued'
  // Only results written by the inference worker have a verdict.
  const summary = results?.verdict ? results : null

  // BACKEND HEALTH CHECK
  useEffect(() => {
    let mounted = true

    async function checkBackend() {
      try {
        const health = await checkFireSmokeHealth()
        if (mounted) {
          setBackendOnline(true)
          setWorker(health?.worker || null)
        }
      } catch {
        if (mounted) setBackendOnline(false)
      }
    }

    checkBackend()

    const interval = window.setInterval(checkBackend, 10000)

    return () => {
      mounted = false
      window.clearInterval(interval)
    }
  }, [])

  // VIDEO UPLOAD
  async function handleUpload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    const allowedExtensions = ['.mp4', '.avi', '.mov', '.mkv']
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()

    if (!allowedExtensions.includes(extension)) {
      setError('Unsupported video format. Please upload MP4, AVI, MOV or MKV.')
      return
    }

    setSelectedFile(file)
    setError('')
    setResults(null)
    setJob(null)
    setUploading(true)

    try {
      const response = await uploadFireSmokeVideo(file)

      // Backend response contains job inside response.job
      const uploadedJob =
        response?.job ||
        response?.data?.job ||
        response?.data ||
        response

      if (!uploadedJob?.job_id) {
        console.error('Invalid upload response:', response)
        throw new Error('Backend did not return a valid job ID.')
      }

      setJob(uploadedJob)
      setResults(uploadedJob.result || null)

    } catch (err) {
      console.error('Video upload error:', err)
      setError(err.message || 'Video upload failed.')
    } finally {
      setUploading(false)
    }
  }

  // REFRESH JOB STATUS
  async function refreshJobStatus() {
    if (!jobId) return

    setRefreshing(true)

    try {
      const response = await getFireSmokeJob(jobId)
      const updatedJob = response?.job || response?.data?.job || response?.data || response

      if (!updatedJob?.job_id) {
        throw new Error('Invalid job status response.')
      }

      setJob(updatedJob)

      if (updatedJob.status === 'completed') {
        const actualResults = await getFireSmokeResults(jobId)
        setResults(actualResults?.result || actualResults)
      }

      if (updatedJob.status === 'failed') {
        setError(updatedJob.error || 'Video inference failed.')
      }
    } catch (err) {
      setError(err.message || 'Unable to fetch job status.')
    } finally {
      setRefreshing(false)
    }
  }

  // AUTOMATIC JOB STATUS POLLING
  useEffect(() => {
    if (!jobId || status === 'completed' || status === 'failed') return

    const interval = window.setInterval(() => {
      refreshJobStatus()
    }, 3000)

    return () => window.clearInterval(interval)
  }, [jobId, status])

  // RECENT JOBS (reloaded whenever the open job changes state)
  useEffect(() => {
    let mounted = true

    getFireSmokeJobs()
      .then((response) => {
        if (mounted) setRecentJobs(response?.jobs || [])
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [jobId, status])

  function openJob(item) {
    setJob(item)
    setResults(item.result || null)
    setSelectedFile(null)
    setError(item.status === 'failed' ? item.error || 'Video inference failed.' : '')
  }

  function seekTo(seconds) {
    const video = videoRef.current
    if (!video) return

    video.currentTime = seconds
    video.play().catch(() => {})
  }

  const summaryCards = [
    {
      label: 'Verdict',
      value: summary ? VERDICTS[summary.verdict]?.label || summary.verdict : '—',
      tone: summary ? VERDICTS[summary.verdict]?.tone : '',
      size: 'text-lg',
    },
    {
      label: 'Alarms raised',
      value: summary
        ? summary.fire_alarms + summary.smoke_alarms + summary.hidden_fire_cues
        : '—',
      note: summary?.first_alarm_s != null ? `First at ${formatTime(summary.first_alarm_s)}` : null,
    },
    {
      label: 'Highest confidence',
      value: summary ? formatPercent(summary.peak_score) : '—',
    },
    {
      label: 'Temporal gate',
      value: summary ? `${summary.settings.enter_hits} of ${summary.settings.window}` : '—',
      note: summary ? `checks at ≥ ${formatPercent(summary.settings.conf)}` : null,
    },
  ]

  const cardClass =
    'rounded-2xl border border-slate-200 bg-white shadow-sm'

  return (
    <div className="mx-auto min-w-0 w-full max-w-[1400px] space-y-5">

      {/* PAGE HEADER */}
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-blue-700">
          M1 · Vision Analytics
        </p>

        <h1 className="mt-1 font-[var(--font-display)] text-[24px] font-bold text-slate-900">
          Fire & Smoke Detection
        </h1>

        <p className="mt-1 text-[13px] text-slate-500">
          Video-based fire and smoke detection using AI inference.
        </p>

        {/* BACKEND CONNECTION STATUS */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              backendOnline === true
                ? 'bg-emerald-500'
                : backendOnline === false
                  ? 'bg-red-500'
                  : 'animate-pulse bg-amber-400'
            }`}
          />

          <span className="text-xs font-medium text-slate-600">
            {backendOnline === true
              ? 'Backend Connected'
              : backendOnline === false
                ? 'Backend Offline'
                : 'Checking Backend...'}
          </span>
        </div>

        {/* INFERENCE WORKER STATUS */}
        {backendOnline && worker && (
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                worker.online ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            />

            <span className="text-xs font-medium text-slate-600">
              {worker.online
                ? `AI worker running · ${worker.model} on ${worker.device}${
                    worker.state === 'processing' ? ' · busy' : ''
                  }`
                : 'AI worker not running · uploaded videos wait in the queue'}
            </span>
          </div>
        )}
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className={`${cardClass} p-4`}>
            <p className="text-[11px] text-slate-500">
              {card.label}
            </p>

            <p className={`mt-1 font-bold ${card.size || 'text-2xl'} ${card.tone || 'text-slate-900'}`}>
              {card.value}
            </p>

            {card.note && (
              <p className="mt-0.5 text-[11px] text-slate-500">
                {card.note}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* VIDEO UPLOAD */}
      <section className={cardClass}>
        <div className="border-b border-slate-100 px-6 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-700">
            Upload Video
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Video Inference
          </h2>
        </div>

        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <FileVideo className="mt-1 h-5 w-5 shrink-0 text-blue-700" />

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Upload CCTV video
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Supported formats: MP4, AVI, MOV, MKV
              </p>

              {selectedFile && (
                <p className="mt-2 break-all text-xs text-blue-700">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          <label
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 ${
              uploading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {uploading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}

            {uploading ? 'Uploading...' : 'Upload Video'}

            <input
              type="file"
              accept=".mp4,.avi,.mov,.mkv,video/mp4,video/quicktime"
              className="hidden"
              disabled={uploading}
              onChange={handleUpload}
            />
          </label>
        </div>
      </section>

      {/* RECENT JOBS */}
      {recentJobs.length > 0 && (
        <section className={cardClass}>
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-700">
              History
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Recent Videos
            </h2>
          </div>

          <ul className="divide-y divide-slate-100">
            {recentJobs.slice(0, 8).map((item) => {
              const verdict = item.result?.verdict && VERDICTS[item.result.verdict]

              return (
                <li key={item.job_id}>
                  <button
                    type="button"
                    onClick={() => openJob(item)}
                    className={`flex w-full items-center justify-between gap-3 px-6 py-3 text-left transition hover:bg-slate-50 ${
                      item.job_id === jobId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-xs text-slate-800">
                        {item.job_id}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </span>

                    <span
                      className={`shrink-0 text-xs font-semibold ${
                        verdict ? verdict.tone : 'text-slate-500'
                      }`}
                    >
                      {verdict ? verdict.label : item.status?.toUpperCase()}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* JOB STATUS */}
      {job && (
        <section className={cardClass}>
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-700">
              Processing Status
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Inference Job
            </h2>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-500">
                  Job ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-slate-800">
                  {job.job_id}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : isProcessing ? (
                  <LoaderCircle className="h-4 w-4 animate-spin text-blue-700" />
                ) : (
                  <Clock3 className="h-4 w-4 text-slate-500" />
                )}

                <span className="text-sm font-semibold text-slate-800">
                  {job.status?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                {job.message || 'Waiting for status update.'}
              </p>

              <button
                type="button"
                onClick={refreshJobStatus}
                disabled={refreshing || isCompleted || status === 'failed'}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <Clock3 className="h-3.5 w-3.5" />
                {refreshing ? 'Refreshing...' : 'Refresh status'}
              </button>
            </div>

            {typeof job.progress === 'number' && (
              <div>
                <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                  <span>Progress</span>
                  <span>{job.progress}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-700 transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(0, job.progress))}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

          <p className="text-xs text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* INFERENCE OUTPUT */}
      {isCompleted && (
        <section className={cardClass}>
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-700">
              Model Results
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Inference Output
            </h2>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Video inference completed successfully.
            </div>

            {summary && (
              <p className="text-xs text-slate-500">
                {summary.model?.name} on {summary.model?.device} · checked 1 in
                every {summary.settings?.stride} frames · processed in{' '}
                {summary.processing_seconds} s
                {summary.video?.duration_s != null &&
                  ` · ${summary.video.duration_s} s video`}
              </p>
            )}

            <video
              key={jobId}
              ref={videoRef}
              controls
              className="aspect-video w-full rounded-xl border border-slate-200 bg-black"
              src={getAnnotatedVideoUrl(jobId)}
            />

            {summary?.browser_playable === false && (
              <p className="text-xs text-amber-700">
                This video could not be re-encoded for the browser (the worker has no
                ffmpeg). Download it to watch it.
              </p>
            )}

            {summary && (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2">
                  <p className="text-xs font-semibold text-slate-800">
                    Alarm log
                  </p>

                  <p className="text-[11px] text-slate-500">
                    {summary.events_total} event{summary.events_total === 1 ? '' : 's'}
                    {summary.events.length > 0 && ' · click a time to jump there'}
                  </p>
                </div>

                {summary.events.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-slate-500">
                    No alarm: the model never saw fire or smoke in{' '}
                    {summary.settings.enter_hits} of {summary.settings.window} checks
                    in a row.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-4 py-2 font-semibold">Time</th>
                          <th className="px-4 py-2 font-semibold">Event</th>
                          <th className="px-4 py-2 font-semibold">Confidence</th>
                          <th className="px-4 py-2 font-semibold">Details</th>
                        </tr>
                      </thead>

                      <tbody>
                        {summary.events.map((event, index) => {
                          const { label, tone } =
                            EVENT_LABELS[event.event]?.(event) || {
                              label: event.event,
                              tone: 'text-slate-700',
                            }

                          return (
                            <tr
                              key={`${event.frame}-${event.event}-${index}`}
                              className="border-t border-slate-100"
                            >
                              <td className="px-4 py-2">
                                <button
                                  type="button"
                                  onClick={() => seekTo(event.time_s)}
                                  className="font-mono text-blue-700 hover:underline"
                                >
                                  {formatTime(event.time_s)}
                                </button>
                              </td>
                              <td className={`px-4 py-2 font-semibold ${tone}`}>
                                {label}
                              </td>
                              <td className="px-4 py-2 text-slate-700">
                                {formatPercent(event.score)}
                              </td>
                              <td className="px-4 py-2 text-slate-500">
                                {event.detail}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => downloadAnnotatedVideo(jobId)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-900"
              >
                <Download className="h-4 w-4" />
                Download Annotated Video
              </button>

              <button
                type="button"
                onClick={() => downloadFireSmokeCSV(jobId)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Download Events CSV
              </button>
            </div>

            {results && (
              <details className="rounded-xl border border-slate-200 p-3">
                <summary className="cursor-pointer text-xs font-semibold text-slate-800">
                  View raw backend result
                </summary>

                <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap break-all text-[11px] text-slate-600">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {!job && !uploading && (
        <section className={cardClass}>
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-700">
              Model Output
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Detection Events
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <ScanSearch className="h-10 w-10 text-slate-400" />

            <p className="mt-3 text-sm font-semibold text-slate-800">
              No inference data available
            </p>

            <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
              Upload a video to create an inference job. Actual fire and smoke
              detections will appear here once model processing is complete.
            </p>
          </div>
        </section>
      )}

      {/* MODEL OUTPUT BOUNDARY */}
      <section className={cardClass}>
        <div className="border-b border-slate-100 px-6 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-700">
            Operator Note
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Model Output Boundary
          </h2>
        </div>

        <div className="flex items-start gap-3 p-6 text-[12.5px] leading-6 text-slate-600">
          <ScanSearch className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

          <p>
            Results come from the fire-and-smoke team's Model 7 (DINOv3 +
            Faster R-CNN). An alarm is raised only when the same fire or smoke
            is seen in 6 of 15 consecutive checks, which filters out glare and
            flicker. Concentration values such as SO₂/NOx/CO₂ are not inferred
            from RGB video unless a sensor/CEMS feed is integrated.
          </p>
        </div>
      </section>

    </div>
  )
}
