import { Bell, ShieldCheck } from "lucide-react";

function Navbar() {
  return (
    <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
      <div>
        <h2 className="font-semibold text-white">
          Safety Operations Dashboard
        </h2>

        <p className="text-xs text-slate-400">
          Thermal Power Station Monitoring
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-sm text-green-400">
          <ShieldCheck size={17} />
          System Online
        </div>

        <button className="relative text-slate-300">
          <Bell size={20} />

          <span className="absolute -right-1 -top-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center font-semibold">
          A
        </div>
      </div>
    </header>
  );
}

export default Navbar;