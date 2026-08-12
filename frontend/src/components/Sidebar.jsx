import {
  LayoutDashboard,
  Video,
  TriangleAlert,
  HardHat,
  Flame,
  ShieldCheck,
  RadioTower,
  CircleDot,
  UserRoundX,
  Map,
  ChartNoAxesCombined,
  FileText,
  Camera,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Live Monitoring", icon: Video },
  { name: "Active Alerts", icon: TriangleAlert },
  { name: "PPE Compliance", icon: HardHat },
  { name: "Fire & Smoke", icon: Flame },
  { name: "Harness Safety", icon: ShieldCheck },
  { name: "Switchyard", icon: RadioTower },
  { name: "Ash Leakage", icon: CircleDot },
  { name: "Fallen Person", icon: UserRoundX },
  { name: "Zone Map", icon: Map },
  { name: "Analytics", icon: ChartNoAxesCombined },
  { name: "Reports", icon: FileText },
  { name: "Cameras", icon: Camera },
  { name: "Settings", icon: Settings },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">
          NTPC Safety
        </h1>

        <p className="text-xs text-slate-400">
          AI Command Center
        </p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition
              ${
                index === 0
                  ? "bg-sky-500/10 text-sky-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;