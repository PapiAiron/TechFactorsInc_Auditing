import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  ClipboardList, 
  Save, 
  Database,
  CheckCircle2,
  User as UserIcon,
  Layers,
  Trash2,
  Plus
} from 'lucide-react';
import Toggle from '../../components/UI/Toggle';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import styles from './Settings.module.css';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { seedAll } from '../../utils/seedFirestore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Account');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { settings, loading, updateSettings } = useSettings();
  const { user, userData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
  });
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (userData) {
      setProfileData({
        displayName: userData.displayName || '',
        email: userData.email || '',
      });
    }
  }, [userData]);

  if (loading || !settings) return <LoadingSpinner />;

  const handleSave = async () => {
    try {
      if (activeTab === 'Account') {
        if (!user) return;
        await updateDoc(doc(db, 'users', user.uid), {
          displayName: profileData.displayName,
        });
      } else {
        await updateSettings(settings);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeed = async () => {
    if (window.confirm('This will populate your database with sample data. Continue?')) {
      await seedAll();
      alert('Database seeded successfully!');
    }
  };

  const tabs = [
    { id: 'Account', icon: <UserIcon size={18} /> },
    { id: 'General', icon: <SettingsIcon size={18} /> },
    { id: 'Categories', icon: <Layers size={18} /> },
    { id: 'Notifications', icon: <Bell size={18} /> },
    { id: 'Security', icon: <Shield size={18} /> },
    { id: 'Audit Rules', icon: <ClipboardList size={18} /> },
  ];

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim() || !settings) return;
    if (settings.categories.includes(newCategory.trim())) {
      alert('Category already exists');
      return;
    }
    updateSettings({ categories: [...settings.categories, newCategory.trim()] });
    setNewCategory('');
  };

  const handleRemoveCategory = (cat: string) => {
    if (!settings) return;
    if (window.confirm(`Are you sure you want to remove the "${cat}" category?`)) {
      updateSettings({ categories: settings.categories.filter(c => c !== cat) });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <aside className={styles.subnav}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.id}</span>
            </button>
          ))}
          
          {process.env.NODE_ENV === 'development' && (
            <button className={styles.seedBtn} onClick={handleSeed}>
              <Database size={16} />
              <span>Seed Sample Data</span>
            </button>
          )}
        </aside>

        <main className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{activeTab} Settings</h2>
              <button className={styles.saveBtn} onClick={handleSave}>
                {saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
                <span>{saveSuccess ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </div>

            <div className={styles.cardBody}>
              {activeTab === 'Account' && (
                <div className={styles.form}>
                  <div className={styles.profileHeader}>
                    <div className={styles.profileAvatar} style={{ background: userData?.avatarGradient }}>
                      {userData?.initials}
                    </div>
                    <div className={styles.profileInfo}>
                      <h3>{userData?.displayName}</h3>
                      <p>{userData?.role}</p>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Full Name</label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email Address</label>
                    <input 
                      type="email" 
                      className={styles.input} 
                      value={profileData.email}
                      disabled
                    />
                    <p className={styles.fieldHint}>Email cannot be changed directly.</p>
                  </div>
                </div>
              )}

              {activeTab === 'General' && (
                <div className={styles.form}>
                  <div className={styles.field}>
                    <label className={styles.label}>Company Name</label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      value={settings.companyName}
                      onChange={(e) => updateSettings({ companyName: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>IT Support Email</label>
                    <input 
                      type="email" 
                      className={styles.input} 
                      value={settings.itEmail}
                      onChange={(e) => updateSettings({ itEmail: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Asset Tag Prefix</label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      value={settings.tagPrefix}
                      onChange={(e) => updateSettings({ tagPrefix: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Fiscal Year Start</label>
                    <input 
                      type="date" 
                      className={styles.input} 
                      value={settings.fiscalYearStart}
                      onChange={(e) => updateSettings({ fiscalYearStart: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>System Theme</label>
                    <div className={styles.themeToggle}>
                      <button 
                        className={`${styles.themeBtn} ${theme === 'light' ? styles.activeTheme : ''}`}
                        onClick={toggleTheme}
                      >
                        Light
                      </button>
                      <button 
                        className={`${styles.themeBtn} ${theme === 'dark' ? styles.activeTheme : ''}`}
                        onClick={toggleTheme}
                      >
                        Dark
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Categories' && (
                <div className={styles.form}>
                  <p className={styles.fieldHint} style={{ marginBottom: '16px' }}>
                    Manage asset categories available across the system.
                  </p>
                  
                  <div className={styles.categoryList}>
                    {settings.categories.map(cat => (
                      <div key={cat} className={styles.categoryItem}>
                        <span className={styles.categoryName}>{cat}</span>
                        <button 
                          className={styles.removeBtn}
                          onClick={() => handleRemoveCategory(cat)}
                          title="Remove category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <form className={styles.addCategoryForm} onSubmit={handleAddCategory}>
                    <input 
                      type="text" 
                      className={`${styles.input} ${styles.addCategoryInput}`}
                      placeholder="New category name..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button type="submit" className={styles.addCategoryBtn}>
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'Notifications' && (
                <div className={styles.toggleList}>
                  <Toggle 
                    label="Email Alerts" 
                    description="Receive critical system alerts via email."
                    checked={settings.notifications.emailAlerts}
                    onChange={(v) => updateSettings({ notifications: { ...settings.notifications, emailAlerts: v } })}
                  />
                  <Toggle 
                    label="Low Stock Warnings" 
                    description="Notify when asset quantities fall below thresholds."
                    checked={settings.notifications.lowStockWarnings}
                    onChange={(v) => updateSettings({ notifications: { ...settings.notifications, lowStockWarnings: v } })}
                  />
                  <Toggle 
                    label="Audit Due Reminders" 
                    description="Send reminders for upcoming or overdue audits."
                    checked={settings.notifications.auditDueReminders}
                    onChange={(v) => updateSettings({ notifications: { ...settings.notifications, auditDueReminders: v } })}
                  />
                  <Toggle 
                    label="License Expiry Alerts" 
                    description="Notify 30 days before software licenses expire."
                    checked={settings.notifications.licenseExpiryAlerts}
                    onChange={(v) => updateSettings({ notifications: { ...settings.notifications, licenseExpiryAlerts: v } })}
                  />
                  <Toggle 
                    label="Discrepancy Digest" 
                    description="Weekly summary of all audit discrepancies."
                    checked={settings.notifications.discrepancyDigest}
                    onChange={(v) => updateSettings({ notifications: { ...settings.notifications, discrepancyDigest: v } })}
                  />
                </div>
              )}

              {activeTab === 'Security' && (
                <div className={styles.form}>
                  <Toggle 
                    label="Audit Trail Logging" 
                    description="Keep detailed logs of all system changes."
                    checked={settings.security.auditTrailLogging}
                    onChange={(v) => updateSettings({ security: { ...settings.security, auditTrailLogging: v } })}
                  />
                  <div className={styles.field} style={{ marginTop: '16px' }}>
                    <label className={styles.label}>Minimum Password Length</label>
                    <input 
                      type="number" 
                      className={styles.input} 
                      value={settings.security.minPasswordLength}
                      onChange={(e) => updateSettings({ security: { ...settings.security, minPasswordLength: parseInt(e.target.value) } })}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'Audit Rules' && (
                <div className={styles.form}>
                  <div className={styles.field}>
                    <label className={styles.label}>Audit Frequency (Days)</label>
                    <input 
                      type="number" 
                      className={styles.input} 
                      value={settings.auditRules.frequencyDays}
                      onChange={(e) => updateSettings({ auditRules: { ...settings.auditRules, frequencyDays: parseInt(e.target.value) } })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Low Stock Threshold (%)</label>
                    <input 
                      type="number" 
                      className={styles.input} 
                      value={settings.auditRules.lowStockThresholdPercent}
                      onChange={(e) => updateSettings({ auditRules: { ...settings.auditRules, lowStockThresholdPercent: parseInt(e.target.value) } })}
                    />
                  </div>
                  <Toggle 
                    label="Auto-Flag on Mismatch" 
                    description="Automatically flag assets if scanned tag doesn't match location."
                    checked={settings.auditRules.autoFlagOnMismatch}
                    onChange={(v) => updateSettings({ auditRules: { ...settings.auditRules, autoFlagOnMismatch: v } })}
                  />
                  <Toggle 
                    label="Require Photo Proof" 
                    description="Auditors must upload a photo for each scanned asset."
                    checked={settings.auditRules.requirePhotoProof}
                    onChange={(v) => updateSettings({ auditRules: { ...settings.auditRules, requirePhotoProof: v } })}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
