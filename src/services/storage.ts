import {
  AdminUser,
  AppUser,
  VerificationRequest,
  Transaction,
  SupportTicket,
  AuditLog,
  CloudflareWorker,
  SupabaseConfig,
  UserRole
} from '../types';
import {
  ADMIN_USERS,
  INITIAL_USERS,
  INITIAL_VERIFICATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CLOUDFLARE_WORKERS,
  INITIAL_SUPABASE_CONFIG
} from '../data/mockData';

const STORAGE_KEYS = {
  ADMIN_ROLE: 'fianex_admin_role',
  USERS: 'fianex_users_v1',
  VERIFICATIONS: 'fianex_verifications_v1',
  TRANSACTIONS: 'fianex_transactions_v1',
  TICKETS: 'fianex_tickets_v1',
  LOGS: 'fianex_audit_logs_v1',
  WORKERS: 'fianex_cf_workers_v1',
  SUPABASE: 'fianex_supabase_config_v1'
};

// Event emitter helper for reactive updates
type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

export const subscribeToStorage = (listener: StorageListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((fn) => fn());
};

// Helper safe JSON parse
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyListeners();
  } catch (e) {
    console.error('Storage write error', e);
  }
}

// Current Admin User & Role
export const getActiveAdmin = (): AdminUser => {
  const role = (localStorage.getItem(STORAGE_KEYS.ADMIN_ROLE) as UserRole) || 'super_admin';
  const found = ADMIN_USERS.find((u) => u.role === role);
  return found || ADMIN_USERS[0];
};

export const setActiveAdminRole = (role: UserRole): AdminUser => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_ROLE, role);
  const admin = ADMIN_USERS.find((u) => u.role === role) || ADMIN_USERS[0];
  logAuditAction(
    'OPERATOR_ROLE_SWITCH',
    `Rol de sesión cambiado a ${role.toUpperCase()}`,
    `Operador autenticado bajo perfil: ${admin.name} (${admin.department})`,
    'info'
  );
  notifyListeners();
  return admin;
};

// Users
export const getStoredUsers = (): AppUser[] => {
  return getFromStorage<AppUser[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
};

export const updateStoredUser = (updatedUser: AppUser): void => {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
  } else {
    users.unshift(updatedUser);
  }
  saveToStorage(STORAGE_KEYS.USERS, users);
};

// Verifications
export const getStoredVerifications = (): VerificationRequest[] => {
  return getFromStorage<VerificationRequest[]>(STORAGE_KEYS.VERIFICATIONS, INITIAL_VERIFICATIONS);
};

export const approveVerification = (
  id: string,
  reviewerNotes?: string
): VerificationRequest | null => {
  const list = getStoredVerifications();
  const req = list.find((v) => v.id === id);
  if (!req) return null;

  const currentAdmin = getActiveAdmin();
  const now = new Date().toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' });

  req.status = 'approved';
  req.reviewedAt = now;
  req.reviewedBy = `${currentAdmin.name} (${currentAdmin.role})`;
  req.reviewerNotes = reviewerNotes || 'Validado conforme a la documentación presentada y cotejo de registros oficiales.';

  saveToStorage(STORAGE_KEYS.VERIFICATIONS, list);

  // Also update corresponding user profile
  const users = getStoredUsers();
  const user = users.find((u) => u.id === req.userId);
  if (user) {
    if (req.type === 'identity') {
      user.verificationStatus = user.expertCategory ? 'cert_pending' : 'id_approved';
    } else {
      user.verificationStatus = 'fully_verified';
      if (req.category) user.expertCategory = req.category;
      if (req.profession) user.expertProfession = req.profession;
    }
    saveToStorage(STORAGE_KEYS.USERS, users);
  }

  logAuditAction(
    'VERIFICATION_APPROVED',
    `Expediente ${req.id} (${req.userName})`,
    `Aprobación de ${req.type === 'identity' ? 'Identidad Oficial' : 'Categoría Profesional: ' + (req.profession || 'Especialista')}. Notas: ${req.reviewerNotes}`,
    'audit'
  );

  return req;
};

export const rejectVerification = (
  id: string,
  reason: string,
  notes?: string
): VerificationRequest | null => {
  const list = getStoredVerifications();
  const req = list.find((v) => v.id === id);
  if (!req) return null;

  const currentAdmin = getActiveAdmin();
  const now = new Date().toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' });

  req.status = 'rejected';
  req.reviewedAt = now;
  req.reviewedBy = `${currentAdmin.name} (${currentAdmin.role})`;
  req.rejectionReason = reason;
  req.reviewerNotes = notes || '';

  saveToStorage(STORAGE_KEYS.VERIFICATIONS, list);

  // Update user verification status
  const users = getStoredUsers();
  const user = users.find((u) => u.id === req.userId);
  if (user) {
    user.verificationStatus = 'rejected';
    saveToStorage(STORAGE_KEYS.USERS, users);
  }

  logAuditAction(
    'VERIFICATION_REJECTED',
    `Expediente ${req.id} (${req.userName})`,
    `Rechazo por motivo: "${reason}". Observación interna: ${notes || 'Ninguna'}`,
    'warning'
  );

  return req;
};

// Transactions
export const getStoredTransactions = (): Transaction[] => {
  return getFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
};

// Support Tickets
export const getStoredTickets = (): SupportTicket[] => {
  return getFromStorage<SupportTicket[]>(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
};

export const addTicketResponse = (
  ticketId: string,
  messageText: string
): SupportTicket | null => {
  const tickets = getStoredTickets();
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return null;

  const currentAdmin = getActiveAdmin();
  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  ticket.messages.push({
    id: `msg-${Date.now()}`,
    sender: `${currentAdmin.name} (${currentAdmin.department})`,
    isStaff: true,
    text: messageText,
    timestamp: nowTime
  });

  if (ticket.status === 'abierto') {
    ticket.status = 'en_progreso';
  }
  ticket.updatedAt = new Date().toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' });

  saveToStorage(STORAGE_KEYS.TICKETS, tickets);

  logAuditAction(
    'TICKET_REPLIED',
    `Ticket ${ticket.id}`,
    `Respuesta enviada a ${ticket.requesterName} por ${currentAdmin.name}`,
    'info'
  );

  return ticket;
};

export const updateTicketStatus = (
  ticketId: string,
  newStatus: SupportTicket['status']
): void => {
  const tickets = getStoredTickets();
  const ticket = tickets.find((t) => t.id === ticketId);
  if (ticket) {
    ticket.status = newStatus;
    ticket.updatedAt = new Date().toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' });
    saveToStorage(STORAGE_KEYS.TICKETS, tickets);
  }
};

// Audit Logs
export const getStoredAuditLogs = (): AuditLog[] => {
  return getFromStorage<AuditLog[]>(STORAGE_KEYS.LOGS, INITIAL_AUDIT_LOGS);
};

export const logAuditAction = (
  action: string,
  target: string,
  details: string,
  severity: AuditLog['severity'] = 'info'
): void => {
  const logs = getStoredAuditLogs();
  const admin = getActiveAdmin();
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    operatorName: admin.name,
    operatorRole: admin.role,
    action,
    target,
    details,
    severity,
    ip: '190.166.42.102'
  };

  logs.unshift(newLog);
  // Keep last 150
  if (logs.length > 150) logs.pop();
  saveToStorage(STORAGE_KEYS.LOGS, logs);
};

// Cloudflare Workers
export const getStoredWorkers = (): CloudflareWorker[] => {
  return getFromStorage<CloudflareWorker[]>(STORAGE_KEYS.WORKERS, INITIAL_CLOUDFLARE_WORKERS);
};

export const toggleWorkerDeployment = (workerId: string): void => {
  const workers = getStoredWorkers();
  const worker = workers.find((w) => w.id === workerId);
  if (worker) {
    worker.status = 'deploying';
    saveToStorage(STORAGE_KEYS.WORKERS, workers);

    setTimeout(() => {
      worker.status = 'operational';
      worker.lastDeployed = 'Recién actualizado';
      saveToStorage(STORAGE_KEYS.WORKERS, workers);
      logAuditAction(
        'CLOUDFLARE_WORKER_DEPLOYED',
        `Worker: ${worker.name}`,
        `Despliegue a la red perimetral Cloudflare completado (versión ${worker.version})`,
        'info'
      );
    }, 1800);
  }
};

// Supabase
export const getStoredSupabaseConfig = (): SupabaseConfig => {
  return getFromStorage<SupabaseConfig>(STORAGE_KEYS.SUPABASE, INITIAL_SUPABASE_CONFIG);
};

export const updateStoredSupabaseConfig = (cfg: Partial<SupabaseConfig>): void => {
  const current = getStoredSupabaseConfig();
  const updated = { ...current, ...cfg };
  saveToStorage(STORAGE_KEYS.SUPABASE, updated);
  logAuditAction(
    'SUPABASE_CONFIG_UPDATED',
    'Conexión a Supabase DB',
    `Parámetros actualizados. Estado: ${updated.connected ? 'Conectado' : 'Desconectado'}`,
    'warning'
  );
};
