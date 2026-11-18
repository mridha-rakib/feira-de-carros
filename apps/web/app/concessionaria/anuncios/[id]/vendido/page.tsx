'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowLeft,
  IconBan,
  IconCheck,
  IconEye,
  IconInfo,
  IconShield,
} from '@/app/components/SellerIcons';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import { useDealerInventoryStore } from '@/stores/use-dealer-inventory-store';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

export default function DealerSoldListingPage() {
  const params = useParams();
  const listingId = (params?.id as string) || 'dlr-veh-001';

  const { getVehicleById, markAsSold } = useDealerInventoryStore();
  const vehicle = getVehicleById(listingId);

  const [confirmedCheck, setConfirmedCheck] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
        <MarketplaceHeader />
        <DealershipSubNav activeItem="concessionarias" />
        <main className="flex-1 max-w-[800px] w-full mx-auto px-4 py-16 text-center">
          <div className="bg-white border border-[#dee6f1] rounded-[16px] p-8 shadow-xs">
            <h1 className="text-[22px] font-bold text-[#17243f]">Veículo não encontrado</h1>
            <p className="text-[14px] text-[#697a95] mt-2 mb-6">
              O veículo solicitado ({listingId}) não foi localizado no estoque.
            </p>
            <Link
              href="/concessionaria/anuncios"
              className="px-6 py-2.5 bg-[#b91c1c] text-white font-semibold text-[13px] rounded-[8px]"
            >
              Voltar ao estoque
            </Link>
          </div>
        </main>
        <MarketplaceFooter />
      </div>
    );
  }

  const handleConfirmSold = () => {
    if (!confirmedCheck) return;
    markAsSold(listingId);
    setIsSuccess(true);
  };

  // SUCCESS SCREEN
  if (isSuccess || vehicle.status === 'sold') {
    return (
      <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
        <MarketplaceHeader />
        <DealershipSubNav activeItem="concessionarias" />

        <main className="flex-1 max-w-[720px] w-full mx-auto px-4 sm:px-6 py-16 text-center">
          <div
            className="bg-white border border-[#dee6f1] rounded-[16px] p-8 shadow-md"
            data-testid="sold-success-card"
          >
            <div className="size-16 rounded-full bg-[#ecfdf5] border-2 border-[#a7f3d0] text-[#059669] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <IconCheck className="size-8 stroke-[3]" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669] px-3 py-1 rounded-full bg-[#ecfdf5] border border-[#a7f3d0]">
              Baixa de Estoque Concluída
            </span>

            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#17243f] mt-3">
              Veículo Marcado como Vendido!
            </h1>
            <p className="text-[14px] text-[#697a95] mt-2 max-w-[500px] mx-auto leading-relaxed">
              O anúncio do veículo{' '}
              <strong>
                {vehicle.make} {vehicle.model}
              </strong>{' '}
              ({vehicle.plate}) foi arquivado e retirado da vitrine pública e do showroom da
              concessionária.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/concessionaria/anuncios"
                data-testid="btn-sold-return-inventory"
                className="px-6 py-3 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[8px] transition-colors shadow-xs"
              >
                Retornar ao estoque
              </Link>
            </div>
          </div>
        </main>

        <MarketplaceFooter />
      </div>
    );
  }

  // CONFIRMATION FORM (Figma WEB-038 / 773:638)
  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[12px] text-[#697a95] mb-4">
          <Link href="/" className="hover:text-[#17243f] transition-colors">
            Início
          </Link>
          <span>›</span>
          <Link href="/concessionaria/anuncios" className="hover:text-[#17243f] transition-colors">
            Estoque
          </Link>
          <span>›</span>
          <span className="font-semibold text-[#17243f]">Baixa de Veículo</span>
        </div>

        <div className="bg-white border border-[#dee6f1] rounded-[16px] p-6 sm:p-8 shadow-xs">
          {/* Header Warning Icon */}
          <div className="flex items-start gap-4 pb-6 border-b border-[#f1f5f9]">
            <div className="size-12 rounded-xl bg-[#fef2f2] text-[#b91c1c] flex items-center justify-center shrink-0">
              <IconBan className="size-6" />
            </div>
            <div>
              <h1 className="text-[22px] sm:text-[24px] font-bold text-[#17243f]">
                Confirmar Venda do Veículo
              </h1>
              <p className="text-[13px] text-[#697a95] mt-1 leading-relaxed">
                Ao registrar que o veículo foi vendido, ele será desativado das buscas públicas do
                marketplace.
              </p>
            </div>
          </div>

          {/* Vehicle Summary Card */}
          <div className="my-6 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] flex items-center gap-4">
            <div className="relative size-20 rounded-[8px] overflow-hidden bg-gray-100 shrink-0 border border-[#dee6f1]">
              <Image
                src={vehicle.imageUrl}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#17243f]">
                {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-[12px] text-[#697a95]">{vehicle.version}</p>
              <p className="text-[14px] font-bold text-[#17243f] mt-1">
                {vehicle.formattedPrice} ·{' '}
                <span className="font-mono text-[12px] text-[#475569]">{vehicle.plate}</span>
              </p>
            </div>
          </div>

          {/* Consequences Callout (VEH-020 / MSG-015) */}
          <div className="space-y-3 p-4 bg-[#fffbeb] border border-[#fef3c7] rounded-[12px] text-[13px] text-[#92400e] mb-6">
            <div className="flex items-center gap-2 font-bold text-[#b45309]">
              <IconInfo className="size-4 shrink-0" />
              <span>O que acontece ao marcar o veículo como vendido:</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-[12px] text-[#78350f] pl-1">
              <li>
                O veículo é removido imediatamente da busca pública e do showroom da concessionária
                (`VEH-020`).
              </li>
              <li>
                Conversas ativas de compradores interessados são arquivadas em modo somente leitura
                (`MSG-015`).
              </li>
              <li>
                O histórico de métricas permanece consolidado no seu relatório analítico
                (`ANA-001`).
              </li>
            </ul>
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-3 p-4 rounded-[10px] border border-[#d2dce8] bg-[#f8fafc] cursor-pointer hover:bg-white transition-colors mb-6">
            <input
              type="checkbox"
              checked={confirmedCheck}
              onChange={(e) => setConfirmedCheck(e.target.checked)}
              data-testid="checkbox-confirm-sold"
              className="mt-0.5 size-4 text-[#b91c1c] rounded border-gray-300 focus:ring-[#b91c1c]"
            />
            <span className="text-[13px] text-[#17243f] leading-snug">
              Declaro que a venda deste veículo foi concluída e confirmo sua baixa definitiva do
              estoque público da concessionária.
            </span>
          </label>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#dee6f1]">
            <Link
              href="/concessionaria/anuncios"
              className="px-4 py-2 text-[13px] font-semibold text-[#697a95] hover:text-[#17243f] transition-colors"
            >
              Cancelar e voltar
            </Link>

            <button
              type="button"
              onClick={handleConfirmSold}
              disabled={!confirmedCheck}
              data-testid="btn-submit-sold"
              className="px-6 py-3 bg-[#b91c1c] hover:bg-[#991b1b] disabled:opacity-50 text-white font-semibold text-[14px] rounded-[8px] transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              Confirmar baixa do veículo
            </button>
          </div>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
