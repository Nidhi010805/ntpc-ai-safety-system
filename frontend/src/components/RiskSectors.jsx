import React from 'react';
import { TriangleAlert, ArrowRight } from 'lucide-react';
import './RiskSectors.css';

const sectors = [
  {
    id: 1,
    name: 'Sector 4 - Tower Crane B & Jib Extension',
    elevation: '42.5m - 52.0m',
    wind: '38.2 km/h',
    riskLevel: 'CRITICAL',
    score: '(89/100)',
    levelClass: 'critical'
  },
  {
    id: 2,
    name: 'Sector 1 - Substation High-Voltage Gantry',
    elevation: '28.2m',
    wind: '41.0 km/h',
    riskLevel: 'HIGH',
    score: '(76/100)',
    levelClass: 'high'
  },
  {
    id: 3,
    name: 'Sector 2 - Core Structure 18F Perimeter',
    elevation: '54.0m',
    wind: '29.2 km/h',
    riskLevel: 'ELEVATED',
    score: '(42/100)',
    levelClass: 'elevated'
  },
  {
    id: 4,
    name: 'Sector 3 - West Facade Hanging Scaffolding',
    elevation: '36.8m',
    wind: '22.3 km/h',
    riskLevel: 'LOW',
    score: '(18/100)',
    levelClass: 'low'
  }
];

const RiskSectors = () => {
  return (
    <div className="risk-sectors-section">
      <div className="section-header">
        <h2 className="section-title">
          <TriangleAlert size={18} className="text-warning" />
          Elevated Risk Sectors
        </h2>
        <a href="#" className="view-all-link" style={{color: 'var(--color-warning)'}}>
          Risk Map <ArrowRight size={14} />
        </a>
      </div>

      <div className="sector-list">
        {sectors.map((sector) => (
          <div key={sector.id} className="sector-item">
            <div className="sector-info">
              <span className="sector-name">{sector.name}</span>
              <div className="sector-meta">
                <span>Elevation: {sector.elevation}</span>
                <span>Wind: {sector.wind}</span>
              </div>
            </div>
            
            <div className={`sector-risk-badge ${sector.levelClass}`}>
              <span className="level">{sector.riskLevel}</span>
              <span className="score">{sector.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskSectors;
