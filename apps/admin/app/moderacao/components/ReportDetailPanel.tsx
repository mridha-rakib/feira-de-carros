'use client';

import { ReportStatusBadge } from '@/app/moderacao/components/ReportStatusBadge';
import { formatVehiclePrice } from '@/lib/adapters/mock-moderation-data';
import type { ReportRecord } from '@/lib/types/moderation-presentation';
import { AlertTriangle, Building2, ExternalLink, Lock, MapPin, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

interface ReportDetailPanelProps {
  report: ReportRecord | null;
}

export function ReportDetailPanel({ report }: ReportDetailPanelProps) {
  if (!report) {
    return (
      <div
        data-testid="report-detail-empty"
        className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-2xs space-y-3"
      >
        <Shield className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Selecione uma denúncia</p>
        <p className="text-xs text-slate-400">
          Clique em um protocolo para ver o caso selecionado.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid={`report-detail-panel-${report.id}`}
      className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
    >
      {/* Selected Case Header */}
      <div className="px-4 py-3 bg-slate-900 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Caso selecionado
          </span>
          <span className="text-[11px] font-mono font-bold text-white bg-slate-700 px-2 py-0.5 rounded">
            {report.id}
          </span>
        </div>
        <ReportStatusBadge status={report.status} />
      </div>

      {/* Vehicle Image (RPT-DEMO-008 Toyota Corolla) */}
      {report.vehicleImagePath && (
        <div className="relative w-full h-40 bg-slate-100 overflow-hidden">
          <Image
            src={report.vehicleImagePath}
            alt={`Veículo: ${report.vehicleTitle}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 400px"
            onError={() => {
              /* fallback handled by browser */
            }}
          />
          {report.vehicleTitle && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-white font-bold text-sm">{report.vehicleTitle}</p>
              <p className="text-white/80 text-xs">
                {report.sellerName} · {formatVehiclePrice(report.vehiclePriceBrl)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Detail Body */}
      <div className="p-4 space-y-3">
        {/* Key Fields Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Estado</span>
            <ReportStatusBadge status={report.status} />
          </div>
          {report.adId && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Anúncio</span>
              <span className="font-mono font-semibold text-slate-800">{report.adId}</span>
            </div>
          )}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Protocolo</span>
            <span className="font-mono font-semibold text-slate-800">{report.id}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Categoria</span>
            <span className="text-slate-700">{report.categoryLabel}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Reportado em
            </span>
            <span className="text-slate-700">{report.reportedAt}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Conclusão</span>
            <span className="text-slate-700">{report.conclusionLabel}</span>
          </div>
        </div>

        {/* Seller Row */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900">{report.sellerName}</span>
          </div>
          {report.sellerLocation && (
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{report.sellerLocation}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>CNPJ: {report.sellerCnpjMasked}</span>
          </div>
        </div>

        {/* Navigate CTA */}
        {report.adId && (
          <Link
            href={`/moderacao/${report.id}`}
            data-testid={`view-full-report-${report.id}`}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver anúncio completo
          </Link>
        )}
        {!report.adId && (
          <Link
            href={`/moderacao/${report.id}`}
            data-testid={`view-full-report-${report.id}`}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver detalhes do relatório
          </Link>
        )}

        {/* Privacy Notice */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-2 text-xs text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Revisão limitada ao contexto denunciado.</strong> Um report pode justificar
              revisão específica de evidência apresentada, não acesso irrestrito a conversas
              privadas. Permissões Support ainda DENY_PENDING.
            </p>
          </div>
        </div>

        {/* Avaliação do Report */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Avaliação do report
          </p>
          <div className="space-y-1.5">
            {report.evidence.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{ev.label}</span>
                <span className="font-semibold text-slate-800">{ev.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RBAC Notice */}
        <div className="p-3 rounded-xl bg-slate-900 text-white text-[11px]">
          <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1.5">
            Permissões por papel e LGPD
          </p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Main Admin</span>
              <span className="text-emerald-400 font-semibold">Revisão e medida autorizada</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Support</span>
              <span className="text-red-400 font-semibold">DENY_PENDING — não executar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Chat privado</span>
              <span className="text-amber-400 font-semibold">Somente contexto + autorização</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">CPF/CNPJ</span>
              <span className="text-slate-300 font-semibold">Sempre com proteção</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
