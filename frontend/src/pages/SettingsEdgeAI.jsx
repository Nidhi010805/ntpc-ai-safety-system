import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  Check,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Download,
  Flame,
  Gauge,
  HardHat,
  Play,
  RefreshCw,
  RotateCcw,
  Save,
  Server,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Thermometer,
  UserRoundX,
  Waves,
  X,
  Zap,
} from "lucide-react";

const DEFAULTS = {
  helmet: 88,
  harness: 92,
  incursion: 85,
  immobility: 80,
  immobilityTimeout: 45,
  vest: 82,
  tempWarn: 75,
  tempEmergency: 120,
  gradient: 2.5,
  dust: 75,
};

const STREAMS = [
  {
    value: "hopper",
    camera: "CAM-12",
    name: "Track Hopper 02",
    type: "Dual Thermal PTZ",
    fps: 60,
    temp: 182,
  },
  {
    value: "conveyor",
    camera: "CAM-04",
    name: "Conveyor 2 A/B DE",
    type: "Explosion-Proof PTZ",
    fps: 50,
    temp: 76,
  },
  {
    value: "bunker",
    camera: "CAM-34",
    name: "Unit 6 Bunker 17 B",
    type: "Explosion-Proof PTZ",
    fps: 50,
    temp: 61,
  },
];

const FLEET = [
  ["Crusher House #1", "12 Edge Nodes • Orin NX"],
  ["Track Hoppers 01 & 02", "10 Edge Nodes • Thermal PTZ"],
  ["Conveyor Galleries (1A-6B)", "24 Edge Nodes • Belt Scanners"],
  ["Bunker Floors Unit 5 & 6", "8 Edge Nodes • Explosion Proof"],
  ["Coal Stockyard Poles P1–P3", "6 Edge Nodes • Solar Hybrid"],
];

export default function SettingsEdgeAI() {
  const [config, setConfig] = useState(DEFAULTS);

  const [highSensitivity, setHighSensitivity] = useState(false);

  const [interlocks, setInterlocks] = useState({
    deluge: true,
    klaxon: true,
    conveyor: true,
    night: true,
  });

  const [stream, setStream] = useState("hopper");
  const [running, setRunning] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(100);
  const [deployText, setDeployText] = useState("100% Up to Date");

  const [execution, setExecution] = useState(16.8);
  const [vram, setVram] = useState(1.4);

  const [toast, setToast] = useState(null);

  const currentStream = useMemo(
    () => STREAMS.find((item) => item.value === stream) || STREAMS[0],
    [stream]
  );

  const update = (key, value) => {
    setConfig((old) => ({
      ...old,
      [key]: Number(value),
    }));
  };

  const notify = (title, message) => {
    setToast({ title, message });

    window.setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const resetDefaults = () => {
    setConfig(DEFAULTS);

    notify(
      "Calibration Reset",
      "Factory baseline parameters restored across all detection pipelines."
    );
  };

  const exportConfig = () => {
    const payload = {
      cluster: "THERMAL_PLANT_UNIT_1_6",
      timestamp: new Date().toISOString(),
      operator: "Operator Ramesh V.",
      safetyMode: highSensitivity
        ? "HIGH_SENSITIVITY_OUTAGE"
        : "SHIFT_B_NORMAL",

      models: {
        safety_helmet_min_conf: `${config.helmet}%`,
        fall_arrest_harness_min_conf: `${config.harness}%`,
        incursion_min_conf: `${config.incursion}%`,
        worker_immobility_conf: `${config.immobility}%`,
        immobility_timeout_sec: config.immobilityTimeout,
        vest_footwear_conf: `${config.vest}%`,
      },

      thermal: {
        warning_temp_c: config.tempWarn,
        emergency_trip_c: config.tempEmergency,
        thermal_gradient_c_per_sec: config.gradient,
        dust_suppression_percent: config.dust,
      },

      interlocks,
    };

    const blob = new Blob(
      [JSON.stringify(payload, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `heightx_edge_calibration_${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);

    notify(
      "Config Exported",
      "Edge AI calibration configuration downloaded successfully."
    );
  };

  const deploy = () => {
    if (deploying) return;

    setDeploying(true);
    setDeployProgress(30);
    setDeployText("Broadcasting Weights...");

    window.setTimeout(() => {
      setDeployProgress(75);
      setDeployText("Optimizing Engine 45/60...");
    }, 650);

    window.setTimeout(() => {
      setDeployProgress(100);
      setDeployText("100% Up to Date");
      setDeploying(false);

      notify(
        "Deployment Complete",
        "Updated calibration weights synchronized to all 60 simulated edge nodes."
      );
    }, 1500);
  };

  const runInference = () => {
    if (running) return;

    setRunning(true);

    window.setTimeout(() => {
      const ms = Number((15.2 + Math.random() * 3.4).toFixed(1));
      const memory = Number((1.35 + Math.random() * 0.18).toFixed(2));

      setExecution(ms);
      setVram(memory);
      setRunning(false);

      notify(
        "Inference Passed",
        "Test frame completed with the current calibration thresholds."
      );
    }, 600);
  };

  const toggleInterlock = (key, title) => {
    const next = !interlocks[key];

    setInterlocks((old) => ({
      ...old,
      [key]: next,
    }));

    notify(
      `${title} ${next ? "Armed" : "Disarmed"}`,
      next
        ? "Safety relay circuit is active in this frontend simulation."
        : "Interlock isolated in this frontend simulation."
    );
  };

  const passedObjects =
    Number(96.4 >= config.helmet) +
    Number(91.2 >= config.harness) +
    Number(currentStream.temp >= config.tempWarn);

  return (
    <div className="min-h-full bg-[#f8f9ff] text-[#0b1c30]">
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mx-auto flex w-full max-w-[1900px] flex-col gap-4">

        {/* HEADER */}

        <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>Operations Monitoring</span>
              <ChevronRight size={14} />
              <span>System Administration</span>
              <ChevronRight size={14} />
              <span className="text-[#00288e]">
                Settings & Edge AI Calibration
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span className="h-7 w-2.5 rounded-sm bg-[#00288e]" />

              <h1 className="text-2xl font-bold tracking-tight">
                Settings & Edge AI Calibration
              </h1>

              <span className="flex items-center gap-1.5 rounded-full bg-[#e5eeff] px-2.5 py-1 text-[10px] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#006c4a]" />
                Cluster Sync: Optimal
              </span>
            </div>

            <p className="mt-1 max-w-5xl text-sm text-slate-600">
              Configure edge neural network inference thresholds,
              thermal sensor trigger rules, automated emergency
              interlocks, and plant alert dispatch matrices across all
              60 industrial compute nodes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ActionButton
              icon={RotateCcw}
              onClick={resetDefaults}
            >
              Reset Defaults
            </ActionButton>

            <ActionButton
              icon={Download}
              onClick={exportConfig}
            >
              Export Config (.JSON)
            </ActionButton>

            <ActionButton
              primary
              icon={deploying ? RefreshCw : Save}
              loading={deploying}
              onClick={deploy}
            >
              {deploying
                ? "Broadcasting to 60 Nodes..."
                : "Save & Deploy to 60 Nodes"}
            </ActionButton>
          </div>
        </section>

        {/* TABS */}

        <section className="flex gap-1 overflow-x-auto pb-1">
          <Tab active icon={Cpu}>
            Edge AI & Vision Models
          </Tab>

          <Tab icon={Thermometer}>
            Thermal & Pyrogenic Thresholds
          </Tab>

          <Tab icon={Zap}>
            Automated Interlocks & Alarms
          </Tab>

          <Tab icon={BellRing}>
            Dispatch & Notification Matrix
          </Tab>

          <Tab icon={Server}>
            Storage & Encryption
          </Tab>

          <Tab icon={Cpu}>
            Server Racks & Edge Hardware
          </Tab>
        </section>

        {/* METRICS */}

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Metric
            title="Inference Runtime"
            icon={Cpu}
            value="TensorRT 10.2"
            footer="Active on 60/60 Orin NX"
            success
          />

          <Metric
            title="Global Pipeline Latency"
            icon={Gauge}
            value={`${execution} ms`}
            footer="SLA Target: < 35.0 ms"
          />

          <Metric
            title="False Positive Rate"
            icon={CheckCircle2}
            value="0.84%"
            footer="Statutory Threshold: < 1.0%"
            success
          />

          <Metric
            title="Active Vision Engine"
            icon={SlidersHorizontal}
            value="YOLOv8-Safety-v4.2.1-FP16"
            footer="SHA: d81a79f...3e92b"
            small
          />

          <div className="rounded-xl bg-[#eff4ff] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Cluster Safety Mode
              </p>

              <RefreshCw size={17} className="text-[#00288e]" />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs font-bold">
                {highSensitivity
                  ? "Outage High-Sensitivity"
                  : "Shift B Normal"}
              </p>

              <Switch
                checked={highSensitivity}
                onChange={() =>
                  setHighSensitivity((old) => !old)
                }
              />
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              {highSensitivity
                ? "High-sensitivity outage monitoring enabled"
                : "Switch to High-Sensitivity Outage Mode"}
            </p>
          </div>
        </section>

        {/* MAIN */}

        <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">

          {/* LEFT */}

          <div className="flex flex-col gap-5 xl:col-span-8">

            {/* PPE */}

            <Panel
              icon={HardHat}
              title="PPE & Edge Vision Confidence Thresholds"
              subtitle="Calibrate minimum bounding box classification confidences before raising alert records."
              badge="5 Model Heuristics"
            >
              <Threshold
                title="Hardhat / Safety Helmet Detection"
                description="Detects standard IS 2925 industrial helmets with mandatory chin strap verification across conveyor tunnels, crusher houses, and boiler bunker floors."
                value={config.helmet}
                min={50}
                max={99}
                onChange={(v) => update("helmet", v)}
                badge="Balanced High-Precision"
              />

              <Threshold
                title="High-Elevation Fall Arrest Harness (+2.0m Grade)"
                description="Enforces full body safety harnesses, static line hook-ups, and double-lanyard anchor points above +2.0m grade."
                value={config.harness}
                min={50}
                max={99}
                onChange={(v) => update("harness", v)}
                badge="Strict Safety Critical"
                danger
              />

              <Threshold
                title="Restricted Machinery Incursion & Optical Tripwires"
                description="Monitors virtual perimeter polygons around rotating machinery and high-speed conveyor return pulleys."
                value={config.incursion}
                min={50}
                max={99}
                onChange={(v) => update("incursion", v)}
                badge="Instant Interlock"
              />

              <div className="rounded-xl bg-[#eff4ff] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <UserRoundX
                      size={19}
                      className="text-[#700006]"
                    />

                    <p className="text-sm font-bold">
                      Worker Immobility & Man-Down Detection
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      Window:{" "}
                      <b className="text-slate-800">
                        {config.immobilityTimeout}s
                      </b>
                    </span>

                    <span className="rounded-full bg-[#82f5c1] px-2 py-1 text-[10px] font-bold">
                      Balanced High-Precision
                    </span>

                    <span className="font-bold text-[#00288e]">
                      {config.immobility}%
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Tracks horizontal posture and stationary skeleton
                  keypoints to detect unconsciousness or asphyxiation
                  in confined bunker spaces.
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <SliderField
                    label="Confidence Threshold"
                    value={config.immobility}
                    suffix="%"
                    min={50}
                    max={99}
                    onChange={(v) =>
                      update("immobility", v)
                    }
                  />

                  <SliderField
                    label="Sustained Immobility Timeout"
                    value={config.immobilityTimeout}
                    suffix=" Seconds"
                    min={10}
                    max={120}
                    step={5}
                    onChange={(v) =>
                      update("immobilityTimeout", v)
                    }
                  />
                </div>
              </div>

              <Threshold
                title="Steel-Toe Footwear & High-Vis Class-3 Vest"
                description="Optical reflection and retroreflective tape checks for track hopper and coal yard personnel."
                value={config.vest}
                min={50}
                max={99}
                onChange={(v) => update("vest", v)}
                badge="Balanced High-Precision"
              />
            </Panel>

            {/* THERMAL */}

            <Panel
              icon={Flame}
              danger
              title="Thermal & Pyrogenic Anomaly Sensitivity (CHP Systems)"
              subtitle="Calibrate infrared radiometry, conveyor spontaneous combustion triggers, and coal dust compensation."
              badge="Radiometric Calibration"
            >
              <div className="rounded-xl bg-[#eff4ff] p-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      size={18}
                      className="text-[#ba1a1a]"
                    />

                    <p className="text-sm font-bold">
                      Pre-Combustion Thermal Hotspot Alert & Trip
                      Levels
                    </p>
                  </div>

                  <span className="rounded bg-[#e5eeff] px-2 py-1 text-[10px] font-bold text-slate-500">
                    Dual Stage Trigger
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Radiometric cameras calculate calibrated blackbody
                  emission temperatures on coal layer surfaces across
                  conveyor systems.
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <ThermalControl
                    title="Warning Threshold (Alert Only)"
                    value={config.tempWarn}
                    min={40}
                    max={100}
                    suffix="°C"
                    onChange={(value) => {
                      const next = Math.min(
                        Number(value),
                        config.tempEmergency - 10
                      );

                      update("tempWarn", next);
                    }}
                    footer={`Safe Margin: ${
                      config.tempEmergency - config.tempWarn
                    }°C`}
                  />

                  <ThermalControl
                    title="Level 1 Emergency (Deluge Armed)"
                    value={config.tempEmergency}
                    min={90}
                    max={150}
                    suffix="°C"
                    danger
                    onChange={(value) => {
                      const next = Math.max(
                        Number(value),
                        config.tempWarn + 10
                      );

                      update("tempEmergency", next);
                    }}
                    footer="SIL-2 Hard Limit"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-[#eff4ff] p-4">
                  <div className="flex justify-between gap-2">
                    <p className="text-sm font-bold">
                      Rapid Thermal Gradient (ΔT / sec)
                    </p>

                    <span className="font-bold text-[#ba1a1a]">
                      +{config.gradient.toFixed(1)}°C/s
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Triggers fast flare alert when localized
                    temperature rises rapidly.
                  </p>

                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={config.gradient}
                    onChange={(e) =>
                      update("gradient", e.target.value)
                    }
                    className="mt-4 w-full accent-[#ba1a1a]"
                  />

                  <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                    <span>+0.5°C/sec</span>
                    <span>+5.0°C/sec</span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#eff4ff] p-4">
                  <div className="flex justify-between gap-2">
                    <p className="text-sm font-bold">
                      Dense Coal Dust & Steam Filter
                    </p>

                    <span className="font-bold text-[#006c4a]">
                      {dustLabel(config.dust)} ({config.dust}%)
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Suppresses false smoke classifications caused by
                    dense coal dust and steam venting.
                  </p>

                  <input
                    type="range"
                    min="10"
                    max="95"
                    value={config.dust}
                    onChange={(e) =>
                      update("dust", e.target.value)
                    }
                    className="mt-4 w-full accent-[#006c4a]"
                  />

                  <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                    <span>Low (High Alerts)</span>
                    <span>Maximum Suppression</span>
                  </div>
                </div>
              </div>
            </Panel>

            {/* INTERLOCKS */}

            <Panel
              icon={Zap}
              title="Automated Hardware Interlocks & Plant Controls"
              subtitle="Safety-critical relay bridges tied into plant SCADA & PLC emergency networks."
              badge="SIL-2 Verified Relay"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <Interlock
                  icon={Waves}
                  title="Automated Chute Deluge Water Interlock"
                  description="Actuates high-pressure water mist upon sustained >120°C hotspot."
                  status={
                    interlocks.deluge
                      ? "30s Operator Override Grace Window • ARMED"
                      : "Relay isolated • DISARMED"
                  }
                  checked={interlocks.deluge}
                  onChange={() =>
                    toggleInterlock(
                      "deluge",
                      "Deluge Water Actuator"
                    )
                  }
                />

                <Interlock
                  icon={Siren}
                  title="Zonal Emergency Klaxon & PA Broadcast"
                  description="Fires localized strobe beacons and dual-language Hindi/English warnings."
                  status={
                    interlocks.klaxon
                      ? "102dB Horn Test Passed • ACTIVE"
                      : "Horn relay isolated • INACTIVE"
                  }
                  checked={interlocks.klaxon}
                  onChange={() =>
                    toggleInterlock(
                      "klaxon",
                      "Acoustic Klaxon & PA"
                    )
                  }
                />

                <Interlock
                  icon={Zap}
                  title="Conveyor Emergency Motor Trip"
                  description="Triggers configured conveyor emergency-stop relay when critical hazard persists."
                  status={
                    interlocks.conveyor
                      ? "PLC relay heartbeat verified • ARMED"
                      : "Motor trip isolated • DISARMED"
                  }
                  checked={interlocks.conveyor}
                  onChange={() =>
                    toggleInterlock(
                      "conveyor",
                      "Conveyor Motor Trip"
                    )
                  }
                />

                <Interlock
                  icon={BellRing}
                  title="Night Shift Autonomous Dispatch Daemon"
                  description="Automatically dispatches critical night-shift events to the configured safety escalation chain."
                  status={
                    interlocks.night
                      ? "Active 22:00–06:00 IST • DAEMON READY"
                      : "Inactive • DAEMON PAUSED"
                  }
                  checked={interlocks.night}
                  onChange={() =>
                    toggleInterlock(
                      "night",
                      "Autonomous Night Dispatcher"
                    )
                  }
                />
              </div>
            </Panel>
          </div>

          {/* RIGHT */}

          <aside className="flex flex-col gap-5 xl:col-span-4">

            {/* SIMULATOR */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">
                    Edge Simulator & Tester
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Live threshold gate simulation
                  </p>
                </div>

                <Cpu size={20} className="text-[#00288e]" />
              </div>

              <label className="mt-4 block">
                <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
                  Test Camera Stream
                </span>

                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="h-10 w-full rounded-lg bg-[#eff4ff] px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#00288e]"
                >
                  {STREAMS.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.camera.replace("-", " ")} •{" "}
                      {item.name} ({item.type})
                    </option>
                  ))}
                </select>
              </label>

              <div className="relative mt-3 h-[330px] overflow-hidden rounded-xl bg-[#213145]">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-700 to-slate-950" />

                {running && (
                  <div className="absolute inset-x-0 top-0 z-10 h-1 animate-pulse bg-blue-400 shadow-[0_0_25px_8px_rgba(96,165,250,.4)]" />
                )}

                <div className="absolute left-2 right-2 top-2 flex items-center justify-between rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    <span>{currentStream.camera} [REC]</span>
                    <span className="text-white/40">|</span>
                    <span>
                      1080p @ {currentStream.fps}FPS
                    </span>
                  </div>

                  <span>TensorRT FP16</span>
                </div>

                {/* hardhat */}

                <div
                  className={`absolute left-10 top-16 h-36 w-24 border-2 ${
                    96.4 >= config.helmet
                      ? "border-emerald-400"
                      : "border-slate-500"
                  }`}
                >
                  <span
                    className={`absolute -top-5 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-bold text-white ${
                      96.4 >= config.helmet
                        ? "bg-emerald-600"
                        : "bg-slate-600"
                    }`}
                  >
                    HARDHAT 96.4%
                  </span>
                </div>

                {/* harness */}

                <div
                  className={`absolute right-10 top-24 h-40 w-28 border-2 ${
                    91.2 >= config.harness
                      ? "border-red-500"
                      : "border-slate-500"
                  }`}
                >
                  <span
                    className={`absolute -top-5 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-bold text-white ${
                      91.2 >= config.harness
                        ? "bg-red-600"
                        : "bg-slate-600"
                    }`}
                  >
                    NO HARNESS 91.2%
                  </span>

                  <span className="absolute -bottom-4 right-0 rounded bg-black/80 px-1 font-mono text-[8px] text-white">
                    Elev +4.2m
                  </span>
                </div>

                {/* thermal */}

                <div
                  className={`absolute bottom-14 left-1/3 flex h-14 w-24 items-center justify-center border-2 border-dashed ${
                    currentStream.temp >= config.tempWarn
                      ? "border-red-500 bg-red-500/20"
                      : "border-emerald-400 bg-emerald-500/10"
                  }`}
                >
                  <span className="rounded bg-red-700 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                    HOTSPOT {currentStream.temp}°C
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex justify-between rounded bg-black/70 p-2 font-mono text-[9px] text-white">
                  <span>
                    <span className="text-emerald-300">
                      Threshold Gate:
                    </span>{" "}
                    {config.helmet}% ({passedObjects}/3 objects)
                  </span>

                  <span className="text-white/50">
                    {highSensitivity
                      ? "HIGH SENSITIVITY"
                      : "NORMAL"}
                  </span>
                </div>
              </div>

              <button
                onClick={runInference}
                disabled={running}
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#e5eeff] text-xs font-bold transition hover:bg-[#dce9ff] disabled:opacity-60"
              >
                {running ? (
                  <RefreshCw
                    size={17}
                    className="animate-spin text-[#00288e]"
                  />
                ) : (
                  <Play
                    size={17}
                    className="text-[#00288e]"
                  />
                )}

                {running
                  ? "Running TensorRT Inference..."
                  : "Run Test Frame Inference"}
              </button>

              <div className="mt-3 flex flex-wrap justify-between gap-2 px-2 text-[10px] text-slate-500">
                <span>
                  Execution:{" "}
                  <b className="font-mono text-slate-800">
                    {execution} ms
                  </b>
                </span>

                <span>
                  VRAM:{" "}
                  <b className="font-mono text-slate-800">
                    {vram} GB / 8.0 GB
                  </b>
                </span>

                <span>
                  Batch:{" "}
                  <b className="font-mono text-slate-800">1</b>
                </span>
              </div>
            </div>

            {/* FLEET */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      deploying
                        ? "animate-pulse bg-blue-500"
                        : "bg-[#006c4a]"
                    }`}
                  />

                  <h3 className="font-bold">
                    Edge Fleet Synchronization
                  </h3>
                </div>

                <span className="text-sm font-bold text-[#006c4a]">
                  {deployProgress === 100
                    ? "60 / 60 Synced"
                    : "Syncing..."}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">
                    Firmware & Weights Parity
                  </span>

                  <span className="font-bold text-[#006c4a]">
                    {deployText}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#d3e4fe]">
                  <div
                    className="h-full rounded-full bg-[#006c4a] transition-all duration-700"
                    style={{
                      width: `${deployProgress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {FLEET.map(([title, subtitle]) => (
                  <div
                    key={title}
                    className="flex items-center justify-between rounded-lg bg-[#eff4ff] p-2.5"
                  >
                    <div>
                      <p className="text-xs font-bold">
                        {title}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded bg-white px-2 py-1 font-mono text-[9px]">
                        v4.2.1
                      </span>

                      <CheckCircle2
                        size={17}
                        className="text-[#006c4a]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-3 rounded-xl bg-[#eff4ff] p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#00288e] shadow-sm">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold">
                    NTPC Korba Annexure-1 Compliant
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    Edge AI calibration parameters validated under
                    CEA Safety Standard 2024.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function Panel({
  icon: Icon,
  title,
  subtitle,
  badge,
  children,
  danger,
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              danger
                ? "bg-[#ffdad6] text-[#ba1a1a]"
                : "bg-[#dde1ff] text-[#00288e]"
            }`}
          >
            <Icon size={18} />
          </div>

          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-1 text-xs text-slate-600">
              {subtitle}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            danger
              ? "bg-[#ffdad6] text-[#93000a]"
              : "bg-[#e5eeff]"
          }`}
        >
          {badge}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}

function Threshold({
  title,
  description,
  value,
  min,
  max,
  onChange,
  badge,
  danger,
}) {
  return (
    <div className="rounded-xl bg-[#eff4ff] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold">{title}</p>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-bold ${
              danger
                ? "bg-[#ffdad6] text-[#93000a]"
                : "bg-[#82f5c1] text-[#005137]"
            }`}
          >
            {badge}
          </span>

          <span className="font-bold text-[#00288e]">
            {value}%
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-600">
        {description}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-[10px] text-slate-400">
          {min}%
        </span>

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full accent-[#00288e]"
        />

        <span className="text-[10px] text-slate-400">
          {max}%
        </span>
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  suffix,
  min,
  max,
  step = 1,
  onChange,
}) {
  return (
    <div>
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>{label}</span>
        <span className="font-bold text-slate-800">
          {value}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full accent-[#00288e]"
      />
    </div>
  );
}

function ThermalControl({
  title,
  value,
  min,
  max,
  suffix,
  onChange,
  footer,
  danger,
}) {
  return (
    <div className="rounded-lg bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-[10px] font-bold uppercase ${
            danger ? "text-[#ba1a1a]" : "text-slate-500"
          }`}
        >
          {title}
        </p>

        <span
          className={`font-bold ${
            danger ? "text-[#ba1a1a]" : "text-[#00288e]"
          }`}
        >
          {value}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-3 w-full ${
          danger
            ? "accent-[#ba1a1a]"
            : "accent-[#00288e]"
        }`}
      />

      <p
        className={`mt-1 text-right text-[10px] font-semibold ${
          danger ? "text-[#ba1a1a]" : "text-[#00288e]"
        }`}
      >
        {footer}
      </p>
    </div>
  );
}

function Interlock({
  icon: Icon,
  title,
  description,
  status,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-[#eff4ff] p-4">
      <div>
        <div className="flex items-center gap-2">
          <Icon
            size={18}
            className={
              checked
                ? "text-[#00288e]"
                : "text-slate-400"
            }
          />

          <p className="text-sm font-bold">{title}</p>
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-600">
          {description}
        </p>

        <p
          className={`mt-2 text-[10px] font-bold ${
            checked
              ? "text-[#006c4a]"
              : "text-slate-500"
          }`}
        >
          {status}
        </p>
      </div>

      <Switch
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-[#00288e]" : "bg-[#d3e4fe]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function Metric({
  title,
  icon: Icon,
  value,
  footer,
  success,
  small,
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>

        <Icon
          size={18}
          className={
            success
              ? "text-[#006c4a]"
              : "text-[#00288e]"
          }
        />
      </div>

      <p
        className={`mt-3 truncate font-bold ${
          small ? "text-sm" : "text-xl"
        }`}
      >
        {value}
      </p>

      <p
        className={`mt-1 truncate text-[10px] ${
          success
            ? "font-bold text-[#006c4a]"
            : "text-slate-500"
        }`}
      >
        {footer}
      </p>
    </div>
  );
}

function Tab({
  active,
  icon: Icon,
  children,
}) {
  return (
    <button
      className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold shadow-sm ${
        active
          ? "bg-[#00288e] text-white"
          : "bg-white text-slate-600 hover:bg-[#e5eeff]"
      }`}
    >
      <Icon size={16} />
      {children}

      {active && (
        <span className="ml-1 h-2 w-2 rounded-full bg-[#82f5c1]" />
      )}
    </button>
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
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`flex h-10 items-center gap-2 rounded-lg px-4 text-xs font-bold shadow-sm transition disabled:opacity-60 ${
        primary
          ? "bg-[#00288e] text-white hover:bg-[#1e40af]"
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

function Toast({
  title,
  message,
  onClose,
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[300] w-[390px] max-w-[calc(100%-48px)] rounded-xl bg-[#213145] p-4 text-white shadow-2xl">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#006c4a]">
          <Check size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{title}</p>

          <p className="mt-1 text-xs leading-5 text-blue-100">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded p-1 text-blue-100 hover:bg-white/10"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

function dustLabel(value) {
  if (value < 40) return "Low";
  if (value < 70) return "Medium";
  if (value < 88) return "Medium";
  return "High";
}