import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Filter,
  MapPin,
  Radio,
  Search,
  TriangleAlert,
  X,
} from "lucide-react";

const severityStyles = {
  Critical: {
    badge: "border-[#ffb4ab] bg-[#93000a]/20 text-[#ffb4ab]",
    dot: "bg-[#ffb4ab]",
    card: "border-[#93000a] bg-[#93000a]/10",
    icon: "text-[#ffb4ab]",
  },
  High: {
    badge: "border-[#ffc176] bg-[#f1a02b]/10 text-[#ffc176]",
    dot: "bg-[#ffc176]",
    card: "border-[#f1a02b]/50 bg-[#f1a02b]/10",
    icon: "text-[#ffc176]",
  },
  Medium: {
    badge: "border-[#8ed5ff]/50 bg-[#8ed5ff]/10 text-[#8ed5ff]",
    dot: "bg-[#8ed5ff]",
    card: "border-[#8ed5ff]/40 bg-[#8ed5ff]/5",
    icon: "text-[#8ed5ff]",
  },
  Low: {
    badge: "border-[#4ae176]/50 bg-[#4ae176]/10 text-[#4ae176]",
    dot: "bg-[#4ae176]",
    card: "border-[#4ae176]/35 bg-[#4ae176]/5",
    icon: "text-[#4ae176]",
  },
};

function SeverityBadge({ severity }) {
  const style = severityStyles[severity] ?? severityStyles.Low;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {severity}
    </span>
  );
}

function StatusBadge({ status }) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ${
        isActive
          ? "border-[#ffc176]/50 bg-[#f1a02b]/10 text-[#ffc176]"
          : "border-[#4ae176]/40 bg-[#4ae176]/10 text-[#4ae176]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "animate-pulse bg-[#ffc176]" : "bg-[#4ae176]"
        }`}
      />
      {status}
    </span>
  );
}

function MetricCard({ label, value, detail, tone = "default" }) {
  const toneClasses = {
    default: "border-[#3e484f] bg-[#1b2024]",
    warning: "border-[#f1a02b]/50 bg-[#f1a02b]/10",
    critical: "border-[#93000a] bg-[#93000a]/10",
  };

  const valueClasses = {
    default: "text-[#dee3e8]",
    warning: "text-[#ffc176]",
    critical: "text-[#ffb4ab]",
  };

  return (
    <article
      className={`rounded border p-4 ${toneClasses[tone] ?? toneClasses.default}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#bdc8d1]">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold ${valueClasses[tone] ?? valueClasses.default}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-[#87929a]">{detail}</p>
    </article>
  );
}

function EventRow({ event }) {
  return (
    <tr className="border-b border-[#3e484f]/70 last:border-0 hover:bg-[#252b2e]/60">
      <td className="px-4 py-3 align-top">
        <p className="font-mono text-xs font-bold text-[#dee3e8]">{event.id}</p>
        <p className="mt-1 text-xs text-[#87929a]">{event.type}</p>
      </td>
      <td className="px-4 py-3 align-top">
        <SeverityBadge severity={event.severity} />
        <p className="mt-2 max-w-sm text-xs leading-5 text-[#bdc8d1]">
          {event.description}
        </p>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex items-start gap-1.5 text-xs text-[#bdc8d1]">
          <MapPin className="mt-0.5 shrink-0 text-[#8ed5ff]" size={14} />
          <span>{event.location}</span>
        </div>
        <p className="mt-1 pl-5 text-[11px] text-[#87929a]">{event.camera}</p>
      </td>
      <td className="px-4 py-3 align-top">
        <p className="whitespace-nowrap text-xs text-[#dee3e8]">{event.timestamp}</p>
        <p className="mt-1 text-[11px] text-[#87929a]">{event.confidence}% confidence</p>
      </td>
      <td className="px-4 py-3 align-top">
        <StatusBadge status={event.status} />
      </td>
    </tr>
  );
}

function CurrentEventCard({ event }) {
  const style = severityStyles[event.severity] ?? severityStyles.Low;

  return (
    <article className={`rounded border p-4 ${style.card}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className={`mt-0.5 rounded bg-[#0f1418]/40 p-2 ${style.icon}`}>
            <TriangleAlert size={19} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-xs font-bold text-[#dee3e8]">{event.id}</p>
              <SeverityBadge severity={event.severity} />
            </div>
            <p className="mt-2 text-sm font-medium text-[#dee3e8]">{event.description}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#bdc8d1]">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#8ed5ff]" />
                {event.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 size={14} className="text-[#8ed5ff]" />
                {event.timestamp}
              </span>
              <span>{event.confidence}% confidence</span>
            </div>
          </div>
        </div>
        <StatusBadge status={event.status} />
      </div>
    </article>
  );
}

function HazardMonitoringPage({ moduleConfig }) {
  const {
    title,
    subtitle,
    icon: ModuleIcon,
    sourceLabel,
    monitoredZones,
    monitoredFeeds,
    locations,
    events,
  } = moduleConfig;
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");
  const [location, setLocation] = useState("All");

  const activeEvents = useMemo(
    () => events.filter((event) => event.status === "Active"),
    [events],
  );
  const highestSeverity = ["Critical", "High", "Medium", "Low"].find((level) =>
    activeEvents.some((event) => event.severity === level),
  );
  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        [event.id, event.type, event.description, event.location, event.camera]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesSeverity = severity === "All" || event.severity === severity;
      const matchesStatus = status === "All" || event.status === status;
      const matchesLocation = location === "All" || event.location === location;

      return matchesSearch && matchesSeverity && matchesStatus && matchesLocation;
    });
  }, [events, location, search, severity, status]);

  const resetFilters = () => {
    setSearch("");
    setSeverity("All");
    setStatus("All");
    setLocation("All");
  };

  const currentEvents = activeEvents.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0f1418] text-[#dee3e8] md:ml-[240px]">
      <header className="fixed right-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#3e484f] bg-[#1b2024] px-4 md:w-[calc(100%-240px)] lg:px-6">
        <div className="min-w-0">
          <span className="text-base font-semibold md:hidden">NTPC TPS</span>
          <span className="hidden text-lg font-semibold md:block">NTPC Thermal Power Station</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#bdc8d1] sm:gap-4 sm:text-sm">
          <span className="hidden lg:inline">Shift A: 06:00-14:00</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#4ae176]" />
            System: Operational
          </span>
        </div>
      </header>

      <main className="min-h-screen px-4 pb-8 pt-[88px] sm:px-5 lg:px-6">
        <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded border border-[#8ed5ff]/40 bg-[#8ed5ff]/10 p-2 text-[#8ed5ff]">
                <ModuleIcon size={22} />
              </div>
              <div>
                <h1 className="text-[22px] font-bold leading-8 tracking-[-0.02em] sm:text-[26px]">
                  {title}
                </h1>
                <p className="mt-1 text-sm text-[#bdc8d1]">{subtitle}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#87929a]">
            <Radio size={15} className="text-[#4ae176]" />
            {sourceLabel}
          </div>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Overall Status"
            value={highestSeverity ? `${highestSeverity} Risk` : "Normal"}
            detail={highestSeverity ? "Based on active AI detections" : "No active safety events"}
            tone={highestSeverity === "Critical" ? "critical" : highestSeverity ? "warning" : "default"}
          />
          <MetricCard
            label="Active Events"
            value={activeEvents.length}
            detail={`${events.length - activeEvents.length} resolved in event history`}
            tone={activeEvents.some((event) => event.severity === "Critical") ? "critical" : activeEvents.length ? "warning" : "default"}
          />
          <MetricCard
            label="Monitored Zones"
            value={monitoredZones}
            detail="Configured for this hazard module"
          />
          <MetricCard
            label="Monitoring Feeds"
            value={monitoredFeeds}
            detail="Camera and sensor inputs online"
          />
        </section>

        <section className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(290px,1fr)]">
          <div className="rounded border border-[#3e484f] bg-[#1b2024] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <AlertTriangle size={19} className="text-[#ffc176]" />
                  Current Events
                </h2>
                <p className="mt-1 text-xs text-[#87929a]">Live sample detections ready to be replaced by API data</p>
              </div>
              <span className="rounded-full bg-[#93000a] px-2 py-0.5 text-[10px] font-bold text-[#ffdad6]">
                {activeEvents.length} ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => <CurrentEventCard key={event.id} event={event} />)
              ) : (
                <div className="rounded border border-dashed border-[#3e484f] p-6 text-center text-sm text-[#87929a]">
                  No active events in the current data.
                </div>
              )}
            </div>
          </div>

          <aside className="rounded border border-[#3e484f] bg-[#1b2024] p-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Activity size={19} className="text-[#8ed5ff]" />
              Module Health
            </h2>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-center justify-between border-b border-[#3e484f]/70 pb-3">
                <span className="text-[#bdc8d1]">Detection pipeline</span>
                <span className="flex items-center gap-1.5 text-[#4ae176]"><CheckCircle2 size={15} /> Online</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#3e484f]/70 pb-3">
                <span className="text-[#bdc8d1]">Data mode</span>
                <span className="text-[#8ed5ff]">Sample data</span>
              </div>
              <div>
                <p className="mb-2 text-[#bdc8d1]">Coverage locations</p>
                <div className="flex flex-wrap gap-2">
                  {locations.map((item) => (
                    <span key={item} className="rounded bg-[#303539] px-2 py-1 text-[11px] text-[#bdc8d1]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded border border-[#3e484f] bg-[#1b2024]">
          <div className="border-b border-[#3e484f] p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Event History</h2>
                <p className="mt-1 text-xs text-[#87929a]">Search or filter the reusable event data below</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#87929a]">{filteredEvents.length} of {events.length} events</span>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 rounded border border-[#3e484f] px-3 py-2 text-xs text-[#bdc8d1] transition hover:bg-[#303539] hover:text-white"
                >
                  <X size={14} /> Clear filters
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.6fr)_repeat(3,minmax(150px,1fr))]">
              <label className="relative block">
                <span className="sr-only">Search events</span>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87929a]" size={17} />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search ID, location, camera..."
                  className="w-full rounded border border-[#3e484f] bg-[#0f1418] py-2 pl-9 pr-3 text-sm text-[#dee3e8] outline-none placeholder:text-[#87929a] focus:border-[#8ed5ff] focus:ring-1 focus:ring-[#8ed5ff]"
                />
              </label>
              <FilterSelect label="Severity" value={severity} onChange={setSeverity} options={["All", "Critical", "High", "Medium", "Low"]} />
              <FilterSelect label="Status" value={status} onChange={setStatus} options={["All", "Active", "Resolved"]} />
              <FilterSelect label="Location" value={location} onChange={setLocation} options={["All", ...locations]} />
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-[880px] w-full text-left">
                <thead className="bg-[#252b2e] text-[10px] font-bold uppercase tracking-[0.06em] text-[#bdc8d1]">
                  <tr>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Severity & Description</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Detected</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>{filteredEvents.map((event) => <EventRow key={event.id} event={event} />)}</tbody>
              </table>
            </div>
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
              <Search size={28} className="text-[#87929a]" />
              <h3 className="mt-3 font-semibold">No matching events</h3>
              <p className="mt-1 text-sm text-[#87929a]">Try changing your search terms or filters.</p>
            </div>
          )}
        </section>

        <p className="mt-4 text-xs text-[#87929a]">
          Frontend demonstration data only. Replace the module configuration with API data when the AI/backend integration is available.
        </p>
      </main>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#87929a]" size={16} />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded border border-[#3e484f] bg-[#0f1418] py-2 pl-9 pr-3 text-sm text-[#dee3e8] outline-none focus:border-[#8ed5ff] focus:ring-1 focus:ring-[#8ed5ff]"
      >
        {options.map((option) => (
          <option key={option} value={option}>{label}: {option}</option>
        ))}
      </select>
    </label>
  );
}

export default HazardMonitoringPage;
