'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCard,
  IconCheck,
  IconLock,
  IconShield,
} from '@/app/components/SellerIcons';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import {
  type DealerOrder,
  getDealerOrderById,
  updateDealerOrderStatus,
} from '@/lib/adapters/dealer-orders-adapter';
import { useDealerInventoryStore } from '@/stores/use-dealer-inventory-store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { use, useEffect, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DealershipCardCheckoutPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const { updateVehiclePlan, boostVehicle, renewVehicle } = useDealerInventoryStore();

  const [order, setOrder] = useState<DealerOrder | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loaded = getDealerOrderById(orderId);
    if (loaded) {
      setOrder(loaded);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f5f8fd] flex flex-col font-sans">
        <MarketplaceHeader />
        <DealershipSubNav activeItem="concessionarias" />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 py-12">
          <div className="bg-white border border-[#dee6f1] rounded-[16px] p-8 max-w-[560px] mx-auto text-center shadow-xs">
            <div className="size-14 rounded-full bg-[#fee2e2] text-[#b91c1c] flex items-center justify-center mx-auto mb-4">
              <IconAlert className="size-6" />
            </div>
            <h1 className="text-[20px] font-bold text-[#16243c] mb-2">Pedido não localizado</h1>
            <p className="text-[13px] text-[#63738e] mb-6">
              O pedido ({orderId}) não foi encontrado ou expirou.
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const cleanNum = cardNumber.replace(/\s/g, '');
    if (cleanNum.length < 15) {
      newErrors.cardNumber = 'Informe um número de cartão válido.';
    }
    if (!cardHolder.trim()) {
      newErrors.cardHolder = 'Informe o nome impresso no cartão.';
    }
    if (cardExpiry.length < 5) {
      newErrors.cardExpiry = 'Informe a validade MM/AA.';
    }
    if (cardCvv.length < 3) {
      newErrors.cardCvv = 'Informe o código CVV de segurança.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      // Apply effect to inventory store
      if (order.type === 'plan' && order.planId) {
        updateVehiclePlan(order.vehicleId, order.planId);
      } else if (order.type === 'boost') {
        boostVehicle(order.vehicleId);
      } else if (order.type === 'renewal') {
        renewVehicle(order.vehicleId);
      }

      const last4 = cleanNum.slice(-4) || '4242';
      updateDealerOrderStatus(order.id, 'confirmed', last4);
      router.push(`/concessionaria/pedidos/${order.id}/status`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f5f8fd] flex flex-col font-sans text-[#16243c]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 sm:px-6 py-6 pb-20">
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
          <span className="font-semibold text-[#16243c]">Cartão de Crédito</span>
        </nav>

        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#16243c] tracking-tight">
            Pagamento com Cartão de Crédito
          </h1>
          <p className="text-[14px] text-[#63738e] mt-1">
            Transação segura com criptografia de ponta a ponta.
          </p>
        </div>

        {/* Order Details Header */}
        <div className="bg-white border border-[#dee6f1] rounded-[14px] p-5 mb-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1f5f9]">
            <div>
              <span className="text-[11px] font-medium text-[#63738e]">Código do pedido:</span>
              <div className="font-bold text-[14px] text-[#16243c]">{order.id}</div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-[#63738e]">Item contratado:</span>
              <div className="font-semibold text-[13px] text-[#b91c1c]">{order.planName}</div>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] font-medium text-[#63738e]">Valor total:</span>
              <div className="font-extrabold text-[20px] text-[#16243c]">
                {order.amountFormatted}
              </div>
            </div>
          </div>

          <div className="pt-3 text-[12px] text-[#63738e]">
            Veículo: <strong className="text-[#16243c]">{order.vehicleTitle}</strong> (
            {order.vehiclePlate})
          </div>
        </div>

        {/* Card Form (Figma WEB-031) */}
        <div className="bg-white border border-[#dee6f1] rounded-[16px] p-6 sm:p-8 shadow-xs mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="input-card-number"
                className="block text-[12px] font-semibold text-[#16243c] mb-1"
              >
                Número do Cartão
              </label>
              <div className="relative">
                <input
                  id="input-card-number"
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  data-testid="input-card-number"
                  className={`w-full h-[44px] px-3.5 bg-[#f8fafc] border rounded-[8px] text-[14px] text-[#16243c] placeholder-[#8a99ad] focus:outline-hidden focus:bg-white transition-colors ${
                    errors.cardNumber
                      ? 'border-[#dc2626] focus:border-[#dc2626]'
                      : 'border-[#d2dce8] focus:border-[#b91c1c]'
                  }`}
                />
                <IconCard className="size-5 text-[#8a99ad] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.cardNumber && (
                <span className="text-[11px] text-[#dc2626] mt-1 block font-medium">
                  {errors.cardNumber}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="input-card-holder"
                className="block text-[12px] font-semibold text-[#16243c] mb-1"
              >
                Nome impresso no Cartão
              </label>
              <input
                id="input-card-holder"
                type="text"
                placeholder="Ex: RAFAEL ALMEIDA"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                data-testid="input-card-holder"
                className={`w-full h-[44px] px-3.5 bg-[#f8fafc] border rounded-[8px] text-[13px] text-[#16243c] placeholder-[#8a99ad] focus:outline-hidden focus:bg-white transition-colors ${
                  errors.cardHolder
                    ? 'border-[#dc2626] focus:border-[#dc2626]'
                    : 'border-[#d2dce8] focus:border-[#b91c1c]'
                }`}
              />
              {errors.cardHolder && (
                <span className="text-[11px] text-[#dc2626] mt-1 block font-medium">
                  {errors.cardHolder}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="input-card-expiry"
                  className="block text-[12px] font-semibold text-[#16243c] mb-1"
                >
                  Validade (MM/AA)
                </label>
                <input
                  id="input-card-expiry"
                  type="text"
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  data-testid="input-card-expiry"
                  className={`w-full h-[44px] px-3.5 bg-[#f8fafc] border rounded-[8px] text-[13px] text-[#16243c] placeholder-[#8a99ad] focus:outline-hidden focus:bg-white transition-colors ${
                    errors.cardExpiry
                      ? 'border-[#dc2626] focus:border-[#dc2626]'
                      : 'border-[#d2dce8] focus:border-[#b91c1c]'
                  }`}
                />
                {errors.cardExpiry && (
                  <span className="text-[11px] text-[#dc2626] mt-1 block font-medium">
                    {errors.cardExpiry}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="input-card-cvv"
                  className="block text-[12px] font-semibold text-[#16243c] mb-1"
                >
                  CVV (Segurança)
                </label>
                <input
                  id="input-card-cvv"
                  type="password"
                  placeholder="123"
                  value={cardCvv}
                  onChange={handleCvvChange}
                  data-testid="input-card-cvv"
                  className={`w-full h-[44px] px-3.5 bg-[#f8fafc] border rounded-[8px] text-[13px] text-[#16243c] placeholder-[#8a99ad] focus:outline-hidden focus:bg-white transition-colors ${
                    errors.cardCvv
                      ? 'border-[#dc2626] focus:border-[#dc2626]'
                      : 'border-[#d2dce8] focus:border-[#b91c1c]'
                  }`}
                />
                {errors.cardCvv && (
                  <span className="text-[11px] text-[#dc2626] mt-1 block font-medium">
                    {errors.cardCvv}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="select-installments"
                className="block text-[12px] font-semibold text-[#16243c] mb-1"
              >
                Parcelamento
              </label>
              <select
                id="select-installments"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                className="w-full h-[44px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#16243c] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
              >
                <option value="1">1x de {order.amountFormatted} sem juros</option>
                <option value="2">
                  2x de R$ {(order.amountCents / 200).toFixed(2).replace('.', ',')} sem juros
                </option>
                <option value="3">
                  3x de R$ {(order.amountCents / 300).toFixed(2).replace('.', ',')} sem juros
                </option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#f1f5f9] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[12px] text-[#63738e] flex items-center gap-1.5">
                <IconLock className="size-4 text-[#059669]" />
                <span>Dados de cartão protegidos com PCI-DSS.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                data-testid="btn-pay-credit-card"
                className="w-full sm:w-auto h-[46px] px-8 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-xs disabled:bg-[#d2dce8]"
              >
                <IconCheck className="size-4" />
                <span>
                  {isSubmitting ? 'Processando transação...' : `Pagar ${order.amountFormatted}`}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Payment Method Link */}
        <div className="text-center text-[13px] text-[#63738e]">
          Prefere pagar com PIX instantâneo?{' '}
          <Link
            href={`/concessionaria/pedidos/${order.id}/pix`}
            className="text-[#b91c1c] font-semibold hover:underline"
          >
            Pagar com PIX
          </Link>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
