'use client';

import { MOCK_APPLICANT_DATA } from '@/lib/adapters/mock-seller-data';
import { validateSellerApplicationForm } from '@/lib/utils/seller-validation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SellerBreadcrumb } from '../../components/SellerBreadcrumb';
import {
  IconCard,
  IconCheck,
  IconFile,
  IconInfo,
  IconMail,
  IconPhone,
  IconPin,
  IconSearch,
  IconSend,
  IconShield,
  IconUser,
} from '../../components/SellerIcons';
import { SellerMobileBottomNav } from '../../components/SellerMobileBottomNav';
import { SellerNavbar } from '../../components/SellerNavbar';
import { SellerStepProgress } from '../../components/SellerStepProgress';

export default function SellerApplicationPage() {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const applicant = MOCK_APPLICANT_DATA;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateSellerApplicationForm({
      fullName: applicant.fullName,
      cpf: applicant.cpfMasked,
      email: applicant.email,
      phone: applicant.phone,
      cep: '35160001',
      address: applicant.address || 'Av. Castelo Branco, 500',
      city: applicant.city,
      state: applicant.state,
      termsAccepted,
      lgpdConsent: termsAccepted,
    });

    if (!validation.isValid) {
      setErrorMsg(
        validation.errors.termsAccepted ||
          validation.errors.lgpdConsent ||
          'É necessário preencher os campos e concordar com os Termos de Uso e Privacidade.',
      );
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    // Simulate API call to POST /v1/seller-applications
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
            { label: 'Solicitação de vendedor', active: true },
          ]}
          mobileShortLabel="Feira de Carros › Meu cadastro"
        />

        {/* Header Heading */}
        <div className="mt-2 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-[33px] font-bold text-[#111827] tracking-tight">
            Solicitação de vendedor
          </h1>
          <p className="text-sm sm:text-base text-[#566273] mt-1">
            Solicite seu cadastro como vendedor para anunciar veículos na Feira de Carros.
          </p>
          <p className="text-xs font-semibold text-[#b91c1c] mt-1 md:hidden">
            WEB-016 · Preview demonstrativo
          </p>
        </div>

        {/* Step Progress */}
        <SellerStepProgress currentStep={1} />

        {/* Info / Analysis Notice (matching 2677:2189) */}
        <div className="bg-[#e8f2ff] border border-[#c0d3e8] rounded-[11px] p-4 sm:p-5 flex items-start gap-4 mb-8">
          <div className="size-[27px] rounded-full text-[#0369a1] shrink-0 mt-0.5">
            <IconInfo className="size-full" />
          </div>
          <div>
            <h2 className="text-base sm:text-[19px] font-bold text-[#111827]">
              Sua solicitação será analisada pela nossa equipe.
            </h2>
            <p className="text-xs sm:text-[14px] text-[#566273] mt-1 leading-relaxed">
              Após o envio, seus dados e documentos serão verificados. Você poderá acompanhar o
              andamento da análise no seu cadastro.
            </p>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Card (790px on 1440px) */}
          <div className="lg:col-span-7 xl:col-span-7 bg-white border border-[#dbe1e8] rounded-[13px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-7 text-[#b91c1c]">
                <IconFile className="size-full" />
              </div>
              <div>
                <h2 className="text-xl sm:text-[25px] font-bold text-[#111827]">
                  Dados da solicitação
                </h2>
                <p className="text-xs sm:text-[15px] text-[#566273]">
                  Confira as suas informações antes de enviar a solicitação.
                </p>
              </div>
            </div>

            <div className="h-px bg-[#dbe1e8] my-6" />

            {/* Readonly / Preview Data Rows */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Nome completo */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2 gap-2 sm:gap-6">
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <IconUser className="size-5 text-[#566273]" />
                  <span className="text-sm font-semibold text-[#111827]">Nome completo</span>
                </div>
                <div className="text-base text-[#111827] font-normal">{applicant.fullName}</div>
              </div>
              <div className="h-px bg-[#dbe1e8]" />

              {/* Row 2: CPF */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2 gap-2 sm:gap-6">
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <IconCard className="size-5 text-[#566273]" />
                  <span className="text-sm font-semibold text-[#111827]">CPF</span>
                </div>
                <div className="text-base text-[#111827] font-normal">{applicant.cpfMasked}</div>
              </div>
              <div className="h-px bg-[#dbe1e8]" />

              {/* Row 3: E-mail */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2 gap-2 sm:gap-6">
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <IconMail className="size-5 text-[#566273]" />
                  <span className="text-sm font-semibold text-[#111827]">E-mail</span>
                </div>
                <div className="text-base text-[#111827] font-normal">{applicant.email}</div>
              </div>
              <div className="h-px bg-[#dbe1e8]" />

              {/* Row 4: Telefone */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2 gap-2 sm:gap-6">
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <IconPhone className="size-5 text-[#566273]" />
                  <span className="text-sm font-semibold text-[#111827]">Telefone</span>
                </div>
                <div className="text-base text-[#111827] font-normal">{applicant.phone}</div>
              </div>
              <div className="h-px bg-[#dbe1e8]" />

              {/* Row 5: Cidade / UF */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2 gap-2 sm:gap-6">
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <IconPin className="size-5 text-[#566273]" />
                  <span className="text-sm font-semibold text-[#111827]">Cidade / UF</span>
                </div>
                <div className="text-base text-[#111827] font-normal">
                  {applicant.city} / {applicant.state}
                </div>
              </div>
              <div className="h-px bg-[#dbe1e8]" />

              {/* Row 6: Tipo de cadastro */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2 gap-2 sm:gap-6">
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <IconUser className="size-5 text-[#566273]" />
                  <span className="text-sm font-semibold text-[#111827]">Tipo de cadastro</span>
                </div>
                <div className="text-base text-[#111827] font-normal">
                  {applicant.registrationType}
                </div>
              </div>
              <div className="h-px bg-[#dbe1e8]" />

              {/* Terms Consent (LGPD compliance) */}
              <div className="pt-4">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (e.target.checked) setErrorMsg('');
                    }}
                    className="mt-1 size-4 rounded border-gray-300 text-[#b91c1c] focus:ring-[#b91c1c]"
                  />
                  <span className="text-xs sm:text-sm text-[#566273]">
                    Declaro que li e concordo com os{' '}
                    <span className="text-[#b91c1c] underline">Termos de Uso</span> e a{' '}
                    <span className="text-[#b91c1c] underline">Política de Privacidade</span> da
                    Feira de Carros.
                  </span>
                </label>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-md">
                  {errorMsg}
                </div>
              )}

              {submitted && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-md flex items-center gap-2">
                  <IconCheck className="size-5 text-green-600" />
                  <span>Solicitação enviada com sucesso! Redirecionando para o status...</span>
                </div>
              )}

              {/* Submit CTA (matching 2677:2236) */}
              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className="w-full mt-4 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold h-[56px] rounded-[7px] flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed text-[15px]"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processando envio...</span>
                  </>
                ) : (
                  <>
                    <IconSend className="size-5" />
                    <span>Enviar solicitação</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: "Como funciona" & "Privacidade" (550px on 1440px) */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6">
            {/* Como funciona Card (matching 2677:2241) */}
            <div className="bg-white border border-[#dbe1e8] rounded-[13px] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-7 text-[#0369a1]">
                  <IconInfo className="size-full" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-[24px] font-bold text-[#111827]">Como funciona</h3>
                  <p className="text-xs sm:text-[15px] text-[#566273]">
                    Entenda o processo de aprovação do seu cadastro.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6 relative">
                {/* Connecting vertical line */}
                <div className="absolute left-[15px] top-[24px] bottom-[24px] w-[2px] bg-[#dbe1e8]" />

                {/* Step 1 */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="size-8 rounded-full bg-[#b91c1c] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-base sm:text-[18px] font-semibold text-[#111827] flex items-center gap-2">
                      <IconFile className="size-4 text-[#566273]" />
                      Envie sua solicitação
                    </h4>
                    <p className="text-xs sm:text-[13px] text-[#566273] mt-0.5">
                      Preencha seus dados e confirme o envio.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="size-8 rounded-full bg-[#111827] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-base sm:text-[18px] font-semibold text-[#111827] flex items-center gap-2">
                      <IconSearch className="size-4 text-[#566273]" />
                      Análise da equipe
                    </h4>
                    <p className="text-xs sm:text-[13px] text-[#566273] mt-0.5">
                      Nossa equipe vai conferir as informações e realizar a validação do cadastro.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="size-8 rounded-full bg-[#111827] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-base sm:text-[18px] font-semibold text-[#111827] flex items-center gap-2">
                      <IconCheck className="size-4 text-[#566273]" />
                      Resultado da solicitação
                    </h4>
                    <p className="text-xs sm:text-[13px] text-[#566273] mt-0.5">
                      Você receberá um aviso por e-mail e poderá acompanhar o status na sua conta.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacidade e segurança Card (matching 2677:2269) */}
            <div className="bg-white border border-[#dbe1e8] rounded-[13px] p-6 sm:p-7 shadow-sm flex items-start gap-4">
              <div className="size-7 text-[#159055] shrink-0 mt-0.5">
                <IconShield className="size-full" />
              </div>
              <div>
                <h3 className="text-base sm:text-[22px] font-bold text-[#111827]">
                  Privacidade e segurança
                </h3>
                <p className="text-xs sm:text-[15px] text-[#566273] mt-1 leading-relaxed">
                  Seus dados são utilizados para a análise e aprovação do cadastro como vendedor na
                  Feira de Carros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <SellerMobileBottomNav activeTab="cadastro" userRole="applicant" />
    </div>
  );
}
