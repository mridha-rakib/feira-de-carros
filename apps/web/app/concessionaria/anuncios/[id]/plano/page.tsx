'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCard,
  IconCheck,
  IconClock,
  IconEye,
  IconInfo,
  IconLock,
  IconShield,
  IconSparkles,
  IconStar,
} from '@/app/components/SellerIcons';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import { createDealerOrder } from '@/lib/adapters/dealer-orders-adapter';
import { useDealerInventoryStore } from '@/stores/use-dealer-inventory-store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DealershipPlanSelectionPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const vehicleId = resolvedParams.id;
  const router = useRouter();

  const { vehicles } = useDealerInventoryStore();
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  const [selectedPlanId, setSelectedPlanId] = useState<'essential' | 'premium'>(
    vehicle?.plan === 'essential' ? 'essential' : 'premium',
  );
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX');

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#f5f8fd] flex flex-col font-sans">
        <MarketplaceHeader />
        <DealershipSubNav activeItem="concessionarias" />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 py-12">
          <div className="bg-white border border-[#dee6f1] rounded-[16px] p-8 max-w-[560px] mx-auto text-center shadow-xs">
            <div className="size-14 rounded-full bg-[#fee2e2] text-[#b91c1c] flex items-center justify-center mx-auto mb-4">
              <IconAlert className="size-6" />
            </div>
            <h1 className="text-[20px] font-bold text-[#16243c] mb-2">Veículo não encontrado</h1>
            <p className="text-[13px] text-[#63738e] mb-6">
              O veículo solicitado ({vehicleId}) não foi localizado no estoque da sua
              concessionária.
            </p>
            <Link
              href="/concessionaria/anuncios"
              className="inline-flex items-center gap-2 px-6 h-[44px] rounded-[8px] bg-[#b91c1c] text-white font-semibold text-[13px] hover:bg-[#991b1b] transition-colors"
            >
              <IconArrowLeft className="size-4" />
              <span>Voltar ao estoque</span>
            </Link>
          </div>
        </main>
        <MarketplaceFooter />
      </div>
    );
  }

  const handleProceed = () => {
    const order = createDealerOrder({
      vehicleId: vehicle.id,
      vehicleTitle: `${vehicle.make} ${vehicle.model} ${vehicle.version}`,
      vehiclePlate: vehicle.plate,
      vehiclePrice: vehicle.formattedPrice,
      vehicleImageUrl: vehicle.imageUrl,
      type: 'plan',
      planId: selectedPlanId,
      paymentMethod,
    });

    if (paymentMethod === 'PIX') {
      router.push(`/concessionaria/pedidos/${order.id}/pix`);
    } else {
      router.push(`/concessionaria/pedidos/${order.id}/cartao`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8fd] flex flex-col font-sans text-[#16243c]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-6 pb-20">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[12px] text-[#63738e] mb-4"
        >
          <Link href="/" className="hover:text-[#16243c] transition-colors">
            Início
          </Link>
          <span>›</span>
          <Link href="/concessionaria/anuncios" className="hover:text-[#16243c] transition-colors">
            Estoque
          </Link>
          <span>›</span>
          <span className="font-semibold text-[#16243c]">Alterar plano</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <Link
            href="/concessionaria/anuncios"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#63738e] hover:text-[#16243c] mb-2"
          >
            <IconArrowLeft className="size-4" />
            <span>Voltar ao estoque</span>
          </Link>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#16243c] tracking-tight">
            Selecione o Plano de Publicação
          </h1>
          <p className="text-[14px] text-[#63738e] mt-1">
            Escolha o nível de visibilidade para acelerar as vendas da sua frota.
          </p>
        </div>

        {/* Vehicle Summary Card */}
        <div className="bg-white border border-[#dee6f1] rounded-[12px] p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="size-16 rounded-[8px] bg-[#f1f6fd] overflow-hidden shrink-0 relative border border-[#dee6f1]">
              <Image
                src={vehicle.imageUrl || '/images/vehicles/demo/sedan-fallback.svg'}
                alt={vehicle.model}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <div className="font-bold text-[15px] text-[#16243c]">
                {vehicle.make} {vehicle.model} {vehicle.version}
              </div>
              <div className="text-[12px] text-[#63738e] mt-0.5">
                Placa: <span className="font-semibold text-[#16243c]">{vehicle.plate}</span> • Ano:{' '}
                {vehicle.year}
              </div>
              <div className="text-[13px] font-bold text-[#b91c1c] mt-0.5">
                {vehicle.formattedPrice}
              </div>
            </div>
          </div>
          <div className="sm:text-right">
            <span className="text-[11px] text-[#63738e] block">Plano atual</span>
            <span className="inline-block mt-0.5 text-[12px] font-semibold text-[#16243c] bg-[#f1f6fd] px-2.5 py-1 rounded-full border border-[#dee6f1]">
              {vehicle.planLabel}
            </span>
          </div>
        </div>

        {/* Plans Grid (Figma WEB-029) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Plano Essencial */}
          <button
            type="button"
            onClick={() => setSelectedPlanId('essential')}
            className={`text-left w-full border rounded-[14px] p-6 bg-white cursor-pointer transition-all relative flex flex-col justify-between ${
              selectedPlanId === 'essential'
                ? 'border-[#b91c1c] ring-2 ring-[#b91c1c]/20 shadow-md'
                : 'border-[#dee6f1] hover:border-[#cbd5e1] shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[18px] text-[#16243c]">Plano Essencial</h3>
                <span className="text-[12px] font-medium text-[#63738e]">30 dias</span>
              </div>
              <div className="mb-4">
                <span className="text-[28px] font-extrabold text-[#16243c]">R$ 49,90</span>
                <span className="text-[12px] text-[#63738e]"> / anúncio</span>
              </div>
              <ul className="space-y-2.5 text-[13px] text-[#475569] mb-6">
                <li className="flex items-center gap-2">
                  <IconCheck className="size-4 text-[#059669] shrink-0" />
                  <span>30 dias de exibição ativa</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="size-4 text-[#059669] shrink-0" />
                  <span>Até 8 fotos do veículo</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="size-4 text-[#059669] shrink-0" />
                  <span>Listagem no showroom da loja</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="size-4 text-[#059669] shrink-0" />
                  <span>Canal de mensagens direto com compradores</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-[#f1f5f9] w-full">
              <div className="flex items-center gap-2">
                <span
                  className={`size-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedPlanId === 'essential'
                      ? 'border-[#b91c1c] bg-[#b91c1c]'
                      : 'border-[#cbd5e1]'
                  }`}
                >
                  {selectedPlanId === 'essential' && (
                    <span className="size-1.5 rounded-full bg-white" />
                  )}
                </span>
                <span className="text-[13px] font-semibold text-[#16243c]">
                  Selecionar Plano Essencial
                </span>
              </div>
            </div>
          </button>

          {/* Plano Premium (Featured) */}
          <button
            type="button"
            onClick={() => setSelectedPlanId('premium')}
            className={`text-left w-full border rounded-[14px] p-6 bg-white cursor-pointer transition-all relative flex flex-col justify-between ${
              selectedPlanId === 'premium'
                ? 'border-[#b91c1c] ring-2 ring-[#b91c1c]/20 shadow-md'
                : 'border-[#dee6f1] hover:border-[#cbd5e1] shadow-2xs'
            }`}
          >
            <div className="absolute -top-3 right-6 bg-[#b91c1c] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
              <IconSparkles className="size-3" />
              <span>Mais Vendido</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[18px] text-[#16243c]">Plano Premium</h3>
                <span className="text-[12px] font-semibold text-[#b91c1c]">
                  60 dias de exibição
                </span>
              </div>
              <div className="mb-4">
                <span className="text-[28px] font-extrabold text-[#b91c1c]">R$ 89,90</span>
                <span className="text-[12px] text-[#63738e]"> / anúncio</span>
              </div>
              <ul className="space-y-2.5 text-[13px] text-[#475569] mb-6">
                <li className="flex items-center gap-2 font-medium text-[#16243c]">
                  <IconCheck className="size-4 text-[#059669] shrink-0" />
                  <span>60 dias de exibição (o dobro de tempo)</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="size-4 text-[#059669] shrink-0" />
                  <span>Até 20 fotos em alta definição</span>
                </li>
                <li className="flex items-center gap-2 font-medium text-[#b91c1c]">
                  <IconCheck className="size-4 text-[#059669] shrink-0" />
                  <span>Selo de Destaque no topo dos resultados de busca</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="size-4 text-[#059669] shrink-0" />
                  <span>Badge Oficial de Concessionária Verificada</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="size-4 text-[#059669] shrink-0" />
                  <span>Suporte prioritário via WhatsApp</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-[#f1f5f9] w-full">
              <div className="flex items-center gap-2">
                <span
                  className={`size-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedPlanId === 'premium'
                      ? 'border-[#b91c1c] bg-[#b91c1c]'
                      : 'border-[#cbd5e1]'
                  }`}
                >
                  {selectedPlanId === 'premium' && (
                    <span className="size-1.5 rounded-full bg-white" />
                  )}
                </span>
                <span className="text-[13px] font-semibold text-[#b91c1c]">
                  Selecionar Plano Premium (Recomendado)
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 mb-8 shadow-2xs space-y-4">
          <h2 className="font-bold text-[16px] text-[#16243c]">Forma de Pagamento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`flex items-center gap-3 p-3.5 rounded-[10px] border cursor-pointer transition-all ${
                paymentMethod === 'PIX'
                  ? 'border-[#b91c1c] bg-[#fee2e2]/20 font-semibold'
                  : 'border-[#dee6f1] hover:bg-[#f8fafc]'
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                value="PIX"
                checked={paymentMethod === 'PIX'}
                onChange={() => setPaymentMethod('PIX')}
                className="accent-[#b91c1c] size-4"
              />
              <div className="text-[13px]">
                <div className="font-semibold text-[#16243c]">PIX Instantâneo</div>
                <div className="text-[11px] text-[#63738e]">Liberação imediata do plano</div>
              </div>
            </label>

            <label
              className={`flex items-center gap-3 p-3.5 rounded-[10px] border cursor-pointer transition-all ${
                paymentMethod === 'CREDIT_CARD'
                  ? 'border-[#b91c1c] bg-[#fee2e2]/20 font-semibold'
                  : 'border-[#dee6f1] hover:bg-[#f8fafc]'
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                value="CREDIT_CARD"
                checked={paymentMethod === 'CREDIT_CARD'}
                onChange={() => setPaymentMethod('CREDIT_CARD')}
                className="accent-[#b91c1c] size-4"
              />
              <div className="text-[13px]">
                <div className="font-semibold text-[#16243c]">Cartão de Crédito</div>
                <div className="text-[11px] text-[#63738e]">Até 3x sem juros</div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#dee6f1]">
          <div className="text-[13px] text-[#63738e] flex items-center gap-1.5">
            <IconShield className="size-4 text-[#059669]" />
            <span>Ambiente 100% seguro com tecnologia criptografada.</span>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            data-testid="btn-proceed-checkout"
            className="w-full sm:w-auto h-[48px] px-8 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Prosseguir para pagamento</span>
            <IconArrowRight className="size-4" />
          </button>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
