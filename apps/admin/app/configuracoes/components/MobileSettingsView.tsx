'use client';

import { AdminMobileNavigation } from '@/app/components/AdminMobileNavigation';
import { BrandLogo } from '@feira/ui';
import { AlertTriangle, ChevronRight, Lock, Search, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

export function MobileSettingsView() {
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div
      data-testid="mobile-settings-overview-page"
      className="lg:hidden min-h-screen bg-[#f8f9fa] text-slate-800 pb-28 select-none"
    >
      {/* Mobile Shared Admin Header matching Figma node 468:9786 */}
      <header className="bg-[#0e1728] text-white px-5 py-3.5 sticky top-0 z-30 space-y-2">
        <div className="flex items-center gap-3">
          <BrandLogo
            variant="on-dark"
            priority
            width={135}
            height={28}
            className="h-7 w-auto shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#fc9d9d] tracking-wide">
              ADMIN · MOBILE WEB
            </span>
            <span className="text-[11px] font-semibold text-[#f2f5fa]">
              Main Admin · configurações em leitura
            </span>
          </div>
        </div>
        <p className="text-[11px] text-[#c9d4e5] font-normal border-t border-slate-800/80 pt-1.5">
          Ipatinga · MG &nbsp;&bull;&nbsp; Ambiente demonstrativo
        </p>
      </header>

      {/* Main Content Area matching Figma node 488:9978 */}
      <main className="p-5 space-y-4 max-w-lg mx-auto">
        {/* Page Heading matching Figma node 488:9979 */}
        <div className="space-y-1">
          <h1 className="text-[22px] font-bold text-[#111827] leading-[32px]">Configurações</h1>
          <p className="text-[12px] text-[#6b7280] leading-[18px]">
            Resumo dos parâmetros do produto em modo de consulta.
          </p>
        </div>

        {/* Read-only Search matching Figma node 488:9982 */}
        <div className="relative">
          <input
            type="text"
            readOnly
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar área de configuração…"
            className="w-full h-[48px] bg-white border border-[#d1d5db] rounded-[12px] px-4 text-[12px] text-[#6b7280] placeholder:text-[#6b7280] focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#6b7280] absolute right-4 top-4 pointer-events-none" />
        </div>

        {/* Card 1: Planos e impulsionamentos matching Figma node 488:9984 */}
        <div className="bg-white rounded-[16px] border border-[#e8edf5] p-[17px] shadow-xs space-y-2">
          <h2 className="text-[15px] font-bold text-[#111827] leading-[22px]">
            Planos e impulsionamentos
          </h2>
          <p className="text-[11px] font-medium text-[#6b7280] leading-[16px]">
            Configuração comercial
          </p>

          <div className="divide-y divide-[#d1d5db] border-y border-[#d1d5db] text-[11px]">
            <div className="py-[7px] flex items-center justify-between">
              <span className="text-[#6b7280]">Planos</span>
              <span className="font-semibold text-[#111827]">Duração e preço aprovados</span>
            </div>
            <div className="py-[7px] flex items-center justify-between">
              <span className="text-[#6b7280]">Impulsionamento</span>
              <span className="font-semibold text-[#111827]">Elegibilidade do anúncio</span>
            </div>
            <div className="py-[7px] flex items-center justify-between">
              <span className="text-[#6b7280]">Checkout</span>
              <span className="font-semibold text-[#111827]">Conforme provedor aprovado</span>
            </div>
            <div className="py-[7px] flex items-center justify-between">
              <span className="text-[#6b7280]">Edição</span>
              <span className="font-semibold text-[#111827]">Somente no desktop</span>
            </div>
          </div>

          <div className="bg-[#f4f6fa] rounded-[10px] px-3 py-2.5 text-[11px] font-medium text-[#111827]">
            Parâmetros comerciais editáveis apenas via console desktop.
          </div>
        </div>

        {/* Card 2: Catálogo e comunicação matching Figma node 488:10005 */}
        <div className="bg-white rounded-[16px] border border-[#e8edf5] p-[17px] shadow-xs space-y-2">
          <h2 className="text-[15px] font-bold text-[#111827] leading-[22px]">
            Catálogo e comunicação
          </h2>
          <p className="text-[11px] font-medium text-[#6b7280] leading-[16px]">
            Configuração operacional
          </p>

          <div className="divide-y divide-[#d1d5db] border-y border-[#d1d5db] text-[11px]">
            <div className="py-[7px] flex items-center justify-between">
              <span className="text-[#6b7280]">Categorias</span>
              <span className="font-semibold text-[#111827]">Veículos e tipos</span>
            </div>
            <div className="py-[7px] flex items-center justify-between">
              <span className="text-[#6b7280]">Localidades</span>
              <span className="font-semibold text-[#111827]">Cidades brasileiras</span>
            </div>
            <div className="py-[7px] flex items-center justify-between">
              <span className="text-[#6b7280]">Notificações</span>
              <span className="font-semibold text-[#111827]">Modelos revisados</span>
            </div>
            <div className="py-[7px] flex items-center justify-between">
              <span className="text-[#6b7280]">Suporte</span>
              <span className="font-semibold text-[#111827]">Contatos autorizados</span>
            </div>
          </div>

          <div className="bg-[#f4f6fa] rounded-[10px] px-3 py-2.5 text-[11px] font-medium text-[#111827]">
            Dados estruturais e tabelas de apoio sincronizados.
          </div>
        </div>

        {/* Safe Notice Banner matching Figma node 488:10026 */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[12px] p-3.5 space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#92400e]" />
            <span className="text-[12px] font-bold text-[#92400e]">Modo leitura no celular</span>
          </div>
          <p className="text-[11px] text-[#92400e] leading-relaxed">
            Para alterar parâmetros operacionais, use o terminal administrativo no desktop.
          </p>
        </div>

        {/* Demo footnote matching Figma node 488:10029 */}
        <p className="text-[11px] text-[#94a3b8] text-center pt-2">
          Ambiente de demonstração &bull; v0.1
        </p>
      </main>

      {/* Shared bottom navigation matching Figma node 481:9975 */}
      <AdminMobileNavigation />
    </div>
  );
}
