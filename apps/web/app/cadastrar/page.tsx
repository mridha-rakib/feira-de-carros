'use client';

import { BrandLogo } from '@feira/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  isEmailRegisteredGlobally,
  normalizeEmail,
  registerDemoAccount,
} from '../../lib/adapters/shared-auth-registry';
import { isProductionEnvironment } from '../../lib/security/environment';
import { useBuyerStore } from '../../stores/use-buyer-store';
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
  IconUser,
} from '../components/SellerIcons';

export default function BuyerRegistrationPage() {
  const router = useRouter();
  const { loginSimulation } = useBuyerStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Previews
  const [simulateDuplicateEmail, setSimulateDuplicateEmail] = useState(false);

  // Format birthDate DD/MM/AAAA
  const handleBirthDateChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setBirthDate(formatted);
    setErrorMessage('');
  };

  const calculateAge = (dateStr: string): number | null => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const day = Number.parseInt(parts[0], 10);
    const month = Number.parseInt(parts[1], 10) - 1;
    const year = Number.parseInt(parts[2], 10);
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;

    const birth = new Date(year, month, day);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName.trim()) {
      setErrorMessage('Informe seu primeiro nome.');
      return;
    }

    if (!lastName.trim()) {
      setErrorMessage('Informe seu sobrenome.');
      return;
    }

    if (!birthDate || birthDate.length !== 10) {
      setErrorMessage('Nascimento em DD/MM/AAAA obrigatório.');
      return;
    }

    const age = calculateAge(birthDate);
    if (age === null || age < 18) {
      setErrorMessage(
        'Cadastro permitido apenas para maiores de 18 anos conforme a legislação e termos do serviço.',
      );
      return;
    }

    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Informe um e-mail válido.');
      return;
    }

    if (
      simulateDuplicateEmail ||
      cleanEmail === 'existente@exemplo.com' ||
      isEmailRegisteredGlobally(cleanEmail)
    ) {
      setErrorMessage(
        'Este endereço de e-mail já possui cadastro na plataforma. Uma conta já existe com este endereço (faça login ou utilize outro e-mail).',
      );
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('A confirmação de senha não confere com a senha informada.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage(
        'Você deve aceitar os Termos de Uso e Política de Privacidade para prosseguir.',
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Register account in shared demo accounts registry enforcing Option 2
      const regResult = registerDemoAccount({
        email: cleanEmail,
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        role: 'member',
        status: 'active',
        birthDate,
      });

      if (!regResult.success) {
        setIsLoading(false);
        setErrorMessage(
          regResult.error ||
            'Este endereço de e-mail já possui cadastro na plataforma. Uma conta já existe com este endereço.',
        );
        return;
      }

      if (typeof document !== 'undefined' && !isProductionEnvironment()) {
        document.cookie = 'fdc_web_session=demo_buyer_session; path=/; SameSite=Lax';
      }
      setIsLoading(false);
      setIsSuccess(true);
      loginSimulation(cleanEmail, `${firstName.trim()} ${lastName.trim()}`);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-between">
      <MarketplaceHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        {/* Attached Premium Auth Wrapper matching Figma 1289:1136 */}
        <div className="bg-white border border-[#dde3ec] rounded-[20px] shadow-[0px_16px_38px_0px_rgba(14,22,41,0.13)] overflow-hidden w-full max-w-[1280px] grid grid-cols-1 lg:grid-cols-12 min-h-[720px]">
          {/* LEFT COLUMN: Registration Form (Figma 845:218 - lg:col-span-6) */}
          <div className="lg:col-span-6 bg-[#fcfdfe] p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <div className="mb-5">
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

              {/* Page Heading matching Figma 845:214 */}
              <div className="mb-6">
                <h1 className="text-[26px] sm:text-[32px] font-bold text-[#131b2b] tracking-tight">
                  Criar conta
                </h1>
                <p className="text-[13px] sm:text-[14px] text-[#6b7280] mt-1">
                  Cadastre-se para salvar anúncios e conversar com vendedores.
                </p>
              </div>

              {errorMessage && (
                <div className="bg-[#fff1f0] border border-[#fecaca] text-[#b91c1c] text-[12px] p-3 rounded-[9px] mb-5 flex items-start gap-2">
                  <IconAlert className="size-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <p className="text-[16px] font-semibold text-[#111827]">
                    Informações de cadastro
                  </p>

                  {/* Nome & Sobrenome */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="buyer-reg-firstname"
                        className="block text-[12px] font-semibold text-[#111827] mb-1"
                      >
                        Nome
                      </label>
                      <input
                        id="buyer-reg-firstname"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Seu primeiro nome"
                        className="w-full h-[44px] px-3.5 bg-[#f2f5f9] border border-[#dae2eb] rounded-[8px] text-[13px] text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="buyer-reg-lastname"
                        className="block text-[12px] font-semibold text-[#111827] mb-1"
                      >
                        Sobrenome
                      </label>
                      <input
                        id="buyer-reg-lastname"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Seu sobrenome"
                        className="w-full h-[44px] px-3.5 bg-[#f2f5f9] border border-[#dae2eb] rounded-[8px] text-[13px] text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Data de Nascimento matching Figma 1177:504 */}
                  <div>
                    <label
                      htmlFor="buyer-reg-birthdate"
                      className="block text-[12px] font-semibold text-[#111827] mb-1"
                    >
                      Data de nascimento
                    </label>
                    <input
                      id="buyer-reg-birthdate"
                      type="text"
                      value={birthDate}
                      onChange={(e) => handleBirthDateChange(e.target.value)}
                      placeholder="DD/MM/AAAA"
                      maxLength={10}
                      className="w-full h-[44px] px-3.5 bg-[#f2f5f9] border border-[#dae2eb] rounded-[8px] text-[13px] text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                    />
                    <p className="text-[11px] text-[#e0151f] font-medium mt-1">
                      Nascimento em DD/MM/AAAA obrigatório. Cadastro permitido apenas para maiores
                      de 18 anos.
                    </p>
                  </div>

                  {/* E-mail matching Figma 845:224 */}
                  <div>
                    <label
                      htmlFor="buyer-reg-email"
                      className="block text-[12px] font-semibold text-[#111827] mb-1"
                    >
                      E-mail
                    </label>
                    <div className="relative">
                      <input
                        id="buyer-reg-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full h-[44px] pl-10 pr-4 bg-[#f2f5f9] border border-[#dae2eb] rounded-[8px] text-[13px] text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                      />
                      <IconMail className="size-4 text-[#6b7280] absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Senha & Confirmar Senha */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="buyer-reg-password"
                          className="block text-[12px] font-semibold text-[#111827]"
                        >
                          Senha
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[11px] text-[#6b7280] hover:text-[#111827] flex items-center gap-1 transition-colors"
                        >
                          {showPassword ? (
                            <>
                              <IconEyeOff className="size-3" /> Ocultar
                            </>
                          ) : (
                            <>
                              <IconEye className="size-3" /> Ver
                            </>
                          )}
                        </button>
                      </div>
                      <input
                        id="buyer-reg-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Crie sua senha"
                        className="w-full h-[44px] px-3.5 bg-[#f2f5f9] border border-[#dae2eb] rounded-[8px] text-[13px] text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="buyer-reg-confirm"
                        className="block text-[12px] font-semibold text-[#111827] mb-1"
                      >
                        Confirmar senha
                      </label>
                      <input
                        id="buyer-reg-confirm"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a senha"
                        className="w-full h-[44px] px-3.5 bg-[#f2f5f9] border border-[#dae2eb] rounded-[8px] text-[13px] text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Terms & Privacy Consent matching Figma 845:238 */}
                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 text-[#b91c1c] focus:ring-[#b91c1c] rounded"
                    />
                    <span className="text-[12px] text-[#6b7280] leading-snug">
                      Ao continuar, concordo com os{' '}
                      <Link href="/privacidade" className="text-[#1463c7] underline">
                        Termos de uso
                      </Link>{' '}
                      e a{' '}
                      <Link href="/privacidade" className="text-[#1463c7] underline">
                        Política de privacidade
                      </Link>
                      .
                    </span>
                  </label>

                  {/* Primary CTA matching Figma 845:236 */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[48px] bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[9px] flex items-center justify-center transition-colors shadow-xs disabled:opacity-70 pt-1"
                  >
                    {isLoading ? 'Cadastrando...' : 'Criar conta (simulação)'}
                  </button>

                  {/* Previews / Demonstrative toggles */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setBirthDate('10/10/2012')}
                      className="h-[36px] bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#121b2b] text-[10px] font-semibold rounded-[7px] text-center"
                    >
                      Prévia: menor de 18 anos
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulateDuplicateEmail((prev) => !prev)}
                      className={`h-[36px] rounded-[7px] text-[10px] font-semibold transition-colors ${
                        simulateDuplicateEmail
                          ? 'bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5]'
                          : 'bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#121b2b]'
                      }`}
                    >
                      {simulateDuplicateEmail
                        ? '✓ E-mail duplicado ativo'
                        : 'Prévia: e-mail duplicado'}
                    </button>
                  </div>

                  {/* Return to Login */}
                  <div className="text-center pt-3">
                    <Link
                      href="/entrar"
                      className="text-[12px] text-[#1463c7] font-semibold hover:underline"
                    >
                      Já tem uma conta cadastrada? Faça login
                    </Link>
                  </div>
                </form>
              ) : (
                /* Registration Confirmation State */
                <div className="text-center py-8 space-y-4">
                  <div className="size-16 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center mx-auto">
                    <IconCheck className="size-8 text-[#059669] stroke-[3]" />
                  </div>
                  <h2 className="text-[22px] font-bold text-[#14223b]">
                    Cadastro concluído com sucesso!
                  </h2>
                  <p className="text-[13px] text-[#62718a] max-w-sm mx-auto leading-relaxed">
                    Sua conta de comprador foi criada em ambiente demonstrativo. Você já pode
                    acessar sua conta e salvar anúncios favoritos.
                  </p>
                  <p className="text-[11px] text-[#64748b] max-w-sm mx-auto leading-relaxed bg-[#f8fafc] border border-[#e2e8f0] p-2.5 rounded-[8px]">
                    <strong>Nota de Simulação:</strong> Para acessar sua conta no ambiente de
                    demonstração, utilize as credenciais padrão do fixture (senha:{' '}
                    <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#cbd5e1]">
                      Senha@123
                    </code>{' '}
                    ou{' '}
                    <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#cbd5e1]">
                      123456
                    </code>
                    ). Senhas personalizadas não são persistidas sem backend integrado.
                  </p>
                  <div className="pt-4 flex flex-col gap-2 max-w-xs mx-auto">
                    <button
                      type="button"
                      onClick={() => router.push('/conta')}
                      className="w-full h-[44px] bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[13px] rounded-[8px] transition-colors"
                    >
                      Ir para minha conta
                    </button>
                    <Link
                      href="/veiculos"
                      className="w-full h-[40px] bg-white border border-[#e0e6f0] hover:bg-[#f8f9fb] text-[#14223b] font-medium text-[13px] rounded-[8px] flex items-center justify-center transition-colors"
                    >
                      Explorar veículos
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#94a3b8] text-center mt-6">
              Ambiente demonstrativo · Não armazena senhas em texto puro nem transmite dados reais.
            </p>
          </div>

          {/* RIGHT COLUMN: Editorial Vehicle Panel (Figma 1277:1156 - lg:col-span-6) */}
          <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-b from-[#091121] via-[#0d1931] to-[#111b36] p-8 lg:p-10 text-white flex-col justify-between relative overflow-hidden">
            <div>
              <div className="relative h-[220px] rounded-[12px] overflow-hidden mb-5">
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
              <h2 className="text-[26px] font-bold leading-tight mb-2">
                Sua próxima descoberta começa aqui
              </h2>
              <p className="text-[13px] text-white/80 leading-relaxed mb-6">
                Cadastre-se para uma ótima busca, sem nenhuma obrigação.
              </p>

              {/* Benefits Checklist matching Figma 1277:1161 */}
              <div className="space-y-2.5">
                <div className="bg-white/7 border border-white/13 rounded-[10px] px-3.5 py-2.5 flex items-center gap-2.5 text-[13px] font-medium">
                  <IconCheck className="size-4 text-[#e0151f] shrink-0 stroke-[3]" />
                  <span>Plataforma com anunciantes credenciados</span>
                </div>
                <div className="bg-white/7 border border-white/13 rounded-[10px] px-3.5 py-2.5 flex items-center gap-2.5 text-[13px] font-medium">
                  <IconCheck className="size-4 text-[#e0151f] shrink-0 stroke-[3]" />
                  <span>Data de nascimento DD/MM/AAAA</span>
                </div>
                <div className="bg-white/7 border border-white/13 rounded-[10px] px-3.5 py-2.5 flex items-center gap-2.5 text-[13px] font-medium">
                  <IconCheck className="size-4 text-[#e0151f] shrink-0 stroke-[3]" />
                  <span>Somente maiores de 18 anos</span>
                </div>
              </div>
            </div>

            {/* Trust Note matching Figma 1277:1170 */}
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
