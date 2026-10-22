import React, { useState, useEffect } from 'react';
import {
  Sidebar
} from './components/layout/Sidebar';
import {
  Header
} from './components/layout/Header';
import {
  DashboardOverview
} from './components/dashboard/DashboardOverview';
import {
  VerificationCenter
} from './components/verification/VerificationCenter';
import {
  UserManagement
} from './components/users/UserManagement';
import {
  AnalyticsReports
} from './components/analytics/AnalyticsReports';
import {
  SupportTickets
} from './components/support/SupportTickets';
import {
  TransactionsView
} from './components/transactions/TransactionsView';
import {
  AuditLogsView
} from './components/logs/AuditLogsView';
import {
  QuickSearchModal
} from './components/common/QuickSearchModal';

import {
  AppUser,
  VerificationRequest,
  Transaction,
  SupportTicket,
  AuditLog,
  UserRole,
  AdminUser
} from './types';

import {
  getActiveAdmin,
  setActiveAdminRole,
  getStoredUsers,
  updateStoredUser,
  getStoredVerifications,
  approveVerification,
  rejectVerification,
  getStoredTransactions,
  getStoredTickets,
  addTicketResponse,
  updateTicketStatus,
  getStoredAuditLogs,
  subscribeToStorage
} from './services/storage';

import {
  fetchLiveSupabaseProfiles,
  fetchLiveSupabaseTickets,
  fetchLiveSupabaseVerificationRequests,
  updateSupabaseVerificationRequest,
  addSupabaseTicketMessage,
  updateSupabaseTicketStatus
} from './services/supabaseService';

import { printOfficialPDFReport } from './services/exportService';
import { LoginView } from './components/auth/LoginView';
import { getStoredSession, clearSession, persistSession, AuthSession } from './services/authService';

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeAdmin, setActiveAdmin] = useState<AdminUser>(() => {
    const stored = getStoredSession();
    return stored?.user || getActiveAdmin();
  });

  // Default theme is LIGHT as requested by user ("por defecto sea modo claro")
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('fianex_theme') === 'dark';
  });

  // Data states
  const [users, setUsers] = useState<AppUser[]>(getStoredUsers());
  const [verifications, setVerifications] = useState<VerificationRequest[]>(getStoredVerifications());
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions());
  const [tickets, setTickets] = useState<SupportTicket[]>(getStoredTickets());
  const [logs, setLogs] = useState<AuditLog[]>(getStoredAuditLogs());

  // Modals & Navigation helpers
  const [selectedVerificationId, setSelectedVerificationId] = useState<string | null>(null);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Apply theme class to document.body
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('fianex_theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('fianex_theme', 'light');
    }
  }, [isDark]);

  // Sync with storage changes
  useEffect(() => {
    const unsubscribe = subscribeToStorage(() => {
      setUsers(getStoredUsers());
      setVerifications(getStoredVerifications());
      setTransactions(getStoredTransactions());
      setTickets(getStoredTickets());
      setLogs(getStoredAuditLogs());
      setActiveAdmin(getActiveAdmin());
    });
    return unsubscribe;
  }, []);

  // Sync live Supabase profiles, tickets & verification requests on load
  useEffect(() => {
    fetchLiveSupabaseProfiles().then((liveProfiles) => {
      if (liveProfiles && liveProfiles.length > 0) {
        setUsers(liveProfiles);
      }
    });

    fetchLiveSupabaseTickets().then((liveTickets) => {
      if (liveTickets && liveTickets.length > 0) {
        setTickets(liveTickets);
      }
    });

    fetchLiveSupabaseVerificationRequests().then((liveVerifications) => {
      if (liveVerifications && liveVerifications.length > 0) {
        setVerifications((prev) => {
          const liveIds = new Set(liveVerifications.map((v) => v.id));
          const nonOverlapping = prev.filter((p) => !liveIds.has(p.id));
          return [...liveVerifications, ...nonOverlapping];
        });
      }
    });
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setActiveAdmin(user);
    setSession({
      isAuthenticated: true,
      user,
      provider: 'admin_credentials',
      loggedInAt: new Date().toISOString()
    });
    showToast(`¡Bienvenido al Backoffice, ${user.name}!`);
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    showToast('Sesión cerrada correctamente.');
  };

  const handleRoleChange = (newRole: UserRole) => {
    const updatedAdmin = setActiveAdminRole(newRole);
    setActiveAdmin(updatedAdmin);
    if (session) {
      const updatedSession = { ...session, user: updatedAdmin };
      setSession(updatedSession);
      persistSession(updatedSession);
    }
    showToast(`Rol cambiado a: ${newRole.toUpperCase()} (${updatedAdmin.name})`);
  };

  const handleApproveVerification = async (id: string, notes?: string) => {
    const currentAdmin = activeAdmin;
    const now = new Date().toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' });
    const target = verifications.find((v) => v.id === id);

    // 1. Immediately update React verifications state
    setVerifications((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: 'approved',
            reviewedAt: now,
            reviewedBy: `${currentAdmin.name} (${currentAdmin.role})`,
            reviewerNotes: notes || 'Validado conforme a la documentación presentada y cotejo de registros oficiales.'
          };
        }
        return v;
      })
    );

    // 2. Persist to storage
    approveVerification(id, notes, target);

    // 3. Update user verification status in state
    if (target) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === target.userId) {
            return {
              ...u,
              verificationStatus: target.type === 'identity' ? (u.expertCategory ? 'cert_pending' : 'id_approved') : 'fully_verified'
            };
          }
          return u;
        })
      );
    }

    showToast(`Solicitud ${id} aprobada con éxito.`);

    // 4. Dispatch to live Supabase database
    if (target?.rawId) {
      await updateSupabaseVerificationRequest(target.rawId, 3, notes || 'Aprobado por el Administrador', target.rawUserId);
    }
  };

  const handleRejectVerification = async (id: string, reason: string, notes?: string) => {
    const currentAdmin = activeAdmin;
    const now = new Date().toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' });
    const target = verifications.find((v) => v.id === id);

    // 1. Immediately update React verifications state
    setVerifications((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: 'rejected',
            reviewedAt: now,
            reviewedBy: `${currentAdmin.name} (${currentAdmin.role})`,
            rejectionReason: reason,
            reviewerNotes: notes || ''
          };
        }
        return v;
      })
    );

    // 2. Persist to storage
    rejectVerification(id, reason, notes, target);

    // 3. Update user verification status in state
    if (target) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === target.userId) {
            return {
              ...u,
              verificationStatus: 'rejected'
            };
          }
          return u;
        })
      );
    }

    showToast(`Solicitud ${id} rechazada.`);

    // 4. Dispatch to live Supabase database
    if (target?.rawId) {
      await updateSupabaseVerificationRequest(target.rawId, 4, `${reason}. ${notes || ''}`.trim(), target.rawUserId);
    }
  };

  const handleUpdateUser = (updatedUser: AppUser) => {
    updateStoredUser(updatedUser);
    setUsers(getStoredUsers());
    showToast(`Usuario ${updatedUser.name} actualizado`);
  };

  const handleAddTicketResponse = (ticketId: string, text: string) => {
    addTicketResponse(ticketId, text);
    setTickets(getStoredTickets());
    // Also dispatch to real Supabase database if tables are provisioned
    addSupabaseTicketMessage(ticketId, text, `${activeAdmin.name} (${activeAdmin.role})`).catch(() => {});
    showToast(`Respuesta enviada en ticket ${ticketId}`);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    updateTicketStatus(ticketId, status);
    setTickets(getStoredTickets());
    // Also dispatch to real Supabase database if tables are provisioned
    updateSupabaseTicketStatus(ticketId, status).catch(() => {});
    showToast(`Ticket ${ticketId} marcado como ${status.toUpperCase()}`);
  };

  const handleQuickExport = () => {
    printOfficialPDFReport({
      title: 'Reporte General de Operaciones Fianex Backoffice',
      subtitle: `Fecha de Corte: ${new Date().toLocaleDateString('es-DO')} · Generado por ${activeAdmin.name} (${activeAdmin.role})`,
      kpis: [
        { label: 'Clientes (role_id: 1)', value: String(users.filter((u) => u.role_id === 1 || u.type === 'client').length) },
        { label: 'Expertos (role_id: 2)', value: String(users.filter((u) => u.role_id === 2 || u.type === 'expert').length) },
        { label: 'Planes Premium (subscriptions)', value: String(users.filter((u) => u.expertPlan === 'premium').length) },
        { label: 'Pendientes (Verifications_requests)', value: String(verifications.filter((v) => v.status === 'pending').length) }
      ],
      tables: [
        {
          title: 'Resumen de Verificaciones de Expertos (Cédulas y Títulos)',
          headers: ['ID Expediente', 'Experto', 'Tipo', 'Documento', 'Estado'],
          rows: verifications.map((v) => [
            v.id,
            v.userName,
            v.type === 'identity' ? 'Identidad' : 'Certificación Técnica',
            v.docType,
            v.status.toUpperCase()
          ])
        }
      ]
    });
  };

  const pendingVerificationsCount = verifications.filter((v) => v.status === 'pending').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'abierto' || t.status === 'en_progreso').length;

  // Authentication Gate: Show LoginView if session is not active
  if (!session || !session.isAuthenticated) {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans antialiased transition-colors duration-150 ${
      isDark ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-800 border border-teal-500/50 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          setSelectedVerificationId(null);
        }}
        activeAdmin={activeAdmin}
        pendingVerificationsCount={pendingVerificationsCount}
        openTicketsCount={openTicketsCount}
        isDark={isDark}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header with Light/Dark toggle */}
        <Header
          currentView={currentView}
          activeAdmin={activeAdmin}
          onRoleChange={handleRoleChange}
          pendingCount={pendingVerificationsCount}
          onQuickExport={handleQuickExport}
          onOpenSearch={() => setIsQuickSearchOpen(true)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
        />

        {/* Viewport View Switcher */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && (
              <DashboardOverview
                users={users}
                verifications={verifications}
                transactions={transactions}
                activeAdmin={activeAdmin}
                onNavigate={(view) => setCurrentView(view)}
                onSelectVerification={(req) => {
                  setSelectedVerificationId(req.id);
                  setCurrentView('verifications');
                }}
                onExportReport={handleQuickExport}
                isDark={isDark}
              />
            )}

            {currentView === 'verifications' && (
              <VerificationCenter
                verifications={verifications}
                activeAdmin={activeAdmin}
                selectedVerificationId={selectedVerificationId}
                onApprove={handleApproveVerification}
                onReject={handleRejectVerification}
                isDark={isDark}
              />
            )}

            {currentView === 'users' && (
              <UserManagement
                users={users}
                activeAdmin={activeAdmin}
                onUpdateUser={handleUpdateUser}
                onSelectVerificationForUser={(userId) => {
                  const req = verifications.find((v) => v.userId === userId);
                  if (req) {
                    setSelectedVerificationId(req.id);
                    setCurrentView('verifications');
                  }
                }}
                isDark={isDark}
              />
            )}

            {currentView === 'transactions' && (
              <TransactionsView
                transactions={transactions}
                activeAdmin={activeAdmin}
                isDark={isDark}
              />
            )}

            {currentView === 'analytics' && (
              <AnalyticsReports
                users={users}
                verifications={verifications}
                transactions={transactions}
                isDark={isDark}
              />
            )}

            {currentView === 'support' && (
              <SupportTickets
                tickets={tickets}
                activeAdmin={activeAdmin}
                onAddResponse={handleAddTicketResponse}
                onUpdateStatus={handleUpdateTicketStatus}
                isDark={isDark}
              />
            )}

            {currentView === 'logs' && (
              <AuditLogsView
                logs={logs}
                activeAdmin={activeAdmin}
                isDark={isDark}
              />
            )}
          </div>
        </main>
      </div>

      {/* Quick Search Modal (Command Palette) */}
      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        users={users}
        verifications={verifications}
        tickets={tickets}
        onSelectAction={(view, id) => {
          setCurrentView(view);
          if (view === 'verifications' && id) {
            setSelectedVerificationId(id);
          }
        }}
      />
    </div>
  );
}
