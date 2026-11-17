'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconBan,
  IconCheck,
  IconEye,
  IconFile,
  IconInfo,
  IconShield,
  IconStar,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getSellerListingById } from '@/lib/adapters/seller-listings-adapter';
import type { SellerListingDetail } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SoldListingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;

  const [listing] = useState<SellerListingDetail | null>(
    () => getSellerListingById(listingId) || null,
  );

  const [confirmedOwner, setConfirmedOwner] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
        <SellerNavbar variant="seller" activeTab="anuncios" />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 py-12">
          <div className="bg-white border border-[#d6dfea] rounded-[16px] p-8 max-w-[600px] mx-auto text-center shadow-sm">
            <div className="size-16 rounded-full bg-[#fef2f2] text-[#c41217] flex items-center justify-center mx-auto mb-4">
              <IconAlert className="size-8" />
            </div>
            <h1 className="text-[22px] font-bold text-[#111827] mb-2">Anúncio não encontrado</h1>
            <p className="text-[14px] text-[#596679] mb-6">
              O anúncio solicitado ({listingId}) não existe ou não pertence à sua conta de vendedor.
            </p>
            <Link
              href="/vendedor/anuncios"
              className="inline-flex items-center gap-2 px-6 h-[46px] rounded-[10px] bg-[#c41217] text-white font-semibold text-[14px] hover:bg-[#a81014] transition-colors"
            >
              <IconArrowLeft className="size-4" />
              Voltar para Meus Anúncios
            </Link>
          </div>
        </main>
        <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
      </div>
    );
  }

  const handleConfirmSold = () => {
    if (!confirmedOwner) return;
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
      <SellerNavbar variant="seller" activeTab="anuncios" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[
            { label: 'Meus anúncios', href: '/vendedor/anuncios' },
            { label: listing.title, href: `/vendedor/anuncios/${listing.id}` },
            { label: 'Finalizar anúncio' },
          ]}
        />

        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#111827]">
              Finalizar anúncio como vendido
            </h1>
            <p className="text-[14px] text-[#596679] mt-1">
              Confirme a venda do seu próprio veículo antes de retirá-lo da plataforma.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[12px] font-mono text-[#596679] block">
              Rota: /vendedor/anuncios/[id]/vendido
            </span>
            <span className="text-[11px] text-[#16a34a] font-semibold">
              WEB-038 • DEMO VENDEDOR
            </span>
          </div>
        </div>

        {/* Ownership Restriction Warning Banner (Figma 2802:2287) */}
        <div className="bg-[#fff2dd] border border-[#fed7aa] rounded-[12px] p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#ffedd5] text-[#b45309] shrink-0 mt-0.5">
            <IconAlert className="size-5" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#92400e]">
              Ação importante e restrita ao proprietário
            </h3>
            <p className="text-[13px] text-[#92400e]/90 mt-0.5 leading-relaxed">
              Confirme apenas uma venda realmente concluída fora da plataforma. Esta ação remove o
              anúncio da vitrine pública e desativa o impulsionamento.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="bg-white border border-[#bbf7d0] rounded-[16px] p-8 text-center shadow-sm max-w-[700px] mx-auto space-y-4">
            <div className="size-16 rounded-full bg-[#ecfdf5] text-[#16a34a] flex items-center justify-center mx-auto">
              <IconCheck className="size-8" />
            </div>
            <h2 className="text-[22px] font-bold text-[#111827]">
              Anúncio finalizado com sucesso!
            </h2>
            <p className="text-[14px] text-[#596679] max-w-[500px] mx-auto">
              O veículo <strong>{listing.title}</strong> foi marcado como vendido na simulação. Ele
              foi removido da vitrine pública de buscas.
            </p>
            <div className="pt-4">
              <Link
                href="/vendedor/anuncios"
                className="inline-flex items-center gap-2 px-6 h-[46px] rounded-[10px] bg-[#c41217] text-white font-semibold text-[14px] hover:bg-[#a81014] transition-colors"
              >
                <IconArrowLeft className="size-4" />
                Voltar para Meus Anúncios
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Confirmation Form (Figma 2802:2292) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-[#d6dfea] rounded-[16px] p-5 sm:p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-[18px] font-bold text-[#111827]">
                    Confirme a venda do veículo
                  </h2>
                  <p className="text-[13px] text-[#596679] mt-1">
                    Veja o anúncio e confira o que acontecerá após a confirmação.
                  </p>
                </div>

                {/* Vehicle Card Summary */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-[12px] bg-[#f8fafc] border border-[#e2e8f0]">
                  <div className="relative w-full sm:w-[180px] h-[110px] rounded-[8px] overflow-hidden bg-gray-200 shrink-0">
                    <Image
                      src={listing.imageUrl || '/images/vehicles/demo/web027-nivus.png'}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <h3 className="text-[16px] font-bold text-[#111827]">{listing.title}</h3>
                    <p className="text-[13px] text-[#596679]">
                      {listing.id} • {listing.city}/{listing.state}
                    </p>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#166534] text-[12px] font-semibold border border-[#bbf7d0]">
                        <IconCheck className="size-3.5" />
                        Publicado (demo)
                      </span>
                    </div>
                  </div>
                </div>

                {/* What Happens Section (Figma 2802:2308) */}
                <div className="space-y-3">
                  <h4 className="text-[15px] font-bold text-[#111827]">
                    O que acontecerá com o anúncio?
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-[12px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                      <div className="flex items-center gap-2 text-[#c41217]">
                        <IconBan className="size-4" />
                        <span className="text-[13px] font-bold text-[#111827]">Publicação</span>
                      </div>
                      <p className="text-[12px] text-[#596679] leading-tight">
                        Retirada imediata da busca e vitrine de resultados.
                      </p>
                    </div>

                    <div className="p-4 rounded-[12px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                      <div className="flex items-center gap-2 text-[#b45309]">
                        <IconStar className="size-4" />
                        <span className="text-[13px] font-bold text-[#111827]">Destaque</span>
                      </div>
                      <p className="text-[12px] text-[#596679] leading-tight">
                        Boost encerrado sem estorno automático de dias restantes.
                      </p>
                    </div>

                    <div className="p-4 rounded-[12px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                      <div className="flex items-center gap-2 text-[#2563eb]">
                        <IconEye className="size-4" />
                        <span className="text-[13px] font-bold text-[#111827]">Mensagens</span>
                      </div>
                      <p className="text-[12px] text-[#596679] leading-tight">
                        Conversas vinculadas passam a ficar em modo somente leitura.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notice Box: No Sold Public Badge (Figma 2802:2326) */}
                <div className="p-4 rounded-[12px] bg-[#f0f9ff] border border-[#bae6fd] flex items-start gap-3">
                  <IconInfo className="size-5 text-[#0284c7] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[13px] font-bold text-[#0369a1]">
                      Sem selo público “Vendido”
                    </h5>
                    <p className="text-[12px] text-[#0369a1]/90 mt-0.5 leading-relaxed">
                      O anúncio será removido da vitrine após confirmação. A plataforma não exibe
                      selos de venda públicos para proteger a privacidade das partes negociantes.
                    </p>
                  </div>
                </div>

                {/* Checkbox Section (Figma 2802:2333) */}
                <div className="pt-2 border-t border-[#e2e8f0] space-y-3">
                  <label className="flex items-start gap-3 p-3.5 rounded-[12px] bg-[#f8fafc] border border-[#cbd5e1] cursor-pointer hover:bg-white transition-colors">
                    <input
                      type="checkbox"
                      checked={confirmedOwner}
                      onChange={(e) => setConfirmedOwner(e.target.checked)}
                      className="size-5 rounded border-gray-300 text-[#c41217] focus:ring-[#c41217] mt-0.5 cursor-pointer"
                    />
                    <div>
                      <span className="text-[13px] font-bold text-[#111827] block">
                        Confirmo que sou o proprietário e a venda do veículo foi concluída fora da
                        plataforma.
                      </span>
                      <span className="text-[12px] text-[#64748b] block mt-0.5">
                        Este conceito não registra nenhuma venda real nem realiza transferência
                        documental de propriedade veicular.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#e2e8f0]">
                  <Link
                    href={`/vendedor/anuncios/${listing.id}`}
                    className="w-full sm:w-auto px-5 h-[46px] rounded-[10px] border border-[#cbd5e1] text-[#334155] font-semibold text-[14px] hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <IconArrowLeft className="size-4" />
                    Voltar aos meus anúncios
                  </Link>

                  <button
                    type="button"
                    onClick={handleConfirmSold}
                    disabled={!confirmedOwner}
                    className={`w-full sm:w-auto px-6 h-[46px] rounded-[10px] font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors ${
                      confirmedOwner
                        ? 'bg-[#c41217] hover:bg-[#a81014] text-white cursor-pointer shadow-sm'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <IconCheck className="size-4" />
                    Confirmar venda (simulação)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Action Summary & Policy Rules (Figma 2802:2346) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <IconFile className="size-5 text-[#c41217]" />
                  <h4 className="text-[15px] font-bold text-[#111827]">Resumo da ação</h4>
                </div>

                <div className="space-y-3 text-[13px]">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#64748b]">Código</span>
                    <span className="font-semibold text-[#111827]">{listing.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#64748b]">Veículo</span>
                    <span className="font-semibold text-[#111827] text-right truncate max-w-[200px]">
                      {listing.title}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#64748b]">Vendedor</span>
                    <span className="font-semibold text-[#111827]">Mariana Silva</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#64748b]">Ação desejada</span>
                    <span className="font-semibold text-[#c41217]">Marcar venda</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#64748b]">Estado posterior</span>
                    <span className="font-semibold text-[#111827]">Removido da vitrine</span>
                  </div>
                </div>
              </div>

              {/* Shield Card: Antes de continuar */}
              <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#16a34a]">
                  <IconShield className="size-5" />
                  <h4 className="text-[14px] font-bold text-[#111827]">Antes de continuar</h4>
                </div>
                <p className="text-[12px] text-[#596679] leading-relaxed">
                  Verifique a titularidade, o estado do anúncio e confirme se não há pendências com
                  compradores em negociação ativa.
                </p>
              </div>

              {/* Info Card: Sem reversão automática */}
              <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#b45309]">
                  <IconInfo className="size-5" />
                  <h4 className="text-[14px] font-bold text-[#111827]">Sem reversão automática</h4>
                </div>
                <p className="text-[12px] text-[#596679] leading-relaxed">
                  A reativação depende de política aprovada e novo ciclo de publicação. Tenha
                  certeza da conclusão da venda antes de confirmar.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
