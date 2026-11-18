# Buyer WEB-001 Marketplace Homepage Visual Correction QA Report

## Executive Summary
This document records the visual corrections performed on the Buyer Marketplace Homepage (`/`, `WEB-001`) to achieve high-fidelity alignment with the approved canonical Figma source of truth.

- **Route Under Test**: `/`
- **Target Audience**: Public buyers, vehicle shoppers
- **Canonical Figma File**: `JlRZIGImV7rRROPZndv6NT`
- **Canonical Frames**:
  - Desktop: `733:3` (`1437:2387` active composition `1440x1356`, `752:31`/`1437:2364` navbar `1440x104`, `1437:2543` footer `1440x290`)
  - Mobile: `733:51` (`1437:2571` active composition `390x1995`, `752:50` navbar `390x125`, `1437:2708` footer `390x355`)
- **Git Branch**: `feat/buyer-b1-discovery-search`
- **Monorepo Boundary**: Strictly frontend (`apps/web`). `apps/admin`, backend, and seller/dealer packages have 0 modifications.

---

## 1. Visual Gap Analysis & Applied Corrections

| Component / Section | Canonical Figma Design | Previous Implementation | Visual Correction Applied |
|---|---|---|---|
| **Top Locality Strip** | 15px dark navy (`#101d34`) bar with 10px white `Ipatinga, MG` and pin icon | 26px height bar with extra non-Figma links | Reduced to exact `h-[15px]` on desktop, 10px white typography with modal interaction preserved |
| **Main Header Navbar** | 89px height (total 104px), 181x29px logo, 355x46px search input (`rounded-[10px] bg-[#f5f7fb]`), 12px category nav links, 162x44px red CTA button (`#e0151f`) | 68/76px variable height, oversized search box (380-420px), non-Figma paddings | Aligned to exact 89px desktop navbar height (total 104px), 181x29px brand logo, 355x46px search box, 162x44px CTA button |
| **Mobile Header** | 125px total height: Top row (menu, logo, heart, messages); bottom sub-row (pin icon + `Ipatinga, MG`) | Single crowded bar with wrap and extra buttons | Two-row responsive mobile header: 75px top row + 44px bottom locality sub-row with city selector |
| **Hero Section** | Desktop 370px, Mobile 245px. Gradient overlay `w-[1100px] h-[370px] bg-gradient-to-r from-[rgba(9,18,33,0.92)] via-[58%] via-[rgba(9,18,33,0.59)] to-[rgba(9,18,33,0)]`. 49px font-semibold heading with red `segurança` | Unconstrained padding, normal flow without fixed height, misaligned gradient | Exact `h-[370px]` desktop and `h-[245px]` mobile heights with precise Figma multi-stop gradient overlays and 49px heading typography |
| **Search Box Overlay** | Floating card overlapping the bottom of the hero (starts at y=330px, overlapping bottom 40px of hero). 1296px max-width, white rounded-14px container, 3 tabs (Carros, Motos, Caminhões), 4 select inputs (h=43px, labels 12px), 205x47px search button | Positioned below hero in normal flow without floating overlap, non-Figma select proportions | Applied negative margin overlap (`-mt-10` desktop, `-mt-9` mobile), exact 1296px max-width container, 164x38px category tabs, 43px filter inputs, and 205x47px red search CTA |
| **Trust Indicators** | 4 items: Anunciantes Locais, Negociação Transparente, Variedade de veículos, Atendimento ágil with 48px round `#fff1f0` icons in red `#e0151f` | Inconsistent spacing and icon sizes | Standardized to 48px circular icon badges with 14/15px bold titles and 11/12px muted descriptions |
| **Featured Vehicles** | "Destaques da semana" + `DEMO DATA` tag + "Ver todos →". 4-column desktop grid of 306x345px cards with 170px image, 20px price `#e0151f` | Cards with variable image aspect ratios and non-Figma heights | Aligned `PublicVehicleCard` to 170px image height, 20px bold price in `#e0151f`, clean badges and favorite heart toggle |
| **Category Cards** | "Encontre por categoria": 3 cards (Carros, Motos, Caminhões) with 48px rounded icon boxes and right chevrons | Included extraneous "Tipos de carroceria populares" row not present in canonical WEB-001 | Removed out-of-Figma body type section from homepage (belongs on `/categorias`); 3 category cards styled with 110px height |
| **Footer** | 290px height, background `#101d34`, 3-column layout (Brand info, Explorar, Informações), divider `#3d4c65`, disclaimer, copyright and DEMO DATA tag | 4-column footer with non-canonical columns | Aligned to exact 3-column canonical footer (`FDC / Public footer / ADM-016`), divider, and legal disclaimer |

---

## 2. Multi-Viewport Visual Verification Evidence

All screenshots captured directly via Playwright in the project environment:

### Desktop (1440px)
- **Figma Reference**: Canonical frame `733:3` (`1437:2387`)
- **Before Screenshot**: `screenshots/homepage/before_1440.png`
- **After Screenshot**: `screenshots/homepage/after_1440.png`
- **Verification**: Floating card sits precisely across the hero boundary with multi-stop dark gradient; 4-card vehicle grid renders at 1440px max width; 3-column footer matches ADM-016.

### Desktop Compact (1366px)
- **Before Screenshot**: `screenshots/homepage/before_1366.png`
- **After Screenshot**: `screenshots/homepage/after_1366.png`
- **Verification**: Smooth responsive scaling without horizontal overflow; quick search form wraps cleanly within container padding.

### Tablet (768px)
- **Before Screenshot**: `screenshots/homepage/before_768.png`
- **After Screenshot**: `screenshots/homepage/after_768.png`
- **Verification**: 2x2 featured vehicle grid; 2-column search form; 4 trust indicator tiles evenly distributed.

### Mobile Large (430px)
- **Before Screenshot**: `screenshots/homepage/before_430.png`
- **After Screenshot**: `screenshots/homepage/after_430.png`
- **Verification**: Stacked mobile layout; 2-row mobile header; floating search card fits viewport with 16px margins; horizontal vehicle cards with 142x117px thumbnails.

### Mobile Standard (390px)
- **Figma Reference**: Canonical frame `733:51` (`1437:2571`)
- **Before Screenshot**: `screenshots/homepage/before_390.png`
- **After Screenshot**: `screenshots/homepage/after_390.png`
- **Verification**: Pixel-accurate match with canonical Figma mobile layout: 125px navbar (75px icons row + 44px location sub-row), 245px mobile hero, stacked quick search, 4 horizontal vehicle cards, 3 category cards, 3-column mobile footer.

---

## 3. Automated Quality Gates

| Check | Tool | Result | Details |
|---|---|---|---|
| **Linting & Formatting** | Biome 1.9.4 | **PASS** | 369 files checked, 0 errors, 0 warnings |
| **Type Checking** | TypeScript 5.7.3 (`turbo check-types`) | **PASS** | 6/6 packages clean, 0 type errors |
| **Unit & Integration Tests** | Vitest 2.1.9 (`turbo test`) | **PASS** | 12/12 test suites, 126/126 unit tests passed |
| **Production Build** | Next.js 15.5.28 (`pnpm --filter @feira/web build`) | **PASS** | Static page generation 43/43, 0 build warnings |
| **End-to-End Tests** | Playwright (Chromium & Mobile Safari) | **PASS** | `home.spec.ts` & `buyer-b1.spec.ts` 12/12 passed |

---

## 4. Modified Files

1. `apps/web/app/components/MarketplaceHeader.tsx`: Desktop 15px top strip, 89px main navbar, 355x46px search input, 2-tier mobile header.
2. `apps/web/app/components/MarketplaceFooter.tsx`: Canonical 3-column footer matching Figma ADM-016 (`1437:2543`).
3. `apps/web/app/components/PublicVehicleCard.tsx`: Standardized card image height (170px desktop, 142x117px mobile thumbnail), price typography, and badges.
4. `apps/web/app/page.tsx`: Fixed hero heights (370px desktop, 245px mobile), multi-stop gradient overlay, floating search card overlap (`-mt-10`), standardized trust indicators and categories, removed non-Figma body type section.
5. `apps/web/e2e/buyer-b1.spec.ts`: Added responsive visibility filter for locality header chip check across desktop and mobile viewports.
