import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Cpu,
  Download,
  Eye,
  Filter,
  Grid2X2,
  HardDrive,
  List,
  Network,
  Plus,
  Radio,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Wrench,
  X,
  Zap,
} from "lucide-react";

const INITIAL_CAMERAS = [
  {
    id: "CAM 12",
    tenderNo: 60,
    location: "Track Hopper 02",
    area: "Coal train unloading pit area",
    hardware: "Dual Thermal PTZ",
    hardwareGroup: "thermal",
    mount: "Stanchion Arm #14",
    mountType: "Existing Structure & Angle Required",
    ip: "10.14.82.112",
    jb: "JB-01",
    port: 554,
    state: "critical",
    telemetry: "Smolder 182°C",
    confidence: 94,
    lens: 94,
  },
  {
    id: "CAM 04",
    tenderNo: 6,
    location: "Conveyor 2 A/B DE",
    area: "Crusher House #1 Drive End",
    hardware: "Explosion-Proof PTZ",
    hardwareGroup: "explosion",
    mount: "Wall Mount",
    mountType: "Wall & Angle Required",
    ip: "10.14.82.104",
    jb: "JB-01",
    port: 554,
    state: "warning",
    telemetry: "Intrusion",
    confidence: 98,
    lens: 98,
  },
  {
    id: "CAM 34",
    tenderNo: 44,
    location: "Unit 6 Bunker 17 B",
    area: "Conveyor 17 B DE Floor",
    hardware: "Explosion-Proof PTZ",
    hardwareGroup: "explosion",
    mount: "Existing Beam",
    mountType: "Existing Structure & Angle Required",
    ip: "10.14.82.134",
    jb: "JB-01",
    port: 554,
    state: "warning",
    telemetry: "PPE Alert",
    confidence: 96,
    lens: 96,
  },
  {
    id: "CAM 01",
    tenderNo: 8,
    location: "Conveyor 3 A/B TE",
    area: "Crusher House -1 Tail End",
    hardware: "Heavy Duty PTZ",
    hardwareGroup: "optical",
    mount: "Existing Beam",
    mountType: "Existing Structure & Angle Required",
    ip: "10.14.82.101",
    jb: "Direct",
    port: 554,
    state: "normal",
    telemetry: "Clear",
    confidence: 99,
    lens: 99,
  },
  {
    id: "CAM 02",
    tenderNo: 9,
    location: "Conveyor 8 A/B TE",
    area: "Crusher House -1 Intake",
    hardware: "Standard PTZ",
    hardwareGroup: "optical",
    mount: "Existing Angle",
    mountType: "Existing Structure & Angle Required",
    ip: "10.14.82.102",
    jb: "Direct",
    port: 554,
    state: "normal",
    telemetry: "Clear",
    confidence: 99,
    lens: 99,
  },
  {
    id: "CAM 11",
    tenderNo: 59,
    location: "Track Hopper 01",
    area: "Coal train unloading line",
    hardware: "Dual Thermal PTZ",
    hardwareGroup: "thermal",
    mount: "Rig Arm #10",
    mountType: "Existing Structure & Angle Required",
    ip: "10.14.82.111",
    jb: "JB-01",
    port: 554,
    state: "normal",
    telemetry: "Clear",
    confidence: 97,
    lens: 97,
  },
  {
    id: "CAM 16",
    tenderNo: 25,
    location: "TH-2 Conv 18 A/B",
    area: "Chandi Area Gallery Middle",
    hardware: "Explosion-Proof PTZ",
    hardwareGroup: "explosion",
    mount: "Catwalk Stanchion",
    mountType: "Existing Structure & Angle Required",
    ip: "10.14.82.116",
    jb: "JB-01",
    port: 554,
    state: "warning",
    telemetry: "Footwear",
    confidence: 95,
    lens: 95,
  },
  {
    id: "CAM 53",
    tenderNo: 57,
    location: "TP-27 Top Floor",
    area: "Towards Coal Yard Area",
    hardware: "High-Mast 360° PTZ",
    hardwareGroup: "highmast",
    mount: "Pole P1 (8m)",
    mountType: "Heavy Pole Mount",
    ip: "10.14.82.153",
    jb: "JB-04",
    port: 554,
    state: "maintenance",
    telemetry: "Clean Due",
    confidence: 91,
    lens: 91,
  },
  {
    id: "CAM 56",
    tenderNo: 45,
    location: "TP-8 Roof Gallery",
    area: "Conveyor 11 A D/E Junction",
    hardware: "Explosion-Proof PTZ",
    hardwareGroup: "explosion",
    mount: "Pole P2 (6m)",
    mountType: "Heavy Pole Mount",
    ip: "10.14.82.156",
    jb: "JB-03",
    port: 554,
    state: "normal",
    telemetry: "Clear",
    confidence: 98,
    lens: 98,
  },
];

export default function CameraManagement() {
  const navigate = useNavigate();

  const [cameras, setCameras] = useState(INITIAL_CAMERAS);
  const [selected, setSelected] = useState(INITIAL_CAMERAS[0]);

  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("all");
  const [hardware, setHardware] = useState("all");
  const [mount, setMount] = useState("all");
  const [health, setHealth] = useState("all");
  const [view, setView] = useState("table");

  const [busy, setBusy] = useState(null);
  const [toast, setToast] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return cameras.filter((cam) => {
      const searchMatch =
        !q ||
        cam.id.toLowerCase().includes(q) ||
        String(cam.tenderNo).includes(q) ||
        cam.location.toLowerCase().includes(q) ||
        cam.area.toLowerCase().includes(q) ||
        cam.ip.toLowerCase().includes(q) ||
        cam.jb.toLowerCase().includes(q);

      const sectorMatch =
        sector === "all" ||
        (sector === "hopper" &&
          cam.location.toLowerCase().includes("hopper")) ||
        (sector === "crusher" &&
          cam.area.toLowerCase().includes("crusher")) ||
        (sector === "bunker" &&
          cam.location.toLowerCase().includes("bunker")) ||
        (sector === "conveyor" &&
          (cam.location.toLowerCase().includes("conv") ||
            cam.location.toLowerCase().includes("conveyor"))) ||
        (sector === "yard" &&
          cam.area.toLowerCase().includes("yard"));

      const hardwareMatch =
        hardware === "all" || cam.hardwareGroup === hardware;

      const mountMatch =
        mount === "all" ||
        cam.mountType.toLowerCase().includes(mount.toLowerCase());

      const healthMatch =
        health === "all" || cam.state === health;

      return (
        searchMatch &&
        sectorMatch &&
        hardwareMatch &&
        mountMatch &&
        healthMatch
      );
    });
  }, [cameras, search, sector, hardware, mount, health]);

  const notify = (title, message) => {
    setToast({ title, message });

    window.setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const runAction = (key, title, message, callback) => {
    setBusy(key);

    window.setTimeout(() => {
      callback?.();
      setBusy(null);
      notify(title, message);
    }, 700);
  };

  const cleanLens = () => {
    runAction(
      "clean",
      "Airblast Cycle Completed",
      "Scheduled camera lens cleaning cycle completed.",
      () => {
        setCameras((items) =>
          items.map((cam) =>
            cam.state === "maintenance"
              ? {
                  ...cam,
                  state: "normal",
                  telemetry: "Clear",
                  lens: 99,
                  confidence: 99,
                }
              : cam
          )
        );

        if (selected?.state === "maintenance") {
          setSelected((cam) => ({
            ...cam,
            state: "normal",
            telemetry: "Clear",
            lens: 99,
            confidence: 99,
          }));
        }
      }
    );
  };

  const firmwareSync = () => {
    runAction(
      "firmware",
      "Firmware Synchronized",
      "Camera nodes synchronized to v4.2.1-edge."
    );
  };

  const restartStream = (cam) => {
    runAction(
      `restart-${cam.id}`,
      "RTSP Stream Restarted",
      `${cam.id} stream session restarted successfully.`
    );
  };

  const calibrate = (cam) => {
    runAction(
      `calibrate-${cam.id}`,
      "Calibration Completed",
      `${cam.id} optical/thermal calibration routine completed.`
    );
  };

  const openPTZ = (cam) => {
    navigate(`/camera?tender=${cam.tenderNo}`);
  };

  const exportCSV = () => {
    const headers = [
      "Camera",
      "Tender",
      "Location",
      "Area",
      "Hardware",
      "Mount",
      "IP",
      "Junction Box",
      "State",
      "Lens Health",
    ];

    const rows = cameras.map((cam) => [
      cam.id,
      cam.tenderNo,
      cam.location,
      cam.area,
      cam.hardware,
      cam.mount,
      cam.ip,
      cam.jb,
      cam.state,
      `${cam.lens}%`,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "HeightX-Safe-Camera-Inventory.csv";
    a.click();

    URL.revokeObjectURL(url);

    notify(
      "Inventory Exported",
      `${cameras.length} camera records exported to CSV.`
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSector("all");
    setHardware("all");
    setMount("all");
    setHealth("all");
  };

  return (
    <div className="min-h-full bg-[#f8f9ff] text-[#0b1c30]">
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {showAdd && (
        <AddCameraModal
          onClose={() => setShowAdd(false)}
          onAdd={(camera) => {
            setCameras((old) => [...old, camera]);
            setSelected(camera);
            setShowAdd(false);

            notify(
              "Camera Node Added",
              `${camera.id} added to local inventory.`
            );
          }}
        />
      )}

      <div className="mx-auto flex w-full max-w-[1900px] flex-col gap-4">

        {/* HEADER */}

        <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>Operations Monitoring</span>
              <ChevronRight size={14} />
              <span>Asset & Hardware Infrastructure</span>
              <ChevronRight size={14} />
              <span className="text-[#00288e]">
                Camera Management & Master Inventory
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-bold tracking-tight lg:text-3xl">
              Camera Management & Master CCTV Hardware Inventory
            </h1>

            <p className="mt-1 max-w-5xl text-sm text-slate-600">
              Comprehensive edge device registry, RTSP stream health,
              optical & thermal sensor calibration, and physical
              mounting directory based on NTPC Korba Annexure-1
              specifications.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ActionButton
              icon={SprayCan}
              loading={busy === "clean"}
              onClick={cleanLens}
            >
              Run Lens Cleaning
            </ActionButton>

            <ActionButton
              icon={RefreshCw}
              loading={busy === "firmware"}
              onClick={firmwareSync}
            >
              Firmware Sync (v4.2.1)
            </ActionButton>

            <ActionButton icon={Download} onClick={exportCSV}>
              Export Inventory (.CSV)
            </ActionButton>

            <ActionButton
              primary
              icon={Plus}
              onClick={() => setShowAdd(true)}
            >
              Add Camera Node
            </ActionButton>
          </div>
        </section>

        {/* KPI */}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <KPI
            icon={Camera}
            title="Provisioned Nodes"
            value="60 / 60"
            text="100% Optical & AI Edge Online"
            progress={100}
            success
          />

          <KPI
            icon={Zap}
            title="Edge Stream Latency"
            value="18.4 ms"
            text="99.82% Uptime (60 FPS RTSP)"
            progress={98}
          />

          <KPI
            icon={Sparkles}
            title="Lens & Airblast Health"
            value="58 / 60"
            text="2 Scheduled for Air Blast"
            progress={96.6}
            warning
          />

          <KPI
            icon={Cpu}
            title="AI Inference Engine"
            value="v4.2.1-edge"
            text="TensorRT 10.2 • 60 Synced"
            progress={100}
          />

          <KPI
            icon={ShieldCheck}
            title="Vendor & Contract"
            value="SCORE IT / SITL"
            text="PO: 5500035402 • Active"
            progress={100}
            success
          />
        </section>

        {/* INFRASTRUCTURE */}

        <section className="flex flex-col justify-between gap-4 rounded-xl bg-[#eff4ff] p-4 shadow-sm lg:flex-row lg:items-center">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1e40af] text-white">
              <ShieldCheck size={20} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold">
                  NTPC Korba STPS Master Compliance & Server
                  Infrastructure
                </h2>

                <span className="rounded-full bg-[#d3e4fe] px-2 py-1 text-[10px] font-bold text-[#00288e]">
                  MOM: 11.01.2021
                </span>
              </div>

              <p className="mt-1 max-w-5xl text-xs leading-5 text-slate-600">
                2nos 42U Server Racks operational at CHP Control Room.
                Dual Raw AC & redundant 230V UPS feeds verified for all
                Junction Boxes. Division 1 Coal Dust explosion-proof
                enclosures rated.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 gap-6 text-right">
            <div>
              <p className="text-[10px] text-slate-400">
                Network Backbone
              </p>
              <p className="text-xs font-bold">
                10 Gbps Single-Mode OFC
              </p>
            </div>

            <div className="border-l border-blue-200 pl-6">
              <p className="text-[10px] text-slate-400">
                Storage Retention
              </p>
              <p className="text-xs font-bold text-[#006c4a]">
                45 Days RAID-6 (94.2 TB)
              </p>
            </div>
          </div>
        </section>

        {/* SEARCH / FILTER */}

        <section className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex flex-col justify-between gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-3 top-2.5 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg bg-[#eff4ff] pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#00288e]"
                placeholder="Search by Camera Tag, Tender No, Junction Box, IP, or Location..."
              />
            </div>

            <div className="flex w-fit rounded-lg bg-[#eff4ff] p-1">
              <ViewButton
                active={view === "table"}
                icon={List}
                onClick={() => setView("table")}
              >
                Detailed Table
              </ViewButton>

              <ViewButton
                active={view === "grid"}
                icon={Grid2X2}
                onClick={() => setView("grid")}
              >
                Hardware Cards
              </ViewButton>

              <ViewButton
                active={view === "rack"}
                icon={Server}
                onClick={() => setView("rack")}
              >
                Rack & Switch
              </ViewButton>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect
              label="Sub-Plant Sector"
              value={sector}
              onChange={setSector}
              options={[
                ["all", "All Plant Sectors (60 Nodes)"],
                ["hopper", "Track Hopper Yards"],
                ["crusher", "Crusher House #1 & #2"],
                ["conveyor", "Conveyor Galleries"],
                ["bunker", "Bunker Floors Units 1-6"],
                ["yard", "Coal Stockyard"],
              ]}
            />

            <FilterSelect
              label="Camera Sensor Type"
              value={hardware}
              onChange={setHardware}
              options={[
                ["all", "All Hardware Architectures"],
                ["thermal", "Dual Thermal + Optical FLIR PTZ"],
                ["explosion", "Explosion-Proof PTZ"],
                ["optical", "Heavy-Duty Optical PTZ"],
                ["highmast", "Long-Range High-Mast PTZ"],
              ]}
            />

            <FilterSelect
              label="Mounting Specification"
              value={mount}
              onChange={setMount}
              options={[
                ["all", "All Rig & Mount Types"],
                ["Existing", "Existing Structure & Angle"],
                ["Wall", "Wall & Angle Required"],
                ["Pole", "Heavy Pole Mount"],
              ]}
            />

            <FilterSelect
              label="Stream & Health Triage"
              value={health}
              onChange={setHealth}
              options={[
                ["all", "All Operational States"],
                ["critical", "Active Critical Hazards"],
                ["warning", "Active Safety Warnings"],
                ["normal", "Normal Operating Streams"],
                ["maintenance", "Airblast Maintenance Due"],
              ]}
            />

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#e5eeff] text-xs font-bold hover:bg-[#dce9ff]"
              >
                <RotateCcw size={15} />
                Reset Filters
              </button>
            </div>
          </div>
        </section>

        {/* CONTENT */}

        <section className="grid grid-cols-1 items-start gap-4 xl:grid-cols-12">
          <div className="xl:col-span-8">
            {view === "table" && (
              <CameraTable
                cameras={filtered}
                selected={selected}
                onSelect={setSelected}
                onPTZ={openPTZ}
                onCalibrate={calibrate}
                onRestart={restartStream}
                busy={busy}
              />
            )}

            {view === "grid" && (
              <CameraGrid
                cameras={filtered}
                selected={selected}
                onSelect={setSelected}
                onPTZ={openPTZ}
              />
            )}

            {view === "rack" && <RackView cameras={filtered} />}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
              <span>
                Showing {filtered.length} inventory records • Master
                registry contains 60 nodes
              </span>

              <span className="font-medium">
                Annexure-1 Physical Verification
              </span>
            </div>
          </div>

          <div className="xl:col-span-4">
            <InspectionPanel
              camera={selected}
              busy={busy}
              onPTZ={openPTZ}
              onCalibrate={calibrate}
              onRestart={restartStream}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   TABLE
========================================================= */

function CameraTable({
  cameras,
  selected,
  onSelect,
  onPTZ,
  onCalibrate,
  onRestart,
  busy,
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="bg-[#eff4ff] text-[10px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Node ID</th>
              <th className="px-4 py-3">Location & Area of Interest</th>
              <th className="px-4 py-3">Hardware Specification</th>
              <th className="px-4 py-3">Mount / Rig</th>
              <th className="px-4 py-3">IP & JB</th>
              <th className="px-4 py-3">Lens & Stream</th>
              <th className="px-4 py-3 text-right">
                Quick Diagnostics
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e5eeff]">
            {cameras.map((cam) => (
              <tr
                key={cam.id}
                onClick={() => onSelect(cam)}
                className={`cursor-pointer transition hover:bg-[#eff4ff] ${
                  selected?.id === cam.id ? "bg-blue-50" : ""
                } ${
                  cam.state === "critical" ? "bg-red-50/60" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <StatusDot state={cam.state} />

                    <div>
                      <p className="text-xs font-bold">{cam.id}</p>
                      <p className="text-[10px] text-slate-400">
                        Tender #{cam.tenderNo}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <p className="max-w-[210px] truncate text-xs font-semibold">
                    {cam.location}
                  </p>

                  <p className="mt-0.5 max-w-[210px] truncate text-[11px] text-slate-500">
                    {cam.area}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <span className="whitespace-nowrap rounded-full bg-[#dce9ff] px-2 py-1 text-[10px] font-bold">
                    {cam.hardware}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <p className="text-[11px] font-medium">{cam.mount}</p>
                  <p className="text-[10px] text-slate-400">
                    {cam.mountType}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <p className="font-mono text-[11px] font-medium">
                    {cam.ip}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    {cam.jb} • Port {cam.port}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <div className="w-28">
                    <div className="flex justify-between gap-2 text-[10px]">
                      <span
                        className={`font-bold ${
                          cam.state === "critical"
                            ? "text-red-700"
                            : cam.state === "warning"
                            ? "text-[#700006]"
                            : "text-[#006c4a]"
                        }`}
                      >
                        {cam.telemetry}
                      </span>

                      <span>{cam.confidence}%</span>
                    </div>

                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#e5eeff]">
                      <div
                        className={`h-full ${
                          cam.state === "critical"
                            ? "bg-red-600"
                            : cam.state === "maintenance"
                            ? "bg-slate-500"
                            : "bg-[#006c4a]"
                        }`}
                        style={{ width: `${cam.confidence}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div
                    className="flex justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconButton
                      title="Open PTZ"
                      icon={Radio}
                      onClick={() => onPTZ(cam)}
                    />

                    <IconButton
                      title="Calibrate"
                      icon={Settings2}
                      loading={busy === `calibrate-${cam.id}`}
                      onClick={() => onCalibrate(cam)}
                    />

                    <IconButton
                      title="Restart Stream"
                      icon={RefreshCw}
                      loading={busy === `restart-${cam.id}`}
                      onClick={() => onRestart(cam)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!cameras.length && (
        <div className="p-12 text-center">
          <Search size={36} className="mx-auto text-slate-300" />
          <h3 className="mt-3 font-bold">No camera nodes found</h3>
          <p className="mt-1 text-xs text-slate-500">
            Change your inventory filters.
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   GRID
========================================================= */

function CameraGrid({ cameras, selected, onSelect, onPTZ }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {cameras.map((cam) => (
        <button
          key={cam.id}
          onClick={() => onSelect(cam)}
          className={`rounded-xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 ${
            selected?.id === cam.id
              ? "ring-2 ring-[#00288e]"
              : ""
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-2">
              <StatusDot state={cam.state} />

              <div>
                <p className="text-sm font-bold">{cam.id}</p>
                <p className="text-[10px] text-slate-400">
                  Tender #{cam.tenderNo}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#eff4ff] px-2 py-1 text-[10px] font-bold">
              {cam.confidence}%
            </span>
          </div>

          <h3 className="mt-4 font-bold">{cam.location}</h3>
          <p className="mt-1 text-xs text-slate-500">{cam.area}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <MiniInfo label="Hardware" value={cam.hardware} />
            <MiniInfo label="Mount" value={cam.mount} />
            <MiniInfo label="IP Address" value={cam.ip} />
            <MiniInfo label="Junction Box" value={cam.jb} />
          </div>

          <div className="mt-4 flex justify-between border-t border-blue-50 pt-3">
            <span className="text-xs font-bold text-[#006c4a]">
              {cam.telemetry}
            </span>

            <span
              onClick={(e) => {
                e.stopPropagation();
                onPTZ(cam);
              }}
              className="text-xs font-bold text-[#00288e]"
            >
              Open Camera →
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

/* =========================================================
   RACK VIEW
========================================================= */

function RackView({ cameras }) {
  const groups = [
    {
      name: "CHP Control Room • Rack A",
      subnet: "10.14.82.0/26",
      cams: cameras.slice(0, Math.ceil(cameras.length / 2)),
    },
    {
      name: "CHP Control Room • Rack B",
      subnet: "10.14.82.64/26",
      cams: cameras.slice(Math.ceil(cameras.length / 2)),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {groups.map((rack) => (
        <div
          key={rack.name}
          className="rounded-xl bg-[#213145] p-4 text-white shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">{rack.name}</p>
              <p className="mt-1 font-mono text-[10px] text-blue-200">
                {rack.subnet}
              </p>
            </div>

            <Server size={24} />
          </div>

          <div className="mt-4 space-y-2">
            {rack.cams.map((cam, index) => (
              <div
                key={cam.id}
                className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Network size={15} />

                  <div>
                    <p className="text-xs font-bold">
                      SW-{String(index + 1).padStart(2, "0")} •{" "}
                      {cam.id}
                    </p>
                    <p className="font-mono text-[10px] text-blue-200">
                      {cam.ip}:{cam.port}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-emerald-300">
                  LINK UP
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   INSPECTION PANEL
========================================================= */

function InspectionPanel({
  camera,
  busy,
  onPTZ,
  onCalibrate,
  onRestart,
}) {
  if (!camera) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        Select a camera node.
      </div>
    );
  }

  return (
    <div className="sticky top-20 overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="bg-[#213145] p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-200">
              Live Diagnostics Inspection
            </p>

            <h2 className="mt-1 text-xl font-bold">{camera.id}</h2>
          </div>

          <StatusBadge state={camera.state} />
        </div>

        <div className="mt-4 flex h-40 items-center justify-center rounded-lg border border-white/10 bg-black/20">
          <div className="text-center">
            <Camera size={42} className="mx-auto text-blue-200" />
            <p className="mt-2 text-xs font-bold">{camera.location}</p>
            <p className="mt-1 text-[10px] text-blue-200">
              RTSP Diagnostic Preview
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <Diagnostic
            label="Tender No."
            value={`#${camera.tenderNo}`}
          />

          <Diagnostic label="Lens Health" value={`${camera.lens}%`} />
          <Diagnostic label="IP Address" value={camera.ip} mono />
          <Diagnostic label="RTSP Port" value={camera.port} mono />
          <Diagnostic label="Junction Box" value={camera.jb} />
          <Diagnostic label="Mount" value={camera.mount} />
        </div>

        <div className="mt-4 rounded-lg bg-[#eff4ff] p-3">
          <p className="text-[10px] font-bold uppercase text-slate-400">
            Hardware
          </p>

          <p className="mt-1 text-sm font-bold">{camera.hardware}</p>

          <p className="mt-1 text-xs text-slate-500">
            {camera.mountType}
          </p>
        </div>

        <div className="mt-3 rounded-lg bg-[#eff4ff] p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">
              Stream Confidence
            </span>

            <span className="font-mono text-xs">
              {camera.confidence}%
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#d3e4fe]">
            <div
              className="h-full bg-[#006c4a]"
              style={{ width: `${camera.confidence}%` }}
            />
          </div>

          <p className="mt-2 text-[10px] text-slate-500">
            {camera.telemetry}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <PanelButton
            icon={Radio}
            label="PTZ"
            onClick={() => onPTZ(camera)}
          />

          <PanelButton
            icon={Settings2}
            label="Calibrate"
            loading={busy === `calibrate-${camera.id}`}
            onClick={() => onCalibrate(camera)}
          />

          <PanelButton
            icon={RefreshCw}
            label="Restart"
            loading={busy === `restart-${camera.id}`}
            onClick={() => onRestart(camera)}
          />
        </div>

        <button
          onClick={() => onPTZ(camera)}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#00288e] text-xs font-bold text-white hover:bg-blue-800"
        >
          <Eye size={16} />
          Open Live Camera / PTZ
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   ADD CAMERA MODAL
========================================================= */

function AddCameraModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    id: "",
    tenderNo: "",
    location: "",
    area: "",
    ip: "",
  });

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.id.trim() ||
      !form.tenderNo ||
      !form.location.trim() ||
      !form.ip.trim()
    ) {
      return;
    }

    onAdd({
      id: form.id.toUpperCase(),
      tenderNo: Number(form.tenderNo),
      location: form.location,
      area: form.area || "Newly provisioned camera location",
      hardware: "Heavy Duty PTZ",
      hardwareGroup: "optical",
      mount: "Existing Structure",
      mountType: "Existing Structure & Angle Required",
      ip: form.ip,
      jb: "Unassigned",
      port: 554,
      state: "normal",
      telemetry: "Provisioned",
      confidence: 100,
      lens: 100,
    });
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-[#00288e]">
              Hardware Provisioning
            </p>

            <h2 className="text-xl font-bold">Add Camera Node</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <ModalField
            label="Camera Tag"
            placeholder="CAM 60"
            value={form.id}
            onChange={(value) =>
              setForm((old) => ({ ...old, id: value }))
            }
          />

          <ModalField
            label="Tender No."
            type="number"
            placeholder="60"
            value={form.tenderNo}
            onChange={(value) =>
              setForm((old) => ({ ...old, tenderNo: value }))
            }
          />

          <div className="col-span-2">
            <ModalField
              label="Location"
              placeholder="Track Hopper 02"
              value={form.location}
              onChange={(value) =>
                setForm((old) => ({ ...old, location: value }))
              }
            />
          </div>

          <div className="col-span-2">
            <ModalField
              label="Area of Interest"
              placeholder="Coal train unloading pit area"
              value={form.area}
              onChange={(value) =>
                setForm((old) => ({ ...old, area: value }))
              }
            />
          </div>

          <div className="col-span-2">
            <ModalField
              label="IP Address"
              placeholder="10.14.82.160"
              value={form.ip}
              onChange={(value) =>
                setForm((old) => ({ ...old, ip: value }))
              }
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#eff4ff] px-4 py-2 text-xs font-bold"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#00288e] px-4 py-2 text-xs font-bold text-white"
          >
            <Plus size={15} />
            Provision Node
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   UI HELPERS
========================================================= */

function KPI({
  icon: Icon,
  title,
  value,
  text,
  progress,
  success,
  warning,
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#dce9ff] text-[#00288e]">
          <Icon size={17} />
        </div>
      </div>

      <p className="mt-2 truncate text-xl font-bold">{value}</p>

      <p
        className={`mt-1 truncate text-[10px] font-semibold ${
          warning
            ? "text-[#700006]"
            : success
            ? "text-[#006c4a]"
            : "text-slate-500"
        }`}
      >
        {text}
      </p>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e5eeff]">
        <div
          className={`h-full ${
            success ? "bg-[#006c4a]" : "bg-[#00288e]"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  children,
  onClick,
  primary,
  loading,
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex h-10 items-center gap-2 rounded-lg px-3 text-xs font-bold shadow-sm transition disabled:opacity-60 ${
        primary
          ? "bg-[#00288e] text-white hover:bg-blue-800"
          : "bg-white text-slate-700 hover:bg-[#e5eeff]"
      }`}
    >
      <Icon
        size={16}
        className={loading ? "animate-spin" : ""}
      />
      {children}
    </button>
  );
}

function ViewButton({
  active,
  icon: Icon,
  children,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
        active
          ? "bg-white text-[#00288e] shadow-sm"
          : "text-slate-500"
      }`}
    >
      <Icon size={15} />
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label>
      <span className="mb-1 block text-[10px] font-bold text-slate-400">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border-0 bg-[#eff4ff] px-2 text-xs outline-none focus:ring-2 focus:ring-[#00288e]"
      >
        {options.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusDot({ state }) {
  const styles = {
    critical: "bg-red-600 animate-pulse",
    warning: "bg-[#9b000d]",
    maintenance: "bg-slate-500",
    normal: "bg-[#006c4a]",
  };

  return (
    <span
      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
        styles[state] || styles.normal
      }`}
    />
  );
}

function StatusBadge({ state }) {
  const label = {
    critical: "CRITICAL",
    warning: "WARNING",
    maintenance: "MAINTENANCE",
    normal: "OPERATIONAL",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-[9px] font-bold ${
        state === "critical"
          ? "bg-red-600 text-white"
          : state === "warning"
          ? "bg-red-100 text-red-800"
          : state === "maintenance"
          ? "bg-slate-200 text-slate-800"
          : "bg-emerald-100 text-emerald-800"
      }`}
    >
      {label[state]}
    </span>
  );
}

function IconButton({
  icon: Icon,
  onClick,
  title,
  loading,
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={loading}
      className="rounded-lg p-2 text-slate-500 transition hover:bg-[#dce9ff] hover:text-[#00288e] disabled:opacity-50"
    >
      <Icon
        size={16}
        className={loading ? "animate-spin" : ""}
      />
    </button>
  );
}

function PanelButton({
  icon: Icon,
  label,
  onClick,
  loading,
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex flex-col items-center justify-center gap-1 rounded-lg bg-[#eff4ff] px-2 py-3 text-[10px] font-bold hover:bg-[#dce9ff]"
    >
      <Icon
        size={17}
        className={`text-[#00288e] ${
          loading ? "animate-spin" : ""
        }`}
      />
      {label}
    </button>
  );
}

function Diagnostic({ label, value, mono }) {
  return (
    <div className="rounded-lg bg-[#eff4ff] p-2.5">
      <p className="text-[9px] font-bold uppercase text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-xs font-bold ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-lg bg-[#eff4ff] p-2">
      <p className="text-[9px] uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-[11px] font-semibold">
        {value}
      </p>
    </div>
  );
}

function ModalField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg bg-[#eff4ff] px-3 text-sm outline-none focus:ring-2 focus:ring-[#00288e]"
      />
    </label>
  );
}

function Toast({ title, message, onClose }) {
  return (
    <div className="fixed right-5 top-20 z-[300] w-[350px] max-w-[calc(100%-40px)] rounded-xl border border-blue-100 bg-white p-4 shadow-2xl">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#006c4a]">
          <CheckCircle2 size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="ml-auto h-fit rounded p-1 text-slate-400 hover:bg-slate-100"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}