# Feira de Carros — Dealership Frontend Implementation Plan (D1–D5)
**Document ID:** `PLAN-DEALERSHIP-D1-D5-v1.0`  
**Date:** November 17, 2026  
**Author:** Senior Software Architect, Frontend Lead & QA Automation Architect  
**Repository:** `mridha-rakib/feira-de-carros`  
**Target Application:** `apps/web` (Dealership Routes Namespace)  
**Approved Figma Source:** File `JlRZIGImV7rRROPZndv6NT` (Page `733:2` Zone 3 & Page `1566:2` Zone 4)  
**Status:** Implementation Roadmap Specification (Architecture Stage — No Code Written)

---

## 1. Architectural Strategy & Ground Rules

1. **Monorepo Invariant Compliance**:
   - All Dealership screens reside strictly inside `apps/web` under `/concessionaria/*`.
   - `apps/admin` remains **strictly frozen** (0 modifications).
   - Zero database/ORM logic inside Next.js routes. All interactions utilize `@feira/api-client`-ready mock adapters.
2. **Strict Persona Separation (AUTH-022)**:
   - Dealership accounts are distinct commercial entities (`dealer`).
   - Dedicated local storage namespace (`feira_dealer_*`) guarantees zero state leakage into Buyer (`feira_buyer_*`) or Individual Seller (`feira_seller_*`) stores.
3. **Maximizing Seller Component Reuse**:
   - Operational listing workflows (Ad Wizard steps, published listing edits, revision comparisons, plan selection, Pix/card checkout, boost, renewal, and chat composer) are reused directly from the verified Seller frontend to maintain velocity and design consistency.
4. **Tooling & Quality Gates**:
   - Biome formatting and linting.
   - Comprehensive unit tests (`Vitest`) and visual/responsive E2E journeys (`Playwright`) across 1440px desktop and 390px mobile for every batch.

---

## 2. Implementation Batch Overview (D1 through D5)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   DEALERSHIP IMPLEMENTATION ROADMAP                    │
├───────────────────┬────────────────────────────────────────────────────┤
│ Batch D1          │ Dealership Registration, Application & Approval    │
│                   │ Screens: WEB-017, Status, Correction               │
├───────────────────┼────────────────────────────────────────────────────┤
│ Batch D2          │ Dealership Inventory Dashboard & Fleet Overview    │
│                   │ Screens: WEB-021 (Overview & Views Metrics)        │
├───────────────────┼────────────────────────────────────────────────────┤
│ Batch D3          │ Vehicle Listing Lifecycle & Ad Operations          │
│                   │ Shared Wizard, Edit, Revisions, Sold Removal       │
├───────────────────┼────────────────────────────────────────────────────┤
│ Batch D4          │ Dealership Business Profile & Public Showroom Link │
│                   │ Screens: WEB-022 (Profile Editor, Logo Upload)     │
├───────────────────┼────────────────────────────────────────────────────┤
│ Batch D5          │ Dealership Messaging, Payments & Full Integration  │
│                   │ Dealer Inbox, Boost/Renewal Checkout, QA Audit     │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 3. Detailed Batch Specifications

### Batch D1: Dealership Registration, Application & Approval Lifecycle

#### Scope & Figma References
- **Figma Frames**:
  - `DEALERSHIP-WEB-017`: Desktop `1575:3428` (`1440x1251`), Mobile `1582:3455` (`390x2539`)
  - Application Status: Desktop `1629:3592` / Mobile `1629:3646`
  - Application Correction: Desktop `1629:3560` / Mobile `1629:3614`
- **Next.js Routes (`apps/web`)**:
  - `/concessionaria/solicitacao` (Registration & Application Form)
  - `/concessionaria/solicitacao/status` (Application Review Status)
  - `/concessionaria/solicitacao/corrigir` (Correction & Resubmission)

#### Component Architecture & Reuse
- **New Components**:
  - `DealershipApplicationForm.tsx`: Multi-section form (Account Credentials + Business Data).
  - `CnpjInput.tsx`: Formatted CNPJ input with standard Brazilian validation algorithm (`XX.XXX.XXX/YYYY-ZZ`).
  - `ApplicationStatusCard.tsx`: Pending review banner with estimated timeline disclaimer.
- **Reused Components**:
  - `@feira/ui`: `Button`, `Input`, `Checkbox`, `Alert`
  - `SellerIcons.tsx`: Building, Shield, Check, Alert, Return icons

#### Functional Interactions & Business Rules
1. **Form Validation**:
   - Required fields: Nome, Sobrenome, E-mail, Senha, Confirmar Senha, Nome da Revenda, CNPJ, Telefone para anúncios.
   - CNPJ validation: Strict Brazilian CNPJ check digit verification.
   - Password confirmation match and strength indicators.
2. **Submission & Lifecycle**:
   - On submit, sets `status: pending_approval` in `use-dealer-store.ts`.
   - Transitions user to `/concessionaria/solicitacao/status`.
   - Admin rejection simulation allows navigation to `/concessionaria/solicitacao/corrigir` where fields are pre-filled with admin review feedback notes (`AUTH-019`).

#### Acceptance Criteria
- [ ] Renders pixel-perfect against Figma `1575:3428` (Desktop) and `1582:3455` (Mobile).
- [ ] Validates invalid CNPJ with Brazilian check digit algorithm.
- [ ] Prevents duplicate email if email exists in demo accounts.
- [ ] Submitting transitions state to `pending_approval` with clean status view.
- [ ] Correction flow permits modifying data and resubmitting.
- [ ] Unit test suite passes with >90% branch coverage.

---

### Batch D2: Dealership Inventory Dashboard & Fleet Overview

#### Scope & Figma References
- **Figma Frames**:
  - `DEALERSHIP-WEB-021`: Desktop `1592:3472` (`1440x1394`), Mobile `1592:3701` (`390x2450`)
- **Next.js Routes (`apps/web`)**:
  - `/concessionaria/anuncios` (Dealership Inventory Overview)

#### Component Architecture & Reuse
- **New Components**:
  - `DealershipInventoryTable.tsx`: Multi-vehicle inventory table with vehicle thumbnail, title, price, status badge, views count, and action menu.
  - `DealershipMetricsHeader.tsx`: Aggregated KPI cards displaying 30-day views (`ANA-001`) and top visitor cities breakdown (`ANA-002`).
  - `DealerMobileInventoryCard.tsx`: Responsive card layout optimized for mobile 390px viewports.
- **Reused Components**:
  - `StatusBadge.tsx`: `Ativo` (emerald), `Em análise` (blue), `Expirando` (amber), `Pausado` (slate), `Vendido` (neutral).
  - Search and filter input primitives.

#### Functional Interactions & Business Rules
1. **Inventory Management**:
   - Status filter tabs: `Todos os status`, `Ativo`, `Em análise`, `Expirando`, `Pausado`.
   - Search bar debouncing vehicle make, model, version, or license plate simulation.
   - Fast action buttons on rows: `Editar` (routes to listing editor), `Ver anúncio público` (routes to `/veiculos/[id]`), `Ações` (dropdown menu for boost, renewal, mark as sold).
2. **Aggregated Analytics Integration (`ANA-001/002`)**:
   - Shows total views across all dealership vehicles with visual trend indicator.
   - Displays top visitor cities table (Ipatinga, Cel. Fabriciano, Timóteo, Santana do Paraíso).
   - Explicitly displays disclaimer: *"Valores, fotos e métricas são dados ilustrativos para revisão do design."*

#### Acceptance Criteria
- [ ] Renders pixel-perfect against Figma `1592:3472` (Desktop) and `1592:3701` (Mobile).
- [ ] Status filter chips accurately update visible table/card rows.
- [ ] CTA `+ Anunciar veículo` navigates directly to ad creation wizard.
- [ ] Row action `Editar` navigates to vehicle listing editor.
- [ ] Row action `Ver anúncio` links to canonical public VDP.
- [ ] Mobile viewport collapses table into responsive card list.

---

### Batch D3: Vehicle Listing Lifecycle & Operations for Dealership

#### Scope & Figma References
- **Figma Frames**:
  - Reuses Seller Wizard: `WEB-023` (`625:302`), `WEB-024` (`625:365`), `WEB-025` (`625:443`), `WEB-026` (`625:508`)
  - Reuses Seller Edit & Lifecycle: `WEB-034` (`698:547`), `WEB-035` (`698:622`), `WEB-038` (`773:638`)
- **Next.js Routes (`apps/web`)**:
  - `/concessionaria/anuncios/novo` (Category selection)
  - `/concessionaria/anuncios/novo/detalhes` (Attributes & specs)
  - `/concessionaria/anuncios/novo/fotos` (Photo dropzone & cover selection)
  - `/concessionaria/anuncios/novo/revisao` (Summary & submit)
  - `/concessionaria/anuncios/[id]/editar` (Published listing edit)
  - `/concessionaria/anuncios/[id]/revisoes` (Revision diff comparison)
  - `/concessionaria/anuncios/[id]/vendido` (Sold removal)

#### Component Architecture & Reuse
- **Reused Components (100% Reuse Strategy)**:
  - Reuse existing `apps/web/app/vendedor/anuncios/novo/*` wizard logic, parameterized with `dealershipId`.
  - Reuse photo quota uploader (10 photos max for Dealership).
  - Reuse revision comparison layout (`WEB-035`) showing current active vs pending edit.
  - Reuse sold listing removal dialog (`WEB-038`) with instant archive confirmation.

#### Functional Interactions & Business Rules
1. **Ad Creation Under Dealership Account**:
   - Newly created listings automatically inherit `dealershipId` and dealer contact details.
   - Submitting listing sets status to `pending_approval` (`VEH-016`).
   - Requires advertising plan selection before public activation (`ADV-001`).
2. **Revision Governance (`VEH-018`)**:
   - Editing an active vehicle creates a draft revision while keeping the approved version live in the public showroom until Admin approval.
3. **Sold Removal (`VEH-020`)**:
   - Marking vehicle sold instantly removes it from public showroom (`/concessionarias/[id]`) and search catalog (`/veiculos`), locking active buyer chats into read-only mode (`MSG-015`).

#### Acceptance Criteria
- [ ] Dealership user can complete the 4-step wizard to create an inventory item.
- [ ] Created vehicle is listed under Dealership inventory table with `Em análise` status.
- [ ] Editing an active vehicle creates a revision comparison view.
- [ ] Marking vehicle as sold transitions state and removes vehicle from public dealership showroom.
- [ ] E2E tests verify full lifecycle from creation to sold removal.

---

### Batch D4: Dealership Business Profile & Public Showroom Linkage

#### Scope & Figma References
- **Figma Frames**:
  - `DEALERSHIP-WEB-022`: Desktop `1594:3516` (`1440x1496`), Mobile `1594:3671` (`390x2295`)
- **Next.js Routes (`apps/web`)**:
  - `/concessionaria/perfil` (Business Profile Editor)

#### Component Architecture & Reuse
- **New Components**:
  - `DealerProfileForm.tsx`: Form for trading name (`Nome da Revenda`), dealer logo upload, address visibility toggle, operating hours.
  - `DealerShowroomPreviewCard.tsx`: Live desktop/mobile card mirroring how the showroom header appears to public buyers.
  - `DealerPrivacyCallout.tsx`: High-visibility security notice explaining that CNPJ and personal legal data remain strictly private (`SEC-003`).

#### Functional Interactions & Business Rules
1. **Profile Editing**:
   - Trading Name: updates public showroom display title.
   - Logo Upload: interactive image dropzone supporting drag-and-drop with instant crop/preview.
   - Address Visibility Toggle: checkbox allowing dealership to hide street address while keeping city/state visible.
   - Operating Hours: text editor for weekday, Saturday, and Sunday hours.
2. **Privacy Enforcement (`SEC-003`, `AUTH-021`)**:
   - UI clearly states: *"Os dados pessoais e o CNPJ permanecem privados. Contato com compradores apenas nos anúncios. CNPJ, informações pessoais e dados sensíveis não são exibidos publicamente."*
   - CNPJ field is disabled or absent from public profile editor; CNPJ changes require staff intervention.
3. **Showroom Linkage**:
   - "Visualizar perfil" button links directly to `/concessionarias/[id]`.

#### Acceptance Criteria
- [ ] Renders pixel-perfect against Figma `1594:3516` (Desktop) and `1594:3671` (Mobile).
- [ ] Updating trading name and saving updates live preview immediately.
- [ ] Privacy callout explicitly displayed with confirmed copy.
- [ ] Clicking "Visualizar perfil" navigates to canonical `/concessionarias/[id]`.
- [ ] Zero CNPJ or private owner data exposed in DOM or payload.

---

### Batch D5: Dealership Messaging, Advertising Plans & Final Integration

#### Scope & Figma References
- **Figma Frames**:
  - Reuses Advertiser Messaging: `WEB-045` (`791:694`), `WEB-046` (`791:772`), `WEB-048` (`791:846`)
  - Reuses Plans & Checkout: `WEB-029` (`744:512`), `WEB-030` (`744:599`), `WEB-031` (`744:685`), `WEB-032` (`744:774`), `WEB-036` (`764:660`), `WEB-037` (`764:748`)
- **Next.js Routes (`apps/web`)**:
  - `/concessionaria/mensagens` (Dealership Inbox)
  - `/concessionaria/mensagens/[id]` (Dealership Thread)
  - `/concessionaria/anuncios/[id]/plano` (Plan Selection)
  - `/concessionaria/anuncios/[id]/impulsionar` (Boost Order)
  - `/concessionaria/anuncios/[id]/renovar` (Renewal Order)
  - `/concessionaria/pagamentos` (Payment Receipts History)
  - `/concessionaria/conta` (Account Credentials & Security)

#### Component Architecture & Reuse
- **Messaging Integration**:
  - Dealership inbox operates identically to individual seller inbox, but sets sender display name to Dealership Trading Name.
  - Vehicle reference rail links to Dealership inventory item.
- **Per-Vehicle Paid Listing Integration**:
  - Dealership selects plan for each vehicle (`Plano Básico`, `Plano Destaque`, `Plano Premium`).
  - Pix & Card checkout simulation issuing valid payment receipts (`PAY-008/009`).
  - Renewal and Boost order workflows.

#### Acceptance Criteria
- [ ] Dealership user can view and respond to buyer inquiries in real time.
- [ ] Outgoing messages show Dealership trading name.
- [ ] Per-vehicle advertising plan checkout simulates Pix and Card payments with receipts.
- [ ] Boost and Renewal flows update listing expiration dates and prominence flags.
- [ ] Full regression suite passes across monorepo with 0 errors.

---

## 4. Requirement Verification & Acceptance Gates

| Batch | Release Gate Check | Verification Command | Gate Criteria |
| :--- | :--- | :--- | :--- |
| **D1** | Registration & CNPJ Validation | `pnpm --filter @feira/web test src/__tests__/dealer-d1.test.ts` | 100% pass; CNPJ check digit algorithm verified; rejection states tested. |
| **D2** | Inventory & Analytics | `pnpm --filter @feira/web test:e2e e2e/dealer-d2.spec.ts` | Table sorting, status filtering, and views metrics verified across viewports. |
| **D3** | Listing Lifecycle | `pnpm --filter @feira/web test:e2e e2e/dealer-d3.spec.ts` | 4-step wizard, revision diff, and sold removal verified without regressions. |
| **D4** | Profile & Privacy | `pnpm --filter @feira/web test:e2e e2e/dealer-d4.spec.ts` | Logo upload, preview, and complete CNPJ exclusion verified. |
| **D5** | Final QA & Full Integration | `pnpm test && pnpm --filter @feira/web test:e2e` | Monorepo tests pass (230+ unit, 40+ E2E); Biome 0 errors; Type check 0 errors. |
