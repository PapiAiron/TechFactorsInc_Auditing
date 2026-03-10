import React, { useState, useEffect } from 'react';
import Modal from '../../components/UI/Modal';
import { userService } from '../../services/userService';
import { USER_ROLES } from '../../utils/constants';
import { User } from '../../types';
import styles from './AddUserModal.module.css';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: User;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    role: 'Auditor',
    avatarGradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        displayName: initialData.displayName,
        email: initialData.email,
        role: initialData.role,
        avatarGradient: initialData.avatarGradient
      });
    } else {
      setFormData({
        displayName: '',
        email: '',
        role: 'Auditor',
        avatarGradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const initials = formData.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
      
      if (initialData) {
        await userService.updateUser(initialData.id, {
          displayName: formData.displayName,
          email: formData.email,
          role: formData.role,
          initials,
          avatarGradient: formData.avatarGradient
        });
      } else {
        const id = `user-${Math.random().toString(36).substr(2, 9)}`;
        await userService.createUser({
          id,
          displayName: formData.displayName,
          email: formData.email,
          role: formData.role,
          initials,
          avatarGradient: formData.avatarGradient,
          auditsCompleted: 0,
          openAudits: 0,
          onlineStatus: 'offline'
        });
      }
      
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Full Name</label>
          <input 
            type="text" 
            className={styles.input} 
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email Address</label>
          <input 
            type="email" 
            className={styles.input} 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>System Role</label>
          <select 
            className={styles.select}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            {USER_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Avatar Theme</label>
          <div className={styles.gradients}>
            {[
              'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
              'linear-gradient(135deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)',
              'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
              'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
            ].map(grad => (
              <button 
                key={grad}
                type="button"
                className={`${styles.gradBtn} ${formData.avatarGradient === grad ? styles.active : ''}`}
                style={{ background: grad }}
                onClick={() => setFormData({ ...formData, avatarGradient: grad })}
              />
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
