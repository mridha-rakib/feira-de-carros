'use client';

import type { IntermediatedInquiryRecord } from '@/lib/types/intermediated-inquiries-presentation';
import {
  Car,
  ExternalLink,
  MessageSquare,
  Phone,
  Shield,
  ShieldAlert,
  User,
  UserCheck,
  UserX,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type * as React from 'react';

interface InquiryDetailPanelProps {
  inquiry: IntermediatedInquiryRecord | undefined;
}

export function InquiryDetailPanel({ inquiry }: InquiryDetailPanelProps) {
  if (!inquiry) {
    return (
      <div
        data-testid="inquiry-detail-empty"
        className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center text-slate-400 shadow-2xs"
      >
        <Shield className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        <p className="text-xs font-semibold">Nenhuma consulta selecionada</p>
      </div>
    );
  }

  return (
    <div
      data-testid="inquiry-detail-panel"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-5 sticky top-6"
    >
      {/* Header Banner */}
      <div>
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
          Consulta Selecionada • {inquiry.id}
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              {inquiry.vehicleTitle}
            </h3>
            <p className="text-xs text-red-600 font-bold mt-0.5">{inquiry.vehiclePriceFormatted}</p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {inquiry.statusLabel}
          </span>
        </div>
      </div>

      {/* Vehicle Photograph (Approved Original Corolla Image) */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
        <Image
          src={inquiry.vehicleImageUrl}
          alt={inquiry.vehicleTitle}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
          priority
        />
        <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
          {inquiry.advertisementId} • Feira Presencial
        </div>
      </div>

      {/* Tripartite Mediation Actors Dossier */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5 text-xs">
        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          Atores da Mediação
        </div>

        {/* 1. Buyer */}
        <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
          <span className="text-slate-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            Comprador interessado:
          </span>
          <span className="font-bold text-slate-900">{inquiry.buyerName}</span>
        </div>

        {/* 2. Owner */}
        <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
          <span className="text-slate-500 flex items-center gap-1.5">
            <UserX className="w-3.5 h-3.5 text-amber-600" />
            Proprietário presencial:
          </span>
          <div className="text-right">
            <span className="font-bold text-slate-900 block">{inquiry.ownerName}</span>
            <span className="text-[10px] text-amber-700 font-medium block">
              Sem conta cadastrada
            </span>
          </div>
        </div>

        {/* 3. Representative */}
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-red-600" />
            Representante institucional:
          </span>
          <span className="font-bold text-red-700">{inquiry.representativeName}</span>
        </div>
      </div>

      {/* Safe Contact & Status Details */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            Telefone de contato:
          </span>
          <span className="font-mono text-slate-700 font-medium">{inquiry.contactPhoneMasked}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-400">Última mensagem:</span>
          <span className="font-medium text-slate-700">{inquiry.lastMessageDate}</span>
        </div>
      </div>

      {/* Action Links */}
      <div className="pt-2 flex flex-col gap-2">
        <Link
          href={`/consultas-intermediadas/${inquiry.id}`}
          data-testid="view-mediated-conversation-btn"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ver conversa mediada (ADM-D-044)</span>
        </Link>
      </div>
    </div>
  );
}
