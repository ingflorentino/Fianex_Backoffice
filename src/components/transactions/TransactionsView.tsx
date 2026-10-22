import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Download,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  Receipt
} from 'lucide-react';
import { Transaction, AdminUser } from '../../types';
import { exportTransactionsToExcel } from '../../services/exportService';

interface TransactionsViewProps {
  transactions: Transaction[];
  activeAdmin: AdminUser;
  isDark?: boolean;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  activeAdmin,
  isDark = false
}) => {
  const [typeFilter, setTypeFilter] = useState<'all' | Transaction['type']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = t.reference.toLowerCase().includes(q);
      const matchUser = t.userName.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      if (!matchRef && !matchUser && !matchDesc) return false;
    }
    return true;
  });

  const totalSubscriptions = transactions
    .filter((t) => t.type === 'subscription' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalEscrow = transactions
    .filter((t) => t.type === 'escrow_hold' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Top summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`border rounded-2xl p-4 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Total Suscripciones (tabla subscriptions)
          </div>
          <div className={`text-2xl font-black font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
            ${totalSubscriptions.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
            <span className="text-xs font-normal text-slate-500">DOP</span>
          </div>
          <p className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-1">
            Planes Intermedio ($349.99) y Premium ($499.99)
          </p>
        </div>

        <div className={`border rounded-2xl p-4 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Fondos en Custodia (Escrow)
          </div>
          <div className={`text-2xl font-black font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
            ${totalEscrow.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
            <span className="text-xs font-normal text-slate-500">DOP</span>
          </div>
          <p className="text-[11px] text-cyan-700 dark:text-cyan-400 font-semibold mt-1">
            Protección de pagos para clientes y técnicos
          </p>
        </div>

        <div className={`border rounded-2xl p-4 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Tasa de Aprobación de Cobros
          </div>
          <div className={`text-2xl font-black font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
            99.2%
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
            Sincronización Cloudflare Workers & Supabase
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'all'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-white text-teal-950 font-black shadow-xs border border-slate-200'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Todas ({transactions.length})
            </button>
            <button
              onClick={() => setTypeFilter('subscription')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'subscription'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-white text-teal-950 font-black shadow-xs border border-slate-200'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Suscripciones (subscriptions)
            </button>
            <button
              onClick={() => setTypeFilter('escrow_hold')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'escrow_hold'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-white text-teal-950 font-black shadow-xs border border-slate-200'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Garantía (Escrow)
            </button>
            <button
              onClick={() => setTypeFilter('expert_payout')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'expert_payout'
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-white text-teal-950 font-black shadow-xs border border-slate-200'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Liquidaciones
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por referencia o usuario..."
              className={`rounded-lg pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none w-52 sm:w-64 border transition-colors ${
                isDark
                  ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-white focus:border-teal-600'
              }`}
            />
          </div>

          <button
            onClick={() => exportTransactionsToExcel(filtered)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300 shadow-2xs'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-extrabold uppercase tracking-wider text-[11px] ${
                isDark ? 'border-slate-800 bg-slate-950/70 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}>
                <th className="py-3 px-4">Referencia & Fecha</th>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Concepto & Plan</th>
                <th className="py-3 px-4">Método de Pago</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4 text-center">Recibo</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-mono ${isDark ? 'divide-slate-800/60' : 'divide-slate-200/80'}`}>
              {filtered.map((tx) => (
                <tr key={tx.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-100/90'}`}>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-teal-700 dark:text-teal-300 text-xs">{tx.reference}</div>
                    <div className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{tx.date}</div>
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <div className={`font-black text-xs ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {tx.userName}
                    </div>
                    <div className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {tx.userType === 'expert' ? 'Experto Fianex (role_id: 2)' : 'Cliente (role_id: 1)'}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <div className={`font-bold text-xs ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                      {tx.description}
                    </div>
                    {tx.plan && (
                      <span className={`inline-block mt-1 text-[10px] font-black uppercase px-2 py-0.5 rounded border shadow-2xs ${
                        isDark ? 'text-teal-300 bg-teal-950/60 border-teal-800' : 'text-teal-950 bg-teal-100 border-teal-300'
                      }`}>
                        Plan {tx.plan.toUpperCase()}
                      </span>
                    )}
                  </td>

                  <td className={`py-3.5 px-4 font-sans font-medium ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    {tx.paymentMethod}
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border shadow-2xs ${
                        tx.status === 'completed'
                          ? isDark
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                          : tx.status === 'pending'
                          ? isDark
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-amber-100 text-amber-950 border-amber-400'
                          : isDark
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-rose-100 text-rose-950 border-rose-400'
                      }`}
                    >
                      {tx.status === 'completed' ? 'Completado' : tx.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      ${tx.amount.toFixed(2)} DOP
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isDark
                          ? 'hover:bg-slate-800 text-slate-300 border-slate-700'
                          : 'hover:bg-slate-100 text-slate-800 border-slate-300 shadow-2xs'
                      }`}
                      title="Ver Comprobante Oficial"
                    >
                      <Receipt className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-sm font-black">Comprobante de Transacción</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className={`text-xs font-bold px-2 py-1 rounded ${
                  isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                Cerrar
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Referencia:</span>
                <span className="font-mono font-black">{selectedTx.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Usuario:</span>
                <span className="font-bold">{selectedTx.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Concepto:</span>
                <span className="font-medium text-right max-w-[200px]">{selectedTx.description}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Método:</span>
                <span>{selectedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Fecha:</span>
                <span>{selectedTx.date}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm">
                <span className="font-black">Total Pagado:</span>
                <span className="font-mono font-black text-teal-700 dark:text-teal-300">
                  ${selectedTx.amount.toFixed(2)} DOP
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full mt-2 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl shadow-md"
            >
              Cerrar Comprobante
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
