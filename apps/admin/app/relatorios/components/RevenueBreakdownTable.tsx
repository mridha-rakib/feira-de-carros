'use client';

import { CheckCircle2, FileSpreadsheet, Lock } from 'lucide-react';
import * as React from 'react';
import { formatBrl, mockRevenueReport } from '../../../lib/adapters/mock-finance-data';

export function RevenueBreakdownTable() {
  const data = mockRevenueReport.monthlyData;
  const totalRevenue = mockRevenueReport.totalConfirmedRevenueBrl;

  const totalPlans = data.reduce((acc, curr) => acc + curr.plansAmountBrl, 0);
  const totalBoosts = data.reduce((acc, curr) => acc + curr.boostsAmountBrl, 0);

  return (
    <div
      data-testid="revenue-breakdown-table-container"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden space-y-0"
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Detalhamento Contábil Mensal por Categoria de Serviço
          </h3>
          <p className="text-xs text-slate-500">
            Segregação de receita entre planos recorrentes de publicação e contratações avulsas de
            destaque.
          </p>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          6 competências auditadas
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Competência / Mês</th>
              <th className="py-3 px-4">Planos de Anúncio</th>
              <th className="py-3 px-4">Destaques / Boosts</th>
              <th className="py-3 px-4">Anúncios no Período</th>
              <th className="py-3 px-4">Receita Confirmada</th>
              <th className="py-3 px-4">Participação</th>
              <th className="py-3 px-4 text-right">Status Contábil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => {
              const sharePercent = ((row.amountBrl / totalRevenue) * 100).toFixed(1);

              return (
                <tr
                  key={row.monthKey}
                  data-testid={`revenue-row-${row.monthKey}`}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{row.monthLabel} 2026</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Ref {row.monthKey}</span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {formatBrl(row.plansAmountBrl)}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-amber-700">
                    {formatBrl(row.boostsAmountBrl)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    {row.activeAdsCount} veículos
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    {formatBrl(row.amountBrl)}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-red-600 rounded-full"
                          style={{ width: `${sharePercent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">{sharePercent}%</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Auditado</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-900 text-xs">
              <td className="py-3.5 px-4 uppercase tracking-wider">Total Acumulado</td>
              <td className="py-3.5 px-4 text-slate-800">{formatBrl(totalPlans)}</td>
              <td className="py-3.5 px-4 text-amber-800">{formatBrl(totalBoosts)}</td>
              <td className="py-3.5 px-4 text-slate-800 font-mono">
                {mockRevenueReport.activeAdvertisementsCount} ativos
              </td>
              <td className="py-3.5 px-4 text-red-600 font-black text-sm">
                {formatBrl(totalRevenue)}
              </td>
              <td className="py-3.5 px-4 text-slate-700">100.0%</td>
              <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500">
                Homologado
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
