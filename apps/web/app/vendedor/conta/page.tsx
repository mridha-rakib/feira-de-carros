import Link from 'next/link';
import { SellerBreadcrumb } from '../../components/SellerBreadcrumb';
import { IconUsers } from '../../components/SellerIcons';
import { SellerMobileBottomNav } from '../../components/SellerMobileBottomNav';
import { SellerNavbar } from '../../components/SellerNavbar';

export default function ContaPlaceholderPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <SellerNavbar variant="seller" activeTab="anuncios" />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <SellerBreadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: 'Meus anúncios', href: '/vendedor/anuncios' },
            { label: 'Minha conta', active: true },
          ]}
        />

        <div className="mt-8 bg-white border border-[#e2e7ee] rounded-[16px] p-8 md:p-12 text-center max-w-[640px] mx-auto shadow-sm">
          <div className="size-16 rounded-full bg-[#f3f4f6] text-[#4b5563] flex items-center justify-center mx-auto mb-4">
            <IconUsers className="size-8" />
          </div>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#f3f4f6] text-[#374151] mb-4">
            Em breve · Configurações de Perfil
          </span>

          <h1 className="text-[22px] md:text-[26px] font-bold text-[#111827] mb-2">
            Configurações e Segurança da Conta
          </h1>

          <p className="text-[14px] text-[#4b5563] leading-relaxed mb-6">
            Edição de dados cadastrais, alteração de senha e preferências de notificação do vendedor
            estarão disponíveis no módulo de perfil de usuário.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/vendedor/anuncios"
              className="inline-flex items-center justify-center h-[46px] px-6 rounded-[10px] bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[14px] font-semibold transition-colors"
            >
              Voltar para Meus Anúncios
            </Link>
            <Link
              href="/vendedor/solicitacao/status"
              className="inline-flex items-center justify-center h-[46px] px-6 rounded-[10px] bg-white border border-[#e2e7ee] hover:bg-[#f8f9fb] text-[#141c2e] text-[14px] font-semibold transition-colors"
            >
              Consultar Status do Cadastro
            </Link>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="conta" userRole="seller" />
    </div>
  );
}
