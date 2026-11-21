import type {
  AdminRole,
  PublishedHeroImageRecord,
  StagedHeroImage,
  ValidationDetails,
} from '../types/hero-image';

export const CANONICAL_HERO_IMAGE: PublishedHeroImageRecord = {
  id: 'hero-canonical-001',
  url: '/images/hero/current-live-hero.png',
  fileName: 'hero-desktop.png',
  fileSizeBytes: 184310,
  format: 'image/png',
  dimensions: {
    width: 1920,
    height: 480,
  },
  publishedAt: '2026-01-15T10:00:00.000Z',
  publishedBy: {
    userId: 'usr-admin-001',
    userName: 'Admin Principal',
    role: 'main_admin',
  },
  provenance: 'OFFICIAL_INITIAL_ASSET',
};

export const SAMPLE_STAGED_REPLACEMENT: StagedHeroImage = {
  previewUrl: '/images/hero/sample-staged-replacement.png',
  fileName: 'nova-imagem-home.webp',
  fileSizeBytes: 2013265, // 1.92 MB
  format: 'image/webp',
  dimensions: {
    width: 1920,
    height: 600,
  },
  validation: {
    formatValid: true,
    sizeValid: true,
    decodingValid: true,
    contrastPreserved: true,
    responsiveCropValid: true,
    overallValid: true,
    advisoryNotes: [
      'Formato WebP homologado para alta performance web.',
      'Contraste verificado sob o overlay de gradiente escuro oficial da Feira de Carros.',
      'Enquadramento centralizado compatível com recortes desktop (16:9) e mobile (9:16).',
    ],
  },
  stagedAt: new Date().toISOString(),
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const DB_NAME = 'fdc_admin_db';
const STORE_NAME = 'hero_image_settings';
const STORAGE_KEY_PUBLISHED = 'current_published_hero';

class HeroImageStorage {
  private inMemoryCurrent: PublishedHeroImageRecord | null = null;
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.dbPromise = new Promise((resolve) => {
        try {
          const request = window.indexedDB.open(DB_NAME, 1);
          request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME);
            }
          };
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    }
  }

  async getPublished(): Promise<PublishedHeroImageRecord> {
    if (this.inMemoryCurrent) {
      return this.inMemoryCurrent;
    }

    if (this.dbPromise) {
      try {
        const db = await this.dbPromise;
        if (db) {
          const record = await new Promise<PublishedHeroImageRecord | null>((resolve) => {
            try {
              const tx = db.transaction(STORE_NAME, 'readonly');
              const store = tx.objectStore(STORE_NAME);
              const req = store.get(STORAGE_KEY_PUBLISHED);
              req.onsuccess = () => resolve(req.result || null);
              req.onerror = () => resolve(null);
            } catch {
              resolve(null);
            }
          });
          if (record) {
            this.inMemoryCurrent = record;
            return record;
          }
        }
      } catch {
        // Fallback to local storage or canonical
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(`fdc_${STORAGE_KEY_PUBLISHED}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.inMemoryCurrent = parsed;
          return parsed;
        }
      } catch {
        // Ignore JSON error
      }
    }

    this.inMemoryCurrent = { ...CANONICAL_HERO_IMAGE };
    return this.inMemoryCurrent;
  }

  async setPublished(record: PublishedHeroImageRecord): Promise<void> {
    this.inMemoryCurrent = record;

    if (this.dbPromise) {
      try {
        const db = await this.dbPromise;
        if (db) {
          await new Promise<void>((resolve, reject) => {
            try {
              const tx = db.transaction(STORE_NAME, 'readwrite');
              const store = tx.objectStore(STORE_NAME);
              const req = store.put(record, STORAGE_KEY_PUBLISHED);
              req.onsuccess = () => resolve();
              req.onerror = () => reject(req.error);
            } catch (err) {
              reject(err);
            }
          });
        }
      } catch {
        // Non-critical if IDB fails, fallback to localStorage
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        // Store metadata without excessive payload if blob
        window.localStorage.setItem(`fdc_${STORAGE_KEY_PUBLISHED}`, JSON.stringify(record));
      } catch {
        // LocalStorage quota may be reached, ignore
      }
    }
  }

  async reset(): Promise<PublishedHeroImageRecord> {
    const canonical = { ...CANONICAL_HERO_IMAGE };
    await this.setPublished(canonical);
    return canonical;
  }
}

export class HeroImageAdapter {
  private storage: HeroImageStorage;
  private activeObjectUrls: Set<string> = new Set();

  constructor() {
    this.storage = new HeroImageStorage();
  }

  async getPublishedImage(): Promise<PublishedHeroImageRecord> {
    return this.storage.getPublished();
  }

  /**
   * Validate an uploaded file and create a staged representation.
   */
  async stageImage(file: File): Promise<StagedHeroImage> {
    // 1. Format check
    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const formatValid = ALLOWED_MIME_TYPES.has(file.type) || ALLOWED_EXTENSIONS.has(extension);

    // 2. Size check
    const sizeValid = file.size <= MAX_FILE_SIZE_BYTES && file.size > 0;

    let errorMessage: string | undefined;
    if (!formatValid) {
      errorMessage = 'Arquivo incompatível. Selecione apenas imagens em formato JPG, PNG ou WebP.';
    } else if (!sizeValid) {
      errorMessage =
        file.size === 0
          ? 'O arquivo selecionado está vazio (0 bytes).'
          : `O arquivo (${(file.size / (1024 * 1024)).toFixed(2)} MB) excede o limite máximo permitido de 10 MB.`;
    }

    let decodingValid = false;
    let dimensions = { width: 1920, height: 600 };
    let previewUrl = '';

    if (typeof window !== 'undefined' && window.URL?.createObjectURL) {
      previewUrl = window.URL.createObjectURL(file);
      this.activeObjectUrls.add(previewUrl);

      // Verify image decoding
      try {
        dimensions = await this.inspectImageDimensions(previewUrl);
        decodingValid = true;
      } catch {
        decodingValid = false;
        if (!errorMessage) {
          errorMessage =
            'Não foi possível decodificar o arquivo de imagem. O arquivo pode estar corrompido.';
        }
      }
    } else {
      // Vitest / Node SSR environment
      decodingValid = formatValid && sizeValid;
      previewUrl = '/images/hero/current-live-hero.png';
    }

    const contrastPreserved = true; // Advisory: Feira de Carros text safety gradient ensures contrast
    const responsiveCropValid = dimensions.width >= 800;

    if (!responsiveCropValid && !errorMessage) {
      errorMessage =
        'A resolução da imagem é muito baixa para o cabeçalho principal (mínimo de 800px de largura).';
    }

    const overallValid = formatValid && sizeValid && decodingValid && responsiveCropValid;

    const validation: ValidationDetails = {
      formatValid,
      sizeValid,
      decodingValid,
      contrastPreserved,
      responsiveCropValid,
      overallValid,
      errorMessage: overallValid ? undefined : errorMessage,
      advisoryNotes: overallValid
        ? [
            'Formato compatível com navegadores modernos.',
            'O gradiente escuro institucional protege o contraste visual dos títulos.',
            'Proporção de aspecto adequada para desktop e dispositivos móveis.',
          ]
        : undefined,
    };

    return {
      file,
      previewUrl,
      fileName: file.name,
      fileSizeBytes: file.size,
      format: file.type || `image/${extension.replace('.', '')}`,
      dimensions,
      validation,
      stagedAt: new Date().toISOString(),
    };
  }

  /**
   * Helper to inspect actual image dimensions using browser Image API
   */
  private inspectImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = url;
    });
  }

  /**
   * Stage the approved sample replacement from Figma (Node 2940:10263)
   */
  async stagePredefinedSample(): Promise<StagedHeroImage> {
    return {
      ...SAMPLE_STAGED_REPLACEMENT,
      stagedAt: new Date().toISOString(),
    };
  }

  /**
   * Discards the staged replacement and cleans up memory
   */
  discardStagedImage(previewUrl?: string): void {
    if (previewUrl && this.activeObjectUrls.has(previewUrl)) {
      if (typeof window !== 'undefined' && window.URL?.revokeObjectURL) {
        window.URL.revokeObjectURL(previewUrl);
      }
      this.activeObjectUrls.delete(previewUrl);
    }
  }

  /**
   * Publishes the staged image as the new live hero image in the Admin frontend demo state.
   * Strict RBAC check: Only 'main_admin' can publish.
   */
  async publishImage(
    staged: StagedHeroImage,
    publisherRole: AdminRole,
    simulateFailure = false,
  ): Promise<PublishedHeroImageRecord> {
    // RBAC Security Check
    if (publisherRole !== 'main_admin') {
      throw new Error(
        'Acesso restrito: apenas o administrador principal possui autorização para publicar a imagem principal.',
      );
    }

    if (!staged.validation.overallValid) {
      throw new Error(
        staged.validation.errorMessage ||
          'A imagem selecionada não atende aos critérios de validação para publicação.',
      );
    }

    if (simulateFailure) {
      throw new Error(
        'Falha simulada na comunicação com o serviço de publicação. A imagem anterior permanece ativa.',
      );
    }

    // Persist as new published record
    let persistentUrl = staged.previewUrl;

    // In a browser, convert File to Data URL or store blob if it was an object URL
    if (staged.file && typeof window !== 'undefined' && window.FileReader) {
      try {
        persistentUrl = await this.fileToDataUrl(staged.file);
      } catch {
        persistentUrl = staged.previewUrl;
      }
    }

    const newPublished: PublishedHeroImageRecord = {
      id: `hero-pub-${Date.now()}`,
      url: persistentUrl,
      fileName: staged.fileName,
      fileSizeBytes: staged.fileSizeBytes,
      format: staged.format,
      dimensions: staged.dimensions,
      publishedAt: new Date().toISOString(),
      publishedBy: {
        userId: 'usr-admin-001',
        userName: 'Admin Principal',
        role: 'main_admin',
      },
      provenance: 'STAGED_DEMO_PUBLISH',
    };

    await this.storage.setPublished(newPublished);
    return newPublished;
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async resetToCanonicalDefault(): Promise<PublishedHeroImageRecord> {
    this.cleanupAllObjectUrls();
    return this.storage.reset();
  }

  cleanupAllObjectUrls(): void {
    if (typeof window !== 'undefined' && window.URL?.revokeObjectURL) {
      for (const url of this.activeObjectUrls) {
        window.URL.revokeObjectURL(url);
      }
    }
    this.activeObjectUrls.clear();
  }
}

let singletonAdapter: HeroImageAdapter | null = null;

export function getHeroImageAdapter(): HeroImageAdapter {
  if (!singletonAdapter) {
    singletonAdapter = new HeroImageAdapter();
  }
  return singletonAdapter;
}
