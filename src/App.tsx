import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import styles from './App.module.css';
import NewAuditModal from './pages/AuditLogs/NewAuditModal';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/UI/LoadingSpinner';

const App: React.FC = () => {
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/landing');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className={styles.loadingWrapper}><LoadingSpinner /></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.app}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar onNewAudit={() => setIsNewAuditModalOpen(true)} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      <NewAuditModal 
        isOpen={isNewAuditModalOpen} 
        onClose={() => setIsNewAuditModalOpen(false)} 
      />
    </div>
  );
};

export default App;
