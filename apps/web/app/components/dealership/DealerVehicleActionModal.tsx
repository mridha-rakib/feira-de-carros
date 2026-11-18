'use client';

import { IconCar, IconClock, IconSparkles } from '@/app/components/SellerIcons';
import type { DealerVehicleListing } from '@/lib/adapters/mock-dealer-inventory';
import Link from 'next/link';
import React from 'react';

export type DealerModalType = 'view' | 'edit' | 'renew' | 'd3_boundary' | null;

interface DealerVehicleActionModalProps {
  type: DealerModalType;
  vehicle: DealerVehicleListing | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRenew?: (vehicleId: string) => void;
}

export function DealerVehicleActionModal({
  type,
  vehicle,
  isOpen,
  onClose,
  onConfirmRenew,
}: DealerVehicleActionModalProps) {
  if (!isOpen || !type) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="bg-white border border-[#dee6f1] rounded-[16px] max-w-[520px] w-full p-6 shadow-2xl relative text-[#17243f]">
        {/* D3 Boundary Notice */}
        {type === 'd3_boundary' && (
          <div>
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-full bg-[#fef2f2] text-[#b91c1c] flex items-center justify-center shrink-0">
                <IconSparkles className="size-6" />
              </div>
              <div className="flex-1">
                <h3 id="dealer-modal-title" className="text-[19px] font-bold text-[#17243f]">
                  Publicar Novo Veículo no Estoque
                </h3>
                <p className="text-[13px] text-[#697a95] mt-1.5 leading-relaxed">
                  O assistente de cadastro em lote e fluxo de publicação da concessionária será
                  integrado no <strong>Batch D3</strong> conforme o roadmap oficial.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] text-[13px] text-[#475569] space-y-2">
              <p className="font-semibold text-[#17243f]">Escopo do Batch D2 em andamento:</p>
              <ul className="list-disc list-inside space-y-1 text-[#64748b] text-[12px]">
                <li>Visão geral do inventário de frota (WEB-021)</li>
                <li>Métricas de visualização e engajamento em tempo real (ANA-001)</li>
                <li>Filtros por palavra-chave, status e plano de impulsionamento</li>
                <li>Pausa e reativação rápida de anúncios da frota</li>
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#b91c1c] hover:bg-[#a11818] text-white text-[13px] font-semibold rounded-[8px] transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* View Vehicle Modal */}
        {type === 'view' && vehicle && (
          <div>
            <div className="flex items-start justify-between gap-4 border-b border-[#f1f5f9] pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#b91c1c] uppercase tracking-wider">
                  Detalhes do Anúncio
                </span>
                <h3 id="dealer-modal-title" className="text-[20px] font-bold text-[#17243f] mt-0.5">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-[13px] text-[#697a95]">{vehicle.version}</p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-[#e5f7ed] text-[#14865a]">
                {vehicle.statusLabel}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-[13px]">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#f8fafc] rounded-[10px]">
                <div>
                  <span className="text-[11px] text-[#697a95]">Preço anunciado</span>
                  <p className="text-[17px] font-bold text-[#17243f]">{vehicle.formattedPrice}</p>
                </div>
                <div>
                  <span className="text-[11px] text-[#697a95]">Placa do veículo</span>
                  <p className="text-[14px] font-semibold text-[#17243f]">{vehicle.plate}</p>
                </div>
                <div>
                  <span className="text-[11px] text-[#697a95]">Ano / Modelo</span>
                  <p className="text-[13px] font-medium text-[#17243f]">{vehicle.year}</p>
                </div>
                <div>
                  <span className="text-[11px] text-[#697a95]">Quilometragem</span>
                  <p className="text-[13px] font-medium text-[#17243f]">
                    {vehicle.mileageKm.toLocaleString('pt-BR')} km
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-[#dee6f1] rounded-[10px]">
                <div className="flex items-center gap-2">
                  <IconSparkles className="size-4 text-[#b91c1c]" />
                  <span className="text-[13px] font-medium text-[#17243f]">
                    Plano: {vehicle.planLabel}
                  </span>
                </div>
                <span className="text-[12px] text-[#697a95]">{vehicle.viewsLabel}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white border border-[#dee6f1] hover:bg-[#f8fafc] text-[#17243f] text-[13px] font-semibold rounded-[8px] transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Edit Vehicle Modal */}
        {type === 'edit' && vehicle && (
          <div>
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
                <IconCar className="size-5" />
              </div>
              <div className="flex-1">
                <h3 id="dealer-modal-title" className="text-[19px] font-bold text-[#17243f]">
                  Editar Anúncio
                </h3>
                <p className="text-[13px] text-[#697a95] mt-1">
                  {vehicle.make} {vehicle.model} ({vehicle.plate})
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] space-y-2 text-[13px]">
              <p className="text-[#334155] leading-relaxed">
                As alterações cadastrais de veículos da frota sincronizam com a vitrine pública após
                validação de integridade.
              </p>
              <div className="p-3 bg-white rounded-md border border-[#e2e8f0]">
                <span className="text-[11px] text-[#697a95] block">Preço atual</span>
                <span className="text-[16px] font-bold text-[#17243f]">
                  {vehicle.formattedPrice}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[13px] font-medium text-[#64748b] hover:text-[#17243f]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#b91c1c] hover:bg-[#a11818] text-white text-[13px] font-semibold rounded-[8px] transition-colors"
              >
                Concluir edição
              </button>
            </div>
          </div>
        )}

        {/* Renew Vehicle Modal */}
        {type === 'renew' && vehicle && (
          <div>
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
                <IconClock className="size-5" />
              </div>
              <div className="flex-1">
                <h3 id="dealer-modal-title" className="text-[19px] font-bold text-[#17243f]">
                  Renovar Validade do Anúncio
                </h3>
                <p className="text-[13px] text-[#697a95] mt-1">
                  {vehicle.make} {vehicle.model} ({vehicle.plate})
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-[#fffbeb] border border-[#fef3c7] rounded-[10px] text-[13px] text-[#92400e] space-y-1">
              <p className="font-semibold">Este anúncio expira em breve.</p>
              <p className="text-[12px] leading-relaxed">
                Ao renovar, o anúncio terá sua validade estendida por mais 30 dias na vitrine de
                seminovos.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3 flex-wrap">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[13px] font-medium text-[#64748b] hover:text-[#17243f]"
              >
                Cancelar
              </button>
              <Link
                href={`/concessionaria/anuncios/${vehicle.id}/renovar`}
                onClick={onClose}
                className="px-4 py-2 border border-[#d97706] text-[#b45309] hover:bg-[#fffbeb] text-[13px] font-semibold rounded-[8px] transition-colors"
              >
                Opções de Pagamento
              </Link>
              <button
                type="button"
                onClick={() => {
                  onConfirmRenew?.(vehicle.id);
                  onClose();
                }}
                className="px-5 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white text-[13px] font-semibold rounded-[8px] transition-colors"
              >
                Confirmar renovação
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
