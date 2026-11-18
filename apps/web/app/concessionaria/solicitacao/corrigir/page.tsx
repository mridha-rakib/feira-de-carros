'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowRight,
  IconBuilding,
  IconCheck,
  IconInfo,
  IconLock,
  IconPhone,
  IconPin,
  IconUser,
} from '@/app/components/SellerIcons';
import { DealershipSavedModal } from '@/app/components/dealership/DealershipSavedModal';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import { resubmitDealershipCorrection } from '@/lib/adapters/dealer-application-adapter';
import {
  formatBrazilianPhone,
  formatCnpj,
  isValidBrazilianPhone,
  isValidCnpj,
  maskCnpjForDisplay,
} from '@/lib/utils/cnpj-validator';
import { useDealerStore } from '@/stores/use-dealer-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

export default function DealershipCorrectionPage() {
  const router = useRouter();
  const { application, resubmitCorrection } = useDealerStore();

  const [dealershipName, setDealershipName] = useState(application.dealershipName || '');
  const [cnpj, setCnpj] = useState(application.cnpj || application.cnpjMasked || '');
  const [phone, setPhone] = useState(application.phone || '');
  const [address, setAddress] = useState(application.address || '');
  const [city, setCity] = useState(application.city || 'Ipatinga');
  const [state, setState] = useState(application.state || 'MG');
  const [cep, setCep] = useState(application.cep || '35160-285');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  const handleCnpjChange = (val: string) => {
    setCnpj(formatCnpj(val));
    setErrorMessage('');
  };

  const handlePhoneChange = (val: string) => {
    setPhone(formatBrazilianPhone(val));
    setErrorMessage('');
  };

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!dealershipName.trim()) {
      setErrorMessage('Informe a razão social ou nome da revenda.');
      return;
    }

    if (!cnpj.trim()) {
      setErrorMessage('Informe o CNPJ da empresa.');
      return;
    }

    const isUnchangedMasked =
      cnpj.includes('*') && Boolean(application.cnpjMasked) && cnpj === application.cnpjMasked;

    if (!isUnchangedMasked && !isValidCnpj(cnpj)) {
      setErrorMessage('CNPJ inválido. Verifique os dígitos verificadores da Receita Federal.');
      return;
    }

    if (!phone.trim() || !isValidBrazilianPhone(phone)) {
      setErrorMessage('Informe um telefone válido com DDD (10 ou 11 dígitos).');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('Informe o endereço completo da revenda.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Update dealer store
      const cleanDigits = isUnchangedMasked ? application.cnpj || '' : cnpj.replace(/\D/g, '');
      const cleanMasked = isUnchangedMasked
        ? application.cnpjMasked || maskCnpjForDisplay(cleanDigits)
        : maskCnpjForDisplay(cleanDigits);

      resubmitCorrection({
        dealershipName: dealershipName.trim(),
        tradeName: dealershipName.trim(),
        cnpj: cleanDigits,
        cnpjMasked: cleanMasked,
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        cep: cep.trim(),
      });

      // 2. Update mock adapter storage
      await resubmitDealershipCorrection(application.email, {
        dealershipName: dealershipName.trim(),
        tradeName: dealershipName.trim(),
        cnpj: cleanDigits,
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        cep: cep.trim(),
      });

      setIsSubmitting(false);
      setIsSavedModalOpen(true);

      setTimeout(() => {
        router.push('/concessionaria/solicitacao/status');
      }, 1400);
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Erro ao submeter correções. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-[70px] py-6 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-[#697a95] mb-4">
          <Link href="/" className="hover:text-[#17243f] transition-colors">
            Início
          </Link>
          <span>›</span>
          <Link
            href="/concessionaria/solicitacao/status"
            className="hover:text-[#17243f] transition-colors"
          >
            Status da solicitação
          </Link>
          <span>›</span>
          <span className="font-semibold text-[#17243f]">Corrigir cadastro</span>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-[26px] sm:text-[33px] font-semibold text-[#17243f] leading-tight">
            Corrigir dados da concessionária
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#697a95] mt-1">
            Atualize as informações solicitadas pela moderação para reanálise da equipe.
          </p>
        </div>

        {/* Review feedback note from moderation */}
        <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-[12px] p-5 mb-6 flex items-start gap-3">
          <IconAlert className="size-5 text-[#ea580c] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#9a3412] text-[15px]">
              Motivo do pedido de correção (Protocolo: {application.protocol})
            </h3>
            <p className="text-[13px] text-[#7c2d12] mt-1 leading-relaxed">
              {application.rejectionReason ||
                'Razão social divergente do cartão CNPJ da Receita Federal e comprovante de endereço desatualizado.'}
            </p>
          </div>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="bg-[#fff1f0] border border-[#fecaca] text-[#b91c1c] text-[13px] p-3.5 rounded-[9px] mb-6 flex items-start gap-2.5 animate-in fade-in">
            <IconAlert className="size-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white border border-[#dee6f1] rounded-[13px] shadow-[0px_4px_13px_0px_rgba(18,26,43,0.07)] p-6 sm:p-8 max-w-[900px]">
          <form onSubmit={handleSubmitCorrection} className="space-y-6">
            {/* Responsible Person Info (Read-only reference) */}
            <div className="p-4 bg-[#f8fafc] border border-[#dee6f1] rounded-[9px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconUser className="size-5 text-[#697a95]" />
                <div>
                  <p className="text-[11px] font-semibold uppercase text-[#697a95]">
                    Responsável cadastrado
                  </p>
                  <p className="text-[13px] font-medium text-[#17243f]">
                    {application.fullName} ({application.email})
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#215c9d] bg-[#e8f1ff] px-2.5 py-1 rounded-full">
                Conta de anunciante
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Razão Social / Nome da revenda */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="correct-dealership-name"
                  className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                >
                  Razão Social / Nome da revenda *
                </label>
                <div className="relative">
                  <input
                    id="correct-dealership-name"
                    type="text"
                    value={dealershipName}
                    onChange={(e) => {
                      setDealershipName(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Ex.: Líder Veículos e Seminovos Ltda"
                    className="w-full h-[41px] pl-3 pr-10 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                  />
                  <IconBuilding className="size-4 text-[#9aa9be] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* CNPJ */}
              <div>
                <label
                  htmlFor="correct-cnpj"
                  className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                >
                  CNPJ corrigido *
                </label>
                <input
                  id="correct-cnpj"
                  type="text"
                  value={cnpj}
                  onChange={(e) => handleCnpjChange(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="w-full h-[41px] px-3 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                />
              </div>

              {/* Telefone para anúncios */}
              <div>
                <label
                  htmlFor="correct-phone"
                  className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                >
                  Telefone para anúncios *
                </label>
                <div className="relative">
                  <input
                    id="correct-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="(31) 99999-9999"
                    maxLength={15}
                    className="w-full h-[41px] pl-3 pr-10 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                  />
                  <IconPhone className="size-4 text-[#9aa9be] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Endereço completo */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="correct-address"
                  className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                >
                  Endereço completo da loja (Rua, número, bairro) *
                </label>
                <div className="relative">
                  <input
                    id="correct-address"
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Av. Pedro Linhares Gomes, 4500, Horto"
                    className="w-full h-[41px] pl-3 pr-10 bg-white border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] placeholder-[#9aa9be] focus:outline-none focus:border-[#b91c1c]"
                  />
                  <IconPin className="size-4 text-[#9aa9be] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Cidade */}
              <div>
                <label
                  htmlFor="correct-city"
                  className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                >
                  Cidade
                </label>
                <input
                  id="correct-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-[41px] px-3 bg-[#f8fafc] border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] focus:outline-none"
                />
              </div>

              {/* Estado e CEP */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="correct-state"
                    className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                  >
                    Estado (UF)
                  </label>
                  <input
                    id="correct-state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full h-[41px] px-3 bg-[#f8fafc] border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="correct-cep"
                    className="block font-semibold text-[#17243f] text-[13px] mb-1.5"
                  >
                    CEP
                  </label>
                  <input
                    id="correct-cep"
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="w-full h-[41px] px-3 bg-[#f8fafc] border border-[#dee6f1] rounded-[7px] text-[13px] text-[#17243f] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Privacy note */}
            <div className="flex items-center gap-2 p-3 bg-[#f8fafc] rounded-[8px] border border-[#e2e8f0]">
              <IconLock className="size-4 text-[#697a95] shrink-0" />
              <p className="text-[11px] text-[#697a95]">
                Seu CNPJ corrigido é verificado sigilosamente pela moderação e nunca é publicado no
                perfil público.
              </p>
            </div>

            {/* Submit and Cancel Actions */}
            <div className="pt-4 border-t border-[#dee6f1] flex items-center justify-between">
              <Link
                href="/concessionaria/solicitacao/status"
                className="h-[43px] px-5 bg-white border border-[#dee6f1] text-[#17243f] font-semibold text-[13px] rounded-[8px] flex items-center justify-center hover:bg-[#f8fafc] transition-colors"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[43px] px-8 bg-[#b91c1c] hover:bg-[#a11818] text-white font-semibold text-[13px] rounded-[8px] flex items-center gap-2 transition-colors disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Enviando alterações...' : 'Reenviar para análise'}</span>
                <IconArrowRight className="size-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      <MarketplaceFooter />

      {/* Saved Modal matching Figma 1629:3582 */}
      <DealershipSavedModal
        isOpen={isSavedModalOpen}
        onClose={() => {
          setIsSavedModalOpen(false);
          router.push('/concessionaria/solicitacao/status');
        }}
      />
    </div>
  );
}
