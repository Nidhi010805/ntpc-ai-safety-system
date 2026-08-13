import React from 'react';
import AlertBanner from '../components/AlertBanner';
import StatCard from '../components/StatCard';
import ModuleCard from '../components/ModuleCard';
import PersonnelTelemetry from '../components/PersonnelTelemetry';
import RiskSectors from '../components/RiskSectors';

import { 
  Users, 
  MapPin, 
  ShieldCheck, 
  BellRing,
  Box,
  Activity,
  Map,
  TrendingUp,
  BrainCircuit,
  Siren
} from 'lucide-react';

import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">

      <AlertBanner />

      <div className="stats-grid">
        <StatCard 
          title="ACTIVE SITE WORKERS" 
          icon={Users} 
          iconColor="var(--color-cyan)"
          value="5" 
          highlightText="100% Tracked" 
          highlightColor="var(--color-safe)"
          footerText="5 active elevation sectors" 
        />

        <StatCard 
          title="MAX EXPOSURE ELEVATION" 
          icon={MapPin}
          iconColor="var(--color-brand)"
          value="68.0" 
          unit="m"
          highlightText="Turbine Apex" 
          highlightColor="var(--text-secondary)"
          footerText="Wind gust: 38.4 km/h" 
        />

        <StatCard 
          title="SITE PPE COMPLIANCE" 
          icon={ShieldCheck} 
          iconColor="var(--color-safe)"
          value="89.2%" 
          highlightText="1 Harness Warning" 
          highlightColor="var(--color-brand)"
          footerText="4 of 5 fully locked double-lanyards" 
        />

        <StatCard 
          title="ACTIVE HAZARD QUEUE" 
          icon={BellRing} 
          iconColor="var(--color-critical)"
          value="3" 
          highlightText="1 Critical" 
          highlightColor="var(--color-critical)"
          footerText="Incident INC-9042 pending review" 
        />
      </div>

      <div>
        <div className="section-label">
          CORE DIGITAL TWIN OPERATIONAL MODULES
        </div>

        <div className="modules-grid">
          <ModuleCard 
            title="Digital Twin" 
            description="Interactive 3D High-Altitude Scaffold, Tower Crane, and Real-Time Worker Vector Spatial Telemetry"
            icon={Box}
            iconColor="var(--color-brand)"
          />

          <ModuleCard 
            title="Live Monitoring" 
            description="Real-Time High-Altitude Worker Biometrics, Harness Lock Telemetry, and Heart Rate Analytics"
            icon={Activity}
            iconColor="var(--color-safe)"
          />

          <ModuleCard 
            title="Risk Map" 
            description="Heatmap of Elevated Wind Shear, Scaffold Weight Concentration, and Shear Edge Perimeters"
            icon={Map}
            iconColor="var(--color-cyan)"
          />

          <ModuleCard 
            title="Predictive Risk" 
            description="AI Forecast for High-Altitude Shear Gusts, Structural Fatigue, and Auto Evacuation Triggers"
            icon={TrendingUp}
            iconColor="#a855f7"
          />

          <ModuleCard 
            title="Explainable AI" 
            description="ISO-45001 Root Cause Analysis, Neural Feature Weights, and Regulatory Compliance Audit Trails"
            icon={BrainCircuit}
            iconColor="var(--color-brand)"
          />

          <ModuleCard 
            title="Evacuation System" 
            description="Automated Site Siren Broadcast, Safe Assembly Muster Headcounts, and Emergency Dispatch"
            icon={Siren}
            iconColor="var(--color-critical)"
          />
        </div>
      </div>

      <div className="bottom-grid">
        <PersonnelTelemetry />
        <RiskSectors />
      </div>

    </div>
  );
};

export default Dashboard;