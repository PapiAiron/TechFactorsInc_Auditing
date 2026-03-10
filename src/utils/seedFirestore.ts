import { 
  collection, 
  doc, 
  setDoc, 
  writeBatch, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Asset, AuditLog, User, Alert, ServerRoom, Settings } from "../types";

export const seedAll = async () => {
  const batch = writeBatch(db);

  // 1. Seed Assets
  const assets: Omit<Asset, "id">[] = [
    { tag: "IT-LT-0041", name: "Dell Latitude 5540", icon: "💻", category: "Laptops", assignedTo: "Engineering", qty: 12, status: "Active", lastAuditDate: Timestamp.now(), spec: "i7-1365U, 32GB RAM, 512GB SSD", createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { tag: "IT-LT-0058", name: "MacBook Pro 14\"", icon: "🍎", category: "Laptops", assignedTo: "Design", qty: 8, status: "Active", lastAuditDate: Timestamp.now(), spec: "M2 Pro, 16GB RAM, 512GB SSD", createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { tag: "IT-MN-0088", name: "Dell UltraSharp 27\"", icon: "🖥️", category: "Monitors", assignedTo: "Engineering", qty: 24, status: "Active", lastAuditDate: Timestamp.now(), spec: "4K, USB-C Hub", createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { tag: "IT-MN-0091", name: "LG UltraWide 34\"", icon: "🖥️", category: "Monitors", assignedTo: "Design", qty: 6, status: "Low Stock", lastAuditDate: Timestamp.now(), spec: "WQHD, 144Hz", createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { tag: "IT-NW-0055", name: "Cisco Catalyst 9300", icon: "🔌", category: "Networking", assignedTo: "IT Infrastructure", qty: 4, status: "Active", lastAuditDate: Timestamp.now(), spec: "48-port PoE+", createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { tag: "IT-NW-0061", name: "Ubiquiti UniFi AP", icon: "📡", category: "Networking", assignedTo: "IT Infrastructure", qty: 15, status: "Maintenance", lastAuditDate: Timestamp.now(), spec: "WiFi 6 Long Range", createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { tag: "IT-MB-0132", name: "iPhone 15 Pro", icon: "📱", category: "Mobile", assignedTo: "Sales", qty: 10, status: "In Use", lastAuditDate: Timestamp.now(), spec: "256GB, Titanium", createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { tag: "IT-MB-0144", name: "Samsung Galaxy S23", icon: "📱", category: "Mobile", assignedTo: "Marketing", qty: 5, status: "Low Stock", lastAuditDate: Timestamp.now(), spec: "128GB, Phantom Black", createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { tag: "IT-SV-0012", name: "Dell PowerEdge R750", icon: "🗄️", category: "Servers", assignedTo: "IT Infrastructure", qty: 2, status: "Active", lastAuditDate: Timestamp.now(), spec: "2x Xeon Gold, 256GB RAM", createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { tag: "IT-SV-0019", name: "HP ProLiant DL380", icon: "🗄️", category: "Servers", assignedTo: "IT Infrastructure", qty: 3, status: "Flagged", lastAuditDate: Timestamp.now(), spec: "Gen10, 128GB RAM", createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { tag: "IT-PR-0017", name: "HP LaserJet Enterprise", icon: "🖨️", category: "Printers", assignedTo: "Operations", qty: 4, status: "Active", lastAuditDate: Timestamp.now(), spec: "Color, 50ppm", createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
    { tag: "IT-PH-0204", name: "Logitech MX Master 3S", icon: "🖱️", category: "Peripherals", assignedTo: "Engineering", qty: 30, status: "Active", lastAuditDate: Timestamp.now(), spec: "Wireless Mouse", createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  ];

  assets.forEach(asset => {
    const ref = doc(collection(db, "assets"));
    batch.set(ref, asset);
  });

  // 2. Seed Audit Logs
  const auditLogs: Omit<AuditLog, "id">[] = [
    { auditId: "#AU-3841", scope: "Server Room A — Full", auditor: "Rachel Kim", auditorId: "user1", startedAt: Timestamp.now(), duration: "2h 14m", itemsScanned: 48, totalItems: 48, status: "completed", notes: "All assets accounted for." },
    { auditId: "#AU-3842", scope: "Design Dept — Laptops", auditor: "James Tran", auditorId: "user2", startedAt: Timestamp.now(), duration: "1h 05m", itemsScanned: 12, totalItems: 12, status: "completed", notes: "One laptop sent for repair." },
    { auditId: "#AU-3843", scope: "Operations — Printers", auditor: "Mark Davis", auditorId: "user3", startedAt: Timestamp.now(), duration: "45m", itemsScanned: 4, totalItems: 4, status: "completed", notes: "Toner levels checked." },
    { auditId: "#AU-3844", scope: "Sales — Mobile Devices", auditor: "Sarah Lee", auditorId: "user4", startedAt: Timestamp.now(), duration: "1h 30m", itemsScanned: 10, totalItems: 10, status: "completed", notes: "MDM profiles verified." },
    { auditId: "#AU-3845", scope: "Server Room B — Racks 1-4", auditor: "Alex Park", auditorId: "user5", startedAt: Timestamp.now(), duration: "—", itemsScanned: 15, totalItems: 32, status: "in-progress", notes: "Continuing tomorrow." },
    { auditId: "#AU-3846", scope: "Marketing — Peripherals", auditor: "Clara Wong", auditorId: "user6", startedAt: Timestamp.now(), duration: "30m", itemsScanned: 15, totalItems: 15, status: "completed", notes: "Inventory matched." },
    { auditId: "#AU-3847", scope: "IT Storage — Networking", auditor: "Rachel Kim", auditorId: "user1", startedAt: Timestamp.now(), duration: "1h 15m", itemsScanned: 20, totalItems: 22, status: "flagged", notes: "2 switches missing from shelf." },
    { auditId: "#AU-3848", scope: "Building 1 — All Monitors", auditor: "James Tran", auditorId: "user2", startedAt: Timestamp.now(), duration: "3h 45m", itemsScanned: 120, totalItems: 120, status: "completed", notes: "Large scale audit finished." },
  ];

  auditLogs.forEach(log => {
    const ref = doc(collection(db, "auditLogs"));
    batch.set(ref, log);
  });

  // 3. Seed Users
  const users: User[] = [
    { id: "user1", displayName: "Rachel Kim", initials: "RK", role: "IT Administrator", email: "rachel.k@techfactors.com", avatarGradient: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)", auditsCompleted: 45, openAudits: 0, onlineStatus: "online", createdAt: Timestamp.now() },
    { id: "user2", displayName: "James Tran", initials: "JT", role: "IT Technician", email: "james.t@techfactors.com", avatarGradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", auditsCompleted: 32, openAudits: 1, onlineStatus: "in-audit", createdAt: Timestamp.now() },
    { id: "user3", displayName: "Mark Davis", initials: "MD", role: "Auditor", email: "mark.d@techfactors.com", avatarGradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", auditsCompleted: 28, openAudits: 0, onlineStatus: "away", createdAt: Timestamp.now() },
    { id: "user4", displayName: "Sarah Lee", initials: "SL", role: "Department Manager", email: "sarah.l@techfactors.com", avatarGradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", auditsCompleted: 15, openAudits: 0, onlineStatus: "offline", createdAt: Timestamp.now() },
    { id: "user5", displayName: "Alex Park", initials: "AP", role: "IT Technician", email: "alex.p@techfactors.com", avatarGradient: "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)", auditsCompleted: 10, openAudits: 1, onlineStatus: "online", createdAt: Timestamp.now() },
    { id: "user6", displayName: "Clara Wong", initials: "CW", role: "Auditor", email: "clara.w@techfactors.com", avatarGradient: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)", auditsCompleted: 22, openAudits: 0, onlineStatus: "online", createdAt: Timestamp.now() },
  ];

  users.forEach(user => {
    const ref = doc(db, "users", user.id);
    batch.set(ref, user);
  });

  // 4. Seed Alerts
  const alerts: Omit<Alert, "id">[] = [
    { title: "Critical: Server Room A Temp", description: "Temperature exceeded 25°C in Rack 4.", severity: "critical", resolved: false, createdAt: Timestamp.now(), relatedAssetTag: "IT-SV-0012" },
    { title: "Critical: UPS Failure", description: "UPS unit in Room B reporting battery failure.", severity: "critical", resolved: false, createdAt: Timestamp.now(), relatedAssetTag: null },
    { title: "Critical: Network Outage", description: "Main switch in Floor 2 unresponsive.", severity: "critical", resolved: false, createdAt: Timestamp.now(), relatedAssetTag: "IT-NW-0055" },
    { title: "Warning: Low Stock - Monitors", description: "LG UltraWide 34\" below threshold.", severity: "warning", resolved: false, createdAt: Timestamp.now(), relatedAssetTag: "IT-MN-0091" },
    { title: "Warning: Audit Overdue", description: "Design Dept audit is 5 days overdue.", severity: "warning", resolved: false, createdAt: Timestamp.now(), relatedAssetTag: null },
    { title: "Info: New Asset Added", description: "10x iPhone 15 Pro added to inventory.", severity: "info", resolved: false, createdAt: Timestamp.now(), relatedAssetTag: "IT-MB-0132" },
  ];

  alerts.forEach(alert => {
    const ref = doc(collection(db, "alerts"));
    batch.set(ref, alert);
  });

  // 5. Seed Server Rooms
  const serverRooms: Omit<ServerRoom, "id">[] = [
    { name: "Server Room A", location: "Building 1, Floor B1 · 48 Racks", status: "operational", serverCount: 124, uptime: 99.99, lastAuditDaysAgo: 2, capacityPercent: 85, totalAssets: 450, categories: 5 },
    { name: "Server Room B", location: "Building 1, Floor 4 · 24 Racks", status: "partial", serverCount: 56, uptime: 98.5, lastAuditDaysAgo: 15, capacityPercent: 40, totalAssets: 210, categories: 4 },
    { name: "IT Storage Room", location: "Building 2, Floor 1", status: "operational", serverCount: 0, uptime: 100, lastAuditDaysAgo: 30, capacityPercent: 95, totalAssets: 1200, categories: 7 },
    { name: "DR Site", location: "Off-site, Remote Facility", status: "standby", serverCount: 24, uptime: 100, lastAuditDaysAgo: 90, capacityPercent: 20, totalAssets: 85, categories: 3 },
  ];

  serverRooms.forEach(room => {
    const ref = doc(collection(db, "serverRooms"));
    batch.set(ref, room);
  });

  // 6. Seed Settings
  const settings: Settings = {
    companyName: "TechFactors Inc.",
    itEmail: "it-support@techfactors.com",
    tagPrefix: "IT-",
    fiscalYearStart: "2024-01-01",
    notifications: {
      emailAlerts: true,
      lowStockWarnings: true,
      auditDueReminders: true,
      licenseExpiryAlerts: false,
      discrepancyDigest: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: true,
      auditTrailLogging: true,
      minPasswordLength: 12
    },
    integrations: {
      azureAD: true,
      jira: true,
      slack: false,
      meraki: true
    },
    auditRules: {
      frequencyDays: 90,
      lowStockThresholdPercent: 15,
      discrepancyToleranceUnits: 0,
      autoFlagOnMismatch: true,
      requirePhotoProof: false
    }
  };

  const settingsRef = doc(db, "settings", "global");
  batch.set(settingsRef, settings);

  await batch.commit();
  console.log("Firestore seeded successfully!");
};
