import React from 'react';
import { Asset } from '../../types';
import Badge from '../UI/Badge';
import styles from './ScanResult.module.css';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface ScanResultProps {
  asset: Asset | null;
  tag: string;
  onAudit: () => void;
  onFlag: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({ asset, tag, onAudit, onFlag }) => {
  if (!tag) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🔍</div>
        <h3>Ready to Scan</h3>
        <p>Position an asset tag or barcode within the viewport or enter a tag manually.</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className={`${styles.card} ${styles.notFound}`}>
        <div className={styles.header}>
          <div className={styles.statusIcon}><XCircle size={24} /></div>
          <div className={styles.headerText}>
            <h3>Asset Not Found</h3>
            <p>Tag: <span className={styles.mono}>{tag}</span></p>
          </div>
        </div>
        <div className={styles.body}>
          <p>This tag does not match any records in the IT asset inventory. Please verify the tag or add it as a new asset.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.assetIcon}>{asset.icon}</div>
        <div className={styles.headerText}>
          <h3>{asset.name}</h3>
          <p className={styles.mono}>{asset.tag}</p>
        </div>
        <Badge variant={asset.status === 'Active' ? 'green' : asset.status === 'Low Stock' ? 'yellow' : 'red'}>
          {asset.status}
        </Badge>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.label}>Category</span>
          <span className={styles.value}>{asset.category}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Assigned To</span>
          <span className={styles.value}>{asset.assignedTo}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Last Audited</span>
          <span className={styles.value}>{formatDate(asset.lastAuditDate)}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Specs</span>
          <span className={styles.value}>{asset.spec}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.auditBtn} onClick={onAudit}>
          <CheckCircle size={18} />
          <span>Mark Audited</span>
        </button>
        <button className={styles.flagBtn} onClick={onFlag}>
          <AlertTriangle size={18} />
          <span>Flag Issue</span>
        </button>
      </div>
    </div>
  );
};

const XCircle = ({ size, color }: { size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
  </svg>
);

export default ScanResult;
