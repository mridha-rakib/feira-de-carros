# Feira de Carros — Website Frontend Engineering Implementation Roadmap

**Audit date:** 31 October 2026  
**Status:** Read-only Figma and source-document audit; implementation proposal, NOT client/backend deployment sign-off.  
**Stack:** Next.js App Router + TypeScript (strict).  
**Excluded delivery:** Native iOS and Android apps. A responsive web view is not a native app.  
**Verified design source:** Figma file `JlRZIGImV7rRROPZndv6NT` (live MCP read of pages, frames, variables, design context, actual screenshots).  
**No website application code was created for this audit.**

## 1. Source verification and precedence

The handoff ZIP was decompressed and passed a full ZIP integrity test: **18 files**. It contains SRS v0.5, client-review v0.3 PDF, corrected OpenAPI YAML/JSON, 126-operation endpoint/response/RBAC registers, v0.2 state register and machine manifest, SQL v0.2, technical corrections, release gates, v0.1 historical reference PDFs, and governance manifest. The separately uploaded SRS v0.5 DOCX hashes identically to the copy inside the ZIP. The client logo/font source ZIP is NOT bundled in this handoff; official static assets must be exported from approved Figma nodes or attached separately with usage rights. **No frontend code repository or functioning backend server was supplied.**

Source order for this build:
1. Latest specific client decisions, especially seven-day advertising cancellation/refund direction (legal timing remains open).
2. SRS design-aligned v0.5 as working scope (149 current-design confirmed + 18 partial core = **167 active IDs**; *not* a new signed SRS).
3. SRS v0.3 for client-reviewed baseline and evidence history.
4. Corrected v0.2 OpenAPI, RBAC, response DTO, SQL and state-machine references over contradictory v0.1 technical proposals. All are proposals, not deployed behavior.
5. Live Figma nodes for layout, styles, imagery, breakpoints and composition **only**. Mockups and prototype actions cannot expand scope.

**Brand discrepancy:** the handoff README and current Figma variables use brand red `#F42524` and black `#000000`; v0.5 retains text describing an earlier yellow/black/white brief. The Figma semantic UI red is `#B91C1C`, proposed body face Inter. Do not confuse the logo's Magistral asset with a licensed UI body font. Record the discrepancy for formal confirmation; implement from current Figma reference, not fabricated HEX values. Three variable collections exist (primitives, semantic light, spacing/radius). Eight local proposed text styles were observed; official client assets should be checked before shipping.

## 2. Verified design surface and coverage

- **Admin:** 46 numbered desktop Figma IDs `ADM-D-001…053` (seven ID gaps: **004,006,008,011,013,021,022**), 13 mobile IDs `ADM-M-001…013`, and three administrator own-profile/security screens. Figma's Batch 22 handoff claims **196 state/flow frames** and **2,062 prototype actions** with zero broken destinations; these are *design-team QA claims, not a substitute for frontend test evidence*. Desktop `ADM-D-002` was visibly inspected via screenshot, as was mobile `ADM-M-001`. Actual screen nodes and nodes for every numbered admin desktop/mobile screen were enumerated. Numbering gaps require controlled reconciliation; DO NOT auto-create seven screens.
- **Individual Seller:** 26 role-specific website IDs `WEB-016,018,019,020,023–039,045,046,048–050`, all with desktop examples. Many earlier flows have 390px mobile examples. The seller's `WEB-045/046/048/049/050` and shared `WEB-012/051/052` had **no dedicated mobile counterpart found** in this Figma page. Responsive implementation should use approved shared patterns then return for visual review; do not claim the mobile designs are completed.
- **Buyer/Public:** canonical discovery `BUYER / CANONICAL WEB-001…006` has 1440px desktop/390px mobile references; favorites, auth, account, saved search, messaging, verification/recovery-related states, notifications, legal/help and errors are present. **Do not confuse** `BUYER / CANONICAL WEB-005` (filter/sort) with legacy `BUYER / WEB-005` (login), or canonical `WEB-006` (public detail) with legacy `WEB-006` (registration).
- **Dealership:** 1440px/390px public showroom, `WEB-017` registration/application, `WEB-021` inventory overview, `WEB-022` business profile edit. Business profile must not show CNPJ or invented reputation data.
- **Reusable library:** 50 labeled UI families plus base components/icons, seller and buyer navbars, state badges and Admin handoff masters. Reference live components rather than rebuilding inconsistent copies.

**Visual-only risks requiring review:** The Admin overview screenshot contains clearly labeled *demonstration* statistics and synthetic records, not real business evidence. The Buyer homepage mockup also uses unsubstantiated marketing phrases such as “Vendedores verificados” / “Compra segura”. Do not publish these claims without factual/legal approval; don't put fabricated business counts, marketplace ratings, testimonials, guarantee promises or invented inventory into production UI. In development, keep fixtures visibly tagged as demo and never report simulated payment/approval as real.

## 3. User roles and website screen responsibility

| Role | Website capability | Key restriction |
|---|---|---|
| Guest | Home, category/location, search, vehicle detail, actual seller phone reveal, public dealer showroom | No in-app chat/favorites/publication actions |
| Registered buyer / `member` | Favorites, saved searches, matching alerts, listing-origin text chat, profile/password/notifications, deletion | Adult 18+, authenticated actions; no ad publication without seller approval |
| Individual Seller / `seller` | Application/correction; own ad wizard, photos, edits, renewals, per-vehicle plan/boost, analytics, receipts, refund request, own inbox | Manual admin approval and confirmed payment before public activation |
| Dealership / `dealer` | One dealer account, public showroom, own fleet, own analytics, paid per-vehicle listings | CNPJ private; no multi-staff dealer login or bulk subscription in V1 |
| Sales / `sales` | Assigned legacy listing/customer assistance, team-mediated enquiries where explicitly granted | No final approval, no cash confirmation; provisional endpoints denied |
| Support / `support` | Authorized customer corrections, issue handling, assigned enquiries with narrow grants | No final approvals/cash; sensitive field access denied pending sign-off |
| Main Admin / `main_admin` | Full approved desktop back office, approvals, finance, plans, moderation, content and staffing; essential mobile views | Cash entry desktop only; mobile ad approval not assumed; server RBAC authoritative |

A seller or dealer may also access public browsing routes; implement capabilities/entitlements, not mutually exclusive visual identities. Distinguish account role from seller application status and listing state. Never authorize via button visibility alone.

## 4. Proposed Next.js App Router architecture

Keep one TypeScript codebase and separate route-layout shells for public marketplace, authenticated customers and staff back-office. Using `/admin` for the initial dashboard is an **engineering route proposal**, not a claim that the client approved one hostname; the back office could deploy on a separate subdomain after security/domain decisions. Route groups are organizational only and do not appear in URLs.

```text
src/
  app/
    (marketplace)/
      page.tsx                    # / homepage
      veiculos/page.tsx
      veiculos/[id]/page.tsx
      categorias/page.tsx
      concessionarias/[id]/page.tsx
    (identity)/
      entrar/page.tsx
      cadastrar/page.tsx
      recuperar-senha/page.tsx
      admin/entrar/page.tsx        # Staff login outside protected Admin layout
      verificar-email/page.tsx     # visual placeholder until API contract finalized
    (customer)/
      favoritos/page.tsx
      buscas-salvas/page.tsx
      mensagens/page.tsx
      mensagens/[id]/page.tsx
      conta/page.tsx
      conta/configuracoes/page.tsx
    (advertiser)/
      vendedor/solicitacao/page.tsx
      vendedor/anuncios/page.tsx
      vendedor/anuncios/novo/[step]/page.tsx
      vendedor/anuncios/[id]/page.tsx
      vendedor/pagamentos/page.tsx
      concessionaria/solicitacao/page.tsx
      concessionaria/anuncios/page.tsx
      concessionaria/perfil/page.tsx
    (backoffice)/
      admin/layout.tsx             # Protected AdminShell; never wraps /admin/entrar
      admin/page.tsx
      admin/usuarios/page.tsx
      admin/vendedores/solicitacoes/page.tsx
      admin/anuncios/page.tsx
      admin/anuncios/revisoes/page.tsx
      admin/pagamentos/page.tsx
      admin/reembolsos/page.tsx
      admin/denuncias/page.tsx
      admin/equipe/page.tsx
      admin/configuracoes/page.tsx
    api/                       # optional safe session/BFF route handlers only
    layout.tsx
    not-found.tsx
    error.tsx
  components/
    ui/                        # Figma mapped primitives only
    layouts/                   # MarketplaceShell, AccountShell, AdminShell
    vehicles/                  # VehicleCard, gallery, filters
    messaging/                 # Inbox, thread, presence, report modal
    admin/                     # Sidebar, topbar, data tables, stats, review panels
    forms/                     # CPF/CNPJ, dates, phones, validation
  features/
    auth/ buyer/ seller/ dealership/ admin/ listings/ payments/ messaging/
  lib/
    api/
      generated/               # code-generated from corrected OpenAPI, do not edit
      ports/                   # domain-facing types/interfaces
      adapters/http/           # real server integration later
      adapters/mock/           # explicit developer-only fake data/states
      errors.ts
    access/                    # role capability checks; deny-by-default
    session/                   # server-owned cookies/session lifecycle
    format/                    # pt-BR dates, currency, phone/location
    validation/                # form schemas aligned to approved fields
    config/
  styles/                      # Figma-extracted CSS variable tokens
  test/
    fixtures/ contract/ e2e/ visual/ accessibility/
```

**Auth routing note:** `/admin/entrar` must remain outside the protected Admin layout to avoid authentication redirect loops; use separate route groups that resolve to the desired URLs without duplicate actual page paths.

**Rendering:** server components for public fetchable discovery and protected initial data; client components only for filters, upload, messaging, tables and interactions. No sensitive personal data in statically cached public responses. Prefer stable loading/error/suspense patterns. Use accessible semantic HTML and controlled client forms with server-side validation.

**Recommended engineering dependencies (proposal, not SRS features):** TypeScript strict, Next.js App Router, lint + formatting, schema-aware runtime validation, OpenAPI type generation, form validation, React Testing Library + Vitest (or equivalent), Playwright for browser/visual tests, axe accessibility checks, and development-only mock transport. Choice of styling library must be matched against Figma components rather than assumed client-approved.

## 5. Design system implementation

- Export approved logo/icons/vehicle hero artwork from original Figma or client source only. No unresolved temporary Figma asset URL committed to production. Respect asset licensing and avoid duplicating exact Figma reference screenshots as website imagery.
- Bind color variables (`brand/red`, `ui/primary`, `ui/text`, `ui/background`, etc.), semantic aliases, fonts, 4/8/12/16/24/32/48 spacing, 6/10/14 radii, at-least-44px targets, and Figma focus states to CSS custom properties.
- Reuse 50 numbered Figma component family patterns: page shell/sidebar/nav, buttons, modal/confirmation, input/date/CPF/CNPJ, location selector, photo quota, vehicle cards, status badges, tables/pagination, loading/error, message composer, plan selection, payment/refund and moderation.
- Create a component mapping checklist for each screen: **Figma component/node ID → React component name → variant/states → CSS tokens → accessibility semantics → QA screenshot**. Avoid arbitrary new component variants without visual/functional necessity.
- Separate illustration/demo text from actual server data. `ui/primary` differs from official `brand/red`; do not flatten them to one guessed value.

## 6. API, mocks, state machines and auth

**Current corrected technical inventory:** OpenAPI 3.1.0 v0.2, **104 paths / 126 operations / 183 schema definitions**; 126-row endpoint register, 126-row response register, 126-row RBAC matrix; **16 state machines / 77 transitions**; **12 staff permission holds**; **11 partial MutationReceipt acknowledgements**; **16 REL release gates** plus the distinct SMG business-gate series. OpenAPI server `https://api.example.invalid` is expressly a placeholder.

- Generate TypeScript request/response schemas from *corrected* v0.2. Keep generated code separate from composable domain ports: `AuthPort`, `AdminOverviewPort`, `ListingPort`, `PaymentsPort`, `MessagingPort`, `CatalogPort`.
- Bind views to `services`/query hooks using a runtime-configured adapter: `MockApiAdapter` in demo/testing; `HttpApiAdapter` against an authenticated real API after contract acceptance. Both must implement identical port interfaces, normalized error shapes and ownership/permission behavior.
- Mock fixtures: explicit `DEMO DATA` provenance; no claim of real online users, seller verification, revenue, payment settlement, refunds or automated activation. Make mock writes local/dev only with realistic reject/pending/403/409/error outcomes, do not silently mark paid orders as successful.
- Session: server-owned credentials (HTTP-only secure cookies and rotation/revocation design subject to backend agreement), protected Next server layouts and a backend authorization check. Never store sensitive secrets or CPF/CNPJ in localStorage; avoid shipping secret keys in `NEXT_PUBLIC_*` settings.
- Permissions: model `guest/member/seller/dealer/sales/support/main_admin` plus resource ownership and seller approval state; every protected UI action checks capabilities for presentation, while real API must independently enforce. `DENY_PENDING` means **disabled/blocked**, even if an OpenAPI role list casually names Sales/Support.
- State machines: do not assign ACTIVE to listing until both Main Admin approval and verified advertising payment/valid no-new-fee legacy entitlement. Preserve last-approved published revision during edits; sold listings disappear publicly and threads become read-only. Renewal/grace/refund clocks come from backend policy, never from the browser's guess.
- Payments: Pix/card/actual cash concern advertising plans/boosts **only**. No vehicle-sale checkout, no boleto, no automatic recurring payment, no fake bank settlement. Cash record route hidden on mobile and available only to `main_admin` after server authorization; user-agent/device checks are not a security control. Checkout remains mock/contract-gated until PSP approved.
- Chat: start only from listing as an authenticated buyer; text only, seller replies, read/unread/presence, report/block, archived read-only state. Managed legacy thread prominently labels the representative as Feira de Carros staff; never offer open search of ordinary unreported private conversations.

### Contract-drift issues to raise before enabling specific behaviors

1. **PAY-018/019:** Proposed OpenAPI v0.2 still describes **three business days** in `/v1/my/orders/{orderId}/refund-requests` and other open-gate text. **SRS v0.5's seven-day policy supersedes it.** Exact legal commencement, time zone, boost applicability and reversals are not finalized. Keep UI copy/state contract-controlled.
2. **AUTH-009:** v0.2 has `/v1/auth/password-recovery` (initiation) and `/v1/me/password` (change), but lacks complete approved verification/resend, reset-token completion and reset-validation operations. Build presentation/states after API amendment; no invented server behavior.
3. **NOT-001/002/005:** Figma includes Buyer notification-center views; the current API has preferences and device-registration endpoints, but no explicit user notification inbox/read endpoint. Do not add a new notification-center product/data model based on mockup alone.
4. **Admin details:** Some detail-heavy Figma views use collection endpoints with no dedicated object-detail route (e.g. transaction detail) or unconfirmed comparison payloads. Resolve DTO coverage rather than creating unsupported API paths.
5. **Admin account security/MFA:** Figma has a security page; actual MFA/session policy remains an engineering/security decision, not a signed client promise.
6. **Legacy data:** final 27+ dataset and media rights were not supplied; don't hardcode 27 or import fictitious clients.
7. **Branding, privacy copy, screenshot marketing:** review all unsubstantiated “verified sellers”, “secure purchase”, guarantee, count and ratings text against evidence before publishing.

## 7. Responsive design & interaction contract

The live Figma Admin handoff specifies **1600px desktop source, 1366px checked variant, 768px tablet specimen, 360/375/430px mobile**; Seller/Buyer commonly use **1440px desktop and 390px mobile**. Use flexible responsive layouts, not fixed-width child pixel replicas. Admin desktop reference uses **252px sidebar and 76px topbar**; mobile essential shell uses an approximately **86px bottom tab navigation** with safe-area handling, no sidebar. The tablet figure is a *specimen* rather than proof of all tablet screens.

Apply across relevant screens: idle/loading/skeleton, empty data, validation, unauthorized/403, unauthenticated/401, account suspended, network error/retry, success/pending/failed states *only where the approved workflow permits them*, destructive confirmation, approval/rejection reason, and keyboard focus and modal focus return. Mobile tables need meaningful cards/scroll/labels, not clipped columns. For staff mobile do not copy desktop-only controls. Seller mobile gap screens require review against shared component patterns.

## 8. Prioritized coding batches — no coding until plan approval

| Batch | Scope and exact screen ordering | Success gate |
|---|---|---|
| **B0 · Audit/architecture freeze (current task)** | Inspect real Figma + files; finalise screen matrix, token/component exports, route and permission map; note SRS/open gates | Architecture + B1 agreed; no repo changes yet |
| **B1 · First coding batch: Admin foundation** | Scaffold Next.js/TypeScript, CSS tokens, read-only API ports/mocks, staff auth shell; **ADM-D-001 → ADM-D-002 → ADM-M-013 → ADM-M-001** | Login/overview match Figma; mock is explicitly demo; 401/403/error/empty responsive states; no money mutation |
| **B2 · Admin core operations** | **ADM-D-003 → 005 → 007 → 009 → 010 → 012 → 014 → 015 → 016 → 017 → 018 → 019 → 020 → 023** | Own resources, approval/rejection and last-approved-version flow; legacy input no fake fee; guarded actions |
| **B3 · Admin payment/finance (gated)** | **ADM-D-024 → 025 → 026 → 027 → 028 → 029 → 030 → 031** | View-only states first; cash main-admin desktop only; no fake refunds or PSP settlement |
| **B4 · Admin moderation, deletion, team** | **ADM-D-032 → 033 → 034 → 035 → 036 → 037 → 038 → 039 → 040 → 041 → 042 → 043 → 044** | Report-linked privacy; signed fine-grained RBAC required to enable held Sales/Support operations |
| **B5 · Admin config/profile/mobile** | **ADM-D-045 → 046 → 047 → 048 → 049 → 050 → 051 → 052 → 053 → own profile/edit/security → ADM-M-002…012** | Existing-plan edit only, correct content and mobile essentials; complete Admin Figma regression |
| **B6 · Public discovery and identity** | **Buyer canonical WEB-001 → 002 → 003 → 004 → 005 → 006**, legacy login/signup/recovery and public legal/help | pt-BR/Ipatinga defaults; actual-phone reveal; no guest chat; no unverified claims |
| **B7 · Buyer account/engagement** | Favorites → saved searches → preferences → account/password/deletion → inbox → chat → reporting/blocking/read-only → matching alerts | Buyer initiation, realtime behavior adapter, API/notification gap isolated |
| **B8 · Seller website** | `WEB-016 → 018 → 019 → 020 → 023 → 024 → 025 → 026 → 027 → 028 → 029 → 030 → 031 → 032 → 033 → 034 → 035 → 036 → 037 → 038 → 039 → 045 → 046 → 048 → 049 → 050` + shared account/legal/help | State-machine business rules, per-vehicle quotas, payment/provider gates, desktop/mobile design review |
| **B9 · Dealership** | Public showroom → `WEB-017 → WEB-021 → WEB-022`, reuse seller listing/payment capabilities | Private CNPJ, one account, per-vehicle inventory and price/limits |
| **B10 · Integration and release QA** | Replace approved mock adapters with live backend, contract migrations, cross-role E2E, payment sandbox, security/privacy/legal UAT | Client, backend, legal/security and release acceptance evidence; no automatic deployment |

**Batch gate rule:** `screen implementation → route/API/RBAC/state tests → responsive snapshots → Figma review → QA fixes → mark accepted → next screen/batch`. Do not declare a whole batch complete merely because it renders.

## 9. Exact B1 definition: Admin Foundation (first coding batch)

**In-scope:** project skeleton; shared CSS/theme typography/brand assets; `AdminShell` sidebar/topbar/mobile bottom navigation; `/admin/entrar` using **ADM-D-001** + **ADM-M-013**; `/admin` overview using **ADM-D-002** + **ADM-M-001**; reusable permission-denied, loading, error, empty, fake-fixture provenance and status badge/table/chart containers. Single read-only port for `GET /v1/admin/dashboard` (`API-106`), plus mock login envelope following `POST /v1/auth/login` (`API-002`) only as a dev simulation. Profile/security sidebar navigation can be drawn but must not trigger unimplemented actions. No actual account management or PSP mutations.

**Acceptance checks:**
1. Top-level page geometry and logo/logo slot, navigation, typography, metric-card hierarchy, tab/table spacing and status labels compared side-by-side to actual Figma screenshots at 1600/1366 desktop, 768 tablet, 390/375/360/430 mobile.
2. All styled tokens linked to the Figma values; button/label focus and keyboard navigation functional, bottom navigation safe-area and touch targets correct.
3. Unauthenticated user sees a consistent login gate; authenticated wrong-role gets denied; Sales/Support do not silently see Main Admin dashboard data; API layer returns 401/403 in negative mock tests.
4. Dashboard “stats” are empty/placeholder or visibly *demo fixtures* in development, never published as real figures; production unavailable-data states are neutral (not invented zeros sold as facts).
5. No seller/ad approvals, staff permissions changes, cash entry, refunds, subscriptions or vehicle purchase checkout in B1.
6. TypeScript strict compile, lint, unit/role/adapter tests, browser smoke, axe audit and Figma visual screenshots pass. Attach screen IDs, requirement IDs and tested viewport evidence to the B1 PR.

**B1 exclusions:** Full Admin operations, production auth-session security policy, MFA selection, complete AUTH-009 backend verification/reset, seller workflows and native apps. Record these as follow-on gates rather than pretend completed.

## 10. QA and release acceptance controls

- **Traceability:** Every visible route/action links to one or more accepted SRS v0.5 IDs, a live Figma node, one proposed API operation, a v0.2 RBAC permission, expected state transition and test case. Diff reviewed before each batch.
- **Functional AC:** Use all SRS v0.5 **AC-01 through AC-28** as starting QA scenarios, including 18+ account, no public CPF/CNPJ, seller rejection reason, 5/10 photo cap, payment gating, last-approved revision, sold removal/no sold badge, 3-day listing grace, report-linked moderation, team-mediated disclosure, seven-day refund direction, email verification/recovery anti-enumeration.
- **Authorization:** negative tests on direct URL and API for guest/buyer/seller/dealer/sales/support/main_admin; wrong owner, suspended account, mobile cash route, DENY_PENDING staff actions, and report-linked chat restriction.
- **API:** OpenAPI shape and runtime validation, 401/403/404/409/422, offline and timeout/retry, pagination/filter query, error content, status idempotency. Do not infer real API readiness from static schema lint.
- **Visual/a11y:** viewport snapshots for relevant Figma breakpoints; keyboard, visible focus, dialog trap/escape, contrast, screen-reader labels, resize/zoom, error announcements, reduced motion and image alt text. Where practical aim at WCAG 2.2 AA as an *engineering target* (not a previously signed numeric client standard).
- **Privacy/payment:** no CPF/CNPJ or DOB in public JSON/HTML; no insecure token persistence; no successful payment UI without validated status; no leaked receipts/reports; no real cash confirmation on mobile or staff roles; no vehicle-sale fund processing.
- **No invented features:** reviews, stars, testimonials, fake commercial statistics, selfie, CPF photo, video, GPS radius, auto subscriptions, bulk dealer packages, generic free ads and unreported private-chat browsing not enabled.
- **Exit:** design review acceptance per screen, contract sign-off per action, legal/provider review per restricted flow, accessibility and browser QA evidence, authorized UAT; final SRS v1.0 sign-off not supplied by current files.

## 11. Immediate unresolved questions / decision log

**Blocking production/high-risk flows:** `REL-03` PSP onboarding; `REL-04` refund lawful clock and boosts; `REL-05` LGPD retention/deletion; `REL-06` deletion compliance; `REL-07` field-level staff RBAC; `REL-09` exact listing grace semantics; `REL-10` chargeback/cash correction; `REL-12` hosting/backup; `REL-14` verified legacy assets; `REL-15` contracted scope; `REL-16` production provider accounts. iOS/Android `REL-01/02` are separate native implementation gates, not blockers for designing website UI. `REL-13` blocks new-plan creation, which is excluded.

**Frontend design/contract resolution:** seven Admin ID gaps, public marketing-copy/legal review, current red versus old yellow brand note, outstanding seller mobile variants, Buyer notification-center data model, reset/verify API amendments, admin transaction detail/collection DTO checks, merchant provider/receipt behavior and exact server-auth scheme. None are pretexts to invent new functionality.

**Recommended next action:** approve the architectural proposal and B1 screen contract, then begin code **only** for ADM-D-001, ADM-D-002, ADM-M-013 and ADM-M-001 with audited Figma visual references and replaceable mock adapters.

---

## 12. Requirement-ID coverage reconciliation (separate evidence)

All **167 active SRS v0.5 IDs** were independently re-extracted from the uploaded DOCX (exactly 167 unique IDs). Candidate screen-level links and proposed v0.2 endpoint IDs were cross-matched against the screen matrix:

| Type of requirement linkage | Requirement IDs | Meaning |
|---|---:|---|
| Direct Figma screen mapping | **137** | An explicit row in the screen traceability register cites this SRS ID; final action-level QA still required |
| API-only / non-visual mapping | **9** | A corrected v0.2 API operation cites the ID, but no direct screen row does; add contract/backend test evidence |
| Cross-cutting / negative / policy QA | **21** | Requirements such as no vehicle-sale payment, no boleto, the role-responsive boundary, infrastructure decisions, branding, and email notification cadence need policy/QA evidence, not invented new screens |
| **Total audited active IDs** | **167** | Accounting coverage is complete; client sign-off and runtime acceptance are not |

The companion **Requirement Coverage Audit JSON** identifies all 167 IDs and links each to mapped screen IDs/API IDs or cross-cutting QA. The 21 non-screen/no-API group is a **verification to-do**, not evidence that 21 features are missing. Figma frame numbering gaps and incomplete API contracts remain separate specific issues.

## Appendix A — Figma-to-SRS-to-API traceability matrix (screen-level)

Routes are proposed engineering paths; Figma IDs are linked to actual inspected live nodes. Repeated interactive/empty/confirmation states are implementation variants of these routes, not independent business capabilities. The separate JSON deliverable contains these same mappings in machine-readable format.

### A1 · Admin desktop numbered screens (46)

| Figma screen | Proposed route | SRS v0.5 | Proposed v0.2 API | Batch / hold |
|---|---|---|---|---|
| [ADM-D-001](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=213-1146) — Internal staff login | `/admin/entrar` | AUTH-001, AUTH-009, ADM-004 | POST /v1/auth/login | B1 · **HOLD:** Auth/session production contract pending |
| [ADM-D-002](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=39-2) — Dashboard overview | `/admin` | ADM-001/002/008 | GET /v1/admin/dashboard | B1 · **HOLD:** No fake counts or revenue |
| [ADM-D-003](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=39-76) — User management | `/admin/usuarios` | ADM-009, AUTH-023 | GET /v1/admin/users | B2 |
| [ADM-D-005](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=39-150) — Seller approvals | `/admin/vendedores/solicitacoes` | AUTH-019, ADM-009 | GET /v1/admin/seller-applications | B2 |
| [ADM-D-007](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=398-7891) — Dealership application review | `/admin/concessionarias/solicitacoes/[id]` | AUTH-017/019, ADM-009 | GET /v1/admin/seller-applications/{applicationId}; POST /v1/admin/seller-applications/{applicationId}/decision | B2 |
| [ADM-D-009](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=398-8090) — Suspend/block review | `/admin/usuarios/[id]/suspensao` | AUTH-023/024/026, ADM-009 | POST /v1/admin/users/{userId}/suspension | B2 |
| [ADM-D-010](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=398-8289) — Dealership directory | `/admin/concessionarias` | AUTH-021, ADM-009 | GET /v1/admin/users | B2 · **HOLD:** Confirm dealership filtering in response contract |
| [ADM-D-012](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=39-224) — Listing management | `/admin/anuncios` | ADM-010/011 | GET /v1/admin/listings | B2 |
| [ADM-D-014](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=208-1048) — Listing approval queue | `/admin/anuncios/revisoes` | ADM-006/010, VEH-016 | GET /v1/admin/listing-reviews | B2 |
| [ADM-D-015](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=208-1232) — Listing approve/reject | `/admin/anuncios/revisoes/[id]` | ADM-006, VEH-016/019 | GET /v1/admin/listing-reviews/{reviewId}; POST /v1/admin/listing-reviews/{reviewId}/decision | B2 |
| [ADM-D-016](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=386-7965) — Published revision comparison | `/admin/anuncios/revisoes/[id]/comparar` | VEH-018/019, ADM-010 | GET /v1/admin/listing-reviews/{reviewId} | B2 · **HOLD:** Confirm comparison payload fields |
| [ADM-D-017](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=398-8488) — Listing review history | `/admin/anuncios/[id]/historico` | ADM-010, VEH-019 | GET /v1/admin/listings/{listingId}/history | B2 |
| [ADM-D-018](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=386-7422) — Admin managed listing create | `/admin/anuncios/novo` | ADM-010/022, VEH-028 | POST /v1/admin/listings | B2 |
| [ADM-D-019](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=386-7603) — Admin managed listing edit | `/admin/anuncios/[id]/editar` | ADM-010, VEH-028 | PATCH /v1/admin/listings/{listingId} | B2 |
| [ADM-D-020](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=386-7784) — Legacy listing intake | `/admin/anuncios/legados` | ADM-022, VEH-029/030/032 | GET/POST /v1/admin/legacy-listings | B2 · **HOLD:** Real launch dataset and rights not supplied |
| [ADM-D-023](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=417-8747) — Featured position/entitlement review | `/admin/destaques` | ADV-006/007, SEARCH-010/011, ADM-016 | PATCH /v1/admin/settings/featured | B2 · **HOLD:** UI does not imply manual paid boost activation |
| [ADM-D-024](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=208-1416) — Payment transactions | `/admin/pagamentos` | ADM-014, PAY-023 | GET /v1/admin/payments | B3 |
| [ADM-D-025](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=225-1160) — Payment details | `/admin/pagamentos/[id]` | PAY-021/023 | GET /v1/admin/payments | B3 · **HOLD:** Dedicated admin transaction detail endpoint not verified |
| [ADM-D-026](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=225-1381) — Genuine cash record | `/admin/pagamentos/[id]/dinheiro` | PAY-012/013/014/016, ADM-007 | POST /v1/admin/orders/{orderId}/cash-confirmations | B3 · **HOLD:** Main Admin desktop-only; never simulate real success |
| [ADM-D-027](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=225-1602) — Cash receipts history | `/admin/pagamentos/dinheiro` | PAY-016/017/023 | GET /v1/admin/payments | B3 · **HOLD:** Confirm cash filters |
| [ADM-D-028](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=225-1823) — Refund requests queue | `/admin/reembolsos` | PAY-018/019, ADM-014 | GET /v1/admin/refund-requests | B3 · **HOLD:** Seven-day legal clock not validated |
| [ADM-D-029](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=237-1296) — Refund decision | `/admin/reembolsos/[id]` | PAY-018/019, ADM-014 | POST /v1/admin/refund-requests/{requestId}/decision | B3 · **HOLD:** Legal/provider execution hold |
| [ADM-D-030](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=237-1492) — Card disputes and chargebacks | `/admin/contestacoes` | PAY-020, ADM-014 | GET /v1/admin/payment-disputes | B3 · **HOLD:** No unsupported dispute-resolution mutation |
| [ADM-D-031](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=237-1688) — Revenue and export | `/admin/relatorios` | PAY-023/024, ADM-014 | GET /v1/admin/finance/report; GET /v1/admin/finance/export | B3 · **HOLD:** All numbers from real API only |
| [ADM-D-032](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=237-1884) — Moderation queue | `/admin/denuncias` | ADM-012, MSG-013/014 | GET /v1/admin/moderation-reports | B4 |
| [ADM-D-033](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=275-1474) — Moderation record detail | `/admin/denuncias/[id]` | ADM-012, SEC-006 | GET /v1/admin/moderation-reports/{reportId} | B4 |
| [ADM-D-034](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=275-1689) — Report-linked conversation | `/admin/denuncias/[id]/conversa` | MSG-014/016, ADM-012 | GET /v1/admin/moderation-reports/{reportId} | B4 · **HOLD:** Only report-linked scoped messages; verify DTO |
| [ADM-D-035](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=275-1904) — Moderation action | `/admin/denuncias/[id]/decisao` | ADM-012, SEC-006 | POST /v1/admin/moderation-reports/{reportId}/resolution | B4 |
| [ADM-D-036](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=275-2119) — Account deletion requests | `/admin/exclusoes` | AUTH-013/014, ADM-017 | GET /v1/admin/account-deletion-requests | B4 |
| [ADM-D-037](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=290-1886) — Account deletion review | `/admin/exclusoes/[id]` | AUTH-013/014, ADM-017 | POST /v1/admin/account-deletion-requests/{requestId}/decision | B4 · **HOLD:** LGPD retention policy hold |
| [ADM-D-038](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=290-2077) — Staff account directory | `/admin/equipe` | ADM-004/005 | GET /v1/admin/staff-accounts | B4 |
| [ADM-D-039](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=290-2268) — Staff account create/edit | `/admin/equipe/novo` | ADM-004/005 | POST /v1/admin/staff-accounts | B4 |
| [ADM-D-040](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=290-2459) — Staff access matrix | `/admin/equipe/[id]/permissoes` | ADM-005/018/024 | PATCH /v1/admin/staff-accounts/{staffId} | B4 · **HOLD:** 12 staff operations DENY_PENDING |
| [ADM-D-041](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=306-2567) — Customer correction queue | `/admin/correcoes` | ADM-018/024 | GET /v1/admin/customer-corrections | B4 · **HOLD:** Support grant DENY_PENDING |
| [ADM-D-042](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=306-2770) — Customer data correction | `/admin/correcoes/[id]` | ADM-018/024, SEC-003 | PATCH /v1/admin/customer-corrections/{caseId} | B4 · **HOLD:** Sensitive field policy hold |
| [ADM-D-043](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=306-2973) — Managed enquiries queue | `/admin/consultas` | MSG-017/020, ADM-018 | GET /v1/staff/managed-conversations | B4 · **HOLD:** Sales/Support DENY_PENDING |
| [ADM-D-044](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=306-3176) — Managed enquiry conversation | `/admin/consultas/[id]` | MSG-017/020, SEC-010 | GET/POST /v1/staff/managed-conversations/{conversationId}/messages | B4 · **HOLD:** No owner impersonation; staff permissions held |
| [ADM-D-045](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=325-3366) — Plan configuration | `/admin/configuracoes/planos` | ADV-008, ADM-013 | GET /v1/admin/plans; PATCH /v1/admin/plans/{planId} | B5 · **HOLD:** Edit existing only, do not create plans |
| [ADM-D-046](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=325-3581) — Boost configuration | `/admin/configuracoes/impulsionamento` | ADV-006/008, ADM-013 | PATCH /v1/admin/settings/featured | B5 |
| [ADM-D-047](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=325-3796) — Vehicle categories | `/admin/configuracoes/categorias` | ADM-015, VEH-001 | GET/POST /v1/admin/catalog/{resourceType} | B5 |
| [ADM-D-048](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=325-4011) — Make/model catalogue | `/admin/configuracoes/marcas-modelos` | ADM-015, VEH-003 | GET/POST /v1/admin/catalog/{resourceType} | B5 |
| [ADM-D-049](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=341-4910) — Brazilian locations | `/admin/configuracoes/localidades` | ADM-015, SEARCH-005 | GET/POST /v1/admin/catalog/{resourceType} | B5 |
| [ADM-D-050](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=341-5126) — Homepage featured content | `/admin/configuracoes/destaques` | ADM-016, SEARCH-010/011 | PATCH /v1/admin/settings/featured | B5 |
| [ADM-D-051](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=341-5342) — Notification templates | `/admin/configuracoes/notificacoes` | ADM-016, NOT-006 | GET /v1/admin/notifications/templates; PATCH /v1/admin/notifications/templates/{templateId} | B5 |
| [ADM-D-052](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=341-5558) — Support contact settings | `/admin/configuracoes/contato` | ADM-016 | GET/PATCH /v1/admin/content/{pageKey} | B5 · **HOLD:** Confirm content key mapping |
| [ADM-D-053](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=354-6767) — Terms and privacy management | `/admin/configuracoes/legal` | ADM-016, BUS-010, SEC-007 | GET/PATCH /v1/admin/content/{pageKey} | B5 · **HOLD:** Legal text sign-off |

### A2 · Admin own profile/security (3)

| Figma screen | Proposed route | SRS v0.5 | Proposed v0.2 API | Batch / hold |
|---|---|---|---|---|
| [ADMIN-OWN-PROFILE](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=354-6939) — Own admin profile | `/admin/meu-perfil` | AUTH-012 | GET /v1/me | B5 |
| [ADMIN-OWN-PROFILE-EDIT](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=354-7111) — Edit admin profile | `/admin/meu-perfil/editar` | AUTH-012 | PATCH /v1/me | B5 |
| [ADMIN-ACCOUNT-SECURITY](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=354-7283) — Admin account security | `/admin/minha-seguranca` | AUTH-009/012 | PATCH /v1/me/password | B5 · **HOLD:** MFA/session exact settings not agreed |

### A3 · Admin mobile variants (13)

| Figma screen | Proposed route | SRS v0.5 | Proposed v0.2 API | Batch / hold |
|---|---|---|---|---|
| [ADM-M-001](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=446-9341) — Overview | `responsive counterpart / mobile` | ADM-019/020 | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |
| [ADM-M-002](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=446-9438) — Seller requests | `responsive counterpart / mobile` | AUTH-019, ADM-019 | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |
| [ADM-M-003](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=446-9561) — Listing review queue | `responsive counterpart / mobile` | VEH-016, ADM-019 | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |
| [ADM-M-004](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=446-9683) — Listing review detail | `responsive counterpart / mobile` | ADM-021 pending; no mobile approval | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |
| [ADM-M-005](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=447-9382) — Moderation | `responsive counterpart / mobile` | ADM-012/019 | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |
| [ADM-M-006](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=447-9562) — Finance alerts | `responsive counterpart / mobile` | PAY-020, ADM-019 | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |
| [ADM-M-007](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=447-9742) — Managed enquiries | `responsive counterpart / mobile` | MSG-017, ADM-018 | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |
| [ADM-M-008](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=447-9922) — Customer search | `responsive counterpart / mobile` | ADM-009/019 | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |
| [ADM-M-009](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=468-9564) — Payments | `responsive counterpart / mobile` | PAY-023, ADM-020 | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |
| [ADM-M-010](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=468-9689) — Team/roles | `responsive counterpart / mobile` | ADM-005/019 | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |
| [ADM-M-011](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=468-9785) — Settings | `responsive counterpart / mobile` | ADM-019 | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |
| [ADM-M-012](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=468-9881) — Own profile | `responsive counterpart / mobile` | AUTH-012, ADM-019 | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |
| [ADM-M-013](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=487-9865) — Staff login | `responsive counterpart / mobile` | AUTH-001, ADM-019 | Reuse corresponding desktop read APIs | B5 · **HOLD:** Mobile essential tasks only; no cash entry or unapproved mobile approval |

### A4 · Buyer/public and states

| Figma screen | Proposed route | SRS v0.5 | Proposed v0.2 API | Batch / hold |
|---|---|---|---|---|
| [BUYER-CANONICAL-WEB-001](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=733-3) — Marketplace homepage | `/` | BUS-008, SEARCH-001/005/010 | GET /v1/vehicles/featured; GET /v1/catalog/locations | B6 · **HOLD:** Demo inventory/marketing claims must not ship |
| [BUYER-CANONICAL-WEB-002](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1266-1082) — Manual city/state | `/localidade` | BUS-008, SEARCH-005 | GET /v1/catalog/locations | B6 |
| [BUYER-CANONICAL-WEB-003](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1267-1109) — Browse by category | `/categorias` | VEH-001, SEARCH-002 | GET /v1/catalog/categories | B6 |
| [BUYER-CANONICAL-WEB-004](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=733-87) — Vehicle search results | `/veiculos` | SEARCH-001/003/004/011 | GET /v1/vehicles | B6 |
| [BUYER-CANONICAL-WEB-005](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1212-3646) — Filter and sort | `/veiculos (filters)` | SEARCH-003/004 | GET /v1/vehicles | B6 |
| [BUYER-CANONICAL-WEB-006](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=733-179) — Public vehicle detail | `/veiculos/[id]` | VEH-004/006/008/009, MSG-018 | GET /v1/vehicles/{listingId}; GET /v1/vehicles/{listingId}/contact | B6 |
| [BUYER-FAVORITES](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=733-232) — Saved favorites | `/favoritos` | SEARCH-007 | GET /v1/me/favorites | B7 |
| [BUYER-LEGACY-WEB-005](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=845-164) — Login | `/entrar` | AUTH-001/002/003/004 | POST /v1/auth/login; POST /v1/auth/oauth/{provider} | B6 · **HOLD:** Legacy WEB-005 is NOT canonical filter WEB-005 |
| [BUYER-LEGACY-WEB-006](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=845-212) — Registration | `/cadastrar` | AUTH-001/005/006/027 | POST /v1/auth/register | B6 · **HOLD:** Legacy WEB-006 is NOT canonical public detail WEB-006 |
| [BUYER-LEGACY-WEB-007](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=845-270) — Account profile | `/conta` | AUTH-012/027 | GET/PATCH /v1/me | B7 |
| [BUYER-LEGACY-WEB-008](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=845-316) — Forgot password | `/recuperar-senha` | AUTH-009 | POST /v1/auth/password-recovery | B6 · **HOLD:** Missing complete reset/verify API contract |
| [BUYER-LEGACY-WEB-009](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=856-165) — Saved searches | `/buscas-salvas` | SEARCH-008 | GET /v1/me/saved-searches | B7 |
| [BUYER-LEGACY-WEB-010](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=856-219) — Saved-search matching alerts | `/alertas-de-busca` | SEARCH-009, NOT-001 | No dedicated alert inbox endpoint | B7 · **HOLD:** Clarify product/data model before implementation |
| [BUYER-LEGACY-WEB-011](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=856-261) — Notification preferences | `/conta/notificacoes` | AUTH-012, NOT-005 | GET/PATCH /v1/me/notification-preferences | B7 |
| [BUYER-LEGACY-WEB-012](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1168-202) — Conversation inbox | `/mensagens` | MSG-007/008 | GET /v1/me/conversations | B7 |
| [BUYER-LEGACY-WEB-013](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1168-310) — Active conversation | `/mensagens/[id]` | MSG-002/004/006/008 | GET/POST /v1/me/conversations/{conversationId}/messages | B7 |
| [BUYER-LEGACY-WEB-014](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1168-419) — Start listing-linked conversation | `/veiculos/[id]/conversar` | MSG-001/002/003 | POST /v1/vehicles/{listingId}/conversations | B7 |
| [BUYER-LEGACY-WEB-015](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1168-488) — Chat login required | `/entrar?retorno=...` | MSG-001, AUTH-001 | POST /v1/auth/login | B7 |
| [BUYER-LEGACY-WEB-016](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1168-557) — Empty inbox | `/mensagens (state)` | MSG-007 | GET /v1/me/conversations | B7 |
| [BUYER-LEGACY-WEB-017](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1168-614) — Report/block | `/mensagens/[id] (modal)` | MSG-012/013 | PUT /v1/me/blocked-users/{userId}; POST /v1/me/conversations/{conversationId}/reports | B7 |
| [BUYER-LEGACY-WEB-018](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1168-693) — Read-only removed-listing chat | `/mensagens/[id] (read only)` | MSG-015, VEH-020 | GET /v1/me/conversations/{conversationId} | B7 |
| [BUYER-LEGACY-WEB-019](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1168-790) — Team-mediated chat | `/mensagens/[id] (legacy)` | MSG-017/020, SEC-010 | GET /v1/me/conversations/{conversationId} | B7 |
| [BUYER-PHASE-04A](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1357-2138) — Notification center design | `/notificacoes (HOLD)` | NOT-001/002/005 | No user notification center read/mark API in v0.2 | B7 · **HOLD:** Do not imply newly approved notification inbox feature |
| [BUYER-CHANGE-PASSWORD](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1212-524) — Change password | `/conta/senha` | AUTH-009/012 | PATCH /v1/me/password | B7 |
| [BUYER-DELETE-ACCOUNT](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1212-690) — Request account deletion | `/conta/exclusao` | AUTH-013/014 | POST /v1/me/deletion-request | B7 · **HOLD:** Legal retention review |
| [BUYER-SEARCH-STATES](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1221-930) — Loading / network / empty | `/veiculos (states)` | SEARCH-001/003 | GET /v1/vehicles | B6 · **HOLD:** Variants, not new routes |
| [BUYER-LEGAL](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1221-1091) — Terms/privacy/help | `/termos; /privacidade; /ajuda` | BUS-010, SEC-007, ADM-016 | Public content endpoint TBD | B6 · **HOLD:** Legal wording controlled |

### A5 · Individual Seller (26 role-specific + 3 shared)

| Figma screen | Proposed route | SRS v0.5 | Proposed v0.2 API | Batch / hold |
|---|---|---|---|---|
| [SELLER-WEB-016](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=625-32) — Seller eligibility application | `/vendedor/solicitacao` | AUTH-008/016/019/027 | POST /v1/seller-applications | B8 |
| [SELLER-WEB-018](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=625-99) — Seller approval status | `/vendedor/solicitacao/status` | AUTH-019/026 | GET /v1/seller-applications/me | B8 |
| [SELLER-WEB-019](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=625-163) — Correction and resubmission | `/vendedor/solicitacao/corrigir` | AUTH-019/026 | PATCH /v1/seller-applications/me | B8 |
| [SELLER-WEB-020](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=625-225) — My listings | `/vendedor/anuncios` | VEH-015/017/026, ADV-011 | GET /v1/my/listings | B8 |
| [SELLER-WEB-023](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=625-302) — Choose category | `/vendedor/anuncios/novo/categoria` | VEH-001/002/015 | GET /v1/catalog/categories | B8 |
| [SELLER-WEB-024](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=625-365) — Vehicle attributes | `/vendedor/anuncios/novo/detalhes` | VEH-002/004/005/007 | GET /v1/catalog/makes; GET /v1/catalog/models | B8 · **HOLD:** Field mandatory matrix pending |
| [SELLER-WEB-025](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=625-443) — Photos and cover | `/vendedor/anuncios/novo/fotos` | VEH-010/011/012 | POST /v1/my/listings/{listingId}/photos | B8 · **HOLD:** Media policy still technical gate |
| [SELLER-WEB-026](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=625-508) — Preview and submit | `/vendedor/anuncios/novo/revisao` | VEH-015/016/017 | POST /v1/my/listings/{listingId}/submit | B8 |
| [SELLER-WEB-027](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=698-401) — Rejected listing resubmission | `/vendedor/anuncios/[id]/corrigir` | VEH-017/016 | PATCH /v1/my/listings/{listingId}/draft | B8 |
| [SELLER-WEB-028](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=698-472) — Own listing detail | `/vendedor/anuncios/[id]` | VEH-015/019/023/024 | GET /v1/my/listings/{listingId} | B8 |
| [SELLER-WEB-029](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=744-512) — Plan selection | `/vendedor/anuncios/[id]/plano` | ADV-001/002/003, PAY-008 | GET /v1/plans | B8 |
| [SELLER-WEB-030](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=744-599) — Pix checkout | `/vendedor/pedidos/[id]/pix` | PAY-001/008/009 | POST /v1/my/orders/{orderId}/payment-attempts | B8 · **HOLD:** PSP hold; no real checkout mock |
| [SELLER-WEB-031](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=744-685) — Card checkout | `/vendedor/pedidos/[id]/cartao` | PAY-002/007/008 | POST /v1/my/orders/{orderId}/payment-attempts | B8 · **HOLD:** PSP hold |
| [SELLER-WEB-032](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=744-774) — Payment status | `/vendedor/pedidos/[id]/status` | PAY-008/009/022, ADV-013 | GET /v1/my/orders/{orderId}/payment-attempts/{paymentAttemptId} | B8 · **HOLD:** Do not fake payment confirmation |
| [SELLER-WEB-033](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=764-568) — Payment history | `/vendedor/pagamentos` | PAY-021/022 | GET /v1/me/payment-history | B8 |
| [SELLER-WEB-034](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=698-547) — Published listing edit | `/vendedor/anuncios/[id]/editar` | VEH-018/019 | POST /v1/my/listings/{listingId}/revisions | B8 |
| [SELLER-WEB-035](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=698-622) — Pending revision comparison | `/vendedor/anuncios/[id]/revisoes` | VEH-018/019 | GET /v1/my/listings/{listingId}/revisions | B8 |
| [SELLER-WEB-036](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=764-660) — Renewal | `/vendedor/anuncios/[id]/renovar` | ADV-009/010, VEH-025 | POST /v1/my/listings/{listingId}/renewal-order | B8 · **HOLD:** Grace cutoff unresolved |
| [SELLER-WEB-037](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=764-748) — Featured boost | `/vendedor/anuncios/[id]/impulsionar` | ADV-006/007, PAY-011 | POST /v1/my/listings/{listingId}/boost-order | B8 · **HOLD:** PSP hold |
| [SELLER-WEB-038](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=773-638) — Sold listing removal | `/vendedor/anuncios/[id]/vendido` | VEH-020/021, ADV-012, MSG-015 | POST /v1/my/listings/{listingId}/remove | B8 |
| [SELLER-WEB-039](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=775-666) — Seller analytics | `/vendedor/anuncios/[id]/estatisticas` | ANA-001/002, VEH-026 | GET /v1/my/listings/{listingId}/analytics | B8 · **HOLD:** No unverified customer/sales counts |
| [SELLER-WEB-045](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=791-694) — Seller inbox | `/vendedor/mensagens` | MSG-007/008/011 | GET /v1/me/conversations | B8 · **HOLD:** Mobile counterpart not found in inspected Seller page |
| [SELLER-WEB-046](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=791-772) — Seller reply | `/vendedor/mensagens/[id]` | MSG-002/003/004/006 | GET/POST /v1/me/conversations/{conversationId}/messages | B8 · **HOLD:** Mobile counterpart not found |
| [SELLER-WEB-048](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=791-846) — Seller report/block/hide | `/vendedor/mensagens/[id]/acoes` | MSG-011/012/013 | POST /v1/me/conversations/{conversationId}/reports | B8 · **HOLD:** Mobile counterpart not found |
| [SELLER-WEB-049](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=817-1179) — Refund request | `/vendedor/pedidos/[id]/reembolso` | PAY-018/019 | POST /v1/my/orders/{orderId}/refund-requests | B8 · **HOLD:** 7-day clock; legal hold; mobile counterpart not found |
| [SELLER-WEB-050](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=817-1314) — Refund/payment state | `/vendedor/reembolsos` | PAY-019/021 | GET /v1/me/refund-requests | B8 · **HOLD:** Mobile counterpart not found |
| [SELLER-WEB-012](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1099-1379) — Account settings | `/conta/configuracoes` | AUTH-012 | GET/PATCH /v1/me | B8 · **HOLD:** Shared account screen |
| [SELLER-WEB-051](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1099-1619) — Legal/privacy view | `/privacidade` | BUS-010, SEC-007 | GET /v1/admin/content/{pageKey} (admin only) | B8 · **HOLD:** Public content retrieval route needs confirmation |
| [SELLER-WEB-052](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1099-1505) — Public help | `/ajuda` | AUTH-025, ADM-016 | Contract pending | B8 · **HOLD:** No invented support ticket backend |

### A6 · Dealership (4)

| Figma screen | Proposed route | SRS v0.5 | Proposed v0.2 API | Batch / hold |
|---|---|---|---|---|
| [DEALERSHIP-PUBLIC](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1211-2395) — Public dealership showroom | `/concessionarias/[id]` | AUTH-021, VEH-027, SEC-003 | GET /v1/dealerships/{dealerId} | B9 · **HOLD:** No customer ratings/testimonials or public CNPJ |
| [DEALERSHIP-WEB-017](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1575-3428) — Dealership registration application | `/concessionaria/solicitacao` | AUTH-017/019/020 | POST /v1/seller-applications | B9 · **HOLD:** Manual approval, no automatic verified identity |
| [DEALERSHIP-WEB-021](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1592-3472) — Own inventory overview | `/concessionaria/anuncios` | AUTH-020/021, VEH-027 | GET /v1/my/listings | B9 · **HOLD:** Per-vehicle entitlements |
| [DEALERSHIP-WEB-022](https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT/Feira-de-Carros?node-id=1594-3516) — Business profile editor | `/concessionaria/perfil` | AUTH-021, SEC-003 | GET/PATCH /v1/dealerships/me | B9 · **HOLD:** Extra required profile fields not authorized |

### A7 · Known unresolved Figma gaps

| Item | Findings | Resolution |
|---|---|---|
| Admin desktop numbering | ADM-D-004/006/008/011/013/021/022 absent; Figma handoff explicitly tracks them | Reconcile against SRS; do not invent pages just to fill numbering |
| Seller mobile incompleteness | WEB-045/046/048/049/050 and shared WEB-012/051/052 without matching standalone Seller mobile frame in inspected page | Responsive derivation requires QA/design sign-off |
| Auth recovery/verification | SRS v0.5 confirmed, OpenAPI v0.2 incomplete | Add approved contract changes before real actions |
| Refund contract drift | OpenAPI v0.2 still references 3 business days | Update to later seven-day direction subject to legal sign-off |
| Notification center | Figma variant present; source SRS describes alerts/preferences, no specific API inbox/read contract | Hold new data-model implementation |
| Staff operations | 12 operations DENY_PENDING | Keep denied until authorized field-level grants |
