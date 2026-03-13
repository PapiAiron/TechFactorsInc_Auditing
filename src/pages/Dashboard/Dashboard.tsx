import React, { useState } from 'react';
import { Laptop, ClipboardCheck, AlertCircle, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import StatCard from '../../components/UI/StatCard';
import DataTable from '../../components/UI/DataTable';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import styles from './Dashboard.module.css';
import { useAssets } from '../../hooks/useAssets';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import { useAlerts } from '../../hooks/useAlerts';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

const Dashboard: React.FC = () => {
  const { assets, loading: assetsLoading } = useAssets();
  const { logs, loading: logsLoading } = useAuditLogs();
  const { alerts, loading: alertsLoading, criticalCount } = useAlerts();
  const [assetFilter, setAssetFilter] = useState<'All' | 'Low Stock' | 'Flagged'>('All');

  if (assetsLoading || logsLoading || alertsLoading) {
    return <LoadingSpinner />;
  }

  const lowStockCount = assets.filter(a => a.status === 'Low Stock').length;
  const flaggedCount = assets.filter(a => a.status === 'Flagged').length;
  const completedThisMonth = logs.filter(l => {
    if (!l.startedAt) return false;
    const date = l.startedAt.toDate();
    const now = new Date();
    return l.status === 'completed' && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const filteredAssets = assetFilter === 'All' 
    ? assets 
    : assets.filter(a => a.status === assetFilter);

  const assetColumns = [
    { key: 'name', label: 'Asset Name', render: (val: string, row: any) => (
      <div className={styles.assetCell}>
        <span className={styles.assetIcon}>{row.icon}</span>
        <span>{val}</span>
      </div>
    )},
    { key: 'tag', label: 'Tag', render: (val: string) => <span className={styles.mono}>{val}</span> },
    { key: 'category', label: 'Category' },

    { key: 'status', label: 'Status', render: (val: string) => (
      <Badge variant={
        val === 'Active' || val === 'Complete' ? 'green' : 
        val === 'Low Stock' ? 'yellow' : 
        'red' // Defaulting others/Incomplete to Red
      }>
        {val}
      </Badge>
    )},

    { key: 'lastAuditDate', label: 'Last Audited', render: (val: any) => formatDate(val) }
  ];

  // Group audit logs by day for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const auditVolumeData = last7Days.map(dateStr => {
    const count = logs.filter(l => l.startedAt && l.startedAt.toDate().toISOString().split('T')[0] === dateStr).length;
    return { date: dateStr, count };
  });

  const maxAuditCount = Math.max(...auditVolumeData.map(d => d.count), 1);

  // Category distribution
  const categories = [...new Set(assets.map(a => a.category))];
  const categoryData = categories.map(cat => ({
    name: cat,
    count: assets.filter(a => a.category === cat).length,
    percent: Math.round((assets.filter(a => a.category === cat).length / assets.length) * 100)
  })).sort((a, b) => b.count - a.count);

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        <StatCard 
          label="Total IT Assets" 
          value={assets.length} 
          delta="+4.2%" 
          deltaType="up" 
          icon={<Laptop size={20} />} 
          accentColor="var(--accent)"
        />
        <StatCard 
          label="Audits This Month" 
          value={completedThisMonth} 
          delta="+12%" 
          deltaType="up" 
          icon={<ClipboardCheck size={20} />} 
          accentColor="var(--green)"
        />
        <StatCard 
          label="Discrepancies" 
          value={flaggedCount} 
          delta="-2" 
          deltaType="down" 
          icon={<AlertCircle size={20} />} 
          accentColor="var(--yellow)"
        />
        <StatCard 
          label="Critical Alerts" 
          value={criticalCount} 
          delta="+1" 
          deltaType="warn" 
          icon={<AlertTriangle size={20} />} 
          accentColor="var(--red)"
        />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Asset Overview</h2>
              <div className={styles.tabs}>
                <button 
                  className={`${styles.tab} ${assetFilter === 'All' ? styles.active : ''}`}
                  onClick={() => setAssetFilter('All')}
                >
                  All
                </button>
                <button 
                  className={`${styles.tab} ${assetFilter === 'Low Stock' ? styles.active : ''}`}
                  onClick={() => setAssetFilter('Low Stock')}
                >
                  Low Stock
                </button>
                <button 
                  className={`${styles.tab} ${assetFilter === 'Flagged' ? styles.active : ''}`}
                  onClick={() => setAssetFilter('Flagged')}
                >
                  Flagged
                </button>
              </div>
            </div>
            <div className={styles.card}>
              <DataTable columns={assetColumns} data={filteredAssets.slice(0, 6)} />
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Audit Volume (Last 7 Days)</h2>
            <div className={styles.card}>
              <div className={styles.barChart}>
                {auditVolumeData.map((d, i) => (
                  <div key={i} className={styles.barWrapper}>
                    <div 
                      className={styles.bar} 
                      style={{ height: `${(d.count / maxAuditCount) * 100}%` }}
                    >
                      <div className={styles.barTooltip}>{d.count} Audits</div>
                    </div>
                    <span className={styles.barLabel}>{new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className={styles.rightCol}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Audit Activity</h2>
            <div className={styles.card}>
              <div className={styles.activityList}>
                {logs.slice(0, 6).map((log) => (
                  <div key={log.id} className={styles.activityItem}>
                    <div className={`${styles.activityIcon} ${styles[log.status]}`}>
                      {log.status === 'completed' ? <ClipboardCheck size={16} /> : <AlertCircle size={16} />}
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>
                        <strong>{log.auditor}</strong> {log.status === 'completed' ? 'completed' : 'started'} audit <strong>{log.auditId}</strong>
                      </p>
                      <p className={styles.activityMeta}>{formatRelativeTime(log.startedAt)} · {log.scope}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Asset Distribution</h2>
            <div className={styles.card}>
              <div className={styles.donutSection}>
                <div className={styles.donutWrapper}>
                  <svg viewBox="0 0 36 36" className={styles.donut}>
                    <path className={styles.donutRing} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    {categoryData.slice(0, 3).map((cat, i) => {
                      const total = categoryData.reduce((acc, curr) => acc + curr.count, 0);
                      const offset = categoryData.slice(0, i).reduce((acc, curr) => acc + (curr.count / total) * 100, 0);
                      return (
                        <path 
                          key={i}
                          className={styles.donutSegment}
                          style={{ stroke: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--purple)' : 'var(--green)' }}
                          strokeDasharray={`${cat.percent} ${100 - cat.percent}`}
                          strokeDashoffset={-offset}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      );
                    })}
                  </svg>
                  <div className={styles.donutText}>
                    <span className={styles.donutValue}>{assets.length}</span>
                    <span className={styles.donutLabel}>Assets</span>
                  </div>
                </div>
                <div className={styles.donutLegend}>
                  {categoryData.slice(0, 4).map((cat, i) => (
                    <div key={i} className={styles.legendItem}>
                      <div className={styles.legendDot} style={{ background: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--purple)' : i === 2 ? 'var(--green)' : 'var(--muted)' }} />
                      <span className={styles.legendName}>{cat.name}</span>
                      <span className={styles.legendValue}>{cat.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Active Alerts</h2>
            <div className={styles.card}>
              <div className={styles.alertList}>
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className={styles.alertItem}>
                    <div className={`${styles.alertIndicator} ${styles[alert.severity]}`} />
                    <div className={styles.alertContent}>
                      <h4 className={styles.alertTitle}>{alert.title}</h4>
                      <p className={styles.alertMeta}>{formatRelativeTime(alert.createdAt)}</p>
                    </div>
                    <ArrowUpRight size={16} className={styles.alertLink} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
