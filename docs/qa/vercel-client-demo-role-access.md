# Feira de Carros — Vercel Client Demo Role Access

**Audit & Implementation Date**: 2026-11-19  
**Branch**: `fix/vercel-client-demo-role-access`  
**Base Commit**: `d5b397b4cc97737c699f98c7461d5d8d681fd592`  
**Target Vercel Project**: `feira-de-carros-preview`  
**Application**: `apps/web` (Next.js 15.5.28 App Router)  
**Security Boundary**: Strictly Frontend-Only, Fail-Closed Canonical Production, Isolated Preview Configuration  

---

## 1. Executive Summary

The Feira de Carros web application is a frontend-only implementation with simulated state management (Zustand and registered demo fixture tokens). Prior to this update, deployments on remote hostnames (including the dedicated Vercel preview project) were evaluated as public production traffic by `isProductionEnvironment()`. Because real cryptographic session services and backend databases are not yet integrated, protected routes failed closed unconditionally, preventing the client from evaluating Buyer, Seller, and Dealership screens.

This change implements an explicit, trusted **Client Demo Preview Mode** scoped strictly to the dedicated Vercel preview deployment. In preview mode, registered demo fixture sessions are permitted, enabling full role navigation while maintaining strict fail-closed protection for canonical production.

---

## 2. Required Preview Environment Configuration

To activate the client demo preview mode on the dedicated Vercel preview project (`feira-de-carros-preview`), the following environment variables must be configured in Vercel project settings:

| Environment Variable | Target Scope | Required Value | Purpose |
| :--- | :--- | :--- | :--- |
| `FEIRA_CLIENT_DEMO_PREVIEW_MODE` | Preview (and Development) | `"true"` | Private server-side flag authorizing Edge Middleware and session verification to recognize registered demo fixtures. |
| `NEXT_PUBLIC_FEIRA_CLIENT_DEMO_PREVIEW_MODE` | Preview (and Development) | `"true"` | Client-side inlined flag permitting browser-level simulation helpers and displaying the discreet demo banner. |

> [!IMPORTANT]
> **Never set these variables in the Production environment.**  
> If deployed to canonical production domains (`feiradecarros.com.br`, `www.feiradecarros.com.br`, `app.feiradecarros.com.br`), the application enforces **Canonical Production Domain Immunity**: it unconditionally ignores these variables and fails closed, rejecting all mock tokens and demo logins.

---

## 3. Architecture & Security Invariants

1. **Server-Side Authorization Boundary**:
   - Preview mode is controlled strictly by private server-side configuration (`process.env.FEIRA_CLIENT_DEMO_PREVIEW_MODE === 'true'`).
   - Request cookies (e.g. `fdc_runtime_env`), headers (e.g. `x-fdc-test-env`), and query parameters are **never** trusted and cannot activate preview mode.
2. **Canonical Production Domain Immunity**:
   - `isCanonicalProductionDomain(hostname)` inspects the host. If the request originates from `feiradecarros.com.br` or its subdomains, `isClientDemoPreviewEnvironment()` returns `false` unconditionally.
3. **Fail-Closed Session Verification**:
   - On production without the preview flag, `verifyWebSession()` strictly returns `reason: 'PRODUCTION_AUTH_FAIL_CLOSED'`.
   - On the preview deployment, `verifyWebSession()` validates tokens against `REGISTERED_FIXTURE_SESSIONS` with exact matching. Fabricated, tampered, or unregistered tokens are rejected with `INVALID_SESSION_TOKEN`.
4. **Role-Specific Edge Middleware Enforcement**:
   - Buyer sessions cannot access Seller (`/vendedor/*`) or Dealer (`/concessionaria/*`) portals.
   - Seller sessions cannot access Buyer (`/conta`) or Dealer portals.
   - Dealer sessions cannot access Seller or Buyer portals.
   - Suspended accounts are redirected to `/entrar?status=suspensa`.
   - Pending accounts are routed to their respective application status pages.
5. **No Admin Exposure**:
   - Admin routes and staff identities (`admin@feiradecarros.com.br`) remain strictly excluded from the customer website login shortcuts.

---

## 4. Client Review Experience & Persona Shortcuts

### 4.1 Discreet Demo Banner
On preview deployments, a non-intrusive top banner is displayed across all pages:
> **Ambiente de demonstração — dados fictícios** • Simulação completa de navegação para Comprador, Vendedor e Concessionária

### 4.2 Three Distinct Customer Personas on `/entrar`
The login screen (`/entrar`) provides three clearly labeled, high-contrast demo account shortcut cards:

1. **Comprador**:
   - Name: `Carlos Eduardo Mendes`
   - Email: `comprador@exemplo.com.br`
   - Password: `123456`
   - Destination: `/conta` (Buyer Dashboard, Favorites, Saved Searches, Messages)
2. **Vendedor Particular**:
   - Name: `Marcos Vinícius Silva`
   - Email: `vendedor@exemplo.com.br`
   - Password: `123456`
   - Destination: `/vendedor/anuncios` (Listings Dashboard, 5-Step Wizard, Payments, Messages)
3. **Concessionária**:
   - Trade Name: `Líder Seminovos`
   - Email: `contato@liderveiculos.com.br`
   - Password: `123456`
   - Destination: `/concessionaria/anuncios` (Fleet Inventory, Vehicle Creation, Public Showroom)

Clicking any card automatically populates the fixture credentials and activates the role-appropriate simulation.

---

## 5. Verification & Test Evidence

### 5.1 Playwright E2E Test Suite (`e2e/role-based-navigation.spec.ts`)
- **Total Tests**: 24 passed (24/24)
- **Browsers**: Chromium (Desktop) and Mobile Safari (iPhone 14)
- **Scenarios Covered**:
  - Guest visitor fail-closed route guards
  - Buyer journey: login, role badge, header identity, navigation & clean logout
  - Seller journey: login, role badge, header identity, listings wizard & cross-role protection
  - Dealer journey: login, fleet inventory, showroom & cross-role protection
  - Mobile drawer menu role navigation
  - Session refresh persistence
  - Stale browser storage without cookie fails closed to guest
  - Invalid/tampered cookie with stale storage fails closed to guest
  - Cookie role and stored account role mismatch fails closed
  - Status-aware navigation for pending Seller and Dealer
  - Navigation reliability: direct URLs, browser back, and refresh
  - Client review experience: 3 persona shortcuts on `/entrar`

### 5.2 Unit & Security Suites (`pnpm test`)
- **Total Tests**: 359 passed across 32 test files (246 passed in `@feira/web`).
- **Security Hardening (`security-request-hardening.test.ts`)**:
  - `isClientDemoPreviewEnvironment` enables preview mode when `FEIRA_CLIENT_DEMO_PREVIEW_MODE=true`.
  - Registered fixture verification succeeds under preview mode.
  - Canonical production domains (`feiradecarros.com.br`, `www.feiradecarros.com.br`) fail closed unconditionally even when preview variables are present.
  - Ordinary production without preview variables strictly rejects mock authentication with `PRODUCTION_AUTH_FAIL_CLOSED`.

### 5.3 Static Analysis & Build
- **Biome Linter (`pnpm lint`)**: 439 files checked, 0 errors, 0 warnings.
- **TypeScript Check (`pnpm check-types`)**: 6 package tasks successful, 0 type errors.
- **Production Next.js Build (`pnpm --filter @feira/web build`)**: 56 static and dynamic routes compiled cleanly.

---

## 6. Known Scope & Limitations

1. **Frontend-Only**: No backend database, microservices, or ORM queries are executed.
2. **Ephemeral Simulation**: State changes (listing edits, draft submissions, photo reordering) persist in client browser memory/`localStorage` for the active session.
3. **Simulated Payments**: PIX and Credit Card checkouts are visual simulations and do not process real monetary transactions.
4. **Simulated Communications**: Lead messages and chats are stored locally in Zustand and do not send real SMS, WhatsApp, or email notifications.
