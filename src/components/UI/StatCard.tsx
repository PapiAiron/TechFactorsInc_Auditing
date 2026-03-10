import React from 'react';
import styles from './StatCard.module.css';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'up' | 'down' | 'warn';
  icon: React.ReactNode;
  accentColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, delta, deltaType, icon, accentColor }) => {
  return (
    <div className={styles.card} style={{ borderTop: `3px solid ${accentColor || 'var(--accent)'}` }}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <div className={styles.iconWrapper} style={{ color: accentColor }}>
          {icon}
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.value}>{value}</h3>
        {delta && (
          <div className={`${styles.delta} ${deltaType ? styles[deltaType] : ''}`}>
            {deltaType === 'up' && <TrendingUp size={14} />}
            {deltaType === 'down' && <TrendingDown size={14} />}
            {deltaType === 'warn' && <AlertCircle size={14} />}
            <span>{delta}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
