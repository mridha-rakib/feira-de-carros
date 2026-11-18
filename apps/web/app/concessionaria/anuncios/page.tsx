'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowRight,
  IconBuilding,
  IconCheck,
  IconShield,
} from '@/app/components/SellerIcons';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import { useDealerStore } from '@/stores/use-dealer-store';
import Link from 'next/link';
import React from 'react';

export default function DealershipInventoryStubPage() {
  const { application, account } = useDealerStore();

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-[70px] py-8 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-[#697a95] mb-4">
          <Link href="/" className="hover:text-[#17243f] transition-colors">
            Início
          </Link>
          <span>›</span>
          <span className="font-semibold text-[#17243f]">Painel da Concessionária</span>
          <span>›</span>
          <span>Estoque de Veículos</span>
        </div>

        {/* Header Heading */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] sm:text-[32px] font-bold text-[#17243f] tracking-tight">
                Estoque da Concessionária
              </h1>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                Conta Ativa
              </span>
            </div>
            <p className="text-[14px] text-[#697a95] mt-1">
              {application.dealershipName ||
                account?.dealershipName ||
                'Líder Veículos e Seminovos Ltda'}{' '}
              · {application.city || 'Ipatinga'} - {application.state || 'MG'}
            </p>
          </div>

          <Link
            href="/concessionaria/solicitacao/status"
            className="text-[12px] font-semibold text-[#17243f] bg-white border border-[#dee6f1] hover:bg-[#f8fafc] px-4 py-2.5 rounded-[8px] transition-colors self-start sm:self-auto"
          >
            Ver dados da solicitação
          </Link>
        </div>

        {/* Milestone Banner: Batch D2 Gateway */}
        <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 sm:p-8 shadow-xs max-w-[960px]">
          <div className="flex items-start gap-4">
            <div className="size-[48px] rounded-full bg-[#e8f1ff] text-[#215c9d] flex items-center justify-center shrink-0">
              <IconBuilding className="size-6" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#17243f]">
                Portal de Gerenciamento de Estoque (Batch D2)
              </h2>
              <p className="text-[14px] text-[#697a95] mt-1.5 leading-relaxed">
                Você está autenticado como concessionária aprovada. A visualização completa da
                tabela de inventário (WEB-021), métricas consolidadas de visualização (ANA-001) e
                filtros avançados de estoque serão implementados no <strong>Batch D2</strong>.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#f8fafc] border border-[#dee6f1] rounded-[10px]">
                  <span className="text-[11px] font-semibold text-[#697a95] uppercase">
                    Veículos em Análise
                  </span>
                  <p className="text-[24px] font-bold text-[#17243f] mt-1">0</p>
                  <p className="text-[11px] text-[#697a95] mt-0.5">Aguardando Batch D3</p>
                </div>
                <div className="p-4 bg-[#f8fafc] border border-[#dee6f1] rounded-[10px]">
                  <span className="text-[11px] font-semibold text-[#697a95] uppercase">
                    Anúncios Ativos
                  </span>
                  <p className="text-[24px] font-bold text-[#059669] mt-1">Pronto</p>
                  <p className="text-[11px] text-[#059669] mt-0.5">Credencial habilitada</p>
                </div>
                <div className="p-4 bg-[#f8fafc] border border-[#dee6f1] rounded-[10px]">
                  <span className="text-[11px] font-semibold text-[#697a95] uppercase">
                    Showroom Público
                  </span>
                  <p className="text-[24px] font-bold text-[#2563eb] mt-1">WEB-022</p>
                  <p className="text-[11px] text-[#697a95] mt-0.5">Planejado para Batch D4</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/concessionaria/solicitacao/status"
                  className="px-5 py-2.5 bg-[#b91c1c] hover:bg-[#a11818] text-white font-semibold text-[13px] rounded-[8px] flex items-center gap-2 transition-colors"
                >
                  <span>Acompanhar protocolo da solicitação</span>
                  <IconArrowRight className="size-4" />
                </Link>
                <Link
                  href="/"
                  className="px-5 py-2.5 bg-white border border-[#dee6f1] text-[#17243f] hover:bg-[#f8fafc] font-semibold text-[13px] rounded-[8px] transition-colors"
                >
                  Ir para o marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
