import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Download, Plus } from 'lucide-react';
import styles from './Topbar.module.css';
import { useAlerts } from '../../hooks/useAlerts';

interface TopbarProps {
  onNewAudit?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onNewAudit }) => {
  const location = useLocation();
  const { alerts } = useAlerts();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path === '/assets') return 'IT Asset Inventory';
    if (path === '/audit-logs') return 'Audit Logs & History';
    if (path === '/reports') return 'System Reports';
    if (path === '/users') return 'User Management';
    if (path === '/server-rooms') return 'Server Room Monitoring';
    if (path === '/alerts') return 'System Alerts';
    if (path === '/scanner') return 'Tag Scanner';
    if (path === '/settings') return 'System Settings';
    return 'Dashboard';
  };

  const hasCriticalAlerts = alerts.some(a => a.severity === 'critical');

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.title}>{getPageTitle()}</h1>
      </div>

      <div className={styles.right}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search assets, tags, or users..." className={styles.searchInput} />
        </div>

        <div className={styles.actions}>
          <button className={styles.iconBtn} title="Export Data">
            <Download size={20} />
          </button>
          
          <button className={styles.iconBtn} title="Notifications">
            <Bell size={20} />
            {hasCriticalAlerts && <div className={styles.notificationPip} />}
          </button>

          <button className={styles.primaryBtn} onClick={onNewAudit}>
            <Plus size={18} />
            <span>New Audit</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
