'use client';

import { BrandLogo } from '@feira/ui';
import { Car, FileText, Lock, ShieldAlert, Users } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import type {
  AttentionSummary,
  DashboardSummaryMetrics,
} from '../../lib/types/dashboard-presentation';
import { AdminMobileNavigation } from './AdminMobileNavigation';
import { DashboardSummaryCards } from './DashboardSummaryCards';
import { RequiresAttentionPanel } from './RequiresAttentionPanel';

interface AdminMobileOverviewProps {
  metrics: DashboardSummaryMetrics;
  attention: AttentionSummary;
}

export function AdminMobileOverview({ metrics, attention }: AdminMobileOverviewProps) {
  return (
    <div className="lg:hidden flex flex-col min-h-screen bg-slate-100 text-slate-800 pb-24">
      {/* Top Dark Header (Figma ADM-M-001) */}
      <header className="bg-[#0B111E] text-white p-4">
        <div className="flex items-center justify-between">
          <BrandLogo variant="on-dark" priority width={130} height={26} className="h-6 w-auto" />
          <div className="text-right">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
              Admin • Mobile Web
            </span>
            <span className="text-[10px] text-slate-400">Main Admin - acesso restrito</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Ipatinga - MG</span>
          <span>Ambiente demonstrativo</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="p-4 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Visão geral</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visão essencial do painel e alertas autorizados.
          </p>
        </div>

        {/* 4 Summary Cards (2x2 Grid) */}
        <DashboardSummaryCards metrics={metrics} isMobile={true} />

        {/* Requer atenção Panel */}
        <RequiresAttentionPanel attention={attention} isMobile={true} />

        {/* Últimos anúncios Panel (Figma ADM-M-001) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Car className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Últimos anúncios</h2>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500">FC-2026-0142</span>
              <span className="font-bold text-slate-900">Fiat Strada 2023</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500">Vendedora</span>
              <span className="font-medium text-slate-700">Mariana Costa</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500">Situação</span>
              <span className="font-semibold text-emerald-600">Ativo - exemplo</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500">Localidade</span>
              <span className="font-medium text-slate-700">Ipatinga, MG</span>
            </div>
          </div>

          <Link
            href="/anuncios"
            className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors mt-2"
          >
            Ver revisão da publicidade
          </Link>
        </div>

        {/* Acesso rápido - áreas autorizadas (Figma ADM-M-001) */}
        <div className="space-y-2 pt-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Acesso rápido - áreas autorizadas
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Consultas no celular; ações sensíveis exigem desktop.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-xs font-bold text-slate-900">Consultas</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Revisão restrita</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-xs font-bold text-slate-900">Clientes</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Dados autorizados</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-xs font-bold text-slate-900">Pagamentos</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Somente consulta</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-xs font-bold text-slate-900">Equipe</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Permissões em leitura</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-xs font-bold text-slate-900">Configurações</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Sem alterações</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-xs font-bold text-slate-900">Meu perfil</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Segurança da conta</p>
            </div>
          </div>
        </div>

        {/* Mobile Scope & Desktop Cash Notice (SRS ADM-020 & Figma ADM-M-001) */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs">
          <p className="font-bold text-[10px] uppercase tracking-wider mb-1">
            Escopo / Admin Mobile
          </p>
          <p className="text-[11px] leading-relaxed">
            Sem confirmação de caixa, alteração de permissões ou decisões de anúncios a partir do
            telefone.
          </p>
        </div>

        {/* Demonstration Disclaimer Pill */}
        <div className="p-2.5 rounded-xl bg-slate-200/60 text-center text-[10px] text-slate-500">
          AMBIENTE DEMONSTRATIVO • dados e nomes fictícios.
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation (Figma ADM-M-001) */}
      <AdminMobileNavigation />
    </div>
  );
}
