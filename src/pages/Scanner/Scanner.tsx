import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, QrCode, History, CheckCircle, AlertTriangle, Save } from 'lucide-react';
import CameraViewport from '../../components/Scanner/CameraViewport';
import ScanResult from '../../components/Scanner/ScanResult';
import ScanHistory from '../../components/Scanner/ScanHistory';
import StatCard from '../../components/UI/StatCard';
import styles from './Scanner.module.css';
import { useAssets } from '../../hooks/useAssets';
import { useScanSession } from '../../hooks/useScanSession';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../context/AuthContext';
import { assetService } from '../../services/assetService';
import { alertService } from '../../services/alertService';
import { ScanSession, Asset, AuditLog } from '../../types';
import { collection, query, where, onSnapshot, Timestamp, orderBy, limit, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase/config';

const Scanner: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [manualTag, setManualTag] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [matchedAsset, setMatchedAsset] = useState<Asset | null>(null);
  const [sessionHistory, setSessionHistory] = useState<ScanSession[]>([]);
  const [stats, setStats] = useState({ scannedToday: 0, matched: 0, notFound: 0 });
  const [activeAudit, setActiveAudit] = useState<AuditLog | null>(null);
  const lastLoggedTag = useRef<string | null>(null);
  const lastLoggedTime = useRef<number>(0);

  const { assets } = useAssets();
  const { writeScanSession } = useScanSession();
  const { settings } = useSettings();
  const { userData } = useAuth();
  const navigate = useNavigate();

  const categories = settings?.categories || [];

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);

    const q = query(collection(db, "scanSessions"), where("scannedAt", ">=", todayTimestamp));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data() as ScanSession);
      setStats({
        scannedToday: docs.length,
        matched: docs.filter(d => d.found).length,
        notFound: docs.filter(d => !d.found).length
      });
      setSessionHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScanSession)));
    });

    return () => unsubscribe();
  }, []);

  const handleScan = (tag: string, isManual: boolean = false) => {
    const normalizedTag = tag.trim().toUpperCase();
    
    // Prevent spamming the same tag (especially unknown ones)
    const now = Date.now();
    if (normalizedTag === lastLoggedTag.current && (now - lastLoggedTime.current) < 5000) {
      // Still show it in the UI but don't log to DB again
      setCurrentTag(normalizedTag);
      const asset = assets.find(a => a.tag === normalizedTag);
      setMatchedAsset(asset || null);
      return;
    }

    setCurrentTag(normalizedTag);
    
    const asset = assets.find(a => a.tag === normalizedTag);
    setMatchedAsset(asset || null);

    // Only log to DB if it's a match OR if it's a manual lookup
    // This prevents camera noise from filling the logs with "Unknown Asset"
    if (asset || isManual) {
      lastLoggedTag.current = normalizedTag;
      lastLoggedTime.current = now;

      writeScanSession({
        scannedBy: userData?.displayName || 'Unknown',
        scannedByUid: userData?.id || 'unknown',
        assetTag: normalizedTag,
        assetName: asset ? asset.name : null,
        found: !!asset,
        action: 'none'
      });
    }
  };

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualTag) {
      handleScan(manualTag, true);
      setManualTag('');
    }
  };

  useEffect(() => {
    // Fetch recent audits and find the most recent in-progress one in memory
    // to avoid requiring a composite index on status + startedAt
    const auditQuery = query(
      collection(db, "auditLogs"), 
      orderBy("startedAt", "desc"),
      limit(5)
    );

    const unsubscribeAudit = onSnapshot(auditQuery, (snapshot) => {
      const inProgressAudit = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as AuditLog))
        .find(audit => audit.status === 'in-progress');

      if (inProgressAudit) {
        setActiveAudit(inProgressAudit);
      } else {
        setActiveAudit(null);
      }
    }, (err) => {
      console.error("Active audit fetch failed:", err);
      setActiveAudit(null);
    });

    return () => unsubscribeAudit();
  }, []);

  const handleAudit = async () => {
    if (!matchedAsset) return;
    try {
      await assetService.markAsAudited(matchedAsset.id);
      
      // Update the active audit log's itemsScanned count
      if (activeAudit) {
        // Check if asset is within scope if scope is a category
        const isKnownCategory = categories.includes(activeAudit.scope as any) || activeAudit.scope === 'All Assets';
        const isWithinScope = !isKnownCategory || 
                             activeAudit.scope === 'All Assets' || 
                             activeAudit.scope === matchedAsset.category;

        if (!isWithinScope) {
          if (!confirm(`This asset (${matchedAsset.category}) is outside the current audit scope (${activeAudit.scope}). Count it anyway?`)) {
            return;
          }
        }

        const alreadyAuditedInSession = sessionHistory.some(s => 
          s.assetTag === matchedAsset.tag && 
          s.action === 'audited' &&
          (s.auditId === activeAudit.id || (s.scannedAt && activeAudit.startedAt && s.scannedAt.toMillis() >= activeAudit.startedAt.toMillis()))
        );

        if (!alreadyAuditedInSession) {
          const logRef = doc(db, "auditLogs", activeAudit.id);
          const currentScanned = activeAudit.itemsScanned || 0;
          const totalToAudit = activeAudit.totalItems || 0;
          const newItemsScanned = currentScanned + 1;
          
          // Auto-complete if we reached or exceeded the target
          const isCompleted = totalToAudit > 0 && newItemsScanned >= totalToAudit;
          
          let duration = activeAudit.duration || '—';
          if (isCompleted && activeAudit.startedAt) {
            const startedAt = activeAudit.startedAt.toDate();
            const now = new Date();
            const diffMs = now.getTime() - startedAt.getTime();
            const diffMins = Math.round(diffMs / 60000);
            if (diffMins < 1) {
              duration = '< 1m';
            } else if (diffMins < 60) {
              duration = `${diffMins}m`;
            } else {
              duration = `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
            }
          }

          await updateDoc(logRef, {
            itemsScanned: increment(1),
            status: isCompleted ? 'completed' : 'in-progress',
            duration: duration
          });
        }
      }

      await writeScanSession({
        scannedBy: userData?.displayName || 'Unknown',
        scannedByUid: userData?.id || 'unknown',
        assetTag: matchedAsset.tag,
        assetName: matchedAsset.name,
        found: true,
        action: 'audited',
        auditId: activeAudit?.id
      });
      // Reset after success
      setCurrentTag('');
      setMatchedAsset(null);
      lastLoggedTag.current = null; // Reset tracking
    } catch (err) {
      console.error(err);
    }
  };

  const handleFlag = async () => {
    if (!matchedAsset) return;
    try {
      await assetService.updateAsset(matchedAsset.id, { status: 'Flagged' });
      await alertService.addAlert({
        title: `Flagged: ${matchedAsset.name}`,
        description: `Asset ${matchedAsset.tag} was flagged during a scan audit.`,
        severity: 'warning',
        relatedAssetTag: matchedAsset.tag
      });
      await writeScanSession({
        scannedBy: userData?.displayName || 'Unknown',
        scannedByUid: userData?.id || 'unknown',
        assetTag: matchedAsset.tag,
        assetName: matchedAsset.name,
        found: true,
        action: 'flagged'
      });
      setCurrentTag('');
      setMatchedAsset(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinishSession = async () => {
    if (stats.scannedToday === 0) {
      alert("No scans recorded in this session.");
      return;
    }

    if (window.confirm(`Finish session? You have scanned ${stats.scannedToday} assets.`)) {
      // In a real system, we would create a summary AuditLog entry here
      // For now, we'll just redirect to the logs to show the individual scan history
      navigate('/audit-logs');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Tag Scanner</h2>
          <p className={styles.subtitle}>Scan asset tags to verify inventory or flag discrepancies.</p>
        </div>
        <button className={styles.finishBtn} onClick={handleFinishSession}>
          <Save size={18} />
          <span>Finish Session</span>
        </button>
      </div>

      <div className={styles.statsGrid}>
        <StatCard 
          label="Scanned Today" 
          value={stats.scannedToday} 
          icon={<QrCode size={20} />} 
          accentColor="var(--accent)"
        />
        <StatCard 
          label="Assets Matched" 
          value={stats.matched} 
          icon={<CheckCircle size={20} />} 
          accentColor="var(--green)"
        />
        <StatCard 
          label="Not Found" 
          value={stats.notFound} 
          icon={<AlertTriangle size={20} />} 
          accentColor="var(--red)"
        />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Camera Viewport</h3>
              <div className={styles.manualEntry}>
                <form onSubmit={handleManualLookup} className={styles.lookupForm}>
                  <input 
                    type="text" 
                    placeholder="Enter tag manually..." 
                    className={styles.lookupInput}
                    value={manualTag}
                    onChange={(e) => setManualTag(e.target.value)}
                  />
                  <button type="submit" className={styles.lookupBtn}>Look Up</button>
                </form>
              </div>
            </div>
            <div className={styles.viewportWrapper}>
              <CameraViewport 
                isActive={isCameraActive} 
                onToggle={setIsCameraActive} 
                onScan={handleScan} 
              />
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Scan Result</h2>
            <ScanResult 
              asset={matchedAsset} 
              tag={currentTag} 
              onAudit={handleAudit} 
              onFlag={handleFlag} 
            />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Session History</h2>
            <ScanHistory 
              history={sessionHistory} 
              onClear={() => setSessionHistory([])} 
              onSelect={handleScan}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
