export type SupportedHeroImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export type AdminRole = 'main_admin' | 'sales' | 'support' | 'member' | 'guest';

export interface PublishedHeroImageRecord {
  id: string;
  url: string;
  fileName: string;
  fileSizeBytes: number;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
  publishedAt: string; // ISO 8601
  publishedBy: {
    userId: string;
    userName: string;
    role: string;
  };
  provenance: 'OFFICIAL_INITIAL_ASSET' | 'STAGED_DEMO_PUBLISH';
}

export interface ValidationDetails {
  formatValid: boolean;
  sizeValid: boolean;
  decodingValid: boolean;
  contrastPreserved: boolean; // Advisory visual check
  responsiveCropValid: boolean; // Advisory visual check
  overallValid: boolean;
  errorMessage?: string;
  advisoryNotes?: string[];
}

export interface StagedHeroImage {
  file?: File;
  previewUrl: string;
  fileName: string;
  fileSizeBytes: number;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
  validation: ValidationDetails;
  stagedAt: string;
}

export type HeroImagePageState =
  | 'IDLE' // No staged file; viewing currently published image
  | 'STAGED' // A valid new image is staged for review
  | 'VALIDATING' // STATE-01: Processing and validating file
  | 'REJECTED' // STATE-02: Invalid file rejected
  | 'SUCCESS' // STATE-03: Successfully published
  | 'FAILURE' // STATE-04: Publish failed, fallback to previous image
  | 'RESTRICTED'; // STATE-05: Non-main admin role restricted
