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
  Zap
} from 'lucide-react';
import { SupportTicket, AdminUser } from '../../types';

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
      text: 'Estimado experto, confirmamos que tu expediente de verificación ya se encuentra en revisión activa por nuestro departamento de operaciones. Tiempo estimado: menos de 2 horas hábiles.'
    },
    {
      title: 'Documento Ilegible',
      text: 'Hemos revisado el documento adjunto pero presenta reflejos o baja resolución. Te sugerimos abrir el Centro de Verificación en la app Fianex y volver a adjuntar una foto nítida de tu diploma o cédula.'
    },
    {
      title: 'Solución Pago 3DSecure',
      text: 'Para pagos de suscripción de expertos, te recomendamos verificar que tu banco emisor tenga habilitada la autorización digital 3D-Secure para transacciones en línea.'
    },
    {
      title: 'Actualización App Flutter',
      text: 'Por favor verifica en Google Play o App Store que cuentas con la versión 2.4.1 de Fianex para disfrutar de la sincronización en tiempo real de propuestas.'
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
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'all'
                  ? isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-400'
              }`}
            >
              Todos los Casos ({tickets.length})
            </button>
            <button
              onClick={() => setStatusFilter('abierto')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'abierto'
                  ? isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-white text-amber-800 shadow-2xs'
                  : 'text-slate-400'
              }`}
            >
              Abiertos
            </button>
            <button
              onClick={() => setStatusFilter('en_progreso')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'en_progreso'
                  ? isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white text-cyan-800 shadow-2xs'
                  : 'text-slate-400'
              }`}
            >
              En Progreso
            </button>
            <button
              onClick={() => setStatusFilter('resuelto')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'resuelto'
                  ? isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-400'
              }`}
            >
              Resueltos
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por #TK-..., asunto o usuario"
            className={`w-full border rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Main Tickets Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Column: Tickets Queue List (5 cols) */}
        <div className={`lg:col-span-5 border rounded-2xl flex flex-col overflow-hidden transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`p-3 border-b flex items-center justify-between text-xs ${
            isDark ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
          }`}>
            <span className="font-bold">Bandeja de Atención Verifike</span>
            <span className="text-[11px]">SLA Monitorizado</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
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
                        ? 'bg-teal-500/15 border-l-2 border-l-teal-400 text-white'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={ticket.requesterAvatar}
                          alt={ticket.requesterName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-teal-400">{ticket.id}</span>
                            <span className="text-xs font-semibold text-white truncate">{ticket.requesterName}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {ticket.requesterRole === 'expert' ? 'Experto Fianex' : 'Cliente Solicitante'}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                          ticket.status === 'abierto'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : ticket.status === 'en_progreso'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-medium truncate mt-2">
                      {ticket.subject}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {ticket.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400" />
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
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
            {/* Ticket Header & Status switcher */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-teal-400">{activeTicket.id}</span>
                  <h3 className="text-sm font-bold text-white">{activeTicket.subject}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Por {activeTicket.requesterName} ({activeTicket.requesterEmail}) · Asignado a {activeTicket.assignedTo}
                </p>
              </div>

              {/* Status transition dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Estado:</span>
                <select
                  value={activeTicket.status}
                  onChange={(e) => onUpdateStatus(activeTicket.id, e.target.value as SupportTicket['status'])}
                  className="bg-slate-950 border border-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-teal-500"
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40">
              {activeTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isStaff ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">{msg.sender}</span>
                    <span>·</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                      msg.isStaff
                        ? 'bg-teal-950/80 border border-teal-600/40 text-teal-100 rounded-tr-none'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Canned Responses */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Respuestas Rápidas (Plantillas Verifike):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cannedResponses.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setReplyText(item.text)}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] border border-slate-700 transition-colors"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleSendReply} className="p-3 border-t border-slate-800 bg-slate-900/90 flex gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe una respuesta para el usuario..."
                className="flex-1 h-14 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className={`px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                  replyText.trim()
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};
