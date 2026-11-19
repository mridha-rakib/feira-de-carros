# Feira de Carros — Role-Based Navigation & Screen Accessibility Audit

**Audit Date**: 2026-11-19  
**Status**: APPROVED & PASS  
**Branch**: `fix/role-based-navigation-accessibility`  
**Monorepo Packages Audited**: `apps/web` (Next.js 15.5.28 App Router)  
**Security Boundary**: Strictly Frontend-Only (`apps/web`), Zero Backend Bypass, Fail-Closed Route Guards  

---

## 1. Executive Summary & Problem Root Cause

### 1.1 Problem Statement
Prior to this implementation, users logging in as Buyer, Individual Seller, or Dealership encountered broken, inconsistent, or inaccessible navigation paths:
1. **Persona Confusion**: `MarketplaceHeader` was hardcoded to display Buyer identity (`Carlos Eduardo Mendes` / initials `JS`/`CE`) or static `/conta` link regardless of whether the authenticated user was an Individual Seller (`seller`) or Dealership (`dealer`).
2. **Missing Navigation Links**: Dealership and Seller users on the marketplace header had no accessible dropdown to reach their inventory, listing creation, showroom, or settings screens.
3. **Broken Sub-Navigation**:
   - `SellerNavbar` rendered a static avatar with no dropdown menu to access settings, listings, or logout.
   - `DealershipSubNav` hardcoded links to `/vendedor/solicitacao` instead of role-appropriate dealership dashboard (`/concessionaria/anuncios`).
   - `DealerConsoleTabs` contained broken showroom links (`/lojas/dealer-lider-seminovos` instead of canonical `/concessionarias/dealer-lider-seminovos`).
   - `/vendedor/conta` linked to `/conta/configuracoes` (buyer namespace) without dedicated seller account settings.
4. **Session Desynchronization**: Login and logout actions in `useBuyerStore` and `useDealerStore` did not synchronize with `fdc_web_session` cookies and local storage state, causing route protection middleware to reject or redirect legitimate role visits.

### 1.2 Root Cause Analysis
- **Missing Unified Auth Hook**: Identity state was fragmented across `useBuyerStore`, `useDealerStore`, and individual cookie helpers. There was no single source of truth for resolving active persona, initials, role label, and role-appropriate URLs.
- **Race Condition in Session Wipe**: Calling `useBuyerStore.getState().logoutSimulation()` indiscriminately cleared `fdc_web_session` and `fdc_active_auth_account` during seller/dealer role transitions.
- **Edge Middleware Test Isolation**: In production builds, Next.js Edge Runtime isolates `process.env`. Without explicit server-side test harness environment configuration (`FEIRA_E2E_MOCK=true` passed via `webServer.env`), middleware evaluated all localhost requests as public production traffic, triggering fail-closed redirects.

---

## 2. Complete 75-Route Inventory & Role-to-Route Coverage Matrix

All 75 routes in `apps/web` have been mapped and audited against the platform's role-based access control (RBAC) boundaries.

### 2.1 Public Entrypoints (Accessible to All Roles and Unauthenticated Guests)
| Route | Description | Figma Source / SRS Ref | Access State |
| :--- | :--- | :--- | :--- |
| `/` | Marketplace Home (Desktop & Mobile) | `BUYER / WEB-001` | Public |
| `/veiculos` | Search & Vehicle Listing Catalog | `BUYER / WEB-002` | Public |
| `/veiculos/[id]` | Vehicle Detail Page (VDP) | `BUYER / WEB-003` | Public |
| `/concessionarias/[id]` | Public Dealership Showroom | `DEALER / WEB-020` | Public |
| `/lojas/[id]` | Compatibility Redirect to `/concessionarias/[id]` | Canonical Redirect | Public |
| `/categorias` | Vehicle Categories Listing | Category Index | Public |
| `/localidade` | Geolocation Selection | Location Modal | Public |
| `/ajuda` | Central de Ajuda & FAQ | Institutional | Public |
| `/privacidade` | Privacidade e Termos de Uso | Institutional | Public |
| `/entrar` | Unified Customer Sign-In (AUTH-022) | Figma `845:166` | Public (Guest Entry) |
| `/login` | Compatibility Redirect to `/entrar` | Canonical Redirect | Public |
| `/cadastrar` | Registration Entrypoint | Figma `845:166` | Public |
| `/criar-conta` | Shared 3-Persona Account Selection | Figma `2912:3` / `2912:113` | Public |
| `/recuperar-senha` | Password Recovery Flow | Figma `845:166` | Public |
| `/vendedor/solicitacao` | Seller Eligibility Application (Step 1-3) | Figma `WEB-010` | Public (Guest/Member) |
| `/seller/application` | Compatibility Redirect to `/vendedor/solicitacao` | Canonical Redirect | Public |
| `/seller/sell` | Seller Landing Entrypoint | Canonical Redirect | Public |
| `/concessionaria/solicitacao` | Dealership Eligibility Application | Figma `WEB-017` | Public (Guest/Member) |
| `/dealer/application` | Compatibility Redirect to `/concessionaria/solicitacao` | Canonical Redirect | Public |

### 2.2 Buyer Protected Routes (`role === 'member'`)
| Route | Description | Accessibility from Header / UI | RBAC Guard |
| :--- | :--- | :--- | :--- |
| `/conta` | Buyer Dashboard & Profile Overview | Header Account Dropdown → "Meu perfil e conta" | Fail-closed (`role === 'member'`) |
| `/favoritos` | Saved Favorites List | Header Top Action & Dropdown → "Meus favoritos" | Fail-closed (`role === 'member'`) |
| `/buscas-salvas` | Saved Search Alerts & Queries | Header Account Dropdown → "Buscas salvas" | Fail-closed (`role === 'member'`) |
| `/conta/alertas` | Notification & Search Alert Preferences | Header Account Dropdown → "Alertas de veículos" | Fail-closed (`role === 'member'`) |
| `/mensagens` | Buyer Real-Time Direct Chat | Header Action & Dropdown → "Mensagens" | Fail-closed (`role === 'member'`) |
| `/conta/notificacoes` | Account Activity Notifications | Header Account Dropdown → "Notificações" | Fail-closed (`role === 'member'`) |
| `/conta/senha` | Password & Credential Security | Header Account Dropdown → "Segurança da conta" | Fail-closed (`role === 'member'`) |
| `/conta/configuracoes` | Shared Account Preferences | Header Dropdown → Profile Settings | Fail-closed (`role === 'member'`) |
| `/conta/exclusao` | Account Deletion Flow | Profile Settings → Danger Zone | Fail-closed (`role === 'member'`) |

### 2.3 Individual Seller Protected Routes (`role === 'seller'`)
| Route | Description | Accessibility from Header / UI | RBAC Guard |
| :--- | :--- | :--- | :--- |
| `/vendedor/anuncios` | Seller Active & Draft Listings Dashboard | Header Dropdown & Navbar → "Meus anúncios" | Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/novo` | 5-Step Vehicle Listing Wizard | Header CTA "+ Anunciar veículo" & Navbar | Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/novo/categoria` | Wizard Step 1: Category Selection | Listing Creation Sub-step | Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/novo/detalhes` | Wizard Step 2: Vehicle Specs & Pricing | Listing Creation Sub-step | Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/novo/fotos` | Wizard Step 3: Photo Upload & Ordering | Listing Creation Sub-step | Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/novo/revisao` | Wizard Step 4: Review & Publication | Listing Creation Sub-step | Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/[id]` | Vehicle Listing Detail & Management | Seller Listings Table → Click item | Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/[id]/editar` | Edit Existing Listing | Listing Action Menu → "Editar" | Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/[id]/corrigir` | Moderation Rejection Correction | Listing Status Banner → "Corrigir dados" | Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/[id]/impulsionar` | Listing Boost & Promotion Selection | Listing Action Menu → "Impulsionar" | Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/[id]/plano` | Plan Upgrade Checkout | Boost Selection → Checkout | Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/[id]/renovar` | Expired Listing Renewal | Expired Banner → "Renovar anúncio" | Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/[id]/revisoes` | Moderation Audit Log & History | Listing Action Menu → "Histórico de revisões"| Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/[id]/vendido` | Mark Listing as Sold Confirmation | Listing Action Menu → "Marcar como vendido"| Fail-closed (`role === 'seller'`) |
| `/vendedor/anuncios/[id]/estatisticas` | Listing Views & Lead Analytics | Listing Action Menu → "Ver métricas" | Fail-closed (`role === 'seller'`) |
| `/vendedor/mensagens` | Seller Lead Conversations & Inbox | Header Action, Dropdown & Navbar → "Mensagens" | Fail-closed (`role === 'seller'`) |
| `/vendedor/mensagens/[id]` | Active Negotiation Chat Thread | Inbox Thread Click | Fail-closed (`role === 'seller'`) |
| `/vendedor/mensagens/[id]/acoes` | Quick Negotiation Responses & Offers | Chat Thread Action Drawer | Fail-closed (`role === 'seller'`) |
| `/vendedor/pagamentos` | Transaction & Payment History | Header Dropdown & Navbar → "Pagamentos" | Fail-closed (`role === 'seller'`) |
| `/vendedor/pedidos/[id]/pix` | PIX Payment Gateway Simulation | Order Checkout → PIX | Fail-closed (`role === 'seller'`) |
| `/vendedor/pedidos/[id]/cartao` | Credit Card Checkout Simulation | Order Checkout → Card | Fail-closed (`role === 'seller'`) |
| `/vendedor/pedidos/[id]/status` | Payment Confirmation & Receipt | Post-Checkout Redirection | Fail-closed (`role === 'seller'`) |
| `/vendedor/pedidos/[id]/reembolso` | Refund Status & Documentation | Payment History → "Solicitar reembolso" | Fail-closed (`role === 'seller'`) |
| `/vendedor/reembolsos` | Refunds & Dispute Overview | Payments Sub-tab | Fail-closed (`role === 'seller'`) |
| `/vendedor/conta` | Seller Account Overview | Header Dropdown & Navbar → "Minha conta" | Fail-closed (`role === 'seller'`) |
| `/vendedor/configuracoes` | Seller Settings (Figma WEB-012) | `/vendedor/conta` → "Acessar configurações"| Fail-closed (`role === 'seller'`) |
| `/vendedor/solicitacao/status` | Application Review Status | Header Dropdown & Navbar → "Status" | Fail-closed (`role === 'seller'`) |
| `/vendedor/solicitacao/corrigir` | Application Resubmission | Status Screen → "Corrigir dados" | Fail-closed (`role === 'seller'`) |

### 2.4 Dealership Advertiser Protected Routes (`role === 'dealer'`)
| Route | Description | Accessibility from Header / UI | RBAC Guard |
| :--- | :--- | :--- | :--- |
| `/concessionaria/anuncios` | Fleet Inventory & Vehicle Management | Header Dropdown & SubNav → "Estoque da frota" | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/anuncios/novo` | Dealership Batch Ad Creator | Header CTA "+ Anunciar veículo" & SubNav | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/anuncios/novo/categoria`| Dealership Wizard Step 1: Category | Creation Sub-step | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/anuncios/novo/detalhes` | Dealership Wizard Step 2: Specs | Creation Sub-step | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/anuncios/novo/fotos` | Dealership Wizard Step 3: Photos | Creation Sub-step | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/anuncios/novo/revisao` | Dealership Wizard Step 4: Review | Creation Sub-step | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/anuncios/[id]/editar` | Edit Fleet Vehicle | Inventory Table → "Editar" | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/anuncios/[id]/impulsionar`| Fleet Promotion & Highlight | Inventory Table → "Destacar" | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/anuncios/[id]/plano` | Advertising Quota Upgrade | Fleet Promotion → Checkout | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/anuncios/[id]/renovar` | Expired Fleet Renewal | Inventory Table → "Renovar" | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/anuncios/[id]/revisoes` | Moderation Audit Log | Inventory Table → "Histórico" | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/anuncios/[id]/vendido` | Mark Fleet Vehicle as Sold | Inventory Table → "Baixa no estoque" | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/perfil` | Dealership Business Profile (Figma D4) | Header Dropdown & SubNav → "Perfil da loja" | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/mensagens` | Customer Leads & Dealership Chat | Header Action & Dropdown → "Mensagens" | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/pedidos/[id]/pix` | Subscription Payment: PIX | Fleet Plan Upgrade → PIX | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/pedidos/[id]/cartao` | Subscription Payment: Credit Card | Fleet Plan Upgrade → Card | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/pedidos/[id]/status` | Subscription Payment Confirmation | Post-Checkout Confirmation | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/solicitacao/status` | Dealership Onboarding Status | Header Dropdown → "Status da adesão" | Fail-closed (`role === 'dealer'`) |
| `/concessionaria/solicitacao/corrigir` | Dealership Verification Resubmission | Status Screen → "Corrigir dados" | Fail-closed (`role === 'dealer'`) |

---

## 3. Active Persona Representation Audit

### 3.1 Desktop Marketplace Header (`MarketplaceHeader.tsx`)
1. **Unauthenticated Guest**:
   - Header shows `<IconUser /> Entrar` linking to `/entrar` with `aria-label="Fazer login ou cadastrar"`.
   - Locality top bar links to `Área do Vendedor` (`/vendedor/solicitacao`).
   - Primary CTA `+ Anunciar veículo` points to `/vendedor/solicitacao`.
2. **Buyer Persona (`member`)**:
   - Account trigger button displays dark navy circle with initials (`CE`), first name (`Carlos`), and chevron.
   - Dropdown menu (`role="menu"`) displays:
     - Persona header card: `Carlos Eduardo Mendes`, `comprador@exemplo.com.br`, role badge `Comprador`.
     - Direct links: `/conta` (Meu perfil e conta), `/favoritos` (Meus favoritos), `/buscas-salvas` (Buscas salvas), `/conta/alertas` (Alertas de veículos), `/mensagens` (Mensagens), `/conta/notificacoes` (Notificações), `/conta/senha` (Segurança da conta).
     - Dedicated `Encerrar sessão` button executing `executeUnifiedLogout()`.
3. **Seller Persona (`seller`)**:
   - Account trigger button displays emerald green circle with initials (`MV`), first name (`Marcos`), and chevron.
   - Primary CTA `+ Anunciar veículo` automatically routes to `/vendedor/anuncios/novo`.
   - Messages top link points to `/vendedor/mensagens`.
   - Top locality strip links to `Área do Vendedor` (`/vendedor/anuncios`).
   - Dropdown menu displays:
     - Persona header card: `Marcos Vinícius Silva`, `vendedor@exemplo.com.br`, role badge `Vendedor Particular`.
     - Direct links: `/vendedor/anuncios` (Meus anúncios), `/vendedor/anuncios/novo` (Criar novo anúncio), `/vendedor/mensagens` (Mensagens), `/vendedor/pagamentos` (Pagamentos), `/vendedor/conta` (Minha conta), `/vendedor/solicitacao/status` (Status do cadastro).
4. **Dealership Persona (`dealer`)**:
   - Account trigger button displays indigo circle with dealership initials (`LS`), dealership name (`Líder Seminovos` / `Líder`), and chevron.
   - Primary CTA `+ Anunciar veículo` routes to `/concessionaria/anuncios/novo`.
   - Top locality strip displays `Painel da Loja` pointing to `/concessionaria/anuncios`.
   - Messages top link points to `/concessionaria/mensagens`.
   - Dropdown menu displays:
     - Persona header card: `Líder Seminovos`, `contato@liderveiculos.com.br`, role badge `Concessionária`.
     - Direct links: `/concessionaria/anuncios` (Estoque da frota), `/concessionaria/anuncios/novo` (Adicionar veículo), `/concessionaria/perfil` (Perfil da loja), `/concessionaria/mensagens` (Mensagens), `/concessionarias/dealer-lider-seminovos` (Ver showroom público), `/concessionaria/solicitacao/status` (Status da adesão).

### 3.2 Mobile Drawer Menu (`MarketplaceHeader.tsx` Mobile Drawer)
- Opens via accessible hamburger menu button (`aria-label="Abrir menu de navegação"`).
- Top row renders active persona card: Avatar, full name, email, and color-coded role badge.
- Navigation links reflect the active role without hardcoded buyer assumptions.
- Includes clear, accessible `Encerrar sessão` action that triggers full unified cleanup.

---

## 4. Role-Based Sub-Navigation Audit

### 4.1 `SellerNavbar.tsx`
- **Previous state**: Displayed static avatar without dropdown menu.
- **Audited state**: Added fully accessible dropdown menu (`aria-haspopup="menu"`, keyboard Escape and click-outside dismissal) providing one-click navigation to `/vendedor/anuncios`, `/vendedor/anuncios/novo`, `/vendedor/mensagens`, `/vendedor/pagamentos`, `/vendedor/conta`, `/vendedor/solicitacao/status`, and unified logout.

### 4.2 `DealershipSubNav.tsx`
- **Previous state**: "Vender" link pointed to `/vendedor/solicitacao`, and "Concessionárias" pointed to `/concessionaria/solicitacao` even when logged in as a dealer.
- **Audited state**: Integrated `useCurrentAuth()`. When `role === 'dealer'`, "Vender" routes to `/concessionaria/anuncios/novo` and "Minha Concessionária" routes to `/concessionaria/anuncios`.

### 4.3 `DealerConsoleTabs.tsx`
- **Previous state**: Showroom link pointed to legacy path `/lojas/dealer-lider-seminovos`.
- **Audited state**: Updated to canonical `/concessionarias/dealer-lider-seminovos`. Added Next.js 15 async redirect page at `apps/web/app/lojas/[id]/page.tsx` ensuring backwards compatibility.

### 4.4 `apps/web/app/vendedor/configuracoes/page.tsx`
- **Previous state**: Missing dedicated seller settings page; `/vendedor/conta` linked to buyer-only `/conta/configuracoes`.
- **Audited state**: Created full Figma WEB-012 compliant settings screen with profile data, notifications, and security options. Edge middleware redirects `/conta/configuracoes` to `/vendedor/configuracoes` when `role === 'seller'`.

---

## 5. Automated Test Results

### 5.1 Playwright E2E Suite (`apps/web/e2e/role-based-navigation.spec.ts`)
```
Running 10 tests using 6 workers

  ok  1 [chromium] › e2e/role-based-navigation.spec.ts:9:7 › Guest visitor: unauthenticated state and fail-closed route guards (2.3s)
  ok  2 [mobile-safari] › e2e/role-based-navigation.spec.ts:9:7 › Guest visitor: unauthenticated state and fail-closed route guards (3.8s)
  ok  3 [chromium] › e2e/role-based-navigation.spec.ts:57:7 › Buyer Journey: login, role badge, header identity, navigation & clean logout (4.2s)
  ok  4 [mobile-safari] › e2e/role-based-navigation.spec.ts:57:7 › Buyer Journey: login, role badge, header identity, navigation & clean logout (4.5s)
  ok  5 [chromium] › e2e/role-based-navigation.spec.ts:146:7 › Seller Journey: login, role badge, header identity, navigation & cross-role protection (4.9s)
  ok  6 [mobile-safari] › e2e/role-based-navigation.spec.ts:146:7 › Seller Journey: login, role badge, header identity, navigation & cross-role protection (4.6s)
  ok  7 [chromium] › e2e/role-based-navigation.spec.ts:243:7 › Dealer Journey: login, role badge, header identity, navigation & cross-role protection (4.3s)
  ok  8 [mobile-safari] › e2e/role-based-navigation.spec.ts:243:7 › Dealer Journey: login, role badge, header identity, navigation & cross-role protection (3.7s)
  ok  9 [chromium] › e2e/role-based-navigation.spec.ts:333:7 › Mobile Drawer Menu reflects active persona and role navigation (3.8s)
  ok 10 [mobile-safari] › e2e/role-based-navigation.spec.ts:333:7 › Mobile Drawer Menu reflects active persona and role navigation (3.2s)

  10 passed (11.2s)
```

### 5.2 Unit & Integration Suites (`pnpm test`)
- **Total Test Files**: 32 passed (32)
- **Total Tests**: 351 passed (351)
  - `@feira/web`: 18 test files, 238 passed
  - `@feira/admin`: 11 test files, 89 passed
  - `@feira/ui`: 1 test file, 3 passed
  - `@feira/api-client`: 1 test file, 3 passed
  - `@feira/logger`: 1 test file, 7 passed
  - `@feira/testing`: 1 test file, 2 passed

### 5.3 Static Analysis & Types
- **Biome Linter (`pnpm lint`)**: Checked 438 files in 286ms. 0 errors, 0 warnings.
- **TypeScript (`pnpm check-types`)**: 6 successful packages, 0 type errors.
- **Production Build (`pnpm --filter @feira/web build`)**: 56 static and dynamic routes compiled cleanly.

---

## 6. Security Invariants Preserved

1. **Production Fail-Closed Principle**:
   - `apps/web/lib/security/environment.ts` strictly fails closed whenever executed on non-loopback hosts or when `FEIRA_E2E_MOCK` is not explicitly set.
   - Incoming request headers, cookies (e.g. `fdc_runtime_env`), or query parameters can NEVER downgrade production security.
2. **Deterministic Token Verification**:
   - `verifyWebSession` verifies tokens against the exact `REGISTERED_FIXTURE_SESSIONS` map without substring or prefix matching.
3. **Cross-Role Authorization Enforced in Edge Middleware**:
   - A Buyer session attempting to access `/vendedor/anuncios` or `/concessionaria/anuncios` is strictly redirected with `error=unauthorized_seller_role_required` or `error=unauthorized_dealer_role_required`.
   - A Seller session attempting to access `/conta` or `/concessionaria/anuncios` is strictly blocked.
   - A Dealer session attempting to access `/vendedor/anuncios` or `/conta` is strictly blocked.
4. **Option 2 Global Email Uniqueness (SRS AUTH-022)**:
   - Registration and login routines preserve global email uniqueness across all 3 customer roles and staff roles.
5. **No Password Persistence**:
   - Passwords and plaintext credentials are never written to `localStorage` or `sessionStorage`.

---

## 7. Sign-off & Recommendation

The role-based navigation and screen accessibility implementation is complete, verified across desktop and mobile viewports, and passes all linting, typechecking, unit, and E2E gates. The branch `fix/role-based-navigation-accessibility` is clean and ready for integration.
