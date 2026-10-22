import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  X,
  MoreVertical,
  KeyRound,
  Edit,
  Trash2,
  Lock,
  Mail,
  Phone,
  Building,
  UserCheck,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { AdminUser, UserRole } from '../../types';
import {
  getStoredStaffUsers,
  createStaffUser,
  updateStaffUser,
  deleteStaffUser,
  updateAdminPassword
} from '../../services/storage';

interface StaffManagementProps {
  activeAdmin: AdminUser;
  isDark?: boolean;
  onStaffChanged?: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80'
];

export const StaffManagement: React.FC<StaffManagementProps> = ({
  activeAdmin,
  isDark = false,
  onStaffChanged
}) => {
  const [staffList, setStaffList] = useState<AdminUser[]>(() => getStoredStaffUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resetPassModalOpen, setResetPassModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<AdminUser | null>(null);

  // Form fields for Create / Edit
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('ops_admin');
  const [formDepartment, setFormDepartment] = useState('Operaciones & Verificación');
  const [formPhone, setFormPhone] = useState('+1 (809) 555-0100');
  const [formPassword, setFormPassword] = useState('admin123');
  const [formAvatar, setFormAvatar] = useState(AVATAR_PRESETS[0]);
  const [formStatus, setFormStatus] = useState<'active' | 'suspended'>('active');
  const [showPassword, setShowPassword] = useState(false);

  // Password reset modal state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Alerts
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
  const [alertError, setAlertError] = useState<string | null>(null);

  const refreshList = () => {
    const list = getStoredStaffUsers();
    setStaffList(list);
    if (onStaffChanged) onStaffChanged();
  };

  const showAlert = (msg: string, isError = false) => {
    if (isError) {
      setAlertError(msg);
      setTimeout(() => setAlertError(null), 3500);
    } else {
      setAlertSuccess(msg);
      setTimeout(() => setAlertSuccess(null), 3000);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('ops_admin');
    setFormDepartment('Operaciones & Verificación');
    setFormPhone('+1 (809) 555-0100');
    setFormPassword('admin123');
    setFormAvatar(AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]);
    setFormStatus('active');
    setCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (staff: AdminUser) => {
    setSelectedStaff(staff);
    setFormName(staff.name);
    setFormEmail(staff.email);
    setFormRole(staff.role);
    setFormDepartment(staff.department);
    setFormPhone(staff.phone || '+1 (809) 555-0100');
    setFormAvatar(staff.avatar);
    setFormStatus(staff.status || 'active');
    setEditModalOpen(true);
  };

  // Open Password Reset Modal
  const handleOpenResetPass = (staff: AdminUser) => {
    setSelectedStaff(staff);
    setNewPassword('');
    setConfirmPassword('');
    setResetPassModalOpen(true);
  };

  // Submit Create Staff User
  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      showAlert('Por favor completa los campos obligatorios.', true);
      return;
    }

    // Check duplicate email
    if (staffList.some((s) => s.email.toLowerCase() === formEmail.trim().toLowerCase())) {
      showAlert('Ya existe un operador con este correo electrónico.', true);
      return;
    }

    const created = createStaffUser({
      name: formName.trim(),
      email: formEmail.trim().toLowerCase(),
      role: formRole,
      department: formDepartment.trim() || 'Operaciones Fianex',
      phone: formPhone.trim(),
      password: formPassword.trim(),
      avatar: formAvatar,
      status: formStatus
    });

    refreshList();
    setCreateModalOpen(false);
    showAlert(`¡Operador ${created.name} creado exitosamente! Puede ingresar al Backoffice.`);
  };

  // Submit Edit Staff User
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    const updated: AdminUser = {
      ...selectedStaff,
      name: formName.trim(),
      email: formEmail.trim().toLowerCase(),
      role: formRole,
      department: formDepartment.trim(),
      phone: formPhone.trim(),
      avatar: formAvatar,
      status: formStatus
    };

    updateStaffUser(updated);
    refreshList();
    setEditModalOpen(false);
    showAlert(`Datos de ${updated.name} actualizados.`);
  };

  // Submit Password Reset
  const handleSubmitResetPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    if (newPassword.length < 4) {
      showAlert('La contraseña debe tener al menos 4 caracteres.', true);
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('Las contraseñas no coinciden.', true);
      return;
    }

    updateAdminPassword(selectedStaff.id, newPassword);
    refreshList();
    setResetPassModalOpen(false);
    showAlert(`Contraseña actualizada para ${selectedStaff.name}.`);
  };

  // Toggle Suspend / Activate
  const handleToggleStatus = (staff: AdminUser) => {
    if (staff.email === 'rivertmc@gmail.com') {
      showAlert('No es posible suspender la cuenta principal de Super Administrador.', true);
      return;
    }

    const newStatus: 'active' | 'suspended' = staff.status === 'suspended' ? 'active' : 'suspended';
    const updated = { ...staff, status: newStatus };
    updateStaffUser(updated);
    refreshList();
    showAlert(
      newStatus === 'active'
        ? `Cuenta de ${staff.name} reactivada.`
        : `Cuenta de ${staff.name} suspendida.`
    );
  };

  // Delete Staff User
  const handleDeleteStaff = (staff: AdminUser) => {
    if (staff.email === 'rivertmc@gmail.com') {
      showAlert('No se puede eliminar la cuenta de Super Administrador.', true);
      return;
    }

    if (window.confirm(`¿Está seguro de revocar y eliminar permanentemente la cuenta de ${staff.name}?`)) {
      deleteStaffUser(staff.id);
      refreshList();
      showAlert(`Operador ${staff.name} eliminado del sistema.`);
    }
  };

  // Filters
  const filteredStaff = staffList.filter((s) => {
    if (roleFilter !== 'all' && s.role !== roleFilter) return false;
    if (statusFilter !== 'all' && (s.status || 'active') !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchEmail = s.email.toLowerCase().includes(q);
      const matchDept = s.department.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchDept) return false;
    }
    return true;
  });

  // Stats
  const totalCount = staffList.length;
  const superCount = staffList.filter((s) => s.role === 'super_admin').length;
  const opsCount = staffList.filter((s) => s.role === 'ops_admin').length;
  const supportCount = staffList.filter((s) => s.role === 'support_agent').length;
  const auditorCount = staffList.filter((s) => s.role === 'system_auditor').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Personal</span>
            <Users className="w-4 h-4 text-teal-500" />
          </div>
          <div className={`text-2xl font-black mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {totalCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Operadores registrados</div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
            <span>Super Admin</span>
            <Shield className="w-4 h-4" />
          </div>
          <div className={`text-2xl font-black mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {superCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Control total del sistema</div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
            <span>Operaciones</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <div className={`text-2xl font-black mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {opsCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Validación KYC & Cédulas</div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>Soporte</span>
            <Mail className="w-4 h-4" />
          </div>
          <div className={`text-2xl font-black mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {supportCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Atención de tickets SLA</div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>Auditores</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className={`text-2xl font-black mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {auditorCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Cumplimiento y logs</div>
        </div>
      </div>

      {/* Architecture Isolation Banner */}
      <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 ${
        isDark ? 'bg-teal-950/20 border-teal-500/30 text-teal-200' : 'bg-teal-50/80 border-teal-200 text-teal-950'
      }`}>
        <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Módulo Exclusivo de Personal Administrativo (Backoffice):</span>
          <p className="text-[11px] opacity-90">
            Las cuentas creadas y administradas en esta sección son operadores de operaciones, soporte y directivos del portal. <strong>NO forman parte ni se reflejan en la tabla <code>profiles</code></strong> de la aplicación móvil de clientes y expertos.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {alertSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{alertSuccess}</span>
        </div>
      )}
      {alertError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{alertError}</span>
        </div>
      )}

      {/* Control Bar: Search, Filters, and New User Button */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o departamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-teal-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className={`px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="all">Todos los roles</option>
            <option value="super_admin">Super Administrador</option>
            <option value="ops_admin">Admin de Operaciones</option>
            <option value="support_agent">Agente de Soporte</option>
            <option value="system_auditor">Auditor de Sistema</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className={`px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="suspended">Suspendidos</option>
          </select>
        </div>

        {/* Create Staff Button */}
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Crear Usuario de Operaciones</span>
        </button>
      </div>

      {/* Staff Directory Table */}
      <div className={`border rounded-2xl overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-950/60 text-slate-400' : 'border-slate-200 bg-slate-50/70 text-slate-500'}`}>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Operador / Correo</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Rol Administrativo</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Departamento</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Contacto</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Estado</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                    No se encontraron miembros del personal con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const isCurrent = staff.id === activeAdmin.id || staff.email === activeAdmin.email;
                  const isSuper = staff.role === 'super_admin';
                  const isSuspended = staff.status === 'suspended';

                  return (
                    <tr
                      key={staff.id}
                      className={`transition-colors ${
                        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Name & Email */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {staff.name}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                                  Tú
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              {staff.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize inline-block ${
                          staff.role === 'super_admin'
                            ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                            : staff.role === 'ops_admin'
                            ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30'
                            : staff.role === 'support_agent'
                            ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                        }`}>
                          {staff.role.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {staff.department}
                        </span>
                      </td>

                      {/* Contact & Phone */}
                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-600 dark:text-slate-400">
                          {staff.phone || '+1 (809) 555-0100'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                          isSuspended
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <span>{isSuspended ? 'Suspendido' : 'Activo'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(staff)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                            title="Editar usuario"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => handleOpenResetPass(staff)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-teal-600 dark:text-teal-400"
                            title="Cambiar contraseña de acceso"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Suspend / Activate */}
                          {!isSuper && (
                            <button
                              onClick={() => handleToggleStatus(staff)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isSuspended
                                  ? 'border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 text-emerald-600'
                                  : 'border-amber-200 dark:border-amber-800 hover:bg-amber-50 text-amber-600'
                              }`}
                              title={isSuspended ? 'Reactivar acceso' : 'Suspender acceso temporalmente'}
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete */}
                          {!isSuper && (
                            <button
                              onClick={() => handleDeleteStaff(staff)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600"
                              title="Eliminar operador del portal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/70'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Crear Operador de Backoffice</h3>
                  <p className="text-[11px] text-slate-400">Acceso exclusivo a operaciones y soporte (sin tabla profiles)</p>
                </div>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej: Valeria Santos"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Correo Corporativo *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="operador@fianex.app"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Rol en Backoffice
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="ops_admin">Admin de Operaciones (KYC/Cédula)</option>
                    <option value="support_agent">Agente de Soporte (Tickets)</option>
                    <option value="system_auditor">Auditor de Sistema (Read-only)</option>
                    <option value="super_admin">Super Administrador (Acceso total)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    placeholder="Operaciones & Verificación"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+1 (809) 555-0100"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Contraseña Inicial *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className={`w-full pl-3 pr-9 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">
                  Seleccionar Avatar de Operador
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormAvatar(p)}
                      className={`w-8 h-8 rounded-full overflow-hidden border transition-all ${
                        formAvatar === p ? 'border-teal-500 ring-2 ring-teal-400 scale-110' : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Crear y Habilitar Acceso</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/70'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Editar Operador: {selectedStaff.name}</h3>
                  <p className="text-[11px] text-slate-400">Actualizar datos de perfil y rol administrativo</p>
                </div>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Correo Corporativo
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Rol
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="super_admin">Super Administrador</option>
                    <option value="ops_admin">Admin de Operaciones</option>
                    <option value="support_agent">Agente de Soporte</option>
                    <option value="system_auditor">Auditor de Sistema</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Estado de Cuenta
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="active">Activo</option>
                    <option value="suspended">Suspendido</option>
                  </select>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">
                  Foto / Avatar
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormAvatar(p)}
                      className={`w-8 h-8 rounded-full overflow-hidden border transition-all ${
                        formAvatar === p ? 'border-teal-500 ring-2 ring-teal-400 scale-110' : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Modificaciones</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetPassModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-md w-full overflow-hidden shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/70'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Cambiar Contraseña</h3>
                  <p className="text-[11px] text-slate-400">{selectedStaff.name} ({selectedStaff.email})</p>
                </div>
              </div>
              <button onClick={() => setResetPassModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResetPass} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                  Nueva Contraseña *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetir contraseña"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setResetPassModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm flex items-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Establecer Contraseña</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
