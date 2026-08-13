import React from 'react';
import { 
  ShieldAlert, 
  Wind, 
  LayoutDashboard, 
  Activity, 
  Users, 
  CheckSquare, 
  Box, 
  Map, 
  TrendingUp, 
  Video, 
  BellRing, 
  BrainCircuit, 
  History,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Activity, label: 'Live Monitoring' },
  { icon: Users, label: 'Workers' },
  { icon: CheckSquare, label: 'PPE Compliance' },
  { icon: Box, label: 'Digital Twin' },
  { icon: Map, label: 'Risk Map' },
  { icon: TrendingUp, label: 'Predictive Risk' },
  { icon: Video, label: 'Camera Monitoring' },
  { icon: BellRing, label: 'Evacuation' },
  { icon: ShieldAlert, label: 'Alerts', badge: 2 },
  { icon: BrainCircuit, label: 'Explainable AI' },
  { icon: History, label: 'Incident History' }
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <ShieldAlert size={20} />
          </div>
          <div className="brand-text">
            <h1>HeightSafe-X <span className="text-brand text-xs ml-1">v3.8</span></h1>
            <span>High-Altitude Digital Twin</span>
          </div>
        </div>

        {/* Site Wind Widget */}
        <div className="site-wind">
          <div className="site-wind-label">
            <Wind size={16} className="text-cyan" />
            <span>Site Wind</span>
          </div>
          <div className="site-wind-value">
            38.4 <span className="text-secondary" style={{ fontSize: '10px' }}>km/h</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav-section">
          <div className="nav-section-title">Platform Operations</div>
          <ul className="nav-list">
            {navItems.map((item, index) => (
              <li key={index} className={`nav-item ${item.active ? 'active' : ''}`}>
                <item.icon className="icon" />
                <span>{item.label}</span>
                {item.badge && <span className="badge">{item.badge}</span>}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Footer */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar-fallback">OP</div>
            <div className="user-info">
              <span className="name">Safety Officer</span>
              <span className="role">ISO-45001 Operator</span>
            </div>
          </div>
          <button className="logout-btn">
            <LogOut size={16} />
          </button>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;