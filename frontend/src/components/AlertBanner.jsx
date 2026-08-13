import React from 'react';
import { ShieldAlert, ArrowUpRight } from 'lucide-react';
import './AlertBanner.css';

const AlertBanner = () => {
  return (
    <div className="alert-banner">
      <div className="alert-content-wrapper">
        <div className="alert-icon">
          <ShieldAlert size={20} />
        </div>
        <div className="alert-details">
          <div className="alert-meta">
            <span className="alert-tag">ACTIVE CRITICAL HAZARD</span>
            <span className="alert-time">10:14 AM</span>
            <span className="text-muted">•</span>
            <span className="alert-location">Sector 4 Tower Crane B</span>
          </div>
          <h2 className="alert-title">Unauthorized Zone Entry</h2>
          <p className="alert-message">
            Worker W-042 (Marcus Vance) crossed safety tether boundary without secondary lanyard hook engaged during 38.4 km/h wind shear event.
          </p>
        </div>
      </div>
      <button className="btn-investigate">
        INVESTIGATE ALERT
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
};

export default AlertBanner;
