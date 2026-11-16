'use client';

import { ReportStatusBadge } from '@/app/moderacao/components/ReportStatusBadge';
import type { ReportRecord } from '@/lib/types/moderation-presentation';
import { ExternalLink } from 'lucide-react';
import * as React from 'react';

interface ReportTableProps {
  reports: ReportRecord[];
  selectedReportId: string | null;
  onSelectReport: (report: ReportRecord) => void;
  onNavigateDetail: (id: string) => void;
}

export function ReportTable({
  reports,
  selectedReportId,
  onSelectReport,
  onNavigateDetail,
}: ReportTableProps) {
  if (reports.length === 0) {
    return (
      <div
        data-testid="report-table-empty"
        className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-2xs"
      >
        <p className="text-sm font-semibold text-slate-700">Nenhuma denúncia encontrada</p>
        <p className="text-xs text-slate-500">Ajuste os filtros de busca para ver resultados.</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
      data-testid="report-table"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              <th className="py-3 px-4">Protocolo / Referência</th>
              <th className="py-3 px-4">Motivo</th>
              <th className="py-3 px-4">Recebido</th>
              <th className="py-3 px-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((report) => {
              const isSelected = report.id === selectedReportId;
              return (
                <tr
                  key={report.id}
                  tabIndex={0}
                  onClick={() => onSelectReport(report)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectReport(report);
                    }
                  }}
                  data-testid={`report-row-${report.id}`}
                  className={`cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 ${
                    isSelected
                      ? 'bg-red-50/60 border-l-4 border-l-red-600'
                      : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                  }`}
                >
                  {/* Protocol / Reference */}
                  <td className="py-3.5 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {report.id}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateDetail(report.id);
                        }}
                        data-testid={`navigate-detail-${report.id}`}
                        className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded"
                        title="Ver detalhes"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {report.adId ? `${report.adId} · ` : ''}
                      {report.vehicleTitle || report.sellerName}
                    </div>
                  </td>

                  {/* Motivo */}
                  <td className="py-3.5 px-4 text-xs text-slate-700">{report.categoryLabel}</td>

                  {/* Recebido */}
                  <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                    {report.reportedAt}
                  </td>

                  {/* Estado */}
                  <td className="py-3.5 px-4">
                    <ReportStatusBadge status={report.status} />
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
