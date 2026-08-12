import {
  Camera,
  TriangleAlert,
  ShieldAlert,
  HardHat,
} from "lucide-react";

import StatCard from "../components/StatCard";

function Dashboard() {
  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Safety Overview
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Real-time AI safety monitoring across plant cameras
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="Cameras Online"
          value="12"
          subtitle="12 of 12 operational"
          icon={Camera}
          color="green"
        />

        <StatCard
          title="Active Alerts"
          value="06"
          subtitle="Requires attention"
          icon={TriangleAlert}
          color="amber"
        />

        <StatCard
          title="Critical Events"
          value="02"
          subtitle="Immediate action required"
          icon={ShieldAlert}
          color="red"
        />

        <StatCard
          title="PPE Compliance"
          value="94.2%"
          subtitle="Today's compliance"
          icon={HardHat}
          color="sky"
        />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">

          <div className="flex justify-between">
            <h2 className="font-semibold">
              Live Monitoring
            </h2>

            <button className="text-sm text-sky-400">
              View All Cameras
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">

            {[1, 2, 3, 4].map((camera) => (
              <div
                key={camera}
                className="relative h-48 bg-black rounded-lg overflow-hidden"
              >

                <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-xs">
                  CAM {String(camera).padStart(2, "0")}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 text-green-400 text-xs">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  LIVE
                </div>

                <div className="h-full flex items-center justify-center text-slate-600">
                  CCTV Stream
                </div>

              </div>
            ))}

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="font-semibold">
            Active Alerts
          </h2>

          <div className="space-y-3 mt-4">

            <div className="border border-red-900 bg-red-950/40 rounded-lg p-3">
              <p className="text-red-400 text-sm font-semibold">
                FIRE DETECTED
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Camera 07 · Conveyor Gallery B
              </p>

              <p className="text-xs text-slate-500 mt-2">
                Confidence: 93%
              </p>
            </div>

            <div className="border border-amber-900 bg-amber-950/30 rounded-lg p-3">
              <p className="text-amber-400 text-sm font-semibold">
                HELMET NOT DETECTED
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Camera 12 · Turbine Hall
              </p>

              <p className="text-xs text-slate-500 mt-2">
                Priority: HIGH
              </p>
            </div>

            <div className="border border-red-900 bg-red-950/40 rounded-lg p-3">
              <p className="text-red-400 text-sm font-semibold">
                FALLEN PERSON
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Camera 31 · Cable Gallery C
              </p>

              <p className="text-xs text-slate-500 mt-2">
                Priority: EMERGENCY
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;