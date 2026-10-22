import React, { useState } from 'react';
import {
  Headphones,
  Search,
  Filter,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User,
  ShieldCheck,
  ChevronRight,
  Smartphone,
  Sparkles,
  Zap,
  Database
} from 'lucide-react';
import { SupportTicket, AdminUser } from '../../types';
import { SqlScriptModal } from './SqlScriptModal';

interface SupportTicketsProps {
  tickets: SupportTicket[];
  activeAdmin: AdminUser;
  onAddResponse: (ticketId: string, text: string) => void;
  onUpdateStatus: (ticketId: string, status: SupportTicket['status']) => void;
  isDark?: boolean;
}

export const SupportTickets: React.FC<SupportTicketsProps> = ({
  tickets,
  activeAdmin,
  onAddResponse,
  onUpdateStatus,
  isDark = false
}) => {
  const [selectedId, setSelectedId] = useState<string>(tickets[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<'all' | SupportTicket['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSub = t.subject.toLowerCase().includes(q);
      const matchName = t.requesterName.toLowerCase().includes(q);
      const matchId = t.id.toLowerCase().includes(q);
      if (!matchSub && !matchName && !matchId) return false;
    }
    return true;
  });

  const activeTicket = tickets.find((t) => t.id === selectedId) || filteredTickets[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;
    onAddResponse(activeTicket.id, replyText);
    setReplyText('');
  };

  const cannedResponses = [
    {
      title: 'Validación en Proceso',
      text: 'Estimado experto, confirmamos que tu expediente de verificación ya se encuentra en revisión activa en la tabla Verifications_requests. Tiempo estimado: menos de 2 horas hábiles.'
    },
    {
      title: 'Documento Ilegible',
      text: 'Hemos revisado el documento adjunto pero presenta reflejos o baja resolución. Te sugerimos abrir el Centro de Verificación en la app móvil Fianex y volver a adjuntar una foto nítida de tu cédula o diploma.'
    },
    {
      title: 'Solución Pago 3DSecure',
      text: 'Para pagos de suscripción de expertos ($349.99 / $499.99), te recomendamos verificar que tu banco emisor tenga habilitada la autorización digital 3D-Secure para transacciones en línea.'
    },
    {
      title: 'Actualización App Flutter',
      text: 'Por favor verifica en Google Play o App Store que cuentas con la versión oficial de Fianex para disfrutar de la sincronización en tiempo real de propuestas.'
    }
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-4">
      {/* Top Filter Bar */}
      <div className={`border rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'all'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'bg-white text-teal-950 font-black shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950 font-semibold'
              }`}
            >
              Todos los Casos ({tickets.length})
            </button>
            <button
              onClick={() => setStatusFilter('abierto')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'abierto'
                  ? isDark
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-white text-amber-950 font-black shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950 font-semibold'
              }`}
            >
              Abiertos
            </button>
            <button
              onClick={() => setStatusFilter('en_progreso')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'en_progreso'
                  ? isDark
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-white text-cyan-950 font-black shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950 font-semibold'
              }`}
            >
              En Progreso
            </button>
            <button
              onClick={() => setStatusFilter('resuelto')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'resuelto'
                  ? isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-white text-emerald-950 font-black shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950 font-semibold'
              }`}
            >
              Resueltos
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por #TK-..., asunto o usuario"
              className={`w-full border rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-white focus:border-teal-600'
              }`}
            />
          </div>

          {/* Supabase SQL Script Button */}
          <button
            onClick={() => setIsSqlModalOpen(true)}
            title="Ver y copiar script SQL para crear las tablas en Supabase"
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all ${
              isDark
                ? 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border-teal-500/30'
                : 'bg-teal-50 hover:bg-teal-100/80 text-teal-950 border-teal-300 shadow-2xs'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Script SQL Supabase</span>
          </button>
        </div>
      </div>

      {/* Main Tickets Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Column: Tickets Queue List (5 cols) */}
        <div className={`lg:col-span-5 border rounded-2xl flex flex-col overflow-hidden transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`p-3.5 border-b flex items-center justify-between text-xs font-extrabold ${
            isDark ? 'border-slate-800 bg-slate-950/60 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-800'
          }`}>
            <span className="font-black uppercase tracking-wider">Bandeja de Atención Verifike</span>
            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">SLA Monitorizado</span>
          </div>

          <div className={`flex-1 overflow-y-auto divide-y ${
            isDark ? 'divide-slate-800/80' : 'divide-slate-200/90'
          }`}>
            {filteredTickets.length === 0 ? (
              <div className={`p-8 text-center text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                No se encontraron tickets con los filtros actuales.
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isSelected = activeTicket && activeTicket.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedId(ticket.id)}
                    className={`p-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-teal-500/15 border-l-4 border-l-teal-400 text-white'
                          : 'bg-teal-50/90 border-l-4 border-l-teal-600 shadow-xs'
                        : isDark
                        ? 'hover:bg-slate-800/50 text-slate-300'
                        : 'bg-white hover:bg-slate-100/90 text-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={ticket.requesterAvatar}
                          alt={ticket.requesterName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0 shadow-2xs"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-mono text-xs font-black ${
                              isSelected
                                ? isDark ? 'text-teal-300' : 'text-teal-800'
                                : isDark ? 'text-teal-400' : 'text-teal-700'
                            }`}>
                              {ticket.id}
                            </span>
                            <span className={`text-xs font-black truncate tracking-tight ${
                              isDark ? 'text-white' : 'text-slate-950'
                            }`}>
                              {ticket.requesterName}
                            </span>
                          </div>
                          <div className={`text-[11px] font-semibold truncate ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {ticket.requesterRole === 'expert' ? 'Experto Fianex' : 'Cliente Solicitante'}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 shadow-2xs ${
                          ticket.status === 'abierto'
                            ? isDark
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-amber-100 text-amber-950 border-amber-400'
                            : ticket.status === 'en_progreso'
                            ? isDark
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                              : 'bg-cyan-100 text-cyan-950 border-cyan-400'
                            : isDark
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                        }`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className={`text-xs font-bold truncate mt-2 leading-snug ${
                      isDark ? 'text-slate-200' : 'text-slate-950'
                    }`}>
                      {ticket.subject}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border shadow-2xs ${
                        isDark
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-slate-900 text-white border-slate-900'
                      }`}>
                        {ticket.category}
                      </span>
                      <span className={`flex items-center gap-1 font-semibold ${
                        isDark ? 'text-slate-400' : 'text-slate-700'
                      }`}>
                        <Clock className="w-3 h-3 text-slate-500" />
                        {ticket.slaDue}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation & Response Desk (7 cols) */}
        {activeTicket ? (
          <div className={`lg:col-span-7 border rounded-2xl flex flex-col overflow-hidden shadow-sm transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Ticket Header & Status switcher */}
            <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
              isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/80'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-teal-700 dark:text-teal-400">{activeTicket.id}</span>
                  <h3 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {activeTicket.subject}
                  </h3>
                </div>
                <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Por <span className="font-bold">{activeTicket.requesterName}</span> ({activeTicket.requesterEmail}) · Asignado a {activeTicket.assignedTo}
                </p>
              </div>

              {/* Status transition dropdown */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Estado:</span>
                <select
                  value={activeTicket.status}
                  onChange={(e) => onUpdateStatus(activeTicket.id, e.target.value as SupportTicket['status'])}
                  className={`border text-xs font-black rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-950 shadow-2xs'
                  }`}
                >
                  <option value="abierto">Abierto</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="esperando_usuario">Esperando Usuario</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
            </div>

            {/* Conversation Messages Thread */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-3.5 ${
              isDark ? 'bg-slate-950/40' : 'bg-slate-100/70'
            }`}>
              {activeTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isStaff ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-center gap-1.5 mb-1 text-[11px] font-bold ${
                    isDark ? 'text-slate-400' : 'text-slate-700'
                  }`}>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-900 font-extrabold'}>{msg.sender}</span>
                    <span>·</span>
                    <span className="font-mono text-slate-500">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-medium leading-relaxed shadow-sm ${
                      msg.isStaff
                        ? isDark
                          ? 'bg-teal-950/90 border border-teal-600/40 text-teal-100 rounded-tr-none'
                          : 'bg-teal-700 text-white rounded-tr-none shadow-md'
                        : isDark
                        ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                        : 'bg-white border border-slate-200 text-slate-950 rounded-tl-none shadow-xs font-semibold'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Canned Responses */}
            <div className={`p-3 border-t space-y-2 ${
              isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50/90'
            }`}>
              <div className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-800'
              }`}>
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Respuestas Rápidas (Plantillas Verifike):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cannedResponses.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setReplyText(item.text)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
                        : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-2xs'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleSendReply} className={`p-3 border-t flex gap-2 ${
              isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
            }`}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe una respuesta para el usuario..."
                className={`flex-1 h-14 border rounded-xl p-2.5 text-xs focus:outline-none transition-colors resize-none font-medium ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-white focus:border-teal-600'
                }`}
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className={`px-4 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                  replyText.trim()
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/30'
                    : isDark ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        ) : null}
      </div>

      {/* Supabase SQL Migration Modal */}
      <SqlScriptModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
        isDark={isDark}
      />
    </div>
  );
};

