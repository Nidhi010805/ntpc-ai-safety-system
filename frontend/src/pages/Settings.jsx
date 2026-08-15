import { useState } from "react";

const tabs = [
  {
    id: "general",
    name: "General",
    icon: "settings",
  },
  {
    id: "display",
    name: "Display",
    icon: "display_settings",
  },
  {
    id: "alerts",
    name: "Alert Display",
    icon: "notification_important",
  },
  {
    id: "modules",
    name: "Module Visibility",
    icon: "visibility",
  },
  {
    id: "tables",
    name: "Table Preferences",
    icon: "table_chart",
  },
];

const defaultSettings = {
  plantName: "NTPC Thermal Power Station",
  refreshInterval: 30,

  showConfidence: true,
  showBoundingBoxes: true,

  criticalAlertSound: true,
  alertRetention: "30 Days",

  compactMode: false,
  highContrast: false,

  showPPE: true,
  showFireSafety: true,
  showHarness: true,
  showSwitchyard: true,
  showFallenPerson: true,

  denseTables: false,
  stripedRows: true,
};

function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSaved(false);
  };

  const resetDefaults = () => {
    setSettings(defaultSettings);
    setSaved(false);
  };

  const saveChanges = () => {
    console.log("Saved settings:", settings);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0f1418] text-[#dee3e8] md:ml-[240px]">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <header
        className="
          sticky top-0 z-30
          flex h-16
          items-center
          border-b border-[#3e484f]
          bg-[#1b2024]
          px-4
          sm:px-6
        "
      >
        <h1 className="text-[22px] font-bold text-[#8ed5ff] sm:text-[26px]">
          Settings
        </h1>
      </header>

      {/* =====================================================
          SETTINGS LAYOUT
      ====================================================== */}

      <div className="flex min-h-[calc(100vh-64px)] flex-col lg:flex-row">
        {/* ===================================================
            INTERNAL SETTINGS NAVIGATION
        ==================================================== */}

        <aside
          className="
            w-full
            shrink-0
            border-b border-[#3e484f]
            bg-[#171c20]
            lg:w-64
            lg:border-b-0
            lg:border-r
          "
        >
          <nav
            className="
              flex
              gap-1
              overflow-x-auto
              p-3
              lg:flex-col
              lg:overflow-visible
              lg:px-4
              lg:py-6
            "
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex
                    shrink-0
                    items-center
                    gap-3
                    rounded
                    px-4 py-3
                    text-left
                    text-sm
                    transition-colors
                    lg:w-full

                    ${
                      active
                        ? "bg-[#303539] font-bold text-[#8ed5ff]"
                        : "text-[#bdc8d1] hover:bg-[#252b2e] hover:text-white"
                    }
                  `}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {tab.icon}
                  </span>

                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ===================================================
            CONTENT AREA
        ==================================================== */}

        <main
          className="
            flex-1
            overflow-y-auto
            bg-[#0f1418]
            p-4
            sm:p-5
            lg:p-6
          "
        >
          <div className="mx-auto max-w-3xl">
            {/* =================================================
                GENERAL
            ================================================== */}

            {activeTab === "general" && (
              <div className="space-y-4">
                <SettingsCard title="General Configuration">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Plant Name */}

                    <Field>
                      <FieldLabel>
                        Plant Name
                      </FieldLabel>

                      <input
                        type="text"
                        value={settings.plantName}
                        onChange={(e) =>
                          updateSetting(
                            "plantName",
                            e.target.value
                          )
                        }
                        className={inputStyle}
                      />
                    </Field>

                    {/* Refresh */}

                    <Field>
                      <FieldLabel>
                        Data Refresh Interval (seconds)
                      </FieldLabel>

                      <input
                        type="number"
                        min="1"
                        value={settings.refreshInterval}
                        onChange={(e) =>
                          updateSetting(
                            "refreshInterval",
                            Number(e.target.value)
                          )
                        }
                        className={inputStyle}
                      />
                    </Field>
                  </div>
                </SettingsCard>

                {/* AI DISPLAY */}

                <SettingsCard title="AI & Display Preferences">
                  <div className="space-y-4">
                    <ToggleRow
                      title="Show Confidence Scores on CCTV Feeds"
                      checked={settings.showConfidence}
                      onChange={(checked) =>
                        updateSetting(
                          "showConfidence",
                          checked
                        )
                      }
                    />

                    <Divider />

                    <ToggleRow
                      title="Show Bounding Boxes for Detected Anomalies"
                      checked={settings.showBoundingBoxes}
                      onChange={(checked) =>
                        updateSetting(
                          "showBoundingBoxes",
                          checked
                        )
                      }
                    />
                  </div>
                </SettingsCard>

                {/* ALERTS */}

                <SettingsCard title="Alerts & Notifications">
                  <div className="space-y-5">
                    <ToggleRow
                      title="Critical Alert Sound"
                      description="Play an audible alarm for Level 1 severity alerts"
                      checked={settings.criticalAlertSound}
                      onChange={(checked) =>
                        updateSetting(
                          "criticalAlertSound",
                          checked
                        )
                      }
                    />

                    <Field>
                      <FieldLabel>
                        Alert Retention Period (Days)
                      </FieldLabel>

                      <select
                        value={settings.alertRetention}
                        onChange={(e) =>
                          updateSetting(
                            "alertRetention",
                            e.target.value
                          )
                        }
                        className={`${inputStyle} md:w-1/2`}
                      >
                        <option>7 Days</option>
                        <option>14 Days</option>
                        <option>30 Days</option>
                        <option>90 Days</option>
                      </select>
                    </Field>
                  </div>
                </SettingsCard>
              </div>
            )}

            {/* =================================================
                DISPLAY
            ================================================== */}

            {activeTab === "display" && (
              <div className="space-y-4">
                <SettingsCard title="Display Preferences">
                  <div className="space-y-4">
                    <ToggleRow
                      title="Compact Dashboard Mode"
                      description="Reduce spacing between dashboard widgets and cards"
                      checked={settings.compactMode}
                      onChange={(checked) =>
                        updateSetting(
                          "compactMode",
                          checked
                        )
                      }
                    />

                    <Divider />

                    <ToggleRow
                      title="High Contrast Interface"
                      description="Increase contrast for critical monitoring environments"
                      checked={settings.highContrast}
                      onChange={(checked) =>
                        updateSetting(
                          "highContrast",
                          checked
                        )
                      }
                    />
                  </div>
                </SettingsCard>

                <SettingsCard title="Preview">
                  <div
                    className="
                      rounded
                      border border-[#3e484f]
                      bg-[#171c20]
                      p-4
                    "
                  >
                    <p className="text-sm font-semibold">
                      NTPC Safety Monitoring
                    </p>

                    <p className="mt-1 text-xs text-[#bdc8d1]">
                      Display preferences preview
                    </p>

                    <div className="mt-4 flex gap-2">
                      <span className="rounded bg-[#4ae176]/10 px-2 py-1 text-[11px] font-bold text-[#4ae176]">
                        SAFE
                      </span>

                      <span className="rounded bg-[#ffc176]/10 px-2 py-1 text-[11px] font-bold text-[#ffc176]">
                        WARNING
                      </span>

                      <span className="rounded bg-[#93000a]/20 px-2 py-1 text-[11px] font-bold text-[#ffb4ab]">
                        CRITICAL
                      </span>
                    </div>
                  </div>
                </SettingsCard>
              </div>
            )}

            {/* =================================================
                ALERT DISPLAY
            ================================================== */}

            {activeTab === "alerts" && (
              <SettingsCard title="Alert Display">
                <div className="space-y-4">
                  <ToggleRow
                    title="Critical Alert Sound"
                    description="Play an audible warning for critical incidents"
                    checked={settings.criticalAlertSound}
                    onChange={(checked) =>
                      updateSetting(
                        "criticalAlertSound",
                        checked
                      )
                    }
                  />

                  <Divider />

                  <Field>
                    <FieldLabel>
                      Alert Retention Period
                    </FieldLabel>

                    <select
                      value={settings.alertRetention}
                      onChange={(e) =>
                        updateSetting(
                          "alertRetention",
                          e.target.value
                        )
                      }
                      className={`${inputStyle} md:w-1/2`}
                    >
                      <option>7 Days</option>
                      <option>14 Days</option>
                      <option>30 Days</option>
                      <option>90 Days</option>
                    </select>
                  </Field>

                  <div
                    className="
                      rounded
                      border border-[#93000a]
                      bg-[#93000a]/10
                      p-4
                    "
                  >
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-[#ffb4ab]">
                        warning
                      </span>

                      <div>
                        <p className="text-sm font-semibold text-[#ffb4ab]">
                          Critical Alert Preview
                        </p>

                        <p className="mt-1 text-xs text-[#bdc8d1]">
                          Fallen Person detected • CAM-31 • Zone B
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SettingsCard>
            )}

            {/* =================================================
                MODULE VISIBILITY
            ================================================== */}

            {activeTab === "modules" && (
              <SettingsCard title="Module Visibility">
                <div className="space-y-4">
                  <ToggleRow
                    title="PPE Detection"
                    description="Show PPE monitoring module in navigation"
                    checked={settings.showPPE}
                    onChange={(checked) =>
                      updateSetting(
                        "showPPE",
                        checked
                      )
                    }
                  />

                  <Divider />

                  <ToggleRow
                    title="Fire Safety"
                    description="Show fire and smoke detection module"
                    checked={settings.showFireSafety}
                    onChange={(checked) =>
                      updateSetting(
                        "showFireSafety",
                        checked
                      )
                    }
                  />

                  <Divider />

                  <ToggleRow
                    title="Harness Monitoring"
                    description="Show height-safety harness monitoring module"
                    checked={settings.showHarness}
                    onChange={(checked) =>
                      updateSetting(
                        "showHarness",
                        checked
                      )
                    }
                  />

                  <Divider />

                  <ToggleRow
                    title="Switchyard Safety"
                    description="Show electrical switchyard safety module"
                    checked={settings.showSwitchyard}
                    onChange={(checked) =>
                      updateSetting(
                        "showSwitchyard",
                        checked
                      )
                    }
                  />

                  <Divider />

                  <ToggleRow
                    title="Fallen Person"
                    description="Show fallen-person detection module"
                    checked={settings.showFallenPerson}
                    onChange={(checked) =>
                      updateSetting(
                        "showFallenPerson",
                        checked
                      )
                    }
                  />
                </div>
              </SettingsCard>
            )}

            {/* =================================================
                TABLE PREFERENCES
            ================================================== */}

            {activeTab === "tables" && (
              <SettingsCard title="Table Preferences">
                <div className="space-y-4">
                  <ToggleRow
                    title="Dense Table Layout"
                    description="Reduce table row height to display more records"
                    checked={settings.denseTables}
                    onChange={(checked) =>
                      updateSetting(
                        "denseTables",
                        checked
                      )
                    }
                  />

                  <Divider />

                  <ToggleRow
                    title="Striped Rows"
                    description="Use alternating row backgrounds for easier scanning"
                    checked={settings.stripedRows}
                    onChange={(checked) =>
                      updateSetting(
                        "stripedRows",
                        checked
                      )
                    }
                  />

                  <div className="overflow-hidden rounded border border-[#3e484f]">
                    <div className="grid grid-cols-3 bg-[#252b2e] px-3 py-2 text-[11px] font-bold uppercase text-[#bdc8d1]">
                      <span>Camera</span>
                      <span>Status</span>
                      <span>Location</span>
                    </div>

                    <div
                      className={`grid grid-cols-3 px-3 ${
                        settings.denseTables
                          ? "py-1.5"
                          : "py-3"
                      } ${
                        settings.stripedRows
                          ? "bg-[#171c20]"
                          : "bg-[#1b2024]"
                      }`}
                    >
                      <span className="text-xs">
                        CAM-042
                      </span>

                      <span className="text-xs text-[#ffb4ab]">
                        Critical
                      </span>

                      <span className="text-xs text-[#bdc8d1]">
                        Boiler Area
                      </span>
                    </div>

                    <div
                      className={`grid grid-cols-3 px-3 ${
                        settings.denseTables
                          ? "py-1.5"
                          : "py-3"
                      } bg-[#1b2024]`}
                    >
                      <span className="text-xs">
                        CAM-088
                      </span>

                      <span className="text-xs text-[#4ae176]">
                        Normal
                      </span>

                      <span className="text-xs text-[#bdc8d1]">
                        Switchyard
                      </span>
                    </div>
                  </div>
                </div>
              </SettingsCard>
            )}

            {/* =================================================
                ACTION BUTTONS
            ================================================== */}

            <div
              className="
                mt-6
                flex flex-col-reverse
                gap-3
                border-t border-[#3e484f]
                pt-6
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={resetDefaults}
                className="
                  h-10
                  rounded
                  border border-[#3e484f]
                  px-4
                  text-sm
                  text-[#bdc8d1]
                  transition-colors
                  hover:bg-[#303539]
                  hover:text-white
                "
              >
                Reset Defaults
              </button>

              <button
                type="button"
                onClick={saveChanges}
                className="
                  flex h-10
                  items-center justify-center
                  gap-2
                  rounded
                  bg-[#8ed5ff]
                  px-4
                  text-sm
                  font-medium
                  text-[#00354a]
                  transition
                  hover:bg-[#7bd0ff]
                "
              >
                {saved ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      check
                    </span>

                    Saved
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ==========================================================
   SETTINGS CARD
========================================================== */

function SettingsCard({
  title,
  children,
}) {
  return (
    <section
      className="
        rounded
        border border-[#3e484f]
        bg-[#1b2024]
        p-4
      "
    >
      <h2
        className="
          mb-4
          border-b border-[#3e484f]
          pb-2
          text-lg
          font-semibold
          text-[#dee3e8]
        "
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

/* ==========================================================
   TOGGLE
========================================================== */

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-5
      "
    >
      <div className="min-w-0">
        <p className="text-sm text-[#dee3e8]">
          {title}
        </p>

        {description && (
          <p className="mt-1 text-xs text-[#bdc8d1]">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative
          h-6 w-10
          shrink-0
          rounded-full
          border
          transition-colors

          ${
            checked
              ? "border-[#8ed5ff] bg-[#8ed5ff]"
              : "border-[#3e484f] bg-[#303539]"
          }
        `}
      >
        <span
          className={`
            absolute
            top-[3px]
            h-4 w-4
            rounded-full
            bg-[#0f1418]
            transition-transform
            duration-200

            ${
              checked
                ? "translate-x-[18px]"
                : "translate-x-[3px]"
            }
          `}
        />
      </button>
    </div>
  );
}

/* ==========================================================
   SMALL HELPERS
========================================================== */

function Divider() {
  return (
    <div className="h-px w-full bg-[#3e484f]/50" />
  );
}

function Field({ children }) {
  return (
    <div className="space-y-1.5">
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label
      className="
        block
        text-[11px]
        font-bold
        uppercase
        tracking-[0.05em]
        text-[#bdc8d1]
      "
    >
      {children}
    </label>
  );
}

const inputStyle = `
  w-full
  rounded
  border border-[#3e484f]
  bg-[#0f1418]
  px-3 py-2
  text-sm
  text-[#dee3e8]
  outline-none
  transition-all
  focus:border-[#8ed5ff]
  focus:ring-1
  focus:ring-[#8ed5ff]
`;

export default Settings;