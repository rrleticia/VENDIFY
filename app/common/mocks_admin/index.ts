// Admin-only mocks (no new types exported globally)
export const adminActivityLogs = [
  { id: "log-1", at: new Date().toISOString(), userId: "u-admin", action: "LOGIN", details: "Sessão iniciada" },
];

export const adminEmailQueue = [
  { id: "mail-1", to: "cliente@example.com", subject: "Seu pedido foi recebido", body: "Obrigado pela compra!", status: "sent", at: new Date().toISOString() },
];

export const adminRoleAssignments: Record<string, Array<"admin"|"editor"|"seller">> = {
  "u-admin": ["admin", "editor", "seller"],
  "u-editor": ["editor"],
  "u-seller": ["seller"],
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
};

export const adminUsers: AdminUser[] = [
  { id: "u-admin", name: "Admin Root", email: "admin@example.com" },
  { id: "u-editor", name: "Editor One", email: "editor@example.com" },
  { id: "u-seller", name: "Seller One", email: "seller@example.com" },
];
