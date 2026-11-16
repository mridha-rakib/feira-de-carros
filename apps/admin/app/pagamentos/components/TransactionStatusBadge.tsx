import { AlertCircle, CheckCircle2, Clock, RotateCcw, ShieldAlert } from 'lucide-react';
import type * as React from 'react';
import type { PaymentStatus } from '../../../lib/types/finance-presentation';

interface TransactionStatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md';
}

export function TransactionStatusBadge({ status, size = 'sm' }: TransactionStatusBadgeProps) {
  const config = {
    CONFIRMED: {
      label: 'Confirmado',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      icon: CheckCircle2,
    },
    PENDING: {
      label: 'Pendente',
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      icon: Clock,
    },
    FAILED: {
      label: 'Falhou',
      bg: 'bg-red-50 text-red-700 border-red-200/80',
      icon: AlertCircle,
    },
    IN_DISPUTE: {
      label: 'Em contestação',
      bg: 'bg-purple-50 text-purple-700 border-purple-200/80',
      icon: ShieldAlert,
    },
    REFUNDED: {
      label: 'Reembolsado',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: RotateCcw,
    },
  }[status] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
  };

  const Icon = config.icon;
  const sizeClasses =
    size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border whitespace-nowrap ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />
      <span>{config.label}</span>
    </span>
  );
}
