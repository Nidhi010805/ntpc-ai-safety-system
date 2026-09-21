import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Download,
  FileText,
  Printer,
  CalendarDays,
  ReceiptText,
  Flame,
  ShieldAlert,
  HardHat,
  Timer,
  Database,
  Eye,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  RotateCcw,
  Video,
  RefreshCw,
  ArrowUpDown,
  CircleAlert,
  Check,
  Undo2,
} from "lucide-react";

/* =========================================================
   EVENT DATA
========================================================= */

const INITIAL_EVENTS = [
  {
    id: "EVT-2026-8801",
    date: "12 Sep 2026",
    time: "14:31:04",
    ping: "32ms",
    camera: "CAM 12",
    cameraId: 12,
    tenderNo: 60,
    location: "Track Hopper 02 Pit",
    detail: "Tender #60, JB No 1 • Coal Hopper Unloading Bay",
    area: "Track Hopper",
    type: "Fire & Smoke",
    detection: "Smoldering Coal & High Thermal Anomaly",
    sub: "FLIR Sensor: 182°C • Surpassed 120°C trip limit",
    severity: "CRITICAL",
    intervention: "Water Deluge Triggered",
    interventionSub: "Fire Bay Ext. 101 dispatched by Ramesh V.",
    status: "Resolved",
  },
  {
    id: "EVT-2026-8798",
    date: "12 Sep 2026",
    time: "14:18:22",
    ping: "28ms",
    camera: "CAM 04",
    cameraId: 4,
    tenderNo: 6,
    location: "Conveyor 2 A/B DE",
    detail: "Tender #6, Crusher House -1 • Pulley Drive End",
    area: "Crusher House",
    type: "Restricted",
    detection: "Restricted Rotating Machinery Zone Entry",
    sub: "Worker breached 1.5m optical perimeter barrier",
    severity: "HIGH",
    intervention: "Boundary Siren Broadcasted",
    interventionSub:
      "Shift Patrol Marshal dispatched; worker evacuated",
    status: "Resolved",
  },
  {
    id: "EVT-2026-8789",
    date: "12 Sep 2026",
    time: "14:02:11",
    ping: "41ms",
    camera: "CAM 34",
    cameraId: 34,
    tenderNo: 44,
    location: "Unit 6 Bunker 17 B",
    detail: "Tender #44 • Boiler Roof Cantilever Floor",
    area: "Bunker",
    type: "No Helmet",
    detection: "Worker Operating Without Safety Helmet",
    sub: "Neural Confidence: 99.2% • Height Zone +38.5m",
    severity: "HIGH",
    intervention: "UHF Ch 3 Push Notification",
    interventionSub: "Dispatched to Bunker Floor Supervisor",
    status: "Acknowledged",
  },
  {
    id: "EVT-2026-8772",
    date: "12 Sep 2026",
    time: "13:45:30",
    ping: "35ms",
    camera: "CAM 16",
    cameraId: 16,
    tenderNo: 25,
    location: "TH-2 Conveyor 18 A/B",
    detail: "Tender #25 • CHANDI Area Steel Gantry Trusses",
    area: "Conveyor",
    type: "Footwear",
    detection: "Non-Compliant Footwear (Soft Shoes)",
    sub: "Mandatory Steel-Toe ISO-20345 absent",
    severity: "MEDIUM",
    intervention: "Contractor Tagged at Gate #2",
    interventionSub:
      "Safety steward provided protective boots",
    status: "Resolved",
  },
  {
    id: "EVT-2026-8761",
    date: "12 Sep 2026",
    time: "13:12:05",
    ping: "30ms",
    camera: "CAM 07",
    cameraId: 7,
    tenderNo: 4,
    location: "Conveyor 2 A/B TE",
    detail: "Tender #4 • Transfer Point TP-1 Chute Zone",
    area: "Conveyor",
    type: "Dust",
    detection: "Minor Dust Cloud & Mist Accumulation",
    sub: "Particulate Vision Occlusion: 28%",
    severity: "MEDIUM",
    intervention: "Auto-Mist Spray Triggered",
    interventionSub:
      "45s spray cycle complete; visibility restored",
    status: "Resolved",
  },
  {
    id: "EVT-2026-8740",
    date: "12 Sep 2026",
    time: "12:28:44",
    ping: "33ms",
    camera: "CAM 44",
    cameraId: 44,
    tenderNo: 11,
    location: "Unit 4 Bunker 15 A",
    detail: "Tender #11 • Conveyor 14 AB Height Runway",
    area: "Bunker",
    type: "Harness",
    detection: "Working at Height: Harness Unanchored",
    sub: "Elevation +24m without lifeline tie-off",
    severity: "HIGH",
    intervention: "Overhead Klaxon Pulsed",
    interventionSub: "Worker immediately re-anchored",
    status: "Resolved",
  },
  {
    id: "EVT-2026-8715",
    date: "12 Sep 2026",
    time: "11:50:18",
    ping: "27ms",
    camera: "CAM 53",
    cameraId: 53,
    tenderNo: 57,
    location: "TP-27 Top Floor Coal Yard",
    detail: "Tender #57 • Pole P1 Junction Box Chute Deck",
    area: "Coal Yard",
    type: "Dust",
    detection: "Heavy Ash / Dust Leakage at Chute Joint",
    sub: "Flange leakage rate ~4.2 kg/hr threshold",
    severity: "MEDIUM",
    intervention: "Work Order #WO-492 Issued",
    interventionSub: "Mechanical maintenance assigned",
    status: "Resolved",
  },

  /* extra rows for pagination demo */

  {
    id: "EVT-2026-8698",
    date: "12 Sep 2026",
    time: "11:14:32",
    ping: "31ms",
    camera: "CAM 04",
    cameraId: 4,
    tenderNo: 6,
    location: "Crusher House -1",
    detail: "Tender #6 • Conveyor 2 A/B Drive End",
    area: "Crusher House",
    type: "Restricted",
    detection: "Worker Entered Restricted Machinery Zone",
    sub: "Optical perimeter breach confidence 97.8%",
    severity: "HIGH",
    intervention: "Local Warning Horn Activated",
    interventionSub: "Area supervisor informed",
    status: "Acknowledged",
  },
  {
    id: "EVT-2026-8682",
    date: "12 Sep 2026",
    time: "10:48:17",
    ping: "29ms",
    camera: "CAM 34",
    cameraId: 34,
    tenderNo: 44,
    location: "Unit 6 Bunker 17 B",
    detail: "Tender #44 • Roof Cantilever Floor",
    area: "Bunker",
    type: "Harness",
    detection: "Safety Harness Lanyard Unhooked",
    sub: "Height-zone PPE rule triggered at +38m",
    severity: "HIGH",
    intervention: "Supervisor Notification Sent",
    interventionSub: "Worker stopped until tie-off restored",
    status: "Resolved",
  },
  {
    id: "EVT-2026-8665",
    date: "12 Sep 2026",
    time: "10:06:51",
    ping: "36ms",
    camera: "CAM 16",
    cameraId: 16,
    tenderNo: 25,
    location: "TH-2 Conveyor 18 A/B",
    detail: "Tender #25 • CHANDI Area",
    area: "Conveyor",
    type: "Footwear",
    detection: "Safety Footwear Non-Compliance",
    sub: "Steel-toe protection not detected",
    severity: "MEDIUM",
    intervention: "Gate Safety Flag Created",
    interventionSub: "Contract worker tagged for briefing",
    status: "Active",
  },
  {
    id: "EVT-2026-8642",
    date: "12 Sep 2026",
    time: "09:37:14",
    ping: "34ms",
    camera: "CAM 07",
    cameraId: 7,
    tenderNo: 4,
    location: "Conveyor 2 A/B TE",
    detail: "Tender #4 • Transfer Point TP-1",
    area: "Conveyor",
    type: "Dust",
    detection: "Dust Visibility Threshold Exceeded",
    sub: "Optical visibility reduced by 31%",
    severity: "MEDIUM",
    intervention: "Mist Cycle Initiated",
    interventionSub: "Automated suppression cycle started",
    status: "Resolved",
  },
  {
    id: "EVT-2026-8619",
    date: "12 Sep 2026",
    time: "08:52:03",
    ping: "26ms",
    camera: "CAM 12",
    cameraId: 12,
    tenderNo: 60,
    location: "Track Hopper 02 Pit",
    detail: "Tender #60 • Coal Hopper Unloading Bay",
    area: "Track Hopper",
    type: "Fire & Smoke",
    detection: "Abnormal Thermal Rise Detected",
    sub: "Surface temperature increased to 128°C",
    severity: "CRITICAL",
    intervention: "Thermal Alarm Escalated",
    interventionSub: "Control room operator verification requested",
    status: "Acknowledged",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const PAGE_SIZE = 6;

const SEVERITY_ORDER = {
  CRITICAL: 3,
  HIGH: 2,
  MEDIUM: 1,
};

const STATUS_ORDER = {
  Active: 3,
  Acknowledged: 2,
  Resolved: 1,
};

function severityStyle(severity) {
  if (severity === "CRITICAL") {
    return "bg-red-100 text-red-800 border-red-200";
  }

  if (severity === "HIGH") {
    return "bg-orange-100 text-orange-800 border-orange-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function statusStyle(status) {
  if (status === "Resolved") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (status === "Acknowledged") {
    return "bg-blue-100 text-blue-800";
  }

  return "bg-red-100 text-red-800";
}

function parseEventDate(event) {
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const [day, month, year] = event.date.split(" ");
  const [hour, minute, second] = event.time
    .split(":")
    .map(Number);

  return new Date(
    Number(year),
    months[month],
    Number(day),
    hour,
    minute,
    second
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function EventHistory() {
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(INITIAL_EVENTS);

  const [search, setSearch] = useState("");
  const [camera, setCamera] = useState("ALL");
  const [area, setArea] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [severity, setSeverity] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [range, setRange] = useState("Today");

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [page, setPage] = useState(1);

  const [sort, setSort] = useState({
    key: "timestamp",
    direction: "desc",
  });

  const [refreshing, setRefreshing] = useState(false);

  const [lastUpdated, setLastUpdated] = useState(
    new Date()
  );

  const [toast, setToast] = useState(null);

  /* =======================================================
     TOAST
  ======================================================= */

  const showToast = (title, message) => {
    setToast({
      title,
      message,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  /* =======================================================
     FILTERING
  ======================================================= */

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();

    let result = eventData.filter((event) => {
      const searchMatch =
        !q ||
        event.id.toLowerCase().includes(q) ||
        event.camera.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q) ||
        event.detail.toLowerCase().includes(q) ||
        event.detection.toLowerCase().includes(q) ||
        event.intervention.toLowerCase().includes(q);

      const cameraMatch =
        camera === "ALL" || event.camera === camera;

      const areaMatch =
        area === "ALL" || event.area === area;

      const typeMatch =
        type === "ALL" || event.type === type;

      const severityMatch =
        severity === "ALL" ||
        event.severity === severity;

      const statusMatch =
        status === "ALL" || event.status === status;

      return (
        searchMatch &&
        cameraMatch &&
        areaMatch &&
        typeMatch &&
        severityMatch &&
        statusMatch
      );
    });

    /*
      Current supplied demo records are 12 Sep 2026.
      In production, replace this with API timestamps.
    */

    if (range === "Last 24 Hours") {
      result = result.filter(
        (event) =>
          parseEventDate(event) >=
          new Date(2026, 8, 11, 15, 0, 0)
      );
    }

    if (range === "Last 7 Days") {
      result = result.filter(
        (event) =>
          parseEventDate(event) >=
          new Date(2026, 8, 5, 0, 0, 0)
      );
    }

    if (range === "Custom Range") {
      result = result.filter((event) => {
        const date = parseEventDate(event);

        return (
          date >= new Date(2026, 8, 5, 0, 0, 0) &&
          date <= new Date(2026, 8, 12, 23, 59, 59)
        );
      });
    }

    result = [...result].sort((a, b) => {
      let aValue;
      let bValue;

      if (sort.key === "timestamp") {
        aValue = parseEventDate(a).getTime();
        bValue = parseEventDate(b).getTime();
      } else if (sort.key === "severity") {
        aValue = SEVERITY_ORDER[a.severity] || 0;
        bValue = SEVERITY_ORDER[b.severity] || 0;
      } else if (sort.key === "status") {
        aValue = STATUS_ORDER[a.status] || 0;
        bValue = STATUS_ORDER[b.status] || 0;
      } else {
        aValue = String(a[sort.key] || "").toLowerCase();
        bValue = String(b[sort.key] || "").toLowerCase();
      }

      if (aValue < bValue) {
        return sort.direction === "asc" ? -1 : 1;
      }

      if (aValue > bValue) {
        return sort.direction === "asc" ? 1 : -1;
      }

      return 0;
    });

    return result;
  }, [
    eventData,
    search,
    camera,
    area,
    type,
    severity,
    status,
    range,
    sort,
  ]);

  /* =======================================================
     DYNAMIC KPI
  ======================================================= */

  const metrics = useMemo(() => {
    const total = filteredEvents.length;

    const critical = filteredEvents.filter(
      (event) => event.severity === "CRITICAL"
    ).length;

    const high = filteredEvents.filter(
      (event) => event.severity === "HIGH"
    ).length;

    const ppe = filteredEvents.filter((event) =>
      ["No Helmet", "Footwear", "Harness"].includes(
        event.type
      )
    ).length;

    const active = filteredEvents.filter(
      (event) => event.status === "Active"
    ).length;

    return {
      total,
      critical,
      high,
      ppe,
      active,
    };
  }, [filteredEvents]);

  const kpis = [
    {
      label: "FILTERED RECORDS",
      value: metrics.total,
      unit: "Events",
      footer: `${range} selection`,
      icon: ReceiptText,
      action: () => {
        setSeverity("ALL");
        setStatus("ALL");
      },
    },
    {
      label: "CRITICAL EMERGENCIES",
      value: metrics.critical,
      unit: "Events",
      footer: "Critical hazard classification",
      icon: Flame,
      danger: true,
      action: () => setSeverity("CRITICAL"),
    },
    {
      label: "HIGH RISK BREACHES",
      value: metrics.high,
      unit: "Events",
      footer: "Mechanical & height risk",
      icon: ShieldAlert,
      action: () => setSeverity("HIGH"),
    },
    {
      label: "PPE NON-COMPLIANCE",
      value: metrics.ppe,
      unit: "Events",
      footer: "Helmet, footwear & harness",
      icon: HardHat,
      action: () => {
        setSeverity("ALL");
        setSearch("");
        setType("No Helmet");
      },
    },
    {
      label: "ACTIVE EVENTS",
      value: metrics.active,
      unit: "Open",
      footer: "Awaiting closure",
      icon: CircleAlert,
      danger: metrics.active > 0,
      action: () => setStatus("Active"),
    },
    {
      label: "AUDIT RETENTION",
      value: "90",
      unit: "Days",
      footer: "RAID 6 Vault • Encrypted",
      icon: Database,
    },
  ];

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / PAGE_SIZE)
  );

  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return filteredEvents.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filteredEvents, page]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    camera,
    area,
    type,
    severity,
    status,
    range,
  ]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  /* =======================================================
     ESC CLOSE MODAL
  ======================================================= */

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setSelectedEvent(null);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKey
      );
    };
  }, []);

  /* =======================================================
     ACTIONS
  ======================================================= */

  const resetFilters = () => {
    setSearch("");
    setCamera("ALL");
    setArea("ALL");
    setType("ALL");
    setSeverity("ALL");
    setStatus("ALL");
    setRange("Today");
    setPage(1);

    showToast(
      "Filters Reset",
      "Event ledger restored to the default view."
    );
  };

  const activeFilterCount = [
    search,
    camera !== "ALL",
    area !== "ALL",
    type !== "ALL",
    severity !== "ALL",
    status !== "ALL",
    range !== "Today",
  ].filter(Boolean).length;

  const handleSort = (key) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key &&
        current.direction === "desc"
          ? "asc"
          : "desc",
    }));
  };

  const refreshData = () => {
    setRefreshing(true);

    window.setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);

      showToast(
        "Audit Ledger Refreshed",
        "Latest available event records have been loaded."
      );
    }, 650);
  };

  const exportCSV = () => {
    const header = [
      "Event ID",
      "Date",
      "Time",
      "Camera",
      "Tender No",
      "Location",
      "Detection",
      "Severity",
      "Intervention",
      "Status",
    ];

    const rows = filteredEvents.map((event) => [
      event.id,
      event.date,
      event.time,
      event.camera,
      event.tenderNo,
      event.location,
      event.detection,
      event.severity,
      event.intervention,
      event.status,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      "heightx-safe-event-history.csv";

    document.body.appendChild(link);

    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    showToast(
      "Audit Log Exported",
      `${filteredEvents.length} filtered records exported to CSV.`
    );
  };

  const openCamera = (event) => {
    if (event?.tenderNo) {
      navigate(
        `/camera?tender=${event.tenderNo}`
      );

      return;
    }

    navigate("/camera");
  };

  const updateStatus = (
    eventId,
    newStatus
  ) => {
    setEventData((current) =>
      current.map((event) =>
        event.id === eventId
          ? {
              ...event,
              status: newStatus,
            }
          : event
      )
    );

    setSelectedEvent((current) =>
      current?.id === eventId
        ? {
            ...current,
            status: newStatus,
          }
        : current
    );

    showToast(
      `Event ${newStatus}`,
      `${eventId} updated successfully.`
    );
  };

  const printDocket = (event) => {
    if (event) {
      setSelectedEvent(event);

      window.setTimeout(() => {
        window.print();
      }, 100);

      return;
    }

    window.print();
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-slate-900">

      {/* TOAST */}

      {toast && (
        <div className="fixed right-5 top-5 z-[200] w-[340px] max-w-[calc(100%-40px)] rounded-xl border border-blue-100 bg-white p-4 shadow-xl">
          <div className="flex items-start gap-3">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check size={16} />
            </div>

            <div>
              <p className="text-sm font-bold">
                {toast.title}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => setToast(null)}
              className="ml-auto rounded p-1 text-slate-400 hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* REFRESH OVERLAY */}

      {refreshing && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-white/40 backdrop-blur-[1px]">

          <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-xl">

            <RefreshCw
              size={20}
              className="animate-spin text-blue-900"
            />

            <div>
              <p className="text-sm font-bold">
                Refreshing Audit Ledger
              </p>

              <p className="text-[11px] text-slate-500">
                Synchronizing event telemetry...
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="p-4 md:p-7">

        <div className="mx-auto max-w-[1800px] space-y-6">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-950">
                  Annexure Compliance Register
                </span>

                <span className="text-xs text-slate-500">
                  • NTPC & CEA STANDARD REGULATION § 41.2
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Event History & Audit Log
              </h1>

              <p className="mt-1 max-w-4xl text-sm text-slate-600">
                Comprehensive historical record,
                deterministic telemetry trail, and
                compliance audit log of all automated
                safety detections and control room
                operator interventions.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">

                <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
                  Audit Service Online
                </span>

                <span>
                  Last updated:{" "}
                  {lastUpdated.toLocaleTimeString()}
                </span>

                <span>
                  {filteredEvents.length} matching
                  records
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">

              <button
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>

              <button
                onClick={exportCSV}
                className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50"
              >
                <Download size={17} />
                Export Audit Log
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50"
              >
                <Printer size={17} />
                Print Incident Docket
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
              >
                <FileText size={17} />
                Audit Report PDF
              </button>
            </div>
          </section>

          {/* =================================================
              KPI
          ================================================= */}

          <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">

            {kpis.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  disabled={!item.action}
                  className={`rounded-xl border border-slate-100 bg-white p-4 text-left shadow-sm transition ${
                    item.action
                      ? "hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                      : "cursor-default"
                  }`}
                >
                  <div className="flex items-center justify-between">

                    <span className="text-[10px] font-bold tracking-wider text-slate-500">
                      {item.label}
                    </span>

                    <Icon
                      size={18}
                      className={
                        item.danger
                          ? "text-red-600"
                          : "text-blue-800"
                      }
                    />
                  </div>

                  <div className="mt-3 flex items-end gap-2">

                    <span
                      className={`text-3xl font-bold ${
                        item.danger
                          ? "text-red-700"
                          : "text-slate-900"
                      }`}
                    >
                      {item.value}
                    </span>

                    <span className="pb-1 text-xs text-slate-500">
                      {item.unit}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] font-medium text-emerald-700">
                    {item.footer}
                  </div>
                </button>
              );
            })}
          </section>

          {/* =================================================
              FILTERS
          ================================================= */}

          <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

            <div className="flex flex-col gap-3 border-b pb-4 xl:flex-row xl:items-center xl:justify-between">

              <div className="flex flex-wrap items-center gap-2">

                <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Quick Select:
                </span>

                {[
                  "Today",
                  "Last 24 Hours",
                  "Last 7 Days",
                  "Custom Range",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setRange(item)}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      range === item
                        ? "bg-blue-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {item === "Custom Range" && (
                      <CalendarDays size={14} />
                    )}

                    {item === "Custom Range"
                      ? "Custom Range: 05 Sep – 12 Sep 2026"
                      : item}
                  </button>
                ))}
              </div>

              <button
                onClick={resetFilters}
                className="flex items-center gap-2 text-xs font-semibold text-blue-800 hover:text-blue-950"
              >
                <RotateCcw size={15} />

                Reset Filters

                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-7">

              {/* SEARCH */}

              <div className="relative xl:col-span-2">

                <Search
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search Event ID, Camera, Plant Location..."
                  className="h-11 w-full rounded-lg bg-slate-100 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-700"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* CAMERA */}

              <select
                value={camera}
                onChange={(event) =>
                  setCamera(event.target.value)
                }
                className="h-11 rounded-lg bg-slate-100 px-3 text-sm outline-none"
              >
                <option value="ALL">
                  All Cameras
                </option>
                <option value="CAM 12">
                  CAM 12 — Track Hopper 02
                </option>
                <option value="CAM 04">
                  CAM 04 — Conveyor 2 A/B
                </option>
                <option value="CAM 34">
                  CAM 34 — Unit 6 Bunker
                </option>
                <option value="CAM 16">
                  CAM 16 — Conveyor 18 A/B
                </option>
                <option value="CAM 07">
                  CAM 07 — Conveyor 2 TE
                </option>
                <option value="CAM 44">
                  CAM 44 — Unit 4 Bunker
                </option>
                <option value="CAM 53">
                  CAM 53 — Coal Yard
                </option>
              </select>

              {/* AREA */}

              <select
                value={area}
                onChange={(event) =>
                  setArea(event.target.value)
                }
                className="h-11 rounded-lg bg-slate-100 px-3 text-sm outline-none"
              >
                <option value="ALL">
                  All Areas
                </option>
                <option value="Track Hopper">
                  Track Hopper
                </option>
                <option value="Crusher House">
                  Crusher House
                </option>
                <option value="Bunker">
                  Bunker Floors
                </option>
                <option value="Conveyor">
                  Conveyor Galleries
                </option>
                <option value="Coal Yard">
                  Coal Yard
                </option>
              </select>

              {/* TYPE */}

              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value)
                }
                className="h-11 rounded-lg bg-slate-100 px-3 text-sm outline-none"
              >
                <option value="ALL">
                  All Safety Event Types
                </option>
                <option value="Fire & Smoke">
                  Fire & Thermal
                </option>
                <option value="Restricted">
                  Restricted Zone
                </option>
                <option value="No Helmet">
                  Missing Helmet
                </option>
                <option value="Footwear">
                  Footwear
                </option>
                <option value="Harness">
                  Harness
                </option>
                <option value="Dust">
                  Dust Cloud
                </option>
              </select>

              {/* SEVERITY */}

              <select
                value={severity}
                onChange={(event) =>
                  setSeverity(event.target.value)
                }
                className="h-11 rounded-lg bg-slate-100 px-3 text-sm outline-none"
              >
                <option value="ALL">
                  All Severities
                </option>
                <option value="CRITICAL">
                  Critical
                </option>
                <option value="HIGH">
                  High Risk
                </option>
                <option value="MEDIUM">
                  Medium
                </option>
              </select>

              {/* STATUS */}

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="h-11 rounded-lg bg-slate-100 px-3 text-sm outline-none"
              >
                <option value="ALL">
                  All Status
                </option>
                <option value="Active">
                  Active
                </option>
                <option value="Acknowledged">
                  Acknowledged
                </option>
                <option value="Resolved">
                  Resolved
                </option>
              </select>
            </div>
          </section>

          {/* =================================================
              TABLE
          ================================================= */}

          <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b bg-slate-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex flex-wrap items-center gap-3">

                <h2 className="font-bold">
                  Historical Plant Incident Ledger
                </h2>

                <span className="rounded-full bg-slate-200 px-3 py-1 text-[11px] font-semibold">
                  {filteredEvents.length} Matching Records
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-[11px] font-medium text-slate-600">

                <Legend
                  color="bg-emerald-500"
                  text="Resolved"
                />

                <Legend
                  color="bg-blue-600"
                  text="Acknowledged"
                />

                <Legend
                  color="bg-red-600"
                  text="Active Alarm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1400px] text-left">

                <thead className="bg-blue-50 text-[10px] uppercase tracking-wider text-slate-600">

                  <tr>

                    <SortableHead
                      label="Timestamp & Event ID"
                      onClick={() =>
                        handleSort("timestamp")
                      }
                    />

                    <SortableHead
                      label="Camera & Annexure Location"
                      onClick={() =>
                        handleSort("camera")
                      }
                    />

                    <SortableHead
                      label="Detection Classification"
                      onClick={() =>
                        handleSort("detection")
                      }
                    />

                    <SortableHead
                      label="Severity"
                      onClick={() =>
                        handleSort("severity")
                      }
                    />

                    <th className="px-5 py-3">
                      Operator Interventions
                    </th>

                    <SortableHead
                      label="Status"
                      onClick={() =>
                        handleSort("status")
                      }
                    />

                    <th className="px-5 py-3 text-right">
                      Audit Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {paginatedEvents.map((event) => (

                    <tr
                      key={event.id}
                      className="transition hover:bg-blue-50/40"
                    >

                      {/* TIMESTAMP */}

                      <td className="px-5 py-4">

                        <div className="font-semibold">
                          {event.date},{" "}
                          {event.time}
                        </div>

                        <div className="mt-1 text-xs">

                          <button
                            onClick={() =>
                              setSelectedEvent(event)
                            }
                            className="font-mono font-bold text-blue-800 hover:underline"
                          >
                            {event.id}
                          </button>

                          <span className="ml-2 text-slate-400">
                            • {event.ping} ping
                          </span>
                        </div>
                      </td>

                      {/* CAMERA */}

                      <td className="px-5 py-4">

                        <button
                          onClick={() =>
                            openCamera(event)
                          }
                          className="text-left"
                        >

                          <div className="flex items-center gap-2">

                            <span className="rounded bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-950">
                              {event.camera}
                            </span>

                            <span className="font-semibold hover:text-blue-800 hover:underline">
                              {event.location}
                            </span>
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {event.detail}
                          </div>
                        </button>
                      </td>

                      {/* DETECTION */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 font-semibold">

                          {event.severity ===
                          "CRITICAL" ? (
                            <Flame
                              size={17}
                              className="text-red-600"
                            />
                          ) : event.severity ===
                            "HIGH" ? (
                            <AlertTriangle
                              size={17}
                              className="text-orange-600"
                            />
                          ) : (
                            <Info
                              size={17}
                              className="text-slate-500"
                            />
                          )}

                          {event.detection}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {event.sub}
                        </div>
                      </td>

                      {/* SEVERITY */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${severityStyle(
                            event.severity
                          )}`}
                        >
                          {event.severity ===
                            "CRITICAL" ||
                          event.severity ===
                            "HIGH" ? (
                            <AlertTriangle
                              size={13}
                            />
                          ) : (
                            <Info size={13} />
                          )}

                          {event.severity === "HIGH"
                            ? "HIGH RISK"
                            : event.severity}
                        </span>
                      </td>

                      {/* INTERVENTION */}

                      <td className="px-5 py-4">

                        <div className="font-medium">
                          {event.intervention}
                        </div>

                        <div className="mt-1 max-w-[280px] text-xs text-slate-500">
                          {event.interventionSub}
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle(
                            event.status
                          )}`}
                        >

                          {event.status ===
                          "Resolved" ? (
                            <CheckCircle2
                              size={14}
                            />
                          ) : event.status ===
                            "Acknowledged" ? (
                            <Eye size={14} />
                          ) : (
                            <CircleAlert
                              size={14}
                            />
                          )}

                          {event.status}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-1">

                          <ActionButton
                            title="View Inspection Details"
                            onClick={() =>
                              setSelectedEvent(event)
                            }
                          >
                            <Eye size={18} />
                          </ActionButton>

                          <ActionButton
                            title="View Live Camera"
                            onClick={() =>
                              openCamera(event)
                            }
                          >
                            <Video size={18} />
                          </ActionButton>

                          <ActionButton
                            title="Watch Event Clip"
                            onClick={() =>
                              setSelectedEvent(event)
                            }
                          >
                            <PlayCircle
                              size={18}
                            />
                          </ActionButton>

                          <ActionButton
                            title="Print Audit Docket"
                            onClick={() =>
                              printDocket(event)
                            }
                          >
                            <FileText size={18} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginatedEvents.length === 0 && (
                    <tr>

                      <td
                        colSpan="7"
                        className="px-5 py-16 text-center"
                      >
                        <Search
                          size={32}
                          className="mx-auto mb-3 text-slate-300"
                        />

                        <div className="font-semibold">
                          No events found
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          Change or reset the current
                          filters.
                        </div>

                        <button
                          onClick={resetFilters}
                          className="mt-4 rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold text-white"
                        >
                          Reset Filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* =============================================
                PAGINATION
            ============================================= */}

            <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="text-xs text-slate-500">

                {filteredEvents.length > 0 ? (
                  <>
                    Showing{" "}
                    {(page - 1) * PAGE_SIZE + 1}
                    {" – "}
                    {Math.min(
                      page * PAGE_SIZE,
                      filteredEvents.length
                    )}{" "}
                    of {filteredEvents.length} matching
                    records
                  </>
                ) : (
                  "0 matching records"
                )}
              </div>

              <div className="flex items-center gap-1">

                <button
                  disabled={page === 1}
                  onClick={() =>
                    setPage((value) =>
                      Math.max(1, value - 1)
                    )
                  }
                  className="rounded-lg border p-2 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1
                ).map((number) => (

                  <button
                    key={number}
                    onClick={() =>
                      setPage(number)
                    }
                    className={`h-8 w-8 rounded-lg text-xs font-bold ${
                      page === number
                        ? "bg-blue-900 text-white"
                        : "border hover:bg-slate-100"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  disabled={
                    page === totalPages
                  }
                  onClick={() =>
                    setPage((value) =>
                      Math.min(
                        totalPages,
                        value + 1
                      )
                    )
                  }
                  className="rounded-lg border p-2 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ===================================================
          EVENT DETAIL MODAL
      =================================================== */}

      {selectedEvent && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() =>
            setSelectedEvent(null)
          }
        >

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b p-5">

              <div>

                <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Incident Audit Docket
                </div>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedEvent.id}
                </h2>

                <div className="mt-2 flex gap-2">

                  <span
                    className={`rounded-full border px-2 py-1 text-[10px] font-bold ${severityStyle(
                      selectedEvent.severity
                    )}`}
                  >
                    {selectedEvent.severity}
                  </span>

                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusStyle(
                      selectedEvent.status
                    )}`}
                  >
                    {selectedEvent.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedEvent(null)
                }
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">

              {/* INFO */}

              <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">

                <InfoBox
                  label="Camera"
                  value={`${selectedEvent.camera} • Tender #${selectedEvent.tenderNo}`}
                />

                <InfoBox
                  label="Timestamp"
                  value={`${selectedEvent.date} ${selectedEvent.time}`}
                />

                <InfoBox
                  label="Location"
                  value={
                    selectedEvent.location
                  }
                />

                <InfoBox
                  label="Telemetry Latency"
                  value={
                    selectedEvent.ping
                  }
                />
              </div>

              {/* DETECTION */}

              <section>

                <div className="text-xs font-bold uppercase text-slate-500">
                  Detection Classification
                </div>

                <div className="mt-1 text-lg font-bold">
                  {selectedEvent.detection}
                </div>

                <p className="mt-1 text-sm text-slate-600">
                  {selectedEvent.sub}
                </p>

                <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-slate-600">
                  <strong className="text-blue-900">
                    Annexure Location:
                  </strong>{" "}
                  {selectedEvent.detail}
                </div>
              </section>

              {/* INTERVENTION */}

              <section>

                <div className="text-xs font-bold uppercase text-slate-500">
                  Operator Intervention
                </div>

                <div className="mt-1 font-semibold">
                  {selectedEvent.intervention}
                </div>

                <p className="mt-1 text-sm text-slate-600">
                  {selectedEvent.interventionSub}
                </p>
              </section>

              {/* EVENT CLIP MOCK */}

              <section className="overflow-hidden rounded-xl bg-slate-950">

                <div className="flex min-h-[210px] items-center justify-center">

                  <div className="text-center text-white">

                    <PlayCircle
                      size={46}
                      className="mx-auto mb-3 text-blue-300"
                    />

                    <p className="text-sm font-bold">
                      Archived Event Clip
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {selectedEvent.camera} •{" "}
                      {selectedEvent.time}
                    </p>

                    <p className="mt-3 text-[10px] text-slate-500">
                      Demo archive preview — connect
                      NVR/VMS API for recorded footage.
                    </p>
                  </div>
                </div>
              </section>

              {/* STATUS ACTIONS */}

              <section className="rounded-xl border p-4">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Audit Status Control
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  {selectedEvent.status ===
                    "Active" && (

                    <button
                      onClick={() =>
                        updateStatus(
                          selectedEvent.id,
                          "Acknowledged"
                        )
                      }
                      className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold text-white"
                    >
                      <Eye size={15} />
                      Acknowledge Event
                    </button>
                  )}

                  {selectedEvent.status !==
                    "Resolved" && (

                    <button
                      onClick={() =>
                        updateStatus(
                          selectedEvent.id,
                          "Resolved"
                        )
                      }
                      className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white"
                    >
                      <CheckCircle2
                        size={15}
                      />
                      Mark Resolved
                    </button>
                  )}

                  {selectedEvent.status ===
                    "Resolved" && (

                    <button
                      onClick={() =>
                        updateStatus(
                          selectedEvent.id,
                          "Active"
                        )
                      }
                      className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-xs font-bold text-red-700"
                    >
                      <Undo2 size={15} />
                      Reopen Event
                    </button>
                  )}
                </div>
              </section>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex flex-wrap justify-end gap-2 border-t bg-slate-50 p-4">

              <button
                onClick={() =>
                  setSelectedEvent(null)
                }
                className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold"
              >
                Close
              </button>

              <button
                onClick={() =>
                  printDocket(selectedEvent)
                }
                className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold"
              >
                <Printer size={16} />
                Print Docket
              </button>

              <button
                onClick={() =>
                  openCamera(selectedEvent)
                }
                className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white"
              >
                <Video size={16} />
                View Live Camera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function Legend({
  color,
  text,
}) {
  return (
    <span className="flex items-center gap-1.5">

      <span
        className={`h-2.5 w-2.5 rounded-full ${color}`}
      />

      {text}
    </span>
  );
}

function SortableHead({
  label,
  onClick,
}) {
  return (
    <th className="px-5 py-3">

      <button
        onClick={onClick}
        className="flex items-center gap-1 font-bold hover:text-blue-900"
      >
        {label}

        <ArrowUpDown size={12} />
      </button>
    </th>
  );
}

function ActionButton({
  title,
  onClick,
  children,
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="rounded-lg p-2 text-slate-600 transition hover:bg-blue-100 hover:text-blue-800"
    >
      {children}
    </button>
  );
}

function InfoBox({
  label,
  value,
}) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase text-slate-400">
        {label}
      </div>

      <div className="mt-1 font-semibold">
        {value}
      </div>
    </div>
  );
}