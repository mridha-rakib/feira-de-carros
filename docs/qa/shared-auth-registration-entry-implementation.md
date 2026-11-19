# FEIRA DE CARROS — SHARED AUTHENTICATION FRONTEND IMPLEMENTATION
## UX Simplification: Removal of Redundant Method Selection Cards & Direct Registration Flow

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

## 1. Executive Summary & UX Simplification

Following project owner approval, the redundant registration-method selection cards have been removed from the Shared Account Selection page (`/criar-conta`), eliminating confusing UX duplication while preserving both Email + Password and Social registration options.

### What Was Removed:
1. **Heading:** `Como você prefere se cadastrar?` (Figma desktop `2918:2`, mobile `2919:2`).
2. **Registration Method Cards:**
   - `Com e-mail e senha` (Figma desktop `2918:3`, mobile `2919:3`).
   - `Com Google, Apple ou Facebook` (Figma desktop `2918:4`, mobile `2919:4`).
3. **Associated State & Indicators:**
   - Selected-state red borders, checkmark circles, and redundant method selection state.
4. **Unused Method Icons:**
   - Method envelope and social network SVG representations removed from the active screen flow.

### Preserved Features & Final Page Structure (Left Card):
The left card strictly follows the approved 13-item visual order:
1. `Criar conta` pill label (`bg-[#fdebec] text-[#e0151f]`).
2. `Como deseja usar a Feira de Carros?` main heading.
3. `Escolha o tipo de conta para continuar.` subtitle.
4. Buyer role card (`Sou comprador`) — selected by default with red border and checkmark circle.
5. Individual Seller role card (`Sou vendedor particular`).
6. Dealership role card (`Sou concessionária`).
7. Primary `Continuar` button — positioned directly beneath the 3 role cards.
8. Existing-account link: `Já possui uma conta? Entrar` (routing to `/entrar`).
9. Divider: `ou continue com`.
10. `Continuar com Google` button (with official Figma SVG vector).
11. `Continuar com Apple` button (with official Figma SVG vector).
12. `Continuar com Facebook` button (with official Figma SVG vector).
13. Global email uniqueness explanatory note: *"Um e-mail = uma conta. Escolha o perfil correto antes de continuar."*.

---

## 2. Mandatory Asset Provenance Register

All vector and photographic assets are retrieved directly from Figma MCP and stored in the project repository:

| Asset Name | Figma Node ID | Exported Local Path | Frontend Consumer | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Official Google Multicolor SVG** | `1646:3560` / `2913:2` | `apps/web/public/icons/google.svg` | `IconGoogle` in `/criar-conta`, `/entrar` | **EXACT MATCH** (Official 4-color path) |
| **Official Apple Glyph SVG** | `1646:3565` / `2913:7` | `apps/web/public/icons/apple.svg` | `IconApple` in `/criar-conta`, `/entrar` | **EXACT MATCH** (18x25 black vector) |
| **Official Facebook Badge** | `1646:3567` / `2913:9` | `apps/web/public/icons/facebook-badge.svg` | `IconFacebook` in `/criar-conta`, `/entrar` | **EXACT MATCH** (`#1877F2` circle) |
| **Official Facebook Glyph** | `1646:3568` / `2913:10` | `apps/web/public/icons/facebook-glyph.svg` | `IconFacebook` in `/criar-conta`, `/entrar` | **EXACT MATCH** (white "f" glyph) |
| **Persona: Comprador (User)** | `2912:37` / `2912:131` | Direct SVG Component | `IconUser` in `/criar-conta` | **EXACT MATCH** |
| **Persona: Vendedor (Car)** | `2912:49` / `2912:140` | Direct SVG Component | `IconCar` in `/criar-conta` | **EXACT MATCH** |
| **Persona: Concessionária (Store)**| `2912:60` / `2912:151` | Direct SVG Component | `IconStore` in `/criar-conta` | **EXACT MATCH** |
| **Trust: Shield** | `2912:95` / `2912:183` | Direct SVG Component | `IconShield` in `/criar-conta` | **EXACT MATCH** (`#38BDF8`) |
| **Trust: Variety (Car)** | `2912:101` / `2912:188` | Direct SVG Component | `IconCar` in `/criar-conta` | **EXACT MATCH** (`#38BDF8`) |
| **Trust: Practical (Bolt)** | `2912:109` / `2912:195` | Direct SVG Component | `IconBolt` in `/criar-conta` | **EXACT MATCH** (`#38BDF8`) |
| **Automotive Editorial Photograph**| `2912:87` (Asset `ed011f08`) | `apps/web/public/images/auth-side-car.png` | `<Image>` in `/criar-conta` | **EXACT MATCH** (Toyota Corolla hatchback) |
| **Official Brand Logo** | `2912:8` / `2912:117` | `@feira/ui` `BrandLogo` | `MarketplaceHeader` in all pages | **EXACT MATCH** |

---

## 3. Registration Behavior & Flow

### A. Role Selection
- Dynamic single-selection among `Sou comprador`, `Sou vendedor particular`, and `Sou concessionária`.
- Buyer is selected by default.
- Active visual state: Red accent border (`border-[1.5px] border-[#e0151f]`), light pink background (`#fff1f2`), and red checkmark circle (`IconCheck`).

### B. Primary Continue CTA
- Located directly beneath the three role cards.
- Clicking `Continuar` always initiates the standard Email + Password registration flow for the chosen persona:
  - **Buyer** → `/cadastrar` (18+ validation, name, email, password, terms).
  - **Individual Seller** → `/vendedor/solicitacao` (applicant details, CPF, mock review queue).
  - **Dealership** → `/concessionaria/solicitacao` (business details, CNPJ, responsible party, mock review queue).
- Preserves all required form fields, validations, and manual approval workflows.

### C. Social Provider Buttons
- Three distinct outlined buttons with official Figma SVGs (Google, Apple, Facebook).
- Preserves the currently selected role.
- Shows clear non-blocking feedback indicating provider identification and frontend-only mock state.
- Never manufactures fake authenticated accounts or bypasses role-specific onboarding forms.

---

## 4. Figma Alignment Status

- **Status:** The frontend implementation has been fully updated and cleaned.
- **Coordination Note:** Direct node deletion via Figma MCP (`use_figma`) is unavailable in the current toolset permissions. The remote Figma frames `2912:3` (desktop) and `2912:113` (mobile) still contain the deprecated nodes `2918:2`–`2918:23` and `2919:2`–`2919:23` which should be deleted in Figma to match this approved frontend simplification. We do not falsely claim Figma was updated in-place.

---

## 5. Automated Verification & Quality Gates

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
- **Result:** **PASSED** (All 55 routes compiled; `○ /criar-conta` at 3.47 kB).

### E. Playwright E2E Automated Tests
- **Test File:** `apps/web/e2e/shared-auth-entry.spec.ts`
- **Browsers:** Desktop Chromium (8/8) + Mobile Safari iPhone 14 (8/8)
- **Result:** **16/16 tests PASSED** in 9.6s.
  - `renders page elements, badge, headline, and default buyer selection` — **PASSED** (asserts removed cards are NOT visible)
  - `supports selecting only one role at a time` — **PASSED**
  - `submitting default buyer selection navigates to /cadastrar` — **PASSED**
  - `selecting seller particular and submitting navigates to /vendedor/solicitacao` — **PASSED**
  - `selecting concessionária and submitting navigates to /concessionaria/solicitacao` — **PASSED**
  - `clicking Entrar navigates to /entrar` — **PASSED**
  - `in /entrar, clicking Criar conta navigates back to /criar-conta` — **PASSED**
  - `social buttons display non-blocking demonstrative status and preserve chosen role` — **PASSED**

---

## 6. Multi-Viewport Visual QA Evidence

Full-page screenshots captured across 5 canonical viewports confirm zero awkward gaps, seamless alignment, and clean visual hierarchy:
- **Desktop 1440px:** `screenshots/criar-conta/after_desktop_1440.png`
- **Desktop 1366px:** `screenshots/criar-conta/after_desktop_1366.png`
- **Tablet 768px:** `screenshots/criar-conta/after_tablet_768.png`
- **Mobile 430px:** `screenshots/criar-conta/after_mobile_430.png`
- **Mobile 390px:** `screenshots/criar-conta/after_mobile_390.png`

---

## 7. Preservation of Critical Architectural Invariants

1. **Monorepo Boundary:** Monorepo package `apps/admin` remains 100% untouched and frozen.
2. **Frontend Simulation Only:** Zero backend databases, ORMs, server-side sessions, or live OAuth credentials.
3. **AUTH-022 Compliance:** Preserves individual identity stores for Buyer, Seller, and Dealer, ensuring Option 2 Global Email Uniqueness is honored without account type conversion.
4. **Forms Preserved:** Conventional Email + Password registration and login remain 100% functional at `/entrar`, `/cadastrar`, `/vendedor/solicitacao`, `/concessionaria/solicitacao`, and `/recuperar-senha`.
