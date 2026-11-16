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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e2e8f0] px-3.5 py-1 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto h-[69px] gap-1.5">
        {MOBILE_TABS.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center h-[60px] rounded-[12px] transition-all gap-[5px] py-[5px] ${
                isActive
                  ? 'bg-[#fff1f2] text-[#b91c1c] font-semibold'
                  : 'text-[#64748b] hover:text-[#111827] font-medium'
              }`}
            >
              <Icon className="w-[22px] h-[22px]" />
              <span className="text-[12px] leading-[17px]">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
