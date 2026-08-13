import React from 'react';
import { 
  Wifi, 
  Wind, 
  Clock, 
  Siren, 
  Volume2, 
  BellRing, 
  ShieldAlert 
} from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        
        {/* Left Section: Breadcrumb & Stats */}
        <div className="header-left">
          <div className="header-breadcrumb">
            Site Sector 4 <span className="text-muted">/</span> <span className="current">Dashboard</span>
          </div>

          <div className="header-stats">
            <div className="stat-item sync">
              <Wifi size={14} className="text-safe" />
              <span className="label">Digital Twin Sync:</span>
              <span className="value">12ms (ONLINE)</span>
            </div>
            
            <div className="stat-item wind">
              <Wind size={14} className="text-cyan" />
              <span className="label">Elevation Wind:</span>
              <span className="value">38.4 km/h</span>
            </div>
          </div>
        </div>

        {/* Right Section: Time & Actions */}
        <div className="header-right">
          <div className="time-display">
            <Clock size={14} />
            <span className="time">22:45:32</span>
            <span>UTC</span>
          </div>

          <div className="header-actions">
            <button className="btn-action">
              <Siren size={14} />
              TEST SIREN
            </button>
            
            <button className="btn-icon">
              <Volume2 size={16} />
            </button>
            
            <div className="notification-wrapper">
              <button className="btn-icon">
                <BellRing size={16} />
              </button>
              <span className="notification-badge">2</span>
            </div>

            <button className="btn-action btn-evac">
              <ShieldAlert size={14} />
              EVAC PROTOCOL
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
