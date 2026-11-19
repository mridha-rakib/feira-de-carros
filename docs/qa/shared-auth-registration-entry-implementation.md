# FEIRA DE CARROS — SHARED AUTHENTICATION FRONTEND IMPLEMENTATION
## Approved Figma Design → Next.js Frontend | Exact Assets, Icons & Role-Based Registration

- **Date:** November 19, 2026
- **Branch:** `feat/shared-auth-registration-entry`
- **Figma File:** `JlRZIGImV7rRROPZndv6NT`
- **Primary Canonical Frames:**
  - Desktop: `2912:3` (`SHARED / AUTH / ACCOUNT TYPE SELECTION / DESKTOP / APPROVED`)
  - Mobile: `2912:113` (`SHARED / AUTH / ACCOUNT TYPE SELECTION / MOBILE / APPROVED`)
- **Existing Canonical Auth References:**
  - Login Desktop: `845:164` | Login Mobile: `845:188`
  - Registration Desktop: `845:212` | Registration Mobile: `845:241`
  - Password Recovery Desktop: `845:316` | Password Recovery Mobile: `845:333`
- **Monorepo Boundary:** Monorepo `apps/web` only (`apps/admin` strictly frozen)

---

## 1. Executive Summary

This phase finalizes the shared authentication entry and account-type selection experience for Feira de Carros (`/criar-conta`), implementing the newly approved Figma design with exact vector SVGs, assets, role selection, registration method selection, and cross-route auth auditing.

### Key Deliverables Completed:
1. **New Route `/criar-conta` (Shared Account Type & Registration Method Selection)**:
   - Built with semantic React + Tailwind components matching Figma frames `2912:3` and `2912:113`.
   - Accessible role selection (`Sou comprador`, `Sou vendedor particular`, `Sou concessionária`) with dynamic single-selection state, red accent styling, and checkmarks.
   - Accessible registration method selection (`Como você prefere se cadastrar?`):
     - `Com e-mail e senha`: default selected, routes to role-specific registration forms.
     - `Com Google, Apple ou Facebook`: prepares provider state, provides clear demo feedback.
   - Primary `Continuar` action respecting both selected account type and registration method.
   - Direct link to `/entrar` ("Já possui uma conta? Entrar").
   - Official social sign-in buttons (Google, Apple, Facebook) using exact Figma vector assets.
   - Option 2 Global Email Uniqueness / AUTH-022 disclosure note at card base.
   - High-fidelity photographic side panel with approved Toyota Corolla photograph, dark overlay, red accent bar, headline, and 3 trust badges (*Anúncios verificados*, *Variedade de veículos*, *Experiência prática*).

2. **Login Page Visual & Icon Upgrade (`/entrar`)**:
   - Replaced low-fidelity placeholder text icons with official Figma SVGs (Google multicolor, Apple black silhouette, Facebook `#1877F2` badge).
   - "Criar conta" navigation linked to `/criar-conta`.
   - Preserved full email + password login simulation, password visibility toggles, and demo persona fast-fills.

3. **Asset Provenance & Exact Icon Export**:
   - Official SVG vectors retrieved directly via Figma MCP and stored in `apps/web/public/icons/` and integrated into `apps/web/app/components/SellerIcons.tsx`.

---

## 2. Mandatory Asset Provenance Table

| Icon Name | Figma Source Node ID | Exported Local Asset Path | Frontend Component / Site | Visual Verification Result |
| :--- | :--- | :--- | :--- | :---: |
| **Official Google Multicolor SVG** | `1646:3560` / `2913:2` | `apps/web/public/icons/google.svg` | `IconGoogle` in `/criar-conta`, `/entrar` | **EXACT MATCH** (Official 4-color path) |
| **Official Apple Silhouette SVG** | `1646:3565` / `2913:7` | `apps/web/public/icons/apple.svg` | `IconApple` in `/criar-conta`, `/entrar` | **EXACT MATCH** (18x25 black vector) |
| **Official Facebook Blue Badge** | `1646:3567` / `2913:9` | `apps/web/public/icons/facebook-badge.svg` | `IconFacebook` in `/criar-conta`, `/entrar` | **EXACT MATCH** (`#1877F2` circle) |
| **Official Facebook Glyph** | `1646:3568` / `2913:10` | `apps/web/public/icons/facebook-glyph.svg` | `IconFacebook` in `/criar-conta`, `/entrar` | **EXACT MATCH** (white "f" path) |
| **Method: E-mail & Senha SVG** | `2918:6` / `2919:6` | `apps/web/public/icons/method-email.svg` | `IconMethodEmail` in `/criar-conta` | **EXACT MATCH** (Envelope in `#E0151F`) |
| **Method: Social Providers SVG** | `2918:16` / `2919:17` | `apps/web/public/icons/method-social.svg` | `IconMethodSocial` in `/criar-conta` | **EXACT MATCH** (User node network in `#16243C`) |
| **Method: Selected Checkmark SVG** | `2918:13` / `2919:14` | `apps/web/public/icons/method-check.svg` | `IconCheck` in `/criar-conta` | **EXACT MATCH** (White checkmark) |
| **Role: Comprador (User)** | `2912:37` / `2912:131` | `apps/web/public/icons/role-user.svg` | `IconUser` in `/criar-conta` | **EXACT MATCH** |
| **Role: Vendedor (Car)** | `2912:49` / `2912:140` | `apps/web/public/icons/role-car.svg` | `IconCar` in `/criar-conta` | **EXACT MATCH** |
| **Role: Concessionária (Store)** | `2912:60` / `2912:151` | `apps/web/public/icons/role-store.svg` | `IconStore` in `/criar-conta` | **EXACT MATCH** |
| **Trust: Shield** | `2912:95` / `2912:183` | Direct SVG Component | `IconShield` in `/criar-conta` | **EXACT MATCH** (`#38BDF8`) |
| **Trust: Variety (Car)** | `2912:101` / `2912:188` | Direct SVG Component | `IconCar` in `/criar-conta` | **EXACT MATCH** (`#38BDF8`) |
| **Trust: Practical (Bolt)** | `2912:109` / `2912:195` | Direct SVG Component | `IconBolt` in `/criar-conta` | **EXACT MATCH** (`#38BDF8`) |
| **Automotive Editorial Photo** | `2912:87` (Asset `ed011f08`) | `apps/web/public/images/auth-side-car.png` | Next.js `<Image>` in `/criar-conta` | **EXACT MATCH** (Toyota Corolla hatchback) |
| **Official Brand Logo** | `2912:8` / `2912:117` | `@feira/ui` `BrandLogo` | `MarketplaceHeader` in all pages | **EXACT MATCH** |

---

## 3. Registration Flow & Interaction Mapping

### A. Role Selection Behavior
1. **Buyer (`Sou comprador`)**:
   - Default selected on initial page load.
   - Selected state: `border-[1.5px] border-[#e0151f] bg-[#fff1f2]`, red checkmark circle (`IconCheck`).
   - Unselected state: `border-[#dde3ec] bg-white`, chevron (`IconChevronRight`).
   - Destination: `/cadastrar`.
2. **Individual Seller (`Sou vendedor particular`)**:
   - Destination: `/vendedor/solicitacao`.
3. **Dealership (`Sou concessionária`)**:
   - Destination: `/concessionaria/solicitacao`.
*Rule:* Strictly mutually exclusive. Only one role is active at any time.

### B. Registration Method Behavior
1. **Com e-mail e senha**:
   - Default selected on initial page load.
   - Clicking `Continuar` navigates to the role-specific registration form.
2. **Com Google, Apple ou Facebook**:
   - User can choose social method or click an individual provider button.
   - Explicitly communicates demonstrative limitation:
     *"Identificado provedor {Google/Apple/Facebook} para {perfil}. A autenticação OAuth real será integrada na fase backend; redirecionando para o formulário correspondente no modo demonstrativo..."*
   - Routes to the appropriate form without bypassing required identity or approval fields.

### C. Login vs. Registration Separation
- Registration (`/criar-conta`): Persona and method selection prior to registration.
- Login (`/entrar`): Email/password lookup determines persona automatically. No persona selection is presented to existing users on login.

---

## 4. Verification Evidence & Quality Gates

### A. TypeScript Typecheck
- **Command:** `pnpm check-types`
- **Result:** **PASSED** (6/6 projects successful, 0 errors).

### B. Biome Lint & Format Check
- **Command:** `pnpm lint`
- **Result:** **PASSED** (434 files checked, 0 errors).

### C. Monorepo Unit Test Suite
- **Command:** `pnpm test`
- **Result:** **PASSED** (18/18 test files in `@feira/web`, 238/238 unit tests passed; 342/342 monorepo-wide).

### D. Production Build
- **Command:** `pnpm --filter @feira/web build`
- **Result:** **PASSED** (All 55 routes compiled cleanly; `○ /criar-conta` prerendered as static route `3.91 kB`).

### E. Playwright E2E Automated Tests
- **Test File:** `apps/web/e2e/shared-auth-entry.spec.ts`
- **Browsers:** Chromium (Desktop) and Mobile Safari (iPhone 14)
- **Result:** **20/20 tests PASSED** in 15.4s.
  - `renders page elements, badge, headline, and default buyer + email selections` (Desktop & Mobile) — **PASSED**
  - `supports selecting only one role at a time` (Desktop & Mobile) — **PASSED**
  - `supports selecting registration method` (Desktop & Mobile) — **PASSED**
  - `submitting default buyer + email method navigates to /cadastrar` (Desktop & Mobile) — **PASSED**
  - `selecting seller particular and submitting with email navigates to /vendedor/solicitacao` (Desktop & Mobile) — **PASSED**
  - `selecting concessionária and submitting with email navigates to /concessionaria/solicitacao` (Desktop & Mobile) — **PASSED**
  - `submitting with social method displays demonstrative notice and maintains role` (Desktop & Mobile) — **PASSED**
  - `clicking Entrar navigates to /entrar` (Desktop & Mobile) — **PASSED**
  - `in /entrar, clicking Criar conta navigates back to /criar-conta` (Desktop & Mobile) — **PASSED**
  - `social buttons display non-blocking demonstrative status and identify provider` (Desktop & Mobile) — **PASSED**

---

## 5. Multi-Viewport Visual QA Evidence

Full-page screenshots captured across 5 canonical viewports:
- **Desktop 1440px:** `screenshots/criar-conta/after_desktop_1440.png`
- **Desktop 1366px:** `screenshots/criar-conta/after_desktop_1366.png`
- **Tablet 768px:** `screenshots/criar-conta/after_tablet_768.png`
- **Mobile 430px:** `screenshots/criar-conta/after_mobile_430.png`
- **Mobile 390px:** `screenshots/criar-conta/after_mobile_390.png`

---

## 6. Architectural Invariants Preserved

1. **Monorepo Boundary**:
   - Zero modifications to `apps/admin` (strictly frozen).
2. **Frontend Simulation Only**:
   - No backend databases, ORMs, server-side sessions, or live OAuth credentials.
3. **AUTH-022 & Global Email Uniqueness Option 2**:
   - Distinct identity models for Buyer, Seller, and Dealer preserved.
   - Option 2 disclosure clearly presented to users prior to account creation.
