import { Factory } from "lucide-react";
import HazardMonitoringPage from "./HazardMonitoringPage";

const ashLeakageConfig = {
  title: "Ash Leakage Monitoring",
  subtitle: "AI-assisted monitoring for ash spills, dust plumes and conveyor leakage",
  icon: Factory,
  sourceLabel: "6 camera and process-sensor feeds online",
  monitoredZones: 5,
  monitoredFeeds: "6/6",
  locations: ["Ash Silo 1", "Conveyor B", "ESP Hopper"],
  events: [
    {
      id: "ASH-118",
      type: "Ash leakage",
      severity: "High",
      status: "Active",
      location: "Conveyor B",
      camera: "CAM-203",
      timestamp: "Today, 10:38:51",
      confidence: 94.6,
      description: "Continuous ash accumulation detected below the conveyor transfer chute.",
    },
    {
      id: "ASH-117",
      type: "Dust plume",
      severity: "Medium",
      status: "Active",
      location: "ESP Hopper",
      camera: "CAM-211",
      timestamp: "Today, 10:21:37",
      confidence: 88.9,
      description: "Elevated dust plume detected during hopper discharge cycle.",
    },
    {
      id: "ASH-116",
      type: "Ash leakage",
      severity: "Medium",
      status: "Active",
      location: "Ash Silo 1",
      camera: "CAM-197",
      timestamp: "Today, 10:05:16",
      confidence: 86.3,
      description: "Small ash deposit detected around the silo outlet flange.",
    },
    {
      id: "ASH-115",
      type: "Conveyor obstruction",
      severity: "High",
      status: "Resolved",
      location: "Conveyor B",
      camera: "CAM-204",
      timestamp: "Today, 09:46:33",
      confidence: 90.7,
      description: "Material buildup was detected and later cleared after maintenance confirmation.",
    },
    {
      id: "ASH-114",
      type: "Dust plume",
      severity: "Low",
      status: "Resolved",
      location: "ESP Hopper",
      camera: "CAM-210",
      timestamp: "Today, 09:12:48",
      confidence: 75.2,
      description: "Temporary low-density dust plume returned to the normal operating range.",
    },
  ],
};

function AshLeakage() {
  return <HazardMonitoringPage moduleConfig={ashLeakageConfig} />;
}

export default AshLeakage;
