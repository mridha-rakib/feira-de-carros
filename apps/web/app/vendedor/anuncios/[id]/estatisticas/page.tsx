'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconEye,
  IconInfo,
  IconMessageSquare,
  IconTrendingUp,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getListingAnalytics } from '@/lib/adapters/seller-analytics-adapter';
import { getSellerListingById } from '@/lib/adapters/seller-listings-adapter';
import type { ListingAnalyticsData, SellerListingDetail } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SellerAnalyticsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;

  const [listing] = useState<SellerListingDetail | null>(
    () => getSellerListingById(listingId) || null,
  );

  const [analytics] = useState<ListingAnalyticsData | null>(
    () => getListingAnalytics(listingId) || null,
  );

  const [showEmptyState, setShowEmptyState] = useState(false);

  if (!listing || !analytics) {
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
              O anúncio solicitado ({listingId}) não possui estatísticas disponíveis ou não pertence
              à sua conta.
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

  // Compute max daily views for proportional height calculation
  const maxViews = Math.max(...analytics.dailyMetrics.map((d) => d.detailViews), 1);

  return (
    <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
      <SellerNavbar variant="seller" activeTab="anuncios" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[
            { label: 'Início', href: '/vendedor/anuncios' },
            { label: 'Meus anúncios', href: '/vendedor/anuncios' },
            { label: listing.title, href: `/vendedor/anuncios/${listing.id}` },
            { label: 'Desempenho' },
          ]}
        />

        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#111827]">
              Desempenho do anúncio
            </h1>
            <p className="text-[14px] text-[#596679] mt-1">
              Acompanhe visualizações, impressões e interesse de compradores.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[12px] font-mono text-[#596679] block">
              Rota: /vendedor/anuncios/[id]/estatisticas
            </span>
            <span className="text-[11px] text-[#16a34a] font-semibold">WEB-039 • ANALYTICS</span>
          </div>
        </div>

        {/* Demo Notice Banner (Figma 775:692) */}
        <div className="bg-[#fff2dd] border border-[#fed7aa] rounded-[12px] p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#ffedd5] text-[#b45309] shrink-0 mt-0.5">
            <IconInfo className="size-5" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#92400e]">
              Números simulados — não são métricas reais (DEMO DATA)
            </h3>
            <p className="text-[13px] text-[#92400e]/90 mt-0.5 leading-relaxed">
              Os números apresentados abaixo são ilustrativos para validação visual do painel de
              desempenho. Em produção, os dados são agregados de forma anônima e segura.
            </p>
          </div>
        </div>

        {/* Selected Listing Card (Figma 775:695) */}
        <div className="bg-white border border-[#d6dfea] rounded-[16px] p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-[110px] h-[66px] rounded-[8px] overflow-hidden bg-gray-200 shrink-0">
              <Image
                src={listing.imageUrl || '/images/vehicles/demo/web027-nivus.png'}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#111827]">{listing.title}</h2>
              <p className="text-[13px] text-[#596679]">
                {listing.id} • {listing.city}/{listing.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="px-3.5 py-1.5 rounded-full bg-[#f1f5f9] text-[#475569] text-[12px] font-semibold border border-[#cbd5e1]">
              Últimos 7 dias (demo)
            </span>
            <button
              type="button"
              onClick={() => setShowEmptyState(!showEmptyState)}
              className="text-[12px] text-[#c41217] hover:underline font-medium"
            >
              {showEmptyState ? 'Ver com dados' : 'Ver sem dados'}
            </button>
          </div>
        </div>

        {/* 3 KPI Cards (Figma 775:702) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[13px] font-semibold">Impressões</span>
              <IconEye className="size-4 text-[#94a3b8]" />
            </div>
            <p className="text-[28px] font-bold text-[#111827]">
              {showEmptyState ? '0' : analytics.totalImpressions.toLocaleString('pt-BR')}
            </p>
            <p className="text-[12px] text-[#64748b]">
              Exibições na listagem de busca e na página inicial
            </p>
          </div>

          <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[13px] font-semibold">Visitas ao detalhe</span>
              <IconTrendingUp className="size-4 text-[#16a34a]" />
            </div>
            <p className="text-[28px] font-bold text-[#111827]">
              {showEmptyState ? '0' : analytics.totalDetailViews.toLocaleString('pt-BR')}
            </p>
            <p className="text-[12px] text-[#64748b]">Cliques na página completa do seu anúncio</p>
          </div>

          <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-[13px] font-semibold">Contatos iniciados</span>
              <IconMessageSquare className="size-4 text-[#2563eb]" />
            </div>
            <p className="text-[28px] font-bold text-[#111827]">
              {showEmptyState ? '0' : analytics.totalContactsStarted.toLocaleString('pt-BR')}
            </p>
            <p className="text-[12px] text-[#64748b]">Compradores que abriram conversa no chat</p>
          </div>
        </div>

        {/* Two Columns: Chart + Definitions (Figma 775:715) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Illustrative Bar Chart (Figma 775:716) */}
          <div className="lg:col-span-8 bg-white border border-[#d6dfea] rounded-[16px] p-5 sm:p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-[18px] font-bold text-[#111827]">
                Visualizações nos últimos 7 dias
              </h3>
              <p className="text-[13px] text-[#596679] mt-0.5">
                Distribuição diária de cliques no detalhe do anúncio.
              </p>
            </div>

            {showEmptyState ? (
              <div className="py-16 text-center space-y-2">
                <IconEye className="size-10 text-gray-300 mx-auto" />
                <p className="text-[14px] font-semibold text-[#64748b]">
                  Nenhum dado registrado para este período
                </p>
                <p className="text-[12px] text-[#94a3b8]">
                  O anúncio precisa receber visualizações para que as métricas comecem a aparecer.
                </p>
              </div>
            ) : (
              <div className="h-[220px] flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-4 border-b border-[#e2e8f0]">
                {analytics.dailyMetrics.map((day) => {
                  const heightPercent = Math.max(
                    Math.round((day.detailViews / maxViews) * 100),
                    15,
                  );
                  return (
                    <div
                      key={day.date}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                    >
                      <span className="text-[11px] font-bold text-[#111827] opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.detailViews}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[48px] rounded-t-[6px] bg-[#c41217] hover:bg-[#a81014] transition-all cursor-pointer relative"
                        title={`${day.dayLabel}: ${day.detailViews} visitas, ${day.impressions} impressões`}
                      />
                      <span className="text-[11px] font-medium text-[#64748b] whitespace-nowrap">
                        {day.dayLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between text-[12px] text-[#64748b]">
              <span>Métricas atualizadas diariamente às 00:00 (BRT)</span>
              <span className="font-semibold text-[#111827]">
                Média diária: {showEmptyState ? '0' : Math.round(analytics.totalDetailViews / 7)}{' '}
                visitas
              </span>
            </div>
          </div>

          {/* Right Column: Definitions & Privacy (Figma 775:717) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-4">
              <h4 className="text-[15px] font-bold text-[#111827]">Entenda as métricas</h4>

              <div className="p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                <span className="text-[13px] font-bold text-[#111827] block">
                  Impressões ≠ Visitas
                </span>
                <p className="text-[12px] text-[#64748b] leading-tight">
                  Impressões medem quantas vezes o card do carro apareceu nas buscas. Visitas
                  representam compradores que abriram a página completa.
                </p>
              </div>

              <div className="p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                <span className="text-[13px] font-bold text-[#111827] block">
                  Contatos iniciados
                </span>
                <p className="text-[12px] text-[#64748b] leading-tight">
                  Compradores reais que clicaram no botão de contato e iniciaram uma conversa pelo
                  chat interno seguro.
                </p>
              </div>

              <div className="p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                <span className="text-[13px] font-bold text-[#111827] block">
                  Privacidade e LGPD
                </span>
                <p className="text-[12px] text-[#64748b] leading-tight">
                  Nenhum dado pessoal identificável dos compradores é compartilhado neste painel.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEmptyState(!showEmptyState)}
                className="w-full py-2.5 rounded-[8px] border border-[#cbd5e1] text-[13px] font-semibold text-[#334155] hover:bg-gray-50 transition-colors"
              >
                {showEmptyState ? 'Exibir dados preenchidos' : 'Ver estado sem dados'}
              </button>
            </div>

            <div className="p-4 rounded-[12px] bg-[#e9f3ff] border border-[#d6dfea] text-[12px] text-[#1e40af] leading-relaxed">
              <span className="font-bold block mb-1">Fonte de verdade</span>
              Métricas agregadas originadas pelo pipeline de eventos e telemetria da plataforma.
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
