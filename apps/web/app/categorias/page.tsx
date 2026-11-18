import Image from 'next/image';
import Link from 'next/link';
import { MarketplaceFooter } from '../components/MarketplaceFooter';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import { IconCar, IconMotorcycle, IconTruck } from '../components/SellerIcons';

export const metadata = {
  title: 'Categorias de Veículos · Feira de Carros',
  description:
    'Explore carros, motos, caminhões e tipos de carroceria disponíveis na Feira de Carros.',
};

export default function CategoriasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb]">
      <MarketplaceHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumb */}
        <nav className="mb-4 text-[12px] text-[#617185]">
          <Link href="/" className="hover:text-[#0e1320] transition-colors">
            Feira de Carros
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[#0e1320] font-medium">Categorias de veículos</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[28px] sm:text-[34px] font-bold text-[#0e1320] tracking-tight">
            Explore por categoria
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#617185] mt-1">
            Escolha a classe de veículo para continuar sua busca. Anúncios sujeitos ao catálogo
            disponível.
          </p>
        </div>

        {/* Intro notice matching Figma 1267:1133 */}
        <div className="bg-[#eaf4fe] border border-[#bfdbfe] rounded-[10px] p-4 mb-8">
          <p className="text-[13px] font-semibold text-[#0e1320]">Navegação pública sem cadastro</p>
          <p className="text-[12px] text-[#617185] mt-0.5">
            Carros, motos e caminhões fazem parte do marketplace. Tipos e filtros seguem o catálogo
            aprovado.
          </p>
        </div>

        {/* 3 Main Categories matching Figma 1267:1136 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card Carros */}
          <div className="bg-white border border-[#d9e2eb] rounded-[14px] p-4 flex flex-col justify-between shadow-xs hover:border-[#b91c1c] transition-all">
            <div>
              <div className="relative w-full h-[180px] rounded-[10px] overflow-hidden bg-[#eef1f7] mb-4">
                <Image
                  src="/images/vehicles/demo/toyota-corolla-2021-b6.jpg"
                  alt="Carros disponíveis"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-[22px] font-bold text-[#0e1320]">Carros</h2>
              <p className="text-[13px] text-[#617185] mt-1">
                Sedã, hatch, SUV, picape e outros tipos
              </p>
            </div>
            <div className="mt-5">
              <Link
                href="/veiculos?categoria=Carros"
                className="w-full h-[46px] bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-colors shadow-xs"
              >
                Explorar carros
              </Link>
            </div>
          </div>

          {/* Card Motos */}
          <div className="bg-white border border-[#d9e2eb] rounded-[14px] p-4 flex flex-col justify-between shadow-xs hover:border-[#b91c1c] transition-all">
            <div>
              <div className="w-full h-[180px] rounded-[10px] overflow-hidden bg-[#f4f7fb] flex items-center justify-center mb-4">
                <IconMotorcycle className="size-20 text-[#617185]" />
              </div>
              <h2 className="text-[22px] font-bold text-[#0e1320]">Motos</h2>
              <p className="text-[13px] text-[#617185] mt-1">Explore motocicletas disponíveis</p>
            </div>
            <div className="mt-5">
              <Link
                href="/veiculos?categoria=Motos"
                className="w-full h-[46px] bg-[#eef1f7] hover:bg-[#b91c1c] text-[#0e1320] hover:text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-all"
              >
                Explorar motos
              </Link>
            </div>
          </div>

          {/* Card Caminhões */}
          <div className="bg-white border border-[#d9e2eb] rounded-[14px] p-4 flex flex-col justify-between shadow-xs hover:border-[#b91c1c] transition-all">
            <div>
              <div className="w-full h-[180px] rounded-[10px] overflow-hidden bg-[#f4f7fb] flex items-center justify-center mb-4">
                <IconTruck className="size-20 text-[#617185]" />
              </div>
              <h2 className="text-[22px] font-bold text-[#0e1320]">Caminhões</h2>
              <p className="text-[13px] text-[#617185] mt-1">Explore veículos de carga</p>
            </div>
            <div className="mt-5">
              <Link
                href="/veiculos?categoria=Caminhões"
                className="w-full h-[46px] bg-[#eef1f7] hover:bg-[#b91c1c] text-[#0e1320] hover:text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-all"
              >
                Explorar caminhões
              </Link>
            </div>
          </div>
        </div>

        {/* Body Types partial taxonomy matching Figma 1267:1165 */}
        <div className="bg-white border border-[#d9e2eb] rounded-[14px] p-5 sm:p-6 mb-8">
          <h3 className="text-[20px] font-bold text-[#0e1320]">Tipos de carro — exemplos</h3>
          <p className="text-[12px] text-[#617185] mt-1 mb-4">
            Sedã, SUV, hatch e picape são exemplos; explore anúncios filtrados pela carroceria.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Sedã', slug: 'Sedã' },
              { name: 'SUV', slug: 'SUV' },
              { name: 'Hatch', slug: 'Hatch' },
              { name: 'Picape', slug: 'Picape' },
            ].map((bt) => (
              <Link
                key={bt.slug}
                href={`/veiculos?carroceria=${bt.slug}`}
                className="h-[52px] bg-[#eef1f7] hover:bg-[#e0e7f2] hover:border-[#b91c1c] border border-transparent rounded-[9px] flex items-center justify-center text-[13px] font-semibold text-[#0e1320] transition-all"
              >
                {bt.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Actions matching Figma 1267:1178 */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Link
            href="/veiculos"
            className="h-[46px] px-6 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-colors"
          >
            Ver todos os veículos
          </Link>
          <Link
            href="/"
            className="h-[46px] px-6 bg-[#eef1f7] hover:bg-[#e0e7f2] text-[#0e1320] font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-colors"
          >
            Voltar ao início
          </Link>
        </div>

        <p className="text-[12px] text-[#617185]">
          Feira de Carros • Sem pagamentos de compra de veículo pela plataforma
        </p>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
