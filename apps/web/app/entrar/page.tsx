'use client';

import { BrandLogo } from '@feira/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import {
  authenticateDemoLogin,
  findAccountByEmail,
  isSafeRedirect,
  normalizeEmail,
} from '../../lib/adapters/shared-auth-registry';
import { isProductionEnvironment } from '../../lib/security/environment';
import { useBuyerStore } from '../../stores/use-buyer-store';
import { useDealerStore } from '../../stores/use-dealer-store';
import { MarketplaceFooter } from '../components/MarketplaceFooter';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import {
  IconAlert,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconShield,
} from '../components/SellerIcons';

function getSafeRedirect(rawRedirect: string | null): string {
  if (!rawRedirect) return '/conta';
  const trimmed = rawRedirect.trim();
  if (isSafeRedirect(trimmed)) {
    return trimmed;
  }
  return '/conta';
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = getSafeRedirect(
    searchParams.get('redirect') || searchParams.get('retorno'),
  );

  const { loginSimulation } = useBuyerStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuspendedPreview, setIsSuspendedPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (isSuspendedPreview) {
      setErrorMessage(
        'Esta conta de comprador encontra-se suspensa para análise de segurança. Entre em contato com o suporte institucional.',
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const authResult = authenticateDemoLogin(cleanEmail, password, redirectTarget);

      if (!authResult.success) {
        setIsLoading(false);
        setErrorMessage(
          authResult.error ||
            'Não foi possível concluir o login. Verifique seus dados e tente novamente.',
        );
        return;
      }

      const account = authResult.account;
      const targetDestination = authResult.destination || '/conta';

      // Set demo session cookie for local dev/testing environments only; never in production
      if (typeof document !== 'undefined' && !isProductionEnvironment()) {
        if (account?.role === 'dealer') {
          document.cookie = 'fdc_web_session=demo_dealer_session; path=/; SameSite=Lax';
        } else if (account?.role === 'seller') {
          document.cookie = 'fdc_web_session=demo_seller_session; path=/; SameSite=Lax';
        } else {
          document.cookie = 'fdc_web_session=demo_buyer_session; path=/; SameSite=Lax';
        }
      }

      if (account?.role === 'dealer') {
        useDealerStore.getState().loginSimulation(cleanEmail, account);
      } else if (account?.role === 'member') {
        loginSimulation(cleanEmail);
      }

      setIsLoading(false);
      router.push(targetDestination);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-between">
      <MarketplaceHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        {/* Attached Premium Auth Wrapper matching Figma 1286:1136 */}
        <div className="bg-white border border-[#dde3ec] rounded-[20px] shadow-[0px_16px_38px_0px_rgba(14,22,41,0.13)] overflow-hidden w-full max-w-[1280px] grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* LEFT COLUMN: Account Form (Figma 845:170 - lg:col-span-6) */}
          <div className="lg:col-span-6 bg-[#fcfdfe] p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <div className="mb-6">
                <Link href="/" className="inline-block">
                  <BrandLogo
                    variant="on-light"
                    priority
                    width={160}
                    height={36}
                    className="h-7 w-auto"
                  />
                </Link>
              </div>

              {/* Page Heading matching Figma 845:166 */}
              <div className="mb-6">
                <h1 className="text-[26px] sm:text-[32px] font-bold text-[#131b2b] tracking-tight">
                  Entrar na sua conta
                </h1>
                <p className="text-[13px] sm:text-[14px] text-[#6b7280] mt-1">
                  Acesse seus favoritos, buscas salvas e mensagens.
                </p>
              </div>

              {redirectTarget !== '/conta' && redirectTarget !== '/' && (
                <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[8px] p-2.5 mb-5 text-[12px] text-[#1e40af] flex items-center gap-2">
                  <IconShield className="size-4 shrink-0 text-[#2563eb]" />
                  <span>
                    Destino protegido solicitado:{' '}
                    <code className="font-mono font-semibold">{redirectTarget}</code>
                  </span>
                </div>
              )}

              {errorMessage && (
                <div className="bg-[#fff1f0] border border-[#fecaca] text-[#b91c1c] text-[12px] p-3 rounded-[9px] mb-5 flex items-start gap-2">
                  <IconAlert className="size-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Field: E-mail matching Figma 845:172 */}
                <div>
                  <label
                    htmlFor="buyer-login-email"
                    className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                  >
                    E-mail
                  </label>
                  <div className="relative">
                    <input
                      id="buyer-login-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage('');
                      }}
                      placeholder="seuemail@exemplo.com"
                      className="w-full h-[48px] pl-11 pr-4 bg-[#f2f5f9] border border-[#dae2eb] rounded-[9px] text-[13px] text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                    />
                    <IconMail className="size-5 text-[#6b7280] absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Field: Senha matching Figma 845:176 */}
                <div>
                  <label
                    htmlFor="buyer-login-password"
                    className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="buyer-login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMessage('');
                      }}
                      placeholder="Digite sua senha"
                      className="w-full h-[48px] pl-11 pr-11 bg-[#f2f5f9] border border-[#dae2eb] rounded-[9px] text-[13px] text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                    />
                    <IconLock className="size-5 text-[#6b7280] absolute left-3.5 top-3.5 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-3.5 text-[#6b7280] hover:text-[#111827] p-0.5"
                      aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? (
                        <IconEyeOff className="size-4" />
                      ) : (
                        <IconEye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Primary CTA matching Figma 845:180 */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[48px] bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[9px] flex items-center justify-center transition-colors shadow-xs disabled:opacity-70 mt-2"
                >
                  {isLoading ? 'Entrando...' : 'Entrar (simulação)'}
                </button>
              </form>

              {/* Social Login matching Figma 1177:518 */}
              <div className="mt-6 space-y-2.5">
                <p className="text-[12px] font-semibold text-[#6b7280] text-center mb-1">
                  Ou continue com uma conta existente (demonstrativo)
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('comprador.google@exemplo.com');
                    setPassword('123456');
                  }}
                  className="w-full h-[42px] bg-white border border-[#dae3ee] hover:bg-[#f8f9fb] text-[#111827] text-[13px] font-semibold rounded-[8px] flex items-center justify-center gap-2.5 transition-colors"
                >
                  <span className="font-bold text-[14px] text-blue-600">G</span>
                  <span>Continuar com Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('comprador.apple@exemplo.com');
                    setPassword('123456');
                  }}
                  className="w-full h-[42px] bg-white border border-[#dae3ee] hover:bg-[#f8f9fb] text-[#111827] text-[13px] font-semibold rounded-[8px] flex items-center justify-center gap-2.5 transition-colors"
                >
                  <span className="font-black text-[14px]"></span>
                  <span>Continuar com Apple</span>
                </button>
              </div>

              {/* Persona Fast-Fills for Testing & Evaluation (Phase 2 Shared Login Alignment) */}
              <div className="mt-6 p-3.5 bg-[#f5f8fc] border border-[#d8e2ee] rounded-[10px]">
                <p className="text-[11px] font-bold text-[#14223b] uppercase tracking-wider mb-2 text-center">
                  Contas de Demonstração por Perfil (AUTH-022)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('comprador@exemplo.com.br');
                      setPassword('123456');
                    }}
                    className="p-1.5 bg-white border border-[#cad5e2] hover:bg-[#ebf2fb] rounded-[6px] text-left transition-colors font-medium text-[#1e293b]"
                  >
                    <span className="block font-bold text-[#2563eb]">Comprador</span>
                    <span>comprador@...</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('vendedor@exemplo.com.br');
                      setPassword('123456');
                    }}
                    className="p-1.5 bg-white border border-[#cad5e2] hover:bg-[#ebf2fb] rounded-[6px] text-left transition-colors font-medium text-[#1e293b]"
                  >
                    <span className="block font-bold text-[#d97706]">Vendedor</span>
                    <span>vendedor@...</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('contato@liderveiculos.com.br');
                      setPassword('123456');
                    }}
                    className="p-1.5 bg-white border border-[#cad5e2] hover:bg-[#ebf2fb] rounded-[6px] text-left transition-colors font-medium text-[#1e293b]"
                  >
                    <span className="block font-bold text-[#059669]">Dealer (Ativo)</span>
                    <span>contato@lider...</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('dealer.pendente@exemplo.com');
                      setPassword('123456');
                    }}
                    className="p-1.5 bg-white border border-[#cad5e2] hover:bg-[#ebf2fb] rounded-[6px] text-left transition-colors font-medium text-[#1e293b]"
                  >
                    <span className="block font-bold text-[#6366f1]">Dealer (Pendente)</span>
                    <span>dealer.pendente@...</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('dealer.corrigir@exemplo.com');
                      setPassword('123456');
                    }}
                    className="p-1.5 bg-white border border-[#cad5e2] hover:bg-[#ebf2fb] rounded-[6px] text-left transition-colors font-medium text-[#1e293b]"
                  >
                    <span className="block font-bold text-[#ea580c]">Dealer (Corrigir)</span>
                    <span>dealer.corrigir@...</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@feiradecarros.com.br');
                      setPassword('123456');
                    }}
                    className="p-1.5 bg-white border border-[#cad5e2] hover:bg-[#fee2e2] rounded-[6px] text-left transition-colors font-medium text-[#991b1b]"
                  >
                    <span className="block font-bold text-[#dc2626]">Staff Admin</span>
                    <span>admin@feira...</span>
                  </button>
                </div>
              </div>

              {/* Navigation Links matching Figma 1279:1137 */}
              <div className="grid grid-cols-2 gap-2.5 mt-6">
                <Link
                  href="/recuperar-senha"
                  className="h-[42px] bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#121b2b] text-[11px] font-semibold rounded-[8px] flex items-center justify-center text-center transition-colors px-2"
                >
                  Esqueceu a senha?
                </Link>
                <Link
                  href="/cadastrar"
                  className="h-[42px] bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#121b2b] text-[11px] font-semibold rounded-[8px] flex items-center justify-center text-center transition-colors px-2"
                >
                  Criar conta
                </Link>
              </div>

              {/* Suspended Account Preview Toggle matching Figma 1279:1144 */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setIsSuspendedPreview((prev) => !prev)}
                  className={`w-full h-[38px] rounded-[8px] text-[11px] font-semibold transition-colors flex items-center justify-center ${
                    isSuspendedPreview
                      ? 'bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5]'
                      : 'bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#121b2b]'
                  }`}
                >
                  {isSuspendedPreview
                    ? '✓ Prévia: conta suspensa ativa'
                    : 'Prévia: simular conta suspensa'}
                </button>
              </div>
            </div>

            {/* Bottom Form Note */}
            <p className="text-[11px] text-[#94a3b8] text-center mt-6">
              Ambiente demonstrativo · Nenhuma credencial é transmitida a servidores externos.
            </p>
          </div>

          {/* RIGHT COLUMN: Editorial Vehicle Panel (Figma 1277:1136 - lg:col-span-6) */}
          <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-b from-[#091224] via-[#0e1b35] to-[#131c36] p-8 lg:p-10 text-white flex-col justify-between relative overflow-hidden">
            {/* Automotive Image Header */}
            <div>
              <div className="relative h-[220px] rounded-[12px] overflow-hidden mb-5">
                <Image
                  src="/images/hero/hero-desktop.png"
                  alt="Veículos Feira de Carros"
                  fill
                  className="object-cover"
                  sizes="500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,8,18,0.85)] via-[rgba(6,11,22,0.2)] to-transparent" />
                <div className="absolute bottom-3 left-3 bg-[#171f2e]/80 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase">
                  FEIRA DE CARROS · IPATINGA, MG
                </div>
              </div>

              <p className="text-[10px] font-semibold text-white/75 uppercase tracking-wider mb-1">
                SUA EXPERIÊNCIA DE COMPRA / FEIRA DE CARROS
              </p>
              <h2 className="text-[26px] font-bold leading-tight mb-2">Entre com segurança</h2>
              <p className="text-[13px] text-white/80 leading-relaxed mb-6">
                Salve favoritos, guarde suas buscas e retome conversas com os vendedores.
              </p>

              {/* Benefits Checklist matching Figma 1277:1141 */}
              <div className="space-y-2.5">
                <div className="bg-white/6 border border-white/14 rounded-[10px] px-3.5 py-2.5 flex items-center gap-2.5 text-[13px] font-medium">
                  <IconCheck className="size-4 text-[#e0151f] shrink-0 stroke-[3]" />
                  <span>Acompanhe veículos favoritos</span>
                </div>
                <div className="bg-white/6 border border-white/14 rounded-[10px] px-3.5 py-2.5 flex items-center gap-2.5 text-[13px] font-medium">
                  <IconCheck className="size-4 text-[#e0151f] shrink-0 stroke-[3]" />
                  <span>Guarde suas buscas salvas</span>
                </div>
                <div className="bg-white/6 border border-white/14 rounded-[10px] px-3.5 py-2.5 flex items-center gap-2.5 text-[13px] font-medium">
                  <IconCheck className="size-4 text-[#e0151f] shrink-0 stroke-[3]" />
                  <span>Converse diretamente pela plataforma</span>
                </div>
              </div>
            </div>

            {/* Trust Note matching Figma 1277:1150 */}
            <div className="bg-white/95 rounded-[11px] p-3.5 text-[#131b2b] flex items-center gap-3 mt-6">
              <IconShield className="size-6 text-[#1463c7] shrink-0" />
              <div className="text-[11px] leading-snug">
                <strong className="block font-semibold text-[#131b2b]">
                  Prévia de interface — sem autenticação real
                </strong>
                <span className="text-[#637185]">
                  A plataforma não recebe pagamento pela compra dos veículos.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}

export default function BuyerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
          <div className="size-8 rounded-full border-2 border-[#b91c1c] border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
