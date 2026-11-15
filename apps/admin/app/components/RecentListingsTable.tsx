'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import type {
  FigmaListingStatus,
  FigmaRecentListing,
} from '../../lib/types/dashboard-presentation';

interface RecentListingsTableProps {
  listings: FigmaRecentListing[];
}

function StatusBadge({ status }: { status: FigmaListingStatus }) {
  if (status === 'Ativo') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ecfdf3] text-[#027a48] border border-[#a6f4c5]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#12b76a]" />
        Ativo
      </span>
    );
  }

  if (status === 'Em análise') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fff7ed] text-[#c4320a] border border-[#fed7aa]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#fb6514]" />
        Em análise
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eff6ff] text-[#175cd3] border border-[#b2ddff]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#2e90fa]" />
      Pagamento pendente
    </span>
  );
}

export function RecentListingsTable({ listings }: RecentListingsTableProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
      {/* Header with Link to All Listings */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Anúncios recentes</h2>
        <Link
          href="/anuncios"
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
        >
          <span>Ver todos os anúncios</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table Container matching Figma node 54:218 */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e5eaf1] bg-[#f1f4f9] text-[#475467] font-bold text-[12px]">
              <th className="py-2.5 pl-3">Código</th>
              <th className="py-2.5">Veículo</th>
              <th className="py-2.5">Vendedor</th>
              <th className="py-2.5">Valor</th>
              <th className="py-2.5">Situação</th>
              <th className="py-2.5 pr-3">Localização</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5eaf1] text-[13px] text-[#101828]">
            {listings.map((item, idx) => (
              <tr
                key={item.id}
                className={`transition-colors hover:bg-slate-50 ${
                  idx % 2 === 1 ? 'bg-[#fafbfd]' : 'bg-white'
                }`}
              >
                <td className="py-3 pl-3 font-mono font-medium text-[#475467]">{item.adCode}</td>
                <td className="py-3 font-semibold text-[#101828]">{item.vehicleTitle}</td>
                <td className="py-3 text-[#475467]">{item.sellerName}</td>
                <td className="py-3 font-semibold text-[#101828]">{item.priceFormatted}</td>
                <td className="py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3 pr-3 text-[#475467]">{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
