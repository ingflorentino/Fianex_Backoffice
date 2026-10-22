import React from 'react';
import {
  ShieldAlert,
  Download,
  CheckCircle2,
  ChevronDown,
  Sun,
  Moon,
  UserCheck,
  LogOut,
  User,
  KeyRound
} from 'lucide-react';
import { AdminUser, UserRole } from '../../types';
import { ADMIN_USERS } from '../../data/mockData';

interface HeaderProps {
  currentView: string;
  activeAdmin: AdminUser;
  onRoleChange: (role: UserRole) => void;
  pendingCount: number;
  onQuickExport: () => void;
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard de Operaciones',
    subtitle: 'Métricas en tiempo real, clientes activos y suscripciones de expertos'
  },
  verifications: {
    title: 'Centro de Verificación Documental',
    subtitle: 'Revisión y aprobación de Cédulas, Identidad y Certificaciones Técnicas'
  },
  users: {
    title: 'Gestión de Usuarios & Expertos',
    subtitle: 'Directorio de clientes, técnicos, planes de suscripción y permisos'
  },
  transactions: {
    title: 'Transacciones & Suscripciones',
    subtitle: 'Control financiero de planes Básico, Intermedio y Premium'
  },
  analytics: {
    title: 'Reportes Analíticos',
    subtitle: 'Métricas de crecimiento, conversión documental y exportación'
  },
  support: {
    title: 'Módulo de Soporte al Usuario',
    subtitle: 'Atención a consultas de clientes y expertos con SLA garantizado'
  },
  staff: {
    title: 'Manejo de Personal del Backoffice',
    subtitle: 'Gestión de operadores de operaciones, soporte y directivos'
  },
  logs: {
    title: 'Logs en Tiempo Real & Auditoría',
    subtitle: 'Trazabilidad forense para auditores y administradores de sistema'
  },
  landing_plans: {
    title: 'Portal Web fianex.app · Planes & Comparativa',
    subtitle: 'Previsualización de la sección de planes para el marketplace de expertos'
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activeAdmin,
  onRoleChange,
  pendingCount,
  onQuickExport,
  onOpenSearch,
  isDark,
  onToggleTheme,
  onLogout,
  onOpenProfile
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);
  const viewInfo = VIEW_TITLES[currentView] || {
    title: 'Backoffice Fianex',
    subtitle: 'Centro de control operativo'
  };

  const roleLabels: Record<UserRole, { title: string; lightBadge: string; darkBadge: string; desc: string }> = {
    super_admin: {
      title: 'Super Administrador',
      lightBadge: 'text-purple-700 bg-purple-50 border-purple-200',
      darkBadge: 'text-purple-400 bg-purple-950/60 border-purple-800',
      desc: 'Control maestro de roles, configuración y finanzas'
    },
    ops_admin: {
      title: 'Admin de Operaciones',
      lightBadge: 'text-teal-700 bg-teal-50 border-teal-200',
      darkBadge: 'text-teal-400 bg-teal-950/60 border-teal-800',
      desc: 'Validación documental, soporte y gestión de usuarios'
    },
    system_auditor: {
      title: 'Auditor de Sistema',
      lightBadge: 'text-amber-800 bg-amber-50 border-amber-200',
      darkBadge: 'text-amber-400 bg-amber-950/60 border-amber-800',
      desc: 'Solo lectura, auditoría y trazabilidad'
    },
    support_agent: {
      title: 'Agente de Soporte',
      lightBadge: 'text-blue-700 bg-blue-50 border-blue-200',
      darkBadge: 'text-blue-400 bg-blue-950/60 border-blue-800',
      desc: 'Gestión de tickets y soporte a expertos'
    }
  };

  const activeRoleBadge = isDark
    ? roleLabels[activeAdmin.role].darkBadge
    : roleLabels[activeAdmin.role].lightBadge;

  return (
    <header
      className={`h-18 px-6 flex items-center justify-between gap-4 border-b sticky top-0 z-30 transition-colors ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md text-white'
          : 'bg-white/95 border-slate-200 backdrop-blur-md text-slate-900 shadow-xs'
      }`}
    >
      {/* Title & Context */}
      <div className="min-w-0">
        <h1 className="text-lg font-bold tracking-tight truncate flex items-center gap-2">
          {viewInfo.title}
          {pendingCount > 0 && currentView === 'verifications' && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
              isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              {pendingCount} pendientes
            </span>
          )}
        </h1>
        <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {viewInfo.subtitle}
        </p>
      </div>

      {/* Right Controls: Theme Toggle, Role Switcher, Quick Export */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Theme Toggle (Light / Dark mode, default Light) */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
          title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] hidden md:inline">Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span className="text-[11px] hidden md:inline">Oscuro</span>
            </>
          )}
        </button>

        {/* Export Quick Action */}
        <button
          onClick={onQuickExport}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
          }`}
          title="Exportar reporte"
        >
          <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="hidden md:inline">Exportar PDF</span>
        </button>

        {/* My Profile & Password Action */}
        {onOpenProfile && (
          <button
            onClick={onOpenProfile}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
            title="Mi perfil y cambiar contraseña"
          >
            <img
              src={activeAdmin.avatar}
              alt={activeAdmin.name}
              className="w-5 h-5 rounded-full object-cover border border-slate-300 dark:border-slate-700"
              referrerPolicy="no-referrer"
            />
            <span className="hidden lg:inline text-[11px] font-bold">{activeAdmin.name.split(' ')[0]}</span>
            <KeyRound className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          </button>
        )}

        {/* Role-Based Access Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${activeRoleBadge}`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{roleLabels[activeAdmin.role].title}</span>
            <span className="sm:hidden">{activeAdmin.role.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {roleMenuOpen && (
            <div
              className={`absolute right-0 mt-2 w-72 rounded-xl border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className={`px-2.5 py-2 border-b text-[11px] ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Control de Acceso por Roles (RBAC)
                </span>
                <p className="mt-0.5">Alterna el operador para validar permisos de aprobación y visualización.</p>
              </div>
              <div className="mt-1 space-y-1">
                {ADMIN_USERS.map((admin) => {
                  const isCurrent = admin.role === activeAdmin.role;
                  const info = roleLabels[admin.role];
                  return (
                    <button
                      key={admin.id}
                      onClick={() => {
                        onRoleChange(admin.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                        isCurrent
                          ? isDark
                            ? 'bg-teal-500/15 text-teal-200 border border-teal-500/30'
                            : 'bg-teal-50 text-teal-900 border border-teal-200 font-semibold'
                          : isDark
                          ? 'hover:bg-slate-800 text-slate-300'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <img
                        src={admin.avatar}
                        alt={admin.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-slate-300 dark:border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold flex items-center justify-between">
                          <span>{info.title}</span>
                          {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                        </div>
                        <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {admin.name}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {info.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Edit My Profile Link */}
              {onOpenProfile && (
                <div className={`mt-2 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <button
                    onClick={() => {
                      setRoleMenuOpen(false);
                      onOpenProfile();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2.5 ${
                      isDark
                        ? 'text-teal-300 hover:bg-teal-500/10'
                        : 'text-teal-700 hover:bg-teal-50'
                    }`}
                  >
                    <User className="w-4 h-4 shrink-0 text-teal-500" />
                    <span>Mi Perfil & Contraseña</span>
                  </button>
                </div>
              )}

              {onLogout && (
                <div className={`mt-1 pt-1 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <button
                    onClick={() => {
                      setRoleMenuOpen(false);
                      onLogout();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2.5 ${
                      isDark
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Logout Header Icon */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                : 'border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 shadow-2xs'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
