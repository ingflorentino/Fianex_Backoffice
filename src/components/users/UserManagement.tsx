import React, { useState } from 'react';
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
  UserCheck,
  UserX,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  Sparkles
} from 'lucide-react';
import { AppUser, AdminUser, ExpertPlan, VerificationStatus } from '../../types';
import { exportUsersToExcel } from '../../services/exportService';

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
  
  // Selected user for details drawer
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  const filteredUsers = users.filter((u) => {
    if (tab !== 'all' && u.type !== tab) return false;
    if (planFilter !== 'all' && u.expertPlan !== planFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchProf = u.expertProfession?.toLowerCase().includes(q) || false;
      const matchCity = u.city?.toLowerCase().includes(q) || false;
      if (!matchName && !matchEmail && !matchProf && !matchCity) return false;
    }
    return true;
  });

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
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'all'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'bg-white text-teal-900 shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({users.length})
            </button>
            <button
              onClick={() => {
                setTab('expert');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                tab === 'expert'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expertos ({users.filter((u) => u.type === 'expert').length})
            </button>
            <button
              onClick={() => {
                setTab('client');
                setPlanFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                tab === 'client'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Clientes ({users.filter((u) => u.type === 'client').length})
            </button>
          </div>

          {/* Expert Plan Filter (only if expert or all) */}
          {tab !== 'client' && (
            <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5">Planes:</span>
              <button
                onClick={() => setPlanFilter('all')}
                className={`px-2 py-0.5 text-xs rounded ${
                  planFilter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cualquiera
              </button>
              <button
                onClick={() => setPlanFilter('basico')}
                className={`px-2 py-0.5 text-xs rounded ${
                  planFilter === 'basico' ? 'bg-slate-800 text-slate-200 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Básico ($0)
              </button>
              <button
                onClick={() => setPlanFilter('intermedio')}
                className={`px-2 py-0.5 text-xs rounded ${
                  planFilter === 'intermedio' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Intermedio ($349.99)
              </button>
              <button
                onClick={() => setPlanFilter('premium')}
                className={`px-2 py-0.5 text-xs rounded ${
                  planFilter === 'premium' ? 'bg-teal-950 text-teal-300 border border-teal-800 font-semibold' : 'text-slate-400 hover:text-white'
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
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, email o ciudad..."
              className="bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 w-52 sm:w-64"
            />
          </div>

          <button
            onClick={() => exportUsersToExcel(filteredUsers)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
            title="Exportar a Excel (CSV/XLSX)"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className={`border rounded-2xl overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b text-slate-500 font-bold uppercase tracking-wider text-[11px] ${
                isDark ? 'border-slate-800 bg-slate-950/70 text-slate-400' : 'border-slate-200 bg-slate-50'
              }`}>
                <th className="py-3.5 px-4">Usuario</th>
                <th className="py-3.5 px-4">Tipo & Rol</th>
                <th className="py-3.5 px-4">Plan Experto</th>
                <th className="py-3.5 px-4">Nivel Verificación</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Rendimiento</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    {/* User info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate text-xs flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.rating && user.rating >= 4.8 && (
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                          <div className="text-[10px] text-slate-400">{user.city}</div>
                        </div>
                      </div>
                    </td>

                    {/* Type & Role */}
                    <td className="py-3 px-4">
                      <div>
                        <span
                          className={`inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                            user.type === 'expert'
                              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                              : 'bg-indigo-950/80 text-indigo-300 border-indigo-800'
                          }`}
                        >
                          {user.type === 'expert' ? 'Experto' : 'Cliente'}
                        </span>
                        {user.expertProfession && (
                          <div className="text-[11px] text-slate-300 font-medium truncate mt-1">
                            {user.expertProfession}
                          </div>
                        )}
                        {user.expertCategory && (
                          <div className="text-[10px] text-slate-400 capitalize">
                            Cat: {user.expertCategory}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Expert Plan */}
                    <td className="py-3 px-4">
                      {user.type === 'expert' && user.expertPlan ? (
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                              user.expertPlan === 'premium'
                                ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                                : user.expertPlan === 'intermedio'
                                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {user.expertPlan === 'premium' && <Sparkles className="w-2.5 h-2.5 text-teal-400" />}
                            {user.expertPlan.toUpperCase()}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {user.expertPlan === 'premium'
                              ? '$499.99 Pesos/mes'
                              : user.expertPlan === 'intermedio'
                              ? '$349.99 Pesos/mes'
                              : '$0 (Gratuito)'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">N/A (Cliente)</span>
                      )}
                    </td>

                    {/* Verification Status */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {user.verificationStatus === 'fully_verified' ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verificado Total
                          </span>
                        ) : user.verificationStatus === 'cert_pending' || user.verificationStatus === 'id_pending' ? (
                          <span className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                            <AlertCircle className="w-3.5 h-3.5" /> En Revisión
                          </span>
                        ) : user.verificationStatus === 'id_approved' ? (
                          <span className="flex items-center gap-1 text-teal-400 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cédula Validada
                          </span>
                        ) : user.verificationStatus === 'rejected' ? (
                          <span className="flex items-center gap-1 text-rose-400 text-xs font-semibold">
                            <XCircle className="w-3.5 h-3.5" /> Rechazado
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Sin verificar</span>
                        )}
                      </div>
                    </td>

                    {/* Account Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                          user.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : user.status === 'suspended'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
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
                    <td className="py-3 px-4 text-right">
                      {user.type === 'expert' ? (
                        <div>
                          <div className="font-mono text-xs font-semibold text-white">
                            {user.completedJobs || 0} trabajos
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Propuestas: {user.monthlyProposalsUsed || 0} / {user.monthlyProposalsLimit || 10}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-mono text-xs font-semibold text-white">
                            {user.completedJobs || 0} contratos
                          </div>
                          <div className="text-[10px] text-slate-400">Desde {user.registeredAt}</div>
                        </div>
                      )}
                    </td>

                    {/* Actions button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 text-[11px] font-medium transition-colors"
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
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-teal-400 font-bold">{selectedUser.id}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs font-bold text-slate-300 uppercase">
                    {selectedUser.type === 'expert' ? 'Ficha de Experto' : 'Ficha de Cliente'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="pt-4 flex items-start gap-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40 shadow-lg shadow-teal-500/10 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white tracking-tight">{selectedUser.name}</h3>
                  <p className="text-xs text-teal-300 font-medium">{selectedUser.expertProfession || 'Cliente Registrado'}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
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
              {selectedUser.type === 'expert' && (
                <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-teal-400" />
                      Plan de Suscripción Experto
                    </span>
                    <span className="text-xs font-mono font-bold text-teal-300 uppercase">
                      {selectedUser.expertPlan}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Ajusta directamente la membresía del experto. Los límites de propuestas y visibilidad en la app Flutter se actualizan inmediatamente vía microservicio Cloudflare.
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => handleChangePlan(selectedUser, 'basico')}
                      className={`p-2 rounded-lg border text-xs text-center transition-all ${
                        selectedUser.expertPlan === 'basico'
                          ? 'bg-slate-800 border-slate-600 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold">Básico</div>
                      <div className="text-[10px] text-slate-400">$0 / mes</div>
                      <div className="text-[9px] text-slate-400 mt-1">10 propuestas</div>
                    </button>

                    <button
                      onClick={() => handleChangePlan(selectedUser, 'intermedio')}
                      className={`p-2 rounded-lg border text-xs text-center transition-all ${
                        selectedUser.expertPlan === 'intermedio'
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-200 font-bold shadow-md shadow-cyan-950'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold">Intermedio</div>
                      <div className="text-[10px] text-cyan-400">$349.99 / mes</div>
                      <div className="text-[9px] text-slate-400 mt-1">30 propuestas</div>
                    </button>

                    <button
                      onClick={() => handleChangePlan(selectedUser, 'premium')}
                      className={`p-2 rounded-lg border text-xs text-center transition-all ${
                        selectedUser.expertPlan === 'premium'
                          ? 'bg-teal-950 border-teal-500 text-teal-200 font-bold shadow-md shadow-teal-950'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold flex items-center justify-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-teal-400" /> Premium
                      </div>
                      <div className="text-[10px] text-teal-400">$499.99 / mes</div>
                      <div className="text-[9px] text-teal-300 mt-1 font-medium">Ilimitadas</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Document and KYC Verification block */}
              <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Estado de Identidad & Certificación
                  </span>
                  <span className="text-xs font-semibold text-slate-200 capitalize">
                    {selectedUser.verificationStatus.replace('_', ' ')}
                  </span>
                </div>
                {selectedUser.idNumber && (
                  <div className="text-xs text-slate-400">
                    Documento Oficial: <span className="font-mono text-white font-medium">{selectedUser.idType || 'Cédula'}: {selectedUser.idNumber}</span>
                  </div>
                )}
                {selectedUser.bio && (
                  <p className="text-xs text-slate-300 italic bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    "{selectedUser.bio}"
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 space-y-2">
              <button
                onClick={() => handleToggleStatus(selectedUser)}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                  selectedUser.status === 'active'
                    ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60'
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
