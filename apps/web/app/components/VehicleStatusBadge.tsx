import type { SellerListingStatus } from '@/lib/types/seller-presentation';
import { IconAlert, IconCard, IconCheck, IconClock } from './SellerIcons';

interface VehicleStatusBadgeProps {
  status: SellerListingStatus;
  label?: string;
}

export function VehicleStatusBadge({ status, label }: VehicleStatusBadgeProps) {
  switch (status) {
    case 'PUBLISHED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f8ef] text-[#159055]">
          <IconCheck className="size-3.5 stroke-[3]" />
          <span>{label || 'Publicado'}</span>
        </span>
      );

    case 'PENDING_REVIEW':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff2da] text-[#b86a0b]">
          <IconClock className="size-3.5" />
          <span>{label || 'Em análise'}</span>
        </span>
      );

    case 'CORRECTION_REQUESTED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff3dc] text-[#c41217]">
          <IconAlert className="size-3.5" />
          <span>{label || 'Correção solicitada'}</span>
        </span>
      );

    case 'REVISED_PENDING':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff3dc] text-[#b37406]">
          <IconClock className="size-3.5" />
          <span>{label || 'Em revisão'}</span>
        </span>
      );

    case 'PENDING_PAYMENT':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff2da] text-[#b86a0b]">
          <IconCard className="size-3.5" />
          <span>{label || 'Aguardando pagamento'}</span>
        </span>
      );

    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#b91c1c]">
          <span>{label || 'Rejeitado'}</span>
        </span>
      );

    case 'SOLD':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f3f4f6] text-[#4b5563]">
          <span>{label || 'Vendido'}</span>
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          <span>{label || status}</span>
        </span>
      );
  }
}
