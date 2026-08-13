<<<<<<< HEAD
function StatCard({ title, value, subtitle, icon: Icon, color = "sky" }) {
  const colors = {
    sky: "text-sky-400 bg-sky-500/10",
    red: "text-red-400 bg-red-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    green: "text-green-400 bg-green-500/10",
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h3 className="text-3xl font-bold mt-2 text-white">
            {value}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>

        {Icon && (
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon size={20} />
=======
import React from 'react';
import './StatCard.css';

const StatCard = ({ title, icon: Icon, value, unit, highlightText, highlightColor, footerText, iconColor }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span>{title}</span>
        {Icon && <Icon size={16} className="stat-icon" style={{ color: iconColor || 'var(--color-brand)' }} />}
      </div>
      
      <div>
        <div className="stat-main">
          <span className="stat-value">{value}</span>
          {unit && <span className="stat-unit">{unit}</span>}
          {highlightText && (
            <span className="stat-highlight" style={{ color: highlightColor || 'var(--text-primary)' }}>
              {highlightText}
            </span>
          )}
        </div>
        
        {footerText && (
          <div className="stat-footer">
            {footerText}
>>>>>>> 27338845b2b4659db0d9f3aecb3a63a79a936a68
          </div>
        )}
      </div>
    </div>
  );
<<<<<<< HEAD
}

export default StatCard;
=======
};

export default StatCard;
>>>>>>> 27338845b2b4659db0d9f3aecb3a63a79a936a68
