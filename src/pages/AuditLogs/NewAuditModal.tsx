import React, { useState, useEffect } from 'react';
import Modal from '../../components/UI/Modal';
import { useUsers } from '../../hooks/useUsers';
import { useAssets } from '../../hooks/useAssets';
import { useSettings } from '../../hooks/useSettings';
import { auditService } from '../../services/auditService';
import styles from './NewAuditModal.module.css';

interface NewAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewAuditModal: React.FC<NewAuditModalProps> = ({ isOpen, onClose }) => {
  const { users } = useUsers();
  const { assets, loading: assetsLoading } = useAssets();
  const { settings } = useSettings();
  const categories = settings?.categories || [];

  const [scopeType, setScopeType] = useState<'Category' | 'Custom'>('Category');
  const [categoryScope, setCategoryScope] = useState('All Assets');
  const [customScope, setCustomScope] = useState('');
  const [auditorId, setAuditorId] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Automatically update total items when scope changes
  useEffect(() => {
    if (scopeType === 'Category') {
      if (categoryScope === 'All Assets') {
        setTotalItems(assets.length);
      } else {
        const count = assets.filter(a => a.category === categoryScope).length;
        setTotalItems(count);
      }
    }
  }, [scopeType, categoryScope, assets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalScope = scopeType === 'Category' ? categoryScope : customScope;
    if (!finalScope || !auditorId) return;
    if (totalItems <= 0 && !confirm("Starting an audit with 0 items. Are you sure?")) return;

    setLoading(true);
    try {
      const auditor = users.find(u => u.id === auditorId);
      const auditId = `#AU-${Math.floor(1000 + Math.random() * 9000)}`;
      
      await auditService.addAuditLog({
        auditId,
        scope: finalScope,
        auditor: auditor?.displayName || 'Unknown',
        auditorId,
        duration: '—',
        itemsScanned: 0,
        totalItems: totalItems,
        status: 'in-progress',
        notes
      });
      
      onClose();
      setScopeType('Category');
      setCategoryScope('All Assets');
      setCustomScope('');
      setAuditorId('');
      setNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start New Audit">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Audit Scope Type</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                checked={scopeType === 'Category'} 
                onChange={() => setScopeType('Category')} 
              />
              By Category
            </label>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                checked={scopeType === 'Custom'} 
                onChange={() => setScopeType('Custom')} 
              />
              Custom Scope
            </label>
          </div>
        </div>

        {scopeType === 'Category' ? (
          <div className={styles.field}>
            <label className={styles.label}>Select Category</label>
            <select 
              className={styles.select}
              value={categoryScope}
              onChange={(e) => setCategoryScope(e.target.value)}
              required
            >
              <option value="All Assets">All Assets</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        ) : (
          <div className={styles.field}>
            <label className={styles.label}>Custom Scope Name</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="e.g. Server Room A — Rack 1" 
              value={customScope}
              onChange={(e) => setCustomScope(e.target.value)}
              required
            />
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Assign Auditor</label>
          <select 
            className={styles.select} 
            value={auditorId}
            onChange={(e) => setAuditorId(e.target.value)}
            required
          >
            <option value="">Select an auditor...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.displayName}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            {scopeType === 'Category' ? 'Calculated Total Items' : 'Total Items to Audit'}
          </label>
          <div className={styles.inputWithHelper}>
            <input 
              type="number" 
              className={`${styles.input} ${scopeType === 'Category' ? styles.readOnlyInput : ''}`} 
              min="0"
              value={totalItems}
              onChange={(e) => setTotalItems(parseInt(e.target.value) || 0)}
              required
              readOnly={scopeType === 'Category'}
            />
            {scopeType === 'Category' && !assetsLoading && (
              <span className={styles.helperText}>
                Automatically detected {totalItems} items in {categoryScope}
              </span>
            )}
            {assetsLoading && <span className={styles.helperText}>Calculating items...</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Notes / Instructions</label>
          <textarea 
            className={styles.textarea} 
            placeholder="Add any specific instructions for this audit..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.submitBtn} disabled={loading || (scopeType === 'Category' && assetsLoading)}>
            {loading ? 'Starting...' : 'Start Audit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewAuditModal;
