// General
export const activeStatuses = ["active", "inactive"] as const;
export type ActiveStatus = (typeof activeStatuses)[number];

// Staff
export const staffRoles = ["admin", "operator", "accountant"] as const;
export type StaffRole = (typeof staffRoles)[number];

// Payments
export const paymentStatuses = ["pending", "completed", "failed"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export const paymentMethods = ["cash", "online", "both"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];
