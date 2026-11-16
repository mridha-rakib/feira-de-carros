'use client';

import type { StaffMember } from '@/lib/types/staff-presentation';
import {
  Calendar,
  Clock,
  Edit3,
  ExternalLink,
  Headphones,
  Lock,
  Mail,
  MapPin,
  Shield,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';

interface StaffDetailPanelProps {
  staff: StaffMember | undefined;
}

export function StaffDetailPanel({ staff }: StaffDetailPanelProps) {
  if (!staff) {
    return (
      <div
        data-testid="staff-detail-panel-empty"
        className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center text-slate-400 shadow-2xs"
      >
        <Shield className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        <p className="text-xs font-semibold">Nenhum colaborador selecionado</p>
      </div>
    );
  }

  return (
    <div
      data-testid="staff-detail-panel"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-5 sticky top-6"
    >
      {/* Header Banner */}
      <div>
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
          Colaborador Selecionado • {staff.id}
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{staff.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{staff.department}</p>
          </div>
          {staff.status === 'active' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Ativo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Suspenso
            </span>
          )}
        </div>
      </div>

      {/* Role & Access Pill */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {staff.role === 'sales' ? (
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
              <Headphones className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="text-xs font-bold text-slate-900 capitalize">
              Equipe {staff.role === 'sales' ? 'Vendas' : 'Suporte'}
            </div>
            <div className="text-[10px] text-slate-500">Papel operacional limitado</div>
          </div>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
          DENY_PENDING
        </span>
      </div>

      {/* Key-Value Details */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            E-mail institucional
          </span>
          <span className="font-mono text-slate-700 font-medium">{staff.emailMasked}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Localização
          </span>
          <span className="font-medium text-slate-700">{staff.location}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Cadastrado em
          </span>
          <span className="font-medium text-slate-700">{staff.createdAt}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Último acesso
          </span>
          <span className="font-medium text-slate-700">{staff.lastAccess}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Autorização
          </span>
          <span className="font-semibold text-amber-700 text-[11px]">12 operações em HOLD</span>
        </div>
      </div>

      {/* Scope / Notes */}
      <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 text-[11px] text-slate-600 leading-relaxed">
        <strong className="block text-slate-800 font-bold mb-0.5">Escopo de Atuação:</strong>
        {staff.notes}
      </div>

      {/* Action Links */}
      <div className="pt-2 flex flex-col gap-2">
        <Link
          href={`/equipe/${staff.id}`}
          data-testid="edit-staff-btn"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editar colaborador (ADM-D-039)</span>
        </Link>

        <Link
          href="/equipe/permissoes"
          data-testid="view-permissions-matrix-btn"
          className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Revisar matriz de permissões (ADM-D-040)</span>
        </Link>
      </div>
    </div>
  );
}
