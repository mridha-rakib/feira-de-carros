import { BrandLogo } from '@feira/ui';
import Link from 'next/link';

export function MarketplaceFooter() {
  return (
    <footer className="bg-[#101d34] text-white pt-12 pb-8 border-t border-[#1a2e50] mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#3d4c65]">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="inline-block">
              <BrandLogo variant="on-dark" width={178} height={32} className="h-7 w-auto" />
            </Link>
            <p className="text-[13px] text-[#c7d2e5] max-w-sm leading-relaxed">
              O maior ecossistema regional de anúncios automotivos. Compre e venda com segurança,
              transparência e conexão direta entre compradores e vendedores.
            </p>
            <p className="text-[12px] text-[#94a3b8]">Ipatinga, Minas Gerais e Vale do Aço</p>
          </div>

          {/* Explorar */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[15px] font-semibold text-white tracking-wide">Explorar</h4>
            <ul className="space-y-2 text-[13px] text-[#c7d2e5]">
              <li>
                <Link href="/veiculos" className="hover:text-white transition-colors">
                  Todos os veículos
                </Link>
              </li>
              <li>
                <Link
                  href="/veiculos?categoria=Carros"
                  className="hover:text-white transition-colors"
                >
                  Carros
                </Link>
              </li>
              <li>
                <Link
                  href="/veiculos?categoria=Motos"
                  className="hover:text-white transition-colors"
                >
                  Motos
                </Link>
              </li>
              <li>
                <Link
                  href="/veiculos?categoria=Caminhões"
                  className="hover:text-white transition-colors"
                >
                  Caminhões
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="hover:text-white transition-colors">
                  Categorias de veículos
                </Link>
              </li>
            </ul>
          </div>

          {/* Informações */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[15px] font-semibold text-white tracking-wide">Informações</h4>
            <ul className="space-y-2 text-[13px] text-[#c7d2e5]">
              <li>
                <Link href="/privacidade#termos" className="hover:text-white transition-colors">
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-white transition-colors">
                  Política de privacidade (LGPD)
                </Link>
              </li>
              <li>
                <Link href="/ajuda" className="hover:text-white transition-colors">
                  Central de Ajuda & FAQ
                </Link>
              </li>
              <li>
                <Link href="/localidade" className="hover:text-white transition-colors">
                  Cidades atendidas
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendedor */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[15px] font-semibold text-white tracking-wide">Vendedores</h4>
            <ul className="space-y-2 text-[13px] text-[#c7d2e5]">
              <li>
                <Link
                  href="/vendedor/solicitacao"
                  className="hover:text-[#fca5a5] text-[#f87171] font-medium transition-colors"
                >
                  + Anunciar veículo
                </Link>
              </li>
              <li>
                <Link href="/vendedor/anuncios" className="hover:text-white transition-colors">
                  Painel do anunciante
                </Link>
              </li>
              <li>
                <Link href="/entrar" className="hover:text-white transition-colors">
                  Acessar conta
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#94a3b8]">
          <p className="text-center md:text-left leading-relaxed max-w-3xl">
            A plataforma conecta compradores e vendedores. A compra, o pagamento e a transferência
            do veículo ocorrem fora da Feira de Carros. Vistorie sempre o veículo antes de qualquer
            pagamento.
          </p>
          <div className="shrink-0 text-center md:text-right">
            <p>© 2026 Feira de Carros • Marketplace</p>
            <p className="text-[11px] text-[#64748b] mt-0.5">DEMO DATA · Visual QA Baseline</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
