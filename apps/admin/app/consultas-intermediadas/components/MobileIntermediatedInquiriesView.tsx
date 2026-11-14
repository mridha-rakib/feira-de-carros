'use client';

import { AdminMobileNavigation } from '@/app/components/AdminMobileNavigation';
import { BrandLogo } from '@feira/ui';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageSquare,
  Shield,
  ShieldAlert,
  Users,
} from 'lucide-react';
import * as React from 'react';

export function MobileIntermediatedInquiriesView() {
  return (
    <div
      data-testid="adm-m-007-mobile-inquiries"
      className="lg:hidden min-h-screen bg-slate-100 flex flex-col pb-20 select-none"
    >
      {/* Dark Mobile Header with Official 2026 BrandLogo */}
      <header className="bg-[#0B111E] text-white px-4 py-3.5 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <BrandLogo variant="on-dark" priority width={140} height={28} className="h-6 w-auto" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
            ADM-M-007
          </span>
          <div className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 font-black text-[10px] flex items-center justify-center">
            AM
          </div>
        </div>
      </header>

      {/* Main Content Area (Restricted Read-Only Specification) */}
      <main className="p-4 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">
            Consultas intermediadas
          </h1>
          <p className="text-xs text-slate-600">
            Diretrizes de mediação de anúncios presenciais da feira física.
          </p>
        </div>

        {/* Mobile Explicit Restricted Notice Banner */}
        <div
          data-testid="mobile-inquiry-restriction-banner"
          className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs"
        >
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold uppercase tracking-wide text-amber-900 block text-[11px]">
              CONSULTA MÓVEL RESTRITA (ADM-018 / ADM-019)
            </strong>
            <p className="text-[11px] text-amber-800/95 mt-0.5 leading-relaxed">
              O envio de mensagens mediadas, consulta de contatos e gestão de conversas são
              exclusivos do terminal desktop pelo Main Admin. Dispositivos móveis não possuem acesso
              a dados de compradores ou proprietários.
            </p>
          </div>
        </div>

        {/* Access Status Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-600" />
              Status de Acesso Móvel
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              DENY_PENDING
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Operadores Sales e Support:</p>
            <p className="text-[11px] leading-relaxed">
              Fila de conversas atribuídas indisponível no aplicativo móvel. Permissão condicionada
              à assinatura formal do modelo RBAC e autorização expressa em desktop.
            </p>
          </div>
        </div>

        {/* Read-Only Authorized Flow Explanation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Ciclo da Mediação Institucional (UI-041)</span>
          </h2>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-slate-800 block text-[11px]">Início pelo Comprador</strong>
                <p className="text-[11px] text-slate-500">
                  Comprador envia dúvida ou proposta pelo anúncio legado no portal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-slate-800 block text-[11px]">
                  Identificação Institucional
                </strong>
                <p className="text-[11px] text-slate-500">
                  O operador Main Admin se identifica como representante da Feira de Carros (vedada
                  personificação).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-slate-800 block text-[11px]">Contato com o Vendedor</strong>
                <p className="text-[11px] text-slate-500">
                  Vendedor presencial é contatado por canais telefônicos autorizados.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-slate-800 block text-[11px]">
                  Resposta Oficial & Auditoria
                </strong>
                <p className="text-[11px] text-slate-500">
                  Resposta repassada ao comprador com registro imutável em log de auditoria.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Read-Only Footer Note */}
        <div className="text-center text-[10px] text-slate-400 py-3 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Nenhum dado pessoal ou número telefônico exposto em tela móvel.
        </div>
      </main>

      {/* Existing Mobile Navigation */}
      <AdminMobileNavigation />
    </div>
  );
}
