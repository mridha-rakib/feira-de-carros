'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import {
  CANONICAL_HERO_IMAGE,
  getHeroImageAdapter,
} from '../../../lib/adapters/hero-image-adapter';
import type {
  AdminRole,
  HeroImagePageState,
  PublishedHeroImageRecord,
  StagedHeroImage,
} from '../../../lib/types/hero-image';
import { HeroActionFooter } from './components/HeroActionFooter';
import { HeroHeader } from './components/HeroHeader';
import { HeroStateBanners } from './components/HeroStateBanners';
import { ImageValidationCard } from './components/ImageValidationCard';
import { PublishedHeroCard } from './components/PublishedHeroCard';
import { ReplaceHeroCard } from './components/ReplaceHeroCard';
import { ResponsivePreviewCard } from './components/ResponsivePreviewCard';

function HeroImageSettingsContent() {
  const searchParams = useSearchParams();
  const adapter = React.useMemo(() => getHeroImageAdapter(), []);

  // Role detection from query param or default main_admin
  const roleParam = searchParams.get('role');
  const initialRole: AdminRole =
    roleParam === 'sales' ? 'sales' : roleParam === 'support' ? 'support' : 'main_admin';

  const [currentRole, setCurrentRole] = React.useState<AdminRole>(initialRole);
  const [publishedImage, setPublishedImage] =
    React.useState<PublishedHeroImageRecord>(CANONICAL_HERO_IMAGE);
  const [stagedImage, setStagedImage] = React.useState<StagedHeroImage | null>(null);
  const [pageState, setPageState] = React.useState<HeroImagePageState>(
    initialRole === 'main_admin' ? 'IDLE' : 'RESTRICTED',
  );
  const [simulateFailure, setSimulateFailure] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
  const [successTimestamp, setSuccessTimestamp] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [validationProgress, setValidationProgress] = React.useState(68);

  // Load published image on mount
  React.useEffect(() => {
    let isMounted = true;
    adapter.getPublishedImage().then((record) => {
      if (isMounted) {
        setPublishedImage(record);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [adapter]);

  // Handle Role change
  const handleRoleChange = (newRole: AdminRole) => {
    setCurrentRole(newRole);
    if (newRole !== 'main_admin') {
      setPageState('RESTRICTED');
    } else {
      if (pageState === 'RESTRICTED') {
        setPageState(stagedImage ? 'STAGED' : 'IDLE');
      }
    }
  };

  // Stage a file upload
  const handleFileSelect = async (file: File) => {
    if (currentRole !== 'main_admin') {
      setPageState('RESTRICTED');
      return;
    }

    setIsLoading(true);
    setPageState('VALIDATING');
    setValidationProgress(35);

    try {
      // Simulate validation progress steps
      await new Promise((r) => setTimeout(r, 200));
      setValidationProgress(68);

      const staged = await adapter.stageImage(file);
      await new Promise((r) => setTimeout(r, 250));
      setValidationProgress(100);

      if (!staged.validation.overallValid) {
        setPageState('REJECTED');
        setErrorMessage(
          staged.validation.errorMessage ||
            'Arquivo incompatível, corrompido ou fora das dimensões mínimas homologadas.',
        );
        // Do not stage invalid file
        adapter.discardStagedImage(staged.previewUrl);
        setStagedImage(null);
      } else {
        // Discard any previously staged file
        if (stagedImage) {
          adapter.discardStagedImage(stagedImage.previewUrl);
        }
        setStagedImage(staged);
        setPageState('STAGED');
        setErrorMessage(undefined);
      }
    } catch (err) {
      setPageState('REJECTED');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Erro ao analisar imagem selecionada. Verifique o arquivo e tente novamente.',
      );
      setStagedImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load sample approved replacement from Figma
  const handleLoadSample = async () => {
    if (currentRole !== 'main_admin') {
      setPageState('RESTRICTED');
      return;
    }

    setIsLoading(true);
    setPageState('VALIDATING');
    setValidationProgress(50);

    try {
      await new Promise((r) => setTimeout(r, 150));
      setValidationProgress(100);

      const sample = await adapter.stagePredefinedSample();
      if (stagedImage) {
        adapter.discardStagedImage(stagedImage.previewUrl);
      }
      setStagedImage(sample);
      setPageState('STAGED');
      setErrorMessage(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  // Discard staged image
  const handleDiscard = () => {
    if (stagedImage) {
      adapter.discardStagedImage(stagedImage.previewUrl);
      setStagedImage(null);
    }
    setPageState(currentRole === 'main_admin' ? 'IDLE' : 'RESTRICTED');
    setErrorMessage(undefined);
  };

  // Publish staged replacement
  const handlePublish = async () => {
    if (!stagedImage) return;

    if (currentRole !== 'main_admin') {
      setPageState('RESTRICTED');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 500));

      const updated = await adapter.publishImage(stagedImage, currentRole, simulateFailure);
      setPublishedImage(updated);
      setStagedImage(null);
      setPageState('SUCCESS');
      setSuccessTimestamp(
        new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
      setErrorMessage(undefined);
    } catch (err) {
      setPageState('FAILURE');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Falha durante o processo de publicação. A imagem anterior permanece ativa.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to original canonical image
  const handleResetDefault = async () => {
    setIsLoading(true);
    try {
      if (stagedImage) {
        adapter.discardStagedImage(stagedImage.previewUrl);
        setStagedImage(null);
      }
      const canonical = await adapter.resetToCanonicalDefault();
      setPublishedImage(canonical);
      setPageState(currentRole === 'main_admin' ? 'IDLE' : 'RESTRICTED');
      setErrorMessage(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Configurações', 'Imagem principal da homepage']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="admin-hero-image-page">
        {/* Header & QA Controls matching Figma ADM-D-054 */}
        <HeroHeader
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          simulateFailure={simulateFailure}
          onSimulateFailureChange={setSimulateFailure}
        />

        {/* Dynamic State Feedback Banners (Figma node 2942:10293 States 1-5) */}
        <HeroStateBanners
          pageState={pageState}
          errorMessage={errorMessage}
          successTimestamp={successTimestamp}
          onRetry={pageState === 'FAILURE' ? handlePublish : undefined}
          onDismissAlert={() => setPageState(stagedImage ? 'STAGED' : 'IDLE')}
          progressPercent={validationProgress}
        />

        {/* Section B — Currently Published Hero Image (Figma node 2940:10325) */}
        <PublishedHeroCard publishedImage={publishedImage} />

        {/* Section C, D, E — Side-by-side Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Section C: Replace / Upload Image Card */}
          <div className="lg:col-span-5 h-full">
            <ReplaceHeroCard
              stagedImage={stagedImage}
              onFileSelect={handleFileSelect}
              onRemoveStaged={handleDiscard}
              onLoadSample={handleLoadSample}
              disabled={isLoading}
              currentRole={currentRole}
            />
          </div>

          {/* Section D & E: Responsive Previews and Validation Card */}
          <div className="lg:col-span-7 space-y-4">
            <ResponsivePreviewCard publishedImage={publishedImage} stagedImage={stagedImage} />
            <ImageValidationCard stagedImage={stagedImage} />
          </div>
        </div>

        {/* Section F — Bottom Actions Footer */}
        <HeroActionFooter
          stagedImage={stagedImage}
          onDiscard={handleDiscard}
          onPublish={handlePublish}
          onResetDefault={handleResetDefault}
          isLoading={isLoading}
          currentRole={currentRole}
        />
      </div>
    </AdminShell>
  );
}

export default function HeroImageSettingsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-8 text-slate-400 text-sm">
          Carregando configurações da imagem principal…
        </div>
      }
    >
      <HeroImageSettingsContent />
    </React.Suspense>
  );
}
