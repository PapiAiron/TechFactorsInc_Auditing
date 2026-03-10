import React from 'react';
import styles from './Toggle.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, description }) => {
  return (
    <div className={styles.container}>
      <div className={styles.text}>
        {label && <span className={styles.label}>{label}</span>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <button 
        className={`${styles.toggle} ${checked ? styles.active : ''}`}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <div className={styles.handle} />
      </button>
    </div>
  );
};

export default Toggle;
