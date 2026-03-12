import React, { useState } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import DataTable from '../../components/UI/DataTable';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import AddAssetModal from './AddAssetModal';
import styles from './Assets.module.css';
import { useAssets } from '../../hooks/useAssets';
import { formatDate } from '../../utils/formatters';
import { CATEGORIES } from '../../utils/constants';

const Assets: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const { assets, loading } = useAssets({ 
    category: selectedCategory as any,
    searchQuery 
  });

  const columns = [
    { key: 'name', label: 'Asset Name', render: (val: string, row: any) => (
      <div className={styles.assetCell}>
        <span className={styles.assetIcon}>{row.icon}</span>
        <div className={styles.assetInfo}>
          <span className={styles.assetName}>{val}</span>
          <span className={styles.assetSpec}>{row.spec.substring(0, 30)}...</span>
        </div>
      </div>
    )},
    { key: 'tag', label: 'Tag', render: (val: string) => <span className={styles.mono}>{val}</span> },
    { key: 'category', label: 'Category' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'qty', label: 'Qty', align: 'center' as const },
    { key: 'status', label: 'Status', render: (val: string) => (
      <Badge variant={val === 'Active' ? 'green' : val === 'Low Stock' ? 'yellow' : val === 'Flagged' ? 'red' : 'gray'}>
        {val}
      </Badge>
    )},
    { key: 'lastAuditDate', label: 'Last Audited', render: (val: any) => formatDate(val) }
  ];

  const handleExport = () => {
    const headers = ['Name', 'Tag', 'Category', 'Assigned To', 'Qty', 'Status', 'Last Audited'];
    const csvContent = [
      headers.join(','),
      ...assets.map(a => [
        `"${a.name}"`,
        a.tag,
        a.category,
        `"${a.assignedTo}"`,
        a.qty,
        a.status,
        formatDate(a.lastAuditDate)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `IT_Assets_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <div className={styles.searchAndFilters}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search by name, tag, or category..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className={styles.categoryFilters}>
              <button 
                className={`${styles.filterBtn} ${selectedCategory === 'All' ? styles.active : ''}`}
                onClick={() => setSelectedCategory('All')}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  className={`${styles.filterBtn} ${selectedCategory === cat ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.exportBtn} onClick={handleExport}>
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tableHeader}>
          <p className={styles.rowCount}>Showing {assets.length} assets</p>
          <div className={styles.tableActions}>
            <button className={styles.iconBtn}><Filter size={16} /></button>
          </div>
        </div>
        {loading ? <LoadingSpinner /> : (
          <DataTable 
            columns={columns} 
            data={assets} 
            onRowClick={(row) => setSelectedAsset(row)}
          />
        )}
      </div>

      <AddAssetModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* Edit Modal (Reuse AddAssetModal with initialData) */}
      {selectedAsset && (
        <AddAssetModal 
          isOpen={!!selectedAsset} 
          onClose={() => setSelectedAsset(null)} 
          initialData={selectedAsset}
        />
      )}
    </div>
  );
};

export default Assets;
