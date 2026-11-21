'use client';

import { useEffect, useState } from 'react';
import type { PublicVehicleItem } from '../../lib/adapters/buyer-catalog-adapter';
import { IconAlert, IconCheckCircle, IconCross, IconFlag, IconShield } from './SellerIcons';

interface ReportListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: PublicVehicleItem;
}

const REPORT_REASONS = [
  'Preço incorreto ou divergente da realidade',
  'Veículo já foi vendido ou indisponível',
  'Suspeita de golpe, fraude ou dados falsos',
  'Veículo clonado, sinistrado ou com leilão omitido',
  'Telefone ou dados de contato inexistentes',
  'Fotos ou conteúdo impróprio/inadequado',
  'Outro motivo',
];

export function ReportListingModal({ isOpen, onClose, vehicle }: ReportListingModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [protocol, setProtocol] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsSubmitted(false);
    setSelectedReason('');
    setDescription('');
    setEmail('');
    setError('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      setError('Por favor, selecione o motivo da denúncia.');
      return;
    }

    // Generate client-side protocol number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const generatedProtocol = `DEN-2026-${randomSuffix}`;
    setProtocol(generatedProtocol);
    setIsSubmitted(true);
    setError('');
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
      <div className="bg-white rounded-[16px] max-w-[500px] w-full p-6 sm:p-7 shadow-xl border border-[#e2e7ee] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[#62718a] hover:text-[#14223b] rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Fechar"
        >
          <IconCross className="size-4" />
        </button>

        {!isSubmitted ? (
          /* Step 1: Report Form matching Figma 1212:3890 */
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-[#fee2e2] border border-[#fca5a5] flex items-center justify-center shrink-0">
                <IconFlag className="size-5 text-[#b91c1c]" />
              </div>
              <div>
                <h3
                  id="report-modal-title"
                  className="text-[18px] sm:text-[20px] font-bold text-[#14223b]"
                >
                  Denunciar anúncio
                </h3>
                <p className="text-[12px] text-[#62718a]">
                  {vehicle.title} · {vehicle.version}
                </p>
              </div>
            </div>

            <p className="text-[13px] text-[#48566a] mb-4">
              Ajude-nos a manter a plataforma segura. Selecione o motivo que melhor descreve o
              problema encontrado:
            </p>

            {error && (
              <div className="bg-[#fff1f0] border border-[#fecaca] text-[#b91c1c] text-[12px] p-3 rounded-[8px] mb-4 flex items-center gap-2">
                <IconAlert className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reason Radios */}
              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-start gap-3 p-3 rounded-[8px] border cursor-pointer transition-colors ${
                      selectedReason === reason
                        ? 'border-[#b91c1c] bg-[#fff5f5]'
                        : 'border-[#e0e6f0] bg-white hover:bg-[#f8f9fb]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => {
                        setSelectedReason(reason);
                        setError('');
                      }}
                      className="mt-0.5 text-[#b91c1c] focus:ring-[#b91c1c]"
                    />
                    <span className="text-[13px] text-[#14223b] font-medium leading-snug">
                      {reason}
                    </span>
                  </label>
                ))}
              </div>

              {/* Description TextArea */}
              <div>
                <label
                  htmlFor="report-description"
                  className="block text-[12px] font-medium text-[#14223b] mb-1"
                >
                  Detalhes adicionais (opcional)
                </label>
                <textarea
                  id="report-description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva detalhes que ajudem a equipe de moderação a entender o caso..."
                  maxLength={500}
                  className="w-full p-3 bg-white border border-[#e0e6f0] rounded-[8px] text-[13px] text-[#14223b] placeholder-[#94a3b8] focus:outline-none focus:border-[#b91c1c] resize-none"
                />
                <span className="block text-[11px] text-[#94a3b8] text-right">
                  {description.length}/500
                </span>
              </div>

              {/* Email (optional) */}
              <div>
                <label
                  htmlFor="report-email"
                  className="block text-[12px] font-medium text-[#14223b] mb-1"
                >
                  Seu e-mail para acompanhamento (opcional)
                </label>
                <input
                  id="report-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full h-[40px] px-3 bg-white border border-[#e0e6f0] rounded-[8px] text-[13px] text-[#14223b] placeholder-[#94a3b8] focus:outline-none focus:border-[#b91c1c]"
                />
              </div>

              {/* Notice */}
              <div className="bg-[#f8f9fb] border border-[#e2e7ee] rounded-[8px] p-3 text-[11px] text-[#62718a] flex items-start gap-2">
                <IconShield className="size-4 text-[#1463c7] shrink-0 mt-0.5" />
                <span>
                  Sua denúncia será avaliada de forma anônima pela equipe de moderação da Feira de
                  Carros.
                </span>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 h-[42px] bg-white border border-[#e0e6f0] hover:bg-[#f5f7fb] text-[#14223b] font-medium text-[13px] rounded-[8px] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 h-[42px] bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[13px] rounded-[8px] transition-colors shadow-xs"
                >
                  Enviar denúncia
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Step 2: Confirmation State matching Figma 1212:3977 */
          <div className="text-center py-2">
            <div className="size-14 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center mx-auto mb-4">
              <IconCheckCircle className="size-8 text-[#059669]" />
            </div>

            <h3 className="text-[20px] font-bold text-[#14223b] mb-2">
              Denúncia enviada com sucesso
            </h3>

            <p className="text-[13px] text-[#62718a] leading-relaxed max-w-sm mx-auto mb-5">
              Recebemos suas informações. Nossa equipe de moderação investigará o anúncio para
              manter a Feira de Carros um ambiente confiável.
            </p>

            {/* Protocol Display */}
            <div className="bg-[#f8f9fb] border border-[#e0e6f0] rounded-[10px] p-3.5 mb-6 text-center">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700 mb-1">
                DEMO PROTOCOL
              </span>
              <p className="text-[11px] font-medium text-[#62718a] uppercase tracking-wide">
                Protocolo de atendimento simulado
              </p>
              <p className="text-[18px] font-black font-mono text-[#14223b] mt-1">{protocol}</p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full h-[44px] bg-[#14223b] hover:bg-[#0e1320] text-white font-semibold text-[13px] rounded-[8px] transition-colors"
            >
              Concluir e fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
