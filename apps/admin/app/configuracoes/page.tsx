'use client';

import { AdminShell } from '@/app/components/AdminShell';
import {
  ArrowRight,
  Car,
  Clock,
  Coins,
  FileCheck,
  Globe,
  Layers,
  Lock,
  MapPin,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Tag,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { MobileSettingsRestrictedBanner } from './components/MobileSettingsRestrictedBanner';

interface ConfigModuleCard {
  id: string;
  title: string;
  badge: string;
  figmaNode: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isReady: boolean;
  metrics: string;
}

const ACTIVE_MODULES: ConfigModuleCard[] = [
  {
    id: 'planos',
    title: 'Planos de Anúncios',
    badge: 'ADM-D-045',
    figmaNode: '325:3366',
    description:
      'Gestão de tarifas, vigência de 30 e 60 dias e cotas de até 10 fotos. Repricing sob HOLD SMG-10.',
    href: '/configuracoes/planos',
    icon: Coins,
    isReady: true,
    metrics: '2 planos ativos • R$ 30 e R$ 50',
  },
  {
    id: 'impulsionamento',
    title: 'Destaque e Impulsionamento',
    badge: 'ADM-D-046',
    figmaNode: '325:3581',
    description:
      'Regras comerciais do destaque de 7 dias (R$ 10), requisitos de elegibilidade e desvinculação.',
    href: '/configuracoes/impulsionamento',
    icon: Sparkles,
    isReady: true,
    metrics: 'Taxa fixa: R$ 10 • 7 dias de exposição',
  },
  {
    id: 'categorias',
    title: 'Categorias de Veículos',
    badge: 'ADM-D-047',
    figmaNode: '325:3796',
    description:
      '4 categorias do baseline V1: Carros, Caminhões, Motos e Outros. Atributos sob HOLD SMG-07.',
    href: '/configuracoes/categorias',
    icon: Layers,
    isReady: true,
    metrics: '4 categorias • Catálogo fechado V1',
  },
  {
    id: 'marcas-modelos',
    title: 'Marcas e Modelos',
    badge: 'ADM-D-048',
    figmaNode: '325:4011',
    description:
      'Catálogo de referência para montadoras e versões. Bloqueio de exclusão para modelos vinculados.',
    href: '/configuracoes/marcas-modelos',
    icon: Car,
    isReady: true,
    metrics: '5 marcas e modelos cadastrados',
  },
  {
    id: 'localidades',
    title: 'Localidades e Regiões',
    badge: 'ADM-D-049',
    figmaNode: '341:4910',
    description:
      'Municípios autorizados (Sede Ipatinga-MG, Vale do Aço e capitais). Busca geográfica sob HOLD SEARCH-005.',
    href: '/configuracoes/localidades',
    icon: MapPin,
    isReady: true,
    metrics: '5 cidades homologadas • Padrão: Ipatinga',
  },
];

const FUTURE_B7B_MODULES = [
  {
    id: 'seguranca-auditoria',
    title: 'Auditoria e Chaves Criptográficas',
    badge: 'Fase B7B',
    description:
      'Parâmetros de retenção de logs imutáveis, rotação de credenciais institucionais e conformidade LGPD.',
  },
  {
    id: 'gateways-pagamento',
    title: 'Integrações de Gateways e Adquirentes',
    badge: 'Fase B7B',
    description:
      'Webhooks de conciliação automática PIX e cartão, antifraude e liquidação de recebíveis.',
  },
  {
    id: 'politicas-plataforma',
    title: 'Termos de Uso e Política de Privacidade',
    badge: 'Fase B7B',
    description:
      'Versões contratuais homologadas, regras de desistência CDC Art. 49 e termos de vistoria presencial.',
  },
];

export default function SettingsOverviewPage() {
  return (
    <AdminShell breadcrumbs={['Admin', 'Configurações']} maxWidthClass="max-w-[1440px]">
      <div className="space-y-6" data-testid="settings-overview-page">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Configurações da Plataforma
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 text-white">
                Admin B7A
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Parametrização comercial, planos de anúncios, regras de destaque e catálogo mestre do
              sistema.
            </p>
          </div>
        </div>

        {/* Mobile Restriction Notice */}
        <MobileSettingsRestrictedBanner moduleName="parâmetros de sistema" />

        {/* Active B7A Modules Grid (5 Cards) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-600" />
              <span>Módulos Comerciais e Catálogo (B7A Ativo)</span>
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">5 seções configuráveis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACTIVE_MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.id}
                  href={mod.href}
                  data-testid={`settings-card-${mod.id}`}
                  className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-red-50 group-hover:text-red-600 text-slate-700 flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                        {mod.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors flex items-center justify-between">
                        <span>{mod.title}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>{mod.metrics}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-[10px]">{mod.figmaNode}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Future B7B Modules (Disabled / Coming Soon) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1 pt-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Módulos de Infraestrutura e Governança (Fase B7B)</span>
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">Planejamento futuro</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FUTURE_B7B_MODULES.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/70 rounded-2xl border border-slate-200/60 p-4 shadow-2xs space-y-2 opacity-80"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{item.title}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Parametrização institucional em conformidade com o SRS v0.2.
        </div>
      </div>
    </AdminShell>
  );
}
