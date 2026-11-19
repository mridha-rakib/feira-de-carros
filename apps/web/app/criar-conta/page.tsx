'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MarketplaceFooter } from '../components/MarketplaceFooter';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import {
  IconApple,
  IconBolt,
  IconCar,
  IconCheck,
  IconChevronRight,
  IconFacebook,
  IconGoogle,
  IconInfo,
  IconMethodEmail,
  IconMethodSocial,
  IconShield,
  IconStore,
  IconUser,
} from '../components/SellerIcons';

type AccountRole = 'buyer' | 'seller' | 'dealer';
type RegistrationMethod = 'email' | 'social';

interface RoleOption {
  id: AccountRole;
  title: string;
  description: string;
  destination: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'buyer',
    title: 'Sou comprador',
    description: 'Quero encontrar veículos e falar com vendedores.',
    destination: '/cadastrar',
    icon: IconUser,
  },
  {
    id: 'seller',
    title: 'Sou vendedor particular',
    description: 'Quero anunciar meus veículos e gerenciar anúncios.',
    destination: '/vendedor/solicitacao',
    icon: IconCar,
  },
  {
    id: 'dealer',
    title: 'Sou concessionária',
    description: 'Quero cadastrar minha loja e gerenciar o estoque.',
    destination: '/concessionaria/solicitacao',
    icon: IconStore,
  },
];

export default function CriarContaPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<AccountRole>('buyer');
  const [registrationMethod, setRegistrationMethod] = useState<RegistrationMethod>('email');
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const selectedOption = ROLE_OPTIONS.find((opt) => opt.id === selectedRole) || ROLE_OPTIONS[0];

  const handleContinue = () => {
    if (registrationMethod === 'email') {
      router.push(selectedOption.destination);
    } else {
      setNoticeMessage(
        `Integração social demonstrativa selecionada para o perfil ${selectedOption.title.toLowerCase()}. Prossiga com o preenchimento do formulário cadastral correspondente.`,
      );
      setTimeout(() => {
        router.push(selectedOption.destination);
      }, 1000);
    }
  };

  const handleSocialClick = (provider: 'Google' | 'Apple' | 'Facebook') => {
    setRegistrationMethod('social');
    setNoticeMessage(
      `Identificado provedor ${provider} para ${selectedOption.title.toLowerCase()}. A autenticação OAuth será integrada na fase backend; redirecionando para o formulário correspondente no modo demonstrativo...`,
    );
    setTimeout(() => {
      router.push(selectedOption.destination);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-between">
      <MarketplaceHeader />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center justify-center">
        {/* Main Grid: Card + Promo Image Panel */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-[1240px]">
          {/* LEFT: Account Selection Card */}
          <section
            aria-labelledby="account-selection-heading"
            className="lg:col-span-6 bg-white border border-[#dde3ec] rounded-[20px] p-6 sm:p-10 shadow-[0px_14px_34px_0px_rgba(14,22,41,0.08)] flex flex-col justify-between"
          >
            <div>
              {/* Badge (Figma 2912:31) */}
              <div className="mb-3">
                <span className="inline-block bg-[#fdebec] text-[#e0151f] text-[13px] font-semibold px-3.5 py-1 rounded-full">
                  Criar conta
                </span>
              </div>

              {/* Title & Subtitle (Figma 2912:33, 2912:34) */}
              <h1
                id="account-selection-heading"
                className="text-[26px] sm:text-[29px] font-bold text-[#101827] tracking-tight leading-tight"
              >
                Como deseja usar a Feira de Carros?
              </h1>
              <p className="text-[14px] sm:text-[15px] text-[#63738e] mt-1.5 mb-5">
                Escolha o tipo de conta e a forma de cadastro.
              </p>

              {/* Role Selection Options (Figma 2912:35 - 2912:65) */}
              <fieldset className="space-y-3 border-none p-0 m-0">
                <legend className="sr-only">Escolha o tipo de conta</legend>
                {ROLE_OPTIONS.map((option) => {
                  const isSelected = selectedRole === option.id;
                  const Icon = option.icon;

                  return (
                    <label
                      key={option.id}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-[12px] transition-all flex items-center justify-between gap-4 border cursor-pointer focus-within:ring-2 focus-within:ring-[#e0151f] ${
                        isSelected
                          ? 'border-[1.5px] border-[#e0151f] bg-[#fff1f2] shadow-xs'
                          : 'border-[#dde3ec] bg-white hover:border-[#b0c0d4] hover:bg-[#fafbfd]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="account-role"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => setSelectedRole(option.id)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3.5 sm:gap-4">
                        {/* Icon Container */}
                        <div
                          className={`size-11 rounded-[12px] flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[#fdebec] text-[#e0151f]'
                              : 'bg-[#f3f5f8] text-[#55657e]'
                          }`}
                        >
                          <Icon className="size-5" />
                        </div>

                        {/* Labels */}
                        <div>
                          <div className="text-[15px] sm:text-[16px] font-bold text-[#101827] leading-tight">
                            {option.title}
                          </div>
                          <div className="text-[12px] sm:text-[13px] text-[#63738e] mt-0.5 leading-snug">
                            {option.description}
                          </div>
                        </div>
                      </div>

                      {/* Right Indicator: Checkmark or Chevron */}
                      <div className="shrink-0 pl-2">
                        {isSelected ? (
                          <div
                            aria-hidden="true"
                            className="size-6 rounded-full bg-[#e0151f] text-white flex items-center justify-center shadow-xs"
                          >
                            <IconCheck className="size-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div aria-hidden="true" className="text-[#94a3b8] hover:text-[#63738e]">
                            <IconChevronRight className="size-5" />
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </fieldset>

              {/* Registration Method Selection (Figma 2918:2 - 2918:23) */}
              <div className="mt-6">
                <h2 className="text-[16px] sm:text-[18px] font-bold text-[#101827] mb-3">
                  Como você prefere se cadastrar?
                </h2>
                <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-none p-0 m-0">
                  <legend className="sr-only">Forma de cadastro</legend>

                  {/* Method: Email + Password */}
                  <label
                    className={`p-3.5 sm:p-4 rounded-[12px] border transition-all cursor-pointer flex flex-col justify-between relative focus-within:ring-2 focus-within:ring-[#e0151f] ${
                      registrationMethod === 'email'
                        ? 'border-[1.5px] border-[#e0151f] bg-[#fff1f2] shadow-xs'
                        : 'border-[#dde3ec] bg-white hover:border-[#b0c0d4] hover:bg-[#fafbfd]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="registration-method"
                      value="email"
                      checked={registrationMethod === 'email'}
                      onChange={() => setRegistrationMethod('email')}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <div
                        className={`size-10 rounded-[10px] flex items-center justify-center shrink-0 ${
                          registrationMethod === 'email'
                            ? 'bg-[#fde1e5] text-[#e0151f]'
                            : 'bg-[#f1f5fb] text-[#16243c]'
                        }`}
                      >
                        <IconMethodEmail className="size-5" />
                      </div>
                      <div className="pr-6">
                        <div className="text-[13px] sm:text-[14px] font-bold text-[#101827] leading-tight">
                          Com e-mail e senha
                        </div>
                        <div className="text-[11px] sm:text-[12px] text-[#63738e] mt-1 leading-snug">
                          Preencha um formulário com seus dados.
                        </div>
                      </div>
                    </div>
                    {registrationMethod === 'email' && (
                      <div
                        aria-hidden="true"
                        className="absolute top-3 right-3 size-5 rounded-full bg-[#e0151f] text-white flex items-center justify-center shadow-xs"
                      >
                        <IconCheck className="size-3 stroke-[3]" />
                      </div>
                    )}
                  </label>

                  {/* Method: Social Providers */}
                  <label
                    className={`p-3.5 sm:p-4 rounded-[12px] border transition-all cursor-pointer flex flex-col justify-between relative focus-within:ring-2 focus-within:ring-[#e0151f] ${
                      registrationMethod === 'social'
                        ? 'border-[1.5px] border-[#e0151f] bg-[#fff1f2] shadow-xs'
                        : 'border-[#dde3ec] bg-white hover:border-[#b0c0d4] hover:bg-[#fafbfd]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="registration-method"
                      value="social"
                      checked={registrationMethod === 'social'}
                      onChange={() => setRegistrationMethod('social')}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <div
                        className={`size-10 rounded-[10px] flex items-center justify-center shrink-0 ${
                          registrationMethod === 'social'
                            ? 'bg-[#fde1e5] text-[#e0151f]'
                            : 'bg-[#f1f5fb] text-[#16243c]'
                        }`}
                      >
                        <IconMethodSocial className="size-5" />
                      </div>
                      <div className="pr-6">
                        <div className="text-[13px] sm:text-[14px] font-bold text-[#101827] leading-tight">
                          Com Google, Apple ou Facebook
                        </div>
                        <div className="text-[11px] sm:text-[12px] text-[#63738e] mt-1 leading-snug">
                          Use sua conta atual para criar o cadastro.
                        </div>
                      </div>
                    </div>
                    {registrationMethod === 'social' && (
                      <div
                        aria-hidden="true"
                        className="absolute top-3 right-3 size-5 rounded-full bg-[#e0151f] text-white flex items-center justify-center shadow-xs"
                      >
                        <IconCheck className="size-3 stroke-[3]" />
                      </div>
                    )}
                  </label>
                </fieldset>
              </div>

              {/* Primary Action Button (Figma 2912:67) */}
              <button
                type="button"
                onClick={handleContinue}
                className="w-full h-[48px] bg-[#e0151f] hover:bg-[#c41217] active:bg-[#a81014] text-white font-semibold text-[15px] sm:text-[16px] rounded-[10px] flex items-center justify-center transition-colors shadow-xs mt-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0151f] focus-visible:ring-offset-2"
              >
                Continuar
              </button>

              {/* Link: Já possui uma conta? Entrar */}
              <div className="text-center mt-4">
                <span className="text-[13px] text-[#63738e]">Já possui uma conta? </span>
                <Link
                  href="/entrar"
                  className="text-[13px] font-bold text-[#e0151f] hover:text-[#b91c1c] underline-offset-2 hover:underline transition-colors"
                >
                  Entrar
                </Link>
              </div>

              {/* Feedback notice message (if user clicks or selects demonstrative actions) */}
              {noticeMessage && (
                <output className="block mt-4 p-3 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-[12px] rounded-[9px] text-center leading-relaxed">
                  {noticeMessage}
                </output>
              )}

              {/* Divider (Figma 2912:71 - 2912:73) */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-[#dde3ec]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[12px] sm:text-[13px] text-[#8292a6]">
                    ou continue com
                  </span>
                </div>
              </div>

              {/* Social Login Buttons (Figma 2912:74 - 2912:82, 2913:2 - 2913:10) */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialClick('Google')}
                  className="w-full h-[44px] bg-white border border-[#dde3ec] hover:border-[#b0c0d4] hover:bg-[#f8f9fb] text-[#111827] text-[13px] sm:text-[14px] font-semibold rounded-[9px] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                >
                  <IconGoogle className="size-5 shrink-0" />
                  <span>Continuar com Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialClick('Apple')}
                  className="w-full h-[44px] bg-white border border-[#dde3ec] hover:border-[#b0c0d4] hover:bg-[#f8f9fb] text-[#111827] text-[13px] sm:text-[14px] font-semibold rounded-[9px] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                >
                  <IconApple className="w-4 h-5 shrink-0" />
                  <span>Continuar com Apple</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialClick('Facebook')}
                  className="w-full h-[44px] bg-white border border-[#dde3ec] hover:border-[#b0c0d4] hover:bg-[#f8f9fb] text-[#111827] text-[13px] sm:text-[14px] font-semibold rounded-[9px] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                >
                  <IconFacebook className="size-5 shrink-0" />
                  <span>Continuar com Facebook</span>
                </button>
              </div>
            </div>

            {/* Bottom Info Note (Figma 2912:86 - Option 2 Global Email Uniqueness / AUTH-022) */}
            <div className="mt-8 pt-4 border-t border-[#edf2f7] flex items-center justify-center gap-2 text-center text-[#8292a6] text-[11px] sm:text-[12px]">
              <IconInfo className="size-4 shrink-0 text-[#8292a6]" />
              <span>Um e-mail = uma conta. Escolha o perfil correto antes de continuar.</span>
            </div>
          </section>

          {/* RIGHT: Promotional Image Card (Figma 2912:87 - 2912:112) */}
          <section
            aria-label="Benefícios da plataforma"
            className="lg:col-span-6 rounded-[20px] relative overflow-hidden min-h-[480px] lg:min-h-[700px] flex flex-col justify-between p-6 sm:p-10 shadow-[0px_14px_34px_0px_rgba(14,22,41,0.12)]"
          >
            {/* Background Photographic Image (Corolla hatchback from Figma asset ed011f08) */}
            <Image
              src="/images/auth-side-car.png"
              alt="Veículo Feira de Carros"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 600px"
            />

            {/* Tinted Gradient Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#080e1b]/95 via-[#0d172a]/75 to-[#0f1b32]/50"
              aria-hidden="true"
            />

            {/* Top Content: Red Bar & Headline */}
            <div className="relative z-10">
              <div className="h-[5px] w-[54px] bg-[#e0151f] rounded-full mb-6" aria-hidden="true" />
              <h2 className="text-[26px] sm:text-[32px] lg:text-[36px] font-bold text-white leading-[1.2] max-w-[480px]">
                Encontre, anuncie e gerencie veículos com uma experiência{' '}
                <span className="text-[#f42524]">simples e segura.</span>
              </h2>
            </div>

            {/* Bottom Content: Trust Badges */}
            <div className="relative z-10 space-y-3 mt-8">
              {/* Badge 1: Anúncios verificados */}
              <div className="bg-[#0b1424]/85 backdrop-blur-md border border-white/12 rounded-[14px] p-3.5 sm:p-4 flex items-center gap-3.5">
                <div className="size-10 rounded-[10px] bg-white/10 flex items-center justify-center shrink-0 text-white">
                  <IconShield className="size-5 text-[#38bdf8]" />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-white leading-tight">
                    Anúncios verificados
                  </div>
                  <div className="text-[12px] text-[#94a3b8] mt-0.5 leading-snug">
                    Mais confiança na sua negociação.
                  </div>
                </div>
              </div>

              {/* Badge 2: Variedade de veículos */}
              <div className="bg-[#0b1424]/85 backdrop-blur-md border border-white/12 rounded-[14px] p-3.5 sm:p-4 flex items-center gap-3.5">
                <div className="size-10 rounded-[10px] bg-white/10 flex items-center justify-center shrink-0 text-white">
                  <IconCar className="size-5 text-[#38bdf8]" />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-white leading-tight">
                    Variedade de veículos
                  </div>
                  <div className="text-[12px] text-[#94a3b8] mt-0.5 leading-snug">
                    Carros, motos e caminhões em um só lugar.
                  </div>
                </div>
              </div>

              {/* Badge 3: Experiência prática */}
              <div className="bg-[#0b1424]/85 backdrop-blur-md border border-white/12 rounded-[14px] p-3.5 sm:p-4 flex items-center gap-3.5">
                <div className="size-10 rounded-[10px] bg-white/10 flex items-center justify-center shrink-0 text-white">
                  <IconBolt className="size-5 text-[#38bdf8]" />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-white leading-tight">
                    Experiência prática
                  </div>
                  <div className="text-[12px] text-[#94a3b8] mt-0.5 leading-snug">
                    Cadastre, anuncie e gerencie com facilidade.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
