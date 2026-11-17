'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconCalendar,
  IconCard,
  IconCheck,
  IconClock,
  IconCoin,
  IconCross,
  IconEye,
  IconInfo,
  IconSearch,
  IconStack,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getPaymentHistory, getPaymentKpis } from '@/lib/adapters/seller-orders-adapter';
import type { PaymentHistoryItem } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function PaymentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const kpis = getPaymentKpis();
  const payments = getPaymentHistory({
    search: searchTerm,
    status: statusFilter,
    plan: planFilter,
  });

  return (
    <div className="min-h-screen bg-[#f2f6fb] flex flex-col font-['Inter',sans-serif]">
      <SellerNavbar variant="seller" activeTab="pagamentos" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-24 md:pb-12">
        {/* Breadcrumb & Traceability Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <SellerBreadcrumb
            items={[
              { label: 'Início', href: '/' },
              { label: 'Meus anúncios', href: '/vendedor/anuncios' },
              { label: 'Pagamentos', active: true },
            ]}
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9f3ff] text-[#0066cc] text-[11px] font-semibold tracking-wide self-start sm:self-auto">
            <span>WEB-033 · Histórico de Pagamentos</span>
          </div>
        </div>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-[28px] md:text-[33px] font-semibold text-[#101827] tracking-tight">
            Pagamentos
          </h1>
          <p className="text-[14px] md:text-[15px] text-[#617086] mt-1">
            Gerencie cobranças, planos e pagamentos dos seus anúncios.
          </p>
        </div>

        {/* 4 Top KPI Cards (Figma 2724:2284 / 2724:2290 / 2724:2295 / 2724:2301) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Pendentes */}
          <div className="bg-white border border-[#d6dfe9] rounded-[11px] p-5 flex items-center gap-4 shadow-sm">
            <div className="size-12 rounded-[10px] bg-[#fff2db] text-[#a86b08] flex items-center justify-center shrink-0">
              <IconClock className="size-6" />
            </div>
            <div>
              <span className="text-[13px] sm:text-[15px] text-[#617086] block">Pendentes</span>
              <span className="text-[24px] sm:text-[28px] font-bold text-[#101827]">
                {kpis.pendingCount}
              </span>
            </div>
          </div>

          {/* Confirmados */}
          <div className="bg-white border border-[#d6dfe9] rounded-[11px] p-5 flex items-center gap-4 shadow-sm">
            <div className="size-12 rounded-[10px] bg-[#e5f8ea] text-[#13874b] flex items-center justify-center shrink-0">
              <IconCheck className="size-6 stroke-[3]" />
            </div>
            <div>
              <span className="text-[13px] sm:text-[15px] text-[#617086] block">Confirmados</span>
              <span className="text-[24px] sm:text-[28px] font-bold text-[#101827]">
                {kpis.confirmedCount}
              </span>
            </div>
          </div>

          {/* Faturamento do Mês / Total Pago */}
          <div className="bg-white border border-[#d6dfe9] rounded-[11px] p-5 flex items-center gap-4 shadow-sm">
            <div className="size-12 rounded-[10px] bg-[#fff0f1] text-[#c41217] flex items-center justify-center shrink-0">
              <IconCoin className="size-6" />
            </div>
            <div>
              <span className="text-[13px] sm:text-[15px] text-[#617086] block">
                Total investido
              </span>
              <span className="text-[22px] sm:text-[26px] font-bold text-[#101827]">
                {kpis.totalPaidFormatted}
              </span>
            </div>
          </div>

          {/* Planos Ativos */}
          <div className="bg-white border border-[#d6dfe9] rounded-[11px] p-5 flex items-center gap-4 shadow-sm">
            <div className="size-12 rounded-[10px] bg-[#e9f3ff] text-[#0066cc] flex items-center justify-center shrink-0">
              <IconStack className="size-6" />
            </div>
            <div>
              <span className="text-[13px] sm:text-[15px] text-[#617086] block">Planos ativos</span>
              <span className="text-[24px] sm:text-[28px] font-bold text-[#101827]">
                {kpis.activePlansCount}
              </span>
            </div>
          </div>
        </div>

        {/* Main Charges Table Card (Figma 2724:2306) */}
        <div className="bg-white border border-[#d6dfe9] rounded-[14px] p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
            <div>
              <h2 className="text-[20px] font-bold text-[#101827]">Cobranças e pagamentos</h2>
              <p className="text-[13px] text-[#617086] mt-0.5">
                Acompanhe o status, renove planos e consulte os comprovantes dos seus anúncios.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-semibold self-start sm:self-auto">
              <span>{payments.length} registros</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search */}
            <div className="sm:col-span-6 relative">
              <IconSearch className="size-4 text-[#94a3b8] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por anúncio, modelo ou código..."
                className="w-full h-[42px] pl-10 pr-4 rounded-[10px] bg-white border border-[#d6dfe9] text-[13px] text-[#101827] focus:outline-none focus:border-[#c41217]"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                aria-label="Filtrar por status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-[42px] px-3 rounded-[10px] bg-white border border-[#d6dfe9] text-[13px] text-[#101827] cursor-pointer focus:outline-none focus:border-[#c41217]"
              >
                <option value="all">Todos os status</option>
                <option value="PAID">Pago / Confirmado</option>
                <option value="PENDING">Pendente</option>
                <option value="EXPIRED">Expirado</option>
              </select>
            </div>

            {/* Plan Filter */}
            <div className="sm:col-span-3">
              <select
                aria-label="Filtrar por plano"
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full h-[42px] px-3 rounded-[10px] bg-white border border-[#d6dfe9] text-[13px] text-[#101827] cursor-pointer focus:outline-none focus:border-[#c41217]"
              >
                <option value="all">Todos os planos</option>
                <option value="Básico">Plano Básico</option>
                <option value="Estendido">Plano Estendido</option>
                <option value="Destaque">Destaque Promocional</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          {payments.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-[#d6dfe9] rounded-[12px]">
              <IconSearch className="size-10 text-[#94a3b8] mx-auto mb-3" />
              <p className="text-[15px] font-semibold text-[#101827]">
                Nenhum pagamento encontrado
              </p>
              <p className="text-[13px] text-[#617086] mt-1">
                Tente ajustar os termos da busca ou os filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#f2f6fb] text-[#101827] font-semibold text-[13px] rounded-[8px]">
                    <th className="py-3.5 px-4 rounded-l-[8px]">Anúncio</th>
                    <th className="py-3.5 px-4">Plano</th>
                    <th className="py-3.5 px-4">Valor</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Vencimento</th>
                    <th className="py-3.5 px-4 text-right rounded-r-[8px]">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {payments.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                      {/* Anúncio info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 rounded-[8px] overflow-hidden bg-[#f1f5f9] shrink-0 border border-[#e2e8f0]">
                            <Image
                              src={
                                item.listingImageUrl || '/images/vehicles/demo/fiat-strada-2023.jpg'
                              }
                              alt={item.listingTitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-[#101827] block truncate max-w-[220px]">
                              {item.listingTitle}
                            </span>
                            <span className="text-[11px] text-[#617086] block">Cód. {item.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Plano */}
                      <td className="py-4 px-4 font-medium text-[#101827]">
                        {item.planOrBoostName}
                      </td>

                      {/* Valor */}
                      <td className="py-4 px-4 font-bold text-[#101827]">{item.amountFormatted}</td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        {item.status === 'PAID' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e5f8ea] text-[#13874b] text-xs font-semibold">
                            <IconCheck className="size-3.5 stroke-[3]" />
                            <span>Pago</span>
                          </span>
                        )}
                        {item.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fff2db] text-[#a86b08] text-xs font-semibold">
                            <IconClock className="size-3.5" />
                            <span>Pendente</span>
                          </span>
                        )}
                        {item.status === 'EXPIRED' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fff0f1] text-[#c41217] text-xs font-semibold">
                            <IconCross className="size-3.5" />
                            <span>Expirado</span>
                          </span>
                        )}
                      </td>

                      {/* Vencimento / Data */}
                      <td className="py-4 px-4 text-[13px] text-[#617086]">
                        {item.expiresAtFormatted}
                      </td>

                      {/* Ações */}
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/vendedor/pedidos/${item.orderId}/status`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[8px] bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#101827] text-xs font-semibold transition-colors"
                        >
                          <IconEye className="size-3.5 text-[#64748b]" />
                          <span>Ver</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Demonstration Notice */}
          <div className="pt-4 border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#617086]">
            <span>Histórico demonstrativo sincronizado com o fluxo de pedidos do vendedor.</span>
            <span className="font-semibold text-[#0066cc]">Ambiente de Demonstração</span>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
