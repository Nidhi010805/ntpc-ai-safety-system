import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // For now, allow login when both fields are filled.
    // Later you can replace this with backend authentication.
    if (!employeeId.trim() || !password.trim()) {
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0f1418] text-[#dee3e8] md:flex">
      {/* =====================================================
          LEFT PANEL
      ====================================================== */}

      <section
        className="
          relative hidden
          min-h-screen
          w-[55%]
          overflow-hidden
          border-r border-[#3e484f]
          bg-[#0a0f12]
          md:flex
          md:flex-col
        "
      >
        {/* Background Image */}

        <div
          className="
            absolute inset-0
            bg-cover
            bg-center
            opacity-60
            mix-blend-luminosity
          "
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCd1eY5YoYUqi0AfQRh6ERcTqDcQBV3VeJBO-jHpsKih99Fjayd0U5MlkiS-es1WoRtFosAy7amBQ6Ev-EA9Op2yISPg4mf5RV2uEjtIuwmkjPP7Y8G00SCCrG6A2PBLlQkEidrieDJFTxzJJioNqF4vCS5g0TwmN9hrj2C-M93Jw9MXOBcbplJeE8xsoiJGQhLPElbfEq2tHU4PGeNm5puSzIvGdVwG4ziWx0dXVjObNHDbXh-OAY')",
          }}
        />

        {/* Gradient Overlay */}

        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-[#0f1418]
            via-[#0f1418]/80
            to-transparent
          "
        />

        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-[#0f1418]/50
            to-transparent
          "
        />

        {/* Content */}

        <div
          className="
            relative z-10
            flex h-full
            flex-col
            justify-end
            p-8
            pb-12
            lg:p-10
          "
        >
          <div className="mb-4 flex items-center gap-3">
            <span
              className="
                material-symbols-outlined
                text-4xl
                text-[#8ed5ff]
              "
            >
              admin_panel_settings
            </span>

            <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#dee3e8]">
              NTPC SAFETY
            </h1>
          </div>

          <h2
            className="
              mb-1
              text-lg
              font-semibold
              tracking-wide
              text-[#8ed5ff]
            "
          >
            AI SAFETY MONITORING SYSTEM
          </h2>

          <p className="max-w-lg text-sm leading-6 text-[#bdc8d1]">
            Thermal Power Station · Secure Operational Environment.
            Advanced telemetry, computer vision PPE detection, and
            live hazard tracking.
          </p>
        </div>
      </section>

      {/* =====================================================
          RIGHT PANEL
      ====================================================== */}

      <section
        className="
          relative
          flex min-h-screen
          flex-1 flex-col
          bg-[#0f1418]
        "
      >
        {/* Operational Badge */}

        <div className="absolute right-4 top-4 z-10 sm:right-5 sm:top-5">
          <div
            className="
              flex items-center
              gap-2
              rounded-lg
              border border-[#4ae176]/20
              bg-[#4ae176]/10
              px-3 py-1.5
              backdrop-blur-sm
            "
          >
            <span className="material-symbols-outlined text-[16px] text-[#4ae176]">
              check_circle
            </span>

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.05em]
                text-[#4ae176]
                sm:text-[11px]
              "
            >
              System Status: Operational
            </span>
          </div>
        </div>

        {/* Mobile Branding */}

        <div className="px-5 pt-20 md:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[30px] text-[#8ed5ff]">
              admin_panel_settings
            </span>

            <div>
              <h1 className="text-xl font-bold text-[#dee3e8]">
                NTPC SAFETY
              </h1>

              <p className="text-xs text-[#bdc8d1]">
                AI Safety Monitoring System
              </p>
            </div>
          </div>
        </div>

        {/* Login Area */}

        <div
          className="
            flex flex-1
            items-center
            justify-center
            px-4 py-8
            sm:px-6
            md:p-6
          "
        >
          <div
            className="
              relative
              w-full
              max-w-[400px]
              overflow-hidden
              rounded-xl
              border border-[#3e484f]
              bg-[#1b2024]
              p-6
              shadow-2xl
              sm:p-8
            "
          >
            {/* Accent Line */}

            <div className="absolute left-0 top-0 h-[2px] w-full bg-[#8ed5ff]" />

            {/* Header */}

            <div className="mb-8">
              <span
                className="
                  material-symbols-outlined
                  mb-4
                  block
                  text-3xl
                  text-[#8ed5ff]
                "
              >
                power_settings_new
              </span>

              <h2
                className="
                  mb-2
                  text-[26px]
                  font-bold
                  tracking-[-0.02em]
                  text-[#dee3e8]
                "
              >
                Sign In
              </h2>

              <div
                className="
                  flex items-center
                  gap-1.5
                  rounded
                  border border-[#ffb4ab]/20
                  bg-[#ffb4ab]/10
                  p-2
                  text-xs
                  text-[#ffb4ab]
                "
              >
                <span className="material-symbols-outlined text-[14px]">
                  warning
                </span>

                <span>
                  Authorized personnel access only
                </span>
              </div>
            </div>

            {/* =================================================
                LOGIN FORM
            ================================================== */}

            <form
              className="flex flex-col gap-5"
              onSubmit={handleLogin}
            >
              {/* Employee ID */}

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="employee_id"
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-[#bdc8d1]
                  "
                >
                  Employee ID
                </label>

                <div className="relative">
                  <span
                    className="
                      material-symbols-outlined
                      absolute left-3 top-1/2
                      -translate-y-1/2
                      text-[18px]
                      text-[#87929a]
                    "
                  >
                    badge
                  </span>

                  <input
                    id="employee_id"
                    type="text"
                    value={employeeId}
                    onChange={(e) =>
                      setEmployeeId(e.target.value)
                    }
                    placeholder="E.g., NTPC-8492"
                    autoComplete="username"
                    className="
                      h-10
                      w-full
                      rounded
                      border border-[#3e484f]
                      bg-[#303539]
                      pl-10 pr-3
                      font-mono
                      text-[13px]
                      text-[#dee3e8]
                      outline-none
                      transition-colors
                      placeholder:text-[#87929a]
                      focus:border-[#8ed5ff]
                      focus:ring-1
                      focus:ring-[#8ed5ff]
                    "
                  />
                </div>
              </div>

              {/* Password */}

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-[#bdc8d1]
                  "
                >
                  Security Key / Password
                </label>

                <div className="relative">
                  <span
                    className="
                      material-symbols-outlined
                      absolute left-3 top-1/2
                      -translate-y-1/2
                      text-[18px]
                      text-[#87929a]
                    "
                  >
                    lock
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="
                      h-10
                      w-full
                      rounded
                      border border-[#3e484f]
                      bg-[#303539]
                      pl-10 pr-11
                      font-mono
                      text-[13px]
                      text-[#dee3e8]
                      outline-none
                      transition-colors
                      placeholder:text-[#87929a]
                      focus:border-[#8ed5ff]
                      focus:ring-1
                      focus:ring-[#8ed5ff]
                    "
                  />

                  {/* Show Password */}

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="
                      absolute right-2 top-1/2
                      flex h-8 w-8
                      -translate-y-1/2
                      items-center justify-center
                      rounded
                      text-[#87929a]
                      transition
                      hover:bg-[#252b2e]
                      hover:text-[#dee3e8]
                    "
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword
                        ? "visibility_off"
                        : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Authenticate */}

              <button
                type="submit"
                disabled={
                  !employeeId.trim() ||
                  !password.trim()
                }
                className="
                  group
                  mt-4
                  flex h-10
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded
                  bg-[#8ed5ff]
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.05em]
                  text-[#00354a]
                  transition-all
                  hover:bg-[#7bd0ff]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Authenticate

                <span
                  className="
                    material-symbols-outlined
                    text-[18px]
                    transition-transform
                    group-hover:translate-x-1
                  "
                >
                  arrow_forward
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer
          className="
            flex items-center
            justify-between
            border-t border-[#3e484f]/50
            bg-[#171c20]
            px-4 py-4
            sm:px-6
          "
        >
          <div className="flex items-center gap-2 text-xs text-[#bdc8d1]">
            <span className="material-symbols-outlined text-[14px]">
              shield
            </span>

            <span>Secure Plant Intranet</span>
          </div>

          <div className="font-mono text-[11px] text-[#bdc8d1] opacity-70">
            v.4.12.0
          </div>
        </footer>
      </section>
    </div>
  );
}

export default Login;