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
  FianexLandingPlans
} from './components/landing-preview/FianexLandingPlans';
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
  fetchLiveServiceRequests
} from './services/supabaseService';

import { printOfficialPDFReport } from './services/exportService';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeAdmin, setActiveAdmin] = useState<AdminUser>(getActiveAdmin());

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

  // Sync live Supabase profiles on load
  useEffect(() => {
    fetchLiveSupabaseProfiles().then((profiles) => {
      if (profiles && profiles.length > 0) {
        // Map Supabase profiles to augment users list
        const mappedUsers: AppUser[] = profiles
          .filter((p) => p.first_name || p.phone_number)
          .map((p) => {
            const isExpert = p.role_id === 2 || p.current_mode_id === 2;
            const fullName = `${p.first_name || ''} ${p.last_name || ''}`.trim() || `Usuario #${p.profile_id}`;
            return {
              id: `usr-sb-${p.profile_id}`,
              name: fullName,
              email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@fianex.app`,
              phone: p.phone_number || '+1 809-555-0100',
              avatar: p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              type: isExpert ? 'expert' : 'client',
              status: p.status === 1 ? 'active' : 'pending',
              registeredAt: '2026-07-02',
              city: p.province_name || 'Santo Domingo',
              expertProfession: isExpert ? 'Experto Certificado' : undefined,
              expertPlan: isExpert ? (p.profile_id % 3 === 0 ? 'premium' : p.profile_id % 2 === 0 ? 'intermedio' : 'basico') : undefined,
              verificationStatus: p.is_verified ? 'fully_verified' : p.verification_status_name === 'unverified' ? 'unverified' : 'id_pending',
              completedJobs: 12,
              monthlyProposalsUsed: 4,
              monthlyProposalsLimit: 30
            };
          });

        if (mappedUsers.length > 0) {
          // Merge preserving unique ids
          setUsers((prev) => {
            const existingIds = new Set(prev.map((u) => u.id));
            const newToAdd = mappedUsers.filter((u) => !existingIds.has(u.id));
            return [...newToAdd, ...prev];
          });
        }
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

  const handleRoleChange = (newRole: UserRole) => {
    const updatedAdmin = setActiveAdminRole(newRole);
    setActiveAdmin(updatedAdmin);
    showToast(`Rol cambiado a: ${newRole.toUpperCase()} (${updatedAdmin.name})`);
  };

  const handleApproveVerification = (id: string, notes?: string) => {
    const result = approveVerification(id, notes);
    if (result) {
      setVerifications(getStoredVerifications());
      setUsers(getStoredUsers());
      showToast(`Solicitud ${id} aprobada con éxito.`);
    }
  };

  const handleRejectVerification = (id: string, reason: string, notes?: string) => {
    const result = rejectVerification(id, reason, notes);
    if (result) {
      setVerifications(getStoredVerifications());
      setUsers(getStoredUsers());
      showToast(`Solicitud ${id} rechazada.`);
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
    showToast(`Respuesta enviada en ticket ${ticketId}`);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    updateTicketStatus(ticketId, status);
    setTickets(getStoredTickets());
    showToast(`Ticket ${ticketId} marcado como ${status.toUpperCase()}`);
  };

  const handleQuickExport = () => {
    printOfficialPDFReport({
      title: 'Reporte General de Operaciones Fianex Backoffice',
      subtitle: `Fecha de Corte: ${new Date().toLocaleDateString('es-DO')} · Generado por ${activeAdmin.name} (${activeAdmin.role})`,
      kpis: [
        { label: 'Clientes Activos', value: '1,424' },
        { label: 'Expertos Activos', value: '290' },
        { label: 'Planes Premium Activos', value: '56' },
        { label: 'Pendientes Verificación', value: String(verifications.filter((v) => v.status === 'pending').length) }
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

            {currentView === 'landing_plans' && (
              <FianexLandingPlans isDark={isDark} />
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
