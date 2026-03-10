import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  variant: 'green' | 'red' | 'yellow' | 'orange' | 'purple' | 'gray';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
