'use client';

import {
  AlertTriangle,
  BadgePercent,
  Calendar,
  Car,
  CheckCircle2,
  ExternalLink,
  Fuel,
  Gauge,
  Image as ImageIcon,
  Lock,
  MapPin,
  ShieldCheck,
  Tag,
  User,
  X,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import type { ModerationAd, ModerationAdStatus } from '../../lib/types/b2-presentation';
import { VehicleImage } from './VehicleImage';

interface ListingInspectionModalProps {
  ad: ModerationAd | null;
  isOpen: boolean;
  onClose: () => void;
  onDecision?: (id: string, newStatus: ModerationAdStatus, reason?: string) => void;
  readOnly?: boolean;
}

export function ListingInspectionModal({
  ad,
  isOpen,
  onClose,
  onDecision,
  readOnly = false,
}: ListingInspectionModalProps) {
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

  if (!isOpen || !ad) return null;

  const handleConfirmDecision = () => {
    if (readOnly || !onDecision) return;

    if (actionType === 'approve') {
      onDecision(ad.id, 'approved');
      setFeedbackMessage('Anúncio aprovado com sucesso! Disponível no marketplace.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else if (actionType === 'corrections') {
      if (!reasonText.trim()) return;
      onDecision(ad.id, 'corrections', reasonText.trim());
      setFeedbackMessage('Solicitação de ajuste enviada ao anunciante.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else if (actionType === 'reject') {
      if (!reasonText.trim()) return;
      onDecision(ad.id, 'rejected', reasonText.trim());
      setFeedbackMessage('Publicação reprovada. Registro de auditoria gerado.');
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
      aria-labelledby="listing-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-[#0B111E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-400 font-bold">{ad.code}</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-300">Plano: {ad.plan}</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-300">{ad.year}</span>
              </div>
              <h2 id="listing-modal-title" className="text-lg font-bold text-white tracking-tight">
                {ad.title}
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
                  Visualização móvel restrita (ADM-021 / VEH-016)
                </strong>
                <span>
                  Ações operacionais de moderação e publicação são restritas ao terminal desktop por
                  política de segurança.
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

          {/* Pricing & FIPE Validation Strip (Figma UI-043) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200/90 p-3.5 rounded-xl text-left">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                Valor Anunciado
              </span>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                {ad.priceFormatted}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200/90 p-3.5 rounded-xl text-left">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                Referência Tabela FIPE
              </span>
              <span className="text-xl font-bold text-slate-700 tracking-tight">
                {ad.fipePriceFormatted}
              </span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200/90 p-3.5 rounded-xl text-left">
              <span className="text-[11px] text-emerald-700 uppercase tracking-wider block font-semibold mb-1">
                Variação de Mercado
              </span>
              <div className="flex items-center gap-1.5">
                <BadgePercent className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-lg font-bold text-emerald-800">{ad.fipeVariation}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">• Compatível</span>
              </div>
            </div>
          </div>

          {/* Photo Gallery Review Box */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Galeria de Fotos Enviadas (1 de 4 ângulos disponíveis)
                </span>
              </div>
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                3 ângulos pendentes de envio
              </span>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Slot 1: Frontal (Capa) */}
              <div className="aspect-[4/3] rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
                <VehicleImage
                  src={ad.photos[0]}
                  alt={`${ad.title} - Foto Frontal`}
                  fill
                  showDemoBadge
                  sizes="(max-width: 640px) 50vw, 200px"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold block leading-tight">Foto Frontal</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[9px] text-slate-300">Principal (Capa)</span>
                </div>
              </div>

              {/* Slot 2: Traseira */}
              {ad.photos[1] &&
              ad.photos[1] !== ad.photos[0] &&
              !ad.photos[1].includes('fallback') ? (
                <div className="aspect-[4/3] rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
                  <VehicleImage
                    src={ad.photos[1]}
                    alt={`${ad.title} - Traseira`}
                    fill
                    sizes="(max-width: 640px) 50vw, 200px"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold block leading-tight">
                        Foto Traseira
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[9px] text-slate-300">Placa e lanternas</span>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-center">
                  <Car className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-[11px] font-bold text-slate-700">Foto Traseira</span>
                  <span className="text-[9px] font-medium text-amber-600 mt-0.5 px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200">
                    Pendente de envio
                  </span>
                </div>
              )}

              {/* Slot 3: Lateral */}
              {ad.photos[2] &&
              ad.photos[2] !== ad.photos[0] &&
              !ad.photos[2].includes('fallback') ? (
                <div className="aspect-[4/3] rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
                  <VehicleImage
                    src={ad.photos[2]}
                    alt={`${ad.title} - Lateral`}
                    fill
                    sizes="(max-width: 640px) 50vw, 200px"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold block leading-tight">Lateral</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[9px] text-slate-300">Carroceria</span>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-center">
                  <Car className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-[11px] font-bold text-slate-700">Lateral Esquerda</span>
                  <span className="text-[9px] font-medium text-amber-600 mt-0.5 px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200">
                    Pendente de envio
                  </span>
                </div>
              )}

              {/* Slot 4: Painel / Interior */}
              {ad.photos[3] &&
              ad.photos[3] !== ad.photos[0] &&
              !ad.photos[3].includes('fallback') ? (
                <div className="aspect-[4/3] rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
                  <VehicleImage
                    src={ad.photos[3]}
                    alt={`${ad.title} - Interior`}
                    fill
                    sizes="(max-width: 640px) 50vw, 200px"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold block leading-tight">
                        Painel / Interior
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[9px] text-slate-300">Quadro de instrumentos</span>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-center">
                  <Gauge className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-[11px] font-bold text-slate-700">Painel / Interior</span>
                  <span className="text-[9px] font-medium text-amber-600 mt-0.5 px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200">
                    Pendente de envio
                  </span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-2.5 flex items-center justify-between">
              <span>
                • Regra de privacidade: A placa original foi censurada automaticamente pelo sistema
                ({ad.plateMasked}).
              </span>
              <span className="font-mono text-[10px] text-slate-400">DEMO ASSETS • LGPD OK</span>
            </p>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Especificações Técnicas
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Marca / Fabricante</span>
                <span className="font-semibold text-slate-900">{ad.brand}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Modelo / Versão</span>
                <span className="font-semibold text-slate-900">{ad.model}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Ano Fabricação / Modelo</span>
                <span className="font-semibold text-slate-900">{ad.year}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Quilometragem</span>
                <span className="font-semibold text-slate-900">{ad.mileage}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Transmissão / Câmbio</span>
                <span className="font-semibold text-slate-900">{ad.transmission}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Combustível</span>
                <span className="font-semibold text-slate-900">{ad.fuel}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Cor Predominante</span>
                <span className="font-semibold text-slate-900">{ad.color}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Placa (LGPD)</span>
                <span className="font-mono font-semibold text-slate-900">{ad.plateMasked}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Local do Veículo</span>
                <span className="font-semibold text-slate-900">{ad.location}</span>
              </div>
            </div>
          </div>

          {/* Seller Provenance */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                {ad.sellerName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-xs">{ad.sellerName}</span>
                  {ad.sellerVerified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Vendedor Verificado
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 capitalize">
                  {ad.sellerType === 'concessionaria'
                    ? 'Concessionária Parceira'
                    : 'Vendedor Particular'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Data do Envio
              </span>
              <span className="text-xs text-slate-700 font-medium">{ad.submittedAt}</span>
            </div>
          </div>

          {/* Description Review */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Descrição do Veículo
            </h3>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {ad.description}
            </div>
          </div>

          {/* Moderation Form inputs if action selected (Desktop only) */}
          {!readOnly && actionType === 'corrections' && (
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2 animate-in fade-in">
              <label
                htmlFor="ad-corrections-reason"
                className="text-xs font-bold text-sky-900 block"
              >
                Alterações solicitadas ao anunciante:
              </label>
              <textarea
                id="ad-corrections-reason"
                rows={3}
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Informe as correções necessárias (ex: Fotos borradas com marcas d'água de outros sites ou número de telefone visível na placa)..."
                className="w-full text-xs p-2.5 rounded-lg border border-sky-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              />
            </div>
          )}

          {!readOnly && actionType === 'reject' && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2 animate-in fade-in">
              <label htmlFor="ad-reject-reason" className="text-xs font-bold text-red-900 block">
                Motivo obrigatório da reprovação do anúncio:
              </label>
              <textarea
                id="ad-reject-reason"
                rows={3}
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Informe o motivo da não conformidade com os termos de uso..."
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
                Terminal móvel • Ações de moderação indisponíveis
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
                      Reprovar Anúncio
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionType('corrections')}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Solicitar Alteração
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
                      ? 'Reprovação'
                      : actionType === 'corrections'
                        ? 'Envio de Alteração'
                        : 'Publicação'}
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
                    <span>Aprovar e Publicar</span>
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
