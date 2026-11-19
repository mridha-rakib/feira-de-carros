'use client';

import { BrandLogo } from '@feira/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MarketplaceFooter } from '../components/MarketplaceFooter';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import {
  IconAlert,
  IconCheck,
  IconCheckCircle,
  IconLock,
  IconMail,
  IconShield,
} from '../components/SellerIcons';

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-between">
      <MarketplaceHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        {/* Attached Premium Auth Wrapper matching Figma 1289:1144 */}
        <div className="bg-white border border-[#dde3ec] rounded-[20px] shadow-[0px_16px_38px_0px_rgba(14,22,41,0.13)] overflow-hidden w-full max-w-[1280px] grid grid-cols-1 lg:grid-cols-12 min-h-[530px]">
          {/* LEFT COLUMN: Recovery Form (Figma 845:322 - lg:col-span-6) */}
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

              {/* Page Heading matching Figma 845:318 */}
              <div className="mb-6">
                <h1 className="text-[26px] sm:text-[32px] font-bold text-[#131b2b] tracking-tight">
                  Recuperar acesso
                </h1>
                <p className="text-[13px] sm:text-[14px] text-[#6b7280] mt-1">
                  Informe seu e-mail para iniciar a recuperação da conta.
                </p>
              </div>

              {errorMessage && (
                <div className="bg-[#fff1f0] border border-[#fecaca] text-[#b91c1c] text-[12px] p-3 rounded-[9px] mb-5 flex items-start gap-2">
                  <IconAlert className="size-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {!isSuccess ? (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <p className="text-[16px] font-semibold text-[#111827]">Redefinição de acesso</p>

                  {/* Field: E-mail matching Figma 845:324 */}
                  <div>
                    <label
                      htmlFor="recovery-email"
                      className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                    >
                      E-mail da sua conta
                    </label>
                    <div className="relative">
                      <input
                        id="recovery-email"
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

                  {/* Primary CTA matching Figma 845:328 */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[48px] bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[9px] flex items-center justify-center transition-colors shadow-xs disabled:opacity-70 mt-2"
                  >
                    {isLoading ? 'Enviando...' : 'Continuar (simulação)'}
                  </button>

                  {/* Return to Login matching Figma 845:330 */}
                  <div className="pt-2 text-center">
                    <Link
                      href="/entrar"
                      className="text-[12px] font-medium text-[#6b7280] hover:text-[#111827] transition-colors"
                    >
                      ← Voltar para entrar
                    </Link>
                  </div>
                </form>
              ) : (
                /* Success Confirmation State */
                <div className="text-center py-6 space-y-4">
                  <div className="size-14 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center mx-auto">
                    <IconCheckCircle className="size-8 text-[#059669]" />
                  </div>
                  <h2 className="text-[20px] font-bold text-[#14223b]">
                    Instruções enviadas com sucesso!
                  </h2>
                  <p className="text-[13px] text-[#62718a] leading-relaxed max-w-sm mx-auto">
                    Se o e-mail <strong className="text-[#14223b] font-semibold">{email}</strong>{' '}
                    estiver cadastrado, enviamos as instruções para você redefinir sua senha com
                    validade de 2 horas.
                  </p>
                  <div className="bg-[#f8f9fb] border border-[#e0e6f0] rounded-[9px] p-3 text-[11px] text-[#62718a] max-w-sm mx-auto">
                    Ambiente demonstrativo · Nenhum e-mail real é disparado por este protótipo.
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/entrar"
                      className="inline-block px-6 h-[42px] bg-[#14223b] hover:bg-[#0e1320] text-white font-semibold text-[13px] rounded-[8px] leading-[42px] transition-colors shadow-xs"
                    >
                      Voltar ao login
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#94a3b8] text-center mt-6">
              Ambiente demonstrativo · O serviço definitivo será integrado ao endpoint de
              recuperação de senha.
            </p>
          </div>

          {/* RIGHT COLUMN: Editorial Vehicle Panel (Figma 1277:1176 - lg:col-span-6) */}
          <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-b from-[#091121] via-[#0d1931] to-[#111b36] p-8 lg:p-10 text-white flex-col justify-between relative overflow-hidden">
            <div>
              <div className="relative h-[180px] rounded-[12px] overflow-hidden mb-5">
                <Image
                  src="/images/hero/hero-desktop.png"
                  alt="Veículos Feira de Carros"
                  fill
                  className="object-cover"
                  sizes="500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,10,19,0.85)] via-[rgba(7,11,20,0.2)] to-transparent" />
                <div className="absolute bottom-3 left-3 bg-[#171f2e]/80 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase">
                  FEIRA DE CARROS · COMPRE COM SEGURANÇA
                </div>
              </div>

              <p className="text-[10px] font-semibold text-white/75 uppercase tracking-wider mb-1">
                SUA EXPERIÊNCIA DE COMPRA / FEIRA DE CARROS
              </p>
              <h2 className="text-[24px] font-bold leading-tight mb-2">
                Recupere o acesso com cuidado
              </h2>
              <p className="text-[13px] text-white/80 leading-relaxed mb-6">
                O serviço de redefinição garante a segurança de sua conta e anúncios favoritos.
              </p>

              {/* Checklist items matching Figma 1277:1181 */}
              <div className="space-y-2.5">
                <div className="bg-white/7 border border-white/13 rounded-[10px] px-3.5 py-2 flex items-center gap-2.5 text-[12px] font-medium">
                  <IconCheck className="size-4 text-[#e0151f] shrink-0 stroke-[3]" />
                  <span>Use o e-mail cadastrado na sua conta</span>
                </div>
                <div className="bg-white/7 border border-white/13 rounded-[10px] px-3.5 py-2 flex items-center gap-2.5 text-[12px] font-medium">
                  <IconCheck className="size-4 text-[#e0151f] shrink-0 stroke-[3]" />
                  <span>Nunca compartilhe links de redefinição com terceiros</span>
                </div>
                <div className="bg-white/7 border border-white/13 rounded-[10px] px-3.5 py-2 flex items-center gap-2.5 text-[12px] font-medium">
                  <IconCheck className="size-4 text-[#e0151f] shrink-0 stroke-[3]" />
                  <span>Nenhum e-mail real é enviado pelo protótipo</span>
                </div>
              </div>
            </div>

            {/* Trust Note matching Figma 1277:1190 */}
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
