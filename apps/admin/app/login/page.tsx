'use client';

import { ApiError } from '@feira/api-client';
import { AlertCircle, Eye, EyeOff, Lock, ShieldAlert, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { getAuthAdapter } from '../../lib/adapters/auth-factory';
import { getSafeRedirectUrl } from '../../lib/security/redirect-validator';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Audit Finding F-03: Validate redirect against strict internal routes
  const rawRedirect = searchParams.get('redirect');
  const safeRedirectPath = React.useMemo(() => getSafeRedirectUrl(rawRedirect, '/'), [rawRedirect]);

  // Audit Finding F-01: Remove hardcoded demonstration credentials in production UI
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [errorType, setErrorType] = React.useState<'401' | '403' | 'validation' | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorType(null);
    setFieldErrors({});

    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'O e-mail institucional é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Formato de e-mail inválido';
    }

    if (!password) {
      errors.password = 'A senha é obrigatória';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuthAdapter();
      await auth.login({ email, password });
      router.push(safeRedirectPath);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 401) {
          setErrorType('401');
          setErrorMessage('Credenciais inválidas. Verifique seu e-mail e senha institucional.');
        } else if (err.statusCode === 403) {
          setErrorType('403');
          setErrorMessage(
            'Acesso negado. Sua conta não possui permissão para acessar o painel de administração.',
          );
        } else {
          setErrorMessage(err.message || 'Erro ao realizar login.');
        }
      } else {
        setErrorMessage('Falha na conexão com o servidor de autenticação.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC]">
      {/* ============================================================== */}
      {/* DESKTOP LEFT PANEL (Figma ADM-D-001) / MOBILE TOP (ADM-M-013)  */}
      {/* ============================================================== */}
      <div className="w-full lg:w-[45%] bg-[#0B111E] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="mb-8 lg:mb-14">
            <Image
              src="/brand/logo-white.png"
              alt="Feira de Carros"
              width={160}
              height={40}
              priority
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </div>

          {/* Section Subtitle Badge */}
          <div className="mb-3">
            <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest">
              Painel interno • Acesso restrito
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            <span className="hidden lg:inline">Controle seguro para sua equipe.</span>
            <span className="lg:hidden">Acesso seguro à equipe</span>
          </h1>

          {/* Subheading */}
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mb-8">
            <span className="hidden lg:inline">
              Acesse revisões de vendedores, aprovação de anúncios e operações autorizadas em um
              único ambiente.
            </span>
            <span className="lg:hidden">
              Gestão de anúncios, vendedores e operações autorizadas.
            </span>
          </p>

          {/* 3 Value Propositions with Shield Check Icons (Figma ADM-D-001) */}
          <div className="hidden lg:flex flex-col gap-5 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  Aprovação exclusivamente autorizada
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Decisões finais de vendedores e anúncios pertencem ao Main Admin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Financeiro e privacidade</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pagamentos, CPF/CNPJ e operações sensíveis exigem permissão.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Rastreamento de alterações</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Resultados reais exigem confirmação do servidor e trilha de auditoria.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Left Footer */}
        <div className="hidden lg:block pt-12 border-t border-slate-800/80 text-left">
          <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1">
            Feira de Carros / Main Admin • Sales • Support
          </p>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Funções liberadas somente por política de permissões. Sem acesso público a conversas,
            documentos ou pagamentos de venda de veículos.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT LOGIN FORM AREA (Figma ADM-D-001 & ADM-M-013)            */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Main White Login Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            {/* Lock Icon in Rounded Square */}
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              <span className="hidden lg:inline">Acesse sua área administrativa</span>
              <span className="lg:hidden">Entrar no painel</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
              <span className="hidden lg:inline">
                Somente contas internas com permissão válida.
              </span>
              <span className="lg:hidden">Use somente sua conta interna autorizada.</span>
            </p>

            {/* Error Alert Banner */}
            {errorMessage && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                  errorType === '403'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
                role="alert"
              >
                {errorType === '403' ? (
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">
                    {errorType === '403' ? 'Acesso não autorizado' : 'Credenciais inválidas'}
                  </p>
                  <p className="opacity-90 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700">
                  E-mail corporativo
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin.demo@feiradecarros.exemplo"
                  disabled={isLoading}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all ${
                    fieldErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-600 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={isLoading}
                    className={`w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all ${
                      fieldErrors.password
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-slate-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-600 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {/* Mobile Help Link (Figma ADM-M-013) */}
              <div className="lg:hidden pt-1 text-left">
                <span className="text-xs text-slate-500">
                  Problemas para acessar? Contate o administrador.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <span>Autenticando...</span>
                ) : (
                  <>
                    <span>Entrar no painel</span>
                    <span className="hidden lg:inline">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Notice Card Under Button (Figma ADM-D-001 & ADM-M-013) */}
            <div className="mt-5 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-left">
              <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                <span className="hidden lg:inline">Método de autenticação interna a confirmar</span>
                <span className="lg:inline hidden"> • </span>
                <span className="lg:hidden">Autenticação a confirmar</span>
              </p>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                <span className="hidden lg:inline">
                  E-mail/senha são um exemplo visual. Provedor, recuperação, MFA e regras de sessão
                  ainda dependem de definição técnica. O botão navega somente no protótipo.
                </span>
                <span className="lg:hidden">
                  O método e as regras de sessão dependem da configuração aprovada.
                </span>
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* DESKTOP: 3 STATE PREVIEW CARDS (Figma ADM-D-001)               */}
          {/* ============================================================== */}
          <div className="hidden lg:block space-y-3 pt-2 text-left">
            <h3 className="text-xs font-bold text-slate-700">
              Estados de acesso • exemplos de interface
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Card 1 */}
              <div className="p-3 rounded-xl bg-red-50/60 border border-red-100 text-left">
                <p className="text-xs font-bold text-red-900">Credenciais inválidas</p>
                <p className="text-[11px] text-red-700/90 mt-1 leading-snug">
                  Exibir mensagem genérica e permitir tentativa segura.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-left">
                <p className="text-xs font-bold text-amber-900">Acesso não autorizado</p>
                <p className="text-[11px] text-amber-700/90 mt-1 leading-snug">
                  Não revelar privilégios, contas ou dados privados.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
                <p className="text-xs font-bold text-slate-900">Conta suspensa</p>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Negar sessão e orientar canal interno apropriado.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* MOBILE: PRIVACIDADE E ACESSO CARD (Figma ADM-M-013)             */}
          {/* ============================================================== */}
          <div className="lg:hidden p-4 rounded-2xl bg-white border border-slate-200/80 text-left space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Privacidade e acesso
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <li>• Permissões validadas no servidor.</li>
              <li>• Nenhum dado sensível é exposto antes do login.</li>
              <li>• Acesso negado não confirma a existência da conta.</li>
            </ul>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[11px] text-slate-400 pt-2 space-y-1">
            <p>
              <span className="hidden lg:inline">
                AMBIENTE DEMONSTRATIVO • Sem login real; autorização, erros e sucesso dependem do
                backend.
              </span>
              <span className="lg:hidden">AMBIENTE DEMONSTRATIVO • Nenhuma autenticação real.</span>
            </p>
            <p className="lg:hidden">FEIRA DE CARROS • ADMIN MOBILE WEB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <AdminLoginContent />
    </React.Suspense>
  );
}
