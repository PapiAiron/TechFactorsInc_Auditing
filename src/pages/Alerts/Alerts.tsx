import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, Filter, CheckCircle } from 'lucide-react';
import StatCard from '../../components/UI/StatCard';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import styles from './Alerts.module.css';
import { useAlerts } from '../../hooks/useAlerts';
import { alertService } from '../../services/alertService';
import { formatRelativeTime } from '../../utils/formatters';

const Alerts: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'critical' | 'warning' | 'info'>('All');
  const { alerts, criticalCount, warningCount, infoCount, loading } = useAlerts();

  const filteredAlerts = filter === 'All' ? alerts : alerts.filter(a => a.severity === filter);

  const handleResolve = async (id: string) => {
    try {
      await alertService.resolveAlert(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <StatCard 
          label="Critical" 
          value={criticalCount} 
          icon={<AlertCircle size={20} />} 
          accentColor="var(--red)"
        />
        <StatCard 
          label="Warnings" 
          value={warningCount} 
          icon={<AlertTriangle size={20} />} 
          accentColor="var(--yellow)"
        />
        <StatCard 
          label="Informational" 
          value={infoCount} 
          icon={<Info size={20} />} 
          accentColor="var(--accent)"
        />
      </div>

      <div className={styles.card}>
        <div className={styles.tableHeader}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${filter === 'All' ? styles.active : ''}`}
              onClick={() => setFilter('All')}
            >
              All Alerts
            </button>
            <button 
              className={`${styles.tab} ${filter === 'critical' ? styles.active : ''}`}
              onClick={() => setFilter('critical')}
            >
              Critical
            </button>
            <button 
              className={`${styles.tab} ${filter === 'warning' ? styles.active : ''}`}
              onClick={() => setFilter('warning')}
            >
              Warnings
            </button>
            <button 
              className={`${styles.tab} ${filter === 'info' ? styles.active : ''}`}
              onClick={() => setFilter('info')}
            >
              Info
            </button>
          </div>
          <button className={styles.iconBtn}><Filter size={16} /></button>
        </div>

        <div className={styles.alertList}>
          {filteredAlerts.length === 0 ? (
            <div className={styles.empty}>No active alerts found.</div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className={styles.alertItem}>
                <div className={`${styles.severityIcon} ${styles[alert.severity]}`}>
                  {alert.severity === 'critical' ? <AlertCircle size={20} /> : 
                   alert.severity === 'warning' ? <AlertTriangle size={20} /> : <Info size={20} />}
                </div>
                <div className={styles.alertContent}>
                  <div className={styles.alertHeader}>
                    <h3 className={styles.alertTitle}>{alert.title}</h3>
                    <Badge variant={alert.severity === 'critical' ? 'red' : alert.severity === 'warning' ? 'yellow' : 'orange'}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className={styles.alertDescription}>{alert.description}</p>
                  <div className={styles.alertFooter}>
                    <span className={styles.alertTime}>{formatRelativeTime(alert.createdAt)}</span>
                    {alert.relatedAssetTag && (
                      <span className={styles.relatedAsset}>
                        Related Asset: <strong>{alert.relatedAssetTag}</strong>
                      </span>
                    )}
                  </div>
                </div>
                <button className={styles.resolveBtn} onClick={() => handleResolve(alert.id)}>
                  <CheckCircle size={18} />
                  <span>Resolve</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
