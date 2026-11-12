'use client';

import { Download, FileSpreadsheet } from 'lucide-react';
import * as React from 'react';
import { formatBrl, mockRevenueReport } from '../../../lib/adapters/mock-finance-data';

export function DemoCsvExportButton() {
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);

  const handleExportCsv = () => {
    const data = mockRevenueReport.monthlyData;

    const headers = [
      'Competencia',
      'Mes',
      'Planos_BRL',
      'Destaques_BRL',
      'Anuncios_Ativos',
      'Receita_Confirmada_BRL',
      'Proveniencia',
    ];

    const rows = data.map((d) => [
      d.monthKey,
      d.monthLabel,
      d.plansAmountBrl.toFixed(2),
      d.boostsAmountBrl.toFixed(2),
      d.activeAdsCount,
      d.amountBrl.toFixed(2),
      'DEMO DATA - Amostra Ilustrativa B4B (Figma ADM-D-031)',
    ]);

    const csvContent = [
      '# Feira de Carros - Relatorio de Receita Mensal (Figma ADM-D-031)',
      `# Total Auditado: R$ ${mockRevenueReport.totalConfirmedRevenueBrl.toFixed(2)} | Periodo: ${mockRevenueReport.periodLabel}`,
      '# NOTA: Dados estritamente demonstrativos. Vendas de veiculos nao intermediadas financeiramente.',
      headers.join(';'),
      ...rows.map((r) => r.join(';')),
    ].join('\r\n');

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'relatorio-receita-feira-de-carros-demo-2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="flex items-center gap-2">
      {downloadSuccess && (
        <span
          data-testid="csv-export-success-badge"
          className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg animate-fade-in"
        >
          CSV Ilustrativo baixado com sucesso!
        </span>
      )}

      <button
        type="button"
        onClick={handleExportCsv}
        data-testid="export-csv-btn"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-colors"
        title="Exportar planilha analítica demonstrativa (CSV)"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
        <span>Exportar Relatório CSV (DEMO)</span>
      </button>
    </div>
  );
}
