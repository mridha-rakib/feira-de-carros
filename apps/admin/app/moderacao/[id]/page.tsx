'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { ReportStatusBadge } from '@/app/moderacao/components/ReportStatusBadge';
import { formatVehiclePrice, getReportById } from '@/lib/adapters/mock-moderation-data';
import type { ReportAuditEvent, ReportEvidenceItem } from '@/lib/types/moderation-presentation';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Car,
  Clock,
  ExternalLink,
  FileText,
  Lock,
  MapPin,
  MessageSquare,
  Scale,
  Shield,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';

export default function ReportDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const report = React.useMemo(() => getReportById(id), [id]);

  if (!report) {
    return (
      <AdminShell breadcrumbs={['Admin', 'Denúncias', 'Não encontrado']}>
        <div
          data-testid="report-not-found-state"
          className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto shadow-2xs"
        >
          <Shield className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Denúncia não encontrada</h2>
          <p className="text-xs text-slate-500">
            O protocolo "{id}" não foi localizado na base de denúncias.
          </p>
          <Link
            href="/moderacao"
            data-testid="back-to-moderation-not-found-btn"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Fila de Denúncias
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Denúncias', 'Detalhes', report.id]}
      maxWidthClass="max-w-[1240px]"
    >
      <div className="space-y-6" data-testid="report-detail-page">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href="/moderacao"
                data-testid="back-to-moderation-btn"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Voltar para a fila"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Denúncia — Protocolo {report.id}
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                ADM-D-033
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Detalhes da denúncia e do vendedor vinculado. Acesso condicionado por LGPD e RBAC.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ReportStatusBadge status={report.status} size="md" />
          </div>
        </div>

        {/* Mobile Read-Only Restriction Notice */}
        <div
          data-testid="mobile-detail-restricted-banner"
          className="lg:hidden p-3.5 rounded-2xl bg-slate-900 text-white text-xs space-y-1 border border-slate-800 shadow-2xs"
        >
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Lock className="w-4 h-4 shrink-0" />
            <span>Ambiente Móvel — Visualização em Modo Leitura (ADM-019)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Deliberações formais e aplicação de sanções são restritas ao terminal desktop. Em
            dispositivos móveis, apenas a consulta informativa está disponível.
          </p>
        </div>

        {/* Unverified Allegation Banner */}
        <div
          data-testid="unverified-allegation-banner"
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs"
        >
          <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Alegação não verificada — Revisão Humana Obrigatória</span>
          </div>
          <p className="text-amber-900/90 leading-relaxed">
            Este relatório contém uma alegação submetida por um comprador. Nenhuma conclusão foi
            determinada. A denúncia não constitui confirmação de violação. Nenhuma medida restritiva
            foi aplicada ao vendedor ou ao anúncio.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column — Report & Evidence (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Report Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span>Dados Gerais da Denúncia</span>
                </h2>
                <span className="text-xs font-mono text-slate-500">
                  Recebido em: {report.reportedAt}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Protocolo
                  </span>
                  <span className="font-mono font-bold text-slate-900">{report.id}</span>
                </div>
                {report.adId && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Anúncio vinculado
                    </span>
                    <span className="font-mono font-semibold text-slate-800">{report.adId}</span>
                    {report.vehiclePriceBrl > 0 && (
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {formatVehiclePrice(report.vehiclePriceBrl)}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Categoria
                  </span>
                  <span className="text-slate-800 font-semibold">{report.categoryLabel}</span>
                </div>
              </div>

              {/* Allegation Quote */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Alegação submetida:
                </span>
                <blockquote className="p-3 bg-amber-50 rounded-xl border-l-4 border-amber-500 text-xs text-slate-800 italic leading-relaxed">
                  "{report.allegation}"
                </blockquote>
                <p className="text-[10px] text-slate-400 mt-1">
                  Fonte: {report.reporterAlias} — Conteúdo não verificado de forma independente.
                </p>
              </div>
            </div>

            {/* Evidence Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-slate-600" />
                  <span>Resumo de Evidências</span>
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Não verificado
                </span>
              </div>

              <div className="space-y-2">
                {report.evidence.map((ev: ReportEvidenceItem) => (
                  <div
                    key={ev.id}
                    className="flex items-start justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs gap-4"
                  >
                    <span className="text-slate-500">{ev.label}</span>
                    <span className="font-semibold text-slate-800 text-right">{ev.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span>Trilha de Auditoria</span>
                </h2>
                <span className="text-[11px] font-mono text-slate-400">
                  {report.auditTimeline.length} eventos
                </span>
              </div>

              <div className="space-y-3 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {report.auditTimeline.map((evt: ReportAuditEvent) => (
                  <div key={evt.id} className="relative pl-4 space-y-1 text-xs">
                    <div
                      className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-white ${
                        evt.type === 'SUCCESS'
                          ? 'bg-emerald-500'
                          : evt.type === 'WARNING'
                            ? 'bg-amber-500'
                            : evt.type === 'ALERT'
                              ? 'bg-red-500'
                              : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-800 font-bold">{evt.title}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{evt.description}</p>
                    {evt.operator && (
                      <div className="text-[10px] text-slate-400">
                        Operador: <span className="font-semibold">{evt.operator}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Vehicle Image & Seller Dossier (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Vehicle Card with Image */}
            {(report.vehicleTitle || report.vehicleImagePath) && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="relative w-full h-44 bg-slate-100">
                  {report.vehicleImagePath ? (
                    <Image
                      src={report.vehicleImagePath}
                      alt={`Veículo: ${report.vehicleTitle}`}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{report.vehicleTitle}</h3>
                    <p className="text-xs text-slate-500">
                      {report.sellerName}
                      {report.vehiclePriceBrl > 0 &&
                        ` · ${formatVehiclePrice(report.vehiclePriceBrl)}`}
                    </p>
                  </div>
                  {report.adId && (
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold">
                        Em análise
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                        Ativo
                      </span>
                    </div>
                  )}
                  {report.adId && (
                    <div className="text-xs space-y-1 pt-1 border-t border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Anúncio</span>
                        <span className="font-mono font-semibold text-slate-800">
                          {report.adId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Protocolo</span>
                        <span className="font-mono text-slate-700">{report.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Categoria</span>
                        <span className="text-slate-700">{report.categoryLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Reportado em</span>
                        <span className="text-slate-700">{report.reportedAt}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Seller Dossier */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-slate-600" />
                <span>Dados do Vendedor / Concessionária</span>
              </h2>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Razão social / Nome
                  </span>
                  <span className="font-bold text-slate-900">{report.sellerName}</span>
                </div>
                {report.sellerLocation && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{report.sellerLocation}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>CNPJ: {report.sellerCnpjMasked}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Conclusão: {report.conclusionLabel}</span>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="space-y-2">
              {report.conversationExcerpt && (
                <Link
                  href={`/moderacao/${report.id}/conversa`}
                  data-testid="navigate-conversation-btn"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-colors shadow-2xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  Revisar conversa vinculada
                </Link>
              )}
              <Link
                href={`/moderacao/${report.id}/decisao`}
                data-testid="navigate-decision-btn"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Revisão de decisão de moderação
              </Link>
            </div>

            {/* RBAC Notice */}
            <div className="p-3 rounded-xl bg-slate-900 text-white text-[11px]">
              <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1.5">
                Acesso sensível — LGPD
              </p>
              <p className="text-slate-400 leading-relaxed">
                Dados pessoais mascarados. Acesso ao conteúdo de conversa vinculado exclusivamente
                ao contexto desta denúncia. CPF/CNPJ sempre protegido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
