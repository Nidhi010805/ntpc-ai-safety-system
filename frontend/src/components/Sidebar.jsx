import {
  LayoutDashboard,
  Video,
  BellRing,
  HardHat,
  Flame,
  Accessibility,
  Zap,
  Factory,
  UserRoundX,
  Map,
  BarChart3,
  FileText,
  Camera,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Live Monitoring", icon: Video, path: "/live-monitoring" },
  { name: "Alerts", icon: BellRing, path: "/alerts" },
  { name: "PPE Detection", icon: HardHat, path: "/ppe-detection" },
  { name: "Fire Safety", icon: Flame, path: "/fire-safety" },
  {
    name: "Harness Monitoring",
    icon: Accessibility,
    path: "/harness-monitoring",
  },
  {
    name: "Switchyard Safety",
    icon: Zap,
    path: "/switchyard-safety",
  },
  { name: "Ash Handling", icon: Factory, path: "/ash-handling" },
  {
    name: "Fallen Person",
    icon: UserRoundX,
    path: "/fallen-person",
  },
  { name: "Zone Map", icon: Map, path: "/zone-map" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Reports", icon: FileText, path: "/reports" },
];

const bottomItems = [
  { name: "Cameras", icon: Camera, path: "/cameras" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

function Sidebar() {
  const MenuItem = ({ item }) => {
    const Icon = item.icon;

    return (
      <NavLink
        to={item.path}
        end={item.path === "/"}
        className={({ isActive }) =>
          `
            flex w-full items-center gap-3
            rounded-md px-3 py-2.5
            text-left
            transition-all duration-200

            ${
              isActive
                ? "border-r-2 border-sky-300 bg-[#252b2e] text-sky-300"
                : "text-[#bdc8d1] hover:bg-[#252b2e] hover:text-white"
            }
          `
        }
      >
        <Icon size={18} strokeWidth={1.8} />

        <span className="text-[11px] font-bold uppercase tracking-[0.05em]">
          {item.name}
        </span>
      </NavLink>
    );
  };

  return (
    <aside
      className="
        fixed left-0 top-0 z-50
        hidden h-screen w-[240px]
        flex-col
        border-r border-[#3e484f]
        bg-[#171c20]
        md:flex
      "
    >
      {/* Logo */}
      <div className="px-5 pb-7 pt-6">
        <h1 className="text-[24px] font-bold tracking-tight text-[#7bd0ff]">
          NTPC SAFETY
        </h1>

        <p className="mt-1 text-xs text-[#bdc8d1]">
          Thermal Power Ops
        </p>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem key={item.name} item={item} />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-[#3e484f] px-4 py-4">
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <MenuItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;