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

interface ListingInspectionModalProps {
  ad: ModerationAd | null;
  isOpen: boolean;
  onClose: () => void;
  onDecision: (id: string, newStatus: ModerationAdStatus, reason?: string) => void;
}

export function ListingInspectionModal({
  ad,
  isOpen,
  onClose,
  onDecision,
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

  if (!isOpen || !ad) return null;

  const handleConfirmDecision = () => {
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
                  Galeria de Fotos ({ad.photos.length} imagens)
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 bg-emerald-100/70 font-semibold px-2 py-0.5 rounded-md">
                Resolução validada
              </span>
            </div>

            {/* Photo Card Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="aspect-4/3 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center p-3 relative overflow-hidden border border-slate-800">
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">
                  Capa
                </span>
                <Car className="w-8 h-8 text-slate-500 mb-1" />
                <span className="text-[10px] text-slate-400 font-medium">Foto 1 (Frontal)</span>
              </div>
              <div className="aspect-4/3 rounded-xl bg-slate-200 text-slate-600 flex flex-col items-center justify-center p-3 border border-slate-300">
                <Car className="w-8 h-8 text-slate-400 mb-1" />
                <span className="text-[10px] text-slate-500 font-medium">Foto 2 (Lateral)</span>
              </div>
              <div className="aspect-4/3 rounded-xl bg-slate-200 text-slate-600 flex flex-col items-center justify-center p-3 border border-slate-300">
                <Car className="w-8 h-8 text-slate-400 mb-1" />
                <span className="text-[10px] text-slate-500 font-medium">Foto 3 (Traseira)</span>
              </div>
              <div className="aspect-4/3 rounded-xl bg-slate-200 text-slate-600 flex flex-col items-center justify-center p-3 border border-slate-300">
                <Car className="w-8 h-8 text-slate-400 mb-1" />
                <span className="text-[10px] text-slate-500 font-medium">Foto 4 (Interior)</span>
              </div>
            </div>
          </div>

          {/* Vehicle Specifications Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Ficha Técnica e Informações Cadastrais
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Quilometragem</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-slate-400" />
                  {ad.mileage}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Combustível</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-slate-400" />
                  {ad.fuel}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Câmbio</span>
                <span className="font-bold text-slate-900">{ad.transmission}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Cor</span>
                <span className="font-bold text-slate-900">{ad.color}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Placa Mascarada</span>
                <span className="font-mono font-bold text-slate-900">{ad.plateMasked}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Localidade</span>
                <span className="font-medium text-slate-900 flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  {ad.location}
                </span>
              </div>
              <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Anunciante</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{ad.sellerName}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                    Vendedor Verificado
                  </span>
                </div>
              </div>
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

          {/* Moderation Form inputs if action selected */}
          {actionType === 'corrections' && (
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

          {actionType === 'reject' && (
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
                  (actionType === 'corrections' || actionType === 'reject') && !reasonText.trim()
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
        </div>
      </div>
    </div>
  );
}
