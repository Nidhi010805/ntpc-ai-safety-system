import { useMemo, useState } from "react";

const cameras = [
  {
    id: "CAM-042",
    location: "Boiler Area / Level 3",
    zone: "Boiler Area",
    module: "Fire Safety",
    status: "critical",
    fps: "24 FPS",
    time: "10:42:15 UTC",
    alert: "SMOKE 93% CRITICAL",
    icon: "local_fire_department",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAY5oEGqq-Hlb5sTeQyTT7ULxFmOu_ORoKtTg_RAeGDY_vB4idHWJdPCy9Ml-O9Hv13bn6BG1fxBSVvPAOuDOatxQldSCoxOCinmOs5HZpCdzBjpfcLrxh1ZZzZ46nEj4Rbxydp-_hGUw7l457OIJ9OiuPZ1By5ugu92XydPbJr2ToiK53PUeOdZ-QWI-alhQ-xyXoZJtvlbpOlA4xTmnfuA9fos_kUGclnRYJL-p0o4WSJ0TKn2RU",
    box: "top-[30%] left-[40%] w-[25%] h-[35%]",
  },
  {
    id: "CAM-115",
    location: "Turbine Hall / East Wing",
    zone: "Turbine Hall",
    module: "PPE Detection",
    status: "warning",
    fps: "30 FPS",
    time: "10:42:15 UTC",
    alert: "NO HELMET 91% HIGH",
    icon: "engineering",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYlqi3ACzR0T5LqLwV_hn0p-FLhtyENZY60yB4TVnMd_2jTc3faNTrqDuGRKe03IzEvCuFA6UrOPCmNB1NaeyQMwmcYwX-JLOnDI07zo0J_oqFuU0K1O2f_ky_zvOIOTZrD5YnDomY5h04DF1vGYiOYcORqhPf6py9M-qB8kl-rMt71vmIGdbu4z0LdEyHkisqyabTnDlPptXEsr5eOf5pRGivgN-nhFIX0cZbP_0-xB-LwnqoLcE",
    box: "top-[40%] left-[60%] w-[15%] h-[20%]",
  },
  {
    id: "CAM-203",
    location: "Ash Handling / Conveyor B",
    zone: "Ash Handling",
    module: "Fallen Person",
    status: "critical",
    fps: "25 FPS",
    time: "10:42:15 UTC",
    alert: "FALLEN PERSON 96% EMERGENCY",
    icon: "person_off",
    emergency: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEezuw4gwl90-ZwaNk7iXpV6eaWiQx-l0EE4zEWpEFj84CekakgBnbhn9C1qes8jDbv-8Iu0MzY3Utp-Ix3WOCck8cnK7bW_sLon5eLvDZuzOViqezV7ZSJZn5FEj_W3uIlJ81yiLW0fAqvVSgyY5GMGGUtFadTcHlakpWEUhXc4YULN_XxnVTPWFYM7n0_LL2pEgmSIwQ4nlbdo734YxRNbBzFHOQIf6A5mrhwqaA-DxiUAtt4fE",
    box: "top-[60%] left-[20%] w-[40%] h-[30%]",
  },
  {
    id: "CAM-088",
    location: "Switchyard / Yard 1",
    zone: "Switchyard",
    module: "General",
    status: "normal",
    fps: "30 FPS",
    time: "10:42:15 UTC",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYBsPRYJP_oFMXriS_eD3TfR-oQ9Dj7IKbwquqx-rnBG_-NSLpNJqaaGYQhifqp-EjKBV_z_Zw89F_t0TuY_WNpYBn3w7kogCYCyJXQHh6BzGx8r_Jxa2EzM4v4uGRKfF9ZyrafHRAqqJTyYhDRV8MgDOiVI4st3_9zuf7oJ2BTLhXVMjETC87Jh0kIZUW4qRPQp9XinGGsWA7auTnSNZc8HmAYoVXIMtaoXaMYBI3LnotGBlI5Q4",
  },
  {
    id: "CAM-012",
    location: "Coal Yard / Sector A",
    zone: "Coal Yard",
    module: "General",
    status: "normal",
    fps: "15 FPS",
    time: "10:42:15 UTC",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAsKSwK6sjH6fiRScFl3caU8SGkBWDhKu46AO0ETCKxSlPs5El1V6ZpSEY-p8ZGle7m-nQxM-auDAPMgcSBdUNgoIG3o97iij9gNID6iZbAkzNBvcbkN00FrqWFKWtvMtCqgzzg9iVRtFDob_rtpppidqeb0M8koGBudRksar46WlDUeJJVil9Mef1Vz_179GJLPpelGMnbdyVZZnIoRjdLdWAjdRuiTYp6WEiwRDSCs2Od8PGOuBE",
  },
  {
    id: "CAM-018",
    location: "Cooling Tower 2",
    zone: "Cooling Tower",
    module: "General",
    status: "offline",
    fps: "OFFLINE",
    time: "Last: 10:35:02 UTC",
  },
  {
    id: "CAM-155",
    location: "Pump Station / Main",
    zone: "Pump Station",
    module: "General",
    status: "normal",
    fps: "30 FPS",
    time: "10:42:15 UTC",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6xY4ZKJ2eivM3zmgQLu_HzFHAUzNMILDnMjQZ8QisOC4s4zATMeLQGiw3u7HmFhAHkenj7vN1NUl_8KGhH2VtDEAYsFXQom5wkpcyWCQRxdkgH206tFeq3p3PcR4A2eexHk3yHH7ocmziEuWsFezlYwWjpXMUjRS0VyRJzjI619MpLs30JWC4gd371SKS35LrXI5sAfYtBHOZjbX_2JkOR7N4oSWhqD1HE4cwj3a_51uEkKRGqxc",
  },
  {
    id: "CAM-001",
    location: "Control Room / Unit 1",
    zone: "Control Room",
    module: "General",
    status: "normal",
    fps: "30 FPS",
    time: "10:42:15 UTC",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDuJpyTRNTI-fDoWd--_kFXZwyRZjPAqBEAsm2uuus-pioTGUw7riE2aZrh_3l6u7B2hicrRO_NB9tNfaZhTbQFbLPnBzxZ_oey8bcvMgVYn25DPIJ3lNR9X5wzNNCp6WgHFXU6lAqKb0IqMQrxTrkFVIQf4cBw5Jq6hCiDpNAzj9OiaXXFAZUyewe4NZeZzapR_q3W8pg3AufkykrqA_j22SU4IhwK3zu8rWgHzlw8wpOWSMMqOWM",
  },
  {
    id: "CAM-310",
    location: "Perimeter / Gate 4",
    zone: "Perimeter",
    module: "General",
    status: "normal",
    fps: "12 FPS",
    time: "10:42:15 UTC",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwCSmc8HZF8yWrrELVg_he4Jt1BxvoKR0hSkS4EObeI8P7ex9PhVOdzT9kAKPmzVbDGNRhNcK2HQ5GF5MPAd-i4_M1IbuXqiDzPmqz_E9XU_c7wzJxpK-Vo_hXHTcCy7yfc_XOhcyhWzAVQuptqfv04jdRiE7Js1CQLaEfrzPxYmToaZXos_VRO7jnsBxEu0IAF136kRjPr2n262M-YSBTsdhhiAh4cndYhxUkX-JykbRWmX8X3Jw",
  },
];

const LiveMonitoring = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [location, setLocation] = useState("all");
  const [module, setModule] = useState("all");

  const filteredCameras = useMemo(() => {
    return cameras.filter((camera) => {
      const matchesSearch =
        camera.id.toLowerCase().includes(search.toLowerCase()) ||
        camera.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "all" || camera.status === status;

      const matchesLocation =
        location === "all" || camera.zone === location;

      const matchesModule =
        module === "all" || camera.module === module;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLocation &&
        matchesModule
      );
    });
  }, [search, status, location, module]);

  return (
    <div className="min-h-screen bg-[#0f1418] text-[#dee3e8] md:ml-[240px]">
      {/* =====================================================
          TOP NAVBAR
      ====================================================== */}

      <header
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
        <div className="min-w-0">
          <span className="text-base font-semibold text-[#dee3e8] md:hidden">
            NTPC TPS
          </span>

          <span className="hidden text-lg font-semibold text-[#dee3e8] md:block">
            NTPC Thermal Power Station
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-6">
          <div className="hidden items-center gap-4 text-sm text-[#bdc8d1] lg:flex">
            <span>Shift A: 06:00-14:00</span>

            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#4ae176]" />
              System: Operational
            </span>
          </div>

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
            <span className="material-symbols-outlined">
              notifications
            </span>
          </button>

          <div className="h-8 w-8 overflow-hidden rounded-full border border-[#3e484f] bg-[#303539]">
            <img
              alt="Operator Profile"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_7too-ssggGN9x4t60G_67-BGMaJQ7l6YacPEXSntOxErOXwDjnpLvej1uExz2Am9RqNuSBaAqDlzR7arw7M6UeMzBT3zqVD3dELE6i89-3dIuMbntZLhgjtFLeE2xbIdcw6XXa8bZWi32TYvLhlI2QOnPjRkGo2jx_iAHsdPYhofBah31hGNsdsEzw6TuOpiXWDE-vZFjVut_GQ6me9V4JR4lxNWIRuI8ekJ4mK7uPquyzxXhP4"
            />
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className="
          flex min-h-screen flex-col
          gap-6
          px-4 pb-6 pt-[88px]
          sm:px-5
          lg:px-6
        "
      >
        {/* Page Heading */}

        <section>
          <h1 className="text-[22px] font-bold leading-8 tracking-[-0.02em] sm:text-[26px]">
            Live Monitoring
          </h1>

          <p className="mt-1 text-sm text-[#bdc8d1]">
            Monitor real-time CCTV streams and AI safety detections
          </p>
        </section>

        {/* ===================================================
            FILTERS
        ==================================================== */}

        <section
          className="
            flex flex-col
            items-start justify-between
            gap-4
            rounded-lg
            border border-[#3e484f]
            bg-[#1b2024]
            p-4
            xl:flex-row
            xl:items-center
          "
        >
          {/* Search + Selects */}

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap xl:w-auto">
            {/* Search */}

            <div className="relative min-w-0 flex-1 sm:min-w-[200px]">
              <span
                className="
                  material-symbols-outlined
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-[20px]
                  text-[#bdc8d1]
                "
              >
                search
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Camera ID..."
                className="
                  w-full
                  rounded
                  border border-[#3e484f]
                  bg-[#0f1418]
                  py-2 pl-10 pr-3
                  text-sm
                  text-[#dee3e8]
                  outline-none
                  transition
                  placeholder:text-[#87929a]
                  focus:border-[#8ed5ff]
                  focus:ring-1
                  focus:ring-[#8ed5ff]
                "
              />
            </div>

            {/* Status */}

            <FilterSelect
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Status: All</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="normal">Normal</option>
              <option value="offline">Offline</option>
            </FilterSelect>

            {/* Location */}

            <FilterSelect
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="all">Location: All Zones</option>
              <option value="Turbine Hall">Turbine Hall</option>
              <option value="Boiler Area">Boiler Area</option>
              <option value="Switchyard">Switchyard</option>
              <option value="Ash Handling">Ash Handling</option>
            </FilterSelect>

            {/* Module */}

            <FilterSelect
              value={module}
              onChange={(e) => setModule(e.target.value)}
            >
              <option value="all">Module: All</option>
              <option value="PPE Detection">
                PPE Detection
              </option>
              <option value="Fire Safety">
                Fire Safety
              </option>
              <option value="Fallen Person">
                Fallen Person
              </option>
            </FilterSelect>
          </div>

          {/* Status Buttons */}

          <div className="flex w-full flex-wrap gap-2 xl:w-auto">
            <StatusButton
              active={status === "all"}
              onClick={() => setStatus("all")}
            >
              All (248)
            </StatusButton>

            <StatusButton
              active={status === "normal"}
              onClick={() => setStatus("normal")}
            >
              <span className="h-2 w-2 rounded-full bg-[#bdc8d1]" />
              Normal (235)
            </StatusButton>

            <StatusButton
              type="critical"
              active={status === "critical"}
              onClick={() => setStatus("critical")}
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ffb4ab]" />
              Alert (4)
            </StatusButton>

            <StatusButton
              type="warning"
              active={status === "warning"}
              onClick={() => setStatus("warning")}
            >
              <span className="h-2 w-2 rounded-full bg-[#f1a02b]" />
              Warning (6)
            </StatusButton>

            <StatusButton
              active={status === "offline"}
              onClick={() => setStatus("offline")}
            >
              <span className="h-2 w-2 rounded-full bg-[#3e484f]" />
              Offline (3)
            </StatusButton>
          </div>
        </section>

        {/* ===================================================
            CAMERA GRID
        ==================================================== */}

        {filteredCameras.length > 0 ? (
          <section
            className="
              grid
              grid-cols-1
              gap-4
              md:grid-cols-2
              lg:grid-cols-3
            "
          >
            {filteredCameras.map((camera) => (
              <CameraCard
                key={camera.id}
                camera={camera}
              />
            ))}
          </section>
        ) : (
          <div
            className="
              flex min-h-[300px]
              flex-col items-center justify-center
              rounded-lg
              border border-[#3e484f]
              bg-[#1b2024]
              text-center
            "
          >
            <span className="material-symbols-outlined mb-3 text-5xl text-[#87929a]">
              videocam_off
            </span>

            <h3 className="font-semibold text-[#dee3e8]">
              No cameras found
            </h3>

            <p className="mt-1 text-sm text-[#87929a]">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

/* ==========================================================
   CAMERA CARD
========================================================== */

function CameraCard({ camera }) {
  const critical = camera.status === "critical";
  const warning = camera.status === "warning";
  const normal = camera.status === "normal";
  const offline = camera.status === "offline";

  const borderColor = camera.emergency
    ? "border-2 border-[#ffb4ab]"
    : critical
      ? "border-[#ffb4ab]"
      : warning
        ? "border-[#f1a02b]"
        : "border-[#3e484f]";

  return (
    <article
      className={`
        group
        relative
        overflow-hidden
        rounded-lg
        border
        bg-[#1b2024]
        ${borderColor}

        ${
          normal
            ? "transition-colors hover:border-[#8ed5ff]"
            : ""
        }
      `}
    >
      {/* Alert Badge */}

      {camera.alert && (
        <div className="absolute right-2 top-2 z-20 max-w-[calc(100%-16px)]">
          <div
            className={`
              flex items-center
              gap-1
              rounded
              border
              px-2 py-1
              backdrop-blur-sm

              ${
                camera.emergency
                  ? "animate-pulse border-[#ffb4ab] bg-[#ffb4ab] text-[#690005] shadow-lg shadow-red-500/20"
                  : critical
                    ? "border-[#ffb4ab] bg-[#93000a]/80 text-[#ffb4ab]"
                    : "border-[#f1a02b] bg-[#f1a02b]/20 text-[#f1a02b]"
              }
            `}
          >
            <span className="material-symbols-outlined shrink-0 text-[16px]">
              {camera.icon}
            </span>

            <span className="truncate text-[10px] font-extrabold uppercase tracking-[0.05em] sm:text-[11px]">
              {camera.alert}
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          VIDEO
      ====================================================== */}

      <div className="relative aspect-video w-full bg-black">
        {offline ? (
          <OfflineCamera />
        ) : (
          <>
            <img
              src={camera.image}
              alt={`${camera.id} CCTV Feed`}
              className={`
                absolute inset-0
                h-full w-full
                object-cover
                transition-transform
                duration-300
                group-hover:scale-[1.015]

                ${
                  normal
                    ? "opacity-60 grayscale-[20%]"
                    : "opacity-80"
                }
              `}
            />

            {/* Detection Bounding Box */}

            {camera.box && (
              <div
                className={`
                  absolute
                  ${camera.box}

                  ${
                    camera.emergency
                      ? "border-4 border-[#ffb4ab]"
                      : critical
                        ? "animate-pulse border-2 border-dashed border-[#ffb4ab]"
                        : "border-2 border-[#f1a02b]"
                  }
                `}
              />
            )}
          </>
        )}

        {/* Bottom Gradient */}

        <div
          className="
            absolute inset-x-0 bottom-0
            flex items-end justify-between
            gap-3
            bg-gradient-to-t
            from-black/90
            via-black/55
            to-transparent
            p-3 pt-10
          "
        >
          {/* Camera info */}

          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span
                className={`
                  h-2 w-2 shrink-0 rounded-full

                  ${
                    offline
                      ? "bg-[#3e484f]"
                      : critical
                        ? "animate-pulse bg-[#ffb4ab]"
                        : "bg-[#4ae176]"
                  }
                `}
              />

              <span
                className={`
                  truncate
                  font-mono
                  text-[13px]
                  font-bold

                  ${
                    offline
                      ? "text-[#87929a] line-through"
                      : "text-white"
                  }
                `}
              >
                {camera.id}
              </span>
            </div>

            <p
              className={`
                truncate
                text-xs

                ${
                  offline
                    ? "text-[#87929a]"
                    : "text-gray-300"
                }
              `}
            >
              {camera.location}
            </p>
          </div>

          {/* FPS */}

          <div className="shrink-0 text-right">
            <div
              className={`
                font-mono
                text-[13px]
                font-medium

                ${
                  offline
                    ? "text-[#ffb4ab]"
                    : "text-white"
                }
              `}
            >
              {camera.fps}
            </div>

            <div
              className={`
                mt-1
                whitespace-nowrap
                font-mono
                text-[10px]
                sm:text-xs

                ${
                  offline
                    ? "text-[#87929a]"
                    : "text-gray-300"
                }
              `}
            >
              {camera.time}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ==========================================================
   OFFLINE CAMERA
========================================================== */

function OfflineCamera() {
  return (
    <div
      className="
        absolute inset-0
        flex items-center justify-center
        bg-[#0f1418]
      "
    >
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(ellipse_at_center,rgba(135,146,154,0.15),transparent_70%)]
        "
      />

      <div className="relative z-10 text-center">
        <span className="material-symbols-outlined mb-2 block text-[48px] text-[#3e484f]">
          videocam_off
        </span>

        <div className="text-[11px] font-bold uppercase tracking-wider text-[#87929a]">
          Connection Lost
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   FILTER SELECT
========================================================== */

function FilterSelect({
  value,
  onChange,
  children,
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="
        w-full
        rounded
        border border-[#3e484f]
        bg-[#0f1418]
        px-3 py-2
        text-sm
        text-[#dee3e8]
        outline-none
        transition
        focus:border-[#8ed5ff]
        focus:ring-1
        focus:ring-[#8ed5ff]
        sm:w-auto
      "
    >
      {children}
    </select>
  );
}

/* ==========================================================
   STATUS BUTTON
========================================================== */

function StatusButton({
  children,
  type,
  active,
  onClick,
}) {
  let colors =
    "border-[#3e484f] bg-[#0f1418] text-[#bdc8d1]";

  if (type === "critical") {
    colors =
      "border-[#ffb4ab] bg-[#93000a]/20 text-[#ffb4ab]";
  }

  if (type === "warning") {
    colors =
      "border-[#f1a02b] bg-[#f1a02b]/20 text-[#f1a02b]";
  }

  if (active && !type) {
    colors =
      "border-[#87929a] bg-[#303539] text-[#dee3e8]";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center
        gap-1.5
        whitespace-nowrap
        rounded-full
        border
        px-3 py-1.5
        text-[10px]
        font-bold
        uppercase
        tracking-[0.04em]
        transition-colors
        hover:bg-[#303539]
        ${colors}
      `}
    >
      {children}
    </button>
  );
}

export default LiveMonitoring;