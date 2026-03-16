import { Timestamp } from "firebase/firestore";

export type AssetCategory = string;
export type AssetStatus = "Active" | "Low Stock" | "Flagged" | "In Use" | "Maintenance" | "Complete" | "Incomplete";

export interface Asset {
  id: string;
  tag: string;
  name: string;
  icon: string;
  category: AssetCategory;
  assignedTo: string;
  qty: number;
  status: AssetStatus;
  lastAuditDate: Timestamp;
  spec: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type AuditStatus = "completed" | "in-progress" | "flagged";

export interface AuditLog {
  id: string;
  auditId: string;
  scope: string;
  auditor: string;
  auditorId: string;
  startedAt: Timestamp;
  duration: string;
  itemsScanned: number;
  totalItems: number;
  status: AuditStatus;
  notes: string;
}

export type UserStatus = "online" | "away" | "in-audit" | "offline";

export interface User {
  id: string;
  displayName: string;
  initials: string;
  role: string;
  email: string;
  avatarGradient: string;
  auditsCompleted: number;
  openAudits: number;
  onlineStatus: UserStatus;
  createdAt: Timestamp;
}

export type AlertSeverity = "critical" | "warning" | "info";

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  resolved: boolean;
  createdAt: Timestamp;
  relatedAssetTag: string | null;
}

export type ServerRoomStatus = "operational" | "partial" | "standby";

export interface ServerRoom {
  id: string;
  name: string;
  location: string;
  status: ServerRoomStatus;
  serverCount: number;
  uptime: number;
  lastAuditDaysAgo: number;
  capacityPercent: number;
  totalAssets: number;
  categories: number;
}

export interface ScanSession {
  id: string;
  scannedBy: string;
  scannedByUid: string;
  assetTag: string;
  assetName: string | null;
  found: boolean;
  scannedAt: Timestamp;
  action: "audited" | "flagged" | "none";
  auditId?: string;
}

export interface Settings {
  companyName: string;
  itEmail: string;
  tagPrefix: string;
  categories: string[];
  fiscalYearStart: string;
  notifications: {
    emailAlerts: boolean;
    lowStockWarnings: boolean;
    auditDueReminders: boolean;
    licenseExpiryAlerts: boolean;
    discrepancyDigest: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: boolean;
    auditTrailLogging: boolean;
    minPasswordLength: number;
  };
  integrations: {
    azureAD: boolean;
    jira: boolean;
    slack: boolean;
    meraki: boolean;
  };
  auditRules: {
    frequencyDays: number;
    lowStockThresholdPercent: number;
    discrepancyToleranceUnits: number;
    autoFlagOnMismatch: boolean;
    requirePhotoProof: boolean;
  };
}
