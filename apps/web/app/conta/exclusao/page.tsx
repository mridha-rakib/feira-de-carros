'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MarketplaceFooter } from '../../components/MarketplaceFooter';
import { MarketplaceHeader } from '../../components/MarketplaceHeader';
import { IconAlert, IconCheck, IconCheckCircle, IconShield } from '../../components/SellerIcons';

export default function AccountDeletionPage() {
  const router = useRouter();

  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [protocol, setProtocol] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!confirmed) {
      setErrorMessage(
        'Você deve marcar a caixa de confirmação de ciência sobre o procedimento de exclusão.',
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      setProtocol(`EXC-2026-${randomSuffix}`);
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
          <span className="text-[#14223b] font-medium">Exclusão de conta (LGPD)</span>
        </nav>

        {/* Desktop Main + Security Guidance Grid matching Figma 1212:728 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Delete Account Request Form (Figma 1212:715 - lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white border border-[#dde3ec] rounded-[16px] p-6 sm:p-8 shadow-xs">
            {!isSuccess ? (
              <div>
                {/* State icon + title matching Figma 1212:716 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0">
                    <IconAlert className="size-5 text-[#b91c1c]" />
                  </div>
                  <div>
                    <h1 className="text-[22px] font-bold text-[#111827]">Confirmar solicitação</h1>
                    <p className="text-[13px] text-[#6b7280]">
                      Pedido de exclusão de dados e encerramento de conta
                    </p>
                  </div>
                </div>

                <p className="text-[14px] text-[#48566a] leading-relaxed mb-4">
                  Ao solicitar exclusão, o pedido será encaminhado para análise do administrador
                  conforme os requisitos da Lei Geral de Proteção de Dados (LGPD).
                </p>

                {/* Account Removal Disclosure matching Figma 1212:721 */}
                <div className="bg-[#f8f9fa] border border-[#e2e7ee] rounded-[12px] p-4 mb-5">
                  <h2 className="text-[14px] font-semibold text-[#111827] mb-1">
                    O que acontece depois?
                  </h2>
                  <p className="text-[13px] text-[#6b7280] leading-relaxed">
                    Após aprovação, os anúncios ativos e dados de perfil associados à conta serão
                    removidos. A retenção de dados cadastrais e logs exigida por lei (Marco Civil da
                    Internet) seguirá os prazos legais aplicáveis.
                  </p>
                </div>

                {errorMessage && (
                  <div className="bg-[#fff1f0] border border-[#fecaca] text-[#b91c1c] text-[12px] p-3 rounded-[9px] mb-5 flex items-start gap-2">
                    <IconAlert className="size-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Motivo da exclusão (opcional) */}
                  <div>
                    <label
                      htmlFor="deletion-reason"
                      className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                    >
                      Motivo da solicitação (opcional)
                    </label>
                    <select
                      id="deletion-reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full h-[46px] px-3.5 bg-[#f8f9fa] border border-[#dae2eb] rounded-[9px] text-[13px] text-[#111827] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                    >
                      <option value="">Selecione um motivo...</option>
                      <option value="nao_utilizo">Não utilizo mais a plataforma</option>
                      <option value="ja_comprei">Já comprei o veículo desejado</option>
                      <option value="privacidade">Preocupações com privacidade de dados</option>
                      <option value="outro">Outro motivo</option>
                    </select>
                  </div>

                  {/* Checkbox de confirmação */}
                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => {
                        setConfirmed(e.target.checked);
                        setErrorMessage('');
                      }}
                      className="mt-0.5 text-[#b91c1c] focus:ring-[#b91c1c] rounded"
                    />
                    <span className="text-[12px] text-[#48566a] leading-snug">
                      Estou ciente de que esta solicitação será encaminhada para revisão da equipe
                      de segurança e não pode ser desfeita após a aprovação final.
                    </span>
                  </label>

                  {/* Buttons matching Figma 1212:724 & 1212:726 */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:flex-1 h-[48px] bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[10px] flex items-center justify-center transition-colors shadow-xs disabled:opacity-70"
                    >
                      {isLoading ? 'Enviando pedido...' : 'Enviar solicitação de exclusão'}
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
              /* Confirmation State: DELETION REQUEST SUBMITTED matching Figma 1212:769 / 1212:794 */
              <div className="py-4 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-11 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center shrink-0">
                    <IconShield className="size-6 text-[#059669]" />
                  </div>
                  <div>
                    <h2 className="text-[22px] font-bold text-[#111827]">Pedido recebido</h2>
                    <p className="text-[12px] text-[#059669] font-medium">
                      Solicitação registrada no sistema
                    </p>
                  </div>
                </div>

                <p className="text-[14px] text-[#48566a] leading-relaxed">
                  O recebimento deste pedido não significa que a conta já tenha sido excluída.
                  Aguarde a análise e a comunicação da plataforma por e-mail.
                </p>

                {/* Protocol Box */}
                <div className="bg-[#f8f9fa] border border-[#e2e7ee] rounded-[10px] p-4 text-center">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700 mb-1">
                    DEMO PROTOCOL
                  </span>
                  <p className="text-[11px] font-medium text-[#68788e] uppercase tracking-wide">
                    Protocolo LGPD de exclusão
                  </p>
                  <p className="text-[20px] font-black font-mono text-[#111827] mt-1">{protocol}</p>
                </div>

                <div className="bg-[#f0f4f8] rounded-[9px] p-3 text-[11px] text-[#62718a]">
                  Seus dados permanecem temporariamente protegidos enquanto a solicitação é
                  processada administrativamente. Nenhuma exclusão definitiva é executada no
                  frontend.
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => router.push('/conta')}
                    className="w-full h-[48px] bg-[#14223b] hover:bg-[#0e1320] text-white font-semibold text-[14px] rounded-[10px] transition-colors shadow-xs"
                  >
                    Voltar à minha conta
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Security Guidance Panel matching Figma 1212:729 (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-[#dde3ec] rounded-[16px] p-6 sm:p-7 shadow-xs space-y-4">
            <h3 className="text-[18px] font-semibold text-[#111827]">Segurança da conta</h3>
            <p className="text-[13px] text-[#6b7280] leading-relaxed">
              Suas informações pessoais e solicitações são tratadas conforme a Política de
              privacidade.
            </p>
            <p className="text-[13px] text-[#6b7280] leading-relaxed">
              Solicitações de exclusão exigem análise administrativa para verificar se não há
              obrigações legais pendentes ou disputas em andamento.
            </p>
            <div className="bg-[#f8f9fa] border border-[#e2e7ee] rounded-[10px] p-4 text-[12px] text-[#48566a] space-y-2">
              <strong className="block text-[#111827] font-semibold">Direitos do titular:</strong>
              <p className="text-[#6b7280]">
                Conforme o Art. 18 da LGPD, você tem direito a solicitar a eliminação dos dados
                pessoais tratados com o consentimento do titular, ressalvadas as hipóteses de guarda
                obrigatória por lei.
              </p>
            </div>
          </div>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
