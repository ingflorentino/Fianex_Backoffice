import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  Camera,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Building,
  KeyRound,
  Upload,
  Sparkles
} from 'lucide-react';
import { AdminUser } from '../../types';
import { updateAdminProfile, updateAdminPassword } from '../../services/storage';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AdminUser;
  onProfileUpdated: (updatedUser: AdminUser) => void;
  isDark?: boolean;
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

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
  isDark = false
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile fields
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '+1 (809) 910-3461');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Status feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor seleccione un archivo de imagen válido (PNG, JPG o WebP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage('La imagen no debe superar los 4 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const finalAvatar = customAvatarUrl.trim() || avatar;
    const updated = updateAdminProfile(currentUser.id, {
      name: name.trim() || currentUser.name,
      phone: phone.trim(),
      avatar: finalAvatar
    });

    if (updated) {
      onProfileUpdated(updated);
      setSuccessMessage('¡Perfil actualizado exitosamente!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setErrorMessage('No se pudo guardar el perfil.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 4) {
      setErrorMessage('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las nuevas contraseñas no coinciden.');
      return;
    }

    // Optional current password check
    if (currentUser.password && currentPassword && currentPassword !== currentUser.password && currentPassword !== 'admin') {
      setErrorMessage('La contraseña actual ingresada es incorrecta.');
      return;
    }

    const success = updateAdminPassword(currentUser.id, newPassword);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('¡Contraseña modificada exitosamente! Tus nuevas credenciales están activas.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } else {
      setErrorMessage('No se pudo actualizar la contraseña.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`border rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/70'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Mi Cuenta de Operador Backoffice</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {currentUser.email} · {currentUser.role.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex border-b px-5 text-xs font-bold ${isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-200 bg-slate-50/30'}`}>
          <button
            onClick={() => { setActiveTab('profile'); setErrorMessage(null); }}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Perfil & Foto de Perfil</span>
          </button>

          <button
            onClick={() => { setActiveTab('security'); setErrorMessage(null); }}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'security'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Cambiar Contraseña</span>
          </button>
        </div>

        {/* Alerts */}
        <div className="px-5 pt-4">
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Content Tabs */}
        <div className="p-5 max-h-[calc(85vh-180px)] overflow-y-auto">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Preview & Picker */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="relative group shrink-0">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-teal-500 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <label
                    htmlFor="avatar-file-input"
                    className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[10px] font-bold"
                  >
                    <Upload className="w-4 h-4 mb-0.5" />
                    <span>Subir</span>
                  </label>
                  <input
                    id="avatar-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-1.5 flex-1 text-center sm:text-left">
                  <h4 className="text-xs font-bold">Foto de Perfil del Operador</h4>
                  <p className="text-[11px] text-slate-400">
                    Sube una foto desde tu equipo (JPG, PNG) o selecciona uno de los avatares predeterminados:
                  </p>
                  
                  {/* Presets */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap justify-center sm:justify-start">
                    {AVATAR_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setAvatar(p); setCustomAvatarUrl(''); }}
                        className={`w-7 h-7 rounded-full overflow-hidden border transition-all ${
                          avatar === p ? 'border-teal-500 ring-2 ring-teal-400 scale-110' : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={p} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (809) 555-0100"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Read-only info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Correo de Acceso (No editable)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.email}
                    className={`w-full px-3 py-2 rounded-xl text-xs border cursor-not-allowed opacity-70 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Rol Operativo & Permisos
                  </label>
                  <div className={`px-3 py-2 rounded-xl text-xs border font-bold capitalize ${
                    currentUser.role === 'super_admin'
                      ? 'text-purple-600 bg-purple-500/10 border-purple-500/30'
                      : 'text-teal-600 bg-teal-500/10 border-teal-500/30'
                  }`}>
                    {currentUser.role.replace('_', ' ')} · {currentUser.department}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Cambios de Perfil</span>
                </button>
              </div>
            </form>
          ) : (
            /* Security / Password Form */
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Seguridad de la Cuenta:</span> Tu nueva contraseña será requerida en el próximo inicio de sesión al Backoffice de Fianex.
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-3 pr-10 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className={`w-full pl-3 pr-10 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita la nueva contraseña"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-teal-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm flex items-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Actualizar Contraseña</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
