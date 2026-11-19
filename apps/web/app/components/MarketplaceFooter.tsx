import Link from 'next/link';

export function MarketplaceFooter() {
  return (
    <footer className="bg-[#101d34] text-white pt-10 sm:pt-[42px] pb-8 sm:pb-[32px] border-t border-[#1a2e50] mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#3d4c65]">
          {/* Brand info - Figma Col 1 */}
          <div className="md:col-span-5 space-y-2">
            <Link href="/" className="inline-block">
              <span className="text-[22px] sm:text-[25px] font-bold text-white tracking-tight">
                FEIRA DE CARROS
              </span>
            </Link>
            <p className="text-[13px] sm:text-[14px] text-[#c7d2e5]">
              Marketplace de anúncios de veículos
            </p>
            <p className="text-[13px] sm:text-[14px] text-[#c7d2e5]">Ipatinga, MG</p>
          </div>

          {/* Explorar - Figma Col 2 */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-[16px] sm:text-[18px] font-semibold text-white">Explorar</h4>
            <ul className="space-y-1.5 text-[13px] sm:text-[14px] text-[#c7d2e5]">
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
                  Carros · Motos · Caminhões
                </Link>
              </li>
            </ul>
          </div>

          {/* Informações - Figma Col 3 */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-[16px] sm:text-[18px] font-semibold text-white">Informações</h4>
            <ul className="space-y-1.5 text-[13px] sm:text-[14px] text-[#c7d2e5]">
              <li>
                <Link href="/privacidade#termos" className="hover:text-white transition-colors">
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-white transition-colors">
                  Política de privacidade
                </Link>
              </li>
              <li>
                <Link href="/ajuda" className="hover:text-white transition-colors">
                  Contato / Suporte
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright matching Figma 1437:2543 */}
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[#c7d2e5]">
          <p className="text-[13px] sm:text-[14px] leading-relaxed max-w-3xl">
            A plataforma conecta compradores e vendedores. Toda a negociação e pagamento é feito
            diretamente entre as partes. Vistorie sempre o veículo antes de qualquer pagamento.
          </p>
          <div className="shrink-0 text-left md:text-right text-[12px] text-[#afc0d4]">
            <p>© 2026 Feira de Carros • Todos os direitos reservados.</p>
            <p className="text-[10px] text-[#8297b5] mt-0.5">DEMO DATA · Visual QA Baseline</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
