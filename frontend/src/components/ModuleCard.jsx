import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import './ModuleCard.css';

const ModuleCard = ({ title, description, icon: Icon, iconColor }) => {
  return (
    <div className="module-card">
      <div className="module-icon-wrapper">
        <Icon size={24} className="module-icon" style={{ color: iconColor || 'var(--color-brand)' }} />
      </div>
      <ArrowUpRight size={18} className="module-arrow" />
      <div className="module-content">
        <h3 className="module-title">{title}</h3>
        <p className="module-desc">{description}</p>
      </div>
    </div>
  );
};

export default ModuleCard;
