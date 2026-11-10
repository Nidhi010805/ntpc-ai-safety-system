
import { useEffect, useState } from 'react'
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
  getFireSmokeResults,
  getAnnotatedVideoUrl,
  downloadAnnotatedVideo,
  downloadFireSmokeCSV,
} from '../services/fireSmokeApi'

export default function FireSmoke() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [job, setJob] = useState(null)
  const [results, setResults] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [backendOnline, setBackendOnline] = useState(null)

  const jobId = job?.job_id
  const status = job?.status

  const isCompleted = status === 'completed'
  const isProcessing = status === 'processing' || status === 'queued'

  // BACKEND HEALTH CHECK
  useEffect(() => {
    let mounted = true

    async function checkBackend() {
      try {
        await checkFireSmokeHealth()
        if (mounted) setBackendOnline(true)
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
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          'Active events',
          'Highest confidence',
          'Steam classified safe',
          'Temporal gate',
        ].map((label) => (
          <div key={label} className={`${cardClass} p-4`}>
            <p className="text-[11px] text-slate-500">
              {label}
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              —
            </p>
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

            <p className="text-xs text-slate-500">
              Detection-specific metrics will be mapped here after the model
              output format is confirmed.
            </p>

            <video
              key={jobId}
              controls
              className="aspect-video w-full rounded-xl border border-slate-200 bg-black"
              src={getAnnotatedVideoUrl(jobId)}
            />

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
            Detection classes, confidence scores, timestamps and bounding boxes
            will be displayed according to the actual model output.
            Concentration values such as SO₂/NOx/CO₂ are not inferred from RGB
            video unless a sensor/CEMS feed is integrated.
          </p>
        </div>
      </section>

    </div>
  )
}
