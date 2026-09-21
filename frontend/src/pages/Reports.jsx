import React, { useMemo, useState } from "react";
import {
  AlarmClock,
  Archive,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Cloud,
  Download,
  FileArchive,
  FileCheck2,
  FileJson,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  Gavel,
  HardHat,
  History,
  Mail,
  Plus,
  RefreshCw,
  Router,
  Search,
  ShieldCheck,
  Signature,
  Sparkles,
  X,
} from "lucide-react";

const REPORTS = [
  {
    id: "REP-2026-0912-SB",
    category: "handover",
    status: "pending",
    date: "12 Sep 2026",
    zone: "All CHP Sectors",
    title: "Shift B Operational Safety Handover Docket — 12 Sep 2026",
    subtitle: "Shift B (06:00 - 14:30 IST)",
    description:
      "Shift In-Charge: Ramesh V. (Desk #1) • NTPC Korba CHP Unit 1-6 • Level 1 Deluge Event Captured",
    hash: "d91a...71fa",
  },
  {
    id: "AUD-CEA-2026-08",
    category: "audit",
    status: "sealed",
    date: "August 2026",
    zone: "All CHP Sectors",
    title:
      "Statutory Monthly Safety & CCTV Compliance Audit (NTPC-CEA Annexure XII)",
    subtitle: "Full Month Audit • August 2026",
    description:
      "34-page regulatory docket covering 60 PTZ camera nodes, 1,248 hazard detections, deluge verification and contractor safety training.",
    hash: "e7f82b98401da0119c4d2938abef9a12c4",
  },
  {
    id: "INC-2026-8801-DIR",
    category: "incident",
    status: "closed",
    date: "12 Sep 2026",
    zone: "Track Hopper",
    title:
      "Directorate Level Investigation: Track Hopper 02 Smoldering Coal Event",
    subtitle: "Track Hopper 02 • Deluge Deployment",
    description:
      "Root cause analysis of localized 182°C heating on Coal Conveyor BC-02A with FLIR replay and deluge pressure telemetry.",
    hash: "inc8801a7f4",
  },
  {
    id: "PPE-2026-W36",
    category: "ppe",
    status: "digest",
    date: "01 Sep – 07 Sep 2026",
    zone: "Bunkers",
    title: "Weekly AI PPE Compliance & Behavioral Safety Analysis",
    subtitle: "Weekly Digest",
    description:
      "28,410 worker frames analyzed across hardhats, fall arrest harnesses, reflective vests and steel-toe footwear.",
    hash: "ppe36c02ab",
  },
  {
    id: "HW-CCTV-2026-Q3",
    category: "hardware",
    status: "generated",
    date: "Today 04:00 IST",
    zone: "All CHP Sectors",
    title:
      "Coal Handling Plant Camera Hardware, Lens Clarity & Bandwidth Diagnostics",
    subtitle: "60/60 Nodes Active",
    description:
      "Mean latency 18ms • Optical lens cleared • Pneumatic airblast cycle complete.",
    hash: "hwq3f842",
  },
];

const TABS = [
  { id: "all", label: "All Compliance Reports", count: 142 },
  { id: "handover", label: "Shift Handover Dockets", count: 48 },
  { id: "audit", label: "CEA & DGMS Audits", count: 12 },
  { id: "incident", label: "Incident Investigations", count: 5 },
  { id: "ppe", label: "PPE Compliance Summaries" },
  { id: "thermal", label: "Thermal Hotspot Logs" },
];

const SCHEDULES = [
  {
    id: 1,
    title: "Daily Shift Handover",
    time: "06:00, 14:00, 22:00 IST at each shift conclusion",
    target: "Shift Leads • Fire Station WhatsApp",
  },
  {
    id: 2,
    title: "Weekly CEA Statutory Digest",
    time: "Mondays at 08:00 AM IST",
    target: "Executive Director • Encrypted Docket",
  },
  {
    id: 3,
    title: "Critical Thermal Flash Alert",
    time: "Dispatched within 120s of Level 1 Fire/Thermal trigger",
    target: "SMS Alert • Plant General Manager",
  },
];

export default function Reports() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("REP-2026-0912");
  const [dateRange, setDateRange] = useState("01 Sep 2026 – 12 Sep 2026");
  const [zone, setZone] = useState("All CHP Sectors");

  const [preview, setPreview] = useState(null);
  const [signed, setSigned] = useState(false);
  const [toast, setToast] = useState(null);

  const [template, setTemplate] = useState(
    "Shift Handover Operational Dossier"
  );
  const [timeframe, setTimeframe] = useState("Current Shift (Shift B)");
  const [format, setFormat] = useState("PDF (Formatted & Sealed)");

  const [attachments, setAttachments] = useState({
    clips: true,
    deluge: true,
    audio: false,
  });

  const [schedules, setSchedules] = useState(
    SCHEDULES.map((item) => ({ ...item, enabled: true }))
  );

  const filteredReports = useMemo(() => {
    return REPORTS.filter((report) => {
      const categoryMatch = tab === "all" || report.category === tab;

      const q = search.trim().toLowerCase();

      const searchMatch =
        !q ||
        report.id.toLowerCase().includes(q) ||
        report.title.toLowerCase().includes(q) ||
        report.description.toLowerCase().includes(q) ||
        report.hash.toLowerCase().includes(q);

      const zoneMatch =
        zone === "All CHP Sectors" || report.zone === zone;

      return categoryMatch && searchMatch && zoneMatch;
    });
  }, [tab, search, zone]);

  const notify = (title, message) => {
    setToast({ title, message });

    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const downloadTextFile = (filename, content, type = "text/plain") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  const downloadReport = (report, extension = "txt") => {
    downloadTextFile(
      `${report.id}.${extension}`,
      [
        "HeightX-Safe Compliance Archive",
        "",
        `Report ID: ${report.id}`,
        `Title: ${report.title}`,
        `Period: ${report.date}`,
        `Zone: ${report.zone}`,
        `Status: ${report.status}`,
        `Hash: ${report.hash}`,
        "",
        report.description,
      ].join("\n")
    );

    notify("Report Exported", `${report.id} downloaded successfully.`);
  };

  const verifyHash = (report) => {
    notify(
      "SHA-256 Verification Passed",
      `${report.id} archive signature matches the stored audit record.`
    );
  };

  const signDocket = () => {
    setSigned(true);

    notify(
      "Digital Token Applied",
      "Shift B handover docket has been signed and sealed."
    );
  };

  const resetFilters = () => {
    setTab("all");
    setSearch("");
    setDateRange("01 Sep 2026 – 12 Sep 2026");
    setZone("All CHP Sectors");

    notify("Filters Reset", "Report ledger restored.");
  };

  const compileReport = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      template,
      timeframe,
      format,
      attachments,
      plant: "NTPC Korba CHP Unit 1-6",
      source: "HeightX-Safe",
    };

    if (format.includes("JSON")) {
      downloadTextFile(
        "HeightX-Safe-Custom-Dossier.json",
        JSON.stringify(payload, null, 2),
        "application/json"
      );
    } else if (format.includes("Excel")) {
      const csv = [
        "Field,Value",
        `Template,"${template}"`,
        `Timeframe,"${timeframe}"`,
        `Format,"${format}"`,
        `AI Clips,${attachments.clips}`,
        `Deluge Graph,${attachments.deluge}`,
        `Intercom Audio,${attachments.audio}`,
      ].join("\n");

      downloadTextFile("HeightX-Safe-Custom-Dossier.csv", csv, "text/csv");
    } else {
      window.print();
    }

    notify(
      "Dossier Compiled",
      `${template} prepared using ${timeframe}.`
    );
  };

  const toggleSchedule = (id) => {
    setSchedules((items) =>
      items.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <div className="min-h-full bg-[#f8f9ff] text-[#0b1c30]">
      {toast && (
        <Toast toast={toast} onClose={() => setToast(null)} />
      )}

      {preview && (
        <PreviewModal
          report={preview}
          signed={signed}
          onClose={() => setPreview(null)}
          onDownload={() => downloadReport(preview)}
        />
      )}

      <div className="mx-auto flex w-full max-w-[1900px] flex-col gap-4">

        {/* HEADER */}

        <section className="flex flex-col justify-between gap-4 rounded-xl bg-white p-4 shadow-sm xl:flex-row xl:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>Operations Monitoring</span>
              <ChevronRight size={14} />
              <span>Statutory Audits & Archives</span>
              <ChevronRight size={14} />
              <span className="text-[#00288e]">
                Safety & Compliance Reports
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Safety Compliance & Statutory Audit Archives
              </h1>

              <Badge text="CEA §41.2 Audited" type="success" />
              <Badge text="Annexure Nodes (60/60 Active)" />
              <Badge text="SHA-256 Non-Repudiation" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              icon={FileArchive}
              onClick={() =>
                notify(
                  "Batch Archive Prepared",
                  "142 compliance records queued for archive export."
                )
              }
            >
              Batch Archive (.ZIP)
            </Button>

            <Button
              icon={AlarmClock}
              onClick={() =>
                notify(
                  "Dispatch Console",
                  "Automated report dispatch controls are active."
                )
              }
            >
              Automated Dispatch
            </Button>

            <Button
              primary
              icon={Plus}
              onClick={() =>
                document
                  .getElementById("report-generator")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Generate Custom Report
            </Button>
          </div>
        </section>

        {/* KPIs */}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Metric
            title="Monthly Compilations"
            value="142"
            accent="+12% MoM"
            sub="RAID-6 Vault Stored"
            right="100% Retained"
            progress={88}
            icon={Archive}
          />

          <Metric
            title="Shift Handover SLA"
            value="99.4%"
            accent="Compliant"
            sub="48 of 48 Sign-Offs"
            right="Desk #1–#4"
            progress={99.4}
            icon={FileCheck2}
            success
          />

          <Metric
            title="Statutory Audit Status"
            value="Grade A"
            accent="0 Breaches"
            sub="CEA & DGMS Standards"
            right="Valid Q3 2026"
            progress={100}
            icon={ShieldCheck}
            success
          />

          <Metric
            title="Pending Sign-Off"
            value={signed ? "0" : "1"}
            accent={signed ? "Completed" : "Action Required"}
            sub="Shift B Handover"
            right="Ramesh V."
            progress={signed ? 100 : 25}
            icon={Signature}
            danger={!signed}
            success={signed}
          />

          <Metric
            title="Edge Compiler Speed"
            value="4.2s"
            accent="Mean / PDF"
            sub="AI Snapshot Stitched"
            right="60 FPS Buffers"
            progress={92}
            icon={Sparkles}
          />
        </section>

        {/* FILTER CONSOLE */}

        <section className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                  tab === item.id
                    ? "bg-[#00288e] text-white"
                    : "bg-[#e5eeff] text-slate-600 hover:bg-[#dce9ff]"
                }`}
              >
                {item.label}

                {item.count && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      tab === item.id
                        ? "bg-white/20"
                        : "bg-white"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-12">
            <div className="relative md:col-span-4">
              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Report ID, plant zone, signature hash..."
                className="h-10 w-full rounded-lg bg-[#eff4ff] pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#00288e]"
              />
            </div>

            <div className="relative md:col-span-3">
              <CalendarDays
                size={17}
                className="pointer-events-none absolute left-3 top-3 text-slate-400"
              />

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg bg-[#eff4ff] pl-10 pr-3 text-xs font-medium outline-none"
              >
                <option>01 Sep 2026 – 12 Sep 2026</option>
                <option>August 2026</option>
                <option>Q3 2026</option>
                <option>Year 2026</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="h-10 w-full rounded-lg bg-[#eff4ff] px-3 text-xs font-medium outline-none"
              >
                <option>All CHP Sectors</option>
                <option>Track Hopper</option>
                <option>Bunkers</option>
                <option>Crusher House</option>
                <option>Coal Yard</option>
              </select>
            </div>

            <div className="flex gap-2 md:col-span-2">
              <button
                onClick={() =>
                  notify(
                    "Filters Applied",
                    `${filteredReports.length} matching report(s) found.`
                  )
                }
                className="flex h-10 flex-1 items-center justify-center gap-1 rounded-lg bg-[#e5eeff] text-xs font-bold hover:bg-[#dce9ff]"
              >
                <Filter size={16} />
                Apply
              </button>

              <button
                onClick={resetFilters}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eff4ff] text-slate-500 hover:bg-[#dce9ff]"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* WORKSPACE */}

        <section className="grid grid-cols-1 items-start gap-4 xl:grid-cols-12">

          {/* LEFT */}

          <div className="flex flex-col gap-4 xl:col-span-8">
            {filteredReports.length === 0 && (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <Search className="mx-auto text-slate-300" size={38} />
                <h3 className="mt-3 font-bold">No reports found</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Change the report category, zone or search query.
                </p>
              </div>
            )}

            {filteredReports.map((report) => {
              if (report.category === "handover") {
                return (
                  <HandoverReport
                    key={report.id}
                    report={report}
                    signed={signed}
                    onPreview={() => setPreview(report)}
                    onSign={signDocket}
                    onDownload={() => downloadReport(report)}
                  />
                );
              }

              if (report.category === "audit") {
                return (
                  <AuditReport
                    key={report.id}
                    report={report}
                    onVerify={() => verifyHash(report)}
                    onDownload={() => downloadReport(report)}
                  />
                );
              }

              if (report.category === "incident") {
                return (
                  <IncidentReport
                    key={report.id}
                    report={report}
                    onCSV={() => downloadReport(report, "csv")}
                    onDownload={() => downloadReport(report)}
                  />
                );
              }

              if (report.category === "ppe") {
                return (
                  <PPEReport
                    key={report.id}
                    report={report}
                    onPreview={() => setPreview(report)}
                    onDownload={() => downloadReport(report)}
                  />
                );
              }

              return (
                <HardwareReport
                  key={report.id}
                  report={report}
                  onDownload={() => downloadReport(report)}
                />
              );
            })}
          </div>

          {/* RIGHT */}

          <aside className="flex flex-col gap-4 xl:col-span-4">

            {/* GENERATOR */}

            <div
              id="report-generator"
              className="rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={21} className="text-[#00288e]" />

                  <h3 className="text-lg font-bold">
                    Instant Dossier Export
                  </h3>
                </div>

                <span className="rounded bg-[#e5eeff] px-2 py-1 text-[10px] font-bold">
                  Fast Edge Build
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <Field label="Report Template">
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="input"
                  >
                    <option>Shift Handover Operational Dossier</option>
                    <option>
                      Statutory DGMS / CEA Safety Audit (Form IV)
                    </option>
                    <option>
                      Incident Flash Report (L1 Deluge Actuation)
                    </option>
                    <option>PPE Compliance & Heatmap Analysis</option>
                    <option>
                      Thermal Hotspot Log with Raw Telemetry
                    </option>
                  </select>
                </Field>

                <div className="grid grid-cols-2 gap-2">
                  <Field label="Timeframe">
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="input"
                    >
                      <option>Current Shift (Shift B)</option>
                      <option>Last 24 Hours</option>
                      <option>Past 7 Days</option>
                      <option>Month to Date</option>
                    </select>
                  </Field>

                  <Field label="Output Format">
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="input"
                    >
                      <option>PDF (Formatted & Sealed)</option>
                      <option>Excel / CSV (Raw Logs)</option>
                      <option>Signed JSON + SHA256</option>
                    </select>
                  </Field>
                </div>

                <Field label="Included Attachments">
                  <div className="space-y-2">
                    <CheckBox
                      checked={attachments.clips}
                      onChange={(value) =>
                        setAttachments((old) => ({
                          ...old,
                          clips: value,
                        }))
                      }
                      label="60 FPS High-Res AI Bounding Box Clips"
                    />

                    <CheckBox
                      checked={attachments.deluge}
                      onChange={(value) =>
                        setAttachments((old) => ({
                          ...old,
                          deluge: value,
                        }))
                      }
                      label="Deluge Spray Pressure Sensor Graph"
                    />

                    <CheckBox
                      checked={attachments.audio}
                      onChange={(value) =>
                        setAttachments((old) => ({
                          ...old,
                          audio: value,
                        }))
                      }
                      label="Control Room Intercom Audio Recording"
                    />
                  </div>
                </Field>

                <button
                  onClick={compileReport}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#00288e] text-xs font-bold text-white hover:bg-blue-800"
                >
                  <Download size={17} />
                  Compile & Download Report
                </button>
              </div>
            </div>

            {/* AUTOMATED DISPATCH */}

            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail size={21} className="text-[#006c4a]" />
                  <h3 className="text-lg font-bold">
                    Automated Dispatches
                  </h3>
                </div>

                <button
                  onClick={() =>
                    notify(
                      "Schedule Builder",
                      "New dispatch schedule can be configured here."
                    )
                  }
                  className="flex items-center gap-1 text-xs font-bold text-[#00288e]"
                >
                  <Plus size={15} />
                  Add Schedule
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-start justify-between gap-3 rounded-lg bg-[#eff4ff] p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold">
                          {schedule.title}
                        </p>

                        <span
                          className={`h-2 w-2 rounded-full ${
                            schedule.enabled
                              ? "bg-emerald-600"
                              : "bg-slate-400"
                          }`}
                        />
                      </div>

                      <p className="mt-1 text-xs text-slate-600">
                        {schedule.time}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {schedule.target}
                      </p>
                    </div>

                    <Toggle
                      value={schedule.enabled}
                      onClick={() => toggleSchedule(schedule.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* PRESERVATION */}

            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Gavel size={20} className="text-[#00288e]" />
                <h3 className="text-sm font-bold">
                  Statutory Preservation Notice
                </h3>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-600">
                All incident snapshots, thermal calibrations and
                operator sign-offs are retained with cryptographic
                non-repudiation timestamps.
              </p>

              <div className="mt-4 flex justify-between text-xs">
                <span className="text-slate-400">
                  RAID-6 Primary Storage
                </span>

                <span className="font-semibold">
                  98.2 TB Free / 120 TB
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e5eeff]">
                <div className="h-full w-[18%] bg-[#006c4a]" />
              </div>

              <div className="mt-3 flex justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Cloud size={13} className="text-[#006c4a]" />
                  Cloud Mirror: AES-256
                </span>

                <span className="font-bold">
                  90-Day Retention Guarantee
                </span>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <style>{`
        .input {
          width: 100%;
          height: 40px;
          padding: 0 10px;
          border: 0;
          border-radius: 8px;
          background: #eff4ff;
          color: #0b1c30;
          font-size: 12px;
          outline: none;
        }

        .input:focus {
          box-shadow: 0 0 0 2px #00288e;
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   REPORT CARDS
========================================================= */

function HandoverReport({
  report,
  signed,
  onPreview,
  onSign,
  onDownload,
}) {
  return (
    <ReportShell color={signed ? "#006c4a" : "#700006"}>
      <ReportHeader
        report={report}
        badge={signed ? "Signed & Sealed" : "Action Required: Pending Sign-Off"}
        danger={!signed}
        actions={
          <>
            <SmallButton icon={Search} onClick={onPreview}>
              Preview
            </SmallButton>

            <SmallButton
              icon={signed ? Check : Signature}
              primary
              onClick={onSign}
              disabled={signed}
            >
              {signed ? "Signed & Sealed" : "Sign & Seal (Token)"}
            </SmallButton>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <Evidence
          title="Track Hopper 02 Hotspot"
          label="HOTSPOT 182°C • TRIGGER #12"
          camera="CAM-12 (FLIR)"
          time="08:14 IST"
          danger
        />

        <Evidence
          title="Crusher Catwalk Breach"
          label="PPE HARNESS BREACH 98.4%"
          camera="CAM-04 (Optical)"
          time="11:22 IST"
        />

        <div className="rounded-lg bg-[#eff4ff] p-3">
          <div className="flex justify-between text-xs font-bold">
            <span>Track Hopper Deluge Spray</span>
            <span className="text-[#006c4a]">38s Deluge</span>
          </div>

          <svg viewBox="0 0 200 80" className="mt-2 h-24 w-full">
            <path
              d="M0,70 Q30,68 60,65 T100,20 T130,25 T160,65 T200,68"
              fill="none"
              stroke="#006c4a"
              strokeWidth="2.5"
            />

            <path
              d="M0,70 Q30,68 60,65 T100,20 T130,25 T160,65 T200,68 L200,80 L0,80 Z"
              fill="#006c4a"
              opacity=".12"
            />

            <circle cx="100" cy="20" r="4" fill="#700006" />
          </svg>

          <div className="flex justify-between text-[9px] text-slate-500">
            <span>08:10 • 34°C</span>
            <span className="font-bold text-red-700">Peak 182°C</span>
            <span>08:25 Stabilized</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
        <span>3 Annexures • Raw JSON Sensor Audit Stored</span>

        <div className="flex items-center gap-3">
          <span>
            Docket Hash:{" "}
            <code className="font-bold text-slate-700">
              {report.hash}
            </code>
          </span>

          <button
            onClick={onDownload}
            className="flex items-center gap-1 rounded bg-[#dce9ff] px-3 py-2 font-bold text-slate-700"
          >
            <Download size={14} />
            Download Signed PDF
          </button>
        </div>
      </div>
    </ReportShell>
  );
}

function AuditReport({ report, onVerify, onDownload }) {
  return (
    <ReportShell color="#006c4a">
      <ReportHeader
        report={report}
        badge="Verified & Government Sealed"
        actions={
          <>
            <SmallButton icon={BadgeCheck} onClick={onVerify}>
              Verify SHA-256
            </SmallButton>

            <SmallButton icon={Download} onClick={onDownload}>
              Download Official PDF
            </SmallButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniStat
          title="Camera Uptime"
          value="99.82%"
          note="Exceeds 98.0% SLA"
        />

        <MiniStat
          title="Total Detections"
          value="1,248"
          note="1,248 Closed (100%)"
        />

        <MiniStat
          title="Mean TTR"
          value="1m 42s"
          note="-18s vs July"
        />

        <MiniStat
          title="Authorized By"
          value="ED Safety"
          note="Digital Token: 0x882B"
        />
      </div>

      <div className="flex flex-wrap justify-between gap-2 text-[10px] text-slate-500">
        <span>
          Cryptographic Hash:{" "}
          <code className="rounded bg-[#eff4ff] px-2 py-1 text-slate-800">
            {report.hash}
          </code>
        </span>

        <span className="font-bold text-[#006c4a]">
          Synchronized to DGMS National Repository
        </span>
      </div>
    </ReportShell>
  );
}

function IncidentReport({ report, onCSV, onDownload }) {
  return (
    <ReportShell color="#1e40af">
      <ReportHeader
        report={report}
        badge="Investigation Closed"
        actions={
          <>
            <SmallButton icon={FileSpreadsheet} onClick={onCSV}>
              Raw CSV
            </SmallButton>

            <SmallButton icon={Download} onClick={onDownload}>
              Download PDF
            </SmallButton>
          </>
        }
      />

      <div className="flex flex-wrap gap-5 text-xs text-slate-600">
        <span className="flex items-center gap-1 text-[#006c4a]">
          <Check size={15} />
          Zero Worker Casualties
        </span>

        <span className="flex items-center gap-1 text-[#006c4a]">
          <Check size={15} />
          Zero Equipment Structural Distortion
        </span>

        <span className="flex items-center gap-1">
          <History size={15} />
          Re-operational in 42 minutes
        </span>
      </div>
    </ReportShell>
  );
}

function PPEReport({ report, onPreview, onDownload }) {
  return (
    <ReportShell color="#757684">
      <ReportHeader
        report={report}
        badge="Weekly Digest"
        actions={
          <>
            <SmallButton icon={Search} onClick={onPreview}>
              Preview
            </SmallButton>

            <SmallButton icon={Download} onClick={onDownload}>
              Download PDF
            </SmallButton>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Progress title="Safety Hardhat Compliance" value={96.2} />
        <Progress title="High-Elevation Fall Harness" value={91} />
        <Progress title="Reflective High-Vis Vest" value={97.4} />
      </div>
    </ReportShell>
  );
}

function HardwareReport({ report, onDownload }) {
  return (
    <ReportShell color="#cbdbf5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e5eeff] text-[#00288e]">
            <Router size={22} />
          </div>

          <div>
            <p className="text-xs font-bold">{report.id}</p>
            <h3 className="mt-1 font-bold">{report.title}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {report.description}
            </p>
          </div>
        </div>

        <SmallButton icon={Download} onClick={onDownload}>
          Download Report
        </SmallButton>
      </div>
    </ReportShell>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function ReportShell({ color, children }) {
  return (
    <article className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm">
      <div
        className="absolute bottom-0 left-0 top-0 w-1.5"
        style={{ backgroundColor: color }}
      />

      <div className="ml-1 flex flex-col gap-4">{children}</div>
    </article>
  );
}

function ReportHeader({ report, badge, danger, actions }) {
  return (
    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-[#dce9ff] px-2 py-1 text-[10px] font-bold">
            {report.id}
          </span>

          <span
            className={`rounded-full px-2 py-1 text-[10px] font-bold ${
              danger
                ? "bg-red-100 text-red-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {badge}
          </span>

          <span className="text-[10px] text-slate-400">
            {report.subtitle}
          </span>
        </div>

        <h2 className="mt-2 text-lg font-bold">{report.title}</h2>

        <p className="mt-1 max-w-4xl text-xs leading-5 text-slate-600">
          {report.description}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
    </div>
  );
}

function Metric({
  title,
  value,
  accent,
  sub,
  right,
  progress,
  icon: Icon,
  success,
  danger,
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {title}
        </span>

        <Icon
          size={19}
          className={
            danger
              ? "text-red-700"
              : success
              ? "text-[#006c4a]"
              : "text-[#00288e]"
          }
        />
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span
          className={`text-2xl font-bold ${
            danger ? "text-red-800" : ""
          }`}
        >
          {value}
        </span>

        <span
          className={`text-[10px] font-bold ${
            danger
              ? "text-red-700"
              : success
              ? "text-[#006c4a]"
              : "text-slate-500"
          }`}
        >
          {accent}
        </span>
      </div>

      <div className="mt-2 flex justify-between gap-2 text-[10px] text-slate-400">
        <span>{sub}</span>
        <span className="font-bold text-slate-600">{right}</span>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#e5eeff]">
        <div
          className={`h-full rounded-full ${
            danger
              ? "bg-red-700"
              : success
              ? "bg-[#006c4a]"
              : "bg-[#00288e]"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Evidence({ title, label, camera, time, danger }) {
  return (
    <div className="rounded-lg bg-[#eff4ff] p-2.5">
      <div className="relative flex h-32 items-center justify-center overflow-hidden rounded bg-[#213145]">
        {danger ? (
          <Flame size={40} className="text-red-400" />
        ) : (
          <HardHat size={40} className="text-yellow-300" />
        )}

        <span
          className={`absolute left-2 top-2 rounded px-2 py-1 text-[9px] font-bold ${
            danger
              ? "bg-red-800 text-white"
              : "bg-[#dce9ff] text-slate-800"
          }`}
        >
          {label}
        </span>

        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-[9px] text-white">
          {camera}
        </span>
      </div>

      <div className="mt-2 flex justify-between text-[10px]">
        <span className="font-bold">{title}</span>
        <span className={danger ? "font-bold text-red-700" : ""}>
          {time}
        </span>
      </div>
    </div>
  );
}

function MiniStat({ title, value, note }) {
  return (
    <div className="rounded-lg bg-[#eff4ff] p-2">
      <p className="text-[10px] text-slate-400">{title}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
      <p className="text-[10px] text-[#006c4a]">{note}</p>
    </div>
  );
}

function Progress({ title, value }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-bold">
        <span>{title}</span>
        <span className="text-[#006c4a]">{value}%</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e5eeff]">
        <div
          className="h-full bg-[#006c4a]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function CheckBox({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[#00288e]"
      />
      {label}
    </label>
  );
}

function Toggle({ value, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative h-6 w-10 shrink-0 rounded-full transition ${
        value ? "bg-[#00288e]" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          value ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function Badge({ text, type }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
        type === "success"
          ? "bg-emerald-100 text-emerald-800"
          : "bg-[#e5eeff] text-slate-700"
      }`}
    >
      {text}
    </span>
  );
}

function Button({ children, icon: Icon, primary, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 items-center gap-2 rounded-lg px-4 text-xs font-bold transition ${
        primary
          ? "bg-[#00288e] text-white hover:bg-blue-800"
          : "bg-[#e5eeff] text-slate-700 hover:bg-[#dce9ff]"
      }`}
    >
      <Icon size={17} />
      {children}
    </button>
  );
}

function SmallButton({
  children,
  icon: Icon,
  primary,
  onClick,
  disabled,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        primary
          ? "bg-[#00288e] text-white hover:bg-blue-800"
          : "bg-[#e5eeff] text-slate-700 hover:bg-[#dce9ff]"
      }`}
    >
      <Icon size={15} />
      {children}
    </button>
  );
}

function Toast({ toast, onClose }) {
  return (
    <div className="fixed right-5 top-20 z-[300] w-[350px] max-w-[calc(100%-40px)] rounded-xl border border-blue-100 bg-white p-4 shadow-2xl">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#006c4a]">
          <Check size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold">{toast.title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="ml-auto h-fit rounded p-1 text-slate-400 hover:bg-slate-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function PreviewModal({ report, signed, onClose, onDownload }) {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
          <div>
            <p className="text-[10px] font-bold uppercase text-[#00288e]">
              Compliance Dossier Preview
            </p>
            <h2 className="font-bold">{report.id}</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-6">
          <div className="rounded-xl bg-[#eff4ff] p-5">
            <div className="flex items-center gap-2 text-[#00288e]">
              <ShieldCheck size={26} />
              <span className="font-bold">HeightX-Safe</span>
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              {report.title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {report.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <MiniStat title="Report ID" value={report.id} note="Verified" />
              <MiniStat title="Period" value={report.date} note={report.zone} />
              <MiniStat
                title="Signature"
                value={signed ? "SEALED" : "ARCHIVED"}
                note="Digital Audit Record"
              />
              <MiniStat
                title="Hash"
                value="SHA-256"
                note={report.hash}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t p-4">
          <SmallButton icon={X} onClick={onClose}>
            Close
          </SmallButton>

          <SmallButton icon={Download} primary onClick={onDownload}>
            Download
          </SmallButton>
        </div>
      </div>
    </div>
  );
}