import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { AuditLog, Settings } from "../types";
import { auditService } from "../services/auditService";

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "auditLogs"), orderBy("startedAt", "desc"));

    const checkAndAutoComplete = async (data: AuditLog[]) => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "global"));
        if (!settingsDoc.exists()) return;
        
        const settings = settingsDoc.data() as Settings;
        const frequencyDays = settings.auditRules?.frequencyDays || 90;
        const now = new Date();

        for (const log of data) {
          if (log.status === 'in-progress' && log.startedAt) {
            const startedAt = log.startedAt.toDate();
            const diffTime = Math.abs(now.getTime() - startedAt.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > frequencyDays) {
              await auditService.completeAudit(
                log.id, 
                `${frequencyDays}d+`, 
                log.itemsScanned || log.totalItems
              );
            }
          }
        }
      } catch (err) {
        console.error("Auto-complete check failed:", err);
      }
    };

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
      setLogs(data);
      setLoading(false);
      checkAndAutoComplete(data);
    }, (err) => {
      console.error("Audit logs fetch failed:", err);
      setError(err.message);
      setLoading(false);
      setLogs([]);
    });

    return () => unsubscribe();
  }, []);

  return { logs, loading, error };
};
