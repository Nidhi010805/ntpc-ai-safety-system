
import { useCallback, useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  HardHat,
  Glasses,
  Footprints,
  Hand,
  Shirt,
  Upload,
  RefreshCw,
  Video,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  LoaderCircle,
  FileVideo,
} from "lucide-react";

import Panel from "../components/Panel";
import {
  checkPpeHealth,
  uploadPpeVideo,
  getPpeJobs,
  getPpeJob,
  getPpeResults,
  getPpeAnnotatedVideoUrl,
} from "../services/ppeApi";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

const equipment = [
  { name: "Safety Helmet", icon: HardHat },
  { name: "Safety Glasses", icon: Glasses },
  { name: "Safety Gloves", icon: Hand },
  { name: "Safety Boots", icon: Footprints },
  { name: "Hi-Vis Vest", icon: Shirt },
];

function StatCard({ title, value, subtitle, icon: Icon, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const value = String(status || "Pending").toLowerCase();

  const styles =
    value === "completed" || value === "success"
      ? "bg-emerald-50 text-emerald-700"
      : value === "failed"
      ? "bg-red-50 text-red-700"
      : value === "processing"
      ? "bg-blue-50 text-blue-700"
      : "bg-amber-50 text-amber-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles}`}>
      {status || "Pending"}
    </span>
  );
}

function EquipmentCard({ item, count }) {
  const Icon = item.icon;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4">
      <div className="rounded-xl bg-blue-50 p-3 text-blue-800">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{item.name}</p>
        <p className="mt-1 text-xs text-slate-500">
          {count ?? "—"} detections
        </p>
      </div>
    </div>
  );
}

export default function PpeCompliance() {
  const [health, setHealth] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [results, setResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [healthResponse, jobsResponse] = await Promise.all([
        checkPpeHealth(),
        getPpeJobs(),
      ]);

      setHealth(healthResponse);

      const jobList = Array.isArray(jobsResponse)
        ? jobsResponse
        : jobsResponse?.jobs || [];

      setJobs(jobList);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to connect to PPE backend. Check whether backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const interval = setInterval(loadDashboard, 10000);
    return () => clearInterval(interval);
  }, [loadDashboard]);

  const openJob = async (job) => {
    setSelectedJob(job);
    setResults(null);
    setError("");

    try {
      const jobId = job.job_id || job.id;
      const jobResponse = await getPpeJob(jobId);
      setSelectedJob(jobResponse?.job || jobResponse);

      const status = String(
        jobResponse?.status || jobResponse?.job?.status || job.status || ""
      ).toLowerCase();

      if (status === "completed") {
        const resultResponse = await getPpeResults(jobId);
        setResults(resultResponse?.results || resultResponse);
      }
    } catch (err) {
      setError(err?.message || "Could not load job details.");
    }
  };

  // Keep the selected job updated while the worker processes the video.
  // When it completes, automatically fetch the detection results.
  useEffect(() => {
    const jobId = selectedJob?.job_id || selectedJob?.id;
    if (!jobId) return;

    let cancelled = false;
    let resultsLoaded = false;

    const refreshSelectedJob = async () => {
      try {
        const response = await getPpeJob(jobId);
        const updatedJob = response?.job || response;
        if (cancelled || !updatedJob) return;

        setSelectedJob(updatedJob);
        const status = String(updatedJob.status || "").toLowerCase();

        if (status === "completed" && !resultsLoaded) {
          resultsLoaded = true;
          const resultResponse = await getPpeResults(jobId);
          if (!cancelled) {
            setResults(resultResponse?.results || resultResponse);
            await loadDashboard();
          }
        } else if (status === "failed") {
          setResults(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Unable to refresh PPE job:", err);
        }
      }
    };

    refreshSelectedJob();
    const interval = setInterval(refreshSelectedJob, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [selectedJob?.job_id, selectedJob?.id, loadDashboard]);

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a video before uploading.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const response = await uploadPpeVideo(selectedFile);
      setSelectedFile(null);

      const fileInput = document.getElementById("ppe-video-input");
      if (fileInput) fileInput.value = "";

      await loadDashboard();

      const newJob = response?.job || response;
      if (newJob?.job_id || newJob?.id) {
        await openJob(newJob);
      }
    } catch (err) {
      setError(err?.message || "Video upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const workerOnline =
    health?.worker_status?.online === true ||
    health?.worker_status === "online" ||
    health?.worker_status === "connected";

  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(
    (job) => String(job.status).toLowerCase() === "completed"
  ).length;
  const processingJobs = jobs.filter(
    (job) => String(job.status).toLowerCase() === "processing"
  ).length;
  const failedJobs = jobs.filter(
    (job) => String(job.status).toLowerCase() === "failed"
  ).length;

  const summary = results?.summary || {};
  const detections = results?.detections || [];

  const annotatedVideoUrl = selectedJob
    ? getPpeAnnotatedVideoUrl(selectedJob.job_id || selectedJob.id)
    : null;

  const modelName =
    results?.model?.name ||
    health?.model_name ||
    "PPE Detection Model";

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-5 md:p-7">
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-900">
              Thermal Generation Unit Surveillance
            </span>
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              PPE Monitoring
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            PPE Compliance Monitoring
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            AI-powered personal protective equipment detection and safety
            monitoring
          </p>
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* BACKEND / WORKER STATUS */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-xl p-3 ${
              workerOnline
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <Activity size={22} />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              PPE Model Worker
            </p>
            <p className="text-xs text-slate-500">
              {workerOnline
                ? "Worker connected and ready to process jobs"
                : "Worker is currently offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              workerOnline ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          <span
            className={`text-sm font-semibold ${
              workerOnline ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {workerOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle size={19} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Video Jobs"
          value={totalJobs}
          subtitle="Videos submitted for analysis"
          icon={Video}
          color="blue"
        />

        <StatCard
          title="Completed Jobs"
          value={completedJobs}
          subtitle="Successfully processed videos"
          icon={CheckCircle2}
          color="green"
        />

        <StatCard
          title="Processing"
          value={processingJobs}
          subtitle="Jobs currently in progress"
          icon={LoaderCircle}
          color="amber"
        />

        <StatCard
          title="Failed Jobs"
          value={failedJobs}
          subtitle="Jobs requiring attention"
          icon={ShieldAlert}
          color="red"
        />
      </div>

      {/* UPLOAD AND MODEL INFORMATION */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-800">
                <Upload size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Upload Inspection Video
                </h2>
                <p className="text-xs text-slate-500">
                  Submit a plant surveillance video for PPE analysis
                </p>
              </div>
            </div>

            <form onSubmit={handleUpload}>
              <label
                htmlFor="ppe-video-input"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-5 py-9 text-center transition hover:border-blue-400 hover:bg-blue-50"
              >
                <div className="mb-3 rounded-full bg-white p-4 text-blue-800 shadow-sm">
                  <FileVideo size={28} />
                </div>

                <p className="text-sm font-bold text-slate-800">
                  {selectedFile ? selectedFile.name : "Choose a video file"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Supported formats: MP4, AVI, MOV, MKV
                </p>

                <input
                  id="ppe-video-input"
                  type="file"
                  accept=".mp4,.avi,.mov,.mkv,video/*"
                  className="hidden"
                  onChange={(event) =>
                    setSelectedFile(event.target.files?.[0] || null)
                  }
                />
              </label>

              <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <p className="text-xs text-slate-500">
                  Video will be queued for processing by the PPE model worker.
                </p>

                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Upload size={17} />
                  )}
                  {uploading ? "Uploading..." : "Upload & Analyze"}
                </button>
              </div>
            </form>
          </Panel>
        </div>

        <Panel>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Model Information
              </h2>
              <p className="text-xs text-slate-500">Detection service</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500">Model Name</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {modelName}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-500">Backend Connection</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {health ? "Connected" : "Not connected"}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-500">Worker Status</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {workerOnline ? "Ready" : "Waiting for worker"}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-500">Backend URL</p>
              <p className="mt-1 break-all text-xs font-medium text-slate-700">
                {API_BASE}
              </p>
            </div>
          </div>
        </Panel>
      </div>

      {/* EQUIPMENT CATEGORIES */}
      <Panel>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            PPE Equipment Categories
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Equipment categories displayed by the monitoring interface
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {equipment.map((item) => (
            <EquipmentCard key={item.name} item={item} />
          ))}
        </div>
      </Panel>

      {/* JOB HISTORY */}
      <Panel>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Video Analysis History
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Track submitted videos and their processing status
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800">
            {jobs.length} Total Jobs
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-xl bg-slate-50 px-4 py-10 text-center">
            <Video className="mx-auto mb-3 text-slate-400" size={30} />
            <p className="text-sm font-semibold text-slate-700">
              No video analysis jobs yet
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Upload an inspection video to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-3 font-semibold">Job ID</th>
                  <th className="px-3 py-3 font-semibold">Video</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Created</th>
                  <th className="px-3 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job, index) => (
                  <tr
                    key={job.job_id || job.id || index}
                    className="border-b border-slate-50 text-sm last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-3 py-4 font-semibold text-slate-800">
                      {(job.job_id || job.id || "—").toString().slice(0, 12)}
                    </td>

                    <td className="max-w-[200px] truncate px-3 py-4 text-slate-600">
                      {job.filename || job.video_name || job.file_name || "Uploaded video"}
                    </td>

                    <td className="px-3 py-4">
                      <StatusPill status={job.status} />
                    </td>

                    <td className="px-3 py-4 text-xs text-slate-500">
                      {job.created_at
                        ? new Date(job.created_at).toLocaleString()
                        : "—"}
                    </td>

                    <td className="px-3 py-4 text-right">
                      <button
                        onClick={() => openJob(job)}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-100"
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* SELECTED JOB RESULTS */}
      {selectedJob && (
        <Panel>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Analysis Results
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Job ID: {selectedJob.job_id || selectedJob.id}
              </p>
            </div>

            <StatusPill status={selectedJob.status} />
          </div>

          {String(selectedJob.status).toLowerCase() === "processing" && (
            <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              <div className="flex items-center gap-2 font-semibold">
                <LoaderCircle size={18} className="animate-spin" />
                Video is being processed by the PPE model worker.
              </div>
              <p className="mt-2 text-xs">
                Refreshing the dashboard will update the job status.
              </p>
            </div>
          )}

          {String(selectedJob.status).toLowerCase() === "failed" && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <AlertTriangle className="mb-2" size={20} />
              Video processing failed. Please check the backend worker logs.
            </div>
          )}

          {results && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  title="Total Workers"
                  value={summary.total_workers ?? "—"}
                  subtitle="Workers detected in video"
                  icon={Activity}
                  color="blue"
                />
                <StatCard
                  title="Compliant Workers"
                  value={summary.compliant_workers ?? "—"}
                  subtitle="Workers meeting PPE requirements"
                  icon={ShieldCheck}
                  color="green"
                />
                <StatCard
                  title="Violations"
                  value={summary.violations ?? "—"}
                  subtitle="Reported PPE violations"
                  icon={ShieldAlert}
                  color="red"
                />
              </div>

              {annotatedVideoUrl && (
                <div>
                  <h3 className="mb-3 text-sm font-bold text-slate-800">
                    Annotated Video
                  </h3>
                  <video
                    key={annotatedVideoUrl}
                    src={annotatedVideoUrl}
                    controls
                    className="max-h-[480px] w-full rounded-xl bg-black"
                  />
                </div>
              )}

              <div>
                <h3 className="mb-3 text-sm font-bold text-slate-800">
                  Detection Details
                </h3>

                {detections.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                    No detection details returned by the model.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                          <th className="px-3 py-3">Equipment / Class</th>
                          <th className="px-3 py-3">Timestamp</th>
                          <th className="px-3 py-3">Confidence</th>
                          <th className="px-3 py-3">Compliance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detections.map((detection, index) => (
                          <tr
                            key={index}
                            className="border-b border-slate-50 text-sm last:border-0"
                          >
                            <td className="px-3 py-3 font-medium text-slate-800">
                              {detection.class || "Detection"}
                            </td>
                            <td className="px-3 py-3 text-slate-600">
                              {detection.timestamp ?? "—"}
                            </td>
                            <td className="px-3 py-3 text-slate-600">
                              {detection.confidence != null
                                ? `${(Number(detection.confidence) * 100).toFixed(1)}%`
                                : "—"}
                            </td>
                            <td className="px-3 py-3">
                              {detection.compliant === true ? (
                                <span className="font-semibold text-emerald-700">
                                  Compliant
                                </span>
                              ) : detection.compliant === false ? (
                                <span className="font-semibold text-red-700">
                                  Violation
                                </span>
                              ) : (
                                <span className="text-slate-500">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </Panel>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Clock size={14} />
        PPE monitoring data refreshes every 10 seconds.
      </div>
    </div>
  );
}
