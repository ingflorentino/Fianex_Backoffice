import React, { useState, useEffect } from 'react';
import { Search, X, ShieldCheck, Users, Headphones, CreditCard, ChevronRight } from 'lucide-react';
import { AppUser, VerificationRequest, SupportTicket } from '../../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AppUser[];
  verifications: VerificationRequest[];
  tickets: SupportTicket[];
  onSelectAction: (view: string, id?: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  users,
  verifications,
  tickets,
  onSelectAction
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedVerifications = verifications.filter(
    (v) =>
      v.id.toLowerCase().includes(q) ||
      v.userName.toLowerCase().includes(q) ||
      v.docType.toLowerCase().includes(q) ||
      (v.idNumber && v.idNumber.toLowerCase().includes(q))
  );

  const matchedUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.expertProfession && u.expertProfession.toLowerCase().includes(q))
  );

  const matchedTickets = tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.requesterName.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-teal-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por ID (#202610...), nombre, cédula o ticket..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-3 divide-y divide-slate-800/80">
          {/* Expedientes de Verificación */}
          {matchedVerifications.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400 mb-1.5 px-2">
                Expedientes de Verificación ({matchedVerifications.length})
              </div>
              <div className="space-y-1">
                {matchedVerifications.slice(0, 4).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      onSelectAction('verifications', v.id);
                      onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-xs text-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span className="font-mono font-bold text-teal-300">{v.id}</span>
                      <span>·</span>
                      <span className="font-semibold text-white">{v.userName}</span>
                      <span className="text-slate-400">({v.docType})</span>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {v.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Usuarios */}
          {matchedUsers.length > 0 && (
            <div className="pt-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1.5 px-2">
                Usuarios Registrados ({matchedUsers.length})
              </div>
              <div className="space-y-1">
                {matchedUsers.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSelectAction('users', u.id);
                      onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-xs text-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-semibold text-white">{u.name}</span>
                      <span className="text-slate-400">({u.email})</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300 uppercase">
                      {u.type === 'expert' ? `Plan ${u.expertPlan || 'Básico'}` : 'Cliente'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tickets */}
          {matchedTickets.length > 0 && (
            <div className="pt-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1.5 px-2">
                Tickets de Soporte ({matchedTickets.length})
              </div>
              <div className="space-y-1">
                {matchedTickets.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectAction('support', t.id);
                      onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-xs text-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Headphones className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-mono font-bold text-amber-300">{t.id}</span>
                      <span className="truncate text-white">{t.subject}</span>
                    </div>
                    <span className="text-[10px] uppercase text-slate-400 shrink-0 ml-2">
                      {t.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedVerifications.length === 0 && matchedUsers.length === 0 && matchedTickets.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-500">
              No se encontraron resultados para "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
