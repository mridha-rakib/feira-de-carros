import { ChevronRight } from 'lucide-react';
import type * as React from 'react';
import { formatBrl } from '../../../lib/adapters/mock-finance-data';
import type { TransactionRecord } from '../../../lib/types/finance-presentation';
import { PaymentMethodBadge } from './PaymentMethodBadge';
import { TransactionStatusBadge } from './TransactionStatusBadge';

interface TransactionTableProps {
  transactions: TransactionRecord[];
  selectedTransactionId: string;
  onSelectTransaction: (transaction: TransactionRecord) => void;
  onViewDetails?: (transaction: TransactionRecord) => void;
}

export function TransactionTable({
  transactions,
  selectedTransactionId,
  onSelectTransaction,
  onViewDetails,
}: TransactionTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table
          className="w-full text-left border-collapse text-xs table-fixed min-w-[650px] 2xl:min-w-[740px]"
          data-testid="transactions-table"
        >
          <colgroup>
            <col className="w-[105px] 2xl:w-[125px]" />
            <col className="w-[130px] 2xl:w-[160px]" />
            <col className="w-[120px] 2xl:w-[145px]" />
            <col className="w-[115px] 2xl:w-[115px]" />
            <col className="w-[75px] 2xl:w-[85px]" />
            <col className="w-[105px] 2xl:w-[110px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold text-[11px] uppercase tracking-wider select-none">
              <th scope="col" className="py-3 px-2.5">
                Transação
              </th>
              <th scope="col" className="py-3 px-2">
                Anúncio / Veículo
              </th>
              <th scope="col" className="py-3 px-2">
                Cliente / Vendedor
              </th>
              <th scope="col" className="py-3 px-2">
                Método
              </th>
              <th scope="col" className="py-3 px-2 text-right">
                Valor
              </th>
              <th scope="col" className="py-3 px-2.5 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {transactions.map((tx) => {
              const isSelected = tx.id === selectedTransactionId;

              return (
                <tr
                  key={tx.id}
                  tabIndex={0}
                  onClick={() => onSelectTransaction(tx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectTransaction(tx);
                    }
                  }}
                  className={`group transition-colors cursor-pointer select-none ${
                    isSelected ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/80 bg-white'
                  }`}
                  data-testid={`transaction-row-${tx.id}`}
                >
                  {/* 1. Transação */}
                  <td className="py-3 px-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-1 h-7 rounded-full shrink-0 transition-colors ${
                          isSelected ? 'bg-red-600' : 'bg-transparent group-hover:bg-slate-200'
                        }`}
                      />
                      <div className="min-w-0">
                        <span className="font-mono font-bold text-slate-900 group-hover:text-red-700 transition-colors block text-xs truncate">
                          {tx.id}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {tx.createdAt.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Anúncio / Veículo */}
                  <td className="py-3 px-2">
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] font-semibold text-slate-600 bg-slate-100 px-1 py-0.5 rounded">
                        {tx.adId}
                      </span>
                      <div
                        className="text-slate-800 font-medium truncate mt-0.5 text-xs"
                        title={tx.vehicleTitle}
                      >
                        {tx.vehicleTitle}
                      </div>
                    </div>
                  </td>

                  {/* 3. Cliente / Vendedor */}
                  <td className="py-3 px-2">
                    <div className="min-w-0">
                      <div
                        className="font-semibold text-slate-900 truncate text-xs"
                        title={tx.sellerName}
                      >
                        {tx.sellerName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                        {tx.sellerDocumentMasked}
                      </div>
                    </div>
                  </td>

                  {/* 4. Método */}
                  <td className="py-3 px-2 whitespace-nowrap">
                    <PaymentMethodBadge method={tx.method} size="sm" />
                  </td>

                  {/* 5. Valor */}
                  <td className="py-3 px-2 text-right whitespace-nowrap">
                    <span className="font-black text-slate-900 text-xs">
                      {formatBrl(tx.amountBrl)}
                    </span>
                    <div className="text-[10px] text-slate-400">taxa</div>
                  </td>

                  {/* 6. Status + Ações */}
                  <td className="py-3 px-2.5 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TransactionStatusBadge status={tx.status} size="sm" />
                      {onViewDetails && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(tx);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                          title="Ver detalhes da transação"
                          aria-label={`Ver detalhes de ${tx.id}`}
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
