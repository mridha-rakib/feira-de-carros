# FEIRA DE CARROS — SHARED REGISTRATION ENTRY & AUTH FRONTEND FINALIZATION
## QA & Implementation Report: `/criar-conta` & Related Authentication Architecture

- **Date:** November 18, 2026
- **Branch:** `feat/shared-registration-entry-and-auth`
- **Figma File:** `JlRZIGImV7rRROPZndv6NT`
- **Canonical Frames:**
  - Desktop: `2912:3` (`SHARED / AUTH / ACCOUNT TYPE SELECTION / DESKTOP / APPROVED`)
  - Mobile: `2912:113` (`SHARED / AUTH / ACCOUNT TYPE SELECTION / MOBILE / APPROVED`)
- **Visual Baseline:** Client-approved visual reference screenshot
- **Monorepo Boundary:** Monorepo `apps/web` only (`apps/admin` strictly frozen)

---

## 1. Executive Summary

This phase finalizes the shared entry point for account registration across Feira de Carros (`/criar-conta`), resolving the persona selection flow prior to registration according to the client-approved Figma designs (`2912:3` and `2912:113`).

### Core Accomplishments
1. **Implemented Shared Account-Type Selection (`/criar-conta`)**:
   - Split card and automotive promotional panel layout on desktop (`1440px` and `1366px`).
   - Clean vertically-stacked responsive presentation on tablet (`768px`) and mobile (`430px`, `390px`).
   - Three selectable persona options with icon badging, title, and descriptive subtitle:
     - **Comprador** (`Sou comprador`): routes to `/cadastrar` (selected by default with active `#e0151f` accent border and checkmark circle).
     - **Vendedor particular** (`Sou vendedor particular`): routes to `/vendedor/solicitacao`.
     - **Concessionária** (`Sou concessionária`): routes to `/concessionaria/solicitacao`.
   - Primary `Continuar` action button directing the user to the dedicated registration page.
   - "Já possui uma conta? Entrar" linking directly to `/entrar`.
   - "ou continue com" divider with official social login buttons (Google, Apple, Facebook).
   - Option 2 Global Email Uniqueness / AUTH-022 disclosure note at bottom: *"Um e-mail = uma conta. Escolha o perfil correto antes de continuar."*
   - Automotive editorial side panel featuring the approved vehicle photograph (`/images/auth-side-car.png`), dark gradient overlay, red accent bar, headline (*"Encontre, anuncie e gerencie veículos com uma experiência simples e segura."*), and three trust badges (*Anúncios verificados*, *Variedade de veículos*, *Experiência prática*).

2. **Updated Login Page (`/entrar`)**:
   - Updated the "Criar conta" link to navigate to `/criar-conta` instead of directly defaulting to `/cadastrar`.
   - Replaced placeholder social buttons with official vector SVGs from Figma (Google 4-color path, Apple black silhouette, Facebook `#1877F2` blue circle badge).

3. **Design System & Iconography Hardening**:
   - Added official SVG icons to `apps/web/app/components/SellerIcons.tsx`:
     - `IconGoogle` (official 24x24 multicolor vector)
     - `IconApple` (official 18x25 vector)
     - `IconFacebook` (official 24x24 `#1877F2` badge with white glyph)
     - `IconStore` (storefront glyph for dealership)
     - `IconBolt` (lightning bolt glyph for trust badge)
     - `IconChevronRight` (navigation chevron)

4. **Audited Related Auth Routes**:
   - Verified `/cadastrar`, `/recuperar-senha`, `/vendedor/solicitacao`, and `/concessionaria/solicitacao` for consistent link targets and zero broken redirects.

---

## 2. Figma Fidelity & Visual Audit

| Element | Figma Specification (`2912:3` / `2912:113`) | Implementation in `/criar-conta` | Status |
| :--- | :--- | :--- | :---: |
| **Top Header** | `MarketplaceHeader` with logo, city picker ("Ipatinga, MG"), nav links, "Anunciar veículo" CTA | Reused canonical `MarketplaceHeader` | **MATCH** |
| **Pill Badge** | Background `#fdebec`, text `#e0151f`, text "Criar conta", font-semibold | `bg-[#fdebec] text-[#e0151f] text-[13px] font-semibold px-3.5 py-1 rounded-full` | **MATCH** |
| **Main Title** | "Como deseja usar a Feira de Carros?" (`#101827`, 28-30px, bold) | `text-[26px] sm:text-[30px] font-bold text-[#101827]` | **MATCH** |
| **Subtitle** | "Escolha o tipo de conta para continuar." (`#63738e`, 14-15px) | `text-[14px] sm:text-[15px] text-[#63738e]` | **MATCH** |
| **Option: Buyer** | `Sou comprador` / `Quero encontrar veículos e falar com vendedores.` (Default checked) | Radio button card, `IconUser`, default checked state | **MATCH** |
| **Option: Seller** | `Sou vendedor particular` / `Quero anunciar meus veículos e gerenciar anúncios.` | Radio button card, `IconCar`, toggleable | **MATCH** |
| **Option: Dealer** | `Sou concessionária` / `Quero cadastrar minha loja e gerenciar o estoque.` | Radio button card, `IconStore`, toggleable | **MATCH** |
| **Selected Style** | Red border `#e0151f`, soft pink background `#fff6f6`, red checkmark pill `#e0151f` | `border-[1.5px] border-[#e0151f] bg-[#fff6f6]`, checkmark circle | **MATCH** |
| **Unselected Style** | Gray border `#dde3ec`, white background, chevron `IconChevronRight` | `border-[#dde3ec] bg-white`, chevron indicator | **MATCH** |
| **Primary CTA** | `Continuar` button (`#e0151f`, hover `#c41217`, text-white, h-48px) | `bg-[#e0151f] hover:bg-[#c41217] text-white font-semibold h-[48px] rounded-[10px]` | **MATCH** |
| **Login Link** | "Já possui uma conta? Entrar" (Entrar in `#e0151f`, bold) | `<Link href="/entrar">Entrar</Link>` styled with `#e0151f` font-bold | **MATCH** |
| **Divider** | "ou continue com" with centered divider line | Centered divider line with `ou continue com` text | **MATCH** |
| **Social CTAs** | 3 buttons: Google (multicolor), Apple (black), Facebook (blue badge) | 3 buttons using exact official vector SVGs | **MATCH** |
| **Bottom Note** | "Um e-mail = uma conta. Escolha o perfil correto antes de continuar." with info icon | `IconInfo` + text disclosure at card footer | **MATCH** |
| **Sidecar Photo** | Approved Toyota Corolla hatchback photograph (`auth-side-car.png`) | Next.js `<Image src="/images/auth-side-car.png" fill priority />` | **MATCH** |
| **Sidecar Overlay** | Dark gradient tint overlay with red accent bar (`h-5px w-54px #e0151f`) | Gradient overlay + red accent pill bar | **MATCH** |
| **Sidecar Headline**| *"Encontre, anuncie e gerencie veículos com uma experiência simples e segura."* | Styled with `simples e segura.` in `#f42524` | **MATCH** |
| **Trust Badges** | 3 badges: Anúncios verificados, Variedade de veículos, Experiência prática | Badges in `#0b1424]/85` cards with `#38bdf8` icons | **MATCH** |

---

## 3. Automated Test Verification Results

### A. TypeScript Typecheck
- **Command:** `pnpm check-types`
- **Result:** **PASSED** (6/6 projects successful, 0 errors).

### B. Biome Lint & Format Check
- **Command:** `pnpm lint`
- **Result:** **PASSED** (434 files checked, 0 errors, no issues).

### C. Monorepo Unit Test Suite
- **Command:** `pnpm test`
- **Result:** **PASSED** (18/18 test files in `@feira/web`, 238/238 unit tests passed; 342/342 unit tests monorepo-wide).

### D. Production Build
- **Command:** `pnpm --filter @feira/web build`
- **Result:** **PASSED** (All 55 routes compiled successfully; `○ /criar-conta` prerendered as static route `3.43 kB`).

### E. Playwright E2E Automated Tests
- **Test File:** `apps/web/e2e/shared-auth-entry.spec.ts`
- **Browsers:** Chromium (Desktop) and Mobile Safari (iPhone 14)
- **Result:** **14/14 tests PASSED** in 14.7s.
  - `renders page elements, badge, headline, and default buyer selection` (Desktop & Mobile) — **PASSED**
  - `submitting default buyer selection navigates to /cadastrar` (Desktop & Mobile) — **PASSED**
  - `selecting seller particular and submitting navigates to /vendedor/solicitacao` (Desktop & Mobile) — **PASSED**
  - `selecting concessionária and submitting navigates to /concessionaria/solicitacao` (Desktop & Mobile) — **PASSED**
  - `clicking Entrar navigates to /entrar` (Desktop & Mobile) — **PASSED**
  - `in /entrar, clicking Criar conta navigates back to /criar-conta` (Desktop & Mobile) — **PASSED**
  - `social buttons display non-blocking demonstrative status` (Desktop & Mobile) — **PASSED**

---

## 4. Multi-Viewport Visual QA Evidence

Five viewports were captured and visually verified against Figma reference frames:
- **Desktop 1440px:** `screenshots/criar-conta/after_desktop_1440.png`
- **Desktop 1366px:** `screenshots/criar-conta/after_desktop_1366.png`
- **Tablet 768px:** `screenshots/criar-conta/after_tablet_768.png`
- **Mobile 430px:** `screenshots/criar-conta/after_mobile_430.png`
- **Mobile 390px:** `screenshots/criar-conta/after_mobile_390.png`

---

## 5. Architectural & Security Invariants

1. **Monorepo Boundary**:
   - Zero changes made to `apps/admin`.
   - All code contained within `apps/web` and shared packages.
2. **Frontend Simulation Only**:
   - No backend databases, ORMs, or real OAuth credentials added.
   - Social login buttons provide informative non-blocking demonstrative feedback and routing.
3. **AUTH-022 & Option 2 Global Email Uniqueness**:
   - Preserves separation between Buyer, Seller, and Dealer registration paths.
   - Communicates Option 2 explicitly to the user before they choose their role.
