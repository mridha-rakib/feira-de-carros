'use client';

import { ChevronDown } from 'lucide-react';
import * as React from 'react';
import type { RevenueChartPoint } from '../../lib/types/dashboard-presentation';

interface DashboardRevenueChartProps {
  data: RevenueChartPoint[];
}

export function DashboardRevenueChart({ data }: DashboardRevenueChartProps) {
  const [selectedPeriod] = React.useState('Últimos 6 meses');
  const maxValue = Math.max(...data.map((d) => d.value), 50000);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Receita dos anúncios
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pagamentos de planos e impulsionamentos confirmados • Valores ilustrativos
          </p>
        </div>

        {/* Period Selector Dropdown (Figma ADM-D-002) */}
        <div className="relative inline-block text-left self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization (5 Monthly Columns from Figma) */}
      <div className="pt-8 pb-2">
        <div className="flex items-end justify-between gap-4 h-48 px-2 sm:px-6">
          {data.map((point) => {
            const heightPercent = Math.max(15, Math.round((point.value / maxValue) * 100));

            return (
              <div key={point.month} className="flex-1 flex flex-col items-center gap-2 group">
                {/* Bar */}
                <div className="w-full max-w-[56px] bg-slate-100 rounded-t-lg relative flex items-end h-40">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-red-300 group-hover:bg-red-400 rounded-t-lg transition-all duration-300 relative"
                  >
                    {/* Hover Value Tooltip */}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold py-0.5 px-1.5 rounded shadow pointer-events-none whitespace-nowrap">
                      {point.label}
                    </span>
                  </div>
                </div>

                {/* Month Label */}
                <span className="text-xs font-medium text-slate-500 group-hover:text-slate-900 transition-colors">
                  {point.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
