'use client';

import { Banknote, BarChart3, CreditCard, RotateCcw, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as React from 'react';

interface FinanceTab {
  id: string;
  label: string;
  href: string;
  badge?: string;
  frameCode: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FINANCE_TABS: FinanceTab[] = [
  {
    id: 'transacoes',
    label: 'Transações',
    href: '/pagamentos',
    badge: '5',
    frameCode: 'ADM-D-024',
    icon: CreditCard,
  },
  {
    id: 'dinheiro',
    label: 'Livro Caixa',
    href: '/pagamentos/dinheiro',
    badge: '2',
    frameCode: 'ADM-D-027',
    icon: Banknote,
  },
  {
    id: 'reembolsos',
    label: 'Reembolsos',
    href: '/reembolsos',
    badge: '3',
    frameCode: 'ADM-D-028',
    icon: RotateCcw,
  },
  {
    id: 'contestacoes',
    label: 'Contestações',
    href: '/contestacoes',
    badge: '3',
    frameCode: 'ADM-D-030',
    icon: ShieldAlert,
  },
  {
    id: 'relatorios',
    label: 'Relatórios de Receita',
    href: '/relatorios',
    badge: 'R$ 42,5k',
    frameCode: 'ADM-D-031',
    icon: BarChart3,
  },
];

export function FinanceNavigationTabs() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
      {FINANCE_TABS.map((tab) => {
        const isActive =
          tab.href === '/pagamentos' ? pathname === '/pagamentos' : pathname.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.id}
            href={tab.href}
            data-testid={`finance-tab-${tab.id}`}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.badge}
              </span>
            )}
            <span
              className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-400'
              }`}
            >
              {tab.frameCode}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
