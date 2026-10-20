import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  CreditCard,
  BarChart3,
  Headphones,
  Terminal,
  Globe2
} from 'lucide-react';
import { AdminUser } from '../../types';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  activeAdmin: AdminUser;
  pendingVerificationsCount: number;
  openTicketsCount: number;
  isDark: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  activeAdmin,
  pendingVerificationsCount,
  openTicketsCount,
  isDark
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Principal',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'verifications',
      label: 'Centro de Verificación',
      icon: ShieldCheck,
      badge: pendingVerificationsCount > 0 ? pendingVerificationsCount : null,
      badgeColor: isDark
        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
        : 'bg-amber-100 text-amber-800 border border-amber-300'
    },
    {
      id: 'users',
      label: 'Gestión de Usuarios',
      icon: Users,
      badge: null
    },
    {
      id: 'transactions',
      label: 'Transacciones & Planes',
      icon: CreditCard,
      badge: null
    },
    {
      id: 'analytics',
      label: 'Reportes Analíticos',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'support',
      label: 'Módulo de Soporte',
      icon: Headphones,
      badge: openTicketsCount > 0 ? openTicketsCount : null,
      badgeColor: isDark
        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
        : 'bg-teal-100 text-teal-800 border border-teal-300'
    },
    {
      id: 'logs',
      label: 'Logs de Auditoría',
      icon: Terminal,
      badge: null
    }
  ];

  return (
    <aside
      className={`w-64 md:w-72 flex flex-col shrink-0 select-none transition-colors border-r ${
        isDark
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      {/* Brand Header */}
      <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2B8DA9] to-[#54C5D4] flex items-center justify-center shadow-md font-black text-white text-xl tracking-tighter">
            F
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Fianex
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                isDark ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}>
                Admin
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Backoffice de Operaciones
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className={`px-3 mb-2 text-[11px] font-bold uppercase tracking-wider ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Módulos Operativos
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                        : 'bg-teal-50 text-teal-800 border border-teal-200 font-semibold shadow-xs'
                      : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono tabular-nums font-semibold shrink-0 ${
                        item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Static Page & Pricing section */}
        <div>
          <div className={`px-3 mb-2 text-[11px] font-bold uppercase tracking-wider ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Portal Web & Suscripciones
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectView('landing_plans')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentView === 'landing_plans'
                  ? isDark
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Globe2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="truncate">fianex.app (Planes)</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                isDark ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-800' : 'text-cyan-700 bg-cyan-100 border border-cyan-200'
              }`}>
                Página
              </span>
            </button>
          </div>
        </div>

        {/* Connected DB status badge */}
        <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
          isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Supabase Postgres
            </span>
            <span className="text-[10px] font-mono text-slate-400">gnduehh...</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Conectado a la base de datos oficial de la app móvil.
          </p>
        </div>
      </div>

      {/* Operator Session Footer */}
      <div className={`p-3 border-t ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}>
        <div className={`flex items-center gap-3 p-2 rounded-lg border ${
          isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'
        }`}>
          <img
            src={activeAdmin.avatar}
            alt={activeAdmin.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeAdmin.name}
            </div>
            <div className="text-[10px] text-teal-600 dark:text-teal-400 capitalize truncate font-mono">
              {activeAdmin.role.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
