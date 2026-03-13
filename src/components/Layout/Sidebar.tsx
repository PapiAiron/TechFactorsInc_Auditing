import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Laptop, 
  ClipboardList, 
  BarChart3, 
  Users, 
  Server, 
  AlertTriangle, 
  QrCode, 
  Settings,
  ChevronRight,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { useAssets } from '../../hooks/useAssets';
import { useAlerts } from '../../hooks/useAlerts';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { assets } = useAssets();
  const { criticalCount } = useAlerts();
  const { logs } = useAuditLogs();
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const flaggedAudits = logs.filter(l => l.status === 'flagged').length;

  const handleLogout = async () => {
    await logout();
    navigate('/landing');
  };

  const handleNavLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { path: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { path: '/assets', icon: <Laptop size={18} />, label: 'IT Assets', badge: assets.length },
        { path: '/audit-logs', icon: <ClipboardList size={18} />, label: 'Audit Logs', badge: flaggedAudits > 0 ? flaggedAudits : undefined, badgeVariant: 'red' },
        { path: '/reports', icon: <BarChart3 size={18} />, label: 'Reports' },
      ]
    },
    {
      title: 'Manage',
      items: [
        { path: '/users', icon: <Users size={18} />, label: 'Users' },
        { path: '/alerts', icon: <AlertTriangle size={18} />, label: 'Alerts', badge: criticalCount > 0 ? criticalCount : undefined, badgeVariant: 'red' },
        { path: '/scanner', icon: <QrCode size={18} />, label: 'Tag Scanner' },
        { path: '/settings', icon: <Settings size={18} />, label: 'Settings' },
      ]
    }
  ];

  return (
    <>
      {/* semi-transparent overlay used on mobile/tablet when sidebar is open */}
      {isOpen && onClose && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div  className={styles.logo}>
          <img src='/src/public/img/logo.png' className={styles.imgLogo}></img>
          <span className={styles.logoTech}>tech</span>
          <span className={styles.logoFactors}>Factors</span>
          <span className={styles.logoInc}>Inc</span>
        </div>

      <nav className={styles.nav}>
        {navGroups.map((group, idx) => (
          <div key={idx} className={styles.navGroup}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul className={styles.navList}>
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                    onClick={handleNavLinkClick}
                  >
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.label}>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`${styles.badge} ${item.badgeVariant === 'red' ? styles.badgeRed : ''}`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={styles.chevron} size={14} />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.userSection}>
        {showUserMenu && (
          <div className={styles.userMenu}>
            <button className={styles.menuItem} onClick={() => { navigate('/settings'); setShowUserMenu(false); handleNavLinkClick(); }}>
              <UserIcon size={16} />
              <span>Account Settings</span>
            </button>
            <button className={`${styles.menuItem} ${styles.logoutBtn}`} onClick={() => { handleLogout(); handleNavLinkClick(); }}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
        <div className={styles.userRow} onClick={() => setShowUserMenu(!showUserMenu)}>
          <div className={styles.avatar} style={{ background: userData?.avatarGradient || 'var(--accent)' }}>
            {userData?.initials || '??'}
            <div className={`${styles.statusDot} ${styles.online}`} />
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{userData?.displayName || 'User'}</p>
            <p className={styles.userRole}>{userData?.role || 'Auditor'}</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};
