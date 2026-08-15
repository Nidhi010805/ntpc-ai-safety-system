const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#0f1418] text-[#dee3e8] md:ml-[240px]">
      {/* =====================================================
          TOP NAVBAR
      ====================================================== */}

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

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className="
          min-h-screen
          px-4 pb-6 pt-[88px]
          sm:px-5
          lg:px-6
        "
      >
        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <header className="mb-6">
          <h2
            className="
              mb-1
              text-[22px]
              font-bold
              leading-8
              tracking-[-0.02em]
              text-[#dee3e8]
              sm:text-[26px]
            "
          >
            Safety Overview
          </h2>

          <p className="text-sm text-[#bdc8d1]">
            Real-time AI-assisted plant safety monitoring
          </p>
        </header>

        {/* ===================================================
            KPI CARDS
        ==================================================== */}

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
            title="Cameras Online"
            value="12/12"
            icon="videocam"
            iconColor="text-[#4ae176]"
          />

          <KpiCard
            title="Active Alerts"
            value="06"
            icon="notifications_active"
            iconColor="text-[#ffc176]"
            valueColor="text-[#ffc176]"
          />

          <KpiCard
            title="Critical Events"
            value="02"
            icon="warning"
            critical
          />

          <KpiCard
            title="PPE Compliance"
            value="94.2%"
            icon="engineering"
            iconColor="text-[#4ae176]"
          />

          <KpiCard
            title="System Uptime"
            value="99.4%"
            icon="power"
            iconColor="text-[#4ae176]"
          />
        </section>

        {/* ===================================================
            LIVE MONITORING + ACTIVE ALERTS
        ==================================================== */}

        <section
          className="
            flex flex-col
            gap-4
            xl:h-[400px]
            xl:flex-row
          "
        >
          {/* =================================================
              LIVE MONITORING
          ================================================== */}

          <div
            className="
              flex min-h-[500px] flex-col
              rounded
              border border-[#3e484f]
              bg-[#1b2024]
              p-4
              xl:min-h-0
              xl:w-[70%]
            "
          >
            {/* Heading */}

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#dee3e8]">
                  Live Monitoring
                </h3>

                <p className="mt-0.5 text-[11px] text-[#87929a] sm:hidden">
                  Priority camera feeds
                </p>
              </div>

              <button
                type="button"
                aria-label="Fullscreen monitoring"
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded
                  text-[#8ed5ff]
                  transition-colors
                  hover:bg-[#303539]
                  hover:text-[#c4e7ff]
                "
              >
                <span className="material-symbols-outlined">
                  fullscreen
                </span>
              </button>
            </div>

            {/* Camera Grid */}

            <div
              className="
                grid flex-1
                grid-cols-1
                gap-2
                sm:grid-cols-2
                xl:grid-rows-2
              "
            >
              {/* CAM-07 */}

              <CameraFeed
                camera="CAM-07"
                label="Smoke Detected"
                icon="warning"
                type="critical"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4eCVKZ4r-Tw_v7ak6K4HPKGTOKaZkkb3pz53l1S6pk-HpcdHF4v-LV7gLTnEVd5Z7aDSNSI6GKjLvcDO6UFQyOxmbJcEehpztJ9VDnFJNYW1HuqY8ri_hfXXRJWLvo9M21m1bITlpXukx5wBA6g4GAZR0lKayFRrap1AV45PwYbCP6dqLiMg5uHyEk7R7NEFdRCuznxMPGouJA4D1yGX2vqR9HPA4slo-nN4P5B-S4CEcRWbwm0"
              />

              {/* CAM-12 */}

              <CameraFeed
                camera="CAM-12"
                label="Helmet Violation"
                icon="engineering"
                type="warning"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCJJRTg3AvTI56Yxe6pN-qfBMSAyoev76XyCtxZ8jg5Dqq2qbF79A0P4mDNuq6gTN0jxX_B6npFA3NnQLwuKxiDxGNnNCcVbKo-_Ot2r5LNRDM7Hwke7I9WbDhlOpUSg9oo4jla_JgjfXmnbHlvBqlFAqrv-IGvCtDgGhCPSx_e8wwUumEAow6hnWKACiq63xjdLN2b--RlP3ph9MMzIBjmz_4qQr0JnenGBakjTUamfSGXBhyxqyQ"
              />

              {/* CAM-23 */}

              <CameraFeed
                camera="CAM-23"
                label="Corridor 4"
                icon="check_circle"
                type="safe"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuAslXDRdkk24I0ANj67iMOsPWUFv6CThns1_aY65NdtEb15lB_8CIxp6LIt0jhe39PgSJU3Z96jWWU2FGPJrG9lAtaNRHtFhpvVPrfSNRKWa9splWJpR-A8aZ1JGzGLMADI0WpXLnrwHDhvZYzmteg_0xFV9W4F79cr2jyEzXR9eY4PZArGoAsIJd0_Bg8iSk0BZSxN18PzR-ORGqFAV9DiForHxHK0PmgoiDaj3E6Gf5h2fkRMWXw"
              />

              {/* CAM-31 */}

              <CameraFeed
                camera="CAM-31"
                label="Fallen Person"
                icon="person_off"
                type="critical"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuAvMErUqtrbDsNuxVB087NvpUsDlkuWhr5yeYhoS5NGh7W2ZruxwO5tqTpvdmUebaDQpmEvFRtS3avgy0_JOPSfoT7AMl8EHy8rA5p-S63QUxg5YhJFliZzDKQHqkMDbTIKgh39IoDq9gu-iFWkOeqhBeS6H7Vf1VZEJ8ZSgC4g65gDx7g6MJiXhUWceU2JKSqdnnUskq4P1MibndAFwOwZWFwiOLaGd_Aa8t-XPnJk9cRPDN_XyMo"
              />
            </div>
          </div>

          {/* =================================================
              ACTIVE ALERTS
          ================================================== */}

          <aside
            className="
              flex min-h-[300px] flex-col
              overflow-hidden
              rounded
              border border-[#3e484f]
              bg-[#1b2024]
              xl:min-h-0
              xl:w-[30%]
            "
          >
            {/* Alert Header */}

            <div
              className="
                flex items-center justify-between
                border-b border-[#3e484f]
                p-4
              "
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-[#dee3e8]">
                  Active Alerts
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
                  06
                </span>
              </div>
            </div>

            {/* Alert List */}

            <div className="flex-1 overflow-y-auto p-2">
              <ul className="flex flex-col gap-2">
                <AlertCard
                  icon="warning"
                  title="CRITICAL: Fallen Person"
                  detail="Zone B • CAM-31 • 2m ago"
                  type="critical"
                />

                <AlertCard
                  icon="local_fire_department"
                  title="CRITICAL: Smoke Detect"
                  detail="Boiler 2 • CAM-07 • 5m ago"
                  type="critical"
                />

                <AlertCard
                  icon="engineering"
                  title="WARN: No Helmet"
                  detail="Loading Dock • CAM-12 • 12m ago"
                  type="warning"
                />
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

/* ==========================================================
   KPI CARD
========================================================== */

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

            ${
              critical
                ? "text-[#ffb4ab]"
                : "text-[#bdc8d1]"
            }
          `}
        >
          {title}
        </span>

        <span
          className={`
            material-symbols-outlined
            shrink-0
            text-[22px]

            ${
              critical
                ? "text-[#ffb4ab]"
                : iconColor
            }
          `}
        >
          {icon}
        </span>
      </div>

      <div
        className={`
          text-xl
          font-semibold

          ${
            critical
              ? "text-[#ffb4ab]"
              : valueColor
          }
        `}
      >
        {value}
      </div>
    </article>
  );
}

/* ==========================================================
   CAMERA FEED
========================================================== */

function CameraFeed({
  camera,
  label,
  image,
  icon,
  type,
}) {
  const borderColor =
    type === "critical"
      ? "border-[#ffb4ab]"
      : type === "warning"
        ? "border-[#ffc176]"
        : "border-[#3e484f]";

  const iconColor =
    type === "critical"
      ? "text-[#ffb4ab]"
      : type === "warning"
        ? "text-[#ffc176]"
        : "text-[#4ae176]";

  return (
    <article
      className={`
        group
        relative
        min-h-[180px]
        overflow-hidden
        rounded
        border
        bg-black
        sm:min-h-[190px]
        xl:min-h-0
        ${borderColor}
      `}
    >
      {/* Camera Image */}

      <img
        src={image}
        alt={`${camera} Feed`}
        className="
          absolute inset-0
          h-full w-full
          object-cover
          opacity-80
          transition-transform
          duration-300
          group-hover:scale-[1.02]
        "
      />

      {/* Dark Gradient */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-t
          from-black/70
          via-transparent
          to-transparent
        "
      />

      {/* Status Dot */}

      <div className="absolute left-2 top-2">
        <span
          className={`
            block h-2 w-2 rounded-full

            ${
              type === "critical"
                ? "animate-pulse bg-[#ffb4ab]"
                : type === "warning"
                  ? "bg-[#ffc176]"
                  : "bg-[#4ae176]"
            }
          `}
        />
      </div>

      {/* Bottom Information */}

      <div
        className="
          absolute inset-x-0 bottom-0
          flex items-center justify-between
          gap-2
          bg-black/65
          px-2 py-2
          backdrop-blur-[2px]
        "
      >
        <span
          className="
            min-w-0
            truncate
            text-xs
            text-[#dee3e8]
          "
        >
          {camera} • {label}
        </span>

        <span
          className={`
            material-symbols-outlined
            shrink-0
            text-[17px]
            ${iconColor}
          `}
        >
          {icon}
        </span>
      </div>
    </article>
  );
}

/* ==========================================================
   ACTIVE ALERT CARD
========================================================== */

function AlertCard({
  icon,
  title,
  detail,
  type,
}) {
  const critical = type === "critical";

  return (
    <li
      className={`
        flex
        items-start
        gap-3
        rounded
        border
        p-3
        transition-colors

        ${
          critical
            ? "border-[#93000a] bg-[#93000a]/10 hover:bg-[#93000a]/20"
            : "border-[#ffc176]/30 bg-[#f1a02b]/10 hover:bg-[#f1a02b]/15"
        }
      `}
    >
      <span
        className={`
          material-symbols-outlined
          mt-0.5
          shrink-0
          text-[21px]

          ${
            critical
              ? "text-[#ffb4ab]"
              : "text-[#ffc176]"
          }
        `}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <div
          className={`
            break-words
            font-mono
            text-[13px]
            font-medium

            ${
              critical
                ? "text-[#ffb4ab]"
                : "text-[#ffc176]"
            }
          `}
        >
          {title}
        </div>

        <div className="mt-1 break-words text-xs text-[#bdc8d1]">
          {detail}
        </div>
      </div>
    </li>
  );
}

export default Dashboard;