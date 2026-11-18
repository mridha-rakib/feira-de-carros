'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowLeft,
  IconCalendar,
  IconCar,
  IconCheck,
  IconClock,
  IconCoin,
  IconEdit,
  IconEye,
  IconGauge,
  IconInfo,
  IconShield,
} from '@/app/components/SellerIcons';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import { useDealerInventoryStore } from '@/stores/use-dealer-inventory-store';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

export default function DealerRevisionComparisonPage() {
  const params = useParams();
  const listingId = (params?.id as string) || 'dlr-veh-001';

  const { getVehicleById } = useDealerInventoryStore();
  const vehicle = getVehicleById(listingId);

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

  const revision = vehicle.pendingRevision || {
    price: vehicle.price,
    formattedPrice: vehicle.formattedPrice,
    mileageKm: vehicle.mileageKm,
    description: vehicle.description || 'Descrição padrão cadastrada.',
    features: vehicle.features || ['Ar-condicionado', 'Direção elétrica', 'Vidros elétricos'],
    submittedAt: 'Aguardando envio',
  };

  const isPriceDifferent = revision.price !== vehicle.price;
  const isKmDifferent = revision.mileageKm !== vehicle.mileageKm;

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[1080px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
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
          <span className="font-semibold text-[#17243f]">Comparação de Revisão</span>
        </div>

        {/* Heading Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[24px] sm:text-[28px] font-bold text-[#17243f] tracking-tight">
                Comparação de Versões do Anúncio
              </h1>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#eaf3ff] text-[#2265bb] border border-[#bfdbfe]">
                Revisão Pendente (VEH-018)
              </span>
            </div>
            <p className="text-[14px] text-[#697a95] mt-1">
              {vehicle.make} {vehicle.model} {vehicle.version} ({vehicle.plate})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/concessionaria/anuncios/${vehicle.id}/editar`}
              data-testid="btn-edit-again"
              className="px-4 py-2 bg-white border border-[#dee6f1] hover:bg-[#f8fafc] text-[#17243f] font-semibold text-[13px] rounded-[8px] transition-colors flex items-center gap-1.5"
            >
              <IconEdit className="size-4" />
              <span>Editar novamente</span>
            </Link>
          </div>
        </div>

        {/* Governance banner */}
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[12px] p-4 mb-6 flex items-start gap-3">
          <IconShield className="size-5 text-[#2563eb] shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#1e40af] leading-relaxed">
            <p className="font-semibold">Status da Homologação de Alterações</p>
            <p className="mt-0.5 text-[12px] text-[#3b82f6]">
              A versão ativa permanece pública para compradores. Assim que a revisão proposta for
              homologada pela equipe de qualidade, os dados da vitrine serão sincronizados
              automaticamente.
            </p>
          </div>
        </div>

        {/* Side-by-side comparison grid (Figma WEB-035 / 698:622) */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          data-testid="revision-comparison-container"
        >
          {/* Card 1: Versão Ativa Atual */}
          <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#16a34a]" />
                  <h3 className="text-[16px] font-bold text-[#17243f]">
                    Versão Ativa no Marketplace
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e5f7ed] text-[#14865a]">
                  Publicado
                </span>
              </div>

              {/* Price */}
              <div className="p-4 bg-[#f8fafc] rounded-[10px] mb-4">
                <span className="text-[11px] text-[#8a99ad] font-bold uppercase tracking-wider block">
                  Preço Vigente
                </span>
                <p className="text-[26px] font-bold text-[#17243f] mt-0.5">
                  {vehicle.formattedPrice}
                </p>
              </div>

              {/* Specs */}
              <div className="space-y-3 text-[13px] mb-4">
                <div className="flex justify-between py-2 border-b border-[#f1f5f9]">
                  <span className="text-[#697a95]">Quilometragem:</span>
                  <span className="font-semibold text-[#17243f]">
                    {vehicle.mileageKm.toLocaleString('pt-BR')} km
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#f1f5f9]">
                  <span className="text-[#697a95]">Combustível:</span>
                  <span className="font-semibold text-[#17243f]">{vehicle.fuel}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#f1f5f9]">
                  <span className="text-[#697a95]">Câmbio:</span>
                  <span className="font-semibold text-[#17243f]">{vehicle.transmission}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#f1f5f9]">
                  <span className="text-[#697a95]">Plano ativo:</span>
                  <span className="font-semibold text-[#17243f]">{vehicle.planLabel}</span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <span className="text-[12px] font-semibold text-[#697a95] block mb-1">
                  Descrição vigente:
                </span>
                <p className="text-[12px] text-[#475569] leading-relaxed line-clamp-4">
                  {vehicle.description || 'Descrição padrão homologada na aprovação do anúncio.'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#f1f5f9] text-[11px] text-[#8a99ad]">
              Visualizações acumuladas:{' '}
              <strong>{vehicle.viewsCount.toLocaleString('pt-BR')}</strong>
            </div>
          </div>

          {/* Card 2: Proposta de Revisão */}
          <div className="bg-white border-2 border-[#bfdbfe] rounded-[14px] p-6 shadow-md flex flex-col justify-between relative ring-2 ring-[#eff6ff]">
            {/* Review pill */}
            <div className="absolute -top-3 right-6 bg-[#2563eb] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              Proposta em Análise
            </div>

            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#2563eb] animate-pulse" />
                  <h3 className="text-[16px] font-bold text-[#17243f]">Alterações Solicitadas</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#eaf3ff] text-[#2265bb]">
                  Em análise
                </span>
              </div>

              {/* Proposed Price with highlight */}
              <div
                className={`p-4 rounded-[10px] mb-4 ${
                  isPriceDifferent ? 'bg-[#fefce8] border border-[#fef08a]' : 'bg-[#f8fafc]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#8a99ad] font-bold uppercase tracking-wider block">
                    Novo Preço Proposto
                  </span>
                  {isPriceDifferent && (
                    <span className="text-[10px] font-bold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded">
                      Alterado
                    </span>
                  )}
                </div>
                <p
                  className="text-[26px] font-bold text-[#17243f] mt-0.5"
                  data-testid="proposed-price-text"
                >
                  {revision.formattedPrice}
                </p>
              </div>

              {/* Specs */}
              <div className="space-y-3 text-[13px] mb-4">
                <div
                  className={`flex justify-between py-2 border-b border-[#f1f5f9] ${
                    isKmDifferent ? 'bg-[#fefce8] px-2 rounded font-semibold text-[#b45309]' : ''
                  }`}
                >
                  <span className="text-[#697a95]">Quilometragem proposta:</span>
                  <span className="font-semibold text-[#17243f]">
                    {revision.mileageKm.toLocaleString('pt-BR')} km
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#f1f5f9]">
                  <span className="text-[#697a95]">Combustível:</span>
                  <span className="font-semibold text-[#17243f]">{vehicle.fuel}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#f1f5f9]">
                  <span className="text-[#697a95]">Câmbio:</span>
                  <span className="font-semibold text-[#17243f]">{vehicle.transmission}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#f1f5f9]">
                  <span className="text-[#697a95]">Data da proposta:</span>
                  <span className="font-semibold text-[#2563eb]">{revision.submittedAt}</span>
                </div>
              </div>

              {/* Proposed Description */}
              <div className="pt-2">
                <span className="text-[12px] font-semibold text-[#697a95] block mb-1">
                  Descrição proposta:
                </span>
                <p className="text-[12px] text-[#1e293b] leading-relaxed line-clamp-4">
                  {revision.description || 'Descrição padrão atualizada na revisão.'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#f1f5f9] text-[11px] text-[#2563eb] flex items-center gap-1.5">
              <IconClock className="size-3.5" />
              <span>Tempo médio de análise pela moderação: até 24 horas</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#dee6f1]">
          <Link
            href="/concessionaria/anuncios"
            data-testid="btn-back-to-inventory-from-revisoes"
            className="px-6 py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[13px] rounded-[8px] transition-colors flex items-center gap-2 shadow-xs"
          >
            <IconArrowLeft className="size-4" />
            <span>Voltar para o estoque</span>
          </Link>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
