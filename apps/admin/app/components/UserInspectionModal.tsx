'use client';

import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
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
  X,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import type {
  AdminUserRecord,
  AdminUserRole,
  AdminUserStatus,
} from '../../lib/types/users-presentation';
import { UserAvatar } from '../usuarios/components/UserAvatar';
import { UserStatusBadge } from '../usuarios/components/UserStatusBadge';

interface UserInspectionModalProps {
  user: AdminUserRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenStatusModal?: (action: 'ACTIVATE' | 'SUSPEND' | 'BAN') => void;
  readOnly?: boolean;
}

export function UserInspectionModal({
  user,
  isOpen,
  onClose,
  onOpenStatusModal,
  readOnly = false,
}: UserInspectionModalProps) {
  const [activeTab, setActiveTab] = React.useState<
    'general' | 'dealership' | 'activity' | 'history'
  >('general');

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab('general');
    }
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const getRoleLabel = (role: AdminUserRole) => {
    switch (role) {
      case 'main_admin':
        return 'Admin Principal';
      case 'sales':
        return 'Comercial / Vendas';
      case 'support':
        return 'Suporte Técnico';
      case 'dealer':
        return 'Concessionária / Lojista';
      case 'seller':
        return 'Vendedor Particular';
      case 'member':
        return 'Membro (Comprador)';
      default:
        return role;
    }
  };

  const getRoleBadgeClasses = (role: AdminUserRole) => {
    switch (role) {
      case 'main_admin':
      case 'sales':
      case 'support':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'dealer':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'seller':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: custom modal overlay
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
      data-testid="user-inspection-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h2 id="user-modal-title" className="text-base font-bold text-slate-900">
                  {user.name}
                </h2>
                {user.verified && (
                  <span title="Usuário Verificado" className="inline-flex">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </span>
                )}
                <UserStatusBadge status={user.status} />
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="font-mono text-slate-700 font-medium">{user.code}</span>
                <span>•</span>
                <span>{getRoleLabel(user.role)}</span>
                <span>•</span>
                <span>Cadastrado em {user.registeredAt.split(' ')[0]}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex gap-6 shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'general'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Dados da Conta</span>
          </button>

          {user.dealership && (
            <button
              type="button"
              onClick={() => setActiveTab('dealership')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'dealership'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Concessionária</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'activity'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Atividade no Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Auditoria & Histórico</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status Reason Callout (if suspended/banned) */}
          {user.statusReason && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                user.status === 'BANNED'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-current" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Motivo da Situação Cadastral
                </h4>
                <p className="text-xs mt-1 leading-relaxed">{user.statusReason}</p>
              </div>
            </div>
          )}

          {/* TAB 1: Dados Gerais */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-500" />
                    Identificação Cadastral
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Nome Completo</span>
                      <span className="font-semibold text-slate-900">{user.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">
                        Documento (CPF / CNPJ mascarado LGPD)
                      </span>
                      <span className="font-mono font-medium text-slate-800">{user.document}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Perfil de Acesso</span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getRoleBadgeClasses(
                          user.role,
                        )}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-500" />
                    Contatos & Localização
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">E-mail</span>
                      <span className="font-medium text-slate-900">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Telefone de Contato</span>
                      <span className="font-medium text-slate-800">{user.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Município / UF</span>
                      <span className="font-medium text-slate-800">
                        {user.city} - {user.state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Prazos e Acessos
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Data de Inscrição</span>
                    <span className="font-medium text-slate-800">{user.registeredAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Última Atividade</span>
                    <span className="font-medium text-slate-800">{user.lastAccessAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Validação Documental</span>
                    <span
                      className={`font-semibold ${
                        user.verified ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {user.verified ? 'Verificado e Chancelado' : 'Documentação Pendente'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Concessionária */}
          {activeTab === 'dealership' && user.dealership && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 p-2 shrink-0 flex items-center justify-center">
                  {user.dealership.logoUrl ? (
                    <Image
                      src={user.dealership.logoUrl}
                      alt={user.dealership.tradeName}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      {user.dealership.tradeName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Plano {user.dealership.plan}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {user.dealership.corporateName}
                  </p>
                  <p className="text-xs font-mono text-slate-700 mt-1">
                    CNPJ: {user.dealership.cnpj}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Veículos em Estoque</span>
                  <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                    {user.dealership.inventoryCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Telefone Comercial</span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block">
                    {user.dealership.phone}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Cidade da Loja</span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block">
                    {user.dealership.city} - {user.dealership.state}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs">
                <span className="text-slate-500 block text-[11px]">Endereço Físico</span>
                <span className="font-medium text-slate-800">{user.dealership.address}</span>
              </div>
            </div>
          )}

          {/* TAB 3: Atividade */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Anúncios Ativos</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">
                    {user.activity.activeListings}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Total Publicado</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">
                    {user.activity.totalListings}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Veículos Favoritos</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">
                    {user.activity.favoritesCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Denúncias</span>
                  <span
                    className={`text-xl font-black mt-1 block ${
                      user.activity.reportsReceived > 0 ? 'text-red-600' : 'text-slate-900'
                    }`}
                  >
                    {user.activity.reportsReceived}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Engajamento de Navegação
                </h4>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Alertas e Buscas Salvas</span>
                  <span className="font-semibold text-slate-900">
                    {user.activity.savedSearchesCount} consultas configuradas
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Data do Último Acesso Registrado</span>
                  <span className="font-semibold text-slate-900">
                    {user.activity.lastActiveDate}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Auditoria */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Trilha de Modificações e Eventos
              </h4>
              <div className="space-y-2.5">
                {user.auditTrail.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{entry.action}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-medium">
                          {entry.fromStatus} → {entry.toStatus}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {entry.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{entry.reason}</p>
                    <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Operador: <strong className="text-slate-700">{entry.operator}</strong> (
                        {entry.operatorRole})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {readOnly ? (
            /* MOBILE READ-ONLY POLICY CALLOUT (Figma ADM-M-008 & AUTH-019 / ADM-021) */
            <div className="w-full space-y-3">
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center gap-2 text-slate-700 text-xs">
                <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  Consulta em modo leitura no mobile. Ações de suspensão/bloqueio exigem estação
                  desktop (Main Admin).
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Fechar Visualização
              </button>
            </div>
          ) : (
            /* DESKTOP AUTHORIZED OPERATIONAL DECISION CONTROLS */
            <>
              <div className="flex items-center gap-2">
                {user.status === 'ACTIVE' && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenStatusModal?.('SUSPEND');
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Suspender Conta</span>
                  </button>
                )}

                {(user.status === 'SUSPENDED' || user.status === 'BANNED') && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenStatusModal?.('ACTIVATE');
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Reativar Usuário</span>
                  </button>
                )}

                {user.status !== 'BANNED' && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenStatusModal?.('BAN');
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    Bloquear em Definitivo
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Concluir Inspeção
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
