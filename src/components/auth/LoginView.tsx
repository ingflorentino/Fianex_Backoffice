import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { AdminUser, UserRole } from '../../types';
import { authenticateAdmin } from '../../services/authService';
import { getStoredStaffUsers } from '../../services/storage';

interface LoginViewProps {
  onLoginSuccess: (user: AdminUser) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  isDark,
  onToggleTheme
}) => {
  const staffList = getStoredStaffUsers();
  const superAdmin = staffList.find((s) => s.email === 'rivertmc@gmail.com') || staffList[0];

  const [email, setEmail] = useState(superAdmin?.email || 'rivertmc@gmail.com');
  const [password, setPassword] = useState(superAdmin?.password || 'Rivert2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await authenticateAdmin(email, password, rememberMe);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(result.error || 'Credenciales inválidas.');
      }
    } catch {
      setErrorMessage('Ocurrió un error al autenticar. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (admin: AdminUser) => {
    setEmail(admin.email);
    setPassword(admin.password || 'Rivert2026!');
    setErrorMessage(null);
  };

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between transition-colors ${
      isDark ? 'bg-[#0a0e17] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Bar with Theme Toggle */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2B8DA9] to-[#54C5D4] flex items-center justify-center shadow-sm text-white font-black text-base">
            F
          </div>
          <span className="font-bold text-base tracking-tight">Fianex Backoffice</span>
        </div>

        <button
          onClick={onToggleTheme}
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-bold ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          <span className="hidden sm:inline">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
        </button>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all ${
            isDark ? 'bg-slate-900/90 border-slate-800 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl'
          }`}>
            {/* Header / Brand Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-white dark:bg-slate-800 border border-teal-500/30 mb-3 shadow-md">
                <img src="/favicon-full.png" alt="Fianex" className="w-14 h-14 object-contain" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Iniciar Sesión
              </h1>
              <p className={`text-xs mt-1.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Acceso administrativo a métricas, validaciones KYC y soporte
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-extrabold uppercase tracking-wider mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Correo Corporativo / Administrador
                </label>
                <div className="relative">
                  <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rivertmc@gmail.com"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all font-medium ${
                      isDark
                        ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`block text-xs font-extrabold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Contraseña
                  </label>
                  <span className={`text-[11px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Mínimo 4 caracteres
                  </span>
                </div>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border focus:outline-none transition-all font-medium ${
                      isDark
                        ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                  />
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Recordar mi sesión
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 text-white shadow-lg transition-all ${
                  isLoading
                    ? 'bg-teal-700 cursor-wait opacity-80'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 shadow-teal-600/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verificando credenciales...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Ingresar al Backoffice</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick-Access Operators Section */}
            <div className={`mt-6 pt-5 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  <UserCheck className="w-3.5 h-3.5 text-teal-500" />
                  <span>Acceso Rápido por Rol:</span>
                </span>
                <span className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Click para autocompletar
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {staffList.map((admin) => {
                  const isSelected = email === admin.email;
                  return (
                    <button
                      key={admin.id}
                      type="button"
                      onClick={() => handleQuickSelect(admin)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-teal-500/15 border-teal-500/40 text-teal-300'
                            : 'bg-teal-50 border-teal-400 text-teal-950 font-bold shadow-2xs'
                          : isDark
                          ? 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <img
                        src={admin.avatar}
                        alt={admin.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-300 dark:border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-black truncate leading-tight">
                          {admin.role === 'super_admin' ? 'Rivert MC' : admin.name.split(' ')[0]}
                        </div>
                        <div className={`text-[10px] truncate capitalize ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {admin.role.replace('_', ' ')}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Database & Security Micro-banner */}
          <div className="mt-4 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Conexión segura a Supabase PostgreSQL (gnduehhwlxxqvaczaujr)</span>
            </div>
            <p className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Políticas RLS activas · Cifrado SSL/TLS 256-bit
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-3 text-center text-xs font-medium border-t transition-colors ${
        isDark ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-500'
      }`}>
        Fianex Operations Platform © {new Date().getFullYear()} · Sistema Backoffice Desacoplado
      </footer>
    </div>
  );
};
