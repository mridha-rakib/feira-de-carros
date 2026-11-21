'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MarketplaceFooter } from '../../components/MarketplaceFooter';
import { MarketplaceHeader } from '../../components/MarketplaceHeader';
import {
  IconAlert,
  IconCheck,
  IconCheckCircle,
  IconEye,
  IconEyeOff,
  IconLock,
  IconShield,
} from '../../components/SellerIcons';

export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentPassword) {
      setErrorMessage('Informe sua senha atual.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('A nova senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage('A nova senha deve ser diferente da senha atual.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('A confirmação de senha não coincide com a nova senha.');
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

      <main className="flex-1 max-w-[1328px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[12px] text-[#62718a] mb-6 overflow-x-auto whitespace-nowrap"
        >
          <Link href="/" className="hover:text-[#14223b] transition-colors">
            Início
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <Link href="/conta" className="hover:text-[#14223b] transition-colors">
            Minha conta
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <span className="text-[#14223b] font-medium">Alterar senha</span>
        </nav>

        {/* Desktop Main + Security Guidance Grid matching Figma 1212:570 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Change Password Form (Figma 1212:549 - lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white border border-[#dde3ec] rounded-[16px] p-6 sm:p-8 shadow-xs">
            {!isSuccess ? (
              <div>
                {/* State icon + title matching Figma 1212:550 */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0">
                    <IconLock className="size-5 text-[#b91c1c]" />
                  </div>
                  <div>
                    <h1 className="text-[22px] font-bold text-[#111827]">Alterar senha</h1>
                    <p className="text-[13px] text-[#6b7280]">
                      Defina uma nova senha para proteger seu acesso
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-[#fff1f0] border border-[#fecaca] text-[#b91c1c] text-[12px] p-3 rounded-[9px] mb-5 flex items-start gap-2">
                    <IconAlert className="size-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Field: Senha atual matching Figma 1212:555 */}
                  <div>
                    <label
                      htmlFor="pwd-current"
                      className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                    >
                      Senha atual
                    </label>
                    <div className="relative">
                      <input
                        id="pwd-current"
                        type={showCurrent ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Digite sua senha atual"
                        className="w-full h-[48px] px-3.5 pr-11 bg-[#f8f9fa] border border-[#dae2eb] rounded-[9px] text-[13px] text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent((prev) => !prev)}
                        className="absolute right-3.5 top-3.5 text-[#6b7280] hover:text-[#111827] p-0.5"
                        aria-label={showCurrent ? 'Ocultar' : 'Exibir'}
                      >
                        {showCurrent ? (
                          <IconEyeOff className="size-4" />
                        ) : (
                          <IconEye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Field: Nova senha matching Figma 1212:559 */}
                  <div>
                    <label
                      htmlFor="pwd-new"
                      className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                    >
                      Nova senha
                    </label>
                    <div className="relative">
                      <input
                        id="pwd-new"
                        type={showNew ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Crie uma nova senha (mínimo 6 caracteres)"
                        className="w-full h-[48px] px-3.5 pr-11 bg-[#f8f9fa] border border-[#dae2eb] rounded-[9px] text-[13px] text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((prev) => !prev)}
                        className="absolute right-3.5 top-3.5 text-[#6b7280] hover:text-[#111827] p-0.5"
                        aria-label={showNew ? 'Ocultar' : 'Exibir'}
                      >
                        {showNew ? (
                          <IconEyeOff className="size-4" />
                        ) : (
                          <IconEye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Field: Confirmar nova senha matching Figma 1212:563 */}
                  <div>
                    <label
                      htmlFor="pwd-confirm"
                      className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                    >
                      Confirmar nova senha
                    </label>
                    <div className="relative">
                      <input
                        id="pwd-confirm"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a nova senha"
                        className="w-full h-[48px] px-3.5 pr-11 bg-[#f8f9fa] border border-[#dae2eb] rounded-[9px] text-[13px] text-[#111827] placeholder-[#6b7280] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="absolute right-3.5 top-3.5 text-[#6b7280] hover:text-[#111827] p-0.5"
                        aria-label={showConfirm ? 'Ocultar' : 'Exibir'}
                      >
                        {showConfirm ? (
                          <IconEyeOff className="size-4" />
                        ) : (
                          <IconEye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-[12px] text-[#6b7280] pt-1">
                    Use uma senha segura. As regras definitivas de validação serão aplicadas na
                    integração com a API.
                  </p>

                  {/* Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:flex-1 h-[48px] bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[10px] flex items-center justify-center transition-colors shadow-xs disabled:opacity-70"
                    >
                      {isLoading ? 'Salvando...' : 'Salvar nova senha'}
                    </button>
                    <Link
                      href="/conta"
                      className="w-full sm:w-auto px-6 h-[46px] bg-[#f8f9fa] border border-[#d1d5db] hover:bg-[#f1f3f5] text-[#111827] text-[13px] font-semibold rounded-[10px] flex items-center justify-center transition-colors text-center"
                    >
                      Cancelar e voltar
                    </Link>
                  </div>
                </form>
              </div>
            ) : (
              /* Confirmation State matching Figma 1212:619 */
              <div className="text-center py-6 space-y-4">
                <div className="size-16 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center mx-auto">
                  <IconCheckCircle className="size-8 text-[#059669]" />
                </div>
                <h2 className="text-[22px] font-bold text-[#111827]">
                  Senha atualizada com sucesso
                </h2>
                <p className="text-[14px] text-[#6b7280] leading-relaxed max-w-sm mx-auto">
                  Sua nova senha foi registrada em ambiente demonstrativo. Utilize sua nova senha
                  nos próximos acessos à plataforma.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => router.push('/conta')}
                    className="px-6 h-[44px] bg-[#14223b] hover:bg-[#0e1320] text-white font-semibold text-[13px] rounded-[9px] transition-colors shadow-xs"
                  >
                    Voltar à minha conta
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Security Guidance Panel matching Figma 1212:571 (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-[#dde3ec] rounded-[16px] p-6 sm:p-7 shadow-xs space-y-4">
            <h3 className="text-[18px] font-semibold text-[#111827]">Segurança da conta</h3>
            <p className="text-[13px] text-[#6b7280] leading-relaxed">
              Suas informações pessoais e solicitações são tratadas conforme a Política de
              privacidade.
            </p>
            <p className="text-[13px] text-[#6b7280] leading-relaxed">
              As credenciais e dados da conta são protegidos por acesso autenticado e nunca são
              compartilhados com terceiros.
            </p>
            <div className="bg-[#f8f9fa] border border-[#e2e7ee] rounded-[10px] p-4 text-[12px] text-[#48566a] space-y-2">
              <strong className="block text-[#111827] font-semibold">
                Recomendações para sua senha:
              </strong>
              <ul className="list-disc list-inside space-y-1 text-[#6b7280]">
                <li>Utilize letras maiúsculas, minúsculas e números.</li>
                <li>Evite datas de aniversário ou dados previsíveis.</li>
                <li>Não utilize a mesma senha de outros serviços.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
