'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconEye,
  IconShield,
  IconSparkles,
  IconStar,
  IconTrendingUp,
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

export default function DealershipVehicleBoostPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const vehicleId = resolvedParams.id;
  const router = useRouter();

  const { vehicles } = useDealerInventoryStore();
  const vehicle = vehicles.find((v) => v.id === vehicleId);

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
              O veículo solicitado ({vehicleId}) não foi localizado no estoque.
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
      type: 'boost',
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

      <main className="flex-1 max-w-[960px] w-full mx-auto px-4 sm:px-6 py-6 pb-20">
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
          <span className="font-semibold text-[#16243c]">Impulsionar veículo</span>
        </nav>

        {/* Header (Figma WEB-036) */}
        <div className="mb-6">
          <Link
            href="/concessionaria/anuncios"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#63738e] hover:text-[#16243c] mb-2"
          >
            <IconArrowLeft className="size-4" />
            <span>Voltar ao estoque</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
              <IconSparkles className="size-5" />
            </div>
            <div>
              <h1 className="text-[26px] sm:text-[30px] font-bold text-[#16243c] tracking-tight">
                Impulsionar Veículo no Topo
              </h1>
              <p className="text-[14px] text-[#63738e] mt-0.5">
                Multiplique o alcance e receba até 2.5x mais mensagens de compradores qualificados.
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Preview */}
        <div className="bg-white border border-[#dee6f1] rounded-[14px] p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="size-20 rounded-[8px] bg-[#f1f6fd] overflow-hidden shrink-0 relative border border-[#dee6f1]">
              <Image
                src={vehicle.imageUrl || '/images/vehicles/demo/sedan-fallback.svg'}
                alt={vehicle.model}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h2 className="font-bold text-[16px] text-[#16243c]">
                {vehicle.make} {vehicle.model} {vehicle.version}
              </h2>
              <div className="text-[13px] text-[#63738e] mt-0.5">
                Placa: <strong className="text-[#16243c]">{vehicle.plate}</strong> • {vehicle.fuel}{' '}
                • {vehicle.transmission}
              </div>
              <div className="text-[14px] font-extrabold text-[#b91c1c] mt-1">
                {vehicle.formattedPrice}
              </div>
            </div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] px-4 py-2.5 rounded-[10px] text-right">
            <div className="text-[11px] text-[#63738e]">Visualizações atuais</div>
            <div className="text-[15px] font-bold text-[#16243c]">{vehicle.viewsLabel}</div>
          </div>
        </div>

        {/* Boost Package Card */}
        <div className="bg-white border-2 border-[#b91c1c] rounded-[16px] p-6 sm:p-8 mb-6 shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f1f5f9]">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#b91c1c] bg-[#fee2e2]/60 px-2.5 py-0.5 rounded-full mb-2">
                Destaque Especial de 7 Dias
              </span>
              <h3 className="text-[22px] font-bold text-[#16243c]">
                Impulsionamento Premium Feira de Carros
              </h3>
              <p className="text-[13px] text-[#63738e] mt-1">
                Posicione seu veículo nas primeiras posições de busca e na vitrine principal.
              </p>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="text-[32px] font-extrabold text-[#b91c1c]">R$ 29,90</span>
              <span className="text-[12px] text-[#63738e] block">pagamento único</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="p-4 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0]">
              <div className="size-8 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-bold text-[14px] mb-2">
                📈
              </div>
              <div className="font-bold text-[14px] text-[#16243c]">+150% Visualizações</div>
              <p className="text-[12px] text-[#63738e] mt-1">
                Aumento médio verificado de compradores visualizando o anúncio.
              </p>
            </div>

            <div className="p-4 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0]">
              <div className="size-8 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center font-bold text-[14px] mb-2">
                ⭐
              </div>
              <div className="font-bold text-[14px] text-[#16243c]">Topo das Buscas</div>
              <p className="text-[12px] text-[#63738e] mt-1">
                Exibido com destaque antes dos veículos padrão da mesma categoria.
              </p>
            </div>

            <div className="p-4 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0]">
              <div className="size-8 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center font-bold text-[14px] mb-2">
                💬
              </div>
              <div className="font-bold text-[14px] text-[#16243c]">Mais Contatos Diretos</div>
              <p className="text-[12px] text-[#63738e] mt-1">
                Leads diretos entregues na sua aba de Mensagens da concessionária.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
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
                <div className="text-[11px] text-[#63738e]">Liberação imediata do destaque</div>
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
                <div className="text-[11px] text-[#63738e]">Aprovação imediata</div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#dee6f1]">
          <div className="text-[13px] text-[#63738e] flex items-center gap-1.5">
            <IconShield className="size-4 text-[#059669]" />
            <span>Transação 100% segura com garantia de exibição.</span>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            data-testid="btn-confirm-boost"
            className="w-full sm:w-auto h-[48px] px-8 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <IconSparkles className="size-4" />
            <span>Confirmar impulsionamento</span>
            <IconArrowRight className="size-4" />
          </button>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
