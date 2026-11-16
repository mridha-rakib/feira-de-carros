import Link from 'next/link';
import { SellerBreadcrumb } from '../../../components/SellerBreadcrumb';
import { IconCar } from '../../../components/SellerIcons';
import { SellerMobileBottomNav } from '../../../components/SellerMobileBottomNav';
import { SellerNavbar } from '../../../components/SellerNavbar';

export default function NovoAnuncioPlaceholderPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <SellerNavbar variant="seller" activeTab="criar" />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <SellerBreadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: 'Meus anúncios', href: '/vendedor/anuncios' },
            { label: 'Criar anúncio', active: true },
          ]}
        />

        <div className="mt-8 bg-white border border-[#e2e7ee] rounded-[16px] p-8 md:p-12 text-center max-w-[640px] mx-auto shadow-sm">
          <div className="size-16 rounded-full bg-[#fee2e2] text-[#b91c1c] flex items-center justify-center mx-auto mb-4">
            <IconCar className="size-8" />
          </div>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#ebf4ff] text-[#1e40af] mb-4">
            Em breve · Batch S2 (WEB-023 a WEB-026)
          </span>

          <h1 className="text-[22px] md:text-[26px] font-bold text-[#111827] mb-2">
            Assistente de Criação de Anúncio
          </h1>

          <p className="text-[14px] text-[#4b5563] leading-relaxed mb-6">
            O fluxo de cadastro de anúncios com seleção de categoria, ficha técnica FIPE, fotos e
            planos de publicação será liberado no próximo lote (Batch S2).
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/vendedor/anuncios"
              className="inline-flex items-center justify-center h-[46px] px-6 rounded-[10px] bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[14px] font-semibold transition-colors"
            >
              Voltar para Meus Anúncios
            </Link>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="criar" userRole="seller" />
    </div>
  );
}
