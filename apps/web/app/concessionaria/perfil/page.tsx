'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowRight,
  IconBuilding,
  IconCheck,
  IconCross,
  IconEye,
  IconFile,
  IconInfo,
  IconLock,
  IconPin,
  IconShield,
  IconTrash,
  IconUpload,
  IconUserRound,
} from '@/app/components/SellerIcons';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import {
  type DealerPublicProfile,
  useDealerProfileStore,
  validateBannerFile,
  validateLogoFile,
  validateProfile,
} from '@/stores/use-dealer-profile-store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useRef, useState } from 'react';

const BRAZILIAN_STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export default function DealershipBusinessProfilePage() {
  const router = useRouter();
  const {
    publishedProfile,
    draftProfile,
    isDirty,
    setDraftField,
    setLogoFile,
    removeLogo,
    setBannerFile,
    removeBanner,
    saveChanges,
    revertChanges,
  } = useDealerProfileStore();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Form feedback states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [logoError, setLogoError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoError(null);
    const result = setLogoFile(file);
    if (!result.success && result.error) {
      setLogoError(result.error);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerError(null);
    const result = setBannerFile(file);
    if (!result.success && result.error) {
      setBannerError(result.error);
    }
  };

  const handleSave = () => {
    setFormErrors({});
    setLogoError(null);
    setBannerError(null);

    const validation = validateProfile(draftProfile);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    const result = saveChanges();
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } else if (result.errors) {
      setFormErrors(result.errors);
    }
  };

  const handleRevert = () => {
    revertChanges();
    setFormErrors({});
    setLogoError(null);
    setBannerError(null);
    setSaveSuccess(false);
  };

  const handlePreviewClick = () => {
    if (isDirty) {
      setPendingNavigation(`/concessionarias/${publishedProfile.id}?preview=true`);
      setShowUnsavedModal(true);
    } else {
      router.push(`/concessionarias/${publishedProfile.id}?preview=true`);
    }
  };

  const confirmDiscardAndNavigate = () => {
    revertChanges();
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const confirmSaveAndNavigate = () => {
    const result = saveChanges();
    if (result.success) {
      setShowUnsavedModal(false);
      if (pendingNavigation) {
        router.push(pendingNavigation);
      }
    } else if (result.errors) {
      setFormErrors(result.errors);
      setShowUnsavedModal(false);
    }
  };

  const descLength = draftProfile.description?.length || 0;
  const isDescOverLimit = descLength > 500;

  return (
    <div className="min-h-screen bg-[#f5f8fd] flex flex-col font-sans text-[#16243c]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      {/* Main Container matching Figma 1594:3516 Desktop & 1594:3671 Mobile */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-[58px] py-6 pb-28">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[12px] text-[#63738e] mb-4"
        >
          <Link href="/" className="hover:text-[#16243c] transition-colors">
            Início
          </Link>
          <span>›</span>
          <Link href="/concessionaria/anuncios" className="hover:text-[#16243c] transition-colors">
            Minha concessionária
          </Link>
          <span>›</span>
          <span className="font-semibold text-[#16243c]">Perfil público</span>
        </nav>

        {/* Navigation Tabs (Estoque / Perfil Público / Showroom) */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#dfe7f1] pb-3 overflow-x-auto">
          <Link
            href="/concessionaria/anuncios"
            className="text-[13px] font-medium text-[#63738e] hover:text-[#16243c] px-3 py-1.5 rounded-[6px] transition-colors"
          >
            Estoque da frota
          </Link>
          <Link
            href="/concessionaria/perfil"
            className="text-[13px] font-semibold text-[#b91c1c] bg-[#fee2e2]/60 px-3 py-1.5 rounded-[6px] transition-colors"
          >
            Perfil público
          </Link>
          <Link
            href={`/concessionarias/${publishedProfile.id}?preview=true`}
            className="text-[13px] font-medium text-[#63738e] hover:text-[#16243c] px-3 py-1.5 rounded-[6px] transition-colors flex items-center gap-1.5 ml-auto"
          >
            <IconEye className="size-3.5" />
            <span>Ver showroom público</span>
          </Link>
        </div>

        {/* Page Header (WEB-022) */}
        <div className="mb-6">
          <h1 className="text-[28px] sm:text-[33px] font-bold text-[#16243c] tracking-tight leading-tight">
            Perfil público da concessionária
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#63738e] mt-1">
            Edite as informações exibidas para os compradores.
          </p>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div
            data-testid="save-success-banner"
            className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-[10px] p-4 mb-6 flex items-center justify-between text-[#065f46] text-[13px] shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="size-5 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                ✓
              </span>
              <span className="font-medium">
                Alterações salvas com sucesso! O perfil público e o showroom foram atualizados.
              </span>
            </div>
            <Link
              href={`/concessionarias/${publishedProfile.id}?preview=true`}
              className="font-semibold underline text-[#047857] hover:text-[#065f46] text-[12px] shrink-0 ml-3"
            >
              Visualizar no showroom público →
            </Link>
          </div>
        )}

        {/* Two-Column Grid: Form (Left) & Live Preview + Privacy Info (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Form Cards (7 Cols on LG) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Identidade Pública (Figma 1594:3548) */}
            <section
              aria-labelledby="heading-identidade"
              className="bg-white border border-[#dfe7f1] rounded-[12px] p-5 sm:p-6 shadow-xs"
            >
              <div className="flex items-start gap-3 mb-5">
                <div className="p-2 rounded-lg bg-[#f0f4fa] text-[#16243c] shrink-0">
                  <IconUserRound className="size-5 text-[#2265bb]" />
                </div>
                <div>
                  <h2
                    id="heading-identidade"
                    className="text-[18px] sm:text-[20px] font-bold text-[#16243c]"
                  >
                    Identidade pública
                  </h2>
                  <p className="text-[12px] text-[#63738e] mt-0.5">
                    Essas informações aparecerão para os compradores.
                  </p>
                </div>
              </div>

              {/* Public Dealership Name */}
              <div className="mb-5">
                <label
                  htmlFor="input-public-name"
                  className="block text-[13px] font-semibold text-[#16243c] mb-1.5"
                >
                  Nome público da revenda (requisito a confirmar)
                </label>
                <input
                  id="input-public-name"
                  data-testid="input-public-name"
                  type="text"
                  value={draftProfile.publicName}
                  onChange={(e) => setDraftField('publicName', e.target.value)}
                  placeholder="Ex.: Revenda Exemplo Veículos"
                  className="w-full h-[44px] px-3.5 bg-white border border-[#dfe7f1] rounded-[7px] text-[13px] text-[#16243c] placeholder-[#92a1b7] focus:outline-hidden focus:border-[#b91c1c] transition-colors"
                />
              </div>

              {/* Logo & Banner Upload Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Logo Upload Zone */}
                <div>
                  <span className="block text-[13px] font-semibold text-[#16243c] mb-1.5">
                    Logo da concessionária
                  </span>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleLogoChange}
                    className="hidden"
                    data-testid="file-input-logo"
                  />

                  {draftProfile.logoUrl ? (
                    <div
                      data-testid="logo-preview-card"
                      className="border border-[#dfe7f1] rounded-[9px] p-3 bg-[#f8fafc] flex items-center justify-between gap-3 h-[120px]"
                    >
                      <div className="size-16 rounded-[8px] border border-[#dfe7f1] bg-white overflow-hidden relative shrink-0">
                        <Image
                          src={draftProfile.logoUrl}
                          alt="Logo da concessionária"
                          fill
                          unoptimized={
                            draftProfile.logoUrl.startsWith('blob:') ||
                            draftProfile.logoUrl.startsWith('data:')
                          }
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 text-right">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          data-testid="btn-replace-logo"
                          className="text-[12px] font-semibold text-[#2265bb] hover:underline cursor-pointer"
                        >
                          Substituir logo
                        </button>
                        <button
                          type="button"
                          onClick={removeLogo}
                          data-testid="btn-remove-logo"
                          className="text-[11px] text-[#dc2626] hover:underline cursor-pointer"
                        >
                          Remover logo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      data-testid="upload-logo-zone"
                      className="w-full h-[120px] bg-[#f5f8fd] border border-[#c9d5e7] border-dashed rounded-[9px] flex flex-col items-center justify-center p-3 hover:bg-[#edf3fc] transition-colors cursor-pointer group"
                    >
                      <div className="size-7 rounded-full bg-[#eaf3ff] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                        <IconUpload className="size-4 text-[#2265bb]" />
                      </div>
                      <span className="text-[12px] font-semibold text-[#2265bb]">Enviar logo</span>
                      <span className="text-[10px] text-[#63738e] mt-0.5">
                        PNG, JPG ou WEBP · Máx. 2 MB
                      </span>
                    </button>
                  )}

                  {logoError && (
                    <p
                      data-testid="error-logo"
                      className="text-[11px] text-[#dc2626] mt-1 font-medium"
                    >
                      {logoError}
                    </p>
                  )}
                </div>

                {/* Banner Upload Zone */}
                <div>
                  <span className="block text-[13px] font-semibold text-[#16243c] mb-1.5">
                    Imagem de capa (banner)
                  </span>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleBannerChange}
                    className="hidden"
                    data-testid="file-input-banner"
                  />

                  {draftProfile.bannerUrl ? (
                    <div
                      data-testid="banner-preview-card"
                      className="border border-[#dfe7f1] rounded-[9px] p-2 bg-[#f8fafc] flex flex-col justify-between h-[120px] relative overflow-hidden"
                    >
                      <div className="h-[68px] w-full rounded-[6px] relative overflow-hidden bg-slate-200">
                        <Image
                          src={draftProfile.bannerUrl}
                          alt="Banner de capa"
                          fill
                          unoptimized={
                            draftProfile.bannerUrl.startsWith('blob:') ||
                            draftProfile.bannerUrl.startsWith('data:')
                          }
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 350px"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          data-testid="btn-replace-banner"
                          className="font-semibold text-[#2265bb] hover:underline cursor-pointer"
                        >
                          Substituir banner
                        </button>
                        <button
                          type="button"
                          onClick={removeBanner}
                          data-testid="btn-remove-banner"
                          className="text-[#dc2626] hover:underline cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      data-testid="upload-banner-zone"
                      className="w-full h-[120px] bg-[#f5f8fd] border border-[#c9d5e7] border-dashed rounded-[9px] flex flex-col items-center justify-center p-3 hover:bg-[#edf3fc] transition-colors cursor-pointer group"
                    >
                      <div className="size-7 rounded-full bg-[#eaf3ff] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                        <IconUpload className="size-4 text-[#2265bb]" />
                      </div>
                      <span className="text-[12px] font-semibold text-[#2265bb]">
                        Enviar imagem de capa
                      </span>
                      <span className="text-[10px] text-[#63738e] mt-0.5">
                        PNG, JPG ou WEBP · Máx. 5 MB
                      </span>
                    </button>
                  )}

                  {bannerError && (
                    <p
                      data-testid="error-banner"
                      className="text-[11px] text-[#dc2626] mt-1 font-medium"
                    >
                      {bannerError}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Card 2: Sobre a Revenda (Figma 1594:3571) */}
            <section
              aria-labelledby="heading-sobre"
              className="bg-white border border-[#dfe7f1] rounded-[12px] p-5 sm:p-6 shadow-xs"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#f0f4fa] text-[#16243c] shrink-0">
                  <IconFile className="size-5 text-[#2265bb]" />
                </div>
                <div>
                  <h2
                    id="heading-sobre"
                    className="text-[18px] sm:text-[19px] font-bold text-[#16243c]"
                  >
                    Sobre a revenda
                  </h2>
                  <p className="text-[12px] text-[#63738e] mt-0.5">
                    Uma descrição breve que apresenta sua concessionária aos compradores.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="textarea-description"
                  className="block text-[13px] font-semibold text-[#16243c] mb-1.5"
                >
                  Descrição pública
                </label>
                <textarea
                  id="textarea-description"
                  data-testid="textarea-description"
                  rows={4}
                  value={draftProfile.description}
                  onChange={(e) => setDraftField('description', e.target.value)}
                  placeholder="Conte um pouco sobre sua revenda, seu foco e o que os compradores podem esperar."
                  className={`w-full p-3 bg-white border ${
                    isDescOverLimit ? 'border-[#dc2626]' : 'border-[#dfe7f1]'
                  } rounded-[7px] text-[13px] text-[#16243c] placeholder-[#92a1b7] focus:outline-hidden focus:border-[#b91c1c] transition-colors leading-relaxed`}
                />
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  {formErrors.description ? (
                    <span className="text-[#dc2626] font-medium">{formErrors.description}</span>
                  ) : (
                    <span className="text-[#63738e]">Máximo de 500 caracteres</span>
                  )}
                  <span
                    data-testid="char-counter"
                    className={`font-medium ${isDescOverLimit ? 'text-[#dc2626]' : 'text-[#63738e]'}`}
                  >
                    {descLength}/500
                  </span>
                </div>
              </div>
            </section>

            {/* Card 3: Localização Pública (Figma 1594:3580) */}
            <section
              aria-labelledby="heading-localizacao"
              className="bg-white border border-[#dfe7f1] rounded-[12px] p-5 sm:p-6 shadow-xs"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#f0f4fa] text-[#16243c] shrink-0">
                  <IconPin className="size-5 text-[#2265bb]" />
                </div>
                <div>
                  <h2
                    id="heading-localizacao"
                    className="text-[18px] sm:text-[19px] font-bold text-[#16243c]"
                  >
                    Localização pública
                  </h2>
                  <p className="text-[12px] text-[#63738e] mt-0.5">
                    A cidade e o estado são exibidos no perfil. Endereço visível é opcional.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
                {/* Cidade * (Col 1-5) */}
                <div className="sm:col-span-5">
                  <label
                    htmlFor="input-city"
                    className="block text-[13px] font-semibold text-[#16243c] mb-1.5"
                  >
                    Cidade *
                  </label>
                  <input
                    id="input-city"
                    data-testid="input-city"
                    type="text"
                    value={draftProfile.city}
                    onChange={(e) => setDraftField('city', e.target.value)}
                    placeholder="Ex.: Ipatinga"
                    className={`w-full h-[44px] px-3.5 bg-white border ${
                      formErrors.city ? 'border-[#dc2626]' : 'border-[#dfe7f1]'
                    } rounded-[7px] text-[13px] text-[#16243c] placeholder-[#92a1b7] focus:outline-hidden focus:border-[#b91c1c] transition-colors`}
                  />
                  {formErrors.city && (
                    <p className="text-[11px] text-[#dc2626] mt-1 font-medium">{formErrors.city}</p>
                  )}
                </div>

                {/* Estado * (Col 6-8) */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="select-state"
                    className="block text-[13px] font-semibold text-[#16243c] mb-1.5"
                  >
                    Estado *
                  </label>
                  <select
                    id="select-state"
                    data-testid="select-state"
                    value={draftProfile.state}
                    onChange={(e) => setDraftField('state', e.target.value)}
                    className={`w-full h-[44px] px-3 bg-white border ${
                      formErrors.state ? 'border-[#dc2626]' : 'border-[#dfe7f1]'
                    } rounded-[7px] text-[13px] text-[#16243c] focus:outline-hidden focus:border-[#b91c1c] transition-colors`}
                  >
                    <option value="">Selecione</option>
                    {BRAZILIAN_STATES.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                  {formErrors.state && (
                    <p className="text-[11px] text-[#dc2626] mt-1 font-medium">
                      {formErrors.state}
                    </p>
                  )}
                </div>

                {/* Endereço visível (opcional) (Col 9-12) */}
                <div className="sm:col-span-4">
                  <label
                    htmlFor="input-address"
                    className="block text-[13px] font-semibold text-[#16243c] mb-1.5"
                  >
                    Endereço visível (opcional)
                  </label>
                  <input
                    id="input-address"
                    data-testid="input-address"
                    type="text"
                    value={draftProfile.address || ''}
                    onChange={(e) => setDraftField('address', e.target.value)}
                    placeholder="Ex.: Rua e número"
                    className="w-full h-[44px] px-3.5 bg-white border border-[#dfe7f1] rounded-[7px] text-[13px] text-[#16243c] placeholder-[#92a1b7] focus:outline-hidden focus:border-[#b91c1c] transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Card 4: Contato e Privacidade & Action Buttons (Figma 1594:3595) */}
            <section
              aria-labelledby="heading-contato"
              className="bg-white border border-[#dfe7f1] rounded-[12px] p-5 sm:p-6 shadow-xs"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#f0f4fa] text-[#16243c] shrink-0">
                  <IconShield className="size-5 text-[#2265bb]" />
                </div>
                <div>
                  <h2
                    id="heading-contato"
                    className="text-[18px] sm:text-[19px] font-bold text-[#16243c]"
                  >
                    Contato e privacidade
                  </h2>
                  <p className="text-[12px] text-[#63738e] mt-0.5">
                    Os dados pessoais e o CNPJ permanecem privados. Contato com compradores apenas
                    nos anúncios.
                  </p>
                </div>
              </div>

              {/* Strict Privacy Notice Box */}
              <div className="bg-[#eaf3ff] border border-[#d6e5f8] rounded-[8px] p-3.5 flex items-center gap-3 mb-6">
                <IconInfo className="size-5 text-[#2265bb] shrink-0" />
                <p className="text-[12px] font-medium text-[#2265bb] leading-relaxed">
                  CNPJ, informações pessoais e dados sensíveis não são exibidos publicamente.
                </p>
              </div>

              {/* Action Buttons (Desktop layout) */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-[#dfe7f1]">
                {isDirty && (
                  <button
                    type="button"
                    onClick={handleRevert}
                    data-testid="btn-revert-changes"
                    className="h-[40px] px-4 bg-white border border-[#dfe7f1] hover:bg-[#f8fafc] text-[#63738e] hover:text-[#16243c] font-medium text-[13px] rounded-[8px] transition-colors cursor-pointer"
                  >
                    Reverter alterações
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePreviewClick}
                  data-testid="btn-preview-profile"
                  className="h-[40px] px-5 bg-white border border-[#dfe7f1] hover:bg-[#f8fafc] text-[#16243c] font-semibold text-[13px] rounded-[8px] flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <IconEye className="size-4 text-[#63738e]" />
                  <span>Visualizar perfil</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  data-testid="btn-save-profile"
                  className="h-[40px] px-6 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[13px] rounded-[8px] flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Salvar alterações</span>
                  <IconArrowRight className="size-4 text-white" />
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Live Public Profile Preview & Sidebar (5 Cols on LG) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 5: Pré-visualização do perfil público (Figma 1594:3615) */}
            <aside
              aria-label="Pré-visualização do perfil público"
              className="bg-white border border-[#dfe7f1] rounded-[13px] p-5 shadow-xs overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[17px] sm:text-[19px] font-bold text-[#16243c]">
                  Pré-visualização do perfil público
                </h3>
                {isDirty ? (
                  <span
                    data-testid="preview-dirty-badge"
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#fff3dc] text-[#9a3412] border border-[#fde68a]"
                  >
                    Rascunho não salvo
                  </span>
                ) : (
                  <span
                    data-testid="preview-saved-badge"
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]"
                  >
                    Publicado
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#63738e] mb-4">
                Exemplo de como os compradores visualizarão a revenda.
              </p>

              {/* Showroom Live Card Container */}
              <div className="border border-[#dfe7f1] rounded-[10px] overflow-hidden bg-white shadow-2xs">
                {/* Cover Banner */}
                <div className="h-[140px] sm:h-[160px] w-full bg-linear-to-r from-[#101b31] to-[#1e3a5f] relative overflow-hidden">
                  {draftProfile.bannerUrl ? (
                    <Image
                      src={draftProfile.bannerUrl}
                      alt={draftProfile.publicName || 'Capa da concessionária'}
                      fill
                      unoptimized={
                        draftProfile.bannerUrl.startsWith('blob:') ||
                        draftProfile.bannerUrl.startsWith('data:')
                      }
                      className="object-cover opacity-80"
                      sizes="(max-width: 1440px) 100vw, 550px"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-white/50 text-[12px]">
                      Sem imagem de capa
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                      DEMO DATA
                    </span>
                  </div>
                </div>

                {/* Overlapping Logo + Info */}
                <div className="p-4 relative">
                  <div className="flex items-end gap-3 -mt-10 mb-3">
                    <div className="size-16 sm:size-20 rounded-[12px] bg-white border border-[#dfe7f1] p-1 shadow-md shrink-0 relative overflow-hidden">
                      {draftProfile.logoUrl ? (
                        <Image
                          src={draftProfile.logoUrl}
                          alt={draftProfile.publicName || 'Logo'}
                          fill
                          unoptimized={
                            draftProfile.logoUrl.startsWith('blob:') ||
                            draftProfile.logoUrl.startsWith('data:')
                          }
                          className="object-cover rounded-[8px]"
                          sizes="80px"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center bg-[#f1f5f9] text-[#94a3b8] text-[10px] font-semibold">
                          Logo
                        </div>
                      )}
                    </div>
                    <div>
                      <h4
                        data-testid="preview-dealership-name"
                        className="text-[17px] sm:text-[19px] font-bold text-[#16243c] leading-tight"
                      >
                        {draftProfile.publicName || 'Nome da Concessionária'}
                      </h4>
                      <div
                        data-testid="preview-location"
                        className="flex items-center gap-1 text-[12px] text-[#63738e] mt-0.5"
                      >
                        <IconPin className="size-3 text-[#b91c1c] shrink-0" />
                        <span>
                          {draftProfile.city || 'Cidade'}, {draftProfile.state || 'UF'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {draftProfile.address && (
                    <p className="text-[11px] text-[#63738e] mb-2">{draftProfile.address}</p>
                  )}

                  <p
                    data-testid="preview-description"
                    className="text-[12px] text-[#475569] leading-relaxed mb-4 bg-[#f8fafc] p-2.5 rounded-[8px] border border-[#eef2f6]"
                  >
                    {draftProfile.description || 'Descrição da concessionária...'}
                  </p>

                  {/* Sample Featured Vehicles */}
                  <div>
                    <h5 className="text-[12px] font-semibold text-[#16243c] mb-2">
                      Veículos em destaque
                    </h5>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-[58px] rounded-[6px] relative overflow-hidden bg-slate-100 border border-[#e2e8f0]">
                        <Image
                          src="/images/vehicles/demo/toyota-corolla-2021-b6.jpg"
                          alt="Veículo destaque 1"
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </div>
                      <div className="h-[58px] rounded-[6px] relative overflow-hidden bg-slate-100 border border-[#e2e8f0]">
                        <Image
                          src="/images/vehicles/demo/chevrolet-onix-2022.jpg"
                          alt="Veículo destaque 2"
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </div>
                      <div className="h-[58px] rounded-[6px] relative overflow-hidden bg-slate-100 border border-[#e2e8f0]">
                        <Image
                          src="/images/vehicles/demo/vw-polo-2023.jpg"
                          alt="Veículo destaque 3"
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Card 6: O que aparece no seu perfil? (Figma 1594:3631) */}
            <aside
              aria-label="Diretrizes de visibilidade e privacidade"
              className="bg-white border border-[#dfe7f1] rounded-[12px] p-5 shadow-xs"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <IconEye className="size-5 text-[#2265bb]" />
                <h3 className="text-[17px] font-bold text-[#16243c]">
                  O que aparece no seu perfil?
                </h3>
              </div>

              <ul className="space-y-2.5 text-[12px] text-[#475569] mb-5">
                <li className="flex items-center gap-2">
                  <span className="size-4 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-bold text-[10px] shrink-0">
                    ✓
                  </span>
                  <span>Nome público da revenda</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-4 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-bold text-[10px] shrink-0">
                    ✓
                  </span>
                  <span>Logo e imagem de capa (se informados)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-4 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-bold text-[10px] shrink-0">
                    ✓
                  </span>
                  <span>Descrição pública</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-4 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-bold text-[10px] shrink-0">
                    ✓
                  </span>
                  <span>Cidade e estado</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-4 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-bold text-[10px] shrink-0">
                    ✓
                  </span>
                  <span>Endereço visível (se informado)</span>
                </li>
              </ul>

              {/* Blocked Private Data Box (Figma 1594:3651) */}
              <div className="bg-[#eaf3ff] border border-[#d6e5f8] rounded-[8px] p-4 text-[12px]">
                <div className="flex items-center gap-2 mb-2 text-[#2967af] font-semibold text-[13px]">
                  <IconLock className="size-4" />
                  <span>O que não é exibido?</span>
                </div>
                <ul className="space-y-1.5 text-[#556980]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#d52331] font-bold text-[13px] shrink-0">✕</span>
                    <span>CNPJ da concessionária</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#d52331] font-bold text-[13px] shrink-0">✕</span>
                    <span>Dados pessoais do responsável</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#d52331] font-bold text-[13px] shrink-0">✕</span>
                    <span>Telefone e chat fora de anúncios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#d52331] font-bold text-[13px] shrink-0">✕</span>
                    <span>Outros dados internos da conta</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <p className="text-[12px] text-[#63738e] mt-8 text-center sm:text-left">
          Os dados são ilustrativos. Itens opcionais/obrigatórios dependem da configuração aprovada.
        </p>

        {/* Mobile Sticky Actions Bar (Figma 1594:3754) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#dfe7f1] p-3 px-4 flex items-center gap-3 shadow-lg">
          <button
            type="button"
            onClick={handlePreviewClick}
            data-testid="btn-preview-profile-mobile"
            className="flex-1 h-[46px] bg-white border border-[#dfe7f1] hover:bg-[#f8fafc] text-[#16243c] font-semibold text-[13px] rounded-[8px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <IconEye className="size-4 text-[#63738e]" />
            <span>Visualizar</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            data-testid="btn-save-profile-mobile"
            className="flex-1 h-[46px] bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Salvar</span>
            <IconArrowRight className="size-4 text-white" />
          </button>
        </div>

        {/* Unsaved Changes Confirmation Modal */}
        {showUnsavedModal && (
          <dialog
            open
            aria-modal="true"
            aria-labelledby="modal-unsaved-title"
            data-testid="modal-unsaved-changes"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 border-0 m-0 size-full max-w-none max-h-none"
          >
            <div className="bg-white rounded-[14px] p-6 max-w-md w-full shadow-2xl border border-[#dfe7f1]">
              <div className="size-12 rounded-full bg-[#fff7ed] flex items-center justify-center mb-4">
                <IconAlert className="size-6 text-[#ea580c]" />
              </div>
              <h3 id="modal-unsaved-title" className="text-[18px] font-bold text-[#16243c] mb-2">
                Alterações não salvas
              </h3>
              <p className="text-[13px] text-[#63738e] leading-relaxed mb-6">
                Você possui modificações não salvas no perfil público da concessionária. Se sair
                agora, as alterações não salvas serão descartadas na visualização.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowUnsavedModal(false)}
                  className="h-[40px] px-4 rounded-[8px] border border-[#dfe7f1] text-[13px] font-medium text-[#63738e] hover:bg-[#f8fafc]"
                >
                  Continuar editando
                </button>
                <button
                  type="button"
                  onClick={confirmDiscardAndNavigate}
                  data-testid="btn-modal-discard"
                  className="h-[40px] px-4 rounded-[8px] bg-[#fee2e2] text-[13px] font-semibold text-[#dc2626] hover:bg-[#fecaca]"
                >
                  Descartar e ver
                </button>
                <button
                  type="button"
                  onClick={confirmSaveAndNavigate}
                  data-testid="btn-modal-save"
                  className="h-[40px] px-4 rounded-[8px] bg-[#b91c1c] text-[13px] font-semibold text-white hover:bg-[#991b1b]"
                >
                  Salvar e ver
                </button>
              </div>
            </div>
          </dialog>
        )}
      </main>

      <MarketplaceFooter />
    </div>
  );
}
