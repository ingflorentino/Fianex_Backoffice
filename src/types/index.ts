export type UserRole = 'super_admin' | 'ops_admin' | 'system_auditor' | 'support_agent';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  phone?: string;
  password?: string;
  status?: 'active' | 'suspended';
  createdAt?: string;
  lastLogin?: string;
}

export type ExpertPlan = 'basico' | 'intermedio' | 'premium';
export type ExpertCategory = 'Tecnico' | 'Profesional' | 'Especialista';
export type VerificationStatus = 
  | 'unverified' 
  | 'id_pending' 
  | 'id_approved' 
  | 'cert_pending' 
  | 'fully_verified' 
  | 'rejected';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  type: 'client' | 'expert';
  role_id: 1 | 2; // 1 = cliente, 2 = experto (tabla perfiles)
  status: 'active' | 'suspended' | 'pending';
  registeredAt: string;
  city: string;
  // Specific for experts
  expertCategory?: ExpertCategory;
  expertProfession?: string;
  expertPlan?: ExpertPlan;
  verificationStatus: VerificationStatus;
  rating?: number;
  completedJobs?: number;
  monthlyProposalsUsed?: number;
  monthlyProposalsLimit?: number | 'unlimited';
  idNumber?: string;
  idType?: 'Cédula' | 'Pasaporte' | 'Licencia';
  idDocUrl?: string;
  certDocUrl?: string;
  bio?: string;
}

// Model corresponding strictly to Supabase table 'perfiles'
export interface PerfilRecord {
  id: number;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  role_id: 1 | 2; // 1: cliente, 2: experto
  status: number;
  is_verified: boolean | null;
  verification_status_id: number;
  document_number: string | null;
  subscription_status: string | null;
  avatar_url: string | null;
  created_at?: string;
  province_id?: number | null;
  description?: string | null;
}

// Model corresponding strictly to Supabase table 'subscriptions'
export interface SubscriptionRecord {
  id: number | string;
  user_id: string; // references perfiles/auth uuid
  plan_id: 1 | 2 | 3; // 1: Básico ($0), 2: Intermedio ($349.99), 3: Premium ($499.99)
  plan_code?: 'BASIC' | 'INTERMEDIATE' | 'PREMIUM';
  plan_name?: string;
  amount?: number;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  proposals_limit: number;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

// Model corresponding strictly to Supabase table 'Verifications_requests' (verification_requests)
export interface VerificationRequestRecord {
  id: number | string;
  request_number: string; // e.g. '#202610-00041'
  user_id: string;
  request_type: 'identity' | 'certification';
  status_id: 1 | 2 | 3 | 4; // 1: unverified, 2: pending, 3: approved, 4: rejected
  document_number: string | null;
  document_url: string | null;
  document_type_id?: number;
  requested_level?: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface StorageDocumentItem {
  name: string;
  path: string;
  url: string;
  bucket: 'identity_docs' | 'professional_docs';
  size?: string;
  sizeBytes?: number;
  mimetype?: string;
  isPdf?: boolean;
  createdAt?: string;
}

export interface VerificationRequest {
  id: string; // e.g. '#202610-00041'
  rawId?: number | string;
  userId: string;
  rawUserId?: string; // UUID in supabase auth/profiles
  userName: string;
  userEmail: string;
  userAvatar: string;
  userPhone?: string;
  type: 'identity' | 'professional_category';
  docType: 'Cédula' | 'Pasaporte' | 'Licencia' | 'Título Técnico' | 'Diploma Universitario' | 'Certificación Profesional';
  idNumber?: string;
  category?: ExpertCategory;
  profession?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_resubmission';
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  reviewerNotes?: string;
  documentUrl: string;
  documentBackUrl?: string;
  storageBucket?: 'identity_docs' | 'professional_docs';
  documents?: StorageDocumentItem[];
  documentMeta: {
    issuer?: string;
    issueDate?: string;
    expiryDate?: string;
    ocrMatchScore?: number;
    fileSize?: string;
  };
}

export interface Transaction {
  id: string;
  reference: string;
  userId: string;
  userName: string;
  userType: 'client' | 'expert';
  type: 'subscription' | 'service_fee' | 'expert_payout' | 'escrow_hold';
  plan?: ExpertPlan;
  amount: number;
  currency: 'DOP' | 'MXN' | 'USD';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  date: string;
  description: string;
}

export interface TicketMessage {
  id: string;
  sender: string;
  isStaff: boolean;
  avatar?: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string; // e.g. 'TK-8942'
  subject: string;
  requesterName: string;
  requesterEmail: string;
  requesterAvatar: string;
  requesterRole: 'client' | 'expert';
  category: 'Verificación' | 'Pagos y Facturación' | 'App Móvil Flutter' | 'Disputas de Trabajo' | 'Acceso a Cuenta';
  priority: 'baja' | 'media' | 'alta' | 'critica';
  status: 'abierto' | 'en_progreso' | 'esperando_usuario' | 'resuelto' | 'cerrado';
  slaDue: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  operatorName: string;
  operatorRole: UserRole;
  action: string;
  target: string;
  details: string;
  severity: 'info' | 'warning' | 'critical' | 'audit';
  ip: string;
}

export interface CloudflareWorker {
  id: string;
  name: string;
  route: string;
  environment: 'production' | 'staging';
  status: 'operational' | 'degraded' | 'deploying';
  version: string;
  lastDeployed: string;
  invocations24h: number;
  avgLatencyMs: number;
  errorRate: number;
  description: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceKey: string;
  database: string;
  connected: boolean;
  poolerHost: string;
  activeConnections: number;
  rlsPoliciesEnforced: boolean;
  tables: Array<{
    name: string;
    rowCount: number;
    rlsEnabled: boolean;
    lastSynced: string;
  }>;
}

export interface PlanFeatureComparison {
  feature: string;
  category: string;
  basico: string | boolean;
  intermedio: string | boolean;
  premium: string | boolean;
  highlight?: boolean;
}
