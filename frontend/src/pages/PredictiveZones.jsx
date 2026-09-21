import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  HardHat,
  Siren,
  Timer,
  BrainCircuit,
  TrendingDown,
  Flame,
  CheckCircle2,
  BadgeCheck,
  Video,
  PieChart,
  Download,
  CalendarClock,
  Bot,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

/* =========================================================
   STATIC DEMO DATA
========================================================= */

const analyticsByRange = {
  Today: {
    safety: 92.8,
    ppe: 90.4,
    detections: 18,
    triage: 31,
    veracity: 98.9,
  },

  "Last 7 Days": {
    safety: 93.7,
    ppe: 91.1,
    detections: 106,
    triage: 33,
    veracity: 99.0,
  },

  "Last 30 Days": {
    safety: 94.6,
    ppe: 91.8,
    detections: 428,
    triage: 34,
    veracity: 99.1,
  },

  "Custom Q3": {
    safety: 93.2,
    ppe: 90.7,
    detections: 1184,
    triage: 39,
    veracity: 98.7,
  },
};

const ppeData = [
  {
    name: "Hardhat / Helmet",
    avg: 96,
    values: [98, 96, 94],
  },
  {
    name: "Safety Harness (Height Zones)",
    avg: 91,
    values: [94, 91, 88],
    warning: true,
    note: "Night shift bunker roof unhooked events flagged",
  },
  {
    name: "Steel-Toe Safety Boots",
    avg: 88.6,
    values: [92, 89, 85],
  },
  {
    name: "High-Vis Vest / Retroreflective",
    avg: 98,
    values: [99, 98, 97],
  },
  {
    name: "Heat & Flame Resistant Gloves",
    avg: 87.3,
    values: [90, 88, 84],
  },
];

const hotspots = [
  {
    rank: "01",
    camera: "CAM 04",
    tender: 6,
    name: "Conveyor 2 A/B DE",
    description:
      "Crusher House -1 • Rotating machinery proximity & missing footwear",
    incidents: 38,
    severity: "HIGH RISK",
  },
  {
    rank: "02",
    camera: "CAM 12",
    tender: 60,
    name: "Track Hopper 02 Unloading Bay",
    description:
      "Rake Pit Area • Thermal smoldering anomalies & coal dust opacity spikes",
    incidents: 29,
    severity: "CRITICAL",
  },
  {
    rank: "03",
    camera: "CAM 34",
    tender: 44,
    name: "Unit 6 Bunker 17 B Roof",
    description:
      "Elevation +42m Cantilever • Harness lanyard unhooked & chin-strap laxity",
    incidents: 24,
    severity: "HIGH RISK",
  },
  {
    rank: "04",
    camera: "CAM 16",
    tender: 25,
    name: "TH-2 Conveyor 18 A/B CHANDI",
    description:
      "Transfer Tunnel • Casual footwear violations by contract civil team",
    incidents: 21,
    severity: "MEDIUM",
  },
  {
    rank: "05",
    camera: "CAM 07",
    tender: 7,
    name: "Transfer Point 1 (Conveyor 2 TE)",
    description:
      "Drive Junction • Heavy dust cloud accumulation triggering optical occlusion",
    incidents: 16,
    severity: "MEDIUM",
  },
];

const hazardData = [
  {
    name: "Restricted Machinery Zone",
    percent: 32,
    count: 137,
    color: "#00288e",
  },
  {
    name: "PPE Non-Compliance",
    percent: 28,
    count: 120,
    color: "#9b000d",
  },
  {
    name: "Working at Height (No Anchor)",
    percent: 18,
    count: 77,
    color: "#3755c3",
  },
  {
    name: "Heat / Smoldering Flare",
    percent: 11,
    count: 47,
    color: "#ba1a1a",
  },
  {
    name: "Dust / Particulate Cloud",
    percent: 7,
    count: 30,
    color: "#757684",
  },
  {
    name: "Worker Slip & Fall",
    percent: 4,
    count: 17,
    color: "#006c4a",
  },
];

const operators = [
  {
    initials: "RV",
    name: "Ramesh V.",
    desk: "Chief Safety Desk #1",
    shift: "Shift B (Day/Evening)",
    ack: "31s",
    sla: 100,
    alerts: "142 alerts",
    escalated: "12 automated siren triggers",
    grade: "Exemplary",
  },
  {
    initials: "SK",
    name: "Sunil K.",
    desk: "Boiler Section Desk #2",
    shift: "Shift A (Morning)",
    ack: "36s",
    sla: 98.2,
    alerts: "119 alerts",
    escalated: "8 contractor halts",
    grade: "Optimal",
  },
  {
    initials: "PM",
    name: "Priya M.",
    desk: "Coal Handling Desk #3",
    shift: "Shift B (Evening)",
    ack: "41s",
    sla: 97.4,
    alerts: "98 alerts",
    escalated: "5 PA announcements",
    grade: "Optimal",
  },
  {
    initials: "AI",
    name: "Autonomous Auto-Triage",
    desk: "Edge Relays & Interlock Daemon",
    shift: "Shift C (Night Guard)",
    ack: "12s",
    sla: 100,
    alerts: "69 auto-triaged",
    escalated: "3 automated conveyor cutoffs",
    grade: "Automated",
    ai: true,
  },
];

const trendPoints =
  "0,200 30,200 70,210 110,180 150,190 190,170 230,165 270,185 310,150 350,140 390,170 430,160 470,110 510,120 550,170 590,165 630,150 670,160 710,140 750,135 790,150 830,120 870,140 900,135";

const highPoints =
  "0,218 50,215 100,215 150,212 200,205 250,210 300,200 350,195 400,208 450,190 470,140 510,155 570,205 620,200 680,210 740,190 790,180 830,160 880,180 900,178";

/* =========================================================
   PAGE
========================================================= */

export default function SafetyAnalytics() {
  const navigate = useNavigate();

  const [range, setRange] = useState("Last 30 Days");
  const [unit, setUnit] = useState("All CHP Units (1-6)");
  const [shift, setShift] = useState("All Shifts (A, B, C)");

  const [loading, setLoading] = useState(false);
  const [briefingScheduled, setBriefingScheduled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  /* =======================================================
     DYNAMIC KPI
  ======================================================= */

  const currentAnalytics = useMemo(() => {
    const base = analyticsByRange[range];

    let unitModifier = 0;

    if (unit === "Stage I: Units 1-3") {
      unitModifier = -1.2;
    }

    if (unit === "Stage II: Units 4-6") {
      unitModifier = 0.8;
    }

    if (unit === "Coal Handling Plant Ext.") {
      unitModifier = -2.1;
    }

    let shiftModifier = 0;

    if (shift.includes("Shift A")) {
      shiftModifier = 1.1;
    }

    if (shift.includes("Shift B")) {
      shiftModifier = 0.2;
    }

    if (shift.includes("Shift C")) {
      shiftModifier = -1.7;
    }

    const safety = Math.max(
      0,
      Math.min(
        100,
        base.safety + unitModifier + shiftModifier
      )
    );

    const ppe = Math.max(
      0,
      Math.min(
        100,
        base.ppe + unitModifier / 2 + shiftModifier
      )
    );

    const detectionUnitFactor =
      unit === "All CHP Units (1-6)" ? 1 : 0.38;

    const detectionShiftFactor =
      shift === "All Shifts (A, B, C)" ? 1 : 0.34;

    return {
      safety: safety.toFixed(1),
      ppe: ppe.toFixed(1),

      detections: Math.max(
        0,
        Math.round(
          base.detections *
            detectionUnitFactor *
            detectionShiftFactor
        )
      ),

      triage: Math.max(
        10,
        Math.round(
          base.triage -
            unitModifier -
            shiftModifier
        )
      ),

      veracity: Math.max(
        90,
        Math.min(
          100,
          base.veracity + unitModifier / 10
        )
      ).toFixed(1),
    };
  }, [range, unit, shift]);

  const donut = useMemo(() => {
    return `conic-gradient(
      #00288e 0% 32%,
      #9b000d 32% 60%,
      #3755c3 60% 78%,
      #ba1a1a 78% 89%,
      #757684 89% 96%,
      #006c4a 96% 100%
    )`;
  }, []);

  /* =======================================================
     ACTIONS
  ======================================================= */

  const simulateRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 700);
  };

  const changeRange = (newRange) => {
    setLoading(true);

    setTimeout(() => {
      setRange(newRange);
      setLastUpdated(new Date());
      setLoading(false);
    }, 300);
  };

  const resetFilters = () => {
    setRange("Last 30 Days");
    setUnit("All CHP Units (1-6)");
    setShift("All Shifts (A, B, C)");
    setLastUpdated(new Date());
  };

  const exportReport = () => {
    window.print();
  };

  const scheduleBriefing = () => {
    setBriefingScheduled(true);

    setTimeout(() => {
      setBriefingScheduled(false);
    }, 3000);
  };

  const openCamera = (tender) => {
    navigate(`/camera?tender=${tender}`);
  };

  const openAllCameras = () => {
    navigate("/camera");
  };

  const openEventHistory = () => {
    navigate("/incidents");
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="relative min-h-screen bg-[#f8f9ff] text-[#0b1c30]">

      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
          <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-xl">
            <RefreshCw
              size={20}
              className="animate-spin text-[#00288e]"
            />

            <div>
              <p className="text-sm font-bold">
                Updating Analytics
              </p>

              <p className="text-[10px] text-slate-400">
                Processing plant safety telemetry...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1900px] space-y-5 p-4 md:p-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              <span>Operations Monitoring</span>
              <span>›</span>
              <span>Intelligence & Compliance</span>
              <span>›</span>

              <span className="text-[#00288e]">
                Safety Analytics
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight md:text-[30px]">
              Plant Safety Analytics & Compliance Intelligence
            </h1>

            <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">
              Aggregated behavioral PPE compliance trends,
              hazard distribution by zone, edge AI detection
              veracity, and operator SLA metrics across 60
              active thermal plant streams.
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />

                Analytics Online
              </span>

              <span>
                Last updated:{" "}
                {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* CONTROLS */}

          <div className="flex max-w-full flex-wrap items-center gap-2">

            <div className="flex rounded-lg bg-[#e5eeff] p-1">
              {[
                "Today",
                "Last 7 Days",
                "Last 30 Days",
                "Custom Q3",
              ].map((item) => (
                <button
                  key={item}
                  disabled={loading}
                  onClick={() => changeRange(item)}
                  className={`rounded-md px-3 py-2 text-[11px] font-bold transition ${
                    range === item
                      ? "bg-white text-[#00288e] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <select
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
                setLastUpdated(new Date());
              }}
              className="h-10 rounded-lg border-0 bg-white px-3 text-xs font-semibold shadow-sm outline-none"
            >
              <option>All CHP Units (1-6)</option>
              <option>Stage I: Units 1-3</option>
              <option>Stage II: Units 4-6</option>
              <option>Coal Handling Plant Ext.</option>
            </select>

            <select
              value={shift}
              onChange={(e) => {
                setShift(e.target.value);
                setLastUpdated(new Date());
              }}
              className="h-10 rounded-lg border-0 bg-white px-3 text-xs font-semibold shadow-sm outline-none"
            >
              <option>All Shifts (A, B, C)</option>
              <option>Shift A (06:00 - 14:00)</option>
              <option>Shift B (14:00 - 22:00)</option>
              <option>Shift C (22:00 - 06:00)</option>
            </select>

            <button
              onClick={simulateRefresh}
              disabled={loading}
              className="flex h-10 items-center gap-2 rounded-lg bg-white px-3 text-xs font-bold text-[#00288e] shadow-sm hover:bg-[#eff4ff]"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />

              Refresh
            </button>

            <button
              onClick={resetFilters}
              className="flex h-10 items-center gap-2 rounded-lg bg-white px-3 text-xs font-bold text-slate-600 shadow-sm hover:bg-[#eff4ff]"
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button
              onClick={exportReport}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#00288e] px-4 text-xs font-bold text-white shadow-sm hover:bg-blue-800"
            >
              <Download size={16} />
              Export PDF
            </button>

            <button
              onClick={scheduleBriefing}
              className={`flex h-10 items-center gap-2 rounded-lg px-4 text-xs font-bold shadow-sm transition ${
                briefingScheduled
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-white hover:bg-[#eff4ff]"
              }`}
            >
              {briefingScheduled ? (
                <CheckCircle2 size={16} />
              ) : (
                <CalendarClock size={16} />
              )}

              {briefingScheduled
                ? "Briefing Scheduled"
                : "Schedule Briefing"}
            </button>
          </div>
        </section>

        {/* =================================================
            KPI
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <KpiCard
            label="Plant Safety Score"
            icon={<ShieldCheck size={19} />}
          >
            <div className="flex items-end justify-between">
              <strong className="text-4xl tracking-tight text-[#00288e]">
                {currentAnalytics.safety}%
              </strong>

              <Badge positive>↑ +2.4%</Badge>
            </div>

            <Progress
              value={Number(currentAnalytics.safety)}
            />

            <div className="flex justify-between text-[11px]">
              <span className="font-semibold">
                Grade A - Optimal
              </span>

              <span className="text-slate-400">
                vs previous
              </span>
            </div>
          </KpiCard>

          <KpiCard
            label="PPE Compliance Rate"
            icon={<HardHat size={19} />}
          >
            <div className="flex items-end justify-between">
              <strong className="text-4xl">
                {currentAnalytics.ppe}%
              </strong>

              <Badge>↓ -1.2%</Badge>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {[
                ["Hel", "96%"],
                ["Har", "92%"],
                ["Sho", "89%"],
                ["Glo", "90%"],
              ].map(([name, value]) => (
                <div
                  key={name}
                  className="rounded bg-[#eff4ff] p-1 text-center"
                >
                  <p className="text-[10px] text-slate-400">
                    {name}
                  </p>

                  <p className="text-xs font-bold">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </KpiCard>

          <KpiCard
            label="Total Detections"
            icon={
              <Siren
                size={19}
                className="text-red-700"
              />
            }
          >
            <div className="flex items-end justify-between">
              <strong className="text-4xl">
                {currentAnalytics.detections}
              </strong>

              <Badge positive>↓ -18%</Badge>
            </div>

            <div className="flex flex-wrap justify-between gap-1 rounded-md bg-[#eff4ff] px-2 py-2 text-[10px] font-semibold">
              <Dot color="bg-red-600" text="4 Crit" />
              <Dot color="bg-red-900" text="42 High" />
              <Dot color="bg-blue-800" text="118 Med" />
              <Dot color="bg-slate-500" text="264 Low" />
            </div>
          </KpiCard>

          <KpiCard
            label="Mean Time to Triage"
            icon={<Timer size={19} />}
          >
            <div className="flex items-end justify-between">
              <strong className="text-4xl text-[#00288e]">
                {currentAnalytics.triage}
                <span className="text-xl">s</span>
              </strong>

              <Badge positive>SLA: &lt;90s</Badge>
            </div>

            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600">
                Inside SLA requirement
              </span>

              <span className="font-bold text-emerald-700">
                Optimal
              </span>
            </div>
          </KpiCard>

          <KpiCard
            label="AI Model Veracity"
            icon={
              <BrainCircuit
                size={19}
                className="text-emerald-700"
              />
            }
          >
            <div className="flex items-end justify-between">
              <strong className="text-4xl">
                {currentAnalytics.veracity}%
              </strong>

              <span className="text-[11px] text-slate-400">
                FPR &lt; 0.9%
              </span>
            </div>

            <div className="flex justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                60/60 AI Streams
              </span>

              <span className="text-slate-400">
                YOLOv8-IND
              </span>
            </div>
          </KpiCard>
        </section>

        {/* =================================================
            TREND + PPE
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">

          {/* TREND */}

          <div className="rounded-xl bg-white p-5 shadow-sm xl:col-span-8">

            <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row">

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold">
                    30-Day Safety Violations & Hazard Volumes
                  </h2>

                  <span className="rounded bg-[#e5eeff] px-2 py-1 text-[10px] font-bold text-[#00288e]">
                    Telemetry Live
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Chronological incident occurrence classified
                  by industrial severity criteria
                </p>
              </div>

              <div className="flex gap-4 text-[11px] font-semibold">
                <Dot color="bg-red-600" text="Critical" />
                <Dot color="bg-red-900" text="High" />
                <Dot color="bg-blue-800" text="Med / Low" />
              </div>
            </div>

            <div className="relative h-[300px] overflow-hidden rounded-xl bg-[#eff4ff] p-4">

              <div className="pointer-events-none absolute inset-4 flex flex-col justify-between">
                {[35, 25, 15, 5, 0].map((number) => (
                  <div
                    key={number}
                    className="border-b border-slate-300/60 text-right text-[9px] text-slate-400"
                  >
                    {number}
                  </div>
                ))}
              </div>

              <svg
                className="relative z-10 h-[230px] w-full"
                preserveAspectRatio="none"
                viewBox="0 0 900 240"
              >
                <defs>
                  <linearGradient
                    id="analyticsBlue"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#1e40af"
                      stopOpacity=".25"
                    />

                    <stop
                      offset="100%"
                      stopColor="#1e40af"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <polygon
                  fill="url(#analyticsBlue)"
                  points={`${trendPoints} 900,220 0,220`}
                />

                <polyline
                  fill="none"
                  points={trendPoints}
                  stroke="#1e40af"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <polyline
                  fill="none"
                  points={highPoints}
                  stroke="#9b000d"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />

                <circle
                  cx="470"
                  cy="110"
                  r="6"
                  fill="#ba1a1a"
                />

                <circle
                  cx="830"
                  cy="120"
                  r="6"
                  fill="#ba1a1a"
                />
              </svg>

              <div className="absolute left-[52%] top-6 hidden -translate-x-1/2 rounded-lg border-l-4 border-red-600 bg-white p-2 shadow md:block">
                <p className="text-[10px] font-bold text-red-600">
                  02 Sep, 11:24 IST Spike
                </p>

                <p className="text-[10px] font-semibold">
                  CAM 18 - Conveyor Chute Blockage
                </p>

                <p className="text-[9px] text-slate-400">
                  18 simultaneous dust & thermal flares
                </p>
              </div>

              <div className="absolute right-6 top-12 hidden rounded-lg border-l-4 border-red-900 bg-white p-2 shadow lg:block">
                <p className="text-[10px] font-bold text-red-800">
                  Today
                </p>

                <p className="text-[10px] font-semibold">
                  Track Hopper 02 Smolder detected
                </p>

                <p className="text-[9px] text-slate-400">
                  Immediate water mist suppression deployed
                </p>
              </div>

              <div className="relative z-20 flex justify-between border-t border-slate-300 pt-2 text-[9px] text-slate-400">
                <span>14 Aug</span>
                <span>18 Aug</span>
                <span>22 Aug</span>
                <span>26 Aug</span>
                <span>30 Aug</span>
                <span>02 Sep</span>
                <span>06 Sep</span>
                <span>09 Sep</span>
                <span>12 Sep</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 border-t pt-4 md:grid-cols-3">

              <AnalysisItem
                icon={<TrendingDown />}
                title="Incident Rate Reduced"
                text="Unrestricted zone incursions down 24% following Shift A briefings."
                green
              />

              <AnalysisItem
                icon={<Flame />}
                title="Heat Stress Hotspots"
                text="Track Hopper 02 registered 3 thermal near-miss anomalies this week."
              />

              <AnalysisItem
                icon={<CheckCircle2 />}
                title="SLA Compliance: 98.6%"
                text="All critical alerts triaged and logged under 45 seconds average."
                blue
              />
            </div>
          </div>

          {/* PPE */}

          <div className="rounded-xl bg-white p-5 shadow-sm xl:col-span-4">

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                PPE Compliance Breakdown
              </h2>

              <BadgeCheck
                size={20}
                className="text-slate-400"
              />
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Cross-shift evaluation across primary regulatory
              equipment
            </p>

            <div className="my-4 flex flex-wrap justify-between gap-2 rounded-lg bg-[#eff4ff] p-2 text-[10px] font-semibold">
              <Dot
                color="bg-[#00288e]"
                text="Shift A (Day)"
              />

              <Dot
                color="bg-[#3755c3]"
                text="Shift B (Eve)"
              />

              <Dot
                color="bg-slate-500"
                text="Shift C (Night)"
              />

              <span className="font-bold text-emerald-700">
                Goal: 90%
              </span>
            </div>

            <div className="space-y-5">
              {ppeData.map((item) => (
                <PpeRow
                  key={item.name}
                  item={item}
                />
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t pt-3 text-[10px]">

              <span className="text-slate-400">
                Statutory Threshold: 90%
              </span>

              <button
                onClick={openEventHistory}
                className="flex items-center gap-1 font-bold text-[#00288e] hover:underline"
              >
                Audit Raw Logs
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </section>

        {/* =================================================
            HOTSPOTS + HAZARDS
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">

          {/* HOTSPOTS */}

          <div className="rounded-xl bg-white p-5 shadow-sm xl:col-span-7">

            <div className="mb-4 flex justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">
                  Top Incident Hotspots by Annexure Zone
                </h2>

                <p className="text-xs text-slate-500">
                  Ranked plant locations by automated safety
                  infractions over 30 days
                </p>
              </div>

              <span className="hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:block">
                Annexure CHP-2026
              </span>
            </div>

            <div className="space-y-2">
              {hotspots.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between gap-3 rounded-lg bg-[#eff4ff] p-3 transition hover:bg-[#e5eeff]"
                >
                  <div className="flex min-w-0 items-center gap-4">

                    <span className="w-6 text-center text-lg font-bold text-slate-400">
                      {item.rank}
                    </span>

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-xs font-bold">
                          {item.camera} • {item.name}
                        </span>

                        <Severity
                          severity={item.severity}
                        />
                      </div>

                      <p className="mt-1 truncate text-[11px] text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">

                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {item.incidents}
                      </p>

                      <p className="text-[9px] text-slate-400">
                        incidents
                      </p>
                    </div>

                    <button
                      title={`Open ${item.camera}`}
                      onClick={() =>
                        openCamera(item.tender)
                      }
                      className="rounded-lg bg-white p-2 text-[#00288e] shadow-sm transition hover:bg-[#00288e] hover:text-white"
                    >
                      <Video size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col justify-between gap-2 border-t pt-3 sm:flex-row sm:items-center">

              <p className="text-[11px] text-slate-500">
                Top 5 cameras account for 41.5% of total plant
                hazard triggers.
              </p>

              <button
                onClick={openAllCameras}
                className="text-left text-[11px] font-bold text-[#00288e] hover:underline"
              >
                View All 60 Cameras Matrix →
              </button>
            </div>
          </div>

          {/* HAZARD DISTRIBUTION */}

          <div className="rounded-xl bg-white p-5 shadow-sm xl:col-span-5">

            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Hazard Classification Distribution
                </h2>

                <p className="text-xs text-slate-500">
                  AI Edge Detection Model taxonomy across
                  registered alerts
                </p>
              </div>

              <PieChart
                size={20}
                className="text-slate-400"
              />
            </div>

            <div className="mt-4 flex flex-col items-center gap-5 rounded-xl bg-[#eff4ff] p-4 sm:flex-row">

              <div className="relative h-40 w-40 shrink-0">

                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: donut,
                  }}
                />

                <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-[#eff4ff]">

                  <strong className="text-2xl">
                    {currentAnalytics.detections}
                  </strong>

                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Events
                  </span>
                </div>
              </div>

              <div className="w-full space-y-2">
                {hazardData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between border-b border-slate-200 pb-1 text-[10px]"
                  >
                    <div className="flex items-center gap-2">

                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: item.color,
                        }}
                      />

                      <span className="font-semibold">
                        {item.name}
                      </span>
                    </div>

                    <span className="font-bold">
                      {item.percent}%

                      <span className="ml-1 font-normal text-slate-400">
                        ({item.count})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-[#dce9ff] p-3">

              <div className="flex items-center gap-2">
                <BrainCircuit
                  size={20}
                  className="text-[#00288e]"
                />

                <div>
                  <p className="text-[11px] font-bold">
                    Edge Confidence Threshold
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Models reject inferences below 85.0%
                    confidence
                  </p>
                </div>
              </div>

              <span className="rounded bg-white px-2 py-1 text-[10px] font-bold text-[#00288e] shadow-sm">
                Active 85% Cutoff
              </span>
            </div>
          </div>
        </section>

        {/* =================================================
            SLA TABLE
        ================================================= */}

        <section className="rounded-xl bg-white p-5 shadow-sm">

          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

            <div>
              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-lg font-bold">
                  Control Room Triage & Resolution SLA Benchmark
                </h2>

                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  Desk Performance
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Operator acknowledgment latency, safety protocol
                compliance, and interlock trigger statistics
              </p>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck size={15} />
              SOP Compliance Audited
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">

            <table className="w-full min-w-[1050px] text-left">

              <thead>
                <tr className="bg-[#eff4ff] text-[9px] uppercase tracking-wider text-slate-500">

                  <th className="rounded-l-lg px-4 py-3">
                    Operator / Workstation
                  </th>

                  <th className="px-4 py-3">
                    Shift Allocation
                  </th>

                  <th className="px-4 py-3">
                    Avg Acknowledgment
                  </th>

                  <th className="px-4 py-3">
                    SLA Resolution (&lt;90s)
                  </th>

                  <th className="px-4 py-3">
                    Alerts Managed
                  </th>

                  <th className="px-4 py-3">
                    Escalated Interlocks
                  </th>

                  <th className="rounded-r-lg px-4 py-3 text-right">
                    Performance Grade
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {operators.map((operator) => (
                  <tr
                    key={operator.name}
                    className={
                      operator.ai
                        ? "bg-[#eff4ff]/40"
                        : ""
                    }
                  >
                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                            operator.ai
                              ? "bg-[#d3e4fe] text-[#00288e]"
                              : "bg-[#00288e] text-white"
                          }`}
                        >
                          {operator.ai ? (
                            <Bot size={16} />
                          ) : (
                            operator.initials
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-bold">
                            {operator.name}
                          </p>

                          <p className="text-[10px] text-slate-400">
                            {operator.desk}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs">
                      {operator.shift}
                    </td>

                    <td className="px-4 py-4 text-lg font-bold text-emerald-700">
                      {operator.ack}
                    </td>

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2">

                        <span className="w-12 text-xs font-bold text-emerald-700">
                          {operator.sla.toFixed(1)}%
                        </span>

                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#e5eeff]">

                          <div
                            className="h-full rounded-full bg-emerald-600"
                            style={{
                              width: `${operator.sla}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs font-semibold">
                      {operator.alerts}
                    </td>

                    <td className="px-4 py-4 text-xs text-slate-500">
                      {operator.escalated}
                    </td>

                    <td className="px-4 py-4 text-right">

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                          operator.grade === "Exemplary"
                            ? "bg-emerald-100 text-emerald-700"
                            : operator.grade === "Automated"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-blue-100 text-[#00288e]"
                        }`}
                      >
                        {operator.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 rounded-lg bg-[#eff4ff] p-3 text-[10px] text-slate-600 sm:flex-row sm:items-center">

            <div className="flex items-start gap-2">

              <ShieldCheck
                size={17}
                className="shrink-0 text-emerald-700"
              />

              <span>
                Analytical telemetry is computed from edge
                safety streams and retained for compliance
                review.
              </span>
            </div>

            <button
              onClick={openEventHistory}
              className="shrink-0 font-bold text-[#00288e] hover:underline"
            >
              View Audit History →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function KpiCard({
  label,
  icon,
  children,
}) {
  return (
    <div className="flex min-h-[145px] flex-col justify-between rounded-xl bg-white p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>

        <span className="text-[#00288e]">
          {icon}
        </span>
      </div>

      <div className="mt-3 space-y-3">
        {children}
      </div>
    </div>
  );
}

function Badge({
  children,
  positive = false,
}) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-bold ${
        positive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-800"
      }`}
    >
      {children}
    </span>
  );
}

function Progress({ value }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[#e5eeff]">

      <div
        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}

function Dot({
  color,
  text,
}) {
  return (
    <span className="flex items-center gap-1.5">

      <span
        className={`h-2 w-2 rounded-full ${color}`}
      />

      {text}
    </span>
  );
}

function AnalysisItem({
  icon,
  title,
  text,
  green,
  blue,
}) {
  return (
    <div className="flex items-start gap-2">

      <span
        className={`mt-0.5 ${
          green
            ? "text-emerald-700"
            : blue
            ? "text-[#00288e]"
            : "text-red-800"
        }`}
      >
        {React.cloneElement(icon, {
          size: 18,
        })}
      </span>

      <div>
        <p className="text-[11px] font-bold">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function PpeRow({ item }) {
  const colors = [
    "bg-[#00288e]",
    "bg-[#3755c3]",
    "bg-slate-500",
  ];

  return (
    <div>

      <div className="mb-1 flex justify-between gap-3 text-[11px]">

        <span className="font-bold">
          {item.name}
        </span>

        <span
          className={`font-bold ${
            item.avg >= 90
              ? "text-emerald-700"
              : "text-red-800"
          }`}
        >
          {item.avg}% Avg
        </span>
      </div>

      <div className="space-y-1">

        {item.values.map((value, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
          >
            <span className="w-4 text-[9px] text-slate-400">
              {["A", "B", "C"][index]}
            </span>

            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e5eeff]">

              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.warning && index === 2
                    ? "bg-red-800"
                    : colors[index]
                }`}
                style={{
                  width: `${value}%`,
                }}
              />
            </div>

            <span
              className={`w-7 text-right text-[10px] font-bold ${
                item.warning && index === 2
                  ? "text-red-700"
                  : ""
              }`}
            >
              {value}%
            </span>
          </div>
        ))}
      </div>

      {item.note && (
        <div className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-red-800">

          <AlertTriangle size={11} />

          {item.note}
        </div>
      )}
    </div>
  );
}

function Severity({ severity }) {
  const style =
    severity === "CRITICAL"
      ? "bg-red-600 text-white"
      : severity === "HIGH RISK"
      ? "bg-red-100 text-red-800"
      : "bg-slate-200 text-slate-700";

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${style}`}
    >
      {severity}
    </span>
  );
}