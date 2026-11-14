'use client';

import type { ReportStatus } from '@/lib/types/moderation-presentation';

interface ReportStatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<ReportStatus, { label: string; className: string }> = {
  UNDER_REVIEW: {
    label: 'Em análise',
    className: 'bg-amber-100 text-amber-800 border border-amber-200',
  },
  CORRECTION_REQUESTED: {
    label: 'Correção',
    className: 'bg-blue-100 text-blue-800 border border-blue-200',
  },
  RESOLVED_NO_ACTION: {
    label: 'Encerrado',
    className: 'bg-slate-100 text-slate-700 border border-slate-200',
  },
  RESOLVED_ACTION_TAKEN: {
    label: 'Medida aplicada',
    className: 'bg-red-100 text-red-800 border border-red-200',
  },
  PENDING_EVIDENCE: {
    label: 'Aguardando evidência',
    className: 'bg-purple-100 text-purple-800 border border-purple-200',
  },
};

export function ReportStatusBadge({ status, size = 'sm' }: ReportStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.UNDER_REVIEW;
  const sizeClass = size === 'md' ? 'text-xs px-3 py-1' : 'text-[11px] px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap ${cfg.className} ${sizeClass}`}
      data-testid={`report-status-badge-${status}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {cfg.label}
    </span>
  );
}
