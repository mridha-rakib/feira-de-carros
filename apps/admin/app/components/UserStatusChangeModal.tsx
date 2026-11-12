'use client';

import { AlertTriangle, CheckCircle2, Lock, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import * as React from 'react';
import type { AdminUserRecord, AdminUserStatus } from '../../lib/types/users-presentation';

interface UserStatusChangeModalProps {
  user: AdminUserRecord | null;
  action: 'ACTIVATE' | 'SUSPEND' | 'BAN' | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string, newStatus: AdminUserStatus, reason: string) => void;
}

export function UserStatusChangeModal({
  user,
  action,
  isOpen,
  onClose,
  onConfirm,
}: UserStatusChangeModalProps) {
  const [reason, setReason] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setReason('');
      setIsSubmitting(false);
      setFeedback(null);
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

  if (!isOpen || !user || !action) return null;

  const getTargetStatus = (): AdminUserStatus => {
    switch (action) {
      case 'ACTIVATE':
        return 'ACTIVE';
      case 'SUSPEND':
        return 'SUSPENDED';
      case 'BAN':
        return 'BANNED';
    }
  };

  const getTitle = () => {
    switch (action) {
      case 'ACTIVATE':
        return 'Reativar Conta de Usuário';
      case 'SUSPEND':
        return 'Suspender Conta Preventivamente';
      case 'BAN':
        return 'Bloquear Conta em Definitivo';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    const newStatus = getTargetStatus();

    setTimeout(() => {
      onConfirm(user.id, newStatus, reason.trim());
      setFeedback(
        action === 'ACTIVATE'
          ? 'Usuário reativado com sucesso!'
          : action === 'SUSPEND'
            ? 'Conta suspensa com sucesso. Registro auditado.'
            : 'Usuário bloqueado e deslogado da plataforma.',
      );

      setTimeout(() => {
        onClose();
      }, 1000);
    }, 400);
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: custom modal overlay
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-modal-title"
      data-testid="user-status-change-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {action === 'ACTIVATE' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            ) : action === 'SUSPEND' ? (
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
            <h3 id="status-modal-title" className="text-sm font-bold text-slate-900">
              {getTitle()}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Usuário Alvo:</span>
              <span className="font-bold text-slate-900">{user.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Código / E-mail:</span>
              <span className="font-mono text-slate-700">
                {user.code} • {user.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Situação Atual:</span>
              <span className="font-semibold text-slate-800">{user.status}</span>
            </div>
          </div>

          {action === 'BAN' && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Atenção:</strong> O bloqueio definitivo encerra todas as sessões ativas,
                oculta anúncios publicados e desabilita qualquer interação no marketplace.
              </span>
            </div>
          )}

          {feedback ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{feedback}</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label htmlFor="status-reason" className="block text-xs font-bold text-slate-800">
                Motivo / Justificativa Regulatória (Obrigatório por LGPD/SRS AUTH-023)
              </label>
              <textarea
                id="status-reason"
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  action === 'ACTIVATE'
                    ? 'Ex: Regularização de documentação comprovada pelo operador.'
                    : action === 'SUSPEND'
                      ? 'Ex: Denúncias reiteradas de anúncio com divergência de quilometragem.'
                      : 'Ex: Violação grave dos Termos de Uso e tentativa comprovada de fraude.'
                }
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 resize-none text-slate-900"
              />
              <span className="text-[11px] text-slate-400 block">
                Esta anotação constará permanentemente no dossiê de auditoria da conta.
              </span>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isSubmitting}
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors disabled:opacity-50 ${
                action === 'ACTIVATE'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : action === 'SUSPEND'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isSubmitting ? 'Processando...' : 'Confirmar Alteração'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
