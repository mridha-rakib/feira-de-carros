'use client';

import {
  Car,
  CreditCard,
  LayoutDashboard,
  MessageSquareWarning,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as React from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Painel geral', href: '/', icon: LayoutDashboard },
  { label: 'Usuários', href: '/usuarios', icon: Users },
  { label: 'Aprovação de vendedores', href: '/vendedores', icon: ShieldCheck },
  { label: 'Anúncios', href: '/anuncios', icon: Car },
  { label: 'Pagamentos', href: '/pagamentos', icon: CreditCard },
  { label: 'Mensagens e denúncias', href: '/moderacao', icon: MessageSquareWarning },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 min-h-screen bg-[#0B111E] text-slate-200 border-r border-slate-800/80 p-5 select-none"
      aria-label="Navegação administrativa desktop"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand/logo-white.png"
            alt="Feira de Carros"
            width={140}
            height={36}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Workspace Section Header */}
      <div className="mb-3 px-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Workspace Principal
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-800/90 text-white shadow-sm ring-1 ring-slate-700/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center ${
                  isActive ? 'bg-red-600/20 text-red-400' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Role Access Callout Card (Figma ADM-D-002) */}
      <div className="mt-auto pt-6 space-y-4">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
              Acesso • Main Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Revisões e pagamentos somente com autorização.
          </p>
        </div>

        {/* Product / Version Note */}
        <div className="px-2 pt-2 border-t border-slate-800/60 text-left">
          <p className="text-xs font-semibold text-slate-400">Feira de Carros</p>
          <p className="text-[11px] text-slate-500">Painel administrativo • v0.1</p>
        </div>
      </div>
    </aside>
  );
}
