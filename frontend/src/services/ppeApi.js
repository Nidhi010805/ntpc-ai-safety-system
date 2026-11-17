
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8001"
).replace(/\/$/, "");

const PPE_API = `${API_BASE_URL}/api/ppe`;

async function apiRequest(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${PPE_API}${endpoint}`, options);
  } catch (error) {
    console.error("PPE API connection error:", error);
    throw new Error("Unable to connect to PPE backend. Check backend URL and CORS.");
  }

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

export async function checkPpeHealth() {
  return apiRequest("/health");
}

export async function uploadPpeVideo(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/jobs", {
    method: "POST",
    body: formData,
  });
}

export async function getPpeJobs() {
  return apiRequest("/jobs");
}

export async function getPpeJob(jobId) {
  return apiRequest(`/jobs/${encodeURIComponent(jobId)}`);
}

export async function getPpeResults(jobId) {
  return apiRequest(`/jobs/${encodeURIComponent(jobId)}/results`);
}

export function getPpeAnnotatedVideoUrl(jobId) {
  return `${PPE_API}/jobs/${encodeURIComponent(jobId)}/video`;
}
