'use client';

import { IconEye, IconPin, IconTrendingUp } from '@/app/components/SellerIcons';
import type { DealerInventoryMetrics } from '@/lib/adapters/mock-dealer-inventory';
import React from 'react';

interface DealerInventoryMetricsCardsProps {
  metrics: DealerInventoryMetrics;
}

export function DealerInventoryMetricsCards({ metrics }: DealerInventoryMetricsCardsProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      data-testid="dealer-metrics-container"
    >
      {/* Metric 1: Visualizações Totais */}
      <div className="bg-white border border-[#dee6f1] rounded-[12px] p-5 shadow-xs flex flex-col justify-between hover:border-[#cbd5e1] transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-medium text-[#697a95]">Visualizações totais</span>
          <div className="size-10 rounded-lg bg-[#eaf3ff] text-[#2265bb] flex items-center justify-center shrink-0">
            <IconEye className="size-5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-[28px] sm:text-[32px] font-bold text-[#17243f] tracking-tight"
              data-testid="metric-total-views"
            >
              {metrics.totalViews.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#065f46]">
              +18% este mês
            </span>
          </div>
          <p className="text-[12px] text-[#697a95] mt-1">Visualizações dos seus anúncios</p>
        </div>
      </div>

      {/* Metric 2: Visualizações Hoje */}
      <div className="bg-white border border-[#dee6f1] rounded-[12px] p-5 shadow-xs flex flex-col justify-between hover:border-[#cbd5e1] transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-medium text-[#697a95]">Visualizações hoje</span>
          <div className="size-10 rounded-lg bg-[#eaf3ff] text-[#2265bb] flex items-center justify-center shrink-0">
            <IconTrendingUp className="size-5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-[28px] sm:text-[32px] font-bold text-[#17243f] tracking-tight"
              data-testid="metric-views-today"
            >
              {metrics.viewsToday.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#1d4ed8]">
              Últimas 24h
            </span>
          </div>
          <p className="text-[12px] text-[#697a95] mt-1">
            Acessos registrados nas últimas 24 horas
          </p>
        </div>
      </div>

      {/* Metric 3: Origem dos Visitantes */}
      <div className="bg-white border border-[#dee6f1] rounded-[12px] p-5 shadow-xs flex flex-col justify-between hover:border-[#cbd5e1] transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-medium text-[#697a95]">Origem dos visitantes</span>
          <div className="size-10 rounded-lg bg-[#eaf3ff] text-[#2265bb] flex items-center justify-center shrink-0">
            <IconPin className="size-5" />
          </div>
        </div>
        <div>
          <p
            className="text-[17px] sm:text-[19px] font-bold text-[#17243f] tracking-tight truncate"
            data-testid="metric-top-origins"
          >
            {metrics.topOriginsLabel}
          </p>
          <p className="text-[12px] text-[#697a95] mt-1">
            Principais cidades que acessaram seus anúncios
          </p>
        </div>
      </div>
    </div>
  );
}
