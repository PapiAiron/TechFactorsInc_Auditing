import React from 'react';
import { ScanSession } from '../../types';
import Badge from '../UI/Badge';
import styles from './ScanHistory.module.css';
import { formatTime } from '../../utils/formatters';

interface ScanHistoryProps {
  history: ScanSession[];
  onClear: () => void;
  onSelect: (tag: string) => void;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ history, onClear, onSelect }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Session History</h3>
        <button className={styles.clearBtn} onClick={onClear}>Clear</button>
      </div>

      <div className={styles.list}>
        {history.length === 0 ? (
          <div className={styles.empty}>No scans in this session</div>
        ) : (
          history.map((scan) => (
            <div 
              key={scan.id} 
              className={styles.item}
              onClick={() => onSelect(scan.assetTag)}
            >
              <div className={styles.itemLeft}>
                <span className={styles.icon}>{scan.found ? '📦' : '❓'}</span>
                <div className={styles.info}>
                  <p className={styles.name}>{scan.assetName || 'Unknown Asset'}</p>
                  <p className={styles.tag}>{scan.assetTag}</p>
                </div>
              </div>
              <div className={styles.itemRight}>
                <Badge variant={scan.found ? 'green' : 'red'}>
                  {scan.found ? 'Found' : 'Missing'}
                </Badge>
                <span className={styles.time}>{formatTime(scan.scannedAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScanHistory;
