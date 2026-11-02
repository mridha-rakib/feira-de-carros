'use client';

import { AlertTriangle, Car, LayoutGrid, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as React from 'react';

interface MobileTabItem {
  id: 'painel' | 'vendedores' | 'anuncios' | 'alertas';
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MOBILE_TABS: MobileTabItem[] = [
  { id: 'painel', label: 'Painel', href: '/', icon: LayoutGrid },
  { id: 'vendedores', label: 'Vendedores', href: '/vendedores', icon: ShieldCheck },
  { id: 'anuncios', label: 'Anúncios', href: '/anuncios', icon: Car },
  { id: 'alertas', label: 'Alertas', href: '/alertas', icon: AlertTriangle },
];

export function AdminMobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação móvel principal"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 pb-safe"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {MOBILE_TABS.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-red-50 text-red-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px]">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
