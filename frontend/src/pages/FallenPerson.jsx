onst FallenPerson = () => {
  return (
    <div className="min-h-screen bg-[#0f1418] text-[#dee3e8] md:ml-[240px]">
      {/* TOP NAVBAR */}

      <nav
        className="
          fixed right-0 top-0 z-40
          flex h-16 w-full
          items-center justify-between
          border-b border-[#3e484f]
          bg-[#1b2024]
          px-4
          md:w-[calc(100%-240px)]
          lg:px-6
        "
      >
        {/* Plant Name */}

        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-[#dee3e8] sm:text-base md:text-lg">
            <span className="sm:hidden">NTPC TPS</span>

            <span className="hidden sm:inline">
              NTPC Thermal Power Station
            </span>
          </h1>
        </div>

        {/* Right Controls */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* Shift + System */}

          <div className="hidden items-center gap-4 text-sm text-[#bdc8d1] lg:flex">
            <span>Shift A: 06:00-14:00</span>

            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#4ae176]" />
              System: Operational
            </span>
          </div>

          {/* Notification */}

          <button
            type="button"
            aria-label="Notifications"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded
              text-[#bdc8d1]
              transition-colors
              hover:bg-[#303539]
              hover:text-[#8ed5ff]
            "
          >
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>
          </button>

          {/* Profile */}

          <div
            className="
              h-8 w-8
              overflow-hidden
              rounded-full
              border border-[#3e484f]
              bg-[#303539]
            "
          >
            <img
              alt="Operator Profile"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFpHAHLFmMvlmz2c4AJPScxLI5kg5Ty4anBTzzOr1rMuyHV-HTAC8_2Jy_VteErgN4yYHBBiqEYiN4AQuFJs0Fpsl7bhVD-QYB-Tgbb_a0f4zxLFKzUXcNajI4ZDRIHE7o2ZcWtAQvexViBu9S9RlFLxNC3l93Y51xT2XOeV_w8cZKXH4WDIB3kC6aC0YVTJ0hQUcmwwULU07PA58RyaTUfbw_5qqkRDUkEd_xBfsQiCxMlWthjag"
            />
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}

      <main
        className="
          min-h-screen
          px-4 pb-6 pt-[88px]
          sm:px-5
          lg:px-6
        "
      >
        {/* PAGE HEADER */}

        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h2
                className="
                  text-[22px]
                  font-bold
                  leading-8
                  tracking-[-0.02em]
                  text-[#dee3e8]
                  sm:text-[26px]
                "
              >
                Fallen Person Detection
              </h2>

              <span
                className="
                  rounded
                  border border-[#3e484f]
                  bg-[#303539]
                  px-1.5 py-0.5
                  text-[10px]
                  font-bold
                  tracking-[0.05em]
                  text-[#bdc8d1]
                "
              >
                MODULE M6
              </span>
            </div>

            <p className="text-sm text-[#bdc8d1]">
              Pose geometry fused with ground-plane coordinates — plant-wide
              track monitoring
            </p>
          </div>

          {/* Roster cross-check status */}

          <div className="flex items-center gap-2 text-xs text-[#87929a]">
            <span className="material-symbols-outlined text-[16px] text-[#4ae176]">
              verified_user
            </span>
            Permit-to-work roster synced · 06:02
          </div>
        </header>

        {/* KPI CARDS */}

        <section
          className="
            mb-4
            grid grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-5
          "
        >
          <KpiCard
            title="Active Fallen Events"
            value="01"
            icon="person_off"
            critical
          />

          <KpiCard
            title="Tracks Monitored"
            value="24"
            icon="group"
            iconColor="text-[#8ed5ff]"
          />

          <KpiCard
            title="Confirmed Recall"
            value="93.4%"
            icon="target"
            iconColor="text-[#4ae176]"
          />

          <KpiCard
            title="Avg. Confirm Time"
            value="5.2s"
            icon="timer"
            iconColor="text-[#ffc176]"
            valueColor="text-[#ffc176]"
          />

          <KpiCard
            title="False Alarms (24h)"
            value="01"
            icon="rule"
            iconColor="text-[#4ae176]"
          />
        </section>

        {/* LIVE FEED + ACTIVE ALERTS */}

        <section
          className="
            mb-4
            flex flex-col
            gap-4
            xl:h-[420px]
            xl:flex-row
          "
        >
          {/* LIVE FEED WITH POSE OVERLAY */}

          <div
            className="
              flex min-h-[420px] flex-col
              rounded
              border border-[#3e484f]
              bg-[#1b2024]
              p-4
              xl:min-h-0
              xl:w-[62%]
            "
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#dee3e8]">
                  CAM-31 · Cable Gallery C
                </h3>

                <p className="mt-0.5 text-[11px] text-[#87929a]">
                  17-keypoint skeleton · torso angle from vertical: 71°
                </p>
              </div>

              <span
                className="
                  flex items-center gap-1.5
                  rounded-full
                  bg-[#93000a]
                  px-2.5 py-1
                  text-[11px]
                  font-bold
                  tracking-[0.03em]
                  text-[#ffdad6]
                "
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffdad6]" />
                FALLEN · 6s
              </span>
            </div>

            <PoseCameraFeed />

            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-[#87929a] sm:grid-cols-4">
              <FeedStat label="Grid Cell" value="E4–F5" />
              <FeedStat label="Ground Speed" value="0.02 m/s" />
              <FeedStat label="Nearest Walkway" value="1.8 m" />
              <FeedStat label="Confidence" value="91%" />
            </div>
          </div>

          {/* ACTIVE FALLEN ALERTS */}

          <aside
            className="
              flex min-h-[300px] flex-col
              overflow-hidden
              rounded
              border border-[#3e484f]
              bg-[#1b2024]
              xl:min-h-0
              xl:w-[38%]
            "
          >
            <div
              className="
                flex items-center justify-between
                border-b border-[#3e484f]
                p-4
              "
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-[#dee3e8]">
                  Escalation Queue
                </h3>

                <span
                  className="
                    rounded-full
                    bg-[#93000a]
                    px-2 py-0.5
                    text-[10px]
                    font-bold
                    text-[#ffdad6]
                  "
                >
                  01
                </span>
              </div>

              <span className="text-[11px] text-[#87929a]">L1 → L2 at 2m</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <ul className="flex flex-col gap-2">
                <EscalationCard
                  track="TRK-0847"
                  title="EMERGENCY: Fallen Person"
                  detail="Cable Gallery C • CAM-31 • Grid E4-F5"
                  meta="Unmatched to roster — lone-worker flag SET"
                  stage="L1 dispatched"
                  eta="Ack in 00:41"
                  type="critical"
                />

                <EscalationCard
                  track="TRK-0812"
                  title="Cleared: Crouched (working)"
                  detail="Turbine Hall Gate-3 • CAM-12 • Grid B2"
                  meta="Matched — R. Kumar, Fitter, active permit"
                  stage="Auto-resolved"
                  eta="12m ago"
                  type="resolved"
                />

                <EscalationCard
                  track="TRK-0779"
                  title="WARN: Occlusion — voting suspended"
                  detail="Boiler-2 Platform • CAM-19 • Grid C6"
                  meta="< 60% torso key points visible"
                  stage="Monitoring"
                  eta="26m ago"
                  type="warning"
                />
              </ul>
            </div>
          </aside>
        </section>

        {/* GROUND-PLANE MAP + TRACK TABLE */}

        <section className="flex flex-col gap-4 xl:flex-row">
          {/* STATION GROUND-PLANE MAP */}

          <div
            className="
              flex flex-col
              rounded
              border border-[#3e484f]
              bg-[#1b2024]
              p-4
              xl:w-[38%]
            "
          >
            <h3 className="mb-1 text-lg font-semibold text-[#dee3e8]">
              Ground-Plane Location
            </h3>

            <p className="mb-3 text-[11px] text-[#87929a]">
              Foot point projected through preset homography onto the plant
              grid
            </p>

            <StationGridMap />

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#87929a]">
              <LegendDot color="bg-[#ffb4ab]" label="Fallen" />
              <LegendDot color="bg-[#ffc176]" label="Crouched / working" />
              <LegendDot color="bg-[#4ae176]" label="Standing" />
            </div>
          </div>

          {/* TRACK TABLE */}

          <div
            className="
              flex-1
              overflow-hidden
              rounded
              border border-[#3e484f]
              bg-[#1b2024]
            "
          >
            <div className="border-b border-[#3e484f] p-4">
              <h3 className="text-lg font-semibold text-[#dee3e8]">
                Person Tracks
              </h3>

              <p className="mt-0.5 text-[11px] text-[#87929a]">
                Three-state classification over a 32-frame (≈3.2 s) window
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#3e484f] text-[11px] uppercase tracking-[0.04em] text-[#87929a]">
                    <th className="px-4 py-2 font-semibold">Track</th>
                    <th className="px-4 py-2 font-semibold">Zone / Camera</th>
                    <th className="px-4 py-2 font-semibold">Grid</th>
                    <th className="px-4 py-2 font-semibold">State</th>
                    <th className="px-4 py-2 font-semibold">Duration</th>
                    <th className="px-4 py-2 font-semibold">Roster</th>
                  </tr>
                </thead>

                <tbody>
                  <TrackRow
                    track="TRK-0847"
                    zone="Cable Gallery C"
                    camera="CAM-31"
                    grid="E4-F5"
                    state="FALLEN"
                    duration="6s"
                    roster="Unmatched"
                    rosterOk={false}
                  />

                  <TrackRow
                    track="TRK-0812"
                    zone="Turbine Hall Gate-3"
                    camera="CAM-12"
                    grid="B2"
                    state="CROUCHED"
                    duration="41s"
                    roster="R. Kumar"
                    rosterOk
                  />

                  <TrackRow
                    track="TRK-0779"
                    zone="Boiler-2 Platform"
                    camera="CAM-19"
                    grid="C6"
                    state="OCCLUDED"
                    duration="—"
                    roster="N/A"
                    rosterOk
                    muted
                  />

                  <TrackRow
                    track="TRK-0801"
                    zone="Loading Dock"
                    camera="CAM-12"
                    grid="B1"
                    state="STANDING"
                    duration="2m 10s"
                    roster="S. Rao"
                    rosterOk
                  />
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

/* KPI CARD */

function KpiCard({
  title,
  value,
  icon,
  iconColor = "text-[#4ae176]",
  valueColor = "text-[#dee3e8]",
  critical = false,
}) {
  return (
    <article
      className={`
        rounded
        border
        p-4
        transition-colors
        duration-200

        ${
          critical
            ? "border-[#93000a] bg-[#93000a]/10"
            : "border-[#3e484f] bg-[#1b2024] hover:border-[#87929a]"
        }
      `}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span
          className={`
            text-[11px]
            font-bold
            uppercase
            tracking-[0.05em]

            ${critical ? "text-[#ffb4ab]" : "text-[#bdc8d1]"}
          `}
        >
          {title}
        </span>

        <span
          className={`
            material-symbols-outlined
            shrink-0
            text-[22px]

            ${critical ? "text-[#ffb4ab]" : iconColor}
          `}
        >
          {icon}
        </span>
      </div>

      <div
        className={`
          text-xl
          font-semibold

          ${critical ? "text-[#ffb4ab]" : valueColor}
        `}
      >
        {value}
      </div>
    </article>
  );
}

/* POSE CAMERA FEED (skeleton overlay on live feed) */

function PoseCameraFeed() {
  return (
    <div
      className="
        relative
        min-h-[260px]
        flex-1
        overflow-hidden
        rounded
        border border-[#ffb4ab]
        bg-black
      "
    >
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvMErUqtrbDsNuxVB087NvpUsDlkuWhr5yeYhoS5NGh7W2ZruxwO5tqTpvdmUebaDQpmEvFRtS3avgy0_JOPSfoT7AMl8EHy8rA5p-S63QUxg5YhJFliZzDKQHqkMDbTIKgh39IoDq9gu-iFWkOeqhBeS6H7Vf1VZEJ8ZSgC4g65gDx7g6MJiXhUWceU2JKSqdnnUskq4P1MibndAFwOwZWFwiOLaGd_Aa8t-XPnJk9cRPDN_XyMo"
        alt="CAM-31 Cable Gallery C feed"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />

      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-t
          from-black/75
          via-transparent
          to-black/20
        "
      />

      {/* Skeleton overlay */}

      <svg
        viewBox="0 0 300 200"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <g
          stroke="#ffb4ab"
          strokeWidth="2"
          fill="#ffb4ab"
          opacity="0.9"
        >
          {/* prone skeleton — near-horizontal torso */}
          <line x1="90" y1="130" x2="130" y2="120" />
          <line x1="130" y1="120" x2="175" y2="118" />
          <line x1="175" y1="118" x2="210" y2="112" />
          <line x1="130" y1="120" x2="140" y2="105" />
          <line x1="140" y1="105" x2="120" y2="95" />
          <line x1="175" y1="118" x2="185" y2="103" />
          <line x1="185" y1="103" x2="175" y2="88" />

          <circle cx="90" cy="130" r="4" />
          <circle cx="130" cy="120" r="4" />
          <circle cx="175" cy="118" r="4" />
          <circle cx="210" cy="112" r="4" />
          <circle cx="140" cy="105" r="3.5" />
          <circle cx="120" cy="95" r="3.5" />
          <circle cx="185" cy="103" r="3.5" />
          <circle cx="175" cy="88" r="3.5" />
        </g>

        <rect
          x="78"
          y="82"
          width="140"
          height="58"
          rx="4"
          fill="none"
          stroke="#ffb4ab"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        <text x="80" y="76" fill="#ffb4ab" fontSize="11" fontFamily="monospace">
          TRK-0847 · fallen 0.91
        </text>
      </svg>

      <div className="absolute left-2 top-2">
        <span className="block h-2 w-2 animate-pulse rounded-full bg-[#ffb4ab]" />
      </div>
    </div>
  );
}

/* FEED STAT */

function FeedStat({ label, value }) {
  return (
    <div className="rounded border border-[#3e484f] bg-[#0f1418] px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-[0.04em] text-[#87929a]">
        {label}
      </div>
      <div className="mt-0.5 text-xs font-medium text-[#dee3e8]">{value}</div>
    </div>
  );
}

/* ESCALATION CARD */

function EscalationCard({ track, title, detail, meta, stage, eta, type }) {
  const styles = {
    critical: {
      wrap: "border-[#93000a] bg-[#93000a]/10 hover:bg-[#93000a]/20",
      title: "text-[#ffb4ab]",
      icon: "warning",
      iconColor: "text-[#ffb4ab]",
    },
    warning: {
      wrap: "border-[#ffc176]/30 bg-[#f1a02b]/10 hover:bg-[#f1a02b]/15",
      title: "text-[#ffc176]",
      icon: "visibility_off",
      iconColor: "text-[#ffc176]",
    },
    resolved: {
      wrap: "border-[#3e484f] bg-[#141a1e] hover:border-[#87929a]",
      title: "text-[#bdc8d1]",
      icon: "check_circle",
      iconColor: "text-[#4ae176]",
    },
  }[type];

  return (
    <li className={`flex items-start gap-3 rounded border p-3 transition-colors ${styles.wrap}`}>
      <span className={`material-symbols-outlined mt-0.5 shrink-0 text-[21px] ${styles.iconColor}`}>
        {styles.icon}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className={`break-words font-mono text-[13px] font-medium ${styles.title}`}>
            {title}
          </div>
          <span className="shrink-0 text-[10px] text-[#87929a]">{track}</span>
        </div>

        <div className="mt-1 break-words text-xs text-[#bdc8d1]">{detail}</div>
        <div className="mt-0.5 break-words text-[11px] text-[#87929a]">{meta}</div>

        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-[#87929a]">{stage}</span>
          <span className="text-[#87929a]">{eta}</span>
        </div>
      </div>
    </li>
  );
}

/* STATION GRID MAP */

function StationGridMap() {
  const cols = ["A", "B", "C", "D", "E", "F"];
  const rows = [1, 2, 3, 4, 5, 6];
  const cellW = 40;
  const cellH = 30;

  const tracks = [
    { id: "TRK-0847", x: 4.5, y: 4, color: "#ffb4ab", pulse: true },
    { id: "TRK-0812", x: 1.5, y: 2, color: "#ffc176", pulse: false },
    { id: "TRK-0801", x: 1, y: 1, color: "#4ae176", pulse: false },
  ];

  return (
    <div className="overflow-hidden rounded border border-[#3e484f] bg-[#0f1418] p-2">
      <svg viewBox={`0 0 ${cols.length * cellW} ${rows.length * cellH}`} className="h-auto w-full">
        {/* zone blocks */}
        <rect x={0} y={0} width={cellW * 2} height={cellH * 2} fill="#1b2024" />
        <rect x={cellW * 3} y={cellH * 3} width={cellW * 3} height={cellH * 3} fill="#1b2024" />

        {/* grid lines */}
        {cols.map((_, i) => (
          <line
            key={`c-${i}`}
            x1={i * cellW}
            y1={0}
            x2={i * cellW}
            y2={rows.length * cellH}
            stroke="#3e484f"
            strokeWidth="1"
          />
        ))}
        {rows.map((_, i) => (
          <line
            key={`r-${i}`}
            x1={0}
            y1={i * cellH}
            x2={cols.length * cellW}
            y2={i * cellH}
            stroke="#3e484f"
            strokeWidth="1"
          />
        ))}

        {/* cell labels */}
        {cols.map((c, i) => (
          <text key={c} x={i * cellW + 4} y={12} fill="#87929a" fontSize="8" fontFamily="monospace">
            {c}
          </text>
        ))}
        {rows.map((r, i) => (
          <text key={r} x={2} y={i * cellH + cellH - 4} fill="#87929a" fontSize="8" fontFamily="monospace">
            {r}
          </text>
        ))}

        <text x={8} y={cellH + 14} fill="#bdc8d1" fontSize="9" fontFamily="monospace">
          Turbine Hall
        </text>
        <text x={cellW * 3 + 8} y={cellH * 4 + 14} fill="#bdc8d1" fontSize="9" fontFamily="monospace">
          Cable Gallery C
        </text>

        {/* track markers */}
        {tracks.map((t) => (
          <g key={t.id}>
            {t.pulse && (
              <circle
                cx={t.x * cellW}
                cy={t.y * cellH}
                r="9"
                fill={t.color}
                opacity="0.35"
              >
                <animate attributeName="r" values="6;12;6" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.05;0.5" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={t.x * cellW} cy={t.y * cellH} r="4.5" fill={t.color} stroke="#0f1418" strokeWidth="1.5" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* LEGEND DOT */

function LegendDot({ color, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

/* TRACK TABLE ROW */

function TrackRow({ track, zone, camera, grid, state, duration, roster, rosterOk, muted = false }) {
  const stateStyles = {
    FALLEN: "text-[#ffb4ab]",
    CROUCHED: "text-[#ffc176]",
    STANDING: "text-[#4ae176]",
    OCCLUDED: "text-[#87929a]",
  };

  return (
    <tr className={`border-b border-[#3e484f] last:border-0 ${muted ? "opacity-60" : ""}`}>
      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[12px] text-[#bdc8d1]">
        {track}
      </td>
      <td className="px-4 py-2.5 text-[#dee3e8]">
        <div className="text-sm">{zone}</div>
        <div className="text-[11px] text-[#87929a]">{camera}</div>
      </td>
      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[12px] text-[#bdc8d1]">
        {grid}
      </td>
      <td className={`whitespace-nowrap px-4 py-2.5 text-[12px] font-bold tracking-[0.03em] ${stateStyles[state]}`}>
        {state}
      </td>
      <td className="whitespace-nowrap px-4 py-2.5 text-sm text-[#bdc8d1]">
        {duration}
      </td>
      <td className="whitespace-nowrap px-4 py-2.5 text-sm">
        <span className={rosterOk ? "text-[#bdc8d1]" : "text-[#ffc176]"}>
          {roster}
        </span>
      </td>
    </tr>
  );
}

export default FallenPerson;
