# Feira de Carros — Final Web Frontend Audit
**Document ID:** `AUDIT-FINAL-WEB-FRONTEND-v1.0`  
**Date:** November 18, 2026  
**Auditor:** Senior Frontend Architect, Figma Design Auditor, Security Reviewer & Git Integration Lead  
**Monorepo:** `mridha-rakib/feira-de-carros`  
**Active Working Branch:** `audit/final-web-frontend-readiness`  
**Base Lineage:** `main` → `feat/buyer-b1-discovery-search` (PR #9) → `feat/dealership-d1-registration` → `feat/dealership-d2-inventory` → `feat/dealership-d3-listing-lifecycle` → `feat/dealership-d4-business-profile` → `feat/dealership-d5-messaging-advertising` (`af5442c`)  
**Status:** AUDIT COMPLETE — MERGE READY (Subject to Buyer PR #9 dependency order)

---

## 1. Executive Summary & Audit Context

This comprehensive audit evaluates the entire web frontend surface across all four defined organizational roles in the Feira de Carros monorepo:
1. **Buyer Website** (Batches B1–B5, PR #9)
2. **Individual Seller Website** (Batches S1–S5, merged on `main`)
3. **Dealership Fleet Website** (Batches D1–D5, verified on branch)
4. **Admin Web Portal** (`apps/admin`, staff back-office, strictly frozen read-only)

### Strict Boundary Enforcement
- **FRONTEND ONLY**: Zero backend code, database connections, ORM models, or direct SQL were introduced.
- **Payment & Messaging Simulations**: No live payment gateways, credit card processing networks, or external WebSocket brokers were connected. All checkouts and message threads operate deterministically with simulated client-side state.
- **Admin Freeze**: `apps/admin` maintains **0 line modifications** from baseline.
- **Persona Boundary (`AUTH-022 = NO`)**: Strict identity separation between Buyer (`member`), Individual Seller (`seller`), and Dealership (`dealer`) is preserved. Dual-role cross-contamination is blocked at the session and middleware level.
- **Buyer Mobile App Clarification**: The React Native / Flutter Buyer Mobile App is explicitly documented as an independent project scope outside the Next.js web frontend monorepo, requiring its own dedicated audit cycle.

---

## 2. Web Frontend Role-by-Role Status Matrix

| Role | Target Audience | Source of Truth | Route Scope | Test Coverage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Buyer Web** | Vehicle Buyers & Public Visitors | Figma Zone 01 (`107:2`), B1–B5 Specs | `/`, `/veiculos`, `/veiculos/[id]`, `/categorias`, `/lojas/[slug]`, `/favoritos`, `/buscas-salvas`, `/conta/*` | 51 unit tests, 41 E2E tests | **COMPLETED** (In PR #9) |
| **Seller Web** | Private Individual Vehicle Sellers | Figma Zone 02 (`401:2`), S1–S5 Specs | `/vendedor/solicitacao`, `/vendedor/anuncios`, `/vendedor/anuncios/novo/*`, `/vendedor/anuncios/[id]/*`, `/vendedor/mensagens`, `/vendedor/pedidos/*` | 44 unit tests, 48 E2E tests | **COMPLETED** (Merged to `main`) |
| **Dealer Web** | Registered Commercial Dealerships | Figma Zone 03 (`733:2`) & Zone 04 (`1566:2`), D1–D5 Specs | `/concessionaria/solicitacao/*`, `/concessionaria/anuncios`, `/concessionaria/anuncios/novo/*`, `/concessionaria/perfil`, `/concessionaria/mensagens`, `/concessionaria/pedidos/*` | 88 unit tests, 68 E2E tests | **COMPLETED** (Verified on branch) |
| **Admin Web** | Staff Back-Office (Main Admin, Sales, Support) | Figma Zone 05, ADM-D-001–005 | `apps/admin` (`/admin/*`) | 89 unit tests | **FROZEN (0 changes)** |
| **Buyer Mobile** | iOS / Android Native Mobile Buyers | Mobile App Specifications | Native Mobile Project Repository | N/A (Web Monorepo Boundary) | **SEPARATE SCOPE** |

---

## 3. Photo Quota Mismatch Analysis & Aligned Resolution

### Problem Identified
During the D5 gap review, an inconsistency was identified between Individual Seller and Dealership photo limits:
- In Individual Seller (`seller-commercial.ts`): Básico allows up to 5 photos; Estendido allows up to 10 photos.
- In Dealership Ad Creation Wizard (`/concessionaria/anuncios/novo/fotos`): Upload box previously hardcoded `maxPhotos = 10`.
- In Dealership Commercial Plan Offering (`/concessionaria/anuncios/[id]/plano` & Figma `WEB-029`): Plano Essencial specifies "Até 8 fotos" while Plano Premium specifies "Até 20 fotos".

### Aligned Resolution
1. Created `apps/web/lib/constants/dealer-commercial.ts` mirroring `seller-commercial.ts` with strict Dealership pricing and quotas:
   - **Plano Essencial**: 30 days active exposure, up to **8 photos**, R$ 49,90.
   - **Plano Premium**: 60 days active exposure, up to **20 photos**, R$ 89,90.
   - **Impulsionamento (Boost)**: 7 days spotlight, R$ 29,90.
   - **Renovação de Anúncio**: +30 days extension, R$ 49,90.
2. Updated `DealerNovoAnuncioFotosPage` (`apps/web/app/concessionaria/anuncios/novo/fotos/page.tsx`) to dynamically bind `maxPhotos` to the draft plan via `getDealerMaxPhotos(draft.plan)` (defaulting to 20 photos for Premium, and restricting to 8 photos for Essential).
3. Preserved Seller and Dealer boundary: `seller-commercial.ts` governs private individuals; `dealer-commercial.ts` governs commercial dealerships.

---

## 4. Pricing, Commercial Claims & Data Provenance Compliance

To comply with `AGENTS.md` Invariant 4 (*"Do NOT display fabricated commercial statistics or claims as factual data. Always tag mock data with explicit DEMO DATA provenance"*):
1. **Advertising Performance Projections**: In `apps/web/app/concessionaria/anuncios/[id]/impulsionar/page.tsx`, the "+150% Visualizações" card was augmented with an explicit label:  
   `+150% Visualizações [ILUSTRATIVO · DEMO DATA]`.  
   The copy clarifies: *"Estimativa ilustrativa de incremento de visibilidade de compradores na plataforma."*
2. **Checkout Simulation Disclaimers**: High-visibility disclaimer banners were embedded in PIX and Credit Card checkout screens:  
   `AMBIENTE DE DEMONSTRAÇÃO: Este formulário / QR Code é simulado para homologação frontend. Não insira dados reais ou realize transferências financeiras.`
3. **Simulated Transaction Receipts**: In `apps/web/app/concessionaria/pedidos/[id]/status/page.tsx`, an explicit `DEMO DATA` badge was attached to the receipt box header.

---

## 5. Payment Simulation Safety Verification

| Security Area | Verification Finding | Verdict |
| :--- | :--- | :--- |
| **PIX QR Code & String** | Features prominent watermark overlay `DEMO — NÃO PAGAR`. Mock payload string begins with non-routable demo payload. | **PASS** |
| **Credit Card PAN / CVV** | Card number and CVV are sanitized in component memory. Never saved to `sessionStorage`, never logged to console, never sent to network. Only `last4` is retained for receipt display. | **PASS** |
| **Transaction State** | Stored in isolated `sessionStorage` key `fdc_dealer_order_*` with `isMockData: true` flag. | **PASS** |
| **Store Mutation** | Successful simulated payment triggers deterministic state update in `useDealerInventoryStore` (`updateVehiclePlan`, `boostVehicle`, `renewVehicle`). | **PASS** |

---

## 6. Canonical Figma Screen Mapping & Traceability

| Figma Node ID | Canonical Screen ID | Route in `apps/web` | Screen Purpose & Key Components |
| :--- | :--- | :--- | :--- |
| `1575:3428` | `WEB-017` | `/concessionaria/solicitacao` | Dealership Advertiser Registration & Legal CNPJ Application |
| `1629:3592` | `WEB-017-S` | `/concessionaria/solicitacao/status` | Application Approval Lifecycle Status Tracker |
| `1629:3560` | `WEB-017-C` | `/concessionaria/solicitacao/corrigir`| Dealership Application Correction & Resubmission |
| `1592:3472` | `WEB-021` | `/concessionaria/anuncios` | Fleet Inventory Overview, Analytics KPI Cards, Status Table |
| `1594:3516` | `WEB-022` | `/concessionaria/perfil` | Public Business Profile Editor, Logo Upload & Showroom Preview |
| `744:512` | `WEB-029` | `/concessionaria/anuncios/[id]/plano` | Advertising Plan Selection & Comparison (Essencial vs Premium) |
| `744:599` | `WEB-030` | `/concessionaria/pedidos/[id]/pix` | PIX Instant Payment Checkout with Dynamic QR Code |
| `744:685` | `WEB-031` | `/concessionaria/pedidos/[id]/cartao` | Credit Card Checkout with Installment Selection |
| `744:774` | `WEB-032`/`033` | `/concessionaria/pedidos/[id]/status` | Payment Confirmation & Commercial Order Receipt |
| `764:660` | `WEB-036` | `/concessionaria/anuncios/[id]/impulsionar` | Listing Boost Spotlight (7-Day Top Placement Offering) |
| `764:748` | `WEB-037` | `/concessionaria/anuncios/[id]/renovar` | Listing 30-Day Renewal & Expiration Prevention |
| `791:694` | `WEB-045` | `/concessionaria/mensagens` | Dealership Messaging Inbox & Customer Conversation List |
| `791:772` | `WEB-046` | `/concessionaria/mensagens` (Thread pane) | Active Buyer Negotiation Thread with Vehicle Context Card |
| `791:846` | `WEB-048` | `/concessionaria/mensagens` (Modal) | Buyer Moderation Report & Contact Block Modal |

*Audit Note on WEB-036 vs WEB-037:* Early preliminary manifest drafts inadvertently transposed the numerical labels of Boost and Renewal. In code routes and official Figma specifications:
- `WEB-036` (Node `764:660`) corresponds to **Impulsionar / Boost**.
- `WEB-037` (Node `764:748`) corresponds to **Renovar / Renewal**.

---

## 7. Automated Test Count Reconciliation

### Repository-Wide Unit Test Breakdown (342 tests across 18 web suites + 15 package suites)

| Package | Test Suite Location | Test Files | Total Unit Tests | Pass Rate |
| :--- | :--- | :--- | :--- | :--- |
| `@feira/web` | `apps/web/src/__tests__/*` | 18 | **238** | 100% (238/238) |
| `@feira/admin` | `apps/admin/src/__tests__/*` | 11 | **89** | 100% (89/89) |
| `@feira/logger` | `packages/logger/src/__tests__/*` | 1 | **7** | 100% (7/7) |
| `@feira/api-client` | `packages/api-client/src/__tests__/*` | 1 | **3** | 100% (3/3) |
| `@feira/ui` | `packages/ui/src/__tests__/*` | 1 | **3** | 100% (3/3) |
| `@feira/testing` | `packages/testing/src/__tests__/*` | 1 | **2** | 100% (2/2) |
| **Total Monorepo** | **Full Monorepo** | **33 suites** | **342 tests** | **100% PASS** |

### Investigation of Historical Test Count Delta
- In D4 QA report: Reported **322 unit tests**.
- In D5 initial delivery: Reported **236 unit tests** (which was `@feira/web` alone).
- In Final Audit: With the addition of regression tests for photo quotas and commercial pricing rules, `@feira/web` has **238 tests**, bringing the monorepo total to **342 unit tests**. No tests were dropped or lost. Exactly 20 new unit tests were added across D5 and the final audit.

### Dealership End-to-End (Playwright) Coverage (68 tests)
- `dealer-d1.spec.ts`: 12 tests (Registration, Step validation, CNPJ check, Approval lifecycle, Shared login).
- `dealer-d2.spec.ts`: 16 tests (Inventory overview, KPI cards, Vehicle table, Filter chips, Status actions, Mobile cards).
- `dealer-d3.spec.ts`: 12 tests (Listing creation wizard, Dropzone photos, Form validation, Pricing, Review & submit).
- `dealer-d4.spec.ts`: 16 tests (Business profile editor, Brand identity, Memory leaks, Showroom sync, Tab bar).
- `dealer-d5.spec.ts`: 12 tests (Messaging inbox, Negotiation thread, Report modal, Plans, PIX/Card checkout, Renewal).
- **Total Dealership E2E**: **68 tests** (100% PASS across Chromium and Mobile Safari).

---

## 8. Quality Gate Verification

| Tool / Check | Command | Result | Details |
| :--- | :--- | :--- | :--- |
| **Biome Linter** | `pnpm lint` | **PASS** | Checked 431 files in 316ms. 0 errors, 0 warnings. |
| **TypeScript Compiler** | `pnpm check-types` | **PASS** | Type-checked all 6 monorepo packages. 0 errors. |
| **Vitest Unit Tests** | `pnpm test` | **PASS** | 342 tests passed across 33 suites. 0 failures. |
| **Playwright E2E** | `pnpm --filter @feira/web test:e2e` | **PASS** | 68 Dealership tests passed in Chromium and Mobile Safari. |
| **Next.js Production Build** | `pnpm --filter @feira/web build` | **PASS** | 54 static/dynamic routes compiled cleanly. 0 build errors. |

---

## 9. Final Audit Verdicts

1. **Buyer Web Frontend (B1–B5)**: **VERIFIED PASS** — Clean integration, PR #9 compatibility confirmed.
2. **Seller Web Frontend (S1–S5)**: **VERIFIED PASS** — Monorepo components preserved, no regression.
3. **Dealership Web Frontend (D1–D5)**: **VERIFIED PASS** — Fully implemented, photo quotas resolved, safe simulations verified.
4. **Admin Web Frontend**: **VERIFIED PASS** — 100% frozen, 0 lines modified, 89 unit tests green.
5. **Buyer Mobile App**: **DEFERRED** — Explicitly segregated as independent native application scope.
6. **Git Merge Readiness**: **CONDITIONAL PASS** — Branch is internally clean and fully tested; must be merged after Buyer PR #9 is approved and merged into `main`.
