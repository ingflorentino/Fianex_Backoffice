import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Search,
  Filter,
  Download,
  ShieldCheck,
  AlertTriangle,
  Info,
  Pause,
  Play,
  Clock,
  UserCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { AuditLog, AdminUser } from '../../types';
import { exportToExcelCSV } from '../../services/exportService';

interface AuditLogsViewProps {
  logs: AuditLog[];
  activeAdmin: AdminUser;
  isDark?: boolean;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  logs,
  activeAdmin,
  isDark = false
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | AuditLog['severity']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  const filteredLogs = logs.filter((l) => {
    if (severityFilter !== 'all' && l.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAction = l.action.toLowerCase().includes(q);
      const matchOp = l.operatorName.toLowerCase().includes(q);
      const matchTarget = l.target.toLowerCase().includes(q);
      const matchDet = l.details.toLowerCase().includes(q);
      if (!matchAction && !matchOp && !matchTarget && !matchDet) return false;
    }
    return true;
  });

  const handleExportLogs = () => {
    const headers = [
      'ID Log',
      'Marca de Tiempo',
      'Operador',
      'Rol Operador',
      'Acción Ejecutada',
      'Objetivo / Recurso',
      'Detalles Técnicos',
      'Severidad',
      'Dirección IP'
    ];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      l.operatorName,
      l.operatorRole,
      l.action,
      l.target,
      l.details,
      l.severity.toUpperCase(),
      l.ip
    ]);
    exportToExcelCSV('Fianex_Auditoria_Sistema_Logs', headers, rows);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner for System Auditors */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Consola de Auditoría y Trazabilidad Operativa
              </h3>
              <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                Inmutable
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Registra cada aprobación de documentos, cambios de rol y eventos de seguridad conforme a normativas de auditoría.
            </p>
          </div>
        </div>

        {/* Live stream status & Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isLiveStreaming
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {isLiveStreaming ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Streaming en Vivo</span>
                <Pause className="w-3.5 h-3.5 ml-1" />
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Reanudar Streaming</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSeverityFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                severityFilter === 'all'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({logs.length})
            </button>
            <button
              onClick={() => setSeverityFilter('audit')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                severityFilter === 'audit'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Auditoría
            </button>
            <button
              onClick={() => setSeverityFilter('warning')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                severityFilter === 'warning'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Advertencias
            </button>
            <button
              onClick={() => setSeverityFilter('info')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                severityFilter === 'info'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Informativos
            </button>
          </div>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por operador, acción o IP..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Logs Terminal Stream Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs shadow-2xl">
        <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span className="ml-2 font-semibold text-slate-300 font-sans">
              system-audit.fianex.internal:stream
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            {filteredLogs.length} eventos registrados
          </span>
        </div>

        <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto divide-y divide-slate-900">
          {filteredLogs.map((log) => (
            <div key={log.id} className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-2 hover:bg-slate-900/30 p-2 rounded transition-colors">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 text-[11px]">{log.timestamp}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                      log.severity === 'audit'
                        ? 'bg-purple-950 text-purple-300 border-purple-800'
                        : log.severity === 'warning'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    }`}
                  >
                    {log.severity}
                  </span>
                  <span className="text-teal-400 font-bold">{log.action}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-200">{log.target}</span>
                </div>

                <p className="text-slate-400 text-[11px] font-sans pl-1 border-l-2 border-slate-800">
                  {log.details}
                </p>
              </div>

              <div className="text-right shrink-0 text-[11px] text-slate-400 flex sm:flex-col items-center sm:items-end justify-between">
                <span className="text-slate-300 font-semibold">{log.operatorName}</span>
                <span className="text-slate-400 text-[10px]">IP: {log.ip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
