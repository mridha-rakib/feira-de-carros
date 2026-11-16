import { Banknote, CreditCard, QrCode } from 'lucide-react';
import type * as React from 'react';
import type { PaymentMethod } from '../../../lib/types/finance-presentation';

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
  size?: 'sm' | 'md';
}

export function PaymentMethodBadge({ method, size = 'sm' }: PaymentMethodBadgeProps) {
  const config = {
    PIX: {
      label: 'Pix Instantâneo',
      bg: 'bg-teal-50 text-teal-800 border-teal-200/80',
      icon: QrCode,
    },
    CREDIT_CARD: {
      label: 'Cartão de Crédito',
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
      icon: CreditCard,
    },
    CASH: {
      label: 'Dinheiro (Balcão)',
      bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      icon: Banknote,
    },
  }[method] || {
    label: method,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Banknote,
  };

  const Icon = config.icon;
  const sizeClasses =
    size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border whitespace-nowrap ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />
      <span>{config.label}</span>
    </span>
  );
}
