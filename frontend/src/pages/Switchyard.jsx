import { Zap } from "lucide-react";
import HazardMonitoringPage from "./HazardMonitoringPage";

const switchyardConfig = {
  title: "Switchyard Safety Monitoring",
  subtitle: "AI-assisted surveillance for electrical-yard hazards and restricted-zone events",
  icon: Zap,
  sourceLabel: "7 camera and perimeter-sensor feeds online",
  monitoredZones: 7,
  monitoredFeeds: "7/7",
  locations: ["Yard 1", "Transformer Bay", "Control Gate"],
  events: [
    {
      id: "SWY-089",
      type: "Restricted-zone entry",
      severity: "Critical",
      status: "Active",
      location: "Transformer Bay",
      camera: "CAM-088",
      timestamp: "Today, 10:45:08",
      confidence: 97.3,
      description: "Person detected inside the restricted transformer approach boundary.",
    },
    {
      id: "SWY-088",
      type: "Foreign-object detection",
      severity: "High",
      status: "Active",
      location: "Yard 1",
      camera: "CAM-091",
      timestamp: "Today, 10:29:41",
      confidence: 92.5,
      description: "Unidentified object detected close to the isolator operating mechanism.",
    },
    {
      id: "SWY-087",
      type: "Perimeter alert",
      severity: "Medium",
      status: "Active",
      location: "Control Gate",
      camera: "CAM-083",
      timestamp: "Today, 10:11:29",
      confidence: 84.8,
      description: "Perimeter crossing detected outside the scheduled maintenance access window.",
    },
    {
      id: "SWY-086",
      type: "Restricted-zone entry",
      severity: "High",
      status: "Resolved",
      location: "Transformer Bay",
      camera: "CAM-087",
      timestamp: "Today, 09:39:17",
      confidence: 89.6,
      description: "Authorized technician entry verified through the control-room access register.",
    },
    {
      id: "SWY-085",
      type: "Equipment condition",
      severity: "Low",
      status: "Resolved",
      location: "Yard 1",
      camera: "CAM-094",
      timestamp: "Today, 09:03:56",
      confidence: 77.4,
      description: "Visual anomaly on a safety barrier was inspected and found secure.",
    },
  ],
};

function Switchyard() {
  return <HazardMonitoringPage moduleConfig={switchyardConfig} />;
}

export default Switchyard;
