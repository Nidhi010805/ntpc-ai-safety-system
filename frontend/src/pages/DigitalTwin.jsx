import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Camera,
  ChevronRight,
  Crosshair,
  Download,
  Eye,
  EyeOff,
  Flame,
  LocateFixed,
  MapPin,
  Minus,
  Plus,
  Radio,
  RefreshCw,
  Send,
  ShieldAlert,
  Siren,
  Video,
  Waves,
  Wifi,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

/* =========================================================
   CAMERA DATA
========================================================= */

const CAMERAS = [
  {
    id: "CAM 01",
    short: "01",
    tenderNo: 1,
    x: 115,
    y: 195,
    location: "Track Hopper 01 Rail Gate",
    zone: "Track Hopper",
    level: "Grade",
    severity: "normal",
    badge: "NORMAL",
    latency: 18,
    description:
      "Clear track hopper unloading apron. All perimeter safety barriers armed.",
    elevation: "Grade -8.0m (Underground)",
    mounting: "North Rail Gate Pole",
    model: "Perimeter Guard v3.8",
  },
  {
    id: "CAM 12",
    short: "12",
    tenderNo: 60,
    x: 230,
    y: 195,
    location: "Track Hopper 02 Pit",
    zone: "Track Hopper",
    level: "Grade",
    severity: "critical",
    badge: "CRITICAL",
    latency: 22,
    description:
      "182°C spontaneous smoldering coal detected in subterranean chute pit. Fire deluge armed.",
    elevation: "Grade -8.0m (Underground)",
    mounting: "Stanchion Arm #14",
    model: "Pyrogenic Hotspot v4.2",
    temperature: "182.4°C",
  },
  {
    id: "CAM 04",
    short: "04",
    tenderNo: 6,
    x: 360,
    y: 240,
    location: "Crusher Conv 2 A/B DE",
    zone: "Crusher House",
    level: "Grade",
    severity: "high",
    badge: "HIGH RISK",
    latency: 28,
    description:
      "Restricted machinery safety zone intrusion. Personnel detected inside rotating equipment perimeter.",
    elevation: "Grade +4.5m",
    mounting: "Structure Angle",
    model: "Restricted Zone v5.1",
  },
  {
    id: "CAM 07",
    short: "07",
    tenderNo: 4,
    x: 475,
    y: 235,
    location: "Transfer Point 1 (TP-1)",
    zone: "Crusher House",
    level: "Grade",
    severity: "medium",
    badge: "WARNING",
    latency: 30,
    description:
      "Dust opacity reached 28%. Auto dust-suppression fogger engaged.",
    elevation: "Grade +6.0m",
    mounting: "TP-1 Chute Frame",
    model: "Dust Vision v3.4",
  },
  {
    id: "CAM 09",
    short: "09",
    tenderNo: 9,
    x: 490,
    y: 175,
    location: "Crusher House Top Floor",
    zone: "Crusher House",
    level: "Gallery",
    severity: "normal",
    badge: "NORMAL",
    latency: 21,
    description:
      "Vibratory screen decks operating normally. Zero hazard tags.",
    elevation: "Gallery +15m",
    mounting: "Top Floor Beam",
    model: "Industrial Safety v4.0",
  },
  {
    id: "CAM 16",
    short: "16",
    tenderNo: 25,
    x: 670,
    y: 210,
    location: "TH-2 Conv 18 A/B Gantry",
    zone: "Conveyor",
    level: "Gallery",
    severity: "medium",
    badge: "WARNING",
    latency: 26,
    description:
      "Non-compliant footwear detected on steel gantry walkway.",
    elevation: "Gallery +15m",
    mounting: "Steel Gantry Truss",
    model: "PPE Compliance v4.7",
  },
  {
    id: "CAM 20",
    short: "20",
    tenderNo: 20,
    x: 755,
    y: 195,
    location: "Transfer Tower TH-2",
    zone: "Conveyor",
    level: "Gallery",
    severity: "normal",
    badge: "NORMAL",
    latency: 20,
    description:
      "Transfer tower junction operating normally under continuous AI surveillance.",
    elevation: "Gallery +18m",
    mounting: "TH-2 Junction Beam",
    model: "Industrial Safety v4.0",
  },
  {
    id: "CAM 28",
    short: "28",
    tenderNo: 28,
    x: 860,
    y: 180,
    location: "Unit 4 Bunker Floor",
    zone: "Bunker",
    level: "Bunker",
    severity: "normal",
    badge: "NORMAL",
    latency: 24,
    description:
      "Coal bunker tripper car operating along transit axis. Area clear.",
    elevation: "Bunker Top +38.5m",
    mounting: "Silo Gallery Beam",
    model: "Height Safety v4.3",
  },
  {
    id: "CAM 34",
    short: "34",
    tenderNo: 44,
    x: 980,
    y: 180,
    location: "Unit 6 Bunker 17 B Roof",
    zone: "Bunker",
    level: "Bunker",
    severity: "high",
    badge: "HIGH RISK",
    latency: 31,
    description:
      "Elev. +38.5m catwalk. AI vision flagged worker without secured dual-lanyard harness.",
    elevation: "Bunker Top +38.5m",
    mounting: "Roof Cantilever Deck",
    model: "Height PPE v5.0",
  },
  {
    id: "CAM 42",
    short: "42",
    tenderNo: 42,
    x: 920,
    y: 375,
    location: "Unit 6 Boiler Lower Catwalk",
    zone: "Boiler",
    level: "Grade",
    severity: "normal",
    badge: "NORMAL",
    latency: 19,
    description:
      "Boiler lower catwalk clear. Structural access zones normal.",
    elevation: "Grade +8.0m",
    mounting: "Boiler Column",
    model: "Industrial Safety v4.0",
  },
  {
    id: "CAM 53",
    short: "53",
    tenderNo: 57,
    x: 120,
    y: 490,
    location: "High Mast Pole P1",
    zone: "Coal Yard",
    level: "Grade",
    severity: "normal",
    badge: "NORMAL",
    latency: 23,
    description:
      "Outdoor coal yard stacker perimeter clear. AI perimeter fencing secure.",
    elevation: "Grade ±0.0m",
    mounting: "High Mast Pole P1",
    model: "Perimeter Guard v3.8",
  },
  {
    id: "CAM 55",
    short: "55",
    tenderNo: 55,
    x: 320,
    y: 480,
    location: "Central Stacker Yard",
    zone: "Coal Yard",
    level: "Grade",
    severity: "normal",
    badge: "NORMAL",
    latency: 17,
    description:
      "Central stacker corridor clear and operating normally.",
    elevation: "Grade ±0.0m",
    mounting: "High Mast Pole P2",
    model: "Perimeter Guard v3.8",
  },
  {
    id: "CAM 58",
    short: "58",
    tenderNo: 58,
    x: 520,
    y: 490,
    location: "Stockyard East Gate",
    zone: "Coal Yard",
    level: "Grade",
    severity: "normal",
    badge: "NORMAL",
    latency: 19,
    description:
      "East stockyard perimeter gate normal.",
    elevation: "Grade ±0.0m",
    mounting: "High Mast Pole P3",
    model: "Perimeter Guard v3.8",
  },
  {
    id: "CAM 60",
    short: "60",
    tenderNo: 60,
    x: 690,
    y: 440,
    location: "CHP Central Control Room",
    zone: "Control Room",
    level: "Grade",
    severity: "normal",
    badge: "NORMAL",
    latency: 14,
    description:
      "CHP control room perimeter and safety marshal station normal.",
    elevation: "Grade ±0.0m",
    mounting: "Control Room Pole",
    model: "Perimeter Guard v3.8",
  },
];

const CAMERA_IMAGES = {
  "CAM 12":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAH8XrC4EnolxFM5VpGKUCxGVajutgpl2tG5JJKcFBez27tukKLmgSfm0sNQ3-HA4Y4z8ULjKiDxD3AkaaIo2PV5K6mAAkexQZIyEcSht2olwkakR544oTBCwwDqsQ6V2fK7Y0_p6CZ2ia_KYc71a7atqdJi5BACHd-KUWsfpcQShzKN0yDeuZtniMHuZvAIMosEDA5NlrnOPlUgVy5rIWjr2UzAPieR12ALiUWrzLt6Y5l3Cge3ZCHxQ",
};

/* =========================================================
   HELPERS
========================================================= */

function severityColor(severity) {
  if (severity === "critical") return "#ba1a1a";
  if (severity === "high") return "#ea580c";
  if (severity === "medium") return "#ca8a04";
  return "#006c4a";
}

function severityRing(severity) {
  if (severity === "critical") return "#ffdad6";
  if (severity === "high") return "#fed7aa";
  if (severity === "medium") return "#fef08a";
  return "#85f8c4";
}

function badgeClass(severity) {
  if (severity === "critical") {
    return "bg-red-100 text-red-800";
  }

  if (severity === "high") {
    return "bg-orange-100 text-orange-800";
  }

  if (severity === "medium") {
    return "bg-yellow-100 text-yellow-800";
  }

  return "bg-emerald-100 text-emerald-800";
}

/* =========================================================
   PAGE
========================================================= */

export default function PlantMap() {
  const navigate = useNavigate();

  const [selectedCamera, setSelectedCamera] = useState(CAMERAS[1]);
  const [hoveredCamera, setHoveredCamera] = useState(null);

  const [view, setView] = useState("Schematic");
  const [level, setLevel] = useState("Combined");
  const [status, setStatus] = useState("all");

  const [fovVisible, setFovVisible] = useState(true);
  const [dangerZones, setDangerZones] = useState(true);
  const [hydrantLines, setHydrantLines] = useState(true);
  const [musterExits, setMusterExits] = useState(false);

  const [zoom, setZoom] = useState(1);

  const [sirenActive, setSirenActive] = useState(false);
  const [delugeActive, setDelugeActive] = useState(false);
  const [marshalDispatched, setMarshalDispatched] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (title, message) => {
    setToast({ title, message });

    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const filteredCameras = useMemo(() => {
    return CAMERAS.filter((camera) => {
      const levelMatch =
        level === "Combined" || camera.level === level;

      const statusMatch =
        status === "all" ||
        (status === "critical" && camera.severity === "critical") ||
        (status === "high" && camera.severity === "high") ||
        (status === "medium" && camera.severity === "medium") ||
        (status === "normal" && camera.severity === "normal");

      return levelMatch && statusMatch;
    });
  }, [level, status]);

  const visibleIds = useMemo(
    () => new Set(filteredCameras.map((camera) => camera.id)),
    [filteredCameras]
  );

  const openLiveCamera = () => {
    if (!selectedCamera) return;

    navigate(`/camera?tender=${selectedCamera.tenderNo}`);
  };

  const recenter = () => {
    setZoom(0.98);

    window.setTimeout(() => {
      setZoom(1);
    }, 150);

    showToast(
      "Map Recentered",
      "Plant schematic restored to the default spatial extent."
    );
  };

  const triggerDeluge = () => {
    setDelugeActive(true);

    showToast(
      "Water Deluge Activated",
      "Track Hopper 02 suppression line has been triggered."
    );
  };

  const triggerSiren = () => {
    setSirenActive(true);

    showToast(
      "Zone Siren Activated",
      `${selectedCamera.location} acoustic warning is now active.`
    );

    window.setTimeout(() => {
      setSirenActive(false);
    }, 5000);
  };

  const dispatchMarshal = () => {
    setMarshalDispatched(true);

    showToast(
      "Safety Marshal Dispatched",
      `Response team dispatched to ${selectedCamera.location}.`
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">

      {/* TOAST */}

      {toast && (
        <div className="fixed right-5 top-20 z-[200] w-[350px] max-w-[calc(100%-40px)] rounded-xl border border-blue-100 bg-white p-4 shadow-2xl">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#00288e]">
              <Radio size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold">{toast.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => setToast(null)}
              className="ml-auto h-fit rounded-md p-1 text-slate-400 hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-[1900px] flex-col gap-4">

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-5 py-3 shadow-sm">

          <div className="flex flex-wrap items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Operations Monitoring</span>
            <ChevronRight size={15} />
            <span>Geospatial & Facility Surveillance</span>
            <ChevronRight size={15} />
            <span className="text-[#00288e]">
              Plant Map (NTPC Korba CHP)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">

            <span className="flex items-center gap-1.5 rounded-full bg-[#e5eeff] px-3 py-1 font-semibold">
              <MapPin size={14} className="text-[#00288e]" />
              Grid: Sector 1-4 • 60 CCTV Nodes Active
            </span>

            <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 font-bold text-red-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
              5 Active Hazards Plotted
            </span>

            <span className="flex items-center gap-1.5 font-semibold">
              <Wifi size={14} className="text-emerald-700" />
              Edge Telemetry: 18ms Sync
            </span>
          </div>
        </section>

        {/* =================================================
            TITLE
        ================================================= */}

        <section className="flex flex-col justify-between gap-4 rounded-xl bg-white p-5 shadow-sm xl:flex-row xl:items-end">

          <div className="max-w-4xl">
            <div className="flex items-center gap-2">
              <Building2 size={28} className="text-[#00288e]" />

              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Thermal Plant Layout & Camera Spatial Map
              </h1>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Interactive schematic facility overview of Coal Handling
              Plant (CHP), Crusher Houses, Bunker Galleries, and Boiler
              Units with 60 edge AI camera nodes and real-time hazard
              hotspot overlays.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              onClick={recenter}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#e5eeff] px-4 text-sm font-semibold hover:bg-[#dce9ff]"
            >
              <Crosshair size={17} />
              Recenter View
            </button>

            <button
              onClick={() => setFovVisible((value) => !value)}
              className={`flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold ${
                fovVisible
                  ? "bg-[#dce9ff] text-[#00288e]"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {fovVisible ? <Eye size={17} /> : <EyeOff size={17} />}
              FOV Cones: {fovVisible ? "Active" : "Muted"}
            </button>

            <button
              onClick={() => window.print()}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#00288e] px-4 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Download size={17} />
              Export Geo-Audit
            </button>
          </div>
        </section>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <section className="grid grid-cols-1 gap-2 rounded-xl bg-[#eff4ff] p-2 lg:grid-cols-12">

          <div className="flex rounded-lg bg-white p-1 lg:col-span-4">
            {["Schematic", "Process Flow", "Heatmap"].map((item) => (
              <button
                key={item}
                onClick={() => setView(item)}
                className={`flex-1 rounded-md px-2 py-2 text-xs font-bold transition ${
                  view === item
                    ? "bg-[#00288e] text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {item === "Schematic"
                  ? "Schematic Plant Grid"
                  : item === "Heatmap"
                  ? "Zonal Heatmap"
                  : "Process Flow View"}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg bg-white p-1 lg:col-span-4">
            {[
              ["Grade", "Grade ±0.0m"],
              ["Gallery", "Gallery +15m"],
              ["Bunker", "Bunker Top +38.5m"],
              ["Combined", "Combined"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setLevel(value)}
                className={`flex-1 rounded-md px-2 py-2 text-[11px] font-bold ${
                  level === value
                    ? "bg-[#dce9ff] text-[#00288e]"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-white px-2 lg:col-span-4">
            <span className="mr-1 text-[10px] font-bold uppercase text-slate-400">
              Status:
            </span>

            <StatusFilter
              active={status === "all"}
              onClick={() => setStatus("all")}
              label="All 60"
            />

            <StatusFilter
              active={status === "critical"}
              onClick={() => setStatus("critical")}
              label="1 Critical"
              type="critical"
            />

            <StatusFilter
              active={status === "high"}
              onClick={() => setStatus("high")}
              label="2 High"
              type="high"
            />

            <StatusFilter
              active={status === "medium"}
              onClick={() => setStatus("medium")}
              label="2 Med"
              type="medium"
            />

            <StatusFilter
              active={status === "normal"}
              onClick={() => setStatus("normal")}
              label="54 OK"
              type="normal"
            />
          </div>
        </section>

        {/* =================================================
            MAIN WORKSTATION
        ================================================= */}

        <section className="grid grid-cols-1 items-start gap-4 2xl:grid-cols-12">

          {/* MAP */}

          <div className="relative min-h-[640px] overflow-hidden rounded-xl bg-white shadow-sm 2xl:col-span-8">

            {/* HUD */}

            <div className="absolute left-4 right-4 top-4 z-30 flex flex-wrap items-center justify-between gap-2">

              <div className="rounded-lg bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-600" />

                  <span className="text-xs font-bold">
                    NTPC KORBA THERMAL • COAL HANDLING COMPLEX
                  </span>

                  <span className="hidden text-[10px] text-slate-400 md:inline">
                    • NTPC-KB-CHP-09
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap rounded-lg bg-white/95 p-1 shadow-lg backdrop-blur">

                <MapToggle
                  checked={dangerZones}
                  onChange={setDangerZones}
                  label="Danger Zones"
                />

                <MapToggle
                  checked={hydrantLines}
                  onChange={setHydrantLines}
                  label="Hydrant Lines"
                />

                <MapToggle
                  checked={musterExits}
                  onChange={setMusterExits}
                  label="Muster Exits"
                />
              </div>
            </div>

            {/* MAP CONTROLS */}

            <div className="absolute bottom-4 left-4 z-40 flex flex-col gap-1 rounded-lg bg-white/95 p-1.5 shadow-xl">

              <MapControl
                title="Zoom In"
                onClick={() =>
                  setZoom((value) => Math.min(1.7, value + 0.1))
                }
              >
                <Plus size={18} />
              </MapControl>

              <MapControl
                title="Zoom Out"
                onClick={() =>
                  setZoom((value) => Math.max(0.65, value - 0.1))
                }
              >
                <Minus size={18} />
              </MapControl>

              <MapControl title="Reset View" onClick={recenter}>
                <LocateFixed size={18} />
              </MapControl>

              <div className="border-t pt-1 text-center text-[9px] font-bold text-slate-500">
                N
              </div>
            </div>

            {/* MAP */}

            <div className="h-[660px] overflow-hidden bg-[#0d1522]">

              <svg
                viewBox="0 0 1100 680"
                className="h-full w-full origin-center transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
              >
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(255,255,255,.05)"
                      strokeWidth="1"
                    />
                  </pattern>

                  <pattern
                    id="hazardStripe"
                    width="16"
                    height="16"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="16"
                      stroke="rgba(186,26,26,.4)"
                      strokeWidth="4"
                    />
                  </pattern>

                  <linearGradient id="fovGreen">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity=".4" />
                    <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="fovRed">
                    <stop offset="0%" stopColor="#ff2e2e" stopOpacity=".6" />
                    <stop offset="100%" stopColor="#ff2e2e" stopOpacity=".03" />
                  </linearGradient>

                  <linearGradient id="fovAmber">
                    <stop offset="0%" stopColor="#ff9900" stopOpacity=".55" />
                    <stop offset="100%" stopColor="#ff9900" stopOpacity=".02" />
                  </linearGradient>
                </defs>

                <rect width="1100" height="680" fill="#0d1522" />
                <rect width="1100" height="680" fill="url(#grid)" />

                {/* FACILITY */}

                <rect
                  x="25"
                  y="40"
                  width="1050"
                  height="610"
                  rx="14"
                  fill="none"
                  stroke="#223652"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />

                <text
                  x="40"
                  y="60"
                  fill="#4d6b94"
                  fontSize="11"
                  fontWeight="700"
                >
                  FACILITY BOUNDARY • NTPC KORBA CHP EXPANSION
                </text>

                {/* TRACK HOPPER */}

                <rect
                  x="45"
                  y="125"
                  width="250"
                  height="145"
                  rx="6"
                  fill="#132034"
                  stroke="#253e61"
                />

                <text x="60" y="150" fill="#8ca8d1" fontSize="13" fontWeight="700">
                  TRACK HOPPER & WAGON TIPPLER YARD
                </text>

                <text x="60" y="165" fill="#4d6b94" fontSize="10">
                  El. -8.0m Pit • 6 Underground Chutes
                </text>

                <rect
                  x="65"
                  y="178"
                  width="100"
                  height="78"
                  rx="4"
                  fill="#172840"
                  stroke="#335482"
                />

                <text x="75" y="200" fill="#a4c2ee" fontSize="11">
                  TH-01 Pits
                </text>

                <rect
                  x="180"
                  y="178"
                  width="100"
                  height="78"
                  rx="4"
                  fill={dangerZones ? "#2d161d" : "#172840"}
                  stroke={dangerZones ? "#ba1a1a" : "#335482"}
                  strokeWidth="2"
                />

                {dangerZones && (
                  <rect
                    x="180"
                    y="178"
                    width="100"
                    height="78"
                    rx="4"
                    fill="url(#hazardStripe)"
                  />
                )}

                <text
                  x="190"
                  y="200"
                  fill={dangerZones ? "#ffb4ab" : "#a4c2ee"}
                  fontSize="11"
                  fontWeight="700"
                >
                  TH-02 Pit
                </text>

                {dangerZones && (
                  <text
                    x="190"
                    y="216"
                    fill="#ff5449"
                    fontSize="9"
                    fontWeight="700"
                  >
                    182°C SMOLDER ALERT
                  </text>
                )}

                {/* HYDRANT */}

                {hydrantLines && (
                  <>
                    <path
                      d="M40 290 L320 290 L320 380 L760 380"
                      fill="none"
                      stroke="#00714e"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />

                    <text
                      x="50"
                      y="304"
                      fill="#68dba9"
                      fontSize="9"
                      fontWeight="600"
                    >
                      DELUGE FIRE LINE DN-250 (3.8 BAR)
                    </text>
                  </>
                )}

                {/* CONVEYORS */}

                <path
                  d="M280 215 L430 215"
                  stroke="#486581"
                  strokeWidth="12"
                  strokeLinecap="round"
                />

                <path
                  d="M280 215 L430 215"
                  stroke="#102a43"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                <text x="315" y="205" fill="#9fb3c8" fontSize="10">
                  Conv 1 A/B
                </text>

                <path
                  d="M280 240 L430 240"
                  stroke={dangerZones ? "#f59e0b" : "#486581"}
                  strokeWidth="12"
                  strokeLinecap="round"
                />

                <path
                  d="M280 240 L430 240"
                  stroke="#78350f"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                <text
                  x="315"
                  y="258"
                  fill="#fbbf24"
                  fontSize="10"
                  fontWeight="700"
                >
                  Conv 2 A/B DE
                </text>

                {/* CRUSHER */}

                <rect
                  x="430"
                  y="160"
                  width="150"
                  height="150"
                  rx="8"
                  fill="#152438"
                  stroke="#36537a"
                  strokeWidth="2"
                />

                <text
                  x="450"
                  y="192"
                  fill="#d9e2ec"
                  fontSize="12"
                  fontWeight="700"
                >
                  CRUSHER HOUSE #1
                </text>

                <rect
                  x="445"
                  y="225"
                  width="60"
                  height="65"
                  rx="4"
                  fill="#2b2816"
                  stroke="#ca8a04"
                />

                <text
                  x="452"
                  y="244"
                  fill="#fde047"
                  fontSize="10"
                  fontWeight="700"
                >
                  TP-1
                </text>

                <text x="452" y="272" fill="#facc15" fontSize="8">
                  Dust 28%
                </text>

                {/* MAIN CONVEYOR */}

                <path
                  d="M580 210 L760 210"
                  stroke="#486581"
                  strokeWidth="10"
                  strokeLinecap="round"
                />

                <path
                  d="M580 210 L760 210"
                  stroke="#102a43"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                <text x="615" y="200" fill="#9fb3c8" fontSize="10">
                  Conv 18 A/B (Chandi)
                </text>

                <path
                  d="M580 260 L760 330"
                  stroke="#486581"
                  strokeWidth="10"
                />

                {/* BUNKERS */}

                <rect
                  x="790"
                  y="100"
                  width="260"
                  height="380"
                  rx="10"
                  fill="#111c2c"
                  stroke="#2d486f"
                  strokeWidth="2"
                />

                <text
                  x="810"
                  y="128"
                  fill="#d9e2ec"
                  fontSize="14"
                  fontWeight="700"
                >
                  UNIT 5 & 6 BOILER & BUNKER COMPLEX
                </text>

                <text x="810" y="144" fill="#627d98" fontSize="10">
                  El. +38.50m Tripper Floor • High Fall Risk Sector
                </text>

                <rect
                  x="810"
                  y="160"
                  width="105"
                  height="120"
                  rx="6"
                  fill="#19283c"
                  stroke="#334e68"
                />

                <text x="820" y="182" fill="#bcccdc" fontSize="11">
                  Unit 4 Bunker
                </text>

                <rect
                  x="930"
                  y="160"
                  width="105"
                  height="120"
                  rx="6"
                  fill={dangerZones ? "#2d1d16" : "#19283c"}
                  stroke={dangerZones ? "#ea580c" : "#334e68"}
                  strokeWidth="2"
                />

                <text
                  x="940"
                  y="182"
                  fill="#ffb4ab"
                  fontSize="11"
                  fontWeight="700"
                >
                  Unit 6 Bunker
                </text>

                <text x="940" y="198" fill="#fdba74" fontSize="9">
                  17 B Roof Catwalk
                </text>

                {/* STOCKYARD */}

                <rect
                  x="45"
                  y="440"
                  width="540"
                  height="190"
                  rx="8"
                  fill="#0f1926"
                  stroke="#253a54"
                />

                <text
                  x="60"
                  y="468"
                  fill="#8ca8d1"
                  fontSize="13"
                  fontWeight="700"
                >
                  OUTDOOR COAL STOCKYARD • STACKER-RECLAIMER YARD
                </text>

                <path
                  d="M60 520 L560 520"
                  stroke="#334e68"
                  strokeWidth="6"
                  strokeDasharray="10 6"
                />

                <ellipse
                  cx="140"
                  cy="570"
                  rx="70"
                  ry="30"
                  fill="#142131"
                  stroke="#233549"
                />

                <ellipse
                  cx="380"
                  cy="570"
                  rx="100"
                  ry="34"
                  fill="#142131"
                  stroke="#233549"
                />

                {/* CONTROL ROOM */}

                <rect
                  x="610"
                  y="440"
                  width="160"
                  height="190"
                  rx="8"
                  fill="#15263a"
                  stroke="#2c5282"
                  strokeWidth="2"
                />

                <text
                  x="625"
                  y="468"
                  fill="#90cdf4"
                  fontSize="12"
                  fontWeight="700"
                >
                  CHP MAIN DESK
                </text>

                <text x="625" y="484" fill="#63b3ed" fontSize="9">
                  Operator Desk #1 • Unit 1-6
                </text>

                {/* MUSTER EXITS */}

                {musterExits && (
                  <>
                    <g>
                      <rect
                        x="35"
                        y="350"
                        width="75"
                        height="28"
                        rx="5"
                        fill="#006c4a"
                      />
                      <text
                        x="72"
                        y="368"
                        fill="white"
                        fontSize="9"
                        textAnchor="middle"
                        fontWeight="700"
                      >
                        MUSTER A
                      </text>
                    </g>

                    <g>
                      <rect
                        x="970"
                        y="550"
                        width="75"
                        height="28"
                        rx="5"
                        fill="#006c4a"
                      />
                      <text
                        x="1007"
                        y="568"
                        fill="white"
                        fontSize="9"
                        textAnchor="middle"
                        fontWeight="700"
                      >
                        MUSTER B
                      </text>
                    </g>
                  </>
                )}

                {/* FOV */}

                {fovVisible &&
                  filteredCameras.map((camera) => (
                    <polygon
                      key={`fov-${camera.id}`}
                      points={`${camera.x},${camera.y} ${
                        camera.x - 55
                      },${camera.y + 70} ${camera.x + 65},${
                        camera.y + 70
                      }`}
                      fill={
                        camera.severity === "critical"
                          ? "url(#fovRed)"
                          : camera.severity === "normal"
                          ? "url(#fovGreen)"
                          : "url(#fovAmber)"
                      }
                    />
                  ))}

                {/* CAMERA NODES */}

                {CAMERAS.map((camera) => {
                  if (!visibleIds.has(camera.id)) return null;

                  const selected = selectedCamera?.id === camera.id;

                  return (
                    <g
                      key={camera.id}
                      transform={`translate(${camera.x},${camera.y})`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredCamera(camera)}
                      onMouseLeave={() => setHoveredCamera(null)}
                      onClick={() => setSelectedCamera(camera)}
                    >
                      {(camera.severity === "critical" ||
                        camera.severity === "high") && (
                        <circle
                          r="22"
                          fill={severityColor(camera.severity)}
                          opacity=".25"
                        >
                          <animate
                            attributeName="r"
                            values="18;25;18"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {selected && (
                        <circle
                          r="21"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                        />
                      )}

                      <circle
                        r={
                          camera.severity === "critical"
                            ? 15
                            : camera.severity === "normal"
                            ? 12
                            : 14
                        }
                        fill={severityColor(camera.severity)}
                        stroke={severityRing(camera.severity)}
                        strokeWidth="2.5"
                      />

                      <text
                        y="4"
                        fill="#fff"
                        fontSize="9"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {camera.short}
                      </text>

                      {camera.severity !== "normal" && (
                        <>
                          <rect
                            x="14"
                            y="-20"
                            width="62"
                            height="17"
                            rx="4"
                            fill={severityColor(camera.severity)}
                          />

                          <text
                            x="45"
                            y="-8"
                            fill="#fff"
                            fontSize="7"
                            fontWeight="800"
                            textAnchor="middle"
                          >
                            {camera.severity === "critical"
                              ? "182°C CRIT"
                              : camera.badge}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* HOVER CARD */}

              {hoveredCamera && (
                <div className="pointer-events-none absolute bottom-16 right-4 z-50 w-72 rounded-xl bg-white/95 p-3 shadow-2xl backdrop-blur">

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#00288e]">
                      {hoveredCamera.id}
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeClass(
                        hoveredCamera.severity
                      )}`}
                    >
                      {hoveredCamera.badge}
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold">
                    {hoveredCamera.location}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {hoveredCamera.description}
                  </p>

                  <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                    <span>Latency: {hoveredCamera.latency}ms</span>
                    <span className="font-bold text-[#00288e]">
                      Click to Inspect
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              INSPECTION DRAWER
          ================================================= */}

          <aside className="flex flex-col gap-4 2xl:col-span-4">

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <div className="flex items-start justify-between gap-3">

                <div className="flex gap-2">

                  <span
                    className={`mt-1 h-3 w-3 rounded-full ${
                      selectedCamera.severity === "critical"
                        ? "animate-pulse bg-red-600"
                        : selectedCamera.severity === "high"
                        ? "bg-orange-600"
                        : selectedCamera.severity === "medium"
                        ? "bg-yellow-600"
                        : "bg-emerald-600"
                    }`}
                  />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Active Spatial Target
                    </p>

                    <h2 className="text-xl font-bold">
                      {selectedCamera.id} • {selectedCamera.location}
                    </h2>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${badgeClass(
                    selectedCamera.severity
                  )}`}
                >
                  {selectedCamera.badge}
                </span>
              </div>

              {/* CAMERA PREVIEW */}

              <div className="relative mt-4 aspect-video overflow-hidden rounded-lg bg-[#213145]">

                {CAMERA_IMAGES[selectedCamera.id] ? (
                  <img
                    src={CAMERA_IMAGES[selectedCamera.id]}
                    alt=""
                    className="h-full w-full object-cover opacity-85"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-slate-300">
                    <Camera size={40} />
                    <span className="mt-2 text-xs">
                      Live AI Camera Preview
                    </span>
                  </div>
                )}

                <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-[10px] font-bold text-white">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  LIVE AI • 1080p60
                </div>

                <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-bold text-white">
                  {selectedCamera.temperature ||
                    `${selectedCamera.latency}ms`}
                </div>

                {selectedCamera.severity === "critical" && (
                  <div className="absolute bottom-7 left-10 right-10 top-10 rounded border-2 border-dashed border-red-500 p-2">
                    <span className="rounded bg-red-600 px-2 py-1 text-[9px] font-bold text-white">
                      SMOLDERING COAL DETECTED (98.4%)
                    </span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/90 px-2 py-2 text-[9px] text-white">
                  <span>{selectedCamera.id} • EDGE AI</span>
                  <span>{selectedCamera.latency}ms latency</span>
                </div>
              </div>

              {/* TELEMETRY */}

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-[#eff4ff] p-3">

                <Info
                  label="Plant Sub-Sector"
                  value={selectedCamera.location}
                />

                <Info
                  label="Elevation / Level"
                  value={selectedCamera.elevation}
                />

                <Info
                  label="Mounting Rig"
                  value={selectedCamera.mounting}
                />

                <Info
                  label="Edge AI Model"
                  value={selectedCamera.model}
                />
              </div>

              {/* DIAGNOSTIC */}

              <div
                className={`mt-3 flex gap-3 rounded-lg p-3 ${
                  selectedCamera.severity === "critical"
                    ? "bg-red-100"
                    : selectedCamera.severity === "high"
                    ? "bg-orange-50"
                    : selectedCamera.severity === "medium"
                    ? "bg-yellow-50"
                    : "bg-emerald-50"
                }`}
              >
                {selectedCamera.severity === "critical" ? (
                  <Flame className="shrink-0 text-red-700" size={22} />
                ) : (
                  <ShieldAlert
                    className="shrink-0 text-[#00288e]"
                    size={22}
                  />
                )}

                <div>
                  <p className="text-sm font-bold">
                    {selectedCamera.severity === "critical"
                      ? "Spontaneous Combustion Thermal Core"
                      : `${selectedCamera.badge} AI Detection`}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {selectedCamera.description}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="mt-4 grid grid-cols-2 gap-2">

                <button
                  onClick={openLiveCamera}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#00288e] px-2 text-xs font-bold text-white hover:bg-blue-800"
                >
                  <Video size={16} />
                  PTZ Full Stream
                </button>

                <button
                  onClick={triggerSiren}
                  className={`flex h-10 items-center justify-center gap-2 rounded-lg px-2 text-xs font-bold ${
                    sirenActive
                      ? "bg-orange-600 text-white"
                      : "bg-[#dce9ff] text-slate-800"
                  }`}
                >
                  <Siren size={16} />
                  {sirenActive ? "Siren Active" : "Sound Zone Siren"}
                </button>

                <button
                  onClick={triggerDeluge}
                  disabled={delugeActive}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-red-700 px-2 text-xs font-bold text-white disabled:bg-emerald-700"
                >
                  <Waves size={16} />
                  {delugeActive ? "Deluge Active" : "Trigger Deluge Spray"}
                </button>

                <button
                  onClick={dispatchMarshal}
                  disabled={marshalDispatched}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#006c4a] px-2 text-xs font-bold text-white disabled:opacity-70"
                >
                  <Send size={16} />
                  {marshalDispatched
                    ? "Marshal Dispatched"
                    : "Dispatch Marshal"}
                </button>
              </div>
            </div>

            {/* OTHER ALERTS */}

            <div className="rounded-xl bg-white p-4 shadow-sm">

              <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Other Active Geolocation Alerts
              </p>

              {CAMERAS.filter(
                (camera) =>
                  camera.severity !== "normal" &&
                  camera.id !== selectedCamera.id
              ).map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg p-2 text-left hover:bg-[#eff4ff]"
                >
                  <div className="flex min-w-0 items-center gap-2">

                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: severityColor(camera.severity),
                      }}
                    />

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold">
                        {camera.id} • {camera.location}
                      </p>

                      <p className="truncate text-[11px] text-slate-500">
                        {camera.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${badgeClass(
                      camera.severity
                    )}`}
                  >
                    {camera.severity === "medium"
                      ? "MED"
                      : camera.badge}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </section>

        {/* =================================================
            MAP LEGEND
        ================================================= */}

        <section className="grid grid-cols-1 items-center gap-4 rounded-xl bg-white p-5 shadow-sm xl:grid-cols-12">

          <div className="flex flex-wrap items-center gap-4 xl:col-span-4">

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Map Symbology:
            </span>

            <Legend color="bg-red-600" text="Critical Hazard" />
            <Legend color="bg-orange-600" text="High Violation" />
            <Legend color="bg-yellow-600" text="Med Warning" />
            <Legend color="bg-emerald-600" text="Normal Camera" />
          </div>

          <div className="flex flex-wrap gap-2 xl:col-span-8 xl:justify-end">

            <ZoneChip
              color="bg-red-600"
              text="Track Hopper Bay: 1 Crit"
            />

            <ZoneChip
              color="bg-orange-600"
              text="Crusher House 1: 1 High"
            />

            <ZoneChip
              color="bg-yellow-600"
              text="Conveyors (TH1-TH2): 2 Med"
            />

            <ZoneChip
              color="bg-orange-600"
              text="Bunker 4-6: 1 High"
            />

            <ZoneChip
              color="bg-emerald-600"
              text="Coal Yard • 100% Normal"
              success
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function StatusFilter({ active, onClick, label, type = "all" }) {
  const styles = {
    all: active
      ? "bg-[#00288e] text-white"
      : "bg-[#dce9ff] text-slate-700",

    critical: active
      ? "bg-red-700 text-white"
      : "bg-red-100 text-red-800",

    high: active
      ? "bg-orange-700 text-white"
      : "bg-orange-100 text-orange-800",

    medium: active
      ? "bg-yellow-600 text-white"
      : "bg-yellow-100 text-yellow-800",

    normal: active
      ? "bg-emerald-700 text-white"
      : "bg-emerald-100 text-emerald-800",
  };

  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold transition ${styles[type]}`}
    >
      {label}
    </button>
  );
}

function MapToggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-[10px] font-bold hover:bg-slate-100">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-[#00288e]"
      />
      {label}
    </label>
  );
}

function MapControl({ title, onClick, children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded bg-[#e5eeff] text-slate-700 hover:bg-[#d3e4fe]"
    >
      {children}
    </button>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 text-xs font-semibold">{value}</p>
    </div>
  );
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-semibold">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      {text}
    </div>
  );
}

function ZoneChip({ color, text, success = false }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold ${
        success ? "bg-emerald-100 text-emerald-800" : "bg-[#eff4ff]"
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {text}
    </div>
  );
}