'use client';

import { BrandLogo } from '@feira/ui';
import {
  AlertTriangle,
  Clock,
  Lock,
  MessageSquareWarning,
  Shield,
  ShieldAlert,
  User,
} from 'lucide-react';
import * as React from 'react';
import {
  MODERATION_MOBILE_KPI,
  formatVehiclePrice,
  mockMobileModerationReports,
} from '../../../lib/adapters/mock-moderation-data';
import type { MobileModerationReport } from '../../../lib/types/moderation-presentation';
import { AdminMobileNavigation } from '../../components/AdminMobileNavigation';

export function MobileModerationView() {
  const reports = mockMobileModerationReports;

  return (
    <div
      data-testid="mobile-moderation-page"
      className="lg:hidden min-h-screen bg-slate-100 text-slate-800 pb-28 select-none"
    >
      {/* 1. Approved Dark Mobile Header (Figma ADM-M-005 / node 447-9382) */}
      <header className="bg-[#0B111E] text-white p-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <BrandLogo variant="on-dark" priority width={130} height={26} className="h-6 w-auto" />
          <div className="flex items-center gap-2">
            <span
              data-testid="mobile-moderation-badge"
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700"
            >
              ADM-M-005
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Ipatinga - MG</span>
          <span>Ambiente Demonstrativo (LGPD)</span>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Moderação e Denúncias
            </h1>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoramento móvel em modo leitura. Deliberações e medidas operacionais restritas ao
            terminal desktop.
          </p>
        </div>

        {/* Security / Restriction Warning Banner (ADM-019 / ADM-021) */}
        <div
          data-testid="mobile-restrictions-banner"
          className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800 shadow-xs"
        >
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Lock className="w-4 h-4 shrink-0" />
            <span>Operações Restritas no Ambiente Móvel (ADM-019 / ADM-021)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Por integridade do catálogo e segurança jurídica, deliberações de moderação, suspensão
            de vendedores e aplicação de medidas restritivas são{' '}
            <strong>bloqueadas em dispositivos móveis</strong>. Acesse o desktop homologado com
            credencial Main Admin para deliberar.
          </p>
        </div>

        {/* Quick KPI Strip Matching Approved Figma ADM-M-005 Values (7 Pending, 2 Urgent) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Approved Metric 1: 7 Pending Reports */}
          <div
            data-testid="mobile-kpi-pending-reports"
            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-left"
          >
            <div className="flex items-center gap-1.5 text-amber-600 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Denúncias</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {MODERATION_MOBILE_KPI.pendingReports}
              </span>
              <span className="text-xs font-semibold text-amber-700">pendentes</span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
              Aguardando triagem / análise
            </div>
          </div>

          {/* Approved Metric 2: 2 Urgent Reports */}
          <div
            data-testid="mobile-kpi-urgent-reports"
            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-left"
          >
            <div className="flex items-center gap-1.5 text-red-600 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Prioritárias</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {MODERATION_MOBILE_KPI.urgentReports}
              </span>
              <span className="text-xs font-semibold text-red-600">urgentes</span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
              Prioridade alta / divergência
            </div>
          </div>
        </div>

        {/* Role Permissions & Governance Box */}
        <div
          data-testid="mobile-moderation-roles-card"
          className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              Alçadas de Acesso (RBAC)
            </span>
            <span className="text-[10px] font-mono text-slate-400">Modo Leitura</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
              <span className="text-slate-500 text-[10px] block">Main Admin</span>
              <span className="font-bold text-emerald-700">
                {MODERATION_MOBILE_KPI.mainAdminStatus}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
              <span className="text-slate-500 text-[10px] block">Support / Sales</span>
              <span className="font-bold text-red-700 font-mono">
                {MODERATION_MOBILE_KPI.supportStatus}
              </span>
            </div>
          </div>
          <div className="pt-1 text-[10px] text-slate-500 leading-relaxed">
            Nenhuma medida sancionatória, suspensão de cadastro ou exclusão de anúncio pode ser
            executada pelo terminal móvel.
          </div>
        </div>

        {/* Operational Read-Only Alert Cards */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Denúncias em Destaque Operacional
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Modo Leitura</span>
          </div>

          {/* Render REP-DEMO-0021 and REP-DEMO-0022 */}
          {reports.map((item: MobileModerationReport) => (
            <div
              key={item.id}
              data-testid={`alert-card-moderation-${item.id}`}
              className={`p-4 rounded-2xl bg-white border ${
                item.isUrgent ? 'border-red-200' : 'border-slate-200'
              } shadow-2xs space-y-2.5 relative overflow-hidden`}
            >
              {/* Accent top stripe */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  item.isUrgent ? 'bg-red-600' : 'bg-amber-500'
                }`}
              />

              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      item.isUrgent ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {item.isUrgent ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      {item.categoryLabel}
                    </strong>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.id} {item.adId ? `• Ref ${item.adId}` : ''}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.isUrgent
                      ? 'bg-red-100 text-red-800 animate-pulse'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.priorityLabel}
                </span>
              </div>

              {/* Vehicle Title & Price */}
              {item.vehicleTitle && (
                <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800">{item.vehicleTitle}</span>
                  {item.vehiclePriceBrl && (
                    <span className="font-extrabold text-slate-900">
                      {formatVehiclePrice(item.vehiclePriceBrl)}
                    </span>
                  )}
                </div>
              )}

              {/* Allegation description */}
              <p className="text-xs text-slate-600 leading-relaxed">{item.allegation}</p>

              {/* Masked Seller & Complainant Details */}
              <div className="space-y-1 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span>
                    Vendedor: <strong className="text-slate-800">{item.sellerName}</strong>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {item.sellerDocumentMasked}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Denunciante: {item.reporterMasked}</span>
                  <span>Data: {item.reportedAt}</span>
                </div>
              </div>

              {/* Read-Only Security Pill — No interactive controls */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{item.readOnlyNotice}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Audit footer note */}
        <div className="p-3 text-center text-[10px] text-slate-400 space-y-1">
          <div>Feira de Carros Admin 2026 • Visualização Mobile Auditada (ADM-M-005)</div>
          <div className="text-[9px] text-slate-400 font-mono">
            Dados cadastrais e identidades mascarados em conformidade com a LGPD (Lei 13.709/2018)
          </div>
        </div>
      </main>

      {/* Approved Mobile Bottom Navigation */}
      <AdminMobileNavigation />
    </div>
  );
}
