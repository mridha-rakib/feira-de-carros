'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCoin,
  IconEdit,
  IconEye,
  IconGauge,
  IconInfo,
  IconLock,
  IconSend,
  IconShield,
  IconTrendingDown,
  IconTrendingUp,
} from '@/app/components/SellerIcons';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import { useDealerInventoryStore } from '@/stores/use-dealer-inventory-store';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';

const AVAILABLE_FEATURES = [
  'Ar-condicionado',
  'Direção elétrica',
  'Vidros elétricos',
  'Travas elétricas',
  'Bancos de couro',
  'Central multimídia',
  'Câmera de ré',
  'Sensor de estacionamento',
  'Airbags frontais e laterais',
  'Freios ABS',
  'Rodas de liga leve',
  'Controle de estabilidade (ESP)',
  'Piloto automático',
  'Faróis de neblina / LED',
];

export default function DealerEditListingPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = (params?.id as string) || 'dlr-veh-001';

  const { getVehicleById, submitRevision } = useDealerInventoryStore();
  const vehicle = getVehicleById(listingId);

  // Form states for proposed changes
  const [proposedPrice, setProposedPrice] = useState('');
  const [proposedMileage, setProposedMileage] = useState('');
  const [proposedDescription, setProposedDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize values when vehicle loads
  useEffect(() => {
    if (vehicle) {
      if (vehicle.pendingRevision) {
        setProposedPrice(vehicle.pendingRevision.price.toString());
        setProposedMileage(vehicle.pendingRevision.mileageKm.toString());
        setProposedDescription(vehicle.pendingRevision.description || vehicle.description || '');
        setSelectedFeatures(vehicle.pendingRevision.features || vehicle.features || []);
      } else {
        setProposedPrice(vehicle.price.toString());
        setProposedMileage(vehicle.mileageKm.toString());
        setProposedDescription(vehicle.description || '');
        setSelectedFeatures(
          vehicle.features || [
            'Ar-condicionado',
            'Direção elétrica',
            'Vidros elétricos',
            'Freios ABS',
            'Airbag duplo',
          ],
        );
      }
    }
  }, [vehicle]);

  // Delta calculation for price
  const priceDelta = useMemo(() => {
    if (!vehicle) return 0;
    const current = vehicle.price;
    const proposed = Number(proposedPrice) || current;
    return proposed - current;
  }, [vehicle, proposedPrice]);

  const handleToggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat],
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const priceNum = Number(proposedPrice);
    const mileageNum = Number(proposedMileage);

    if (!priceNum || priceNum <= 0) {
      setErrorMsg('Informe um preço anunciado válido.');
      return;
    }
    if (mileageNum === undefined || mileageNum < 0) {
      setErrorMsg('Informe uma quilometragem válida.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitRevision(listingId, {
        price: priceNum,
        mileageKm: mileageNum,
        description: proposedDescription,
        features: selectedFeatures,
      });
      setIsSubmitting(false);
      router.push(`/concessionaria/anuncios/${listingId}/revisoes`);
    }, 300);
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
        <MarketplaceHeader />
        <DealershipSubNav activeItem="concessionarias" />
        <main className="flex-1 max-w-[800px] w-full mx-auto px-4 py-16 text-center">
          <div className="bg-white border border-[#dee6f1] rounded-[16px] p-8 shadow-xs">
            <div className="size-16 rounded-full bg-[#fef2f2] text-[#b91c1c] flex items-center justify-center mx-auto mb-4">
              <IconAlert className="size-8" />
            </div>
            <h1 className="text-[22px] font-bold text-[#17243f]">Veículo não encontrado</h1>
            <p className="text-[14px] text-[#697a95] mt-2 mb-6">
              O veículo solicitado ({listingId}) não foi localizado no estoque da sua
              concessionária.
            </p>
            <Link
              href="/concessionaria/anuncios"
              className="px-6 py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[13px] rounded-[8px] transition-colors inline-block"
            >
              Voltar para o estoque
            </Link>
          </div>
        </main>
        <MarketplaceFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[1020px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[12px] text-[#697a95] mb-4">
          <Link href="/" className="hover:text-[#17243f] transition-colors">
            Início
          </Link>
          <span>›</span>
          <Link href="/concessionaria/anuncios" className="hover:text-[#17243f] transition-colors">
            Estoque
          </Link>
          <span>›</span>
          <span className="font-semibold text-[#17243f]">Editar Anúncio</span>
        </div>

        {/* Heading Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[24px] sm:text-[28px] font-bold text-[#17243f] tracking-tight">
                Editar Anúncio
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-[#475569] border border-gray-200">
                {vehicle.id}
              </span>
            </div>
            <p className="text-[14px] text-[#697a95] mt-1">
              {vehicle.make} {vehicle.model} {vehicle.version} ({vehicle.plate})
            </p>
          </div>

          {vehicle.pendingRevision && (
            <Link
              href={`/concessionaria/anuncios/${vehicle.id}/revisoes`}
              className="px-4 py-2 bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] border border-[#bfdbfe] font-semibold text-[12px] rounded-[8px] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <IconEye className="size-4" />
              <span>Ver comparação de versões</span>
            </Link>
          )}
        </div>

        {/* Revision Governance Notice (Figma WEB-034 / VEH-018) */}
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[12px] p-4 mb-6 flex items-start gap-3">
          <IconShield className="size-5 text-[#2563eb] shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#1e40af] leading-relaxed">
            <p className="font-semibold">Governança de Revisão de Anúncios (VEH-018)</p>
            <p className="mt-0.5 text-[12px] text-[#3b82f6]">
              Por conformidade com as diretrizes do marketplace, alterações de preço e
              características geram uma proposta de revisão que entra em fila de homologação. O
              anúncio atual permanece ativo para os compradores até a validação.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-[#fef2f2] border border-[#fecaca] rounded-[10px] text-[13px] text-[#b91c1c] flex items-center gap-2">
            <IconAlert className="size-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Preço e Ajuste Comercial */}
          <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 shadow-xs">
            <h2 className="text-[17px] font-bold text-[#17243f] mb-4 pb-2 border-b border-[#f1f5f9] flex items-center justify-between">
              <span>Valor Comercial Anunciado</span>
              <span className="text-[12px] text-[#8a99ad] font-normal">
                Valor ativo atual:{' '}
                <strong className="text-[#17243f]">{vehicle.formattedPrice}</strong>
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label
                  htmlFor="edit-price"
                  className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
                >
                  Novo Preço de Venda (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#697a95]">
                    R$
                  </span>
                  <input
                    id="edit-price"
                    type="number"
                    min={1000}
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    data-testid="input-edit-price"
                    className="w-full h-[46px] pl-10 pr-4 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[16px] font-bold text-[#17243f] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Price Delta Indicator */}
              <div className="p-4 bg-[#f8fafc] rounded-[10px] border border-[#e2e8f0]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#697a95] block mb-1">
                  Variação Proposta
                </span>
                {priceDelta === 0 ? (
                  <p className="text-[13px] font-semibold text-[#64748b]">
                    Nenhuma alteração de valor
                  </p>
                ) : priceDelta < 0 ? (
                  <div className="flex items-center gap-2 text-[#16a34a]">
                    <IconTrendingDown className="size-5" />
                    <span className="text-[16px] font-bold">
                      - R$ {Math.abs(priceDelta).toLocaleString('pt-BR')} (Redução de preço)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[#d97706]">
                    <IconTrendingUp className="size-5" />
                    <span className="text-[16px] font-bold">
                      + R$ {priceDelta.toLocaleString('pt-BR')} (Aumento de preço)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Quilometragem Atualizada */}
          <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 shadow-xs">
            <h2 className="text-[17px] font-bold text-[#17243f] mb-4 pb-2 border-b border-[#f1f5f9] flex items-center justify-between">
              <span>Odômetro / Quilometragem</span>
              <span className="text-[12px] text-[#8a99ad] font-normal">
                Km ativo:{' '}
                <strong className="text-[#17243f]">
                  {vehicle.mileageKm.toLocaleString('pt-BR')} km
                </strong>
              </span>
            </h2>

            <div className="max-w-[340px]">
              <label
                htmlFor="edit-mileage"
                className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
              >
                Quilometragem Atual (km)
              </label>
              <input
                id="edit-mileage"
                type="number"
                min={0}
                value={proposedMileage}
                onChange={(e) => setProposedMileage(e.target.value)}
                data-testid="input-edit-mileage"
                className="w-full h-[44px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[14px] font-semibold text-[#17243f] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Section 3: Opcionais e Descrição */}
          <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 shadow-xs">
            <h2 className="text-[17px] font-bold text-[#17243f] mb-4 pb-2 border-b border-[#f1f5f9]">
              Opcionais e Descrição
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
              {AVAILABLE_FEATURES.map((feature) => {
                const isChecked = selectedFeatures.includes(feature);
                return (
                  <label
                    key={feature}
                    className={`flex items-center gap-2.5 p-2.5 rounded-[8px] border text-[12px] font-medium cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-[#eff6ff] border-[#93c5fd] text-[#1e40af]'
                        : 'bg-[#f8fafc] border-[#dee6f1] text-[#475569] hover:bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleFeature(feature)}
                      className="size-4 text-[#b91c1c] rounded border-gray-300 focus:ring-[#b91c1c]"
                    />
                    <span>{feature}</span>
                  </label>
                );
              })}
            </div>

            <div>
              <label
                htmlFor="edit-description"
                className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
              >
                Descrição do Veículo
              </label>
              <textarea
                id="edit-description"
                rows={4}
                value={proposedDescription}
                onChange={(e) => setProposedDescription(e.target.value)}
                data-testid="textarea-edit-description"
                className="w-full p-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#dee6f1]">
            <Link
              href="/concessionaria/anuncios"
              className="px-4 py-2 text-[13px] font-semibold text-[#697a95] hover:text-[#17243f] transition-colors"
            >
              Cancelar e voltar ao estoque
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="btn-submit-edit-revision"
              className="px-6 py-3 bg-[#b91c1c] hover:bg-[#991b1b] disabled:opacity-50 text-white font-semibold text-[14px] rounded-[8px] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>{isSubmitting ? 'Salvando revisão...' : 'Enviar alterações para revisão'}</span>
              <IconArrowRight className="size-4" />
            </button>
          </div>
        </form>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
