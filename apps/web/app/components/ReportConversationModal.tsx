'use client';

import { useState } from 'react';
import type {
  BuyerConversation,
  SafetyReportInput,
} from '../../lib/adapters/buyer-messages-adapter';
import { IconAlert, IconCheck, IconCross, IconFlag, IconLock, IconShield } from './SellerIcons';

interface ReportConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: BuyerConversation;
  onReportSubmitted: (report: SafetyReportInput) => void;
}

const REPORT_REASONS = [
  {
    id: 'sinal_antecipado',
    title: 'Pedido de sinal ou pagamento antecipado',
    description: 'O vendedor solicitou valores antes de você ver o veículo presencialmente.',
  },
  {
    id: 'fraude',
    title: 'Fraude ou anúncio falso',
    description: 'Suspeita de golpe, clonagem de anúncio ou informações inverídicas.',
  },
  {
    id: 'indisponivel',
    title: 'Veículo já vendido ou indisponível',
    description: 'O anunciante informou que o veículo não está mais disponível.',
  },
  {
    id: 'ofensivo',
    title: 'Comportamento inadequado ou ofensivo',
    description: 'Linguagem imprópria, ameaças ou desrespeito no chat.',
  },
  {
    id: 'outro',
    title: 'Outro motivo',
    description: 'Qualquer outra irregularidade não listada acima.',
  },
] as const;

export function ReportConversationModal({
  isOpen,
  onClose,
  conversation,
  onReportSubmitted,
}: ReportConversationModalProps) {
  const [selectedReason, setSelectedReason] =
    useState<SafetyReportInput['reason']>('sinal_antecipado');
  const [details, setDetails] = useState('');
  const [blockSeller, setBlockSeller] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SafetyReportInput = {
      conversationId: conversation.id,
      reason: selectedReason,
      details: details.trim() || undefined,
      blockSeller,
    };
    onReportSubmitted(payload);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 bg-[#0e1320]/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleClose();
      }}
    >
      <div className="bg-white rounded-[16px] max-w-[520px] w-full p-6 shadow-2xl border border-[#e2e7ee] relative overflow-hidden">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[#62718a] hover:text-[#14223b] rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Fechar modal"
        >
          <IconCross className="size-4" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0">
                <IconFlag className="size-5 text-[#b91c1c]" />
              </div>
              <div>
                <h3 id="report-modal-title" className="text-[18px] font-bold text-[#14223b]">
                  Denunciar ou Bloquear Anunciante
                </h3>
                <p className="text-[12px] text-[#62718a]">
                  {conversation.sellerName} · {conversation.vehicleTitle}
                </p>
              </div>
            </div>

            <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-[10px] p-3 text-[11px] text-[#92400e] leading-relaxed mb-4 flex items-start gap-2">
              <IconAlert className="size-4 shrink-0 text-[#d97706] mt-0.5" />
              <span>
                Sua denúncia é anônima e será avaliada por nossa equipe de moderação. Nunca faça
                nenhum tipo de pagamento antecipado.
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="block text-[12px] font-bold text-[#14223b] mb-2">
                  Qual é o motivo da denúncia?
                </span>
                <div className="space-y-2">
                  {REPORT_REASONS.map((r) => (
                    <label
                      key={r.id}
                      className={`flex items-start gap-3 p-3 rounded-[10px] border cursor-pointer transition-colors ${
                        selectedReason === r.id
                          ? 'bg-[#fdf2f2] border-[#b91c1c]'
                          : 'bg-white border-[#e0e6f0] hover:bg-[#f8f9fb]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={r.id}
                        checked={selectedReason === r.id}
                        onChange={() => setSelectedReason(r.id)}
                        className="mt-1 text-[#b91c1c] focus:ring-[#b91c1c]"
                      />
                      <div className="text-left">
                        <span className="block text-[13px] font-semibold text-[#14223b]">
                          {r.title}
                        </span>
                        <span className="block text-[11px] text-[#62718a] mt-0.5">
                          {r.description}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="report-details"
                  className="block text-[12px] font-bold text-[#14223b] mb-1"
                >
                  Informações adicionais (opcional)
                </label>
                <textarea
                  id="report-details"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Conte-nos mais detalhes para agilizar a apuração da moderação..."
                  className="w-full p-2.5 bg-white border border-[#e0e6f0] rounded-[8px] text-[12px] text-[#14223b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#b91c1c] resize-none"
                />
              </div>

              <div className="pt-2 border-t border-[#e2e7ee]">
                <label className="flex items-start gap-2.5 p-3 rounded-[10px] bg-[#f8f9fb] border border-[#e2e7ee] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blockSeller}
                    onChange={(e) => setBlockSeller(e.target.checked)}
                    className="mt-0.5 text-[#b91c1c] rounded focus:ring-[#b91c1c]"
                  />
                  <div>
                    <span className="block text-[12px] font-bold text-[#14223b]">
                      Bloquear este vendedor imediatamente
                    </span>
                    <span className="block text-[11px] text-[#62718a]">
                      A conversa será encerrada e você não receberá mais mensagens dele.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 h-[40px] bg-white border border-[#e0e6f0] text-[#14223b] text-[13px] font-medium rounded-[8px] hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 h-[40px] bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[13px] font-bold rounded-[8px] transition-colors shadow-xs"
                >
                  Confirmar Denúncia
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="size-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <IconCheck className="size-7 text-emerald-600 stroke-[3]" />
            </div>
            <h4 className="text-[18px] font-bold text-[#14223b]">Denúncia registrada!</h4>
            <p className="text-[13px] text-[#475569] mt-2 max-w-sm mx-auto leading-relaxed">
              Obrigado por ajudar a manter a Feira de Carros segura. Nossa equipe analisará as
              informações fornecidas.
            </p>
            {blockSeller && (
              <p className="text-[12px] font-medium text-[#b91c1c] mt-2 bg-red-50 p-2 rounded-[8px]">
                O vendedor foi bloqueado. A conversa foi encerrada.
              </p>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full h-[42px] bg-[#14223b] hover:bg-[#0e1726] text-white font-semibold text-[13px] rounded-[8px] transition-colors"
            >
              Concluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
