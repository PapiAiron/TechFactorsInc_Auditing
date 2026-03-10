import React, { useState } from 'react';
import { ClipboardCheck, Clock, AlertTriangle, Filter, Plus } from 'lucide-react';
import StatCard from '../../components/UI/StatCard';
import DataTable from '../../components/UI/DataTable';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import NewAuditModal from './NewAuditModal';
import styles from './AuditLogs.module.css';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import { formatDate, formatTime } from '../../utils/formatters';

const AuditLogs: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'completed' | 'in-progress' | 'flagged'>('All');
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);
  
  const { logs, loading } = useAuditLogs();

  const filteredLogs = filter === 'All' ? logs : logs.filter(l => l.status === filter);

  const completedThisMonth = logs.filter(l => {
    if (!l.startedAt) return false;
    const date = l.startedAt.toDate();
    const now = new Date();
    return l.status === 'completed' && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const inProgressCount = logs.filter(l => l.status === 'in-progress').length;
  const flaggedCount = logs.filter(l => l.status === 'flagged').length;

  const columns = [
    { key: 'auditId', label: 'Audit ID', render: (val: string) => <span className={styles.mono}>{val}</span> },
    { key: 'scope', label: 'Scope' },
    { key: 'auditor', label: 'Auditor' },
    { key: 'startedAt', label: 'Started', render: (val: any) => (
      <div className={styles.dateTime}>
        <span>{formatDate(val)}</span>
        <span className={styles.time}>{formatTime(val)}</span>
      </div>
    )},
    { key: 'duration', label: 'Duration', render: (val: string) => <span className={styles.mono}>{val}</span> },
    { key: 'itemsScanned', label: 'Items', render: (_: any, row: any) => {
      const scanned = row.itemsScanned || 0;
      const total = row.totalItems || 0;
      return (
        <div className={styles.itemsCell}>
          <span className={styles.itemsCount}>{scanned} / {total}</span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${total > 0 ? (scanned / total) * 100 : 0}%` }} 
            />
          </div>
        </div>
      );
    }},
    { key: 'status', label: 'Status', render: (val: string) => (
      <Badge variant={val === 'completed' ? 'green' : val === 'in-progress' ? 'orange' : 'red'}>
        {val}
      </Badge>
    )}
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Audit Logs</h2>
          <p className={styles.subtitle}>Track and manage IT asset verification history.</p>
        </div>
        <button className={styles.startBtn} onClick={() => setIsNewAuditModalOpen(true)}>
          <Plus size={18} />
          <span>Start New Audit</span>
        </button>
      </div>

      <div className={styles.statsGrid}>
        <StatCard 
          label="Completed This Month" 
          value={completedThisMonth} 
          icon={<ClipboardCheck size={20} />} 
          accentColor="var(--green)"
        />
        <StatCard 
          label="In Progress" 
          value={inProgressCount} 
          icon={<Clock size={20} />} 
          accentColor="var(--accent)"
        />
        <StatCard 
          label="With Discrepancies" 
          value={flaggedCount} 
          icon={<AlertTriangle size={20} />} 
          accentColor="var(--red)"
        />
      </div>

      <div className={styles.card}>
        <div className={styles.tableHeader}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${filter === 'All' ? styles.active : ''}`}
              onClick={() => setFilter('All')}
            >
              All Logs
            </button>
            <button 
              className={`${styles.tab} ${filter === 'completed' ? styles.active : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button 
              className={`${styles.tab} ${filter === 'in-progress' ? styles.active : ''}`}
              onClick={() => setFilter('in-progress')}
            >
              In Progress
            </button>
            <button 
              className={`${styles.tab} ${filter === 'flagged' ? styles.active : ''}`}
              onClick={() => setFilter('flagged')}
            >
              Flagged
            </button>
          </div>
          <button className={styles.iconBtn}><Filter size={16} /></button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <DataTable columns={columns} data={filteredLogs} />
        )}
      </div>

      <NewAuditModal 
        isOpen={isNewAuditModalOpen} 
        onClose={() => setIsNewAuditModalOpen(false)} 
      />
    </div>
  );
};

export default AuditLogs;
