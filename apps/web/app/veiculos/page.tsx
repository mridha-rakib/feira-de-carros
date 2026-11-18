'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import {
  type PublicVehicleItem,
  type SearchQueryFilters,
  searchPublicCatalog,
} from '../../lib/adapters/buyer-catalog-adapter';
import { useBuyerStore } from '../../stores/use-buyer-store';
import { MarketplaceFooter } from '../components/MarketplaceFooter';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import { PublicVehicleCard } from '../components/PublicVehicleCard';
import {
  IconBell,
  IconCheck,
  IconCross,
  IconFilter,
  IconPin,
  IconSearch,
} from '../components/SellerIcons';

function VeiculosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { location, openLocationModal, isAuthenticated, openAuthModal, saveSearch } =
    useBuyerStore();
  const [saveSearchToast, setSaveSearchToast] = useState<string | null>(null);

  // Read URL search params
  const initialQuery = searchParams.get('busca') || '';
  const initialCategory = searchParams.get('categoria') || 'Todos';
  const initialBodyType = searchParams.get('carroceria') || 'Todos';
  const initialBrand = searchParams.get('marca') || 'Qualquer';
  const initialModel = searchParams.get('modelo') || 'Qualquer';
  const initialPrice = searchParams.get('preco') || 'Qualquer';
  const initialYear = searchParams.get('ano') || 'Qualquer';
  const initialMileage = searchParams.get('km') || 'Qualquer';
  const initialFuel = searchParams.get('combustivel') || 'Qualquer';
  const initialTransmission = searchParams.get('cambio') || 'Qualquer';
  const initialCondition = searchParams.get('condicao') || 'Qualquer';
  const initialSort = (searchParams.get('ordem') as SearchQueryFilters['sortBy']) || 'recentes';

  // Local filter states
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [bodyType, setBodyType] = useState(initialBodyType);
  const [brand, setBrand] = useState(initialBrand);
  const [model, setModel] = useState(initialModel);
  const [maxPrice, setMaxPrice] = useState(initialPrice);
  const [minYear, setMinYear] = useState(initialYear);
  const [maxMileage, setMaxMileage] = useState(initialMileage);
  const [fuel, setFuel] = useState(initialFuel);
  const [transmission, setTransmission] = useState(initialTransmission);
  const [condition, setCondition] = useState(initialCondition);
  const [sortBy, setSortBy] = useState<SearchQueryFilters['sortBy']>(initialSort);

  // View mode and mobile drawer
  const [viewMode, setViewMode] = useState<'grid' | 'horizontal'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Build filter query object
  const activeFilters = useMemo<SearchQueryFilters>(() => {
    const filters: SearchQueryFilters = {
      query: query.trim() || undefined,
      category: category !== 'Todos' ? (category as SearchQueryFilters['category']) : undefined,
      bodyType: bodyType !== 'Todos' ? (bodyType as SearchQueryFilters['bodyType']) : undefined,
      brand: brand !== 'Qualquer' ? brand : undefined,
      model: model !== 'Qualquer' ? model : undefined,
      maxPrice: maxPrice !== 'Qualquer' ? Number(maxPrice) : undefined,
      minYear: minYear !== 'Qualquer' ? Number(minYear) : undefined,
      maxMileage: maxMileage !== 'Qualquer' ? Number(maxMileage) : undefined,
      fuel: fuel !== 'Qualquer' ? fuel : undefined,
      transmission: transmission !== 'Qualquer' ? transmission : undefined,
      condition: condition !== 'Qualquer' ? condition : undefined,
      sortBy: sortBy,
    };
    return filters;
  }, [
    query,
    category,
    bodyType,
    brand,
    model,
    maxPrice,
    minYear,
    maxMileage,
    fuel,
    transmission,
    condition,
    sortBy,
  ]);

  // Execute catalog search
  const { results, totalCount } = useMemo(
    () => searchPublicCatalog(activeFilters),
    [activeFilters],
  );

  // Calculate active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category !== 'Todos') count++;
    if (bodyType !== 'Todos') count++;
    if (brand !== 'Qualquer') count++;
    if (model !== 'Qualquer') count++;
    if (maxPrice !== 'Qualquer') count++;
    if (minYear !== 'Qualquer') count++;
    if (maxMileage !== 'Qualquer') count++;
    if (fuel !== 'Qualquer') count++;
    if (transmission !== 'Qualquer') count++;
    if (condition !== 'Qualquer') count++;
    if (query.trim()) count++;
    return count;
  }, [
    category,
    bodyType,
    brand,
    model,
    maxPrice,
    minYear,
    maxMileage,
    fuel,
    transmission,
    condition,
    query,
  ]);

  const handleSaveCurrentSearch = () => {
    if (!isAuthenticated) {
      openAuthModal('/veiculos');
      return;
    }

    const titleParts = [];
    if (query.trim()) titleParts.push(query.trim());
    if (brand !== 'Qualquer') titleParts.push(brand);
    if (model !== 'Qualquer') titleParts.push(model);
    if (category !== 'Todos') titleParts.push(category);
    if (bodyType !== 'Todos') titleParts.push(bodyType);

    const title = titleParts.length > 0 ? titleParts.join(' ') : `Veículos em ${location.city}`;

    const params: Record<string, string> = {};
    if (query.trim()) params.busca = query.trim();
    if (category !== 'Todos') params.categoria = category;
    if (bodyType !== 'Todos') params.carroceria = bodyType;
    if (brand !== 'Qualquer') params.marca = brand;
    if (model !== 'Qualquer') params.modelo = model;
    if (maxPrice !== 'Qualquer') params.precoMax = maxPrice;
    if (minYear !== 'Qualquer') params.anoMin = minYear;
    if (maxMileage !== 'Qualquer') params.kmMax = maxMileage;
    if (fuel !== 'Qualquer') params.combustivel = fuel;
    if (transmission !== 'Qualquer') params.cambio = transmission;
    if (condition !== 'Qualquer') params.condicao = condition;
    params.cidade = location.city;

    saveSearch(
      title,
      params,
      category !== 'Todos' ? (category as 'Carros' | 'Motos' | 'Caminhões') : undefined,
    );

    setSaveSearchToast(
      `Busca "${title}" salva com sucesso! Você receberá alertas de novos anúncios.`,
    );
    setTimeout(() => setSaveSearchToast(null), 4000);
  };

  const handleResetFilters = () => {
    setQuery('');
    setCategory('Todos');
    setBodyType('Todos');
    setBrand('Qualquer');
    setModel('Qualquer');
    setMaxPrice('Qualquer');
    setMinYear('Qualquer');
    setMaxMileage('Qualquer');
    setFuel('Qualquer');
    setTransmission('Qualquer');
    setCondition('Qualquer');
    setSortBy('recentes');
    router.push('/veiculos');
    setIsMobileFilterOpen(false);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('busca', query.trim());
    if (category !== 'Todos') params.set('categoria', category);
    if (bodyType !== 'Todos') params.set('carroceria', bodyType);
    if (brand !== 'Qualquer') params.set('marca', brand);
    if (model !== 'Qualquer') params.set('modelo', model);
    if (maxPrice !== 'Qualquer') params.set('preco', maxPrice);
    if (minYear !== 'Qualquer') params.set('ano', minYear);
    if (maxMileage !== 'Qualquer') params.set('km', maxMileage);
    if (fuel !== 'Qualquer') params.set('combustivel', fuel);
    if (transmission !== 'Qualquer') params.set('cambio', transmission);
    if (condition !== 'Qualquer') params.set('condicao', condition);
    if (sortBy && sortBy !== 'recentes') params.set('ordem', sortBy);

    router.push(`/veiculos?${params.toString()}`);
    setIsMobileFilterOpen(false);
  };

  const filterSidebar = (
    <div className="bg-white border border-[#dce4ec] rounded-[13px] p-5 flex flex-col gap-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e7ee]">
        <div className="flex items-center gap-2">
          <IconFilter className="size-5 text-[#b91c1c]" />
          <h2 className="text-[17px] font-bold text-[#111827]">Filtros e ordenação</h2>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[12px] font-medium text-[#b91c1c] hover:underline"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {/* Location Filter */}
      <div>
        <span className="block text-[12px] font-semibold text-[#111827] mb-1.5">Localização</span>
        <button
          type="button"
          onClick={openLocationModal}
          className="w-full flex items-center justify-between p-2.5 bg-[#f8f9fa] hover:bg-[#eef2f8] border border-[#e2e7ee] rounded-[8px] text-[13px] text-[#111827] transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <IconPin className="size-4 text-[#f42524] shrink-0" />
            <span className="truncate">{location.label}</span>
          </div>
          <span className="text-[#b91c1c] text-[11px] font-medium shrink-0 ml-1">Alterar</span>
        </button>
      </div>

      {/* Categoria */}
      <div>
        <label
          htmlFor="filter-category"
          className="block text-[12px] font-semibold text-[#111827] mb-1.5"
        >
          Categoria do veículo
        </label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-10 px-3 bg-[#f8f9fa] border border-[#e2e7ee] rounded-[8px] text-[13px] text-[#111827] outline-none focus:border-[#b91c1c]"
        >
          <option value="Todos">Todas as categorias</option>
          <option value="Carros">Carros</option>
          <option value="Motos">Motos</option>
          <option value="Caminhões">Caminhões</option>
        </select>
      </div>

      {/* Carroceria */}
      <div>
        <label
          htmlFor="filter-body-type"
          className="block text-[12px] font-semibold text-[#111827] mb-1.5"
        >
          Tipo de carroceria
        </label>
        <select
          id="filter-body-type"
          value={bodyType}
          onChange={(e) => setBodyType(e.target.value)}
          className="w-full h-10 px-3 bg-[#f8f9fa] border border-[#e2e7ee] rounded-[8px] text-[13px] text-[#111827] outline-none focus:border-[#b91c1c]"
        >
          <option value="Todos">Todos os tipos</option>
          <option value="Sedã">Sedã</option>
          <option value="Hatch">Hatch</option>
          <option value="SUV">SUV</option>
          <option value="Picape">Picape</option>
        </select>
      </div>

      {/* Marca */}
      <div>
        <label
          htmlFor="filter-brand"
          className="block text-[12px] font-semibold text-[#111827] mb-1.5"
        >
          Marca
        </label>
        <select
          id="filter-brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full h-10 px-3 bg-[#f8f9fa] border border-[#e2e7ee] rounded-[8px] text-[13px] text-[#111827] outline-none focus:border-[#b91c1c]"
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
          <option value="Volvo">Volvo</option>
        </select>
      </div>

      {/* Preço Máximo */}
      <div>
        <label
          htmlFor="filter-price"
          className="block text-[12px] font-semibold text-[#111827] mb-1.5"
        >
          Preço máximo
        </label>
        <select
          id="filter-price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full h-10 px-3 bg-[#f8f9fa] border border-[#e2e7ee] rounded-[8px] text-[13px] text-[#111827] outline-none focus:border-[#b91c1c]"
        >
          <option value="Qualquer">Qualquer preço</option>
          <option value="50000">Até R$ 50.000</option>
          <option value="80000">Até R$ 80.000</option>
          <option value="110000">Até R$ 110.000</option>
          <option value="130000">Até R$ 130.000</option>
          <option value="160000">Até R$ 160.000</option>
          <option value="200000">Até R$ 200.000</option>
        </select>
      </div>

      {/* Ano do veículo */}
      <div>
        <label
          htmlFor="filter-year"
          className="block text-[12px] font-semibold text-[#111827] mb-1.5"
        >
          Ano mínimo
        </label>
        <select
          id="filter-year"
          value={minYear}
          onChange={(e) => setMinYear(e.target.value)}
          className="w-full h-10 px-3 bg-[#f8f9fa] border border-[#e2e7ee] rounded-[8px] text-[13px] text-[#111827] outline-none focus:border-[#b91c1c]"
        >
          <option value="Qualquer">Qualquer ano</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>
      </div>

      {/* Quilometragem máxima */}
      <div>
        <label
          htmlFor="filter-mileage"
          className="block text-[12px] font-semibold text-[#111827] mb-1.5"
        >
          Quilometragem máxima
        </label>
        <select
          id="filter-mileage"
          value={maxMileage}
          onChange={(e) => setMaxMileage(e.target.value)}
          className="w-full h-10 px-3 bg-[#f8f9fa] border border-[#e2e7ee] rounded-[8px] text-[13px] text-[#111827] outline-none focus:border-[#b91c1c]"
        >
          <option value="Qualquer">Qualquer km</option>
          <option value="20000">Até 20.000 km</option>
          <option value="40000">Até 40.000 km</option>
          <option value="60000">Até 60.000 km</option>
          <option value="100000">Até 100.000 km</option>
        </select>
      </div>

      {/* Câmbio */}
      <div>
        <label
          htmlFor="filter-transmission"
          className="block text-[12px] font-semibold text-[#111827] mb-1.5"
        >
          Câmbio
        </label>
        <select
          id="filter-transmission"
          value={transmission}
          onChange={(e) => setTransmission(e.target.value)}
          className="w-full h-10 px-3 bg-[#f8f9fa] border border-[#e2e7ee] rounded-[8px] text-[13px] text-[#111827] outline-none focus:border-[#b91c1c]"
        >
          <option value="Qualquer">Qualquer câmbio</option>
          <option value="Automático">Automático</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      {/* Combustível */}
      <div>
        <label
          htmlFor="filter-fuel"
          className="block text-[12px] font-semibold text-[#111827] mb-1.5"
        >
          Combustível
        </label>
        <select
          id="filter-fuel"
          value={fuel}
          onChange={(e) => setFuel(e.target.value)}
          className="w-full h-10 px-3 bg-[#f8f9fa] border border-[#e2e7ee] rounded-[8px] text-[13px] text-[#111827] outline-none focus:border-[#b91c1c]"
        >
          <option value="Qualquer">Qualquer combustível</option>
          <option value="Flex">Flex</option>
          <option value="Gasolina">Gasolina</option>
          <option value="Diesel">Diesel</option>
          <option value="Elétrico">Elétrico</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>

      {/* Condição */}
      <div>
        <label
          htmlFor="filter-condition"
          className="block text-[12px] font-semibold text-[#111827] mb-1.5"
        >
          Condição
        </label>
        <select
          id="filter-condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full h-10 px-3 bg-[#f8f9fa] border border-[#e2e7ee] rounded-[8px] text-[13px] text-[#111827] outline-none focus:border-[#b91c1c]"
        >
          <option value="Qualquer">Qualquer condição</option>
          <option value="Usado">Usado</option>
          <option value="Novo">Novo</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2">
        <button
          type="button"
          onClick={handleApplyFilters}
          className="w-full h-[44px] bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[13px] rounded-[8px] transition-colors flex items-center justify-center shadow-xs"
        >
          Aplicar filtros
        </button>
        <button
          type="button"
          onClick={handleResetFilters}
          className="w-full h-[40px] bg-[#f8f9fa] hover:bg-[#eef2f8] text-[#111827] font-medium text-[12px] rounded-[8px] transition-colors"
        >
          Limpar filtros
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fa]">
      <MarketplaceHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-3 text-[12px] text-[#6b7280]">
          <Link href="/" className="hover:text-[#111827] transition-colors">
            Início
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#111827] font-medium">Veículos</span>
        </nav>

        {/* Page Title & Context Header matching Figma 1212:3667 */}
        <div className="mb-6">
          <h1 className="text-[26px] sm:text-[32px] font-bold text-[#111827] tracking-tight">
            Filtrar veículos
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#6b7280] mt-1">
            Refine sua busca e encontre ofertas de carros, motos e caminhões em {location.city} e
            região.
          </p>
        </div>

        {/* Locality & Category Quick Chips matching Figma 1232:1082 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            type="button"
            onClick={openLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffeded] border border-[#fca5a5] text-[#b91c1c] text-[12px] font-semibold shrink-0"
          >
            <IconPin className="size-3.5" />
            <span>{location.label}</span>
          </button>

          {(['Todos', 'Carros', 'Motos', 'Caminhões'] as const).map((cat) => {
            const isCatActive = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  const p = new URLSearchParams(searchParams.toString());
                  if (cat === 'Todos') p.delete('categoria');
                  else p.set('categoria', cat);
                  router.push(`/veiculos?${p.toString()}`);
                }}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all shrink-0 ${
                  isCatActive
                    ? 'bg-[#111827] text-white'
                    : 'bg-white border border-[#dce4ec] text-[#475569] hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}

          {/* Quick Body Type Chips */}
          {(['Sedã', 'Hatch', 'SUV', 'Picape'] as const).map((bt) => {
            const isBtActive = bodyType === bt;
            return (
              <button
                key={bt}
                type="button"
                onClick={() => {
                  const next = isBtActive ? 'Todos' : bt;
                  setBodyType(next);
                  const p = new URLSearchParams(searchParams.toString());
                  if (next === 'Todos') p.delete('carroceria');
                  else p.set('carroceria', next);
                  router.push(`/veiculos?${p.toString()}`);
                }}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all shrink-0 ${
                  isBtActive
                    ? 'bg-[#b91c1c] text-white'
                    : 'bg-white border border-[#dce4ec] text-[#475569] hover:bg-slate-50'
                }`}
              >
                {bt}
              </button>
            );
          })}
        </div>

        {/* Main Grid Layout: Desktop Sidebar (col-span-4) + Results (col-span-8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
            {filterSidebar}
          </aside>

          {/* Results Column */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
            {/* Results Control Bar matching Figma 822:2239 */}
            <div className="bg-white border border-[#dce4ec] rounded-[12px] p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-[14px] sm:text-[15px] font-bold text-[#111827]">
                  {totalCount} {totalCount === 1 ? 'anúncio encontrado' : 'anúncios encontrados'}
                </span>
                <span className="text-[12px] text-[#6b7280] hidden sm:inline">
                  • {location.city} e região
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Salvar Busca Button */}
                <button
                  type="button"
                  onClick={handleSaveCurrentSearch}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff6ff] hover:bg-[#dbeafe] border border-[#bfdbfe] rounded-[8px] text-[12px] font-semibold text-[#1d4ed8] transition-colors"
                  aria-label="Salvar busca atual"
                >
                  <IconBell className="size-3.5" />
                  <span className="hidden sm:inline">Salvar busca</span>
                  <span className="sm:hidden">Salvar</span>
                </button>

                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#f8f9fa] border border-[#dce4ec] rounded-[8px] text-[12px] font-semibold text-[#111827]"
                >
                  <IconFilter className="size-3.5 text-[#b91c1c]" />
                  <span>Filtros</span>
                  {activeFilterCount > 0 && (
                    <span className="size-4 rounded-full bg-[#b91c1c] text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 text-[12px] text-[#6b7280]">
                  <label htmlFor="select-sort" className="hidden sm:inline font-medium">
                    Ordenar:
                  </label>
                  <select
                    id="select-sort"
                    value={sortBy}
                    onChange={(e) => {
                      const nextSort = e.target.value as SearchQueryFilters['sortBy'];
                      setSortBy(nextSort);
                      const p = new URLSearchParams(searchParams.toString());
                      if (nextSort) p.set('ordem', nextSort);
                      router.push(`/veiculos?${p.toString()}`);
                    }}
                    className="h-9 px-2.5 bg-[#f8f9fa] border border-[#dce4ec] rounded-[8px] text-[12px] font-medium text-[#111827] outline-none"
                  >
                    <option value="recentes">Mais recentes</option>
                    <option value="menor_preco">Menor preço</option>
                    <option value="maior_preco">Maior preço</option>
                    <option value="menor_km">Menor km</option>
                    <option value="maior_ano">Ano mais novo</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center border border-[#dce4ec] rounded-[8px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`px-2.5 py-1.5 text-[12px] ${
                      viewMode === 'grid' ? 'bg-[#111827] text-white' : 'bg-white text-[#475569]'
                    }`}
                    aria-label="Visualização em grade"
                  >
                    Grade
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('horizontal')}
                    className={`px-2.5 py-1.5 text-[12px] ${
                      viewMode === 'horizontal'
                        ? 'bg-[#111827] text-white'
                        : 'bg-white text-[#475569]'
                    }`}
                    aria-label="Visualização em lista"
                  >
                    Lista
                  </button>
                </div>
              </div>
            </div>

            {/* Save Search Feedback Toast */}
            {saveSearchToast && (
              <output
                aria-live="polite"
                className="bg-[#101d34] text-white text-[13px] px-4 py-2.5 rounded-[8px] shadow-sm flex items-center justify-between animate-fade-in"
              >
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-[#22c55e]" />
                  <span>{saveSearchToast}</span>
                </div>
                <Link
                  href="/buscas-salvas"
                  className="text-[12px] font-semibold text-[#93c5fd] hover:text-white underline ml-3 shrink-0"
                >
                  Ver buscas salvas →
                </Link>
              </output>
            )}

            {/* Active Filter Chips Bar */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[12px] text-[#6b7280]">Filtros ativos:</span>
                {category !== 'Todos' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#dce4ec] rounded-full text-[11px] text-[#111827]">
                    {category}
                    <button
                      type="button"
                      onClick={() => setCategory('Todos')}
                      aria-label="Remover filtro de categoria"
                    >
                      <IconCross className="size-3 text-[#6b7280] hover:text-[#b91c1c]" />
                    </button>
                  </span>
                )}
                {bodyType !== 'Todos' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#dce4ec] rounded-full text-[11px] text-[#111827]">
                    {bodyType}
                    <button
                      type="button"
                      onClick={() => setBodyType('Todos')}
                      aria-label="Remover filtro de carroceria"
                    >
                      <IconCross className="size-3 text-[#6b7280] hover:text-[#b91c1c]" />
                    </button>
                  </span>
                )}
                {brand !== 'Qualquer' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#dce4ec] rounded-full text-[11px] text-[#111827]">
                    {brand}
                    <button
                      type="button"
                      onClick={() => setBrand('Qualquer')}
                      aria-label="Remover filtro de marca"
                    >
                      <IconCross className="size-3 text-[#6b7280] hover:text-[#b91c1c]" />
                    </button>
                  </span>
                )}
                {maxPrice !== 'Qualquer' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#dce4ec] rounded-full text-[11px] text-[#111827]">
                    Até R$ {Number(maxPrice).toLocaleString('pt-BR')}
                    <button
                      type="button"
                      onClick={() => setMaxPrice('Qualquer')}
                      aria-label="Remover filtro de preço"
                    >
                      <IconCross className="size-3 text-[#6b7280] hover:text-[#b91c1c]" />
                    </button>
                  </span>
                )}
                {query.trim() && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#dce4ec] rounded-full text-[11px] text-[#111827]">
                    Busca: "{query.trim()}"
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Remover termo de busca"
                    >
                      <IconCross className="size-3 text-[#6b7280] hover:text-[#b91c1c]" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-medium text-[#b91c1c] hover:underline ml-1"
                >
                  Limpar todos
                </button>
              </div>
            )}

            {/* Vehicle Results Grid or Empty State */}
            {results.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'
                    : 'flex flex-col gap-3'
                }
              >
                {results.map((vehicle) => (
                  <PublicVehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    variant={viewMode === 'grid' ? 'grid' : 'horizontal'}
                  />
                ))}
              </div>
            ) : (
              /* Empty state matching Figma 1212:3807 */
              <div className="bg-white border border-[#dce4ec] rounded-[14px] p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                <div className="size-16 rounded-full bg-[#f8f9fa] flex items-center justify-center text-[#6b7280] mb-4">
                  <IconSearch className="size-8" />
                </div>
                <h3 className="text-[18px] sm:text-[20px] font-bold text-[#111827]">
                  Nenhum veículo encontrado
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#6b7280] max-w-md mt-1.5 leading-relaxed">
                  Não encontramos anúncios correspondentes aos filtros aplicados em {location.city}.
                  Tente remover alguns filtros ou selecionar outra cidade.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="h-10 px-5 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[13px] rounded-[8px] transition-colors"
                  >
                    Limpar todos os filtros
                  </button>
                  <button
                    type="button"
                    onClick={openLocationModal}
                    className="h-10 px-5 bg-[#f8f9fa] hover:bg-[#eef2f8] text-[#111827] font-medium text-[13px] rounded-[8px] border border-[#dce4ec] transition-colors"
                  >
                    Alterar localização
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer matching Figma 1212:3739 */}
      {isMobileFilterOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMobileFilterOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsMobileFilterOpen(false);
          }}
        >
          <div className="w-[88%] max-w-[380px] bg-white h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#e2e7ee]">
                <div className="flex items-center gap-2">
                  <IconFilter className="size-5 text-[#b91c1c]" />
                  <h3 className="text-[16px] font-bold text-[#111827]">Filtros e ordenação</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-[#6b7280] hover:text-[#111827] rounded-lg"
                  aria-label="Fechar filtros"
                >
                  <IconCross className="size-5" />
                </button>
              </div>

              <div className="mt-4">{filterSidebar}</div>
            </div>
          </div>
        </div>
      )}

      <MarketplaceFooter />
    </div>
  );
}

export default function VeiculosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa]">
          <div className="text-[14px] text-[#6b7280]">Carregando catálogo de veículos...</div>
        </div>
      }
    >
      <VeiculosContent />
    </Suspense>
  );
}
