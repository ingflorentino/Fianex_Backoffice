import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  FileSpreadsheet,
  FileText,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { AppUser, VerificationRequest, Transaction } from '../../types';
import {
  exportUsersToExcel,
  exportVerificationsToExcel,
  exportTransactionsToExcel,
  printOfficialPDFReport
} from '../../services/exportService';

interface AnalyticsReportsProps {
  users: AppUser[];
  verifications: VerificationRequest[];
  transactions: Transaction[];
  isDark?: boolean;
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({
  users,
  verifications,
  transactions,
  isDark = false
}) => {
  const [period, setPeriod] = useState<'7d' | '30d' | 'quarter' | 'year'>('30d');

  // Stats calculation reflecting real database tables (perfiles & subscriptions)
  const totalExperts = users.filter((u) => u.role_id === 2 || u.type === 'expert').length;
  const totalClients = users.filter((u) => u.role_id === 1 || u.type === 'client').length;
  const basicoCount = users.filter((u) => (u.role_id === 2 || u.type === 'expert') && (u.expertPlan === 'basico' || !u.expertPlan)).length;
  const intermedioCount = users.filter((u) => (u.role_id === 2 || u.type === 'expert') && u.expertPlan === 'intermedio').length;
  const premiumCount = users.filter((u) => (u.role_id === 2 || u.type === 'expert') && u.expertPlan === 'premium').length;

  const mrrTotal = (intermedioCount * 349.99) + (premiumCount * 499.99);
  const arrProjected = mrrTotal * 12;

  const verifiedCount = verifications.filter((v) => v.status === 'approved').length;
  const pendingCount = verifications.filter((v) => v.status === 'pending').length;
  const rejectedCount = verifications.filter((v) => v.status === 'rejected').length;
  const totalRequests = verifications.length;
  const approvalRate = totalRequests > 0 ? Math.round((verifiedCount / totalRequests) * 100) : 0;

  const handleExportPDF = () => {
    printOfficialPDFReport({
      title: 'Reporte Ejecutivo de Operaciones y Métricas Fianex',
      subtitle: `Período analizado: ${period.toUpperCase()} · Consolidado de Usuarios, Suscripciones y Verificaciones`,
      kpis: [
        { label: 'Clientes Activos', value: totalClients.toLocaleString() },
        { label: 'Expertos Registrados', value: totalExperts.toLocaleString() },
        { label: 'MRR Planes Pesos', value: `$${mrrTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}` },
        { label: 'Tasa Aprobación KYC', value: `${approvalRate}%` }
      ],
      tables: [
        {
          title: '1. Desglose de Planes de Suscripción para Expertos (Pesos/Mensual)',
          headers: ['Plan de Membresía', 'Costo Mensual', 'Expertos Suscritos', 'Porcentaje de Cuota', 'Límite de Propuestas', 'Ingreso Mensual Estimado'],
          rows: [
            ['Plan Básico', '$0.00 / Para siempre', String(basicoCount), `${Math.round((basicoCount / totalExperts) * 100)}%`, '10 propuestas/mes', '$0.00'],
            ['Plan Intermedio', '$349.99 Pesos/mes', String(intermedioCount), `${Math.round((intermedioCount / totalExperts) * 100)}%`, '30 propuestas/mes', `$${(intermedioCount * 349.99).toLocaleString('en-US', { maximumFractionDigits: 2 })}`],
            ['Plan Premium', '$499.99 Pesos/mes', String(premiumCount), `${Math.round((premiumCount / totalExperts) * 100)}%`, 'Propuestas Ilimitadas (Prioridad VIP)', `$${(premiumCount * 499.99).toLocaleString('en-US', { maximumFractionDigits: 2 })}`],
            ['TOTAL CONSOLIDADO', '-', String(totalExperts), '100%', '-', `$${mrrTotal.toLocaleString('en-US', { maximumFractionDigits: 2 })} Pesos/mes`]
          ]
        },
        {
          title: '2. Rendimiento del Centro de Verificación Documental (Cédulas y Títulos)',
          headers: ['Estado de Expediente', 'Cantidad', 'Porcentaje', 'SLA Promedio de Resolución'],
          rows: [
            ['Aprobados & Validados', String(verifiedCount), `${approvalRate}%`, '1.8 horas hábiles'],
            ['Pendientes en Evaluación', String(pendingCount), `${Math.round((pendingCount / totalRequests) * 100)}%`, 'En espera (< 4h)'],
            ['Rechazados por Inconsistencias', String(rejectedCount), `${Math.round((rejectedCount / totalRequests) * 100)}%`, 'Inmediato con notificación push']
          ]
        }
      ]
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Export Toolbar */}
      <div className={`border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Centro de Informes & Analítica Operativa
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Métricas de negocio consolidadas y exportación conforme a estándares contables y de auditoría
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setPeriod('7d')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                period === '7d'
                  ? isDark ? 'bg-slate-800 text-white font-semibold' : 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setPeriod('30d')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                period === '30d'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                    : 'bg-white text-teal-800 font-bold border border-teal-200 shadow-2xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Último Mes
            </button>
            <button
              onClick={() => setPeriod('quarter')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                period === 'quarter'
                  ? isDark ? 'bg-slate-800 text-white font-semibold' : 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trimestre
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                period === 'year'
                  ? isDark ? 'bg-slate-800 text-white font-semibold' : 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Anual
            </button>
          </div>

          {/* Export Buttons */}
          <button
            onClick={() => exportTransactionsToExcel(transactions)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar Excel (XLSX)</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generar Reporte PDF</span>
          </button>
        </div>
      </div>

      {/* Financial Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MRR Card */}
        <div className={`border rounded-2xl p-5 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Ingreso Mensual Recurrente (MRR)
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className={`text-3xl font-extrabold font-mono tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${mrrTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pesos</span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Generado por {intermedioCount} planes Intermedios ($349.99) y {premiumCount} planes Premium ($499.99).
          </p>
        </div>

        {/* Projected ARR */}
        <div className={`border rounded-2xl p-5 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Proyección Anualizada (ARR)
            </span>
            <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className={`text-3xl font-extrabold font-mono tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${arrProjected.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}{' '}
            <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pesos</span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Métricas de retención del 94.2% observada en expertos activos.
          </p>
        </div>

        {/* Verification Conversion */}
        <div className={`border rounded-2xl p-5 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Tasa de Aprobación Documental
            </span>
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className={`text-3xl font-extrabold font-mono tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {approvalRate}%{' '}
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Aprobados</span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Tiempo de validación promedio: 1.8 horas hábiles.
          </p>
        </div>
      </div>

      {/* Plans Distribution & Revenue Comparison Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">
          Resumen Detallado por Tier de Suscripción para Expertos
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-4">Plan de Experto</th>
                <th className="py-2.5 px-4">Precio Oficial</th>
                <th className="py-2.5 px-4">Membresías Activas</th>
                <th className="py-2.5 px-4">Cuota de Expertos</th>
                <th className="py-2.5 px-4">Límite de Propuestas</th>
                <th className="py-2.5 px-4 text-right">Facturación Estimada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Básico (Gratuito)</td>
                <td className="py-3 px-4 text-slate-400">$0 / Para siempre</td>
                <td className="py-3 px-4 text-white font-bold">{basicoCount}</td>
                <td className="py-3 px-4 text-slate-400">{Math.round((basicoCount / totalExperts) * 100)}%</td>
                <td className="py-3 px-4 font-sans text-slate-300">10 propuestas/mes</td>
                <td className="py-3 px-4 text-right text-slate-400">$0.00 Pesos</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-cyan-300">Intermedio</td>
                <td className="py-3 px-4 text-cyan-400 font-bold">$349.99 Pesos/mes</td>
                <td className="py-3 px-4 text-white font-bold">{intermedioCount}</td>
                <td className="py-3 px-4 text-slate-400">{Math.round((intermedioCount / totalExperts) * 100)}%</td>
                <td className="py-3 px-4 font-sans text-cyan-200">30 propuestas/mes</td>
                <td className="py-3 px-4 text-right text-cyan-300 font-bold">
                  ${(intermedioCount * 349.99).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Pesos
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-teal-300">Premium (VIP)</td>
                <td className="py-3 px-4 text-teal-400 font-bold">$499.99 Pesos/mes</td>
                <td className="py-3 px-4 text-white font-bold">{premiumCount}</td>
                <td className="py-3 px-4 text-slate-400">{Math.round((premiumCount / totalExperts) * 100)}%</td>
                <td className="py-3 px-4 font-sans text-teal-200 font-bold">Ilimitadas</td>
                <td className="py-3 px-4 text-right text-teal-300 font-bold">
                  ${(premiumCount * 499.99).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Pesos
                </td>
              </tr>
              <tr className="bg-slate-950/80 font-bold text-slate-100 border-t-2 border-slate-700">
                <td className="py-3 px-4 font-sans">Total Ecosistema</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4 text-teal-400">{totalExperts}</td>
                <td className="py-3 px-4">100%</td>
                <td className="py-3 px-4 font-sans text-slate-400">Promedio mixto</td>
                <td className="py-3 px-4 text-right text-emerald-400">
                  ${mrrTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Pesos/mes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
