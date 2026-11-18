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
  IconCopy,
  IconInfo,
  IconQrCode,
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
import { use, useEffect, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DealershipPixCheckoutPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const { updateVehiclePlan, boostVehicle, renewVehicle } = useDealerInventoryStore();

  const [order, setOrder] = useState<DealerOrder | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleCopyPix = () => {
    if (order.pixCode) {
      navigator.clipboard?.writeText(order.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSimulatePaymentConfirmation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Apply effect to inventory store
      if (order.type === 'plan' && order.planId) {
        updateVehiclePlan(order.vehicleId, order.planId);
      } else if (order.type === 'boost') {
        boostVehicle(order.vehicleId);
      } else if (order.type === 'renewal') {
        renewVehicle(order.vehicleId);
      }

      updateDealerOrderStatus(order.id, 'confirmed');
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
          <span className="font-semibold text-[#16243c]">Pagamento PIX</span>
        </nav>

        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#16243c] tracking-tight">
            Pagamento via PIX
          </h1>
          <p className="text-[14px] text-[#63738e] mt-1">
            Pague com o QR Code ou código Copia e Cola para liberação imediata.
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

          <div className="pt-3 flex items-center justify-between text-[12px] text-[#63738e]">
            <span>
              Veículo: <strong className="text-[#16243c]">{order.vehicleTitle}</strong> (
              {order.vehiclePlate})
            </span>
            <span className="flex items-center gap-1 text-[#d97706] font-medium">
              <IconClock className="size-3.5" /> Expira em 15:00 min
            </span>
          </div>
        </div>

        {/* QR Code & Code Box */}
        <div className="bg-white border border-[#dee6f1] rounded-[16px] p-6 sm:p-8 text-center shadow-xs mb-6">
          <div className="size-52 mx-auto bg-[#f8fafc] border-2 border-dashed border-[#cbd5e1] rounded-[16px] flex flex-col items-center justify-center p-4 mb-5 relative">
            <svg
              className="size-40 text-[#16243c]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-label="Código QR PIX"
              role="img"
            >
              <title>Código QR PIX</title>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="3" height="3" />
              <rect x="18" y="14" width="3" height="3" />
              <rect x="14" y="18" width="3" height="3" />
              <rect x="18" y="18" width="3" height="3" />
              <rect x="5.5" y="5.5" width="2" height="2" fill="currentColor" />
              <rect x="16.5" y="5.5" width="2" height="2" fill="currentColor" />
              <rect x="5.5" y="16.5" width="2" height="2" fill="currentColor" />
            </svg>
            <span className="text-[10px] text-[#63738e] font-semibold mt-1">
              QR Code PIX Dinâmico
            </span>
          </div>

          <p className="text-[13px] text-[#63738e] max-w-[480px] mx-auto mb-4">
            Abra o aplicativo do seu banco, escolha a opção <strong>PIX</strong> e aponte a câmera
            para o código acima.
          </p>

          {/* Copy and Paste Field */}
          <div className="max-w-[540px] mx-auto mb-6">
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={order.pixCode || ''}
                data-testid="input-pix-code"
                className="flex-1 h-[42px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[12px] font-mono text-[#475569] select-all focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopyPix}
                data-testid="btn-copy-pix"
                className="h-[42px] px-4 bg-white border border-[#d2dce8] hover:bg-[#f1f6fd] text-[#16243c] font-semibold text-[13px] rounded-[8px] flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <IconCheck className="size-4 text-[#059669]" />
                    <span className="text-[#059669]">Copiado!</span>
                  </>
                ) : (
                  <>
                    <IconCopy className="size-4 text-[#63738e]" />
                    <span>Copiar código</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <span className="text-[11px] text-[#059669] block mt-1.5 font-medium">
                Código PIX copiado para a área de transferência!
              </span>
            )}
          </div>

          {/* Simulation Action (Strictly Mock UI) */}
          <div className="pt-6 border-t border-[#f1f5f9] max-w-[480px] mx-auto space-y-3">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSimulatePaymentConfirmation}
              data-testid="btn-simulate-pix-paid"
              className="w-full h-[46px] bg-[#059669] hover:bg-[#047857] text-white font-semibold text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <IconCheck className="size-4" />
              <span>
                {isProcessing ? 'Confirmando pagamento...' : 'Simular Confirmação de Pagamento PIX'}
              </span>
            </button>
            <span className="text-[11px] text-[#8a99ad] block">
              [Modo Demonstração Frontend] O sistema simula a notificação instantânea do Banco
              Central.
            </span>
          </div>
        </div>

        {/* Change Payment Method Link */}
        <div className="text-center text-[13px] text-[#63738e]">
          Prefere pagar com cartão?{' '}
          <Link
            href={`/concessionaria/pedidos/${order.id}/cartao`}
            className="text-[#b91c1c] font-semibold hover:underline"
          >
            Pagar com Cartão de Crédito
          </Link>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
