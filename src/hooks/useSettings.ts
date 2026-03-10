import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { Settings } from "../types";
import { settingsService } from "../services/settingsService";

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const defaultSettings: Settings = {
      companyName: "TechFactors Inc.",
      itEmail: "support@techfactors.com",
      tagPrefix: "TF-",
      fiscalYearStart: new Date().toISOString().split('T')[0],
      notifications: {
        emailAlerts: true,
        lowStockWarnings: true,
        auditDueReminders: true,
        licenseExpiryAlerts: true,
        discrepancyDigest: true
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: true,
        auditTrailLogging: true,
        minPasswordLength: 8
      },
      integrations: {
        azureAD: false,
        jira: false,
        slack: false,
        meraki: false
      },
      auditRules: {
        frequencyDays: 90,
        lowStockThresholdPercent: 10,
        discrepancyToleranceUnits: 0,
        autoFlagOnMismatch: true,
        requirePhotoProof: false
      }
    };

    const unsubscribe = onSnapshot(doc(db, "settings", "global"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        // Merge with defaults to ensure all nested objects exist
        setSettings({
          ...defaultSettings,
          ...data,
          notifications: { ...defaultSettings.notifications, ...(data.notifications || {}) },
          security: { ...defaultSettings.security, ...(data.security || {}) },
          integrations: { ...defaultSettings.integrations, ...(data.integrations || {}) },
          auditRules: { ...defaultSettings.auditRules, ...(data.auditRules || {}) },
        } as Settings);
      } else {
        setSettings(defaultSettings);
      }
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (partial: Partial<Settings>) => {
    try {
      await settingsService.updateSettings(partial);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { settings, loading, error, updateSettings };
};
