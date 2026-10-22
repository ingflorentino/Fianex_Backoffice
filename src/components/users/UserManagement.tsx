import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Briefcase,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  UserCheck,
  UserX,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  Sparkles,
  Database
} from 'lucide-react';
import { AppUser, AdminUser, ExpertPlan, VerificationStatus } from '../../types';
import { exportUsersToExcel } from '../../services/exportService';
import { changeExpertSubscription } from '../../services/storage';

interface UserManagementProps {
  users: AppUser[];
  activeAdmin: AdminUser;
  onUpdateUser: (user: AppUser) => void;
  onSelectVerificationForUser?: (userId: string) => void;
  isDark?: boolean;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  activeAdmin,
  onUpdateUser,
  onSelectVerificationForUser,
  isDark = false
}) => {
  const [tab, setTab] = useState<'all' | 'client' | 'expert'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | ExpertPlan>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination: 12 records per page
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Selected user for details drawer
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tab, planFilter, statusFilter, searchQuery]);

  const filteredUsers = users.filter((u) => {
    // Filter by type or role_id (1: client, 2: expert)
    if (tab === 'client' && u.role_id !== 1 && u.type !== 'client') return false;
    if (tab === 'expert' && u.role_id !== 2 && u.type !== 'expert') return false;
    if (planFilter !== 'all' && u.expertPlan !== planFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchProf = u.expertProfession?.toLowerCase().includes(q) || false;
      const matchCity = u.city?.toLowerCase().includes(q) || false;
      const matchDoc = u.idNumber?.toLowerCase().includes(q) || false;
      if (!matchName && !matchEmail && !matchProf && !matchCity && !matchDoc) return false;
    }
    return true;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleToggleStatus = (user: AppUser) => {
    const updated: AppUser = {
      ...user,
      status: user.status === 'active' ? 'suspended' : 'active'
    };
    onUpdateUser(updated);
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(updated);
    }
  };

  const handleChangePlan = (user: AppUser, newPlan: ExpertPlan) => {
    changeExpertSubscription(user.id, newPlan);
    const limit = newPlan === 'basico' ? 10 : newPlan === 'intermedio' ? 30 : 'unlimited';
    const updated: AppUser = {
      ...user,
      expertPlan: newPlan,
      monthlyProposalsLimit: limit
    };
    onUpdateUser(updated);
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(updated);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className={`border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Tabs */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => {
                setTab('all');
                setPlanFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                tab === 'all'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'bg-white text-teal-950 font-black shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950 font-semibold'
              }`}
            >
              Todos ({users.length})
            </button>
            <button
              onClick={() => {
                setTab('expert');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                tab === 'expert'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'bg-white text-teal-950 font-black shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950 font-semibold'
              }`}
            >
              Expertos (role_id: 2 · {users.filter((u) => u.role_id === 2 || u.type === 'expert').length})
            </button>
            <button
              onClick={() => {
                setTab('client');
                setPlanFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                tab === 'client'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'bg-white text-teal-950 font-black shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950 font-semibold'
              }`}
            >
              Clientes (role_id: 1 · {users.filter((u) => u.role_id === 1 || u.type === 'client').length})
            </button>
          </div>

          {/* Expert Plan Filter (only if expert or all) */}
          {tab !== 'client' && (
            <div className={`flex items-center gap-1 p-1 rounded-xl border ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold px-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Planes:
              </span>
              <button
                onClick={() => setPlanFilter('all')}
                className={`px-2 py-0.5 text-xs rounded font-semibold ${
                  planFilter === 'all'
                    ? isDark
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-950 shadow-2xs font-bold border border-slate-200'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setPlanFilter('basico')}
                className={`px-2 py-0.5 text-xs rounded font-semibold ${
                  planFilter === 'basico'
                    ? isDark
                      ? 'bg-slate-800 text-slate-200 font-bold'
                      : 'bg-white text-slate-950 shadow-2xs font-bold border border-slate-200'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Básico ($0)
              </button>
              <button
                onClick={() => setPlanFilter('intermedio')}
                className={`px-2 py-0.5 text-xs rounded font-semibold ${
                  planFilter === 'intermedio'
                    ? isDark
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                      : 'bg-cyan-100 text-cyan-950 font-bold border border-cyan-300 shadow-2xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Intermedio ($349.99)
              </button>
              <button
                onClick={() => setPlanFilter('premium')}
                className={`px-2 py-0.5 text-xs rounded font-semibold ${
                  planFilter === 'premium'
                    ? isDark
                      ? 'bg-teal-950 text-teal-300 border border-teal-800 font-bold'
                      : 'bg-teal-100 text-teal-950 font-bold border border-teal-300 shadow-2xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Premium ($499.99)
              </button>
            </div>
          )}
        </div>

        {/* Search & Export Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, email, cédula o ciudad..."
              className={`rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none w-52 sm:w-64 border transition-colors ${
                isDark
                  ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-teal-600 focus:bg-white font-medium'
              }`}
            />
          </div>

          <button
            onClick={() => exportUsersToExcel(filteredUsers)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300 shadow-2xs'
            }`}
            title="Exportar a Excel (CSV/XLSX)"
          >
            <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className={`border rounded-2xl overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-extrabold uppercase tracking-wider text-[11px] ${
                isDark ? 'border-slate-800 bg-slate-950/70 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}>
                <th className="py-3.5 px-4">Usuario</th>
                <th className="py-3.5 px-4">Tipo & Rol (perfiles)</th>
                <th className="py-3.5 px-4">Plan (subscriptions)</th>
                <th className="py-3.5 px-4">Nivel Verificación</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Rendimiento</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200/80'}`}>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`py-8 text-center text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`transition-colors group cursor-pointer ${
                      isDark
                        ? 'hover:bg-slate-800/60'
                        : 'hover:bg-slate-100/90'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    {/* User info: High contrast in light mode */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0 shadow-2xs"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className={`font-black text-sm truncate flex items-center gap-1.5 ${
                            isDark ? 'text-white' : 'text-slate-950'
                          }`}>
                            <span>{user.name}</span>
                            {user.rating && user.rating >= 4.8 && (
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                            )}
                          </div>
                          <div className={`text-xs truncate font-medium ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {user.email}
                          </div>
                          <div className={`text-[11px] font-semibold ${
                            isDark ? 'text-slate-500' : 'text-slate-700'
                          }`}>
                            {user.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type & Role */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span
                          className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded border shadow-2xs ${
                            user.type === 'expert' || user.role_id === 2
                              ? isDark
                                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                                : 'bg-teal-100 text-teal-950 border-teal-300'
                              : isDark
                              ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800'
                              : 'bg-sky-100 text-sky-950 border-sky-300'
                          }`}
                        >
                          {user.type === 'expert' || user.role_id === 2 ? 'EXPERTO (role_id: 2)' : 'CLIENTE (role_id: 1)'}
                        </span>
                        {user.expertProfession ? (
                          <div className={`text-xs font-bold truncate mt-1 ${
                            isDark ? 'text-slate-200' : 'text-slate-900'
                          }`}>
                            {user.expertProfession}
                          </div>
                        ) : (
                          <div className={`text-xs font-medium truncate mt-1 ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            Cliente Solicitante
                          </div>
                        )}
                        {user.expertCategory && (
                          <div className={`text-[11px] font-medium capitalize ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            Cat: {user.expertCategory}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Expert Plan */}
                    <td className="py-3.5 px-4">
                      {user.type === 'expert' || user.role_id === 2 ? (
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${
                              user.expertPlan === 'premium'
                                ? isDark
                                  ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                                  : 'bg-teal-100 text-teal-950 border-teal-400'
                                : user.expertPlan === 'intermedio'
                                ? isDark
                                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                                  : 'bg-cyan-100 text-cyan-950 border-cyan-400'
                                : isDark
                                ? 'bg-slate-800 text-slate-300 border-slate-700'
                                : 'bg-slate-200 text-slate-950 border-slate-300'
                            }`}
                          >
                            {user.expertPlan === 'premium' && <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />}
                            {(user.expertPlan || 'basico').toUpperCase()}
                          </span>
                          <div className={`text-xs font-bold mt-1 ${
                            isDark ? 'text-slate-300' : 'text-slate-900'
                          }`}>
                            {user.expertPlan === 'premium'
                              ? '$499.99 Pesos/mes'
                              : user.expertPlan === 'intermedio'
                              ? '$349.99 Pesos/mes'
                              : '$0 (Para siempre)'}
                          </div>
                        </div>
                      ) : (
                        <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          N/A (Cliente)
                        </span>
                      )}
                    </td>

                    {/* Verification Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {user.verificationStatus === 'fully_verified' ? (
                          <span className={`flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded border ${
                            isDark
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                              : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                          }`}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Verificado Total
                          </span>
                        ) : user.verificationStatus === 'cert_pending' || user.verificationStatus === 'id_pending' ? (
                          <span className={`flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded border ${
                            isDark
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                              : 'bg-amber-100 text-amber-950 border-amber-300'
                          }`}>
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> En Revisión
                          </span>
                        ) : user.verificationStatus === 'id_approved' ? (
                          <span className={`flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded border ${
                            isDark
                              ? 'bg-teal-950/80 text-teal-300 border-teal-800'
                              : 'bg-teal-100 text-teal-950 border-teal-300'
                          }`}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Cédula Validada
                          </span>
                        ) : user.verificationStatus === 'rejected' ? (
                          <span className={`flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded border ${
                            isDark
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                              : 'bg-rose-100 text-rose-950 border-rose-300'
                          }`}>
                            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Rechazado
                          </span>
                        ) : (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                            isDark
                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}>
                            Sin verificar
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Account Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border shadow-2xs ${
                          user.status === 'active'
                            ? isDark
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                            : user.status === 'suspended'
                            ? isDark
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : 'bg-rose-100 text-rose-950 border-rose-400'
                            : isDark
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-amber-100 text-amber-950 border-amber-400'
                        }`}
                      >
                        {user.status === 'active'
                          ? 'Activo'
                          : user.status === 'suspended'
                          ? 'Suspendido'
                          : 'Pendiente'}
                      </span>
                    </td>

                    {/* Performance Metrics */}
                    <td className="py-3.5 px-4 text-right">
                      {user.type === 'expert' || user.role_id === 2 ? (
                        <div>
                          <div className={`font-mono text-xs font-black ${
                            isDark ? 'text-white' : 'text-slate-950'
                          }`}>
                            {user.completedJobs || 0} trabajos
                          </div>
                          <div className={`text-[11px] font-semibold ${
                            isDark ? 'text-slate-400' : 'text-slate-700'
                          }`}>
                            Propuestas: {user.monthlyProposalsUsed || 0} / {user.monthlyProposalsLimit === 'unlimited' ? '∞' : (user.monthlyProposalsLimit || 10)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className={`font-mono text-xs font-black ${
                            isDark ? 'text-white' : 'text-slate-950'
                          }`}>
                            {user.completedJobs || 0} contratos
                          </div>
                          <div className={`text-[11px] font-semibold ${
                            isDark ? 'text-slate-400' : 'text-slate-700'
                          }`}>
                            Desde {user.registeredAt}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Actions button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                          isDark
                            ? 'bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-200 border border-slate-700'
                            : 'bg-slate-900 hover:bg-teal-700 text-white border border-slate-900'
                        }`}
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (12 per page) */}
        {totalItems > 0 && (
          <div className={`px-4 py-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs select-none transition-colors ${
            isDark ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-slate-200 bg-slate-50/70 text-slate-600'
          }`}>
            {/* Status range summary */}
            <div className="flex items-center gap-1.5 font-medium">
              <span>Mostrando</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{startIndex + 1}</span>
              <span>a</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{endIndex}</span>
              <span>de</span>
              <span className={`font-bold ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>{totalItems}</span>
              <span>usuarios</span>
              <span className="hidden sm:inline opacity-60">· (12 por página)</span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              {/* First page button */}
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={validCurrentPage <= 1}
                className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  validCurrentPage <= 1
                    ? 'opacity-40 cursor-not-allowed border-transparent'
                    : isDark
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700 bg-white shadow-2xs'
                }`}
                title="Primera página"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Prev button */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={validCurrentPage <= 1}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  validCurrentPage <= 1
                    ? 'opacity-40 cursor-not-allowed border-transparent'
                    : isDark
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700 bg-white shadow-2xs'
                }`}
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1 mx-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 7) return true;
                    if (p === 1 || p === totalPages) return true;
                    if (Math.abs(p - validCurrentPage) <= 1) return true;
                    return false;
                  })
                  .reduce<(number | string)[]>((acc, page, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === 'number') {
                      const prevPage = arr[idx - 1] as number;
                      if ((page as number) - prevPage > 1) {
                        acc.push(`dots-${prevPage}`);
                      }
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item) => {
                    if (typeof item === 'string') {
                      return (
                        <span key={item} className="px-1 text-slate-400 font-bold select-none">
                          ...
                        </span>
                      );
                    }
                    const isCurrent = item === validCurrentPage;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCurrentPage(item)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                          isCurrent
                            ? isDark
                              ? 'bg-teal-500 text-slate-950 font-black shadow-sm'
                              : 'bg-teal-600 text-white font-black shadow-2xs'
                            : isDark
                            ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
              </div>

              {/* Next button */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={validCurrentPage >= totalPages}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  validCurrentPage >= totalPages
                    ? 'opacity-40 cursor-not-allowed border-transparent'
                    : isDark
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700 bg-white shadow-2xs'
                }`}
                title="Página siguiente"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last page button */}
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={validCurrentPage >= totalPages}
                className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  validCurrentPage >= totalPages
                    ? 'opacity-40 cursor-not-allowed border-transparent'
                    : isDark
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700 bg-white shadow-2xs'
                }`}
                title="Última página"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Management Slideover / Drawer Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className={`w-full max-w-lg border-l h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div>
              {/* Drawer Header */}
              <div className={`flex items-center justify-between pb-4 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold">{selectedUser.id}</span>
                  <span className="text-slate-400">·</span>
                  <span className={`text-xs font-bold uppercase ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {selectedUser.type === 'expert' || selectedUser.role_id === 2 ? 'Ficha de Experto (role_id: 2)' : 'Ficha de Cliente (role_id: 1)'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="pt-4 flex items-start gap-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-md shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs text-teal-700 dark:text-teal-300 font-bold">
                    {selectedUser.expertProfession || 'Cliente Registrado en Fianex'}
                  </p>
                  <div className={`mt-2 flex flex-wrap items-center gap-2 text-xs font-medium ${
                    isDark ? 'text-slate-400' : 'text-slate-700'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {selectedUser.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {selectedUser.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {selectedUser.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expert Subscription Plan Management */}
              {(selectedUser.type === 'expert' || selectedUser.role_id === 2) && (
                <div className={`mt-6 p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-900'
                    }`}>
                      <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      Plan en Tabla subscriptions
                    </span>
                    <span className="text-xs font-mono font-black text-teal-700 dark:text-teal-300 uppercase">
                      {selectedUser.expertPlan}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    Modifica directamente la membresía en la tabla <span className="font-mono font-bold">subscriptions</span> vinculada a este experto. El límite de propuestas se sincroniza inmediatamente.
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => handleChangePlan(selectedUser, 'basico')}
                      className={`p-2.5 rounded-lg border text-xs text-center transition-all ${
                        selectedUser.expertPlan === 'basico'
                          ? isDark
                            ? 'bg-slate-800 border-slate-600 text-white font-black'
                            : 'bg-white border-slate-400 text-slate-950 font-black shadow-xs ring-2 ring-slate-400'
                          : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                      }`}
                    >
                      <div className="font-bold">Básico</div>
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">$0 / mes</div>
                      <div className="text-[10px] text-slate-500 mt-1">10 propuestas</div>
                    </button>

                    <button
                      onClick={() => handleChangePlan(selectedUser, 'intermedio')}
                      className={`p-2.5 rounded-lg border text-xs text-center transition-all ${
                        selectedUser.expertPlan === 'intermedio'
                          ? isDark
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-200 font-black shadow-md shadow-cyan-950'
                            : 'bg-cyan-50 border-cyan-600 text-cyan-950 font-black shadow-xs ring-2 ring-cyan-500'
                          : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                      }`}
                    >
                      <div className="font-bold">Intermedio</div>
                      <div className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-400">$349.99 / mes</div>
                      <div className="text-[10px] text-slate-500 mt-1">30 propuestas</div>
                    </button>

                    <button
                      onClick={() => handleChangePlan(selectedUser, 'premium')}
                      className={`p-2.5 rounded-lg border text-xs text-center transition-all ${
                        selectedUser.expertPlan === 'premium'
                          ? isDark
                            ? 'bg-teal-950 border-teal-500 text-teal-200 font-black shadow-md shadow-teal-950'
                            : 'bg-teal-50 border-teal-600 text-teal-950 font-black shadow-xs ring-2 ring-teal-500'
                          : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" /> Premium
                      </div>
                      <div className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">$499.99 / mes</div>
                      <div className="text-[10px] font-bold text-teal-700 dark:text-teal-300 mt-1">Ilimitadas</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Document and KYC Verification block */}
              <div className={`mt-4 p-4 rounded-xl border space-y-2.5 ${
                isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-900'
                  }`}>
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    Estado en Verifications_requests
                  </span>
                  <span className={`text-xs font-bold capitalize ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {selectedUser.verificationStatus.replace('_', ' ')}
                  </span>
                </div>
                {selectedUser.idNumber && (
                  <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    Documento Oficial: <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>{selectedUser.idType || 'Cédula'}: {selectedUser.idNumber}</span>
                  </div>
                )}
                {selectedUser.bio && (
                  <p className={`text-xs italic p-2.5 rounded border ${
                    isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    "{selectedUser.bio}"
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className={`pt-6 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <button
                onClick={() => handleToggleStatus(selectedUser)}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                  selectedUser.status === 'active'
                    ? isDark
                      ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60'
                      : 'bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 shadow-2xs'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {selectedUser.status === 'active' ? (
                  <>
                    <UserX className="w-4 h-4" /> Suspender Acceso a la Plataforma
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" /> Reactivar Cuenta de Usuario
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
