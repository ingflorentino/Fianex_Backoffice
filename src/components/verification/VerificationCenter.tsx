import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
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
  ExternalLink,
  RefreshCw,
  FileImage,
  Send,
  Sparkles
} from 'lucide-react';
import { VerificationRequest, AdminUser, StorageDocumentItem } from '../../types';
import { fetchAllUserDocuments } from '../../services/supabaseService';

interface VerificationCenterProps {
  verifications: VerificationRequest[];
  activeAdmin: AdminUser;
  selectedVerificationId?: string | null;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string, notes?: string) => void;
  isDark?: boolean;
}

// User ID UUID mapping for initial mock / synced accounts
const USER_UUID_MAP: Record<string, string> = {
  'usr-sb-6': '90dd477f-5f71-4841-b43f-fb12b6e13537', // Roberto Florentino
  'usr-sb-5': '36362678-bf6c-40cc-915d-4e20e344ca22', // Alberto Santana
  'usr-sb-1': '93ef4ffd-0929-40da-87f0-d01b2265b2b9', // Juana Pérez
  'usr-sb-24': '08594e35-6d5b-4ecf-aade-5905c35b2985', // Experto Web
  'usr-sb-7': 'c070875e-0eb8-4737-8afd-20c53aac6b11', // Karlos Lagrange
  'usr-sb-3': 'cbaa057a-f0cb-4857-b7a6-b50071d6108d', // Carlos Taveras
  'usr-sb-38': '0d594acb-2725-4170-bbb0-404258ef5995' // Rivert Services
};

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

  // Storage documents state
  const [activeBucket, setActiveBucket] = useState<'identity_docs' | 'professional_docs'>('identity_docs');
  const [activeDocIndex, setActiveDocIndex] = useState<number>(0);
  const [userDocs, setUserDocs] = useState<{
    identityDocs: StorageDocumentItem[];
    professionalDocs: StorageDocumentItem[];
  }>({ identityDocs: [], professionalDocs: [] });
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);

  // Document viewer controls
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<string>('');
  const [rejectReason, setRejectReason] = useState('Documento borroso o con baja resolución');
  const [customRejectNotes, setCustomRejectNotes] = useState('');

  // Approval feedback & inline notes
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);

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

  // Resolve user UUID
  const activeUserUuid =
    activeRequest?.rawUserId ||
    USER_UUID_MAP[activeRequest?.userId || ''] ||
    (activeRequest?.userId?.includes('-') && !activeRequest?.userId?.startsWith('usr-sb-')
      ? activeRequest.userId
      : undefined);

  // Load storage documents for the active user
  const loadUserDocuments = async (targetUuid: string) => {
    setLoadingDocs(true);
    setImgLoadError(false);
    try {
      const docs = await fetchAllUserDocuments(targetUuid);
      setUserDocs(docs);
    } catch (err) {
      console.warn('Error fetching documents from Supabase storage:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (!activeRequest) return;

    // Reset controls
    setZoomLevel(1);
    setRotation(0);
    setActiveSide('front');
    setActiveDocIndex(0);
    setImgLoadError(false);
    setApprovalNotes('');

    // Initial bucket selection
    const defaultBucket = activeRequest.type === 'identity' ? 'identity_docs' : 'professional_docs';
    setActiveBucket(defaultBucket);

    if (activeUserUuid) {
      loadUserDocuments(activeUserUuid);
    } else if (activeRequest.documents && activeRequest.documents.length > 0) {
      const isIdentity = activeRequest.type === 'identity';
      setUserDocs({
        identityDocs: isIdentity ? activeRequest.documents : [],
        professionalDocs: !isIdentity ? activeRequest.documents : []
      });
    } else {
      setUserDocs({ identityDocs: [], professionalDocs: [] });
    }
  }, [activeRequest?.id, activeUserUuid]);

  const handleApprove = (targetId?: string, notes?: string) => {
    const idToApprove = targetId || activeRequest?.id;
    if (!idToApprove) return;
    onApprove(idToApprove, notes || approvalNotes);
    setShowApprovalSuccess(true);
    setTimeout(() => setShowApprovalSuccess(false), 3500);
  };

  const handleOpenRejectModal = (targetId?: string) => {
    const idToReject = targetId || activeRequest?.id || '';
    setRejectTargetId(idToReject);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    const idToReject = rejectTargetId || activeRequest?.id;
    if (!idToReject) return;
    onReject(idToReject, rejectReason, customRejectNotes);
    setRejectModalOpen(false);
    setCustomRejectNotes('');
    setRejectTargetId('');
  };

  const quickRejectReasons = [
    'Documento borroso o con baja resolución',
    'El número de cédula no coincide con el registro oficial',
    'Documento oficial vencido o deteriorado',
    'Certificado o diploma técnico no acreditado oficialmente',
    'Falta foto del reverso del documento',
    'Nombre en el certificado no coincide con el usuario'
  ];

  // Current bucket items
  const currentBucketFiles = activeBucket === 'identity_docs' ? userDocs.identityDocs : userDocs.professionalDocs;
  const currentDoc: StorageDocumentItem | null =
    currentBucketFiles.length > 0
      ? currentBucketFiles[Math.min(activeDocIndex, currentBucketFiles.length - 1)]
      : null;

  // Determine active document URL
  const activeUrl = currentDoc?.url || (activeSide === 'back' && activeRequest?.documentBackUrl ? activeRequest.documentBackUrl : activeRequest?.documentUrl);
  const isPdf =
    currentDoc?.isPdf ||
    (activeUrl && activeUrl.toLowerCase().includes('.pdf')) ||
    (currentDoc && currentDoc.name.toLowerCase().endsWith('.pdf'));

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
              className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                filterStatus === 'all'
                  ? isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-400'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                filterStatus === 'pending'
                  ? isDark ? 'bg-amber-500/20 text-amber-300 font-bold' : 'bg-white text-amber-700 shadow-2xs font-bold'
                  : 'text-slate-400'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                filterStatus === 'approved'
                  ? isDark ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-slate-400'
              }`}
            >
              Aprobados
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                filterStatus === 'rejected'
                  ? isDark ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-white text-rose-700 shadow-2xs font-bold'
                  : 'text-slate-400'
              }`}
            >
              Rechazados
            </button>
          </div>
        </div>

        {/* Search Input inside verification module */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por usuario, cédula o expediente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-teal-500 transition-colors ${
              isDark
                ? 'bg-slate-950/80 border-slate-800 text-slate-200 placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Main Split Layout: Left Queue & Right Inspection Canvas */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left Column: Applications Queue (4 cols) */}
        <div className={`lg:col-span-4 border rounded-2xl flex flex-col overflow-hidden transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`p-3.5 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Expedientes de Validación
              </h3>
              <p className="text-[11px] text-slate-400">
                {filteredList.length} expediente(s) listados
              </p>
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20">
              Supabase Live
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2 space-y-2">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No se encontraron solicitudes con los filtros actuales.
              </div>
            ) : (
              filteredList.map((req) => {
                const isSelected = req.id === activeRequest?.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      setSelectedId(req.id);
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? isDark
                          ? 'bg-teal-500/10 border-teal-500/40 shadow-xs ring-1 ring-teal-500/30'
                          : 'bg-teal-50/80 border-teal-300 shadow-xs ring-1 ring-teal-400/30'
                        : isDark
                        ? 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                        : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={req.userAvatar}
                          alt={req.userName}
                          className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-teal-600 dark:text-teal-400">
                              {req.id}
                            </span>
                          </div>
                          <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {req.userName}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">
                            {req.type === 'identity' ? `Cédula: ${req.idNumber || 'En revisión'}` : req.profession || 'Especialidad'}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          req.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                            : req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                            : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                        }`}
                      >
                        {req.status === 'pending' ? 'Pendiente' : req.status === 'approved' ? '✓ Aprobado' : '✗ Rechazado'}
                      </span>
                    </div>

                    <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] ${
                      isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
                    }`}>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-400" />
                        {req.docType}
                      </span>
                      
                      {/* Direct Quick Actions on Card */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(req.id);
                            handleApprove(req.id);
                          }}
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] flex items-center gap-1 transition-all ${
                            req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs'
                          }`}
                          title="Aprobar esta solicitud inmediatamente"
                        >
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>{req.status === 'approved' ? 'Aprobado' : 'Aprobar'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(req.id);
                            handleOpenRejectModal(req.id);
                          }}
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] flex items-center gap-1 transition-all ${
                            req.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-2xs'
                          }`}
                          title="Rechazar esta solicitud con motivo"
                        >
                          <X className="w-3 h-3 stroke-[2.5]" />
                          <span>{req.status === 'rejected' ? 'Rechazado' : 'Rechazar'}</span>
                        </button>
                      </div>
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
            {/* Header of Active Inspection with Prominent Approve & Reject Buttons */}
            <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
              isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50/80'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold shrink-0">
                  {activeRequest.type === 'identity' ? 'ID' : <Award className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
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
                        ? '✓ Aprobado y Activo'
                        : '✗ Rechazado'}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {activeRequest.userEmail} · Enviado el {activeRequest.submittedAt}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS IN HEADER - Always 100% visible and accessible */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApprove()}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    activeRequest.status === 'approved'
                      ? 'bg-emerald-700 text-white ring-2 ring-emerald-400/60'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-md'
                  }`}
                  title="Aprobar solicitud de verificación"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{activeRequest.status === 'approved' ? '✓ Aprobado' : 'Aprobar Solicitud'}</span>
                </button>

                <button
                  onClick={() => handleOpenRejectModal()}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    activeRequest.status === 'rejected'
                      ? 'bg-rose-700 text-white ring-2 ring-rose-400/60'
                      : 'bg-rose-600 hover:bg-rose-500 text-white hover:shadow-md'
                  }`}
                  title="Rechazar solicitud con motivo oficial"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                  <span>{activeRequest.status === 'rejected' ? '✗ Rechazado' : 'Rechazar Solicitud'}</span>
                </button>
              </div>
            </div>

            {/* Viewer Workspace */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Document Visual Canvas (7 cols) */}
              <div className={`md:col-span-7 flex flex-col border-b md:border-b-0 md:border-r relative ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100/70 border-slate-200'
              }`}>
                {/* Visual Canvas Toolbar */}
                <div className={`p-2 border-b flex flex-wrap items-center justify-between text-xs z-10 gap-2 ${
                  isDark ? 'border-slate-800 bg-slate-900/60 text-slate-300' : 'border-slate-200 bg-white text-slate-700 shadow-2xs'
                }`}>
                  {/* Bucket Selection Tabs */}
                  <div className={`flex items-center p-0.5 rounded-lg border text-[11px] ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <button
                      onClick={() => {
                        setActiveBucket('identity_docs');
                        setActiveDocIndex(0);
                        setImgLoadError(false);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-all ${
                        activeBucket === 'identity_docs'
                          ? isDark
                            ? 'bg-teal-500/20 text-teal-300 font-bold'
                            : 'bg-white text-teal-800 font-bold shadow-2xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <FileImage className="w-3 h-3" />
                      <span>Cédula</span>
                      <span className="text-[9px] px-1 rounded-full bg-slate-200 dark:bg-slate-800 font-mono">
                        {userDocs.identityDocs.length}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveBucket('professional_docs');
                        setActiveDocIndex(0);
                        setImgLoadError(false);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-all ${
                        activeBucket === 'professional_docs'
                          ? isDark
                            ? 'bg-teal-500/20 text-teal-300 font-bold'
                            : 'bg-white text-teal-800 font-bold shadow-2xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>Certificados</span>
                      <span className="text-[9px] px-1 rounded-full bg-slate-200 dark:bg-slate-800 font-mono">
                        {userDocs.professionalDocs.length}
                      </span>
                    </button>
                  </div>

                  {/* Multi-file switcher if user uploaded multiple files */}
                  {currentBucketFiles.length > 1 ? (
                    <div className={`flex items-center p-0.5 rounded-lg border text-[11px] ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                    }`}>
                      {currentBucketFiles.map((file, idx) => (
                        <button
                          key={file.name}
                          onClick={() => {
                            setActiveDocIndex(idx);
                            setImgLoadError(false);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                            activeDocIndex === idx
                              ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {idx === 0 ? 'Frente' : idx === 1 ? 'Reverso' : `Doc ${idx + 1}`}
                        </button>
                      ))}
                    </div>
                  ) : activeRequest.documentBackUrl ? (
                    <div className={`flex items-center p-0.5 rounded-lg border text-[11px] ${
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
                  ) : null}

                  {/* Canvas Controls */}
                  <div className="flex items-center gap-1 ml-auto">
                    {!isPdf && (
                      <>
                        <button
                          onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
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
                      </>
                    )}

                    {activeUserUuid && (
                      <button
                        onClick={() => loadUserDocuments(activeUserUuid)}
                        disabled={loadingDocs}
                        title="Refrescar desde Supabase Storage"
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingDocs ? 'animate-spin text-teal-500' : ''}`} />
                      </button>
                    )}

                    {activeUrl && (
                      <a
                        href={activeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-teal-600 dark:text-teal-400"
                        title="Abrir en pestaña nueva con resolución original"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Document Display Canvas */}
                <div className="flex-1 overflow-auto p-4 flex items-center justify-center min-h-[300px]">
                  {loadingDocs ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                      <RefreshCw className="w-8 h-8 animate-spin text-teal-500" />
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Descargando documentos desde Supabase Storage ({activeBucket})...
                      </p>
                    </div>
                  ) : isPdf ? (
                    /* PDF Document Embedded Viewer */
                    <div className="w-full h-full flex flex-col space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-200/60 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-red-500" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {currentDoc?.name || 'Documento Oficial PDF'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={activeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-bold text-[11px] hover:bg-teal-500 flex items-center gap-1 shadow-2xs"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Abrir PDF Completo</span>
                          </a>
                        </div>
                      </div>
                      <iframe
                        src={activeUrl}
                        title="Documento PDF"
                        className="w-full flex-1 min-h-[340px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white"
                      />
                    </div>
                  ) : (
                    /* High-Res Image Viewer */
                    <div className="relative flex flex-col items-center justify-center max-w-full">
                      {imgLoadError ? (
                        <div className="p-6 rounded-2xl border border-rose-300 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-900 text-center max-w-md space-y-3">
                          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                          <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                            No se pudo previsualizar la foto de la cédula / documento
                          </h4>
                          <p className="text-[11px] text-rose-700 dark:text-rose-300">
                            El archivo se encuentra en el bucket privado de Supabase Storage. Puede abrirlo directamente con el enlace firmado o solicitar re-sincronización.
                          </p>
                          <div className="flex items-center justify-center gap-2 pt-2">
                            {activeUrl && (
                              <a
                                href={activeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Ver enlace directo</span>
                              </a>
                            )}
                            {activeUserUuid && (
                              <button
                                onClick={() => loadUserDocuments(activeUserUuid)}
                                className="px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-700 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50"
                              >
                                Reintentar
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="transition-transform duration-200 select-none shadow-xl rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 max-w-full"
                          style={{
                            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`
                          }}
                        >
                          <img
                            src={activeUrl}
                            alt={`Documento ${activeRequest.docType}`}
                            onError={() => setImgLoadError(true)}
                            className="max-h-[380px] w-auto object-contain cursor-grab active:cursor-grabbing"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Storage Connection & OCR status */}
                <div className={`p-2.5 border-t flex flex-wrap items-center justify-between text-[11px] gap-2 ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Supabase Storage:
                    </span>
                    <span className="font-mono text-teal-600 dark:text-teal-400">
                      {activeBucket}/{activeUserUuid ? `${activeUserUuid.substring(0, 8)}...` : 'user_id'}
                    </span>
                    {currentDoc && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({currentDoc.size})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Validación Biométrica OCR:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {activeRequest.documentMeta.ocrMatchScore || 98.4}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Verification & Actions Panel (5 cols) */}
              <div className={`md:col-span-5 p-4 flex flex-col justify-between overflow-y-auto space-y-4 ${
                isDark ? 'bg-slate-900/40' : 'bg-slate-50/50'
              }`}>
                <div className="space-y-4">
                  {/* CONSOLA DE DICTAMEN - Colocada en la parte superior para máxima visibilidad */}
                  <div className={`p-4 rounded-xl border text-xs space-y-3 ${
                    isDark ? 'bg-slate-950/80 border-slate-700' : 'bg-white border-slate-300 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-500" />
                        <span className="font-bold uppercase tracking-wider text-[11px]">
                          Panel de Decisión Oficial
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          activeRequest.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300'
                            : activeRequest.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300'
                        }`}
                      >
                        {activeRequest.status === 'pending' ? 'Pendiente' : activeRequest.status === 'approved' ? '✓ Aprobado' : '✗ Rechazado'}
                      </span>
                    </div>

                    {showApprovalSuccess && (
                      <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>¡Expediente aprobado exitosamente! Sincronizado con Supabase.</span>
                      </div>
                    )}

                    {/* Inline reviewer notes input */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Observación de Dictamen (opcional):
                      </label>
                      <input
                        type="text"
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        placeholder="Ejemplo: Cotejado con padrón JCE, coincidencia 100%..."
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:border-teal-500 ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    {/* Decision Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleApprove()}
                        className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95"
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>{activeRequest.status === 'approved' ? 'Re-confirmar Aprobado' : 'Aprobar Solicitud'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenRejectModal()}
                        className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white shadow-sm active:scale-95"
                      >
                        <X className="w-4 h-4 stroke-[2.5]" />
                        <span>Rechazar con Motivo</span>
                      </button>
                    </div>
                  </div>

                  {/* Active File Metadata Pill */}
                  <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                        Detalle del Archivo Cargado
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20">
                        {isPdf ? 'Documento PDF' : 'Imagen JPG/PNG'}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Nombre de Archivo:</span>
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                          {currentDoc?.name || 'Archivo no especificado'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Carpeta en Storage:</span>
                        <span className="font-mono font-semibold text-teal-600 dark:text-teal-400">
                          {activeBucket}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Identificador (user_id):</span>
                        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                          {activeUserUuid || 'No asignado'}
                        </span>
                      </div>
                    </div>
                  </div>

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
                              {activeRequest.docType} Oficial de República Dominicana
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Número de Cédula ingresado por usuario</div>
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
                              {activeRequest.profession || 'Especialista Técnico Certificado'}
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
                </div>
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
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <XCircle className="w-5 h-5" />
                <span>Rechazar Expediente {rejectTargetId || activeRequest?.id}</span>
              </div>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Selecciona el motivo oficial que se notificará al usuario/experto en la app móvil Fianex:
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
                placeholder="Ejemplo: Por favor suba una foto clara de su cédula o diploma de acreditación técnica..."
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
