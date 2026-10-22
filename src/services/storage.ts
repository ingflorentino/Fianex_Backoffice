import {
  AdminUser,
  AppUser,
  VerificationRequest,
  Transaction,
  SupportTicket,
  AuditLog,
  CloudflareWorker,
  SupabaseConfig,
  UserRole,
  SubscriptionRecord
} from '../types';
import {
  ADMIN_USERS,
  INITIAL_USERS,
  INITIAL_VERIFICATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CLOUDFLARE_WORKERS,
  INITIAL_SUPABASE_CONFIG,
  INITIAL_SUBSCRIPTIONS
} from '../data/mockData';

const STORAGE_KEYS = {
  ADMIN_ROLE: 'fianex_admin_role',
  USERS: 'fianex_perfiles_v2', // tabla perfiles
  SUBSCRIPTIONS: 'fianex_subscriptions_v2', // tabla subscriptions
  VERIFICATIONS: 'fianex_verifications_requests_v2', // tabla Verifications_requests
  TRANSACTIONS: 'fianex_transactions_v2',
  TICKETS: 'fianex_tickets_v2',
  LOGS: 'fianex_audit_logs_v2',
  WORKERS: 'fianex_cf_workers_v2',
  SUPABASE: 'fianex_supabase_config_v2'
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

// Users / Perfiles (tabla perfiles)
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

// Subscriptions (tabla subscriptions)
export const getStoredSubscriptions = (): SubscriptionRecord[] => {
  return getFromStorage<SubscriptionRecord[]>(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
};

export const updateStoredSubscription = (updatedSub: SubscriptionRecord): void => {
  const subs = getStoredSubscriptions();
  const index = subs.findIndex((s) => s.id === updatedSub.id || s.user_id === updatedSub.user_id);
  if (index !== -1) {
    subs[index] = updatedSub;
  } else {
    subs.unshift(updatedSub);
  }
  saveToStorage(STORAGE_KEYS.SUBSCRIPTIONS, subs);
};

export const changeExpertSubscription = (
  userId: string,
  newPlan: 'basico' | 'intermedio' | 'premium'
): void => {
  const planMap = {
    basico: { id: 1 as const, code: 'BASIC' as const, name: 'Plan Básico', amount: 0, limit: 10 },
    intermedio: { id: 2 as const, code: 'INTERMEDIATE' as const, name: 'Plan Intermedio', amount: 349.99, limit: 30 },
    premium: { id: 3 as const, code: 'PREMIUM' as const, name: 'Plan Premium', amount: 499.99, limit: -1 }
  };

  const planInfo = planMap[newPlan];

  // Update in subscriptions table
  const subs = getStoredSubscriptions();
  const subIndex = subs.findIndex((s) => s.user_id === userId);
  if (subIndex !== -1) {
    subs[subIndex] = {
      ...subs[subIndex],
      plan_id: planInfo.id,
      plan_code: planInfo.code,
      plan_name: planInfo.name,
      amount: planInfo.amount,
      proposals_limit: planInfo.limit
    };
  } else {
    subs.push({
      id: `sub-${Date.now()}`,
      user_id: userId,
      plan_id: planInfo.id,
      plan_code: planInfo.code,
      plan_name: planInfo.name,
      amount: planInfo.amount,
      status: 'active',
      proposals_limit: planInfo.limit,
      current_period_start: new Date().toISOString().split('T')[0],
      current_period_end: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      created_at: new Date().toISOString()
    });
  }
  saveToStorage(STORAGE_KEYS.SUBSCRIPTIONS, subs);

  // Update in user profile (perfiles)
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.expertPlan = newPlan;
    user.monthlyProposalsLimit = planInfo.limit === -1 ? 'unlimited' : planInfo.limit;
    saveToStorage(STORAGE_KEYS.USERS, users);
  }

  logAuditAction(
    'SUBSCRIPTION_MODIFIED',
    `Experto ${user?.name || userId}`,
    `Plan actualizado a ${planInfo.name} ($${planInfo.amount} DOP/mes) en tabla subscriptions.`,
    'audit'
  );
};

// Verifications (tabla Verifications_requests)
export const getStoredVerifications = (): VerificationRequest[] => {
  return getFromStorage<VerificationRequest[]>(STORAGE_KEYS.VERIFICATIONS, INITIAL_VERIFICATIONS);
};

export const saveStoredVerifications = (verifications: VerificationRequest[]): void => {
  saveToStorage(STORAGE_KEYS.VERIFICATIONS, verifications);
};

export const approveVerification = (
  id: string,
  reviewerNotes?: string,
  fallbackReq?: VerificationRequest
): VerificationRequest | null => {
  const list = getStoredVerifications();
  let req = list.find((v) => v.id === id);
  if (!req && fallbackReq) {
    req = { ...fallbackReq };
    list.unshift(req);
  }
  if (!req) return null;

  const currentAdmin = getActiveAdmin();
  const now = new Date().toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' });

  req.status = 'approved';
  req.reviewedAt = now;
  req.reviewedBy = `${currentAdmin.name} (${currentAdmin.role})`;
  req.reviewerNotes = reviewerNotes || 'Validado conforme a la documentación presentada y cotejo de registros oficiales.';

  saveToStorage(STORAGE_KEYS.VERIFICATIONS, list);

  // Also update corresponding user profile in perfiles
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
    `Aprobación en tabla Verifications_requests: ${req.type === 'identity' ? 'Cédula Oficial' : 'Categoría Profesional: ' + (req.profession || 'Especialista')}. Notas: ${req.reviewerNotes}`,
    'audit'
  );

  return req;
};

export const rejectVerification = (
  id: string,
  reason: string,
  notes?: string,
  fallbackReq?: VerificationRequest
): VerificationRequest | null => {
  const list = getStoredVerifications();
  let req = list.find((v) => v.id === id);
  if (!req && fallbackReq) {
    req = { ...fallbackReq };
    list.unshift(req);
  }
  if (!req) return null;

  const currentAdmin = getActiveAdmin();
  const now = new Date().toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' });

  req.status = 'rejected';
  req.reviewedAt = now;
  req.reviewedBy = `${currentAdmin.name} (${currentAdmin.role})`;
  req.rejectionReason = reason;
  req.reviewerNotes = notes || '';

  saveToStorage(STORAGE_KEYS.VERIFICATIONS, list);

  // Update user verification status in perfiles
  const users = getStoredUsers();
  const user = users.find((u) => u.id === req.userId);
  if (user) {
    user.verificationStatus = 'rejected';
    saveToStorage(STORAGE_KEYS.USERS, users);
  }

  logAuditAction(
    'VERIFICATION_REJECTED',
    `Expediente ${req.id} (${req.userName})`,
    `Rechazo en tabla Verifications_requests: "${reason}". Observación: ${notes || 'Ninguna'}`,
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
  const currentAdmin = getActiveAdmin();
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'medium' }),
    operatorName: currentAdmin.name,
    operatorRole: currentAdmin.role,
    action,
    target,
    details,
    severity,
    ip: '190.166.44.18'
  };
  logs.unshift(newLog);
  saveToStorage(STORAGE_KEYS.LOGS, logs.slice(0, 100));
};

// Cloudflare Workers
export const getStoredWorkers = (): CloudflareWorker[] => {
  return getFromStorage<CloudflareWorker[]>(STORAGE_KEYS.WORKERS, INITIAL_CLOUDFLARE_WORKERS);
};

// Supabase Config
export const getStoredSupabaseConfig = (): SupabaseConfig => {
  return getFromStorage<SupabaseConfig>(STORAGE_KEYS.SUPABASE, INITIAL_SUPABASE_CONFIG);
};
