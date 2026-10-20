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
          <div className="text-xs text-slate-500 font-bold uppercase">Total Suscripciones Planes</div>
          <div className={`text-2xl font-black font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${totalSubscriptions.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
            <span className="text-xs font-normal text-slate-500">Pesos</span>
          </div>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">Planes Intermedio ($349.99) y Premium ($499.99)</p>
        </div>

        <div className={`border rounded-2xl p-4 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="text-xs text-slate-500 font-bold uppercase">Fondos en Custodia (Escrow)</div>
          <div className={`text-2xl font-black font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${totalEscrow.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
            <span className="text-xs font-normal text-slate-500">Pesos</span>
          </div>
          <p className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1">Protección de pagos para clientes y técnicos</p>
        </div>

        <div className={`border rounded-2xl p-4 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="text-xs text-slate-500 font-bold uppercase">Tasa de Aprobación de Cobros</div>
          <div className={`text-2xl font-black font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>99.2%</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Integración bancaria sin fricción</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                typeFilter === 'all'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas ({transactions.length})
            </button>
            <button
              onClick={() => setTypeFilter('subscription')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                typeFilter === 'subscription'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Suscripciones Planes
            </button>
            <button
              onClick={() => setTypeFilter('escrow_hold')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                typeFilter === 'escrow_hold'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Garantía (Escrow)
            </button>
            <button
              onClick={() => setTypeFilter('expert_payout')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                typeFilter === 'expert_payout'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Liquidaciones
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por referencia o usuario..."
              className="bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 w-52 sm:w-64"
            />
          </div>

          <button
            onClick={() => exportTransactionsToExcel(filtered)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Referencia & Fecha</th>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Concepto & Plan</th>
                <th className="py-3 px-4">Método de Pago</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4 text-center">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-teal-300 text-xs">{tx.reference}</div>
                    <div className="text-[11px] text-slate-400 font-sans">{tx.date}</div>
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <div className="font-semibold text-white">{tx.userName}</div>
                    <div className="text-[11px] text-slate-400">
                      {tx.userType === 'expert' ? 'Experto Fianex' : 'Cliente'}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-200">{tx.description}</span>
                    </div>
                    {tx.plan && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold uppercase text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800">
                        Tier {tx.plan}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-sans text-slate-300">
                    {tx.paymentMethod}
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                        tx.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : tx.status === 'pending'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {tx.status === 'completed' ? 'Completado' : tx.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="font-bold text-white text-sm">
                      ${tx.amount.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400">{tx.currency} (Pesos)</div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-teal-300 transition-colors"
                      title="Ver Comprobante Oficial"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Comprobante de Pago Fianex</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Referencia:</span>
                <span className="font-mono font-bold text-teal-300">{selectedTx.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Beneficiario/Pagador:</span>
                <span className="font-semibold text-white">{selectedTx.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Concepto:</span>
                <span className="text-slate-200">{selectedTx.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Método:</span>
                <span className="text-slate-200">{selectedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fecha y Hora:</span>
                <span className="font-mono text-slate-300">{selectedTx.date}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold">
                <span className="text-white">Monto Total:</span>
                <span className="text-teal-400 font-mono">${selectedTx.amount.toFixed(2)} {selectedTx.currency}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300 hover:text-white"
              >
                Cerrar
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg text-xs bg-teal-600 hover:bg-teal-500 text-white font-bold"
              >
                Imprimir Recibo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
