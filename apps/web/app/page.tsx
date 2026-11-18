'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getFeaturedVehicles } from '../lib/adapters/buyer-catalog-adapter';
import { useBuyerStore } from '../stores/use-buyer-store';
import { MarketplaceFooter } from './components/MarketplaceFooter';
import { MarketplaceHeader } from './components/MarketplaceHeader';
import { PublicVehicleCard } from './components/PublicVehicleCard';
import {
  IconCar,
  IconChevronDown,
  IconClock,
  IconMotorcycle,
  IconPin,
  IconSearch,
  IconShield,
  IconTruck,
} from './components/SellerIcons';

export default function MarketplaceHomePage() {
  const router = useRouter();
  const { location } = useBuyerStore();
  const featuredVehicles = getFeaturedVehicles();

  // Search form state
  const [activeCategory, setActiveCategory] = useState<'Carros' | 'Motos' | 'Caminhões'>('Carros');
  const [selectedBrand, setSelectedBrand] = useState('Qualquer');
  const [selectedModel, setSelectedModel] = useState('Qualquer');
  const [selectedYear, setSelectedYear] = useState('Qualquer');
  const [selectedPrice, setSelectedPrice] = useState('Qualquer');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('categoria', activeCategory);

    if (selectedBrand !== 'Qualquer') params.set('marca', selectedBrand);
    if (selectedModel !== 'Qualquer') params.set('modelo', selectedModel);
    if (selectedYear !== 'Qualquer') params.set('ano', selectedYear);
    if (selectedPrice !== 'Qualquer') params.set('preco', selectedPrice);

    router.push(`/veiculos?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7fb]">
      <MarketplaceHeader />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full bg-[#091221] overflow-hidden">
          {/* Background Hero Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero/hero-desktop.png"
              alt="Feira de Carros Marketplace"
              fill
              priority
              className="object-cover object-center hidden md:block"
            />
            <Image
              src="/images/hero/hero-mobile.png"
              alt="Feira de Carros Marketplace"
              fill
              priority
              className="object-cover object-center md:hidden"
            />
            {/* Gradient Dark Overlay matching Figma 1441:2310 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(9,18,33,0.95)] via-[rgba(9,18,33,0.7)] to-[rgba(9,18,33,0.3)] md:w-[75%]" />
          </div>

          <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-16 sm:pb-24">
            <div className="max-w-2xl text-left">
              <h1 className="text-[32px] sm:text-[44px] lg:text-[49px] font-bold text-white tracking-tight leading-[1.15]">
                Encontre <br />
                seu próximo carro <br />
                com <span className="text-[#e0151f]">segurança</span>
              </h1>
              <p className="mt-4 text-[14px] sm:text-[16px] text-[#cbd5e1] leading-relaxed max-w-xl">
                Os melhores veículos de vendedores particulares e lojas credenciadas em{' '}
                {location.city} e região.
              </p>
            </div>

            {/* Floating Search Form matching Figma 1437:2395 */}
            <div className="mt-8 sm:mt-12 bg-white rounded-[14px] border border-[#e0e6f0] shadow-[0px_7px_22px_0px_rgba(15,31,54,0.12)] p-4 sm:p-5 max-w-[1296px]">
              {/* Category selector tabs */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                {(['Carros', 'Motos', 'Caminhões'] as const).map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`h-[38px] px-5 sm:px-6 rounded-[7px] text-[13px] font-semibold transition-all flex items-center gap-2 shrink-0 ${
                        isActive
                          ? 'bg-[#e0151f] text-white shadow-xs'
                          : 'bg-[#f5f7fb] text-[#14223b] hover:bg-[#e6ecf3]'
                      }`}
                    >
                      {cat === 'Carros' && <IconCar className="size-4" />}
                      {cat === 'Motos' && <IconMotorcycle className="size-4" />}
                      {cat === 'Caminhões' && <IconTruck className="size-4" />}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Filters grid */}
              <form
                onSubmit={handleQuickSearch}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
              >
                {/* Marca */}
                <div>
                  <label
                    htmlFor="select-brand"
                    className="block text-[11px] font-medium text-[#62718a] mb-1"
                  >
                    Marca
                  </label>
                  <div className="relative">
                    <select
                      id="select-brand"
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full h-[43px] px-3 bg-white border border-[#e0e6f0] rounded-[6px] text-[13px] text-[#14223b] appearance-none focus:outline-none focus:border-[#b91c1c]"
                    >
                      <option value="Qualquer">Qualquer marca</option>
                      <option value="Chevrolet">Chevrolet</option>
                      <option value="Fiat">Fiat</option>
                      <option value="Ford">Ford</option>
                      <option value="Honda">Honda</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Jeep">Jeep</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Volkswagen">Volkswagen</option>
                    </select>
                    <IconChevronDown className="size-3.5 text-[#62718a] absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Modelo */}
                <div>
                  <label
                    htmlFor="select-model"
                    className="block text-[11px] font-medium text-[#62718a] mb-1"
                  >
                    Modelo
                  </label>
                  <div className="relative">
                    <select
                      id="select-model"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full h-[43px] px-3 bg-white border border-[#e0e6f0] rounded-[6px] text-[13px] text-[#14223b] appearance-none focus:outline-none focus:border-[#b91c1c]"
                    >
                      <option value="Qualquer">Qualquer modelo</option>
                      <option value="Civic">Civic</option>
                      <option value="Corolla">Corolla</option>
                      <option value="Creta">Creta</option>
                      <option value="Onix">Onix</option>
                      <option value="Polo Track">Polo Track</option>
                      <option value="Strada">Strada</option>
                    </select>
                    <IconChevronDown className="size-3.5 text-[#62718a] absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Ano */}
                <div>
                  <label
                    htmlFor="select-year"
                    className="block text-[11px] font-medium text-[#62718a] mb-1"
                  >
                    Ano
                  </label>
                  <div className="relative">
                    <select
                      id="select-year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full h-[43px] px-3 bg-white border border-[#e0e6f0] rounded-[6px] text-[13px] text-[#14223b] appearance-none focus:outline-none focus:border-[#b91c1c]"
                    >
                      <option value="Qualquer">Qualquer ano</option>
                      <option value="2024">2024 ou mais novo</option>
                      <option value="2023">2023 ou mais novo</option>
                      <option value="2022">2022 ou mais novo</option>
                      <option value="2021">2021 ou mais novo</option>
                      <option value="2020">2020 ou mais novo</option>
                    </select>
                    <IconChevronDown className="size-3.5 text-[#62718a] absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Preço */}
                <div>
                  <label
                    htmlFor="select-price"
                    className="block text-[11px] font-medium text-[#62718a] mb-1"
                  >
                    Preço
                  </label>
                  <div className="relative">
                    <select
                      id="select-price"
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      className="w-full h-[43px] px-3 bg-white border border-[#e0e6f0] rounded-[6px] text-[13px] text-[#14223b] appearance-none focus:outline-none focus:border-[#b91c1c]"
                    >
                      <option value="Qualquer">Qualquer preço</option>
                      <option value="50000">Até R$ 50.000</option>
                      <option value="100000">Até R$ 100.000</option>
                      <option value="130000">Até R$ 130.000</option>
                      <option value="180000">Até R$ 180.000</option>
                    </select>
                    <IconChevronDown className="size-3.5 text-[#62718a] absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end sm:col-span-2 lg:col-span-1">
                  <button
                    type="submit"
                    className="w-full h-[43px] bg-[#e0151f] hover:bg-[#c41217] text-white font-semibold text-[13px] rounded-[6px] flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <IconSearch className="size-4" />
                    <span>Buscar veículos</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Benefits Section matching Figma 1437:2427 */}
        <section className="bg-white border-b border-[#e0e6f0] py-6 sm:py-8">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Benefit 1 */}
              <div className="flex items-center gap-3.5">
                <div className="size-11 rounded-full bg-[#fff1f0] flex items-center justify-center shrink-0">
                  <IconPin className="size-5 text-[#e0151f]" />
                </div>
                <div>
                  <h4 className="text-[13px] sm:text-[14px] font-semibold text-[#14223b]">
                    Anunciantes Locais
                  </h4>
                  <p className="text-[11px] sm:text-[12px] text-[#62718a]">
                    Conexão direta na sua região
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-center gap-3.5">
                <div className="size-11 rounded-full bg-[#fff1f0] flex items-center justify-center shrink-0">
                  <IconShield className="size-5 text-[#e0151f]" />
                </div>
                <div>
                  <h4 className="text-[13px] sm:text-[14px] font-semibold text-[#14223b]">
                    Negociação Transparente
                  </h4>
                  <p className="text-[11px] sm:text-[12px] text-[#62718a]">
                    Dicas e orientações de segurança
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-center gap-3.5">
                <div className="size-11 rounded-full bg-[#fff1f0] flex items-center justify-center shrink-0">
                  <IconCar className="size-5 text-[#e0151f]" />
                </div>
                <div>
                  <h4 className="text-[13px] sm:text-[14px] font-semibold text-[#14223b]">
                    Variedade de veículos
                  </h4>
                  <p className="text-[11px] sm:text-[12px] text-[#62718a]">
                    Carros, motos e caminhões
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="flex items-center gap-3.5">
                <div className="size-11 rounded-full bg-[#fff1f0] flex items-center justify-center shrink-0">
                  <IconClock className="size-5 text-[#e0151f]" />
                </div>
                <div>
                  <h4 className="text-[13px] sm:text-[14px] font-semibold text-[#14223b]">
                    Atendimento ágil
                  </h4>
                  <p className="text-[11px] sm:text-[12px] text-[#62718a]">
                    Suporte sempre que precisar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings Section matching Figma 1437:2452 */}
        <section className="py-10 sm:py-14 bg-[#f5f7fb]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-6 sm:mb-8">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[22px] sm:text-[28px] font-bold text-[#14223b] tracking-tight">
                    Destaques da semana
                  </h2>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#e2e7ee] text-[#48566a] tracking-wider">
                    DEMO DATA
                  </span>
                </div>
                <p className="text-[13px] sm:text-[14px] text-[#62718a] mt-1">
                  Veículos selecionados especialmente para você em {location.city} e região
                </p>
              </div>
              <Link
                href="/veiculos"
                className="text-[13px] sm:text-[14px] font-semibold text-[#1463c7] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Ver todos</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Desktop 4-column Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredVehicles.map((vehicle) => (
                <PublicVehicleCard key={vehicle.id} vehicle={vehicle} variant="grid" />
              ))}
            </div>

            {/* Mobile Stacked Card List matching Figma 1437:2636 */}
            <div className="sm:hidden flex flex-col gap-3">
              {featuredVehicles.map((vehicle) => (
                <PublicVehicleCard key={vehicle.id} vehicle={vehicle} variant="horizontal" />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section matching Figma 1437:2515 */}
        <section className="py-10 sm:py-14 bg-white border-t border-[#e0e6f0]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-[22px] sm:text-[26px] font-bold text-[#14223b] tracking-tight">
                Encontre por categoria
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[#62718a] mt-1">
                Explore as principais classes de veículos cadastradas na plataforma
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Category Tile: Carros */}
              <Link
                href="/veiculos?categoria=Carros"
                className="group bg-white border border-[#e0e6f0] hover:border-[#b91c1c] rounded-[12px] p-5 sm:p-6 transition-all hover:shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-[10px] bg-[#eef1f7] group-hover:bg-[#ffeded] transition-colors flex items-center justify-center shrink-0">
                    <IconCar className="size-6 text-[#14223b] group-hover:text-[#e0151f] transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#14223b]">Carros</h3>
                    <p className="text-[12px] text-[#62718a]">Veja os carros disponíveis</p>
                  </div>
                </div>
                <span className="text-[#62718a] group-hover:text-[#e0151f] group-hover:translate-x-1 transition-all text-xl">
                  ›
                </span>
              </Link>

              {/* Category Tile: Motos */}
              <Link
                href="/veiculos?categoria=Motos"
                className="group bg-white border border-[#e0e6f0] hover:border-[#b91c1c] rounded-[12px] p-5 sm:p-6 transition-all hover:shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-[10px] bg-[#eef1f7] group-hover:bg-[#ffeded] transition-colors flex items-center justify-center shrink-0">
                    <IconMotorcycle className="size-6 text-[#14223b] group-hover:text-[#e0151f] transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#14223b]">Motos</h3>
                    <p className="text-[12px] text-[#62718a]">Explore ofertas de motos</p>
                  </div>
                </div>
                <span className="text-[#62718a] group-hover:text-[#e0151f] group-hover:translate-x-1 transition-all text-xl">
                  ›
                </span>
              </Link>

              {/* Category Tile: Caminhões */}
              <Link
                href="/veiculos?categoria=Caminhões"
                className="group bg-white border border-[#e0e6f0] hover:border-[#b91c1c] rounded-[12px] p-5 sm:p-6 transition-all hover:shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-[10px] bg-[#eef1f7] group-hover:bg-[#ffeded] transition-colors flex items-center justify-center shrink-0">
                    <IconTruck className="size-6 text-[#14223b] group-hover:text-[#e0151f] transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#14223b]">Caminhões</h3>
                    <p className="text-[12px] text-[#62718a]">Encontre veículos de carga</p>
                  </div>
                </div>
                <span className="text-[#62718a] group-hover:text-[#e0151f] group-hover:translate-x-1 transition-all text-xl">
                  ›
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Body Types Row matching Figma 1267:1165 */}
        <section className="py-8 bg-[#f5f7fb] border-t border-[#e0e6f0]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[12px] font-bold text-[#14223b] uppercase tracking-wide mb-3">
              Tipos de carroceria populares
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Sedã', slug: 'Sedã', desc: 'Conforto e elegância' },
                { name: 'Hatch', slug: 'Hatch', desc: 'Praticidade urbana' },
                { name: 'SUV', slug: 'SUV', desc: 'Espaço e versatilidade' },
                { name: 'Picape', slug: 'Picape', desc: 'Força e capacidade' },
              ].map((item) => (
                <Link
                  key={item.slug}
                  href={`/veiculos?carroceria=${item.slug}`}
                  className="bg-white border border-[#e0e6f0] hover:border-[#b91c1c] rounded-[10px] p-3 text-center transition-all hover:shadow-xs"
                >
                  <p className="text-[14px] font-bold text-[#0e1320]">{item.name}</p>
                  <p className="text-[11px] text-[#617185] mt-0.5">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
