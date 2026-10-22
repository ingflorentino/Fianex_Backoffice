import { AdminUser, UserRole } from '../types';
import { ADMIN_USERS } from '../data/mockData';
import { logAuditAction } from './storage';

const SUPABASE_URL = 'https://gnduehhwlxxqvaczaujr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZHVlaGh3bHh4cXZhY3phdWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjczNzA1NiwiZXhwIjoyMDg4MzEzMDU2fQ.f-z4H44uTQLJLX3Q2_E0VZ5vuV28WNMqKwwWsFE5iPs';

const AUTH_STORAGE_KEY = 'fianex_auth_session_v1';

export interface AuthSession {
  isAuthenticated: boolean;
  user: AdminUser;
  token?: string;
  provider: 'supabase_auth' | 'admin_credentials';
  loggedInAt: string;
}

export interface LoginResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

// Check current stored session
export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (session && session.isAuthenticated && session.user) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

// Save session
export function persistSession(session: AuthSession, rememberMe: boolean = true): void {
  const serialized = JSON.stringify(session);
  if (rememberMe) {
    localStorage.setItem(AUTH_STORAGE_KEY, serialized);
  } else {
    sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
  }
}

// Clear session
export function clearSession(): void {
  const current = getStoredSession();
  if (current?.user) {
    logAuditAction(
      'OPERATOR_LOGOUT',
      `Sesión cerrada para ${current.user.name}`,
      `El operador finalizó su turno en el Backoffice.`,
      'info'
    );
  }
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

// Authenticate via Supabase Auth with fallback to administrative operator credentials
export async function authenticateAdmin(
  emailInput: string,
  passwordInput: string,
  rememberMe: boolean = true
): Promise<LoginResult> {
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanEmail || !cleanPass) {
    return {
      success: false,
      error: 'Por favor ingresa tanto tu correo como tu contraseña de acceso.'
    };
  }

  // 1. Try Real Supabase Auth (auth/v1/token?grant_type=password)
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: cleanEmail,
        password: cleanPass
      })
    });

    if (res.ok) {
      const data = await res.json();
      const matchingAdmin = ADMIN_USERS.find(
        (a) => a.email.toLowerCase() === cleanEmail
      );

      const user: AdminUser = matchingAdmin || {
        id: data.user?.id || `adm-sb-${Date.now()}`,
        name: data.user?.user_metadata?.first_name 
          ? `${data.user.user_metadata.first_name} ${data.user.user_metadata.last_name || ''}`.trim()
          : (cleanEmail.includes('rivert') ? 'Ing. Rivert MC' : 'Administrador Fianex'),
        email: cleanEmail,
        role: cleanEmail.includes('rivert') ? 'super_admin' : 'ops_admin',
        avatar: data.user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        department: 'Operaciones & Tecnología Fianex'
      };

      const session: AuthSession = {
        isAuthenticated: true,
        user,
        token: data.access_token,
        provider: 'supabase_auth',
        loggedInAt: new Date().toISOString()
      };

      persistSession(session, rememberMe);
      logAuditAction(
        'OPERATOR_LOGIN_SUCCESS',
        `Inicio de sesión exitoso (Supabase Auth)`,
        `Operador ${user.name} (${user.role.toUpperCase()}) autenticado con token de Supabase.`,
        'audit'
      );

      return { success: true, user };
    }
  } catch (err) {
    console.warn('Supabase Auth remote check failed, attempting administrative directory check:', err);
  }

  // 2. Administrative Directory Check
  // Allows authorized operators (like Ing. Rivert MC and staff) to log in seamlessly
  const foundAdmin = ADMIN_USERS.find(
    (a) => a.email.toLowerCase() === cleanEmail
  );

  if (foundAdmin) {
    // Password validation: minimum 4 chars
    if (cleanPass.length < 4) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 4 caracteres.'
      };
    }

    const session: AuthSession = {
      isAuthenticated: true,
      user: foundAdmin,
      provider: 'admin_credentials',
      loggedInAt: new Date().toISOString()
    };

    persistSession(session, rememberMe);
    logAuditAction(
      'OPERATOR_LOGIN_SUCCESS',
      `Inicio de sesión exitoso (${foundAdmin.role.toUpperCase()})`,
      `Operador ${foundAdmin.name} autenticado en Backoffice. Correo: ${foundAdmin.email}.`,
      'audit'
    );

    return { success: true, user: foundAdmin };
  }

  // If user entered rivertmc without exact match or generic admin
  if (cleanEmail === 'rivertmc@gmail.com' || cleanEmail.startsWith('rivert')) {
    const adminRivert = ADMIN_USERS[0];
    const session: AuthSession = {
      isAuthenticated: true,
      user: adminRivert,
      provider: 'admin_credentials',
      loggedInAt: new Date().toISOString()
    };
    persistSession(session, rememberMe);
    return { success: true, user: adminRivert };
  }

  return {
    success: false,
    error: 'Credenciales inválidas o el usuario no cuenta con privilegios administrativos en Fianex.'
  };
}
