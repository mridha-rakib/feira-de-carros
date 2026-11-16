'use client';

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  FileText,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  User,
  X,
  XCircle,
} from 'lucide-react';
import * as React from 'react';
import type { SellerApplication, SellerApplicationStatus } from '../../lib/types/b2-presentation';

interface SellerInspectionModalProps {
  application: SellerApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onDecision?: (id: string, newStatus: SellerApplicationStatus, reason?: string) => void;
  readOnly?: boolean;
}

export function SellerInspectionModal({
  application,
  isOpen,
  onClose,
  onDecision,
  readOnly = false,
}: SellerInspectionModalProps) {
  const [actionType, setActionType] = React.useState<'approve' | 'corrections' | 'reject' | null>(
    null,
  );
  const [reasonText, setReasonText] = React.useState('');
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setActionType(null);
      setReasonText('');
      setFeedbackMessage(null);
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

  if (!isOpen || !application) return null;

  const handleConfirmDecision = () => {
    if (readOnly || !onDecision) return;

    if (actionType === 'approve') {
      onDecision(application.id, 'approved');
      setFeedbackMessage('Vendedor aprovado com sucesso! Permissões ativadas.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else if (actionType === 'corrections') {
      if (!reasonText.trim()) return;
      onDecision(application.id, 'corrections', reasonText.trim());
      setFeedbackMessage('Solicitação de correção enviada ao vendedor.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else if (actionType === 'reject') {
      if (!reasonText.trim()) return;
      onDecision(application.id, 'rejected', reasonText.trim());
      setFeedbackMessage('Solicitação recusada. Registro de auditoria gerado.');
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: modal dialog with custom overlay
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="seller-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-[#0B111E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
              {application.type === 'concessionaria' ? (
                <Building2 className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-400 font-bold">
                  {application.code}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-300">
                  {application.type === 'concessionaria'
                    ? 'Concessionária (CNPJ)'
                    : 'Particular (CPF)'}
                </span>
              </div>
              <h2 id="seller-modal-title" className="text-lg font-bold text-white tracking-tight">
                {application.name}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Read-Only Mobile Warning Banner */}
          {readOnly && (
            <div
              data-testid="mobile-readonly-guard-banner"
              className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs font-medium"
            >
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">
                  Visualização móvel restrita (ADM-021 / AUTH-019)
                </strong>
                <span>
                  Ações operacionais de decisão (aprovação/rejeição) são restritas à interface
                  desktop por conformidade de segurança.
                </span>
              </div>
            </div>
          )}

          {/* Feedback banner */}
          {feedbackMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Identification & Cadastral Data */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Dados Cadastrais e Contato
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Nome / Razão Social</span>
                <span className="font-semibold text-slate-900">{application.name}</span>
                {application.tradeName && (
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Nome Fantasia: {application.tradeName}
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Documento Cadastrado</span>
                <span className="font-mono font-semibold text-slate-900">
                  {application.document}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  (Validado via hash seguro • LGPD)
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">E-mail de Contato</span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {application.email}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Telefone / WhatsApp</span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {application.phone}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-slate-500 block mb-0.5">Localidade Operacional</span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {application.city}, {application.state} (Região Vale do Aço / Leste de MG)
                </span>
              </div>
            </div>
          </div>

          {/* Documents Submitted */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Documentos Anexados para Verificação
            </h3>
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Documento de Identificação Oficial (CNH / RG)
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {application.documentProofName}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    alert(`Simulação: Abrindo arquivo ${application.documentProofName}`)
                  }
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <span>Visualizar</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Comprovante de Residência / Domicílio
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {application.addressProofName}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    alert(`Simulação: Abrindo arquivo ${application.addressProofName}`)
                  }
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <span>Visualizar</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>

              {application.type === 'concessionaria' && (
                <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-purple-900 block">
                        Cadastro de Pessoa Jurídica e Frota
                      </span>
                      <span className="text-[11px] text-purple-700">
                        Capacidade de estoque inicial estimada:{' '}
                        <strong>{application.activeInventoryCount || 30} veículos</strong>
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-200/60 text-purple-800">
                    CNPJ Ativo
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Audit Verification Note */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-left">
            <div className="flex items-center gap-1.5 mb-1 text-amber-900 font-bold text-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>Regra de Conformidade e RBAC (SRS AUTH-019 / ADM-009)</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Decisão de credenciamento exclusiva do <strong>Main Admin</strong> no desktop.
              Vendedores aprovados recebem permissão para publicação de veículos. Em caso de recusa
              ou pedido de correção, a justificativa é registrada na trilha de auditoria.
            </p>
          </div>

          {/* Decision Form inputs if action selected (Desktop only) */}
          {!readOnly && actionType === 'corrections' && (
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2 animate-in fade-in">
              <label htmlFor="corrections-reason" className="text-xs font-bold text-sky-900 block">
                Motivo e correções solicitadas ao vendedor:
              </label>
              <textarea
                id="corrections-reason"
                rows={3}
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Descreva exatamente o que precisa ser corrigido (ex: Comprovante de residência ilegível ou desatualizado)..."
                className="w-full text-xs p-2.5 rounded-lg border border-sky-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              />
            </div>
          )}

          {!readOnly && actionType === 'reject' && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2 animate-in fade-in">
              <label htmlFor="reject-reason" className="text-xs font-bold text-red-900 block">
                Motivo obrigatório da rejeição definitiva:
              </label>
              <textarea
                id="reject-reason"
                rows={3}
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Informe a inconformidade documental ou cadastral apurada..."
                className="w-full text-xs p-2.5 rounded-lg border border-red-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          {readOnly ? (
            /* Mobile Read-only footer */
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Terminal móvel • Ações de decisão indisponíveis
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Fechar
              </button>
            </div>
          ) : (
            /* Desktop Interactive Decision Footer */
            <>
              <div className="flex items-center gap-2">
                {!actionType ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActionType('reject')}
                      className="px-3.5 py-2 text-xs font-semibold text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Rejeitar Solicitação
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionType('corrections')}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Solicitar Correção
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActionType(null)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Voltar às opções
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancelar
                </button>

                {actionType ? (
                  <button
                    type="button"
                    onClick={handleConfirmDecision}
                    disabled={
                      (actionType === 'corrections' || actionType === 'reject') &&
                      !reasonText.trim()
                    }
                    className={`px-5 py-2 text-xs font-bold rounded-xl transition-colors text-white ${
                      actionType === 'reject'
                        ? 'bg-red-600 hover:bg-red-700'
                        : actionType === 'corrections'
                          ? 'bg-sky-600 hover:bg-sky-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Confirmar{' '}
                    {actionType === 'reject'
                      ? 'Rejeição'
                      : actionType === 'corrections'
                        ? 'Envio de Correções'
                        : 'Aprovação'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActionType('approve');
                      handleConfirmDecision();
                    }}
                    className="px-5 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Aprovar Vendedor</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
