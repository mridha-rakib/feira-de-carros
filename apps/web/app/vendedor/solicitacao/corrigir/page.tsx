'use client';

import { MOCK_SELLER_APPLICATION_CORRECTION } from '@/lib/adapters/mock-seller-data';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SellerBreadcrumb } from '../../../components/SellerBreadcrumb';
import {
  IconAlert,
  IconCheck,
  IconClock,
  IconInfo,
  IconLock,
  IconPin,
  IconSend,
  IconUser,
} from '../../../components/SellerIcons';
import { SellerMobileBottomNav } from '../../../components/SellerMobileBottomNav';
import { SellerNavbar } from '../../../components/SellerNavbar';
import { SellerStepProgress } from '../../../components/SellerStepProgress';

export default function SellerCorrectionPage() {
  const router = useRouter();
  const application = MOCK_SELLER_APPLICATION_CORRECTION;

  const [address, setAddress] = useState(application.applicant.address || '');
  const [city, setCity] = useState(application.applicant.city || '');
  const [state, setState] = useState(application.applicant.state || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !city.trim() || !state.trim()) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    // Simulate PATCH /v1/seller-applications/me
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        router.push('/vendedor/solicitacao/status');
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] flex flex-col font-sans text-[#111827]">
      {/* Navbar */}
      <SellerNavbar variant="applicant" activeTab="cadastro" />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-24 md:pb-16">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: 'Meu cadastro', href: '/vendedor/solicitacao/status' },
            { label: 'Correção da solicitação', active: true },
          ]}
          mobileShortLabel="Feira de Carros › Meu cadastro"
        />

        {/* Heading */}
        <div className="mt-2 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-[33px] font-semibold text-[#111827] tracking-tight">
            Correção da solicitação
          </h1>
          <p className="text-sm sm:text-base text-[#5b6475] mt-1">
            Ajuste as informações solicitadas pela nossa equipe e reenvie sua solicitação para nova
            análise.
          </p>
          <p className="text-xs font-semibold text-[#b91c1c] mt-1 md:hidden">
            WEB-019 · Preview demonstrativo
          </p>
        </div>

        {/* Step Progress */}
        <SellerStepProgress currentStep={3} showStepperLine stepStatus="CORRECTION_REQUESTED" />

        {/* 2-Column Content Layout (925px left + 414px right on 1440px) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
          {/* Left Column: Form Card (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-[#dbe1e8] rounded-[12px] p-6 sm:p-8 shadow-sm">
            {/* Alert Banner (matching 2678:2276) */}
            <div className="bg-[#fff2da] border border-[#f2d799] rounded-[12px] p-5 sm:p-6 flex items-start gap-4 mb-8">
              <div className="size-[34px] text-[#b91c1c] shrink-0 mt-0.5">
                <IconAlert className="size-full" />
              </div>
              <div>
                <h2 className="text-lg sm:text-[20px] font-semibold text-[#111827]">
                  Correção solicitada
                </h2>
                <p className="text-xs sm:text-[14px] text-[#5b6475] mt-1 leading-relaxed">
                  Identificamos a necessidade de ajustar algumas informações na sua solicitação.
                  Revise os campos abaixo, faça as correções e reenvie para análise.
                </p>
              </div>
            </div>

            <h3 className="text-xl sm:text-[24px] font-semibold text-[#111827] mb-6">
              Ajuste os dados da sua solicitação
            </h3>

            <form onSubmit={handleResubmit} className="space-y-5">
              {/* Locked Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome completo (Locked) */}
                <div>
                  <label
                    htmlFor="field-fullname"
                    className="block text-sm font-semibold text-[#111827] mb-1.5"
                  >
                    Nome completo
                  </label>
                  <div className="bg-[#eef1f5] border border-[#dbe1e8] h-[52px] rounded-[7px] px-3.5 flex items-center gap-3">
                    <IconLock className="size-5 text-[#566273]" />
                    <input
                      id="field-fullname"
                      type="text"
                      readOnly
                      value={application.applicant.fullName}
                      className="bg-transparent text-[15px] text-[#111827] w-full cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                {/* CPF (Locked) */}
                <div>
                  <label
                    htmlFor="field-cpf"
                    className="block text-sm font-semibold text-[#111827] mb-1.5"
                  >
                    CPF
                  </label>
                  <div className="bg-[#eef1f5] border border-[#dbe1e8] h-[52px] rounded-[7px] px-3.5 flex items-center gap-3">
                    <IconLock className="size-5 text-[#566273]" />
                    <input
                      id="field-cpf"
                      type="text"
                      readOnly
                      value={application.applicant.cpfMasked}
                      className="bg-transparent text-[15px] text-[#111827] w-full cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço (Editable) */}
              <div>
                <label
                  htmlFor="field-address"
                  className="block text-sm font-semibold text-[#111827] mb-1.5"
                >
                  Endereço *
                </label>
                <div className="bg-white border border-[#dbe1e8] focus-within:border-[#b91c1c] h-[52px] rounded-[7px] px-3.5 flex items-center gap-3 transition-colors shadow-2xs">
                  <IconPin className="size-5 text-[#566273]" />
                  <input
                    id="field-address"
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Rua, número e complemento"
                    className="bg-transparent text-[15px] text-[#111827] w-full outline-none"
                  />
                </div>
              </div>

              {/* Cidade and UF (Editable) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="field-city"
                    className="block text-sm font-semibold text-[#111827] mb-1.5"
                  >
                    Cidade *
                  </label>
                  <div className="bg-white border border-[#dbe1e8] focus-within:border-[#b91c1c] h-[52px] rounded-[7px] px-3.5 flex items-center gap-3 transition-colors shadow-2xs">
                    <IconPin className="size-5 text-[#566273]" />
                    <input
                      id="field-city"
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="Ex: Ipatinga"
                      className="bg-transparent text-[15px] text-[#111827] w-full outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="field-state"
                    className="block text-sm font-semibold text-[#111827] mb-1.5"
                  >
                    UF *
                  </label>
                  <div className="bg-white border border-[#dbe1e8] focus-within:border-[#b91c1c] h-[52px] rounded-[7px] px-3.5 flex items-center gap-3 transition-colors shadow-2xs">
                    <IconUser className="size-5 text-[#566273]" />
                    <input
                      id="field-state"
                      type="text"
                      maxLength={2}
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value.toUpperCase());
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="MG"
                      className="bg-transparent text-[15px] text-[#111827] w-full uppercase outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Motivo da correção Box (matching 2678:2312) */}
              <div className="bg-[#fff2da] border border-[#f2d799] rounded-[8px] p-4 flex items-start gap-3 my-4">
                <IconInfo className="size-5 text-[#ba660a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-[#111827]">
                    Motivo da correção
                  </h4>
                  <p className="text-xs sm:text-[14px] text-[#5b6475] mt-0.5">
                    {application.correctionReason || 'Endereço incompleto na solicitação.'}
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-md">
                  {errorMsg}
                </div>
              )}

              {submitted && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-md flex items-center gap-2">
                  <IconCheck className="size-5 text-green-600" />
                  <span>Correções reenviadas com sucesso! Redirecionando para o status...</span>
                </div>
              )}

              {/* CTA Reenviar (matching 2678:2318) */}
              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className="w-full mt-4 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold h-[56px] rounded-[7px] flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed text-[16px]"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Reenviando dados...</span>
                  </>
                ) : (
                  <>
                    <IconSend className="size-5" />
                    <span>Reenviar para análise</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Card Histórico (lg:col-span-4, matching 2678:2322) */}
          <div className="lg:col-span-4 bg-white border border-[#dbe1e8] rounded-[12px] p-6 sm:p-7 shadow-sm">
            <h3 className="text-lg sm:text-[22px] font-semibold text-[#111827] mb-6">
              Histórico da solicitação
            </h3>

            <div className="space-y-8 relative">
              {/* Vertical connector line */}
              <div className="absolute left-[17px] top-[24px] bottom-[24px] w-[2px] bg-[#dbe1e8]" />

              {/* History Item 1 */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="size-9 rounded-full bg-[#159055] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <IconCheck className="size-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-[17px] font-semibold text-[#111827]">
                    Solicitação enviada
                  </h4>
                  <p className="text-xs sm:text-[14px] text-[#5b6475] mt-1">
                    24 out 2026, às 10:32
                  </p>
                </div>
              </div>

              {/* History Item 2 */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="size-9 rounded-full bg-[#159055] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <IconCheck className="size-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-[17px] font-semibold text-[#111827]">
                    Revisão concluída
                  </h4>
                  <p className="text-xs sm:text-[14px] text-[#5b6475] mt-1">
                    24 out 2026, às 16:47
                  </p>
                </div>
              </div>

              {/* History Item 3 */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="size-9 rounded-full bg-[#b91c1c] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <IconClock className="size-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-[17px] font-semibold text-[#111827]">
                    Correção solicitada
                  </h4>
                  <p className="text-xs sm:text-[14px] text-[#5b6475] mt-1">
                    24 out 2026, às 17:03
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom info note (matching 2678:2342) */}
            <div className="mt-8 bg-[#e8f2ff] border border-[#dbe1e8] rounded-[9px] p-4 flex items-start gap-3">
              <IconInfo className="size-5 text-[#0369a1] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-[14px] text-[#5b6475] leading-relaxed">
                Após o reenvio, sua solicitação voltará para análise e você receberá o resultado por
                e-mail.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <SellerMobileBottomNav activeTab="cadastro" userRole="applicant" />
    </div>
  );
}
