function StatCard({ title, value, subtitle, icon: Icon, color = "sky" }) {
  const colors = {
    sky: "text-sky-400 bg-sky-500/10",
    red: "text-red-400 bg-red-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    green: "text-green-400 bg-green-500/10",
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h3 className="text-3xl font-bold mt-2 text-white">
            {value}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>

        {Icon && (
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;