export const CATEGORIES = [
  "Laptops",
  "Monitors",
  "Networking",
  "Mobile",
  "Servers",
  "Printers",
  "Peripherals",
  "Bot"
] as const;

export const ASSET_STATUSES = [
  "Active",
  "Low Stock",
  "Flagged",
  "In Use",
  "Maintenance",
  "Complete",
  "Incomplete"
] as const;

export const AUDIT_STATUSES = [
  "completed",
  "in-progress",
  "flagged"
] as const;

export const USER_ROLES = [
  "IT Administrator",
  "IT Technician",
  "Auditor",
  "Department Manager"
] as const;

export const ALERT_SEVERITIES = [
  "critical",
  "warning",
  "info"
] as const;

export const SERVER_ROOM_STATUSES = [
  "operational",
  "partial",
  "standby"
] as const;
