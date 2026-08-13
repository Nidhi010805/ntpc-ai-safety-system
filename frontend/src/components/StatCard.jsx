import React from 'react';
import './StatCard.css';

const StatCard = ({
  title,
  icon: Icon,
  value,
  unit,
  highlightText,
  highlightColor,
  footerText,
  iconColor
}) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span>{title}</span>

        {Icon && (
          <Icon
            size={16}
            className="stat-icon"
            style={{ color: iconColor || 'var(--color-brand)' }}
          />
        )}
      </div>

      <div>
        <div className="stat-main">
          <span className="stat-value">{value}</span>

          {unit && (
            <span className="stat-unit">{unit}</span>
          )}

          {highlightText && (
            <span
              className="stat-highlight"
              style={{
                color: highlightColor || 'var(--text-primary)'
              }}
            >
              {highlightText}
            </span>
          )}
        </div>

        {footerText && (
          <div className="stat-footer">
            {footerText}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;