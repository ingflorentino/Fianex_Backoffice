import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Check,
  X,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Award,
  Smartphone
} from 'lucide-react';
import { VerificationRequest, AdminUser } from '../../types';

interface VerificationCenterProps {
  verifications: VerificationRequest[];
  activeAdmin: AdminUser;
  selectedVerificationId?: string | null;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string, notes?: string) => void;
  isDark?: boolean;
}

export const VerificationCenter: React.FC<VerificationCenterProps> = ({
  verifications,
  activeAdmin,
  selectedVerificationId,
  onApprove,
  onReject,
  isDark = false
}) => {
  const [filterType, setFilterType] = useState<'all' | 'identity' | 'professional_category'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedId, setSelectedId] = useState<string>(
    selectedVerificationId || (verifications.length > 0 ? verifications[0].id : '')
  );

  // Document viewer controls
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Documento borroso o con baja resolución');
  const [customRejectNotes, setCustomRejectNotes] = useState('');

  // Approval feedback
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);

  const isAuditor = activeAdmin.role === 'system_auditor';

  const filteredList = verifications.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.userName.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchDoc = item.idNumber?.toLowerCase().includes(q) || false;
      const matchProf = item.profession?.toLowerCase().includes(q) || false;
      if (!matchName && !matchId && !matchDoc && !matchProf) return false;
    }
    return true;
  });

  const activeRequest = verifications.find((v) => v.id === selectedId) || filteredList[0];

  const handleApproveClick = () => {
    if (!activeRequest) return;
    onApprove(activeRequest.id, approvalNotes);
    setShowApprovalSuccess(true);
    setTimeout(() => setShowApprovalSuccess(false), 3000);
  };

  const handleConfirmReject = () => {
    if (!activeRequest) return;
    onReject(activeRequest.id, rejectReason, customRejectNotes);
    setRejectModalOpen(false);
    setCustomRejectNotes('');
  };

  const quickRejectReasons = [
    'Documento borroso o con baja resolución',
    'El número de cédula no coincide con el registro oficial',
    'Documento oficial vencido o deteriorado',
    'Certificado o diploma técnico no acreditado oficialmente',
    'Falta foto del reverso del documento',
    'Nombre en el certificado no coincide con el usuario'
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-4">
      {/* Top Filter Bar */}
      <div className={`border rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Type */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'all'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'bg-white text-teal-800 border border-slate-200 shadow-2xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({verifications.length})
            </button>
            <button
              onClick={() => setFilterType('identity')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'identity'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'bg-white text-teal-800 border border-slate-200 shadow-2xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cédula / Identidad
            </button>
            <button
              onClick={() => setFilterType('professional_category')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'professional_category'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'bg-white text-teal-800 border border-slate-200 shadow-2xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Certificaciones de Expertos
            </button>
          </div>

          {/* Filter Status */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? isDark
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cualquiera
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                filterStatus === 'pending'
                  ? isDark
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                filterStatus === 'approved'
                  ? isDark
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aprobados
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                filterStatus === 'rejected'
                  ? isDark
                    ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                    : 'bg-rose-100 text-rose-900 font-bold border border-rose-300'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rechazados
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px] flex-1 sm:flex-initial">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por #202610..., nombre o cédula"
            className={`w-full rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none transition-colors border ${
              isDark
                ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-teal-600'
            }`}
          />
        </div>
      </div>

      {/* Main Review Workspace Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Column: Requests Queue List (4 cols) */}
        <div className={`lg:col-span-4 border rounded-2xl flex flex-col overflow-hidden transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`p-3.5 border-b flex items-center justify-between text-xs ${
            isDark ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
          }`}>
            <span className="font-bold">Expedientes ({filteredList.length})</span>
            <span className="text-[11px]">Orden por prioridad</span>
          </div>

          <div className={`flex-1 overflow-y-auto divide-y ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
            {filteredList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No hay expedientes con los filtros aplicados.
              </div>
            ) : (
              filteredList.map((req) => {
                const isSelected = activeRequest && activeRequest.id === req.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      setSelectedId(req.id);
                      setZoomLevel(1);
                      setRotation(0);
                      setActiveSide('front');
                    }}
                    className={`p-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-teal-500/15 border-l-2 border-l-teal-400 text-white'
                          : 'bg-teal-50/80 border-l-3 border-l-teal-600 text-slate-900'
                        : isDark
                        ? 'hover:bg-slate-800/40 text-slate-300'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={req.userAvatar}
                          alt={req.userName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">{req.id}</span>
                            <span className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {req.userName}
                            </span>
                          </div>
                          <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {req.type === 'identity' ? 'Verificación de Identidad' : req.profession || 'Certificación Técnica'}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                          req.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                            : req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                            : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                        }`}
                      >
                        {req.status === 'pending' ? 'Pendiente' : req.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </span>
                    </div>

                    <div className={`mt-2.5 flex items-center justify-between text-[11px] ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-400" />
                        {req.docType}
                      </span>
                      <span className="font-mono text-[10px]">{req.submittedAt}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Deep Document Inspection & Approval Console (8 cols) */}
        {activeRequest ? (
          <div className={`lg:col-span-8 border rounded-2xl flex flex-col overflow-hidden transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            {/* Header of Active Inspection */}
            <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
              isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/70'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold">
                  {activeRequest.type === 'identity' ? 'ID' : <Award className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-teal-600 dark:text-teal-400">{activeRequest.id}</span>
                    <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeRequest.userName}</h2>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        activeRequest.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                          : activeRequest.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                          : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                      }`}
                    >
                      {activeRequest.status === 'pending'
                        ? 'En evaluación'
                        : activeRequest.status === 'approved'
                        ? 'Aprobado y Activo'
                        : 'Rechazado'}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {activeRequest.userEmail} · Enviado el {activeRequest.submittedAt}
                  </p>
                </div>
              </div>
            </div>

            {/* Viewer Workspace */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Document Visual Canvas (7 cols) */}
              <div className={`md:col-span-7 flex flex-col border-b md:border-b-0 md:border-r relative ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100/70 border-slate-200'
              }`}>
                {/* Visual Canvas Toolbar */}
                <div className={`p-2 border-b flex items-center justify-between text-xs z-10 ${
                  isDark ? 'border-slate-800 bg-slate-900/60 text-slate-300' : 'border-slate-200 bg-white text-slate-700 shadow-2xs'
                }`}>
                  <div className="flex items-center gap-1">
                    {activeRequest.documentBackUrl && (
                      <div className={`flex items-center p-0.5 rounded-lg border text-[11px] mr-2 ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                      }`}>
                        <button
                          onClick={() => setActiveSide('front')}
                          className={`px-2 py-0.5 rounded ${
                            activeSide === 'front'
                              ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          Frente
                        </button>
                        <button
                          onClick={() => setActiveSide('back')}
                          className={`px-2 py-0.5 rounded ${
                            activeSide === 'back'
                              ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          Reverso
                        </button>
                      </div>
                    )}
                    <span className="text-[11px] font-mono text-slate-400">
                      {activeRequest.docType} ({activeRequest.documentMeta.fileSize || 'Alta resolución'})
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                      title="Reducir zoom"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                      title="Aumentar zoom"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                      title="Rotar 90°"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Document Display Area */}
                <div className="flex-1 overflow-auto p-4 flex items-center justify-center min-h-[280px]">
                  <div
                    className="transition-transform duration-200 select-none shadow-xl rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 max-w-full"
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`
                    }}
                  >
                    <img
                      src={
                        activeSide === 'back' && activeRequest.documentBackUrl
                          ? activeRequest.documentBackUrl
                          : activeRequest.documentUrl
                      }
                      alt={`Documento ${activeRequest.docType}`}
                      className="max-h-[380px] w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Bottom OCR Confidence badge */}
                <div className={`p-2.5 border-t flex items-center justify-between text-[11px] ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Score de Reconocimiento OCR:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {activeRequest.documentMeta.ocrMatchScore || 98.4}%
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">Cotejado con JCE / INFOTEP</span>
                </div>
              </div>

              {/* Data Verification & Actions Panel (5 cols) */}
              <div className={`md:col-span-5 p-4 flex flex-col justify-between overflow-y-auto space-y-4 ${
                isDark ? 'bg-slate-900/40' : 'bg-slate-50/50'
              }`}>
                <div className="space-y-4">
                  {/* Document metadata comparison */}
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Cotejo de Datos Registrados
                    </h4>

                    <div className={`space-y-2 rounded-xl p-3.5 border text-xs ${
                      isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      {activeRequest.type === 'identity' ? (
                        <>
                          <div>
                            <div className="text-[10px] text-slate-400">Tipo de Documento</div>
                            <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {activeRequest.docType} Oficial
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Número de Cédula ingresado por experto</div>
                            <div className="font-mono font-bold text-teal-600 dark:text-teal-300 text-sm">
                              {activeRequest.idNumber || '001-1829472-3'}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Emisor Oficial</div>
                            <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                              {activeRequest.documentMeta.issuer || 'Junta Central Electoral (JCE)'}
                            </div>
                          </div>
                          <div className={`grid grid-cols-2 gap-2 pt-1 border-t text-[11px] ${
                            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-600'
                          }`}>
                            <div>
                              <span>Expedición:</span>{' '}
                              <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                                {activeRequest.documentMeta.issueDate || '2021-04-12'}
                              </strong>
                            </div>
                            <div>
                              <span>Vigencia:</span>{' '}
                              <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                                {activeRequest.documentMeta.expiryDate || '2031-04-12'}
                              </strong>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <div className="text-[10px] text-slate-400">Categoría Solicitada</div>
                            <div className="font-bold text-teal-600 dark:text-teal-300">{activeRequest.category || 'Técnico'}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Oficio / Especialidad a Acreditar</div>
                            <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {activeRequest.profession || 'Técnico en Refrigeración y Climatización'}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Institución Emisora</div>
                            <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                              {activeRequest.documentMeta.issuer || 'Instituto Nacional de Formación Técnico Profesional (INFOTEP)'}
                            </div>
                          </div>
                          <div className={`grid grid-cols-2 gap-2 pt-1 border-t text-[11px] ${
                            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-600'
                          }`}>
                            <div>
                              <span>Fecha Diploma:</span>{' '}
                              <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                                {activeRequest.documentMeta.issueDate || '2023-11-20'}
                              </strong>
                            </div>
                            <div>
                              <span>Vigencia:</span>{' '}
                              <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                                {activeRequest.documentMeta.expiryDate || 'Permanente'}
                              </strong>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Previous Review History */}
                  {activeRequest.reviewedAt && (
                    <div className={`rounded-xl p-3.5 border text-xs space-y-1 ${
                      isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Historial de Dictamen</div>
                      <div className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                        Revisado por: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeRequest.reviewedBy}</strong>
                      </div>
                      <div className="text-slate-400 text-[11px]">Fecha: {activeRequest.reviewedAt}</div>
                      {activeRequest.reviewerNotes && (
                        <div className={`text-[11px] pt-1 mt-1 border-t ${
                          isDark ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'
                        }`}>
                          {activeRequest.reviewerNotes}
                        </div>
                      )}
                      {activeRequest.rejectionReason && (
                        <div className="text-rose-600 dark:text-rose-400 text-[11px] pt-1 mt-1 border-t border-slate-200 dark:border-slate-800">
                          Motivo rechazo: {activeRequest.rejectionReason}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Auditor alert */}
                  {isAuditor && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Modo Auditor Activo: Acceso de sólo lectura para fines de cumplimiento y trazabilidad.</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons Section */}
                {!isAuditor && (
                  <div className={`pt-3 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    {showApprovalSuccess && (
                      <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>¡Expediente aprobado exitosamente! Sincronizado con la base de datos de la app.</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleApproveClick}
                        disabled={activeRequest.status === 'approved'}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          activeRequest.status === 'approved'
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>Aprobar Solicitud</span>
                      </button>

                      <button
                        onClick={() => setRejectModalOpen(true)}
                        disabled={activeRequest.status === 'rejected'}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          activeRequest.status === 'rejected'
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 active:scale-95'
                        }`}
                      >
                        <X className="w-4 h-4" />
                        <span>Rechazar con Motivo</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={`lg:col-span-8 border rounded-2xl p-12 flex flex-col items-center justify-center text-center ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
          }`}>
            <ShieldCheck className="w-12 h-12 mb-3 opacity-60" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Selecciona un expediente</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Haz clic en cualquier solicitud de la lista izquierda para validar la Cédula o Certificación técnica del experto.
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal Dialog */}
      {rejectModalOpen && activeRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <XCircle className="w-5 h-5" />
                <span>Rechazar Expediente {activeRequest.id}</span>
              </div>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Selecciona el motivo oficial que se notificará al experto <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeRequest.userName}</strong> en la app móvil Fianex:
            </p>

            <div className="space-y-1.5">
              {quickRejectReasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                    rejectReason === reason
                      ? isDark
                        ? 'bg-rose-950/40 border-rose-600 text-rose-200'
                        : 'bg-rose-50 border-rose-400 text-rose-900 font-medium'
                      : isDark
                      ? 'bg-slate-950/50 border-slate-800 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Observación adicional o instrucciones para reenvío (opcional):
              </label>
              <textarea
                value={customRejectNotes}
                onChange={(e) => setCustomRejectNotes(e.target.value)}
                placeholder="Ejemplo: Por favor suba una foto clara de su diploma de técnico electricista o plomero..."
                className={`w-full h-20 border rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div className={`flex items-center justify-end gap-2 pt-2 border-t ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
              >
                Confirmar Rechazo y Notificar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
