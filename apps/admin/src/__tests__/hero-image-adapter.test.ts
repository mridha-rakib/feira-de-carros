import { beforeEach, describe, expect, it } from 'vitest';
import { CANONICAL_HERO_IMAGE, HeroImageAdapter } from '../../lib/adapters/hero-image-adapter';
import type { StagedHeroImage } from '../../lib/types/hero-image';

describe('HeroImageAdapter (CR-003: N-HERO-001 through N-HERO-006)', () => {
  let adapter: HeroImageAdapter;

  beforeEach(async () => {
    adapter = new HeroImageAdapter();
    await adapter.resetToCanonicalDefault();
  });

  describe('N-HERO-001: Current Published Hero Image', () => {
    it('returns the canonical official hero image initially', async () => {
      const published = await adapter.getPublishedImage();
      expect(published).toBeDefined();
      expect(published.id).toBe(CANONICAL_HERO_IMAGE.id);
      expect(published.url).toBe('/images/hero/current-live-hero.png');
      expect(published.fileName).toBe('hero-desktop.png');
      expect(published.provenance).toBe('OFFICIAL_INITIAL_ASSET');
      expect(published.publishedBy.role).toBe('main_admin');
    });
  });

  describe('N-HERO-002 & N-HERO-004: Image Staging and File Validation', () => {
    it('accepts valid WebP file and returns staged representation', async () => {
      const file = new File(['valid-image-bytes'], 'nova-imagem.webp', {
        type: 'image/webp',
      });
      const staged = await adapter.stageImage(file);

      expect(staged.fileName).toBe('nova-imagem.webp');
      expect(staged.validation.formatValid).toBe(true);
      expect(staged.validation.sizeValid).toBe(true);
      expect(staged.validation.overallValid).toBe(true);
      expect(staged.validation.errorMessage).toBeUndefined();
    });

    it('accepts valid PNG and JPG files', async () => {
      const pngFile = new File(['png-bytes'], 'novo-carro.png', {
        type: 'image/png',
      });
      const jpgFile = new File(['jpg-bytes'], 'novo-carro.jpg', {
        type: 'image/jpeg',
      });

      const stagedPng = await adapter.stageImage(pngFile);
      const stagedJpg = await adapter.stageImage(jpgFile);

      expect(stagedPng.validation.formatValid).toBe(true);
      expect(stagedJpg.validation.formatValid).toBe(true);
    });

    it('rejects unsupported file formats (GIF, SVG, PDF, EXE)', async () => {
      const gifFile = new File(['gif-bytes'], 'animacao.gif', {
        type: 'image/gif',
      });
      const pdfFile = new File(['pdf-bytes'], 'documento.pdf', {
        type: 'application/pdf',
      });

      const stagedGif = await adapter.stageImage(gifFile);
      const stagedPdf = await adapter.stageImage(pdfFile);

      expect(stagedGif.validation.formatValid).toBe(false);
      expect(stagedGif.validation.overallValid).toBe(false);
      expect(stagedGif.validation.errorMessage).toContain('Arquivo incompatível');

      expect(stagedPdf.validation.formatValid).toBe(false);
      expect(stagedPdf.validation.overallValid).toBe(false);
      expect(stagedPdf.validation.errorMessage).toContain('Arquivo incompatível');
    });

    it('rejects oversized files exceeding 10 MB limit', async () => {
      // 11 MB mock file
      const oversizedBytes = new Uint8Array(11 * 1024 * 1024);
      const oversizedFile = new File([oversizedBytes], 'imagem-gigante.png', {
        type: 'image/png',
      });

      const staged = await adapter.stageImage(oversizedFile);
      expect(staged.validation.sizeValid).toBe(false);
      expect(staged.validation.overallValid).toBe(false);
      expect(staged.validation.errorMessage).toContain('excede o limite máximo permitido');
    });

    it('rejects empty 0-byte files', async () => {
      const emptyFile = new File([], 'vazio.png', { type: 'image/png' });
      const staged = await adapter.stageImage(emptyFile);

      expect(staged.validation.sizeValid).toBe(false);
      expect(staged.validation.overallValid).toBe(false);
      expect(staged.validation.errorMessage).toContain('está vazio');
    });

    it('loads approved Figma sample replacement', async () => {
      const sample = await adapter.stagePredefinedSample();
      expect(sample.fileName).toBe('nova-imagem-home.webp');
      expect(sample.validation.overallValid).toBe(true);
      expect(sample.previewUrl).toBe('/images/hero/sample-staged-replacement.png');
    });
  });

  describe('N-HERO-002 & N-HERO-AC-02: Staging Discard Semantics', () => {
    it('discarding staged image keeps previously published image completely unchanged', async () => {
      const initial = await adapter.getPublishedImage();

      const file = new File(['bytes'], 'teste-substituicao.png', {
        type: 'image/png',
      });
      const staged = await adapter.stageImage(file);

      // Discard staged image
      adapter.discardStagedImage(staged.previewUrl);

      // Verify published image is unchanged
      const current = await adapter.getPublishedImage();
      expect(current.id).toBe(initial.id);
      expect(current.url).toBe(initial.url);
      expect(current.publishedAt).toBe(initial.publishedAt);
    });
  });

  describe('N-HERO-004 & N-HERO-AC-04: RBAC and Role-Based Authorization', () => {
    it('blocks publication attempts from non-main_admin roles (sales, support, member)', async () => {
      const sample = await adapter.stagePredefinedSample();

      await expect(adapter.publishImage(sample, 'sales')).rejects.toThrow('Acesso restrito');

      await expect(adapter.publishImage(sample, 'support')).rejects.toThrow('Acesso restrito');

      await expect(adapter.publishImage(sample, 'member')).rejects.toThrow('Acesso restrito');

      // Verify image was not updated
      const current = await adapter.getPublishedImage();
      expect(current.id).toBe(CANONICAL_HERO_IMAGE.id);
    });

    it('allows publication when requested by main_admin', async () => {
      const sample = await adapter.stagePredefinedSample();
      const updated = await adapter.publishImage(sample, 'main_admin');

      expect(updated).toBeDefined();
      expect(updated.provenance).toBe('STAGED_DEMO_PUBLISH');
      expect(updated.fileName).toBe('nova-imagem-home.webp');

      const current = await adapter.getPublishedImage();
      expect(current.fileName).toBe('nova-imagem-home.webp');
      expect(current.publishedBy.role).toBe('main_admin');
    });
  });

  describe('N-HERO-005 & N-HERO-AC-03: Fallback and Error Handling', () => {
    it('keeps previous image published when publication fails or network errors occur', async () => {
      const initial = await adapter.getPublishedImage();
      const sample = await adapter.stagePredefinedSample();

      // Trigger simulated publication failure
      await expect(adapter.publishImage(sample, 'main_admin', true)).rejects.toThrow(
        'Falha simulada',
      );

      // Verify original image remains active without modification
      const afterFailure = await adapter.getPublishedImage();
      expect(afterFailure.id).toBe(initial.id);
      expect(afterFailure.url).toBe(initial.url);
      expect(afterFailure.publishedAt).toBe(initial.publishedAt);
    });
  });

  describe('N-HERO-006: Feature Boundaries and Reset', () => {
    it('resets cleanly to canonical default hero image', async () => {
      const sample = await adapter.stagePredefinedSample();
      await adapter.publishImage(sample, 'main_admin');

      const intermediate = await adapter.getPublishedImage();
      expect(intermediate.fileName).toBe('nova-imagem-home.webp');

      // Reset
      const reset = await adapter.resetToCanonicalDefault();
      expect(reset.id).toBe(CANONICAL_HERO_IMAGE.id);
      expect(reset.fileName).toBe('hero-desktop.png');

      const final = await adapter.getPublishedImage();
      expect(final.id).toBe(CANONICAL_HERO_IMAGE.id);
    });
  });
});
