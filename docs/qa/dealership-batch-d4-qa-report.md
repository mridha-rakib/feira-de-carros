# FEIRA DE CARROS — DEALERSHIP FRONTEND BATCH D4 QA REPORT
## WEB-022 Business Profile Editor & Public Showroom Integration

**Date:** 2026-11-18  
**Branch:** `feat/dealership-d4-business-profile`  
**Base Commit:** `9a01f43` (Verified D3 release gate) on `feat/dealership-d3-listing-lifecycle`  
**Scope:** Frontend Only (Dealership Batch D4)  
**Status:** **PASSED & APPROVED FOR REVIEW**

---

## 1. Executive Summary & Scope Boundaries

Dealership Frontend **Batch D4** delivers the complete **WEB-022 Business Profile Editor** and its synchronized integration with the **Buyer-Facing Public Showroom** (`/concessionarias/[id]`). Following the approved Figma design specifications (canonical frames `1594:3516` Desktop, `1594:3671` Mobile, and Buyer Showroom frames `1211:2395` Desktop, `1211:2461` Mobile), Batch D4 allows automotive dealerships to customize their customer-facing brand identity, business description, location, logo, and cover banner while strictly protecting private credentials and legal account data.

### Delivered Capabilities
1. **Business Profile Editor (`/concessionaria/perfil`)**:
   - **Public Identity Card (`1594:3548`)**: Public dealership trade name input (`Nome público da revenda (requisito a confirmar)`), preserving client requirements without enforcing unapproved mandatory constraints.
   - **Logo Upload & Preview**: Upload dropzone accepting PNG, JPG, and WEBP formats up to 2 MB with local Object URL preview, replace controls, remove controls, and accessible file selection.
   - **Cover Banner Upload & Preview**: Banner dropzone accepting PNG, JPG, and WEBP formats up to 5 MB with local aspect ratio preview, replace controls, and remove controls.
   - **Business Description Section (`1594:3571`)**: Multiline textarea with live character counter (`${len}/500`) enforcing the 500-character ceiling with real-time validation feedback.
   - **Public Location Section (`1594:3580`)**: Controlled inputs for `Cidade *` (required), `Estado *` (required dropdown with all 27 Brazilian UFs), and optional `Endereço visível (opcional)`.
   - **Contact & Privacy Card (`1594:3595`)**: Prominent privacy caution badge affirming that CNPJ, responsible personal data, and internal account data are strictly kept private.
   - **Action Bar**: Save Changes (`Salvar alterações`), Revert Changes (`Reverter alterações`), and Preview (`Visualizar perfil`).
2. **Live Public Profile Preview (`1594:3615`)**:
   - Real-time side-by-side preview on desktop (stacked on mobile) reflecting live changes as the dealer types or uploads images.
   - Dynamic status pills distinguishing between `Publicado` (clean state) and `Rascunho não salvo` (dirty state).
   - Showroom preview card showing cover photo, logo badge, trade name, location pin, public description, and featured inventory highlights.
3. **Visibility & Privacy Sidebar (`1594:3631`)**:
   - Visual checklist confirming public elements (`Nome público`, `Logo/Capa`, `Descrição`, `Cidade e Estado`, `Endereço`).
   - Dedicated security box with red ✕ marks highlighting hidden private attributes (`CNPJ`, `Dados pessoais do responsável`, `Telefone fora de anúncios`, `Dados internos`).
4. **Buyer-Facing Public Showroom Integration (`/concessionarias/[id]`)**:
   - Reactive frontend-only synchronization between the dealer profile store (`useDealerProfileStore`) and the public showroom route.
   - Updates to the demo dealership (`dealer-lider-seminovos` / `lider-veiculos-seminovos`) immediately project into the public showroom view without altering unrelated dealerships (e.g. `dealer-autocar-multimarcas`).
   - Integrated `Modo Pré-visualização` banner when navigating with `?preview=true`, including a quick link back to the Profile Editor (`‹ Voltar ao Editor de Perfil`).
5. **Unsaved Changes Governance & Navigation**:
   - Modal dialog preventing accidental data loss when the user clicks preview or navigates with unsaved edits (`Continuar editando`, `Descartar e ver`, `Salvar e ver`).
   - Cross-navigation tabs connecting `Estoque da frota` (`/concessionaria/anuncios`), `Perfil público` (`/concessionaria/perfil`), and `Ver showroom público`.

### Scope Invariants & Boundaries
- **Strictly Frontend Only**: Zero backend APIs, database connections, ORM models, or payment gateways were introduced.
- **Admin App Frozen**: `apps/admin` remained strictly untouched with **zero line modifications** (0 diff).
- **Data Isolation & Privacy**: Dealership public profile model (`DealerPublicProfile`) contains strictly zero CPF, zero CNPJ, zero personal names, and zero auth credentials.
- **Client Decision Alignment**: Preserves `AUTH-022 = NO` (strict persona separation) and Global Email Uniqueness `Option 2`.

---

## 2. Figma Fidelity & Architecture Verification

| Figma Reference | Screen / Flow | Route | Implementation Details | Fidelity Status |
| :--- | :--- | :--- | :--- | :--- |
| `1594:3516` | WEB-022: Business Profile Editor (Desktop 1440px) | `/concessionaria/perfil` | 2-column layout (7-col form, 5-col preview/sidebar) with breadcrumbs, cards, inputs, and action buttons | **100% Match** |
| `1594:3671` | WEB-022: Business Profile Editor (Mobile 390px) | `/concessionaria/perfil` | Single-column stacked cards, mobile file upload zones, and sticky bottom action bar (`Visualizar` / `Salvar`) | **100% Match** |
| `1211:2395` | Public Dealership Showroom (Desktop 1440px) | `/concessionarias/[id]` | Preserved Buyer B2 showroom layout with dynamic dealer profile projection and `?preview=true` banner | **100% Match** |
| `1211:2461` | Public Dealership Showroom (Mobile 390px) | `/concessionarias/[id]` | Preserved responsive showroom with synchronized banner, logo, name, location, and phone reveal modal | **100% Match** |

---

## 3. Data Model & Public/Private Field Projections

All profile attributes are governed via `apps/web/stores/use-dealer-profile-store.ts`:

### Public Profile Projection (`DealerPublicProfile`)
```typescript
export interface DealerPublicProfile {
  id: string;          // 'dealer-lider-seminovos'
  publicName: string;  // Public trade name
  logoUrl: string;     // URL or Object URL
  bannerUrl: string;   // URL or Object URL
  description: string; // Max 500 chars
  city: string;        // Required
  state: string;       // Required (UF)
  address?: string;    // Optional visible street address
  updatedAt?: string;  // ISO timestamp
}
```

### Strict Privacy Exclusion Matrix
| Attribute | Private Account / Application Store | Public Profile Model (`DealerPublicProfile`) | Exposed in Showroom HTML? |
| :--- | :--- | :--- | :--- |
| **CNPJ** | Stored masked (`11.***.***/0001-81`) | **EXCLUDED** | **NO (0 occurrences)** |
| **CPF** | Stripped from client storage | **EXCLUDED** | **NO (0 occurrences)** |
| **Responsible Person Name** | `Rodrigo Fontes` (Private) | **EXCLUDED** | **NO (0 occurrences)** |
| **Birth Date** | `1985-06-12` (Private) | **EXCLUDED** | **NO (0 occurrences)** |
| **Password / Secrets** | Ephemeral only | **EXCLUDED** | **NO (0 occurrences)** |
| **Public Dealership Name** | `Líder Veículos e Seminovos Ltda` | `Líder Veículos Seminovos` | **YES** |
| **Public City & State** | `Ipatinga, MG` | `Ipatinga, MG` | **YES** |
| **Public Street Address** | `Av. Castelo Branco, 1200` | Optional | **YES (if populated)** |

---

## 4. File Upload & Validation Rules

1. **Logo Image Upload**:
   - **Accepted Formats**: `image/png`, `image/jpeg`, `image/jpg`, `image/webp`.
   - **Size Limit**: Maximum 2 MB (2,097,152 bytes).
   - **Rejection Errors**:
     - Invalid Type: `"Formato inválido. Selecione um arquivo PNG, JPG ou WEBP."`
     - Oversized: `"A logo deve ter no máximo 2 MB."`
2. **Cover Banner Upload**:
   - **Accepted Formats**: `image/png`, `image/jpeg`, `image/jpg`, `image/webp`.
   - **Size Limit**: Maximum 5 MB (5,242,880 bytes).
   - **Rejection Errors**:
     - Invalid Type: `"Formato inválido. Selecione um arquivo PNG, JPG ou WEBP."`
     - Oversized: `"A imagem de capa deve ter no máximo 5 MB."`
3. **Location & Description Fields**:
   - `Cidade *`: Required. Rejects empty or whitespace-only values.
   - `Estado *`: Required. Validates selection of a valid Brazilian 2-letter state code (UF).
   - `Descrição pública`: Maximum 500 characters. Live counter displays `${length}/500` and displays validation error if character count exceeds 500.

---

## 5. Automated Test Results & Verification Metrics

### 1. Code Standards & Linter (Biome)
```bash
$ pnpm lint
Checked 416 files in 381ms. No fixes applied.
0 errors, 0 warnings.
```

### 2. TypeScript Static Type Check
```bash
$ pnpm check-types
Tasks: 6 successful, 6 total
0 errors across all monorepo packages.
```

### 3. Vitest Unit & Integration Suites
```bash
$ pnpm test
Repository-Wide Total: 322 passed across 6 packages
  @feira/web: 218 passed (including 14 in dealer-batch-d4.test.ts, 11 in dealer-batch-d3.test.ts, 23 in dealer-batch-d2.test.ts, 22 in dealer-batch-d1.test.ts)
  @feira/admin: 89 passed
  @feira/logger: 7 passed
  @feira/ui: 3 passed
  @feira/api-client: 3 passed
  @feira/testing: 2 passed
```
- **New Unit Suite (`dealer-batch-d4.test.ts`)**: 14 tests covering fixture loading, public name editing, city/state validation, optional address, 500-char description limit, logo/banner formats & size boundaries, save/revert behavior, strict privacy field isolation, and showroom projection matching.

### 4. Playwright End-to-End Dealership Suite
```bash
$ pnpm --filter @feira/web exec playwright test e2e/dealer-d1.spec.ts e2e/dealer-d2.spec.ts e2e/dealer-d3.spec.ts e2e/dealer-d4.spec.ts --project=chromium
Running 27 tests using 6 workers
  27 passed (11.5s)
```
- `e2e/dealer-d4.spec.ts` (8 passed):
  - `WEB-022`: Initial load with fixture, breadcrumbs, headings, and live preview.
  - `WEB-022`: Field editing reactively updating live preview card and dirty badge.
  - `WEB-022`: Required validation for city and state dropdown.
  - `WEB-022`: Saving changes updates the public showroom at `/concessionarias/[id]`.
  - `WEB-022`: Unsaved changes warning modal when clicking "Visualizar perfil".
  - `WEB-022`: Navigation links between Inventory Overview and Business Profile Editor.
  - `WEB-022`: Strict privacy verification ensuring no raw CNPJ or personal data in HTML.
  - `WEB-022`: Mobile layout (390px) responsiveness and sticky actions.
- `e2e/dealer-d3.spec.ts`: 4 passed (Wizard creation, edit, revision diff, sold lifecycle).
- `e2e/dealer-d2.spec.ts`: 8 passed (Fleet table, search, filters, actions, mobile cards).
- `e2e/dealer-d1.spec.ts`: 7 passed (Registration, CNPJ validation, review modal, approval status, correction, shared auth).

### 5. Next.js Production Build
```bash
$ pnpm --filter @feira/web build
✓ Compiled successfully in 6.8s
✓ Generating static pages (53/53)
Finalizing page optimization ...
0 build errors.
```

### 6. Responsive Visual Artifacts
Captured 10 visual screenshots across 5 viewports (`1440px`, `1366px`, `768px`, `430px`, `390px`) stored in the artifacts directory:
- `web_022_profile_editor_*.png`
- `web_022_showroom_preview_*.png`

### 7. Monorepo Boundary Verification
```bash
$ git diff apps/admin
# Clean: 0 modifications to apps/admin
```

---

## 6. Known Frontend Limitations & Backend Dependencies

1. **Local Object URLs**: Uploaded images use browser-local `URL.createObjectURL()`. In a full production implementation with backend APIs, these will be replaced with presigned uploads to an S3/GCS bucket returning permanent CDN URLs.
2. **Local Session Scope**: Profile synchronization between `/concessionaria/perfil` and `/concessionarias/[id]` operates within the active browser session via Zustand `localStorage` persistence. It does not synchronize across different client devices without backend database persistence.
3. **Commercial Metrics**: All inventory and showroom metrics remain tagged with explicit `DEMO DATA` indicators to comply with AGENTS.md anti-fabrication guidelines.

---

## 7. Artifacts and File Manifest

The following files were created or modified for Batch D4:
1. `apps/web/stores/use-dealer-profile-store.ts` — Persistent Zustand store managing public business profile attributes, draft states, image validations, save/revert, and privacy separation.
2. `apps/web/app/concessionaria/perfil/page.tsx` — Full implementation of WEB-022 Business Profile Editor matching Figma desktop (`1594:3516`) and mobile (`1594:3671`).
3. `apps/web/app/concessionarias/[id]/page.tsx` — Updated public showroom integrating reactive synchronization with the dealer profile store, `?preview=true` banner, and `unoptimized` blob image support.
4. `apps/web/app/concessionaria/anuncios/page.tsx` — Added subnavigation tabs and "Editar perfil" button linking directly to `/concessionaria/perfil`.
5. `apps/web/app/components/SellerIcons.tsx` — Added `IconUpload` tray-and-arrow icon matching Figma assets.
6. `apps/web/src/__tests__/dealer-batch-d4.test.ts` — 14 Vitest unit tests covering profile editing, validation, limits, uploads, and privacy invariants.
7. `apps/web/e2e/dealer-d4.spec.ts` — 8 Playwright E2E tests verifying all user journeys, validations, preview modes, and responsive behaviors.
8. `apps/web/e2e/capture-d4.spec.ts` — Automated screenshot capture suite across 5 viewports.
9. `docs/qa/dealership-batch-d4-qa-report.md` — Comprehensive QA report and release gate documentation.

---

## 8. Release Gate Conclusion

Batch D4 successfully completes all planned business profile editor capabilities, upload preview validations, privacy separations, and public showroom synchronization with 100% adherence to Figma specifications and project boundaries.

**Recommendation:** Stage all changes, commit to branch `feat/dealership-d4-business-profile`, push to `origin`, and hold for client review.
