import { Flame } from "lucide-react";
import HazardMonitoringPage from "./HazardMonitoringPage";

const fireSmokeConfig = {
  title: "Fire & Smoke Monitoring",
  subtitle: "AI-assisted surveillance for flame, smoke and overheating hazards",
  icon: Flame,
  sourceLabel: "8 camera and thermal-sensor feeds online",
  monitoredZones: 6,
  monitoredFeeds: "8/8",
  locations: ["Boiler Unit 2", "Turbine Hall", "Coal Conveyor"],
  events: [
    {
      id: "FIR-204",
      type: "Smoke detection",
      severity: "Critical",
      status: "Active",
      location: "Boiler Unit 2",
      camera: "CAM-042",
      timestamp: "Today, 10:42:15",
      confidence: 96.8,
      description: "Dense smoke plume detected near the auxiliary burner access platform.",
    },
    {
      id: "FIR-203",
      type: "Heat anomaly",
      severity: "High",
      status: "Active",
      location: "Turbine Hall",
      camera: "THERM-07",
      timestamp: "Today, 10:31:44",
      confidence: 91.4,
      description: "Temperature rise above the configured threshold at cable tray section C.",
    },
    {
      id: "FIR-202",
      type: "Smoke detection",
      severity: "Medium",
      status: "Active",
      location: "Coal Conveyor",
      camera: "CAM-118",
      timestamp: "Today, 10:18:09",
      confidence: 87.2,
      description: "Light smoke pattern detected near transfer point B; operator verification required.",
    },
    {
      id: "FIR-201",
      type: "Flame detection",
      severity: "High",
      status: "Resolved",
      location: "Boiler Unit 2",
      camera: "CAM-039",
      timestamp: "Today, 09:54:22",
      confidence: 93.1,
      description: "Brief flame signature detected during controlled ignition test and cleared by operator.",
    },
    {
      id: "FIR-200",
      type: "Heat anomaly",
      severity: "Low",
      status: "Resolved",
      location: "Turbine Hall",
      camera: "THERM-04",
      timestamp: "Today, 09:27:05",
      confidence: 78.6,
      description: "Short thermal fluctuation returned to normal range after ventilation adjustment.",
    },
  ],
};

function FireSmoke() {
  return <HazardMonitoringPage moduleConfig={fireSmokeConfig} />;
}

export default FireSmoke;
