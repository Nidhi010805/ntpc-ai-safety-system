
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
).replace(/\/$/, '')

const FIRE_SMOKE_API = `${API_BASE_URL}/api/fire-smoke`

async function apiRequest(endpoint, options = {}) {
  let response

  try {
    response = await fetch(`${FIRE_SMOKE_API}${endpoint}`, options)
  } catch {
    throw new Error(
      'Unable to connect to the backend. Please check whether FastAPI is running.'
    )
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`

    try {
      const errorData = await response.json()
      message = errorData.detail || message
    } catch {
      // Keep default error message.
    }

    throw new Error(message)
  }

  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response
}

// Backend health check
export async function checkFireSmokeHealth() {
  return apiRequest('/health')
}

// Upload video
export async function uploadFireSmokeVideo(file) {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest('/jobs', {
    method: 'POST',
    body: formData,
  })
}

// Get all jobs
export async function getFireSmokeJobs() {
  return apiRequest('/jobs')
}

// Get individual job
export async function getFireSmokeJob(jobId) {
  return apiRequest(`/jobs/${encodeURIComponent(jobId)}`)
}

// Get inference results
export async function getFireSmokeResults(jobId) {
  return apiRequest(`/jobs/${encodeURIComponent(jobId)}/results`)
}

// Annotated video URL
export function getAnnotatedVideoUrl(jobId) {
  return `${FIRE_SMOKE_API}/jobs/${encodeURIComponent(jobId)}/video`
}

// Events CSV URL
export function getFireSmokeEventsUrl(jobId) {
  return `${FIRE_SMOKE_API}/jobs/${encodeURIComponent(jobId)}/events`
}

// Download file
async function downloadFile(endpoint, filename) {
  const response = await apiRequest(endpoint)
  const blob = await response.blob()

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  link.remove()

  window.URL.revokeObjectURL(url)
}

// Download annotated video
export async function downloadAnnotatedVideo(jobId) {
  return downloadFile(
    `/jobs/${encodeURIComponent(jobId)}/video`,
    `fire-smoke-${jobId}.mp4`
  )
}

// Download events CSV
export async function downloadFireSmokeCSV(jobId) {
  return downloadFile(
    `/jobs/${encodeURIComponent(jobId)}/events`,
    `fire-smoke-events-${jobId}.csv`
  )
}
