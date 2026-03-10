import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { Alert } from "../types";

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch recent alerts and filter by resolved status in memory
    // to avoid requiring a composite index on resolved + createdAt
    const q = query(
      collection(db, "alerts"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Alert))
        .filter(alert => !alert.resolved);
        
      setAlerts(data);
      setLoading(false);
    }, (err) => {
      console.error("Alerts fetch failed:", err);
      setError(err.message);
      setLoading(false);
      setAlerts([]);
    });

    return () => unsubscribe();
  }, []);

  const criticalCount = alerts.filter(a => a.severity === "critical").length;
  const warningCount = alerts.filter(a => a.severity === "warning").length;
  const infoCount = alerts.filter(a => a.severity === "info").length;

  return { alerts, criticalCount, warningCount, infoCount, loading, error };
};
