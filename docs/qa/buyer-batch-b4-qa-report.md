# FEIRA DE CARROS — BUYER FRONTEND BATCH B4 QA REPORT
## Favorites, Saved Searches, Alerts & Notification Preferences

**Date**: November 17, 2026  
**Status**: APPROVED / RELEASE READY  
**Application**: `apps/web` (Customer-Facing Buyer Website)  
**Git Branch**: `feat/buyer-b1-discovery-search`  
**Monorepo Invariant**: `apps/admin` strictly frozen (0 line changes)  
**Figma File**: `JlRZIGImV7rRROPZndv6NT` (Buyer Section `733:2`)  

---

## 1. Executive Summary & Release Gate Verification

Batch B4 extends the Feira de Carros Buyer Portal with full user persistence and notification personalization features, strictly adhering to the approved Figma designs and the frontend-only mandate.

### Deliverables Completed
1. **Legacy WEB-004 / Registered Favorites (`/favoritos`)**:
   - Authenticated state matching **Figma 733:232** (Desktop) and **Figma 733:274** (Mobile).
   - Category filter tabs (`Todos`, `Carros`, `Motos`, `Caminhões`) with dynamic counts.
   - Sort dropdown (`recentes`, `menor_preco`, `maior_preco`, `menor_km`, `maior_ano`).
   - Grid and list view mode toggles.
   - Unavailable/sold vehicle indicator (`veh-compass-2021-sold`) alerting users when a favorited listing was sold or paused.
   - One-click removal and bulk clear action with confirmation.
2. **WEB-004 / Favorites Empty State (`/favoritos`)**:
   - Matching **Figma 840:110** (Desktop) and **Figma 840:527** (Mobile).
   - Displayed when an authenticated buyer has zero saved vehicles.
   - Includes direct call to action to explore catalog (`/veiculos`) and a demo restoration action.
3. **WEB-004 / Favorites Login-Required State (`/favoritos`)**:
   - Matching **Figma 840:317** (Desktop) and **Figma 840:646** (Mobile).
   - Displayed when an unauthenticated guest accesses `/favoritos`.
   - Links to `/entrar?redirect=/favoritos` and `/cadastrar?redirect=/favoritos`, plus a one-click simulation shortcut for reviewers.
4. **Legacy WEB-009 / Saved Searches (`/buscas-salvas`)**:
   - Matching **Figma 856:165** (Desktop) and **Figma 856:192** (Mobile).
   - Account layout with unified navigation sidebar.
   - Saved search cards with parameter tags (`marca`, `modelo`, `cidade`, `precoMax`), new matches indicator badges, and alert enable/disable toggles.
   - "Ver resultados" action reconstructing URL search filter queries.
   - "+ Nova busca no catálogo" action and delete with confirmation.
   - Interactive "Salvar busca" action integrated into `/veiculos` Results Control Bar.
5. **Legacy WEB-010 / Matching Alerts (`/conta/alertas`)**:
   - Matching **Figma 856:219** (Desktop) and **Figma 856:240** (Mobile).
   - Displays new public vehicle listings matching active saved searches.
   - New unread badge, timestamps, vehicle thumbnail, specs, bold price, and seller type badge.
   - Actions to view listing, dismiss alert, and mark all as read.
   - Explicit `DEMO PROTOCOL` banner clarifying deterministic mock alert generation.
6. **Legacy WEB-011 / Notification Preferences (`/conta/notificacoes`)**:
   - Matching **Figma 856:261** (Desktop) and **Figma 856:282** (Mobile).
   - Master toggle for saved search alerts.
   - Multi-channel delivery controls: Email (`joao.silva@exemplo.com`) and Push Notifications.
   - Frequency options: Immediate, Daily Digest (18:00), and Weekly.
   - Message and proposal notifications toggle.
   - Promotional newsletter toggle.
   - LocalStorage persistence with timestamp and reset to defaults action.

---

## 2. Test Count Discrepancy & Reconciliation Invariant

As verified during Phase 1 audit reconciliation:
- In Batch B2, **193 tests** were reported repository-wide across all 7 workspace packages (Admin: 89, Web: 89, Packages: 15).
- In Batch B3, Turborepo cached the 5 non-modified packages and displayed only `@feira/web`'s 100 tests.
- In Batch B4, 15 new unit tests were added to `@feira/web`.

### Verified Monorepo Test Breakdown

| Workspace / Package | Previous Test Count (B3) | New Tests (B4) | Verified Current Total | Status |
|:---|:---:|:---:|:---:|:---:|
| `apps/web` (`@feira/web`) | 100 | +15 | **115** | PASS |
| `apps/admin` (`@feira/admin`) | 89 | 0 | **89** | PASS (FROZEN) |
| `packages/ui` (`@feira/ui`) | 3 | 0 | **3** | PASS |
| `packages/logger` (`@feira/logger`) | 7 | 0 | **7** | PASS |
| `packages/api-client` (`@feira/api-client`) | 3 | 0 | **3** | PASS |
| `packages/testing` (`@feira/testing`) | 2 | 0 | **2** | PASS |
| **Repository-Wide Total** | **204** | **+15** | **219** | **ALL PASS** |

Additionally, **5/5 Playwright E2E tests** in `apps/web/e2e/buyer-b4.spec.ts` passed in 3.9 seconds.

---

## 3. Canonical vs. Legacy Figma Screen Mapping

| Canonical ID | Legacy ID | Screen Name | Route | Figma Desktop Frame | Figma Mobile Frame |
|:---|:---|:---|:---|:---|:---|
| CAN-WEB-004 | WEB-004 | Registered Favorites | `/favoritos` | `733:232` (1440px) | `733:274` (390px) |
| CAN-WEB-004E | WEB-004 | Favorites Empty State | `/favoritos` | `840:110` (1440px) | `840:527` (390px) |
| CAN-WEB-004L | WEB-004 | Favorites Login Required | `/favoritos` | `840:317` (1440px) | `840:646` (390px) |
| CAN-WEB-009 | WEB-009 | Saved Searches | `/buscas-salvas` | `856:165` (1440px) | `856:192` (390px) |
| CAN-WEB-010 | WEB-010 | Matching Vehicle Alerts | `/conta/alertas` | `856:219` (1440px) | `856:240` (390px) |
| CAN-WEB-011 | WEB-011 | Notification Preferences | `/conta/notificacoes` | `856:261` (1440px) | `856:282` (390px) |

---

## 4. Screen Implementation Matrix & Design Compliance

### 4.1. Registered Favorites (`/favoritos`)
- **Figma Desktop**: `733:232` (1440px)
- **Figma Mobile**: `733:274` (390px)
- **Behavior**:
  - Gated by `isAuthenticated`. If unauthenticated, displays Login-Required State (`840:317`). If authenticated but 0 favorites, displays Empty State (`840:110`).
  - Category filters: `Todos (N)`, `Carros (N)`, `Motos (N)`, `Caminhões (N)`.
  - Sort controls: `Mais recentes`, `Menor preço`, `Maior preço`, `Menor km`, `Ano mais novo`.
  - Vehicle cards display badges (`Destaque`, `Usado`, `Vendido / Indisponível`), formatted price (`#E0151F`), specs, location, and red heart unfavorite button.
  - Unavailable listing callout banner appears automatically when any favorited vehicle is sold (`isSold: true` / `isUnavailable: true`), notifying the user while preserving their price reference.

### 4.2. Saved Searches (`/buscas-salvas`)
- **Figma Desktop**: `856:165` (1440px)
- **Figma Mobile**: `856:192` (390px)
- **Behavior**:
  - Account sidebar navigation with active highlight on "Buscas salvas".
  - Search cards show title, creation date, badge for new matches, and parameter pills (`marca`, `modelo`, `cidade`, etc.).
  - Toggle switch for alerts with immediate local state update and toast feedback.
  - "Ver resultados" button navigates to `/veiculos?${queryString}` with filter parameters restored into the search catalog.
  - "+ Nova busca no catálogo" button linking to `/veiculos`.
  - Help card explaining how matching alerts work with link to `/conta/notificacoes`.

### 4.3. Matching Alerts (`/conta/alertas`)
- **Figma Desktop**: `856:219` (1440px)
- **Figma Mobile**: `856:240` (390px)
- **Behavior**:
  - Displays deterministic mock listing alerts matching saved searches (e.g. `Toyota Corolla em Ipatinga`, `Motos em Minas Gerais`).
  - Unread alerts highlighted with red accent ring and notification indicator.
  - Vehicle card preview with image, title, version, badges, specs, and price.
  - Actions to "Ver anúncio", "Dispensar alerta", and "Marcar lidos".
  - Explicit green banner: `DEMO PROTOCOL • FEIRA DE CARROS`.

### 4.4. Notification Preferences (`/conta/notificacoes`)
- **Figma Desktop**: `856:261` (1440px)
- **Figma Mobile**: `856:282` (390px)
- **Behavior**:
  - Card sections for Search Alerts, Messages & Proposals, and Platform Promotions.
  - Delivery channel toggles for Email and Web Push.
  - Frequency cards: `Imediata`, `Resumo Diário`, `Semanal`.
  - "Salvar preferências" persists state to `localStorage` under `fdc_buyer_preferences` and displays feedback toast.
  - "Restaurar padrões" resets toggles to recommended default state.

---

## 5. Security & Edge Middleware Verification

1. **Edge Protection Boundaries (`apps/web/middleware.ts`)**:
   - `/favoritos` added to `PUBLIC_ENTRYPOINTS`. Unauthenticated visitors can freely access `/favoritos` to see the approved Figma `840:317` login-required state directly, rather than being redirected away by middleware.
   - `/buscas-salvas`, `/conta/alertas`, and `/conta/notificacoes` added to `PROTECTED_PREFIXES`. In production (`NODE_ENV === 'production'`), requests without a valid `fdc_web_session` fail closed and redirect to `/entrar?redirect=...`.
2. **Session Security Invariants**:
   - `?demo=true` query parameter bypass is strictly rejected in production.
   - Session cookies are verified on edge routes; actual data access remains governed by `@feira/api-client`.
3. **Data Isolation & Provenance Rules**:
   - Zero private seller metrics, moderation rejection notes, or unpublished drafts exposed in the buyer catalog.
   - Sold vehicle fixtures (`veh-compass-2021-sold`) excluded from general public search results via `searchPublicCatalog`, appearing only in favorited references.

---

## 6. Responsive Visual QA & Screenshot Matrix

30 screenshots were captured across 5 standard breakpoints:
- `desktop_1440` (1440x900)
- `desktop_1366` (1366x768)
- `tablet_768` (768x1024)
- `mobile_390` (390x844)
- `mobile_430` (430x932)

### Captured Screenshot Registry

| Screen / State | Route | 1440px Desktop | 1366px Desktop | 768px Tablet | 390px Mobile | 430px Mobile |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| WEB-004 Favorites (Registered) | `/favoritos` | ✓ | ✓ | ✓ | ✓ | ✓ |
| WEB-004 Favorites (Empty State) | `/favoritos` | ✓ | ✓ | ✓ | ✓ | ✓ |
| WEB-004 Favorites (Login Required) | `/favoritos` | ✓ | ✓ | ✓ | ✓ | ✓ |
| WEB-009 Saved Searches | `/buscas-salvas` | ✓ | ✓ | ✓ | ✓ | ✓ |
| WEB-010 Matching Alerts | `/conta/alertas` | ✓ | ✓ | ✓ | ✓ | ✓ |
| WEB-011 Notification Preferences | `/conta/notificacoes` | ✓ | ✓ | ✓ | ✓ | ✓ |

*Artifact location*: `screenshots/b4/`

---

## 7. Static Page Optimization & Build Audit

The production build (`next build`) compiled successfully across all 42 application routes:
- `○ /favoritos` (3.68 kB, 145 kB First Load JS)
- `○ /buscas-salvas` (3.94 kB, 143 kB First Load JS)
- `○ /conta/alertas` (3.88 kB, 143 kB First Load JS)
- `○ /conta/notificacoes` (3.98 kB, 143 kB First Load JS)
- All shared chunks: 103 kB First Load JS.
- TypeScript compiler (`tsc --noEmit`): 0 errors across 7 monorepo packages.
- Biome check (`biome check .`): 0 errors, 0 warnings across 363 files.

---

## 8. Summary of Batch B4 Release Readiness

- [x] All 6 B4 screen variants implemented strictly from Figma design tokens.
- [x] Unauthenticated guests see the Figma `840:317` login-required state.
- [x] Empty state matches Figma `840:110`.
- [x] Registered favorites match Figma `733:232` and `733:274`.
- [x] Saved searches match Figma `856:165` and `856:192`.
- [x] Matching vehicle alerts match Figma `856:219` and `856:240`.
- [x] Notification preferences match Figma `856:261` and `856:282`.
- [x] "Salvar busca" action integrated into `/veiculos` Results Control Bar.
- [x] Sold vehicle indicator (`veh-compass-2021-sold`) properly flagged.
- [x] 115/115 tests passing in `@feira/web`; 89/89 in `@feira/admin`; 219/219 repository-wide.
- [x] 5/5 Playwright E2E tests passing.
- [x] 30 responsive visual screenshots captured.
- [x] `apps/admin` frozen at 0 edits.
- [x] Production build passes with 42/42 prerendered routes.
