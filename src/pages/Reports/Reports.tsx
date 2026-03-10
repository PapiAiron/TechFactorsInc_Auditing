import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  PieChart, 
  BarChart, 
  Users, 
  ShieldCheck, 
  Loader2
} from 'lucide-react';
import Badge from '../../components/UI/Badge';
import styles from './Reports.module.css';
import { useAssets } from '../../hooks/useAssets';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import { useUsers } from '../../hooks/useUsers';
import { formatDate } from '../../utils/formatters';

const Reports: React.FC = () => {
  const [generating, setGenerating] = useState<string | null>(null);
  const { assets } = useAssets();
  const { logs } = useAuditLogs();
  const { users } = useUsers();

  const reports = [
    {
      id: 'monthly-audit',
      title: 'Monthly Audit Summary',
      description: 'Comprehensive overview of all audits completed in the current month.',
      icon: <FileText size={24} />,
      status: 'Ready',
      date: 'Updated 2h ago'
    },
    {
      id: 'discrepancy',
      title: 'Discrepancy Report',
      description: 'Detailed list of all assets flagged with mismatches or missing status.',
      icon: <AlertCircle size={24} />,
      status: 'Ready',
      date: 'Updated 1h ago'
    },
    {
      id: 'utilization',
      title: 'Asset Utilization',
      description: 'Analysis of asset distribution across departments and usage rates.',
      icon: <PieChart size={24} />,
      status: 'Ready',
      date: 'Updated 5h ago'
    },
    {
      id: 'compliance',
      title: 'License Compliance',
      description: 'Software license tracking and upcoming expiration alerts.',
      icon: <ShieldCheck size={24} />,
      status: 'Ready',
      date: 'Updated 1d ago'
    },
    {
      id: 'user-assignment',
      title: 'User Asset Assignment',
      description: 'Mapping of all IT assets currently assigned to specific employees.',
      icon: <Users size={24} />,
      status: 'Ready',
      date: 'Updated 10m ago'
    }
  ];

  const handleDownload = async (id: string) => {
    setGenerating(id);
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let data: any[] = [];
    let filename = `Report_${id}_${new Date().toISOString().split('T')[0]}.csv`;

    if (id === 'monthly-audit') {
      data = logs.map(l => ({
        ID: l.auditId,
        Scope: l.scope,
        Auditor: l.auditor,
        Status: l.status,
        Items: `${l.itemsScanned}/${l.totalItems}`,
        Date: formatDate(l.startedAt)
      }));
    } else if (id === 'user-assignment') {
      data = assets.map(a => ({
        Tag: a.tag,
        Name: a.name,
        Category: a.category,
        AssignedTo: a.assignedTo,
        Status: a.status
      }));
    } else {
      // Fallback for demo
      data = assets.slice(0, 5).map(a => ({
        Tag: a.tag,
        Name: a.name,
        Category: a.category
      }));
    }

    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setGenerating(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {reports.map((report) => (
          <div key={report.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>{report.icon}</div>
              <Badge variant="green">{report.status}</Badge>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.title}>{report.title}</h3>
              <p className={styles.description}>{report.description}</p>
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.date}>{report.date}</span>
              <button 
                className={styles.downloadBtn} 
                onClick={() => handleDownload(report.id)}
                disabled={generating === report.id}
              >
                {generating === report.id ? (
                  <>
                    <Loader2 size={16} className={styles.spin} />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AlertCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default Reports;
