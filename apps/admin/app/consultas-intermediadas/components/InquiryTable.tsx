'use client';

import type { IntermediatedInquiryRecord } from '@/lib/types/intermediated-inquiries-presentation';
import { Car, MessageSquare, ShieldAlert, User, UserX } from 'lucide-react';
import type * as React from 'react';

interface InquiryTableProps {
  inquiries: IntermediatedInquiryRecord[];
  selectedInquiryId: string;
  onSelectInquiry: (inquiry: IntermediatedInquiryRecord) => void;
}

export function InquiryTable({ inquiries, selectedInquiryId, onSelectInquiry }: InquiryTableProps) {
  return (
    <div
      data-testid="inquiry-table-container"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden"
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Consultas de anúncios da feira</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Compradores interessados em veículos físicos intermediados pela plataforma
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
          Anúncios legados
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" data-testid="inquiry-table">
          <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
            <tr>
              <th scope="col" className="py-3 px-4">
                Protocolo / Veículo
              </th>
              <th scope="col" className="py-3 px-3">
                Anúncio
              </th>
              <th scope="col" className="py-3 px-3">
                Comprador
              </th>
              <th scope="col" className="py-3 px-3">
                Proprietário (Presencial)
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Situação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inquiries.map((item) => {
              const isSelected = selectedInquiryId === item.id;

              return (
                <tr
                  key={item.id}
                  data-testid={`inquiry-row-${item.id}`}
                  tabIndex={0}
                  onClick={() => onSelectInquiry(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectInquiry(item);
                    }
                  }}
                  className={`cursor-pointer transition-colors outline-none focus:bg-slate-100/70 ${
                    isSelected ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* Protocolo / Veículo */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 hover:text-red-600 transition-colors flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                      {item.vehicleTitle}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {item.id} • {item.vehiclePriceFormatted}
                    </div>
                  </td>

                  {/* Anúncio */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {item.advertisementId}
                    </span>
                  </td>

                  {/* Comprador */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-900">{item.buyerName}</div>
                    <div className="text-[11px] text-slate-400">{item.lastMessageDate}</div>
                  </td>

                  {/* Proprietário */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-900">{item.ownerName}</div>
                    <div className="text-[10px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                      <UserX className="w-3 h-3 text-amber-600" />
                      Sem conta cadastrada
                    </div>
                  </td>

                  {/* Situação */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {item.status === 'IN_MEDIATION' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {item.statusLabel}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        {item.statusLabel}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Warning Box Matching Figma ADM-D-043 */}
      <div
        data-testid="inquiry-table-warning"
        className="p-4 bg-amber-50/70 border-t border-amber-200/70 flex items-start gap-3"
      >
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950">
          <strong className="font-bold uppercase tracking-wide text-amber-900 block mb-0.5">
            DISCLOSURE DE MEDIAÇÃO INSTITUCIONAL (UI-041 / MSG-017)
          </strong>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Os anúncios legados pertencem a vendedores presenciais da feira sem conta na plataforma.
            O operador atua exclusivamente como representante institucional da Feira de Carros para
            viabilizar o contato comercial. É expressamente vedado personificar o proprietário do
            veículo.
          </p>
        </div>
      </div>
    </div>
  );
}
