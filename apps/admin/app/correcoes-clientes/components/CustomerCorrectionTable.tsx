'use client';

import type { CustomerCorrectionRecord } from '@/lib/types/customer-corrections-presentation';
import { ArrowRight, Lock, Phone, ShieldAlert, ShieldCheck } from 'lucide-react';
import type * as React from 'react';

interface CustomerCorrectionTableProps {
  corrections: CustomerCorrectionRecord[];
  selectedCorrectionId: string;
  onSelectCorrection: (record: CustomerCorrectionRecord) => void;
}

export function CustomerCorrectionTable({
  corrections,
  selectedCorrectionId,
  onSelectCorrection,
}: CustomerCorrectionTableProps) {
  return (
    <div
      data-testid="customer-correction-table-container"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden"
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Solicitações de alteração de dados</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Pedidos de correção cadastral submetidos por clientes e revendedores
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
          Auditoria LGPD
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" data-testid="customer-correction-table">
          <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
            <tr>
              <th scope="col" className="py-3 px-4">
                Protocolo / Cliente
              </th>
              <th scope="col" className="py-3 px-3">
                Campo
              </th>
              <th scope="col" className="py-3 px-3">
                Valor Atual → Solicitado
              </th>
              <th scope="col" className="py-3 px-3 text-center">
                Status
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Permissão
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {corrections.map((item) => {
              const isSelected = selectedCorrectionId === item.id;

              return (
                <tr
                  key={item.id}
                  data-testid={`correction-row-${item.id}`}
                  tabIndex={0}
                  onClick={() => onSelectCorrection(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectCorrection(item);
                    }
                  }}
                  className={`cursor-pointer transition-colors outline-none focus:bg-slate-100/70 ${
                    isSelected ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* Protocolo / Cliente */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 hover:text-red-600 transition-colors">
                      {item.customerName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {item.id} • {item.accountId}
                    </div>
                  </td>

                  {/* Campo */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {item.fieldLabel}
                    </span>
                  </td>

                  {/* Valor Atual → Solicitado */}
                  <td className="py-3 px-3 text-slate-600">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="text-slate-400">{item.currentValueMasked}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-900">{item.requestedValueMasked}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {item.status === 'IN_REVIEW' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {item.statusLabel}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        {item.statusLabel}
                      </span>
                    )}
                  </td>

                  {/* Permissão */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {item.isSensitive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        <Lock className="w-3 h-3 text-amber-600" />
                        HOLD (DENY_PENDING)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        <ShieldCheck className="w-3 h-3 text-slate-500" />
                        Triagem liberada
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Warning Box Matching Figma ADM-D-041 */}
      <div
        data-testid="customer-correction-table-warning"
        className="p-4 bg-amber-50/70 border-t border-amber-200/70 flex items-start gap-3"
      >
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950">
          <strong className="font-bold uppercase tracking-wide text-amber-900 block mb-0.5">
            ALTERAÇÃO CADASTRAL RESTRITA
          </strong>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            A alteração de dados sensíveis de clientes é exclusiva do Main Admin com trilha de
            auditoria e validação documental prévia. Operadores Support permanecem em DENY_PENDING
            (REL-07). Nenhum dado do banco foi alterado.
          </p>
        </div>
      </div>
    </div>
  );
}
