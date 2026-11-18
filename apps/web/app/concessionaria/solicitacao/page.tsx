'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowRight,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconInfo,
  IconLock,
  IconMail,
  IconPhone,
  IconPin,
  IconUser,
} from '@/app/components/SellerIcons';
import { DealershipHelperModal } from '@/app/components/dealership/DealershipHelperModal';
import { DealershipReviewModal } from '@/app/components/dealership/DealershipReviewModal';
import { DealershipSentModal } from '@/app/components/dealership/DealershipSentModal';
import { DealershipSidebarCards } from '@/app/components/dealership/DealershipSidebarCards';
import { DealershipStepper } from '@/app/components/dealership/DealershipStepper';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import {
  isEmailRegisteredGlobally,
  normalizeEmail,
  registerDemoAccount,
} from '@/lib/adapters/shared-auth-registry';
import {
  formatBrazilianPhone,
  formatCnpj,
  isAtLeast18YearsOld,
  isValidBrazilianPhone,
  isValidCnpj,
  maskCnpjForDisplay,
} from '@/lib/utils/cnpj-validator';
import { useDealerStore } from '@/stores/use-dealer-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function DealershipRegistrationPage() {
  const router = useRouter();
  const { draft, updateDraft, activeStep, setActiveStep, submitApplication } = useDealerStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSentModalOpen, setIsSentModalOpen] = useState(false);
  const [isHelperModalOpen, setIsHelperModalOpen] = useState(false);

  // Form field formatters
  const handleBirthDateChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    updateDraft({ birthDate: formatted });
    setErrorMessage('');
  };

  const handleCnpjChange = (val: string) => {
    updateDraft({ cnpj: formatCnpj(val) });
    setErrorMessage('');
  };

  const handlePhoneChange = (val: string) => {
    updateDraft({ phone: formatBrazilianPhone(val) });
    setErrorMessage('');
  };

  // Step 1 Validation: Dados da conta
  const validateStep1 = (): boolean => {
    if (!draft.firstName.trim()) {
      setErrorMessage('Informe o primeiro nome do responsável.');
      return false;
    }
    if (!draft.lastName.trim()) {
      setErrorMessage('Informe o sobrenome do responsável.');
      return false;
    }
    if (!draft.birthDate || draft.birthDate.length !== 10) {
      setErrorMessage('Data de nascimento em formato DD/MM/AAAA obrigatória.');
      return false;
    }
    if (!isAtLeast18YearsOld(draft.birthDate)) {
      setErrorMessage(
        'Cadastro permitido apenas para maiores de 18 anos conforme a legislação e termos do serviço.',
      );
      return false;
    }
    const cleanEmail = normalizeEmail(draft.email);
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Informe um endereço de e-mail corporativo válido.');
      return false;
    }
    // Global Email Uniqueness (Option 2)
    if (isEmailRegisteredGlobally(cleanEmail)) {
      setErrorMessage(
        'Este e-mail já está cadastrado na plataforma. Uma conta já existe com este endereço (faça login ou utilize outro e-mail).',
      );
      return false;
    }
    if (!draft.password || draft.password.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return false;
    }
    if (draft.password !== draft.confirmPassword) {
      setErrorMessage('A confirmação de senha não confere com a senha digitada.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  // Step 2 Validation: Dados da revenda
  const validateStep2 = (): boolean => {
    if (!draft.dealershipName.trim()) {
      setErrorMessage('Informe o nome da revenda ou razão social.');
      return false;
    }
    if (!draft.cnpj.trim()) {
      setErrorMessage('Informe o CNPJ da empresa.');
      return false;
    }
    if (!isValidCnpj(draft.cnpj)) {
      setErrorMessage('CNPJ inválido. Verifique os dígitos verificadores da Receita Federal.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  // Step 3 Validation: Contato e endereço
  const validateStep3 = (): boolean => {
    if (!draft.phone.trim()) {
      setErrorMessage('Informe o telefone para anúncios.');
      return false;
    }
    if (!isValidBrazilianPhone(draft.phone)) {
      setErrorMessage('Telefone inválido. Informe DDD e número com 10 ou 11 dígitos.');
      return false;
    }
    if (!draft.address.trim()) {
      setErrorMessage('Informe o endereço completo da revenda.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleNextStep = () => {
    if (activeStep === 1) {
      if (validateStep1()) setActiveStep(2);
    } else if (activeStep === 2) {
      if (validateStep2()) setActiveStep(3);
    } else if (activeStep === 3) {
      if (validateStep3()) setActiveStep(4);
    }
  };

  const handleFinalSubmit = () => {
    if (isSubmitting) return;

    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      setIsReviewModalOpen(false);
      return;
    }

    if (!draft.termsAccepted) {
      setErrorMessage(
        'Você deve concordar com os Termos de Uso e Política de Privacidade para enviar.',
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      const cleanEmail = normalizeEmail(draft.email);
      const cleanCnpjDigits = draft.cnpj.replace(/\D/g, '');

      // 1. Transaction Order: Register shared account FIRST!
      const regResult = registerDemoAccount({
        email: cleanEmail,
        fullName: `${draft.firstName.trim()} ${draft.lastName.trim()}`.trim(),
        role: 'dealer',
        status: 'pending_approval',
        phone: draft.phone,
        documentNumber: maskCnpjForDisplay(cleanCnpjDigits),
        dealershipName: draft.dealershipName,
      });

      if (!regResult.success) {
        setIsSubmitting(false);
        setErrorMessage(
          regResult.error ||
            'Não foi possível registrar a conta da concessionária. O e-mail informado já está em uso na plataforma.',
        );
        return;
      }

      // 2. Only after account registration succeeds, commit the dealership application state
      submitApplication();

      setIsSubmitting(false);
      setIsReviewModalOpen(false);
      setIsSentModalOpen(true);

      setTimeout(() => {
        router.push('/concessionaria/solicitacao/status');
      }, 1500);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-[70px] py-6 pb-20">
        {/* Breadcrumb matching Figma 1575:3463 */}
        <div className="flex items-center gap-2 text-[12px] text-[#697a95] mb-4">
          <Link href="/" className="hover:text-[#17243f] transition-colors">
            Início
          </Link>
          <span>›</span>
          <span>Cadastro de anunciante</span>
          <span>›</span>
          <span className="font-semibold text-[#17243f]">Concessionária</span>
        </div>

        {/* Page Title & Subtitle matching Figma 1575:3464 */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[26px] sm:text-[33px] font-semibold text-[#17243f] leading-tight">
              Cadastro da concessionária
            </h1>
            <p className="text-[14px] sm:text-[15px] text-[#697a95] mt-1">
              Informe os dados para solicitar aprovação como anunciante.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsHelperModalOpen(true)}
            className="self-start sm:self-auto text-[12px] font-medium text-[#215c9d] bg-[#e8f1ff] hover:bg-[#d9e8ff] px-3 py-1.5 rounded-[8px] flex items-center gap-1.5 transition-colors"
          >
            <IconInfo className="size-3.5" />
            <span>Guia de cadastro</span>
          </button>
        </div>

        {/* Stepper with 4 phases */}
        <DealershipStepper currentStep={activeStep} onStepClick={(step) => setActiveStep(step)} />

        {/* Error notification banner */}
        {errorMessage && (
          <div className="bg-[#fff1f0] border border-[#fecaca] text-[#b91c1c] text-[13px] p-3.5 rounded-[9px] mb-6 flex items-start gap-2.5 animate-in fade-in">
            <IconAlert className="size-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Two-Column Grid: Main Form (Left) & Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Main Multi-Step Form */}
          <div className="lg:col-span-8 bg-white border border-[#dee6f1] rounded-[13px] shadow-[0px_4px_13px_0px_rgba(18,26,43,0.07)] p-6 sm:p-8">
            {/* STEP 1: Dados do responsável */}
            {activeStep === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <IconUser className="size-5 text-[#17243f]" />
                  <h2 className="font-semibold text-[#17243f] text-[20px]">Dados do responsável</h2>
                </div>
                <p className="font-normal text-[#697a95] text-[12px] mb-6">
                  Conta individual que administrará os anúncios da revenda.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Nome */}
                  <div>
                    <label
                      htmlFor="dealer-first-name"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      Nome *
                    </label>
                    <input
                      id="dealer-first-name"
                      type="text"
                      value={draft.firstName}
                      onChange={(e) => updateDraft({ firstName: e.target.value })}
                      placeholder="Ex.: João"
                      className="w-full h-[41px] px-3 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                    />
                  </div>

                  {/* Sobrenome */}
                  <div>
                    <label
                      htmlFor="dealer-last-name"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      Sobrenome *
                    </label>
                    <input
                      id="dealer-last-name"
                      type="text"
                      value={draft.lastName}
                      onChange={(e) => updateDraft({ lastName: e.target.value })}
                      placeholder="Ex.: Silva"
                      className="w-full h-[41px] px-3 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                    />
                  </div>

                  {/* Data de nascimento */}
                  <div>
                    <label
                      htmlFor="dealer-birth-date"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      Data de nascimento (18+) *
                    </label>
                    <div className="relative">
                      <input
                        id="dealer-birth-date"
                        type="text"
                        value={draft.birthDate}
                        onChange={(e) => handleBirthDateChange(e.target.value)}
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        className="w-full h-[41px] pl-3 pr-10 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                      />
                      <IconCalendar className="size-4 text-[#9aa9be] absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div>
                    <label
                      htmlFor="dealer-email"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      E-mail corporativo *
                    </label>
                    <div className="relative">
                      <input
                        id="dealer-email"
                        type="email"
                        value={draft.email}
                        onChange={(e) => updateDraft({ email: e.target.value })}
                        placeholder="nome@exemplo.com.br"
                        className="w-full h-[41px] pl-3 pr-10 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                      />
                      <IconMail className="size-4 text-[#9aa9be] absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Senha */}
                  <div>
                    <label
                      htmlFor="dealer-password"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      Senha *
                    </label>
                    <div className="relative">
                      <input
                        id="dealer-password"
                        type={showPassword ? 'text' : 'password'}
                        value={draft.password || ''}
                        onChange={(e) => updateDraft({ password: e.target.value })}
                        placeholder="Crie uma senha segura"
                        className="w-full h-[41px] pl-3 pr-10 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-3 text-[#9aa9be] hover:text-[#17243f]"
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

                  {/* Confirmar senha */}
                  <div>
                    <label
                      htmlFor="dealer-confirm-password"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      Confirmar senha *
                    </label>
                    <div className="relative">
                      <input
                        id="dealer-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={draft.confirmPassword || ''}
                        onChange={(e) => updateDraft({ confirmPassword: e.target.value })}
                        placeholder="Repita sua senha"
                        className="w-full h-[41px] pl-3 pr-10 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-3 top-3 text-[#9aa9be] hover:text-[#17243f]"
                        aria-label={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                      >
                        {showConfirmPassword ? (
                          <IconEyeOff className="size-4" />
                        ) : (
                          <IconEye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step Action */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="h-[43px] px-6 bg-[#b91c1c] hover:bg-[#a11818] text-white font-semibold text-[13px] rounded-[8px] flex items-center gap-2 transition-colors"
                  >
                    <span>Continuar para dados da revenda</span>
                    <IconArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Dados da revenda */}
            {activeStep === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <IconBuilding className="size-5 text-[#17243f]" />
                  <h2 className="font-semibold text-[#17243f] text-[20px]">
                    Dados da concessionária
                  </h2>
                </div>
                <p className="font-normal text-[#697a95] text-[12px] mb-6">
                  Informações fiscais para identificação e aprovação do anunciante.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Nome da revenda */}
                  <div>
                    <label
                      htmlFor="dealer-company-name"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      Nome da revenda (requisito a confirmar) *
                    </label>
                    <input
                      id="dealer-company-name"
                      type="text"
                      value={draft.dealershipName}
                      onChange={(e) => updateDraft({ dealershipName: e.target.value })}
                      placeholder="Ex.: Líder Veículos e Seminovos"
                      className="w-full h-[41px] px-3 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                    />
                  </div>

                  {/* CNPJ */}
                  <div>
                    <label
                      htmlFor="dealer-cnpj"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      CNPJ (acesso restrito à equipe) *
                    </label>
                    <input
                      id="dealer-cnpj"
                      type="text"
                      value={draft.cnpj}
                      onChange={(e) => handleCnpjChange(e.target.value)}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      className="w-full h-[41px] px-3 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                    />
                  </div>
                </div>

                {/* Privacy disclaimer */}
                <div className="flex items-center gap-2 mt-6 p-3 bg-[#f8fafc] rounded-[8px] border border-[#e2e8f0]">
                  <IconLock className="size-4 text-[#697a95] shrink-0" />
                  <p className="text-[11px] text-[#697a95]">
                    O CNPJ e os dados cadastrais internos nunca aparecem no showroom público.
                  </p>
                </div>

                {/* Step Actions */}
                <div className="mt-8 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="h-[43px] px-5 bg-white border border-[#dee6f1] text-[#17243f] font-semibold text-[13px] rounded-[8px] hover:bg-[#f8fafc] transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="h-[43px] px-6 bg-[#b91c1c] hover:bg-[#a11818] text-white font-semibold text-[13px] rounded-[8px] flex items-center gap-2 transition-colors"
                  >
                    <span>Continuar para contato e endereço</span>
                    <IconArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Contato e endereço */}
            {activeStep === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <IconPhone className="size-5 text-[#17243f]" />
                  <h2 className="font-semibold text-[#17243f] text-[20px]">Contato e endereço</h2>
                </div>
                <p className="font-normal text-[#697a95] text-[12px] mb-6">
                  Canais oficiais de atendimento ao comprador e localização da loja.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Telefone */}
                  <div>
                    <label
                      htmlFor="dealer-phone"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      Telefone para anúncios *
                    </label>
                    <div className="relative">
                      <input
                        id="dealer-phone"
                        type="text"
                        value={draft.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="(31) 99999-9999"
                        maxLength={15}
                        className="w-full h-[41px] pl-3 pr-10 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                      />
                      <IconPhone className="size-4 text-[#9aa9be] absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* CEP */}
                  <div>
                    <label
                      htmlFor="dealer-cep"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      CEP *
                    </label>
                    <input
                      id="dealer-cep"
                      type="text"
                      value={draft.cep}
                      onChange={(e) => updateDraft({ cep: e.target.value })}
                      placeholder="35160-001"
                      className="w-full h-[41px] px-3 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                    />
                  </div>

                  {/* Endereço completo */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="dealer-address"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      Endereço completo (Rua, número, bairro) *
                    </label>
                    <div className="relative">
                      <input
                        id="dealer-address"
                        type="text"
                        value={draft.address}
                        onChange={(e) => updateDraft({ address: e.target.value })}
                        placeholder="Ex.: Av. Pedro Linhares Gomes, 4500, Horto"
                        className="w-full h-[41px] pl-3 pr-10 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                      />
                      <IconPin className="size-4 text-[#9aa9be] absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Cidade */}
                  <div>
                    <label
                      htmlFor="dealer-city"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      Cidade
                    </label>
                    <input
                      id="dealer-city"
                      type="text"
                      value={draft.city}
                      onChange={(e) => updateDraft({ city: e.target.value })}
                      placeholder="Ipatinga"
                      className="w-full h-[41px] px-3 bg-[#f8fafc] border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] focus:outline-none"
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label
                      htmlFor="dealer-state"
                      className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                    >
                      Estado (UF)
                    </label>
                    <input
                      id="dealer-state"
                      type="text"
                      value={draft.state}
                      onChange={(e) => updateDraft({ state: e.target.value })}
                      placeholder="MG"
                      className="w-full h-[41px] px-3 bg-[#f8fafc] border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Step Actions */}
                <div className="mt-8 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="h-[43px] px-5 bg-white border border-[#dee6f1] text-[#17243f] font-semibold text-[13px] rounded-[8px] hover:bg-[#f8fafc] transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="h-[43px] px-6 bg-[#b91c1c] hover:bg-[#a11818] text-white font-semibold text-[13px] rounded-[8px] flex items-center gap-2 transition-colors"
                  >
                    <span>Continuar para revisão</span>
                    <IconArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Revisão e envio */}
            {activeStep === 4 && (
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <IconCheck className="size-5 text-[#17243f]" />
                  <h2 className="font-semibold text-[#17243f] text-[20px]">Revisão e envio</h2>
                </div>
                <p className="font-normal text-[#697a95] text-[12px] mb-6">
                  Confira as informações antes de submeter sua solicitação para análise.
                </p>

                <div className="space-y-4 bg-[#f8fafc] border border-[#dee6f1] rounded-[10px] p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                    <div>
                      <span className="block text-[11px] font-semibold text-[#697a95] uppercase">
                        Responsável
                      </span>
                      <p className="font-medium text-[#17243f]">
                        {draft.firstName} {draft.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-[#697a95] uppercase">
                        Nascimento (18+)
                      </span>
                      <p className="font-medium text-[#17243f]">{draft.birthDate}</p>
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-[#697a95] uppercase">
                        E-mail de Acesso
                      </span>
                      <p className="font-medium text-[#17243f]">{draft.email}</p>
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-[#697a95] uppercase">
                        Telefone para Anúncios
                      </span>
                      <p className="font-medium text-[#17243f]">{draft.phone}</p>
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-[#697a95] uppercase">
                        Nome da Revenda
                      </span>
                      <p className="font-medium text-[#17243f]">{draft.dealershipName}</p>
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-[#697a95] uppercase">
                        CNPJ (Visualização protegida)
                      </span>
                      <p className="font-medium text-[#17243f]">{maskCnpjForDisplay(draft.cnpj)}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="block text-[11px] font-semibold text-[#697a95] uppercase">
                        Endereço
                      </span>
                      <p className="font-medium text-[#17243f]">
                        {draft.address}, {draft.city} - {draft.state} (CEP: {draft.cep})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms Acceptance */}
                <div className="mt-6 pt-5 border-t border-[#dee6f1]">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.termsAccepted}
                      onChange={(e) => updateDraft({ termsAccepted: e.target.checked })}
                      className="mt-1 size-4 rounded border-[#dee6f1] text-[#b91c1c] focus:ring-[#b91c1c]"
                    />
                    <span className="text-[12px] text-[#697a95] leading-relaxed">
                      Declaro que os dados fornecidos são verídicos e concordo com os{' '}
                      <Link href="/termos" className="text-[#215c9d] hover:underline font-semibold">
                        Termos de Uso
                      </Link>{' '}
                      e a{' '}
                      <Link
                        href="/privacidade"
                        className="text-[#215c9d] hover:underline font-semibold"
                      >
                        Política de Privacidade
                      </Link>
                      . Compreendo que a aprovação depende de análise cadastral pela equipe da Feira
                      de Carros.
                    </span>
                  </label>
                </div>

                {/* Step Actions */}
                <div className="mt-8 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="h-[43px] px-5 bg-white border border-[#dee6f1] text-[#17243f] font-semibold text-[13px] rounded-[8px] hover:bg-[#f8fafc] transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    disabled={!draft.termsAccepted || isSubmitting}
                    className="h-[43px] px-8 bg-[#b91c1c] hover:bg-[#a11818] text-white font-semibold text-[13px] rounded-[8px] flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Processando...' : 'Enviar solicitação'}</span>
                    <IconArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar cards */}
          <div className="lg:col-span-4">
            <DealershipSidebarCards />
          </div>
        </div>
      </main>

      <MarketplaceFooter />

      {/* Review Confirmation Modal matching Figma 1629:3560 */}
      <DealershipReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onConfirm={handleFinalSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Sent Modal matching Figma 1629:3572 */}
      <DealershipSentModal
        isOpen={isSentModalOpen}
        onClose={() => {
          setIsSentModalOpen(false);
          router.push('/concessionaria/solicitacao/status');
        }}
      />

      {/* Helper Guidance Modal matching Figma 1629:3604 */}
      <DealershipHelperModal
        isOpen={isHelperModalOpen}
        onClose={() => setIsHelperModalOpen(false)}
      />
    </div>
  );
}
