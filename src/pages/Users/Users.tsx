import React, { useState } from 'react';
import { Plus, Mail, Shield, ClipboardList, Clock } from 'lucide-react';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Badge from '../../components/UI/Badge';
import AddUserModal from './AddUserModal';
import styles from './Users.module.css';
import { useUsers } from '../../hooks/useUsers';

const Users: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { users, loading } = useUsers();

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>System Users</h2>
          <p className={styles.subtitle}>Manage auditors and administrators for the IT auditing system.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </div>

      <div className={styles.grid}>
        {users.map((user) => (
          <div key={user.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar} style={{ background: user.avatarGradient }}>
                {user.initials}
                <div className={`${styles.statusDot} ${styles[user.onlineStatus]}`} />
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>{user.displayName}</h3>
                <p className={styles.userRole}>{user.role}</p>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <Mail size={14} className={styles.infoIcon} />
                <span>{user.email}</span>
              </div>
              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <ClipboardList size={14} />
                  <div className={styles.statInfo}>
                    <span className={styles.statValue}>{user.auditsCompleted}</span>
                    <span className={styles.statLabel}>Completed</span>
                  </div>
                </div>
                <div className={styles.stat}>
                  <Clock size={14} />
                  <div className={styles.statInfo}>
                    <span className={styles.statValue}>{user.openAudits}</span>
                    <span className={styles.statLabel}>Open</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <Badge variant={user.onlineStatus === 'online' ? 'green' : user.onlineStatus === 'in-audit' ? 'orange' : 'gray'}>
                {user.onlineStatus.replace('-', ' ')}
              </Badge>
              <button className={styles.editBtn} onClick={() => setSelectedUser(user)}>Edit Profile</button>
            </div>
          </div>
        ))}
      </div>

      <AddUserModal 
        isOpen={isAddModalOpen || !!selectedUser} 
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedUser(null);
        }} 
        initialData={selectedUser}
      />
    </div>
  );
};

export default Users;
