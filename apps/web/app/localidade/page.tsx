import Link from 'next/link';
import { BuyerLocationModal } from '../components/BuyerLocationModal';
import { MarketplaceFooter } from '../components/MarketplaceFooter';
import { MarketplaceHeader } from '../components/MarketplaceHeader';

export const metadata = {
  title: 'Escolha sua Localização · Feira de Carros',
  description: 'Selecione sua cidade e estado para visualizar anúncios de veículos da sua região.',
};

export default function LocalidadePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fa]">
      <MarketplaceHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumb */}
        <nav className="mb-4 text-[12px] text-[#657386]">
          <Link href="/" className="hover:text-[#0e1420] transition-colors">
            Feira de Carros
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[#0e1420] font-medium">Localização</span>
        </nav>

        {/* Intro notice banner matching Figma 1266:1106 */}
        <div className="bg-[#ebf4fd] border border-[#bfdbfe] rounded-[10px] p-4 mb-6">
          <p className="text-[13px] font-semibold text-[#0e1420]">
            Localidade padrão do marketplace: Ipatinga, MG
          </p>
          <p className="text-[12px] text-[#657386] mt-0.5 leading-relaxed">
            A cidade pode ser alterada manualmente para visualizar ofertas de outras cidades. A
            plataforma opera com conexão direta entre compradores e vendedores regionais.
          </p>
        </div>

        {/* Standalone Selector Interface */}
        <div className="flex justify-center mb-8">
          <BuyerLocationModal standalone />
        </div>

        {/* Catalog Rule Info matching Figma 1266:1153 */}
        <div className="bg-[#f0f4f8] border border-[#dae1e9] rounded-[10px] p-4 max-w-[840px] mx-auto text-left">
          <p className="text-[12px] font-semibold text-[#0e1420]">Regra do catálogo</p>
          <p className="text-[11px] text-[#657386] mt-0.5 leading-relaxed">
            Localidades, resultados e classificação de anúncios são sincronizados com a
            disponibilidade do marketplace. Os dados apresentados utilizam fixtures demonstrativas
            para fins de homologação do Lote B1.
          </p>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
