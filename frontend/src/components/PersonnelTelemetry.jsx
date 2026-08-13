import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import './PersonnelTelemetry.css';

const workers = [
  {
    id: 'W-042',
    name: 'Marcus Vance',
    location: 'Sector 4 - Tower Crane B • 42.5m High Rise',
    harnessState: 'Warning (1/2)',
    status: 'CAUTION',
    statusClass: 'caution',
    harnessClass: 'warning',
    avatar: 'https://i.pravatar.cc/150?u=marcus'
  },
  {
    id: 'W-019',
    name: 'Elena Rostova',
    location: 'Sector 2 - Core Structure 18F • 54.0m High Rise',
    harnessState: 'Locked (2/2)',
    status: 'SAFE',
    statusClass: 'safe',
    harnessClass: 'safe',
    avatar: 'https://i.pravatar.cc/150?u=elena'
  },
  {
    id: 'W-088',
    name: 'David Chen',
    location: 'Sector 3 - Perimeter Platform 12F • 36.8m',
    harnessState: 'Locked (2/2)',
    status: 'SAFE',
    statusClass: 'safe',
    harnessClass: 'safe',
    avatar: 'https://i.pravatar.cc/150?u=david'
  },
  {
    id: 'W-104',
    name: 'Javier Mendez',
    location: 'Sector 1 - Substation Gantry • 28.2m',
    harnessState: 'Disengaged (0/2)',
    status: 'CRITICAL WARNING',
    statusClass: 'critical',
    harnessClass: 'critical',
    avatar: 'https://i.pravatar.cc/150?u=javier'
  }
];

const PersonnelTelemetry = () => {
  return (
    <div className="telemetry-section">
      <div className="section-header">
        <h2 className="section-title">
          <Users size={18} className="section-title-icon" />
          High-Altitude Personnel Telemetry
        </h2>
        <a href="#" className="view-all-link">
          View All Workers <ArrowRight size={14} />
        </a>
      </div>

      <div className="telemetry-list">
        {workers.map((worker) => (
          <div key={worker.id} className="telemetry-item">
            <div className="worker-info-group">
              <img src={worker.avatar} alt={worker.name} className="worker-avatar" />
              <div className="worker-details">
                <div className="worker-name-row">
                  <span className="worker-id">{worker.id}</span>
                  <span className="worker-name">{worker.name}</span>
                </div>
                <span className="worker-location">{worker.location}</span>
              </div>
            </div>
            
            <div className="harness-status-group">
              <span className="harness-label">Harness:</span>
              <span className={`harness-value ${worker.harnessClass}`}>
                {worker.harnessState}
              </span>
              <span className={`status-badge ${worker.statusClass}`}>
                {worker.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonnelTelemetry;
