'use client';

import { BarChart3, LineChart } from 'lucide-react';
import * as React from 'react';
import { formatBrl, mockRevenueReport } from '../../../lib/adapters/mock-finance-data';
import type { RevenueMonthlyMetric } from '../../../lib/types/finance-presentation';

type ChartMode = 'bar' | 'area';

export function RevenueChart() {
  const [chartMode, setChartMode] = React.useState<ChartMode>('bar');
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const data = mockRevenueReport.monthlyData;
  const maxVal = 13000; // max Y reference

  // Dimensions
  const svgWidth = 680;
  const svgHeight = 240;
  const paddingLeft = 55;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Coordinate helpers
  const getX = (index: number) => {
    return paddingLeft + (index + 0.5) * (chartWidth / data.length);
  };

  const getY = (value: number) => {
    return paddingTop + chartHeight - (value / maxVal) * chartHeight;
  };

  // Build points for Area/Line
  const points = data.map((d, i) => `${getX(i)},${getY(d.amountBrl)}`).join(' ');
  const areaPath = `M ${getX(0)},${paddingTop + chartHeight} L ${points} L ${getX(
    data.length - 1,
  )},${paddingTop + chartHeight} Z`;
  const linePath = `M ${points}`;

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div
      data-testid="revenue-chart-container"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4"
    >
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Evolução Mensal da Receita Confirmada
          </h2>
          <p className="text-xs text-slate-500">
            Taxas de anúncios e destaques de veículos (Maio – Outubro 2026)
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('bar')}
            data-testid="chart-mode-bar-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartMode === 'bar'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Barras</span>
          </button>
          <button
            type="button"
            onClick={() => setChartMode('area')}
            data-testid="chart-mode-area-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartMode === 'area'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Área / Curva</span>
          </button>
        </div>
      </div>

      {/* Responsive SVG Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label="Gráfico de evolução da receita mensal"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y-axis labels */}
          {[0, 3000, 6000, 9000, 12000].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray={val === 0 ? undefined : '4 4'}
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val === 0 ? 'R$ 0' : `R$ ${val / 1000}k`}
                </text>
              </g>
            );
          })}

          {/* Render Area Mode */}
          {chartMode === 'area' && (
            <>
              <path d={areaPath} fill="url(#areaGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Data Points / Bars */}
          {data.map((item, index) => {
            const cx = getX(index);
            const cy = getY(item.amountBrl);
            const barWidth = 36;
            const barHeight = paddingTop + chartHeight - cy;
            const isHovered = hoveredIndex === index;

            return (
              <g
                key={item.monthKey}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Bar Mode representation */}
                {chartMode === 'bar' && (
                  <rect
                    x={cx - barWidth / 2}
                    y={cy}
                    width={barWidth}
                    height={barHeight}
                    rx="6"
                    fill={isHovered ? '#991b1b' : 'url(#barGradient)'}
                    className="transition-colors duration-200"
                  />
                )}

                {/* Point circle for Area mode */}
                {chartMode === 'area' && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 6 : 4}
                    fill="#ffffff"
                    stroke="#dc2626"
                    strokeWidth={isHovered ? 3 : 2}
                    className="transition-all duration-200"
                  />
                )}

                {/* Amount text over the bar/point */}
                <text
                  x={cx}
                  y={cy - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#991b1b' : '#334155'}
                  fontSize="10"
                  fontWeight="bold"
                >
                  {formatBrl(item.amountBrl)}
                </text>

                {/* X-axis Month Label */}
                <text
                  x={cx}
                  y={paddingTop + chartHeight + 18}
                  textAnchor="middle"
                  fill={isHovered ? '#0f172a' : '#64748b'}
                  fontSize="11"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {item.monthLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredItem && (
          <div
            data-testid="chart-hover-tooltip"
            className="mt-3 p-3 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Mês Auditado
              </span>
              <strong className="text-white text-sm">{hoveredItem.monthLabel} 2026</strong>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Total Confirmado
              </span>
              <span className="text-emerald-400 font-extrabold text-sm">
                {formatBrl(hoveredItem.amountBrl)}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Planos de Anúncio
              </span>
              <span className="text-slate-200 font-medium">
                {formatBrl(hoveredItem.plansAmountBrl)}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Destaques / Boosts
              </span>
              <span className="text-amber-400 font-medium">
                {formatBrl(hoveredItem.boostsAmountBrl)}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Anúncios Ativos
              </span>
              <span className="text-slate-300 font-medium">
                {hoveredItem.activeAdsCount} veículos
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
