import React, { useState, useEffect } from 'react';
import Modal from '../../components/UI/Modal';
import { assetService } from '../../services/assetService';
import { useSettings } from '../../hooks/useSettings';
import { Asset, AssetCategory, AssetStatus } from '../../types';
import { ASSET_STATUSES } from '../../utils/constants';
import styles from './AddAssetModal.module.css';
import { Trash2, RefreshCw } from 'lucide-react';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Asset;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose, initialData }) => {
  const { settings } = useSettings();
  const categories = settings?.categories || [];

  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    icon: '💻',
    category: 'Laptops' as AssetCategory,
    assignedTo: '',
    qty: 1,
    status: 'Active' as AssetStatus,
    spec: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        tag: initialData.tag,
        icon: initialData.icon,
        category: initialData.category,
        assignedTo: initialData.assignedTo,
        qty: initialData.qty,
        status: initialData.status,
        spec: initialData.spec,
      });
    } else {
      // Auto-generate tag for new assets
      const randomId = Math.floor(10000 + Math.random() * 90000);
      setFormData({
        name: '',
        tag: `IT-${randomId}`,
        icon: '💻',
        category: 'Laptops',
        assignedTo: '',
        qty: 1,
        status: 'Active',
        spec: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await assetService.updateAsset(initialData.id, formData);
      } else {
        await assetService.addAsset({
          ...formData,
          lastAuditDate: null as any,
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData) return;
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setLoading(true);
      try {
        await assetService.deleteAsset(initialData.id);
        onClose();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Asset' : 'Add New Asset'} maxWidth="600px">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Asset Name</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className={styles.field} style={{ width: '80px' }}>
            <label className={styles.label}>Icon</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              required
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Asset Tag</label>
            <div className={styles.tagInputWrapper}>
              <input 
                type="text" 
                className={styles.input} 
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value.toUpperCase() })}
                required
              />
              <button 
                type="button" 
                className={styles.refreshBtn} 
                onClick={() => setFormData({ ...formData, tag: `IT-${Math.floor(10000 + Math.random() * 90000)}` })}
                title="Generate new tag"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select 
              className={styles.select}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as AssetCategory })}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Assigned To</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Quantity</label>
            <input 
              type="number" 
              className={styles.input} 
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select 
            className={styles.select}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as AssetStatus })}
          >
            {ASSET_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Hardware Specifications</label>
          <textarea 
            className={styles.textarea}
            value={formData.spec}
            onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
            placeholder="e.g. i7-1365U, 32GB RAM, 512GB SSD"
          />
        </div>

        <div className={styles.actions}>
          {initialData && (
            <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
              <Trash2 size={18} />
              <span>Delete</span>
            </button>
          )}
          <div className={styles.rightActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : initialData ? 'Update Asset' : 'Add Asset'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddAssetModal;
