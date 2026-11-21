'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  type PublicDealership,
  type PublicVehicleItem,
  getPublicDealershipById,
  getVehiclesByDealershipId,
  recordPhoneRevealInteraction,
} from '../../../lib/adapters/buyer-catalog-adapter';
import { MarketplaceFooter } from '../../components/MarketplaceFooter';
import { MarketplaceHeader } from '../../components/MarketplaceHeader';
import { PublicVehicleCard } from '../../components/PublicVehicleCard';
import {
  IconAlert,
  IconBuilding,
  IconCar,
  IconCheck,
  IconClock,
  IconCross,
  IconHeart,
  IconMessageSquare,
  IconPhone,
  IconPin,
  IconShield,
} from '../../components/SellerIcons';

export default function DealershipShowroomPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';

  const dealership = getPublicDealershipById(id);
  const vehicles = useMemo(
    () => (dealership ? getVehiclesByDealershipId(dealership.id) : []),
    [dealership],
  );

  const [activeTab, setActiveTab] = useState<string>('todos');
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  // Filter vehicles by category tab
  const filteredVehicles = useMemo(() => {
    if (activeTab === 'todos') return vehicles;
    return vehicles.filter(
      (v) => v.bodyType.toLowerCase() === activeTab || v.category.toLowerCase() === activeTab,
    );
  }, [vehicles, activeTab]);

  // 404 Dealership Not Found
  if (!dealership) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex flex-col justify-between">
        <MarketplaceHeader />
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="max-w-md mx-auto bg-white border border-[#e0e6f0] rounded-[16px] p-8 shadow-xs">
            <div className="size-16 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-4">
              <IconBuilding className="size-8 text-[#b91c1c]" />
            </div>
            <h1 className="text-[22px] font-bold text-[#14223b]">Concessionária não encontrada</h1>
            <p className="text-[13px] text-[#62718a] mt-2 leading-relaxed">
              O perfil da concessionária que você tentou acessar não foi localizado ou não possui
              publicação ativa no momento.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/veiculos"
                className="w-full h-[42px] bg-[#e0151f] hover:bg-[#b91c1c] text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-colors"
              >
                Explorar catálogo de veículos
              </Link>
              <Link
                href="/"
                className="w-full h-[40px] bg-white border border-[#e0e6f0] hover:bg-[#f8f9fb] text-[#14223b] font-medium text-[13px] rounded-[8px] flex items-center justify-center transition-colors"
              >
                Voltar à página inicial
              </Link>
            </div>
          </div>
        </main>
        <MarketplaceFooter />
      </div>
    );
  }

  const handleOpenPhone = () => {
    recordPhoneRevealInteraction(dealership.id, 'concessionaria');
    setIsPhoneModalOpen(true);
  };

  const handleCopyPhone = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(dealership.phoneFull);
        setPhoneCopied(true);
        setTimeout(() => setPhoneCopied(false), 2500);
      }
    } catch {
      setPhoneCopied(true);
      setTimeout(() => setPhoneCopied(false), 2500);
    }
  };

  const rawPhoneDigits = dealership.phoneFull.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col justify-between">
      <MarketplaceHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[12px] text-[#62718a] mb-5 overflow-x-auto whitespace-nowrap"
        >
          <Link href="/" className="hover:text-[#14223b] transition-colors">
            Início
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <Link href="/veiculos" className="hover:text-[#14223b] transition-colors">
            Lojas e Concessionárias
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <span className="text-[#14223b] font-medium">{dealership.name}</span>
        </nav>

        {/* Dealership Profile Banner & Header Card matching Figma 1211:2395 Desktop & 1211:2461 Mobile */}
        <div className="bg-white rounded-[16px] border border-[#e0e6f0] overflow-hidden shadow-xs mb-8">
          {/* Cover Banner */}
          <div className="relative h-[160px] sm:h-[220px] w-full bg-linear-to-r from-[#101d34] to-[#1e3a5f]">
            <Image
              src={dealership.bannerUrl}
              alt={dealership.name}
              fill
              priority
              className="object-cover opacity-35"
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/50 text-white backdrop-blur-xs">
                DEMO DATA
              </span>
            </div>
          </div>

          {/* Business Info Strip */}
          <div className="p-5 sm:p-7 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
              {/* Avatar + Title */}
              <div className="flex items-end gap-4">
                <div className="size-20 sm:size-24 rounded-[14px] bg-white p-1 shadow-md border border-[#e0e6f0] shrink-0 overflow-hidden relative">
                  <Image
                    src={dealership.logoUrl}
                    alt={dealership.name}
                    fill
                    className="object-cover rounded-[10px]"
                    sizes="96px"
                  />
                </div>
                <div className="pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-[20px] sm:text-[26px] font-bold text-[#14223b] leading-tight">
                      {dealership.name}
                    </h1>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] flex items-center gap-1">
                      <IconShield className="size-3 text-[#059669]" />
                      <span>Concessionária Cadastrada</span>
                    </span>
                  </div>
                  <p className="text-[12px] sm:text-[13px] text-[#62718a] mt-0.5">
                    {dealership.tradingName} · {dealership.city}, {dealership.state}
                  </p>
                </div>
              </div>

              {/* Contact Action */}
              <button
                type="button"
                onClick={handleOpenPhone}
                className="h-[44px] px-6 bg-[#e0151f] hover:bg-[#b91c1c] text-white font-bold text-[13px] rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0"
              >
                <IconPhone className="size-4" />
                <span>Ver Telefone da Loja</span>
              </button>
            </div>

            {/* Description & Operating Hours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#e0e6f0]">
              <div className="md:col-span-2">
                <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#62718a] mb-1">
                  Sobre a Concessionária
                </h3>
                <p className="text-[13px] text-[#48566a] leading-relaxed">
                  {dealership.description}
                </p>
              </div>

              <div className="bg-[#f8f9fb] rounded-[10px] p-3.5 border border-[#e8ecf2]">
                <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#62718a] mb-1 flex items-center gap-1.5">
                  <IconClock className="size-3.5 text-[#14223b]" />
                  <span>Horário de Atendimento</span>
                </h3>
                <p className="text-[12px] text-[#14223b] leading-relaxed mt-1">
                  {dealership.openingHours}
                </p>
                <p className="text-[11px] text-[#62718a] mt-2 flex items-start gap-1">
                  <IconPin className="size-3 text-[#e0151f] shrink-0 mt-0.5" />
                  <span>
                    {dealership.address} · {dealership.neighborhood}, {dealership.city} -{' '}
                    {dealership.state}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Section matching Figma 1211:2395 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-[20px] sm:text-[24px] font-bold text-[#14223b]">
                  Estoque da Loja
                </h2>
                <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#e2e7ee] text-[#14223b]">
                  {vehicles.length} {vehicles.length === 1 ? 'veículo' : 'veículos'}
                </span>
              </div>
              <p className="text-[13px] text-[#62718a] mt-0.5">
                Todos os veículos disponíveis para pronta entrega e visitação nesta loja
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveTab('todos')}
                className={`h-[34px] px-3.5 rounded-[7px] text-[12px] font-semibold transition-colors shrink-0 ${
                  activeTab === 'todos'
                    ? 'bg-[#14223b] text-white'
                    : 'bg-white border border-[#e0e6f0] text-[#62718a] hover:bg-[#f5f7fb]'
                }`}
              >
                Todos ({vehicles.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sedã')}
                className={`h-[34px] px-3.5 rounded-[7px] text-[12px] font-semibold transition-colors shrink-0 ${
                  activeTab === 'sedã'
                    ? 'bg-[#14223b] text-white'
                    : 'bg-white border border-[#e0e6f0] text-[#62718a] hover:bg-[#f5f7fb]'
                }`}
              >
                Sedãs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('suv')}
                className={`h-[34px] px-3.5 rounded-[7px] text-[12px] font-semibold transition-colors shrink-0 ${
                  activeTab === 'suv'
                    ? 'bg-[#14223b] text-white'
                    : 'bg-white border border-[#e0e6f0] text-[#62718a] hover:bg-[#f5f7fb]'
                }`}
              >
                SUVs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hatch')}
                className={`h-[34px] px-3.5 rounded-[7px] text-[12px] font-semibold transition-colors shrink-0 ${
                  activeTab === 'hatch'
                    ? 'bg-[#14223b] text-white'
                    : 'bg-white border border-[#e0e6f0] text-[#62718a] hover:bg-[#f5f7fb]'
                }`}
              >
                Hatches
              </button>
            </div>
          </div>

          {/* Vehicle Grid or Empty State */}
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredVehicles.map((vehicle) => (
                <PublicVehicleCard key={vehicle.id} vehicle={vehicle} variant="grid" />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#e0e6f0] rounded-[14px] p-10 text-center">
              <IconCar className="size-10 text-[#94a3b8] mx-auto mb-2" />
              <h3 className="text-[16px] font-bold text-[#14223b]">
                Nenhum veículo nesta categoria
              </h3>
              <p className="text-[12px] text-[#62718a] mt-1 max-w-sm mx-auto">
                Esta concessionária não possui veículos com essa característica no momento.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('todos')}
                className="mt-4 px-4 h-[36px] bg-slate-100 hover:bg-slate-200 text-[#14223b] font-medium text-[12px] rounded-[6px]"
              >
                Ver todo o estoque
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Dealership Phone Disclosure Modal */}
      {isPhoneModalOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 bg-[#0e1320]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPhoneModalOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsPhoneModalOpen(false);
          }}
        >
          <div className="bg-white rounded-[16px] max-w-[460px] w-full p-6 shadow-xl border border-[#e2e7ee] relative">
            <button
              type="button"
              onClick={() => setIsPhoneModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#62718a] hover:text-[#14223b] rounded-full hover:bg-slate-100"
              aria-label="Fechar"
            >
              <IconCross className="size-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-[#eef5fc] flex items-center justify-center">
                <IconPhone className="size-5 text-[#1463c7]" />
              </div>
              <div>
                <h3 id="dealer-phone-title" className="text-[18px] font-bold text-[#14223b]">
                  Telefone da Concessionária
                </h3>
                <p className="text-[12px] text-[#62718a]">{dealership.name}</p>
              </div>
            </div>

            {/* Revealed Phone Box */}
            <div className="bg-[#fff8f8] border border-[#fcd8d8] rounded-[12px] p-4 text-center mb-5">
              <p className="text-[12px] text-[#62718a] mb-2">{dealership.openingHours}</p>

              <div className="bg-white border border-[#f0c2c2] rounded-[8px] py-3 px-4 flex items-center justify-between shadow-xs">
                <span className="text-[20px] font-black text-[#14223b]">
                  {dealership.phoneFull}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="text-[12px] font-semibold text-[#1463c7] hover:underline flex items-center gap-1"
                >
                  {phoneCopied ? (
                    <>
                      <IconCheck className="size-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copiado!</span>
                    </>
                  ) : (
                    <span>Copiar</span>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-[#8c9ba5] uppercase tracking-wider font-semibold mt-2">
                DEMO DATA · Telefone simulado
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <a
                href={`tel:+55${rawPhoneDigits}`}
                className="h-[42px] bg-[#14223b] hover:bg-[#0e1320] text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center gap-2"
              >
                <IconPhone className="size-4" />
                <span>Ligar para a loja</span>
              </a>

              <a
                href={`https://wa.me/55${rawPhoneDigits}?text=${encodeURIComponent(
                  `Olá! Gostaria de falar com o atendimento da ${dealership.name}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[42px] bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center gap-2"
              >
                <IconMessageSquare className="size-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="bg-[#f5f7fb] border border-[#e0e6f0] rounded-[8px] p-3 text-[11px] text-[#62718a]">
              Atendimento presencial em: {dealership.address} - {dealership.neighborhood},{' '}
              {dealership.city} - {dealership.state}
            </div>
          </div>
        </div>
      )}

      <MarketplaceFooter />
    </div>
  );
}
