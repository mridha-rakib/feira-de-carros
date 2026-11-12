import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  History,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Tag,
  User,
  XCircle,
} from 'lucide-react';
import * as React from 'react';
import type { AdminUserRecord } from '../../../lib/types/users-presentation';
import { UserAvatar } from './UserAvatar';
import { UserRoleBadge, UserStatusBadge } from './UserStatusBadge';

interface UserDetailPanelProps {
  user: AdminUserRecord | null;
  onOpenDossier: (user: AdminUserRecord) => void;
  onRequestStatusChange: (user: AdminUserRecord, action: 'ACTIVATE' | 'SUSPEND' | 'BAN') => void;
}

export function UserDetailPanel({
  user,
  onOpenDossier,
  onRequestStatusChange,
}: UserDetailPanelProps) {
  if (!user) {
    return (
      <div
        data-testid="selected-user-detail-panel"
        className="col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col items-center justify-center text-center min-h-[400px] text-slate-400"
      >
        <User className="w-12 h-12 stroke-[1.5] mb-2 text-slate-300" />
        <p className="font-semibold text-slate-700 text-sm">Nenhum usuário selecionado</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Selecione uma linha da tabela para visualizar o dossiê detalhado.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="selected-user-detail-panel"
      className="col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 sticky top-6"
    >
      {/* User Header Card */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="lg" className="shadow-xs" />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold text-slate-900 leading-snug">{user.name}</h2>
              {user.verified && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            </div>
            <span className="text-xs text-slate-500 font-mono">{user.code}</span>
          </div>
        </div>
        <UserStatusBadge status={user.status} />
      </div>

      {/* Quick Profile Overview (Figma Reference Detail Panel) */}
      <div className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Perfil / Papel
            </span>
            <UserRoleBadge role={user.role} className="mt-1" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Cidade / Estado
            </span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              {user.city}, {user.state}
            </span>
          </div>
        </div>

        {/* Contact & Identification */}
        <div className="space-y-2 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              E-mail:
            </span>
            <span className="font-semibold select-all truncate max-w-[180px]">{user.email}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Telefone:
            </span>
            <span className="font-semibold select-all">{user.phone}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Documento:
            </span>
            <span className="font-mono text-slate-800 font-medium">
              {user.document}{' '}
              <span className="text-[10px] text-slate-400 font-normal">(LGPD Mascarado)</span>
            </span>
          </div>
        </div>

        {/* Dealership Details (If Dealer - ADM-D-003-DETAIL-03) */}
        {user.dealership && (
          <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-sky-900 text-xs">
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>{user.dealership.tradeName}</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                {user.dealership.plan}
              </span>
            </div>
            <p className="text-[11px] text-sky-800">
              {user.dealership.inventoryCount} veículos no catálogo ativo
            </p>
            <p className="text-[11px] text-slate-500 truncate">{user.dealership.address}</p>
          </div>
        )}

        {/* User Activity Counters */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Anúncios</span>
            <span className="text-base font-black text-slate-900">
              {user.activity.activeListings}
            </span>
            <span className="text-[9px] text-slate-400 block">ativos</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">
              Favoritos
            </span>
            <span className="text-base font-black text-slate-900">
              {user.activity.favoritesCount}
            </span>
            <span className="text-[9px] text-slate-400 block">salvos</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">
              Denúncias
            </span>
            <span
              className={`text-base font-black ${
                user.activity.reportsReceived > 0 ? 'text-red-600' : 'text-slate-900'
              }`}
            >
              {user.activity.reportsReceived}
            </span>
            <span className="text-[9px] text-slate-400 block">recebidas</span>
          </div>
        </div>

        {/* Suspension Alert (ADM-D-003-DETAIL-05 — Lucas Ribeiro) */}
        {user.statusReason && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Motivo do Bloqueio / Suspensão:</span>
            </div>
            <p className="text-[11px] text-red-800 leading-relaxed font-medium">
              {user.statusReason}
            </p>
          </div>
        )}

        {/* Audit Log Snippet */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <History className="w-3.5 h-3.5 text-slate-400" />
              Último Evento de Auditoria
            </span>
            <span className="text-[10px] text-slate-400">{user.auditTrail[0]?.timestamp}</span>
          </div>
          {user.auditTrail[0] ? (
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{user.auditTrail[0].action}</span>
                <span className="text-[10px] text-slate-400">
                  Por: {user.auditTrail[0].operator}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{user.auditTrail[0].reason}</p>
            </div>
          ) : (
            <p className="text-[10px] text-slate-400 italic">Sem eventos registrados</p>
          )}
        </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onOpenDossier(user)}
          className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Abrir Dossiê Completo
        </button>

        {/* Quick Administrative Action Trigger Buttons (ADM-D-009 / RBAC) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {user.status !== 'ACTIVE' ? (
            <button
              type="button"
              onClick={() => onRequestStatusChange(user, 'ACTIVATE')}
              className="py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Reativar Conta
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onRequestStatusChange(user, 'SUSPEND')}
              className="py-2 px-3 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-orange-200"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
              Suspender
            </button>
          )}

          {user.status !== 'BANNED' && (
            <button
              type="button"
              onClick={() => onRequestStatusChange(user, 'BAN')}
              className="py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-red-200"
            >
              <XCircle className="w-3.5 h-3.5 text-red-600" />
              Bloquear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
