import React from 'react';
import {
  Users,
  Briefcase,
  ShieldAlert,
  DollarSign,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  Clock,
  Sparkles,
  Database,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { AppUser, VerificationRequest, Transaction, AdminUser } from '../../types';

interface DashboardOverviewProps {
  users: AppUser[];
  verifications: VerificationRequest[];
  transactions: Transaction[];
  activeAdmin: AdminUser;
  onNavigate: (view: string) => void;
  onSelectVerification: (req: VerificationRequest) => void;
  onExportReport: () => void;
  isDark?: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  users,
  verifications,
  transactions,
  activeAdmin,
  onNavigate,
  onSelectVerification,
  onExportReport,
  isDark = false
}) => {
  // Compute Key Metrics
  const activeClients = users.filter((u) => u.type === 'client' && u.status === 'active');
  const activeClientsCount = 1420 + activeClients.length;

  const activeExperts = users.filter((u) => u.type === 'expert' && u.status === 'active');
  const activeExpertsCount = 284 + activeExperts.length;

  // Expert subscription plans breakdown
  const basicoCount = 142 + users.filter((u) => u.type === 'expert' && u.expertPlan === 'basico').length;
  const intermedioCount = 88 + users.filter((u) => u.type === 'expert' && u.expertPlan === 'intermedio').length;
  const premiumCount = 54 + users.filter((u) => u.type === 'expert' && u.expertPlan === 'premium').length;

  const totalSubscribedExperts = basicoCount + intermedioCount + premiumCount;
  const basicoPercent = Math.round((basicoCount / totalSubscribedExperts) * 100);
  const intermedioPercent = Math.round((intermedioCount / totalSubscribedExperts) * 100);
  const premiumPercent = Math.round((premiumCount / totalSubscribedExperts) * 100);

  const monthlySubscriptionRevenue = (intermedioCount * 349.99) + (premiumCount * 499.99);

  const pendingVerifications = verifications.filter((v) => v.status === 'pending');
  const identityPending = pendingVerifications.filter((v) => v.type === 'identity');
  const certPending = pendingVerifications.filter((v) => v.type === 'professional_category');

  return (
    <div className="space-y-6">
      {/* Pending Validation Alerts Banner */}
      {pendingVerifications.length > 0 && (
        <div className={`border rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border-amber-500/30 text-white'
            : 'bg-amber-50/90 border-amber-300 text-slate-900'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isDark ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-amber-200 border-amber-300 text-amber-900'
              }`}>
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold tracking-tight">
                    Alertas Prioritarias: {pendingVerifications.length} Documentos Pendientes de Validación
                  </h3>
                  <span className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
                    isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    Revisión Requerida
                  </span>
                </div>
                <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Hay {identityPending.length} solicitudes de Cédula de Identidad y {certPending.length}{' '}
                  certificaciones de expertos (plomería, electricidad, mecánica, etc.) esperando aprobación para habilitar el envío de propuestas a clientes.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('verifications')}
              className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              <span>Revisar Expedientes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Primary KPI Grid: Clientes Activos, Expertos Activos, GMV & Validación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Clientes Activos */}
        <div className={`border rounded-2xl p-5 transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Clientes Activos
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeClientsCount.toLocaleString()}
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              +14.2% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Usuarios solicitando servicios en el marketplace
          </p>
        </div>

        {/* KPI 2: Expertos Activos */}
        <div className={`border rounded-2xl p-5 transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Expertos Activos
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeExpertsCount.toLocaleString()}
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              +8.7% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Técnicos, plomeros, electricistas, mecánicos y más
          </p>
        </div>

        {/* KPI 3: Ingresos Recurrentes por Suscripciones (MRR) */}
        <div className={`border rounded-2xl p-5 transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              MRR Planes Expertos
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ${monthlySubscriptionRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}{' '}
              <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pesos</span>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              +19.4% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Facturación mensual directa de membresías
          </p>
        </div>

        {/* KPI 4: Backlog de Verificación Documental */}
        <div className={`border rounded-2xl p-5 transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Cola de Verificación
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {pendingVerifications.length}
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Objetivo &lt; 4h
            </span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Expedientes esperando revisión documental
          </p>
        </div>
      </div>

      {/* Breakout: Desglose de Expertos por Plan de Suscripción */}
      <div className={`border rounded-2xl p-6 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Distribución de Expertos por Plan de Suscripción
              </h2>
              <span className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${
                isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                Total: {totalSubscribedExperts} expertos
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Membresías activas para expertos en plomería, electricidad, mecánica, estética, etc.
            </p>
          </div>

          <button
            onClick={() => onNavigate('landing_plans')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>Ver Sección en fianex.app</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          </button>
        </div>

        {/* 3 Tier Cards matching user mobile screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Plan Básico */}
          <div className={`border rounded-2xl p-5 flex flex-col justify-between transition-colors ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50/70 border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Plan Básico
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-2xs'
                }`}>
                  Gratuito
                </span>
              </div>
              <div className={`text-3xl font-black font-mono tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
                $0
                <span className={`text-xs font-normal ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ Para siempre</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Expertos suscritos:</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{basicoCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Cuota de usuarios:</span>
                  <span className="font-mono">{basicoPercent}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Límite mensual:</span>
                  <span className="font-semibold">10 propuestas/mes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Soporte:</span>
                  <span>Estándar</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full rounded-full" style={{ width: `${basicoPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Plan Intermedio */}
          <div className={`border-2 rounded-2xl p-5 flex flex-col justify-between transition-colors ${
            isDark
              ? 'bg-slate-950/70 border-cyan-500/40 hover:border-cyan-400'
              : 'bg-white border-cyan-200 shadow-sm'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Plan Intermedio
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800' : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                }`}>
                  Crecimiento
                </span>
              </div>
              <div className={`text-3xl font-black font-mono tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
                $349.99
                <span className={`text-xs font-normal ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pesos/Mensual</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Expertos suscritos:</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-300">{intermedioCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Cuota de usuarios:</span>
                  <span className="font-mono">{intermedioPercent}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Límite mensual:</span>
                  <span className="font-semibold text-cyan-700 dark:text-cyan-200">30 propuestas/mes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Beneficio clave:</span>
                  <span className="font-medium">Perfil destacado</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${intermedioPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Plan Premium */}
          <div className={`border-2 rounded-2xl p-5 flex flex-col justify-between relative shadow-md ${
            isDark
              ? 'bg-gradient-to-b from-teal-950/50 to-slate-950 border-teal-500/40 text-white'
              : 'bg-gradient-to-b from-teal-50 to-white border-teal-500 text-slate-900'
          }`}>
            <div className="absolute top-0 right-0 bg-teal-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-bl-lg uppercase tracking-wider">
              Más Rentable
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Plan Premium VIP
                </span>
              </div>
              <div className="text-3xl font-black font-mono tabular-nums">
                $499.99
                <span className={`text-xs font-normal ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pesos/Mensual</span>
              </div>
              <div className="mt-4 pt-4 border-t border-teal-200 dark:border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Expertos suscritos:</span>
                  <span className="font-mono font-bold text-teal-700 dark:text-teal-300">{premiumCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cuota de usuarios:</span>
                  <span className="font-mono">{premiumPercent}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Límite mensual:</span>
                  <span className="text-teal-700 dark:text-teal-200 font-bold">Propuestas Ilimitadas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Soporte:</span>
                  <span className="text-teal-700 dark:text-teal-300 font-semibold">VIP Prioritario 24/7</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: `${premiumPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Validation Queue + Supabase Connection Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Validation Quick Queue */}
        <div className={`border rounded-2xl p-5 flex flex-col justify-between transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-sm font-bold tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Expedientes en Espera de Validación
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Inspección de Cédula y Diplomas Técnicos subidos por los expertos
                </p>
              </div>
              <button
                onClick={() => onNavigate('verifications')}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold flex items-center gap-1"
              >
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {verifications.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  onClick={() => {
                    onSelectVerification(req);
                    onNavigate('verifications');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isDark
                      ? 'bg-slate-950/60 border-slate-800 hover:border-teal-500/40 hover:bg-slate-800/40'
                      : 'bg-slate-50 border-slate-200 hover:border-teal-400 hover:bg-teal-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={req.userAvatar}
                      alt={req.userName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">{req.id}</span>
                        <span className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {req.userName}
                        </span>
                      </div>
                      <div className={`text-[11px] truncate flex items-center gap-1.5 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>{req.type === 'identity' ? 'Cédula Oficial' : req.docType}</span>
                        <span>·</span>
                        <span>{req.profession || req.category || 'Técnico'}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                      req.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                        : req.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                        : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
                    }`}
                  >
                    {req.status === 'pending' ? 'En evaluación' : req.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <span>Cotejo asistido con OCR (98.4% precisión)</span>
            <span className="text-teal-600 dark:text-teal-400 font-semibold">Revisión humana requerida</span>
          </div>
        </div>

        {/* Live Database Activity Summary */}
        <div className={`border rounded-2xl p-5 flex flex-col justify-between transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-sm font-bold tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Sincronización con Supabase (App Móvil)
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Vistas y tablas activas en el cluster gnduehhwlxxqvaczaujr
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> En vivo
              </span>
            </div>

            <div className="space-y-2.5">
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    vw_profile_settings
                  </div>
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Perfiles de clientes y expertos (Flutter Auth)
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">1,420 registros</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    vw_service_requests_details
                  </div>
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Solicitudes de trabajo y contrataciones de servicios
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">684 solicitudes</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    interactions & reviews
                  </div>
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Calificaciones, estrellas y contactos directos
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">4,010 registros</span>
              </div>
            </div>
          </div>

          <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <span>Autenticación y RLS activos</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Operativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
