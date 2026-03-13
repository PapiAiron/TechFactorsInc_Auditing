import React from 'react';
import styles from './DataTable.module.css';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  loading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, onRowClick, loading }) => {
  if (loading) {
    return <div className={styles.loading}>Loading data...</div>;
  }

  if (data.length === 0) {
    return <div className={styles.empty}>No records found.</div>;
  }

  // Mobile card view
  const renderMobileCards = () => {
    return (
      <div className={styles.mobileCards}>
        {data.map((row, idx) => (
          <div 
            key={row.id || idx} 
            className={styles.mobileCard}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <div key={col.key} className={styles.mobileCardRow}>
                <span className={styles.mobileCardLabel}>{col.label}:</span>
                <span className={styles.mobileCardValue}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Desktop table view
  const renderTable = () => {
    return (
      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ textAlign: col.align || 'left' }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr 
                key={row.id || idx} 
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? styles.clickable : ''}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      {/* Mobile card view (hidden on desktop) */}
      <div className={styles.mobileView}>
        {renderMobileCards()}
      </div>
      
      {/* Desktop table view (hidden on mobile) */}
      <div className={styles.desktopView}>
        {renderTable()}
      </div>
    </>
  );
};

export default DataTable;
