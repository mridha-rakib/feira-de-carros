'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconCheck,
  IconClock,
  IconFile,
  IconInfo,
  IconSearch,
  IconShield,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getRefundsList } from '@/lib/adapters/seller-refunds-adapter';
import type { RefundRequest } from '@/lib/types/seller-presentation';
import Link from 'next/link';
import { useState } from 'react';

export default function SellerRefundsHistoryPage() {
  const [refunds] = useState<RefundRequest[]>(() => getRefundsList());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredRefunds = refunds.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        r.id.toLowerCase().includes(q) ||
        r.orderId.toLowerCase().includes(q) ||
        r.listingTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
      <SellerNavbar variant="seller" activeTab="pagamentos" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[
            { label: 'Pagamentos', href: '/vendedor/pagamentos' },
            { label: 'Reembolsos e Cancelamentos' },
          ]}
        />

        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#111827]">
              Solicitações de Reembolso
            </h1>
            <p className="text-[14px] text-[#596679] mt-1">
              Acompanhe o andamento de contestações e pedidos de cancelamento de planos.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[12px] font-mono text-[#596679] block">
              Rota: /vendedor/reembolsos
            </span>
            <span className="text-[11px] text-[#16a34a] font-semibold">WEB-050 • REEMBOLSOS</span>
          </div>
        </div>

        {/* Notice Banner (Figma 817:1377) */}
        <div className="bg-[#fff2dd] border border-[#fed7aa] rounded-[12px] p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#ffedd5] text-[#b45309] shrink-0 mt-0.5">
            <IconAlert className="size-5" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#92400e]">
              Em análise manual (dados demonstrativos)
            </h3>
            <p className="text-[13px] text-[#92400e]/90 mt-0.5 leading-relaxed">
              As solicitações de estorno passam por auditoria do suporte financeiro. Prazos e
              devoluções no gateway bancário obedecem às normas do Banco Central e às regras de cada
              provedor (PSP).
            </p>
          </div>
        </div>

        {/* 3 Lifecycle Steps Progress (Figma 817:1352) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-[12px] bg-[#ecfdf5] border border-[#bbf7d0] flex items-center gap-3">
            <div className="size-9 rounded-full bg-[#16a34a] text-white font-bold text-[14px] flex items-center justify-center shrink-0">
              <IconCheck className="size-5" />
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#166534] block">1 · Solicitação</span>
              <span className="text-[12px] text-[#15803d]">Protocolada no sistema</span>
            </div>
          </div>

          <div className="p-4 rounded-[12px] bg-[#fff2dd] border border-[#fed7aa] flex items-center gap-3">
            <div className="size-9 rounded-full bg-[#d97706] text-white font-bold text-[14px] flex items-center justify-center shrink-0">
              <IconClock className="size-5" />
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#92400e] block">2 · Revisão manual</span>
              <span className="text-[12px] text-[#b45309]">Em auditoria financeira</span>
            </div>
          </div>

          <div className="p-4 rounded-[12px] bg-white border border-[#d6dfea] flex items-center gap-3 opacity-60">
            <div className="size-9 rounded-full bg-gray-200 text-[#64748b] font-bold text-[14px] flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#111827] block">
                3 · Decisão e estorno
              </span>
              <span className="text-[12px] text-[#64748b]">Aguardando parecer</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#d6dfea] rounded-[14px] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-[320px]">
            <IconSearch className="size-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por código ou veículo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 h-[40px] rounded-[10px] bg-[#f8fafc] border border-[#cbd5e1] text-[13px] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#c41217]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[13px] text-[#64748b] whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[40px] px-3 rounded-[10px] bg-[#f8fafc] border border-[#cbd5e1] text-[13px] text-[#111827] focus:bg-white focus:outline-none"
            >
              <option value="ALL">Todos os status</option>
              <option value="REQUESTED">Solicitação recebida</option>
              <option value="UNDER_REVIEW">Em revisão manual</option>
              <option value="APPROVED">Aprovado</option>
              <option value="REJECTED">Recusado</option>
            </select>
          </div>
        </div>

        {/* Refunds List / Table */}
        <div className="bg-white border border-[#d6dfea] rounded-[16px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Protocolo</th>
                  <th className="py-3.5 px-4">Pedido / Veículo</th>
                  <th className="py-3.5 px-4">Valor</th>
                  <th className="py-3.5 px-4">Motivo</th>
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredRefunds.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#64748b]">
                      Nenhuma solicitação de reembolso encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredRefunds.map((refund) => (
                    <tr key={refund.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-[#111827] whitespace-nowrap">
                        {refund.id}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-[#111827] block">
                          {refund.listingTitle}
                        </span>
                        <span className="text-[12px] text-[#64748b] font-mono">
                          Ref: {refund.orderId}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#111827] whitespace-nowrap">
                        {refund.amountFormatted}
                      </td>
                      <td
                        className="py-4 px-4 text-[#475569] max-w-[240px] truncate"
                        title={refund.reason}
                      >
                        {refund.reason}
                      </td>
                      <td className="py-4 px-4 text-[#64748b] whitespace-nowrap">
                        {refund.requestedAtFormatted}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            refund.status === 'UNDER_REVIEW'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : refund.status === 'REQUESTED'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : refund.status === 'APPROVED'
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          <IconClock className="size-3" />
                          {refund.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#64748b]">
            <span>Exibindo {filteredRefunds.length} solicitações cadastradas</span>
            <Link
              href="/vendedor/pagamentos"
              className="text-[#c41217] hover:underline font-semibold flex items-center gap-1.5"
            >
              <IconArrowLeft className="size-3.5" />
              Voltar para Pagamentos e Faturas
            </Link>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
