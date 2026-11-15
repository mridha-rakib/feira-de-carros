'use client';

import { BrandLogo } from '@feira/ui';
import {
  AlertTriangle,
  Bell,
  Car,
  ChevronRight,
  Coins,
  FileText,
  Flame,
  Headphones,
  Layers,
  Lock,
  MapPin,
  Search,
  Shield,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { AdminMobileNavigation } from '../../components/AdminMobileNavigation';

interface MobileSettingsSection {
  id: string;
  title: string;
  summary: string;
  badge: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SETTINGS_AREAS: MobileSettingsSection[] = [
  {
    id: 'planos',
    title: 'Planos de Anúncios',
    summary: '2 planos ativos (R$ 30 / R$ 50) • Vigência 30d e 60d',
    badge: 'ADM-D-045',
    href: '/configuracoes/planos',
    icon: Coins,
  },
  {
    id: 'impulsionamento',
    title: 'Destaque e Impulsionamento',
    summary: 'Taxa R$ 10 • 7 dias de exposição • Elegibilidade ativa',
    badge: 'ADM-D-046',
    href: '/configuracoes/impulsionamento',
    icon: Sparkles,
  },
  {
    id: 'categorias',
    title: 'Categorias de Veículos',
    summary: '4 categorias do baseline V1 • Atributos obrigatórios',
    badge: 'ADM-D-047',
    href: '/configuracoes/categorias',
    icon: Layers,
  },
  {
    id: 'marcas-modelos',
    title: 'Marcas e Modelos',
    summary: '5 modelos homologados • Trava contra exclusão ativa',
    badge: 'ADM-D-048',
    href: '/configuracoes/marcas-modelos',
    icon: Car,
  },
  {
    id: 'localidades',
    title: 'Localidades e Regiões',
    summary: 'Sede Ipatinga - MG • 5 municípios cadastrados',
    badge: 'ADM-D-049',
    href: '/configuracoes/localidades',
    icon: MapPin,
  },
  {
    id: 'destaques',
    title: 'Destaques da Página Inicial',
    summary: '3 veículos elegíveis • Vitrine rotativa sob SEARCH-012',
    badge: 'ADM-D-050',
    href: '/configuracoes/destaques',
    icon: Flame,
  },
  {
    id: 'notificacoes',
    title: 'Modelos de Notificação',
    summary: '5 templates transacionais • E-mail e Push mobile',
    badge: 'ADM-D-051',
    href: '/configuracoes/notificacoes',
    icon: Bell,
  },
  {
    id: 'contato',
    title: 'Contato e Suporte ao Usuário',
    summary: 'Ipatinga - MG • Canais oficiais em validação de domínio',
    badge: 'ADM-D-052',
    href: '/configuracoes/contato',
    icon: Headphones,
  },
  {
    id: 'termos-privacidade',
    title: 'Termos de Uso e Privacidade',
    summary: 'Minutas v0.1 rascunho • Parecer jurídico pendente',
    badge: 'ADM-D-053',
    href: '/configuracoes/termos-privacidade',
    icon: FileText,
  },
];

export function MobileSettingsView() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredSections = SETTINGS_AREAS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      data-testid="mobile-settings-page"
      className="lg:hidden min-h-screen bg-slate-100 text-slate-800 pb-28 select-none"
    >
      {/* 1. Approved Dark Mobile Header (Figma ADM-M-011 / node 468:9785) */}
      <header className="bg-[#0B111E] text-white p-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <BrandLogo variant="on-dark" priority width={130} height={26} className="h-6 w-auto" />
          <div className="flex items-center gap-2">
            <span
              data-testid="mobile-settings-badge"
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700"
            >
              ADM-M-011
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Ipatinga - MG</span>
          <span>Visão Geral • Somente Leitura</span>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Title & Status */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Configurações do Sistema
            </h1>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Parametrização comercial, regras de destaque e catálogo mestre.
          </p>
        </div>

        {/* Restricted Operations Alert */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 space-y-1 text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Operações Restritas no Mobile</span>
          </div>
          <p className="text-[11px] text-amber-800/90 leading-relaxed">
            Alterações de tarifas, disparo de notificações, edição de templates e publicação de
            termos exigem estação de trabalho desktop (1366px+).
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar área ou parâmetro de configuração..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xs"
          />
        </div>

        {/* Settings Modules List */}
        <div className="space-y-2.5">
          {filteredSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.id}
                href={sec.href}
                className="block p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs active:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-slate-900">{sec.title}</h2>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {sec.summary}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {sec.badge}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-slate-400 pt-2 pb-4">
          AMBIENTE DEMONSTRATIVO • FEIRA DE CARROS ADMIN v0.1
        </div>
      </main>

      {/* 3. Bottom Navigation */}
      <AdminMobileNavigation />
    </div>
  );
}
