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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Ativo
      </span>
    );
  }

  if (status === 'Em análise') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Em análise
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
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

      {/* Table Container */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="pb-3 pl-2">Anúncio</th>
              <th className="pb-3">Vendedor</th>
              <th className="pb-3">Valor</th>
              <th className="pb-3">Situação</th>
              <th className="pb-3 pr-2">Localização</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {listings.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 pl-2 font-semibold text-slate-900">
                  <span>
                    {item.adCode} • {item.vehicleTitle}
                  </span>
                </td>
                <td className="py-3.5 text-slate-600">{item.sellerName}</td>
                <td className="py-3.5 font-semibold text-slate-900">{item.priceFormatted}</td>
                <td className="py-3.5">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3.5 pr-2 text-slate-600">{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
