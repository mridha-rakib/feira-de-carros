# Feira de Carros — Admin Frontend Release Handoff & Architecture Baseline

**Date:** 16 November 2026  
**Repository:** `mridha-rakib/feira-de-carros`  
**Application:** `apps/admin` (Next.js 15 App Router, TypeScript strict, Biome, Tailwind CSS, Turborepo)  
**Release Pull Request:** [#3](https://github.com/mridha-rakib/feira-de-carros/pull/3)  
**Release Branch:** `feat/admin-final-qa-assets-icons`  
**Release Commit:** `bdfc90594f4dcf907198878dd25cd8c3984398b5`  
**Figma Source of Truth:** [`JlRZIGImV7rRROPZndv6NT`](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT)  
**Status:** Implemented, verified, and release-ready (frontend only; pending client/backend integration).

---

## 1. Executive Summary & Scope

The Feira de Carros Admin Dashboard frontend has completed all implementation batches (B1 through B9) and autonomous visual QA auto-fixes. It covers:
- **53 Approved Desktop Screens:** `ADM-D-001` through `ADM-D-053`
- **13 Approved Mobile Screens:** `ADM-M-001` through `ADM-M-013`
- **3 Administrator Self-Profile/Security Views:** Profile display, profile edit, security & password management
- **34 App Router Routes:** Zero broken routes, 100% buildable static & dynamic pages
- **Complete Test Suite:** 11 Vitest test files (89 tests) passing, Playwright E2E smoke and visual QA suites passing, Biome check 0 errors across 263 files, TypeScript 0 errors.

---

## 2. Screen & Route Coverage Matrix

### 2.1 Approved Desktop Screens (ADM-D-001 to ADM-D-053)

| Screen ID | Figma Node | Admin Route / Component | Batch | Functional Scope |
| :--- | :--- | :--- | :--- | :--- |
| `ADM-D-001` | `213:1146` | `/login` | B1 | Staff institutional authentication gate with role & redirect validation |
| `ADM-D-002` | `39:2` | `/` | B1 | Dashboard overview, 4 KPI cards, revenue chart, alerts panel, recent listings table |
| `ADM-D-003` | `39:76` | `/usuarios` | B3 | User accounts directory (22 synthetic users, multi-page pagination, LGPD masked documents) |
| `ADM-D-005` | `39:150` | `/vendedores` | B2 | Seller verification queue & approval/rejection decision drawer |
| `ADM-D-007` | `398:7891` | `/vendedores` (Dealership tab) | B2 | Dealership application evaluation & credential review |
| `ADM-D-009` | `398:8090` | `/usuarios` (Suspension modal) | B3 | Account suspension/blocking modal with required justification |
| `ADM-D-010` | `398:8289` | `/usuarios` (Dealership filter) | B3 | Dealership directory & linked fleet inventory overview |
| `ADM-D-012` | `39:224` | `/anuncios` | B2 | Listing inventory management, status filtering, and action controls |
| `ADM-D-014` | `208:1048` | `/anuncios` (Queue tab) | B2 | Vehicle listing approval queue & pending verification reviews |
| `ADM-D-015` | `208:1232` | `/anuncios` (Review drawer) | B2 | Vehicle approval/rejection with mandatory rejection feedback |
| `ADM-D-016` | `386:7965` | `/anuncios` (Compare modal) | B2 | Published revision diff vs newly submitted modifications |
| `ADM-D-017` | `398:8488` | `/anuncios` (History tab) | B2 | Audit history of listing state transitions and moderator actions |
| `ADM-D-018` | `386:7422` | `/anuncios` (New listing modal) | B2 | Assisted listing intake for individual sellers |
| `ADM-D-019` | `386:7603` | `/anuncios` (Edit modal) | B2 | Administrative listing corrections with revision locking |
| `ADM-D-020` | `386:7784` | `/anuncios` (Legacy intake) | B2 | Legacy listing migration intake with no-fee entitlement |
| `ADM-D-023` | `417:8747` | `/configuracoes/destaques` | B2 | Featured advertisement placements & homepage carousel allocation |
| `ADM-D-024` | `208:1416` | `/pagamentos` | B4A | Payment transactions log (Pix, Card, Cash) with filter bar |
| `ADM-D-025` | `225:1160` | `/pagamentos/[id]` | B4A | Transaction inspection drawer with gateway audit timestamps |
| `ADM-D-026` | `225:1381` | `/pagamentos/[id]/dinheiro` | B4A | Physical cash registration modal (Desktop Main Admin only) |
| `ADM-D-027` | `225:1602` | `/pagamentos/dinheiro` | B4A | Physical cash receipts journal and physical ledger balance |
| `ADM-D-028` | `225:1823` | `/reembolsos` | B4B | Customer refund requests queue (7-day legal cancellation window) |
| `ADM-D-029` | `237:1296` | `/reembolsos/[id]` | B4B | Refund decision preview & execution hold notice |
| `ADM-D-030` | `237:1492` | `/contestacoes` | B4B | Payment disputes & chargeback management registry |
| `ADM-D-031` | `237:1688` | `/relatorios` | B4B | Revenue metrics, breakdown table, and demo CSV export |
| `ADM-D-032` | `237:1884` | `/moderacao` | B5A | Moderation queue for user/listing reports (3 demonstrative cases) |
| `ADM-D-033` | `275:1474` | `/moderacao/[id]` | B5A | Report detail inspection with LGPD-masked reporter aliases |
| `ADM-D-034` | `275:1689` | `/moderacao/[id]/conversa` | B5A | Unilateral conversation excerpt (non-certified chat evidence) |
| `ADM-D-035` | `275:1904` | `/moderacao/[id]/decisao` | B5A | Fail-closed moderation decision simulation with 3 penalty tiers |
| `ADM-D-036` | `275:2119` | `/exclusao-contas` | B5B | Account deletion requests queue under LGPD Art. 18 |
| `ADM-D-037` | `290:1886` | `/exclusao-contas/[id]` | B5B | Deletion review panel with legal retention/anonymization checks |
| `ADM-D-038` | `290:2077` | `/equipe` | B6 | Internal staff accounts directory (Main Admin, Sales, Support) |
| `ADM-D-039` | `290:2268` | `/equipe/novo` | B6 | New staff account registration and role assignment form |
| `ADM-D-040` | `290:2459` | `/equipe/[id]/permissoes` | B6 | Staff fine-grained RBAC matrix (12 operations DENY_PENDING) |
| `ADM-D-041` | `306:2567` | `/correcoes-clientes` | B7A | Customer data correction requests queue |
| `ADM-D-042` | `306:2770` | `/correcoes-clientes/[id]` | B7A | Customer data correction detail & identity validation |
| `ADM-D-043` | `306:2973` | `/consultas-intermediadas` | B7A | Team-assisted customer inquiries queue |
| `ADM-D-044` | `306:3176` | `/consultas-intermediadas/[id]` | B7A | Mediated enquiry thread view with mandatory staff disclosure |
| `ADM-D-045` | `325:3366` | `/configuracoes/planos` | B7B | Advertisement plans pricing (Plano Básico R$ 30, Estendido R$ 50) |
| `ADM-D-046` | `325:3581` | `/configuracoes/impulsionamento` | B7B | Boost configuration (Destaque R$ 10 / 7 dias; BST-07D-001) |
| `ADM-D-047` | `325:3796` | `/configuracoes/categorias` | B7B | Vehicle categories catalog management |
| `ADM-D-048` | `325:4011` | `/configuracoes/marcas-modelos` | B7B | Vehicle makes & models catalog management |
| `ADM-D-049` | `341:4910` | `/configuracoes/localidades` | B7B | Geographic coverage locations (Vale do Aço / Minas Gerais) |
| `ADM-D-050` | `341:5126` | `/configuracoes/destaques` | B7B | Homepage featured content (Fiat Strada R$ 82.900 candidate listing) |
| `ADM-D-051` | `341:5342` | `/configuracoes/notificacoes` | B7B | Notification event templates (TPL-MSG-01 to TPL-DISP-05) |
| `ADM-D-052` | `341:5558` | `/configuracoes/contato` | B7B | Support contact details (marked Pending Validation / SMG-08 hold) |
| `ADM-D-053` | `354:6767` | `/configuracoes/termos-privacidade` | B7B | Legal terms & privacy policy drafts (v0.1; publication blocked) |
| `OWN-01` | `354:6939` | `/perfil` | B8 | Administrator own profile overview |
| `OWN-02` | `354:7111` | `/perfil` (Edit modal) | B8 | Administrator own profile editing form |
| `OWN-03` | `354:7283` | `/perfil` (Security tab) | B8 | Account security, active sessions, and password change |

*Note on gaps:* Figma desktop IDs `ADM-D-004`, `006`, `008`, `011`, `013`, `021`, and `022` were intentionally omitted by the design team as detailed in `docs/specs/roadmap.md`; their functional requirements were mapped directly into parent tabs and modal drawers.

---

### 2.2 Approved Mobile Screens (ADM-M-001 to ADM-M-013)

| Screen ID | Figma Node | Admin Route | Layout & Behavior |
| :--- | :--- | :--- | :--- |
| `ADM-M-001` | `446:9341` | `/` | Mobile dashboard overview, 4 summary cards, bottom navigation |
| `ADM-M-002` | `446:9438` | `/vendedores` | Mobile seller applications queue with review drawer |
| `ADM-M-003` | `446:9561` | `/anuncios` | Mobile listing approval queue |
| `ADM-M-004` | `446:9683` | `/anuncios/[id]` | Mobile listing inspection detail (approval blocked on mobile) |
| `ADM-M-005` | `447:9382` | `/moderacao` | Mobile moderation alerts (7 pending, 2 urgent; deliberation locked) |
| `ADM-M-006` | `447:9562` | `/alertas` | Mobile critical alerts feed |
| `ADM-M-007` | `447:9742` | `/consultas-intermediadas` | Mobile managed inquiries list |
| `ADM-M-008` | `447:9922` | `/usuarios` | Mobile client directory search and quick review |
| `ADM-M-009` | `468:9564` | `/pagamentos` | Mobile payment summary (read-only; cash entry hidden) |
| `ADM-M-010` | `468:9689` | `/equipe` | Mobile staff directory overview |
| `ADM-M-011` | `468:9785` | `/configuracoes` | Mobile settings overview with grouped cards |
| `ADM-M-012` | `468:9881` | `/perfil` | Mobile administrator profile & secure logout |
| `ADM-M-013` | `487:9865` | `/login` | Mobile staff login screen with safe redirect handling |

---

## 3. Design System & Shared Primitives

1. **Tokens (`@feira/ui`):**
   - Brand Red: `#F42524` (official logo & primary brand color)
   - Semantic UI Primary Red: `#B91C1C` (Tailwind `primary`, buttons, focus borders)
   - Accent Tint: `#FFF1F2` (active nav pill background, light danger badges)
   - Neutral Palette: `#111827` (headings/sidebar), `#374151` (body), `#6B7280` (muted labels), `#F9FAFB` (canvas)
   - Spacing: 4px base scale (8px, 12px, 16px, 24px, 32px, 36px, 48px)
   - Border Radii: 6px (`rounded-md`), 10px (`rounded-lg`), 12px (`rounded-xl`), 14px (`rounded-2xl`)

2. **Shell Components:**
   - `AdminShell.tsx`: Responsive container with 252px desktop sidebar, 76px topbar, 36px padding, `max-w-[1348px]` content bounding box.
   - `AdminTopbar.tsx`: Location pill `Ipatinga · MG`, environment badge, avatar initials `AM` (`#a8121c` on `#fce0e3`).
   - `AdminMobileNavigation.tsx`: 69px height, 4 responsive tabs (`Painel`, `Vendedores`, `Anúncios`, `Alertas`), `text-red-600` active state.

3. **Demonstration Vehicle Assets:**
   - Standardized high-resolution images in `apps/admin/public/images/vehicles/demo`:
     - `fiat-strada-2023.jpg` (Fiat Strada Volcano 1.3 Flex 2023)
     - `chevrolet-onix-2022.jpg` (Chevrolet Onix Plus LTZ 2022)
     - `vw-polo-2023.jpg` (Volkswagen Polo Track 1.0 2023)
     - `honda-cg-160-2022.jpg` (Honda CG 160 Titan 2022)
     - `toyota-corolla-2021-b6.jpg` (Toyota Corolla Altis Premium 2021)
     - Scalable SVG silhouettes for pickups, sedans, SUVs, hatches, and motorcycles.

---

## 4. Approved Commercial Values & Invariants

All commercial models are strictly synchronized with client decisions and SRS v0.5:

1. **Plano Básico:**
   - Price: **R$ 30,00**
   - Duration: **30 days**
   - Limit: **Up to 5 vehicle photographs**
   - Recurring billing: **None** (manual renewal required)

2. **Plano Estendido:**
   - Price: **R$ 50,00**
   - Duration: **60 days**
   - Limit: **Up to 10 vehicle photographs**
   - Recurring billing: **None** (manual renewal required)

3. **Boost / Destaque (`BST-07D-001`):**
   - Price: **R$ 10,00**
   - Duration: **7 days**
   - Tiers: Single approved boost. Unapproved "Prata" or "Ouro" tiers are strictly rejected.

4. **Candidate Featured Listing (`FC-2026-0142`):**
   - Vehicle: Fiat Strada Volcano 1.3 Flex 2023
   - Price: **R$ 82.900,00** (FIPE R$ 81.900, +1.2%)

---

## 5. Pending Client Approvals & Holds

| Item | Status | Action Required Before Production |
| :--- | :--- | :--- |
| **Legal Documents** | `HOLD: v0.1 Draft` | Terms of Use and Privacy Policy are v0.1 drafts. Publication toggle is blocked until formal Brazilian legal counsel sign-off. |
| **Support Contact Details** | `HOLD: SMG-08` | Official email, phone number, and physical office address are pending client validation. Marked with `Pendente de Validação`. |
| **Sales/Support Permissions** | `HOLD: DENY_PENDING` | 12 sensitive administrative operations remain blocked for Sales and Support roles pending fine-grained authorization sign-off. |
| **Refund Legal Window** | `HOLD: REL-04` | 7-day CDC Art. 49 cancellation window applies to advertising plans. Reversal mechanisms require payment gateway integration. |
| **Payment Gateways (PSP)** | `HOLD: REL-03` | Production Pix and credit card settlement accounts not yet provisioned. Mock simulation active in dev. |

---

## 6. Frontend Invariants & Security Boundaries

1. **No Direct Database Connections:** Next.js route handlers and server actions do not contain SQL, ORM, or database drivers.
2. **OpenAPI v0.2 Protocol:** All client data consumption is typed via `@feira/api-client`.
3. **Fail-Closed Session Verification:** Server-side sessions are validated using HTTP-only cookies; local storage token persistence is forbidden.
4. **Desktop-Only Cash Registration:** Physical cash entry is strictly restricted to desktop Main Admin viewports (`/pagamentos/[id]/dinheiro`).
5. **Mobile Deliberation Locking:** Sensitive moderation and listing approvals are blocked on mobile viewports; mobile UI enforces read-only inspection.
6. **Provenance Tagging:** All mock statistics, metrics, and records carry explicit `DEMO DATA` markers.

---

## 7. Release Verification Summary

- **Biome Formatting & Linting:** 263 files checked, 0 errors.
- **TypeScript Typecheck:** 0 errors across 7 workspace packages.
- **Vitest Unit Tests:** 89 tests passing across all packages.
- **Playwright E2E Tests:** Both desktop and mobile suites passing.
- **Production Build:** Next.js compiled all 34 static/dynamic routes in 48s.
- **GitHub Actions Workflows:**
  - `CI` Run `#43797176272` (Lint, Typecheck, Test, Build): **SUCCESS**
  - `E2E Tests` Run `#43797176166` (Playwright Web & Admin): **SUCCESS**
- **Git Commit:** `bdfc90594f4dcf907198878dd25cd8c3984398b5` on `feat/admin-final-qa-assets-icons`.
