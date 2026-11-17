# Feira de Carros — Seller Website Screen Inventory Audit (Phase 12)

**Audit Date:** November 17, 2026  
**Auditor:** Principal Frontend Engineer, Senior AppSec Engineer & QA Automation Lead  
**Scope:** Complete inventory reconciliation of all 29 primary Seller & Shared Customer Website screens across Next.js 15 (`apps/web`).  
**Approved Design Baseline:** Figma `JlRZIGImV7rRROPZndv6NT` (node `638-399`)  
**Architecture Boundary:** Customer Website (`apps/web`) only; Back-Office Admin (`apps/admin`) frozen; Native Mobile is Buyer-only.

---

## Screen Inventory Summary

| Group | Category | Screen Count | Implementation Status | QA Status |
|---|---|---|---|---|
| **Group 1** | Registration & Dashboard | 4 | 4 / 4 Implemented | **VERIFIED** |
| **Group 2** | Advertisement Creation Wizard | 4 | 4 / 4 Implemented | **VERIFIED** |
| **Group 3** | Listing Management & Revisions | 4 | 4 / 4 Implemented | **VERIFIED** |
| **Group 4** | Plans, Payments & Commercial | 7 | 7 / 7 Implemented | **VERIFIED** |
| **Group 5** | Remaining Seller Features & Shared | 10 | 10 / 10 Implemented | **VERIFIED** |
| **Total** | **All Primary Screens** | **29** | **29 / 29 (100%)** | **100% QA VERIFIED** |

---

## Group 1 — Registration and Dashboard

### WEB-016 — Seller Application Form
- **Canonical Route:** `/vendedor/solicitacao` (public entrypoint)
- **Desktop Figma Frame:** `638:400` (1440px desktop)
- **Mobile Figma Frame:** `1212:2938` (390px mobile)
- **Implemented File:** `apps/web/app/vendedor/solicitacao/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Accessible via header "Vender meu carro" and guest home. Submits to `/vendedor/solicitacao/status`.
- **Functional Behavior:** Multi-field seller onboarding form (Full name, masked CPF, phone, CEP, address, city/state, vehicle category). Enforces mandatory Terms acceptance and LGPD privacy consent.
- **Backend Dependencies:** `POST /api/v1/seller-applications` (submits application payload and receives protocol `SOL-YYYY-XXXX`).
- **Security Concerns:** PII data transit (CPF, address, phone). Must be validated with server-side CPF check. Client form prevents script injection and client-side credential persistence.
- **Visual Fidelity Issues:** None. Aligned with Figma `#c41217` primary accents, radio cards, and error callouts.
- **Final QA Status:** **PASS**

### WEB-018 — Application Status & Protocol Tracking
- **Canonical Route:** `/vendedor/solicitacao/status`
- **Desktop Figma Frame:** `638:480` (1440px desktop)
- **Mobile Figma Frame:** `1212:3050` (390px mobile)
- **Implemented File:** `apps/web/app/vendedor/solicitacao/status/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Accessible after application submission or via account menu. Directs to correction (`/vendedor/solicitacao/corrigir`) or dashboard (`/vendedor/anuncios`) based on status.
- **Functional Behavior:** Displays application status timeline (`PENDING_REVIEW`, `UNDER_ANALYSIS`, `APPROVED`, `CORRECTION_REQUESTED`, `REJECTED`). Protocol number tracking. Developer QA simulation toggle restricted to non-production.
- **Backend Dependencies:** `GET /api/v1/seller-applications/me` (backend authoritative status).
- **Security Concerns:** Must fail closed in production without session cookie; developer status simulator strictly gated by `NODE_ENV !== 'production'`.
- **Visual Fidelity Issues:** None. Progress stepper, status badges, and assistance cards match Figma.
- **Final QA Status:** **PASS**

### WEB-019 — Application Correction Form
- **Canonical Route:** `/vendedor/solicitacao/corrigir`
- **Desktop Figma Frame:** `638:560` (1440px desktop)
- **Mobile Figma Frame:** `1212:3180` (390px mobile)
- **Implemented File:** `apps/web/app/vendedor/solicitacao/corrigir/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Linked from WEB-018 when status is `CORRECTION_REQUESTED`.
- **Functional Behavior:** Shows exact reviewer rejection reason/feedback banner. Allows editing address/phone without mutating government-verified CPF.
- **Backend Dependencies:** `PATCH /api/v1/seller-applications/me` (resubmission endpoint).
- **Security Concerns:** Government ID (CPF) remains locked and immutable during correction.
- **Visual Fidelity Issues:** None. Amber feedback callout matches Figma node.
- **Final QA Status:** **PASS**

### WEB-020 — Seller Dashboard (My Advertisements)
- **Canonical Route:** `/vendedor/anuncios`
- **Desktop Figma Frame:** `698:401` (1440px desktop)
- **Mobile Figma Frame:** `1212:3320` (390px mobile)
- **Implemented File:** `apps/web/app/vendedor/anuncios/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Main seller hub. Links to ad wizard (`/vendedor/anuncios/novo`), listing detail (`/vendedor/anuncios/[id]`), payments, and messages.
- **Functional Behavior:** 4 KPI overview cards (Total ads, Active, In Review, Sold). Status filter pills (Todos, Publicados, Em análise, Pendente pgto, Vendidos). Sorting (recent, price). Search input. Empty-state handler.
- **Backend Dependencies:** `GET /api/v1/seller/listings` (listing list & KPIs).
- **Security Concerns:** Strict ownership enforcement; must not list advertisements belonging to other sellers.
- **Visual Fidelity Issues:** None. Vehicle card layout, image ratios, and badge colors match Figma.
- **Final QA Status:** **PASS**

---

## Group 2 — Advertisement Creation Wizard

### WEB-023 — Ad Creation Step 1: Choose Category
- **Canonical Route:** `/vendedor/anuncios/novo/categoria` (and redirect `/vendedor/anuncios/novo`)
- **Desktop Figma Frame:** `698:472` (1440px desktop)
- **Mobile Figma Frame:** `1212:3460` (390px mobile)
- **Implemented File:** `apps/web/app/vendedor/anuncios/novo/categoria/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Wizard step 1/4. Next button advances to `/vendedor/anuncios/novo/detalhes`.
- **Functional Behavior:** Category selection cards (Carros / Utilitários, Motos, Caminhões / Ônibus). Persists category in client wizard store.
- **Backend Dependencies:** `GET /api/v1/categories` (catalog taxonomy).
- **Security Concerns:** Validation of category slugs.
- **Visual Fidelity Issues:** None. Radio cards with active red border `#c41217` match Figma.
- **Final QA Status:** **PASS**

### WEB-024 — Ad Creation Step 2: Vehicle Details
- **Canonical Route:** `/vendedor/anuncios/novo/detalhes`
- **Desktop Figma Frame:** `698:547` (1440px desktop)
- **Mobile Figma Frame:** `1212:3580` (390px mobile)
- **Implemented File:** `apps/web/app/vendedor/anuncios/novo/detalhes/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Wizard step 2/4. Back returns to Step 1; Continue advances to Step 3 (`/fotos`).
- **Functional Behavior:** Form with brand, model, version, year (model/manufacture), fuel, transmission, color, doors, mileage (km), price (R$), city, state, description. Real-time BRL currency formatting.
- **Backend Dependencies:** `GET /api/v1/catalog/brands`, `GET /api/v1/catalog/models`.
- **Security Concerns:** Input sanitization on description; price integer parsing (cents).
- **Visual Fidelity Issues:** None. Two-column responsive desktop form; single-column mobile stack.
- **Final QA Status:** **PASS**

### WEB-025 — Ad Creation Step 3: Photos and Commercial Plan Selection
- **Canonical Route:** `/vendedor/anuncios/novo/fotos`
- **Desktop Figma Frame:** `698:622` (1440px desktop)
- **Mobile Figma Frame:** `1212:3700` (390px mobile)
- **Implemented File:** `apps/web/app/vendedor/anuncios/novo/fotos/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Wizard step 3/4. Back to Step 2; Continue to Step 4 (`/revisao`).
- **Functional Behavior:** Photo upload drag-and-drop zone with preview cards. Cover photo indicator. Photo count limit enforcement based on selected plan (Basic: up to 5 photos, Extended: up to 10 photos). Interactive plan selection (Basic R$ 30,00 / Extended R$ 50,00).
- **Backend Dependencies:** `POST /api/v1/uploads/presigned-url` (S3/GCS direct image upload).
- **Security Concerns:** MIME type validation, max file size enforcement (5MB per photo).
- **Visual Fidelity Issues:** None. Photo grid layout and plan selection radio cards match Figma.
- **Final QA Status:** **PASS**

### WEB-026 — Ad Creation Step 4: Preview and Submission
- **Canonical Route:** `/vendedor/anuncios/novo/revisao`
- **Desktop Figma Frame:** `701:457` (1440px desktop)
- **Mobile Figma Frame:** `1212:3820` (390px mobile)
- **Implemented File:** `apps/web/app/vendedor/anuncios/novo/revisao/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Wizard step 4/4. Back to Step 3. Submit redirects to `/vendedor/anuncios` or `/vendedor/anuncios/[id]/plano`.
- **Functional Behavior:** Comprehensive vehicle summary preview card, thumbnail gallery, plan summary, price callout, and moderation terms acknowledgment. Submission dispatches listing creation in demo mode.
- **Backend Dependencies:** `POST /api/v1/seller/listings` (listing submission to moderation pipeline).
- **Security Concerns:** Client-side submission must not bypass mandatory moderation or plan checkout.
- **Visual Fidelity Issues:** None. Preview card typography and action buttons match Figma.
- **Final QA Status:** **PASS**

---

## Group 3 — Listing Management

### WEB-027 — Rejected Listing Correction
- **Canonical Route:** `/vendedor/anuncios/[id]/corrigir`
- **Desktop Figma Frame:** `701:529` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation (M01-M04 pattern)
- **Implemented File:** `apps/web/app/vendedor/anuncios/[id]/corrigir/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from listing detail when listing status is `CORRECTION_REQUESTED`.
- **Functional Behavior:** Displays moderator rejection reason banner. Form pre-filled with existing data. Highlights rejected attributes (e.g. invalid price or photos). Resubmission transitions listing to `PENDING_REVIEW`.
- **Backend Dependencies:** `PATCH /api/v1/seller/listings/{id}` (update and resubmit for moderation).
- **Security Concerns:** Seller ownership validation (HTTP 403 if listing belongs to another user).
- **Visual Fidelity Issues:** None. Matches Figma banner styling and card boundaries.
- **Final QA Status:** **PASS**

### WEB-028 — Listing Detail (Seller Cockpit)
- **Canonical Route:** `/vendedor/anuncios/[id]`
- **Desktop Figma Frame:** `701:601` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation (M01-M04 pattern)
- **Implemented File:** `apps/web/app/vendedor/anuncios/[id]/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from `/vendedor/anuncios` cards. Links to edit, statistics, renew, boost, mark as sold.
- **Functional Behavior:** Full vehicle detail cockpit: interactive photo gallery, status badge, action bar, 4 performance metric cards, vehicle specs, publication timeline, and moderation notes.
- **Backend Dependencies:** `GET /api/v1/seller/listings/{id}`.
- **Security Concerns:** Safe 404 UI for unknown listing IDs; no cross-account data leakage.
- **Visual Fidelity Issues:** None. Gallery thumbnail strip and specs grid match Figma.
- **Final QA Status:** **PASS**

### WEB-034 — Published Listing Edit
- **Canonical Route:** `/vendedor/anuncios/[id]/editar`
- **Desktop Figma Frame:** `701:673` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation
- **Implemented File:** `apps/web/app/vendedor/anuncios/[id]/editar/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from WEB-028 "Editar anúncio".
- **Functional Behavior:** Allows modifying vehicle description, mileage, price, and photos. Notice informing seller that critical changes trigger re-moderation while public ad remains live.
- **Backend Dependencies:** `POST /api/v1/seller/listings/{id}/revisions`.
- **Security Concerns:** Enforces published data immutability until moderator signs off on revision.
- **Visual Fidelity Issues:** None. Matches Figma edit layout.
- **Final QA Status:** **PASS**

### WEB-035 — Revision Comparison
- **Canonical Route:** `/vendedor/anuncios/[id]/revisoes`
- **Desktop Figma Frame:** `701:745` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation
- **Implemented File:** `apps/web/app/vendedor/anuncios/[id]/revisoes/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from WEB-028 when `pendingRevision` is active.
- **Functional Behavior:** Side-by-side comparison of current published attributes vs. proposed pending revision attributes. Visual diff highlight badges.
- **Backend Dependencies:** `GET /api/v1/seller/listings/{id}/revisions/latest`.
- **Security Concerns:** Read-only comparison; prevents tampering with approval workflow.
- **Visual Fidelity Issues:** None. Clear two-column diff cards match Figma.
- **Final QA Status:** **PASS**

---

## Group 4 — Plans and Payments

### WEB-029 — Commercial Plan Selection
- **Canonical Route:** `/vendedor/anuncios/[id]/plano`
- **Desktop Figma Frame:** `744:599` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation
- **Implemented File:** `apps/web/app/vendedor/anuncios/[id]/plano/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Accessible after ad creation or from listing detail. Directs to PIX (`/pedidos/[id]/pix`) or Card (`/pedidos/[id]/cartao`).
- **Functional Behavior:** Plan comparison cards: Plano Básico (R$ 30,00 / 30 dias / até 5 fotos) vs Plano Estendido (R$ 50,00 / 60 dias / até 10 fotos). Feature checklists. Payment method selector (PIX / Cartão de Crédito). Order creation trigger.
- **Backend Dependencies:** `GET /api/v1/plans`, `POST /api/v1/seller/orders`.
- **Security Concerns:** Price integrity; server must validate plan price independently of client form.
- **Visual Fidelity Issues:** None. Plan card dimensions, badges, and pricing typography match Figma.
- **Final QA Status:** **PASS**

### WEB-030 — PIX Payment Checkout
- **Canonical Route:** `/vendedor/pedidos/[id]/pix`
- **Desktop Figma Frame:** `744:685` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation
- **Implemented File:** `apps/web/app/vendedor/pedidos/[id]/pix/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from WEB-029 when PIX selected. Directs to status (`/status`).
- **Functional Behavior:** QR code display, PIX Copia e Cola string with one-click copy button and feedback toast. Countdown timer (15 minutes). Polling simulation for payment confirmation.
- **Backend Dependencies:** `GET /api/v1/payments/orders/{id}/pix` (returns QR code & emv string from PSP).
- **Security Concerns:** PSP integration is on HOLD: clearly marked as demo environment without real banking transactions.
- **Visual Fidelity Issues:** None. QR code card, instructions, and copy field match Figma.
- **Final QA Status:** **PASS**

### WEB-031 — Credit Card Payment Checkout
- **Canonical Route:** `/vendedor/pedidos/[id]/cartao`
- **Desktop Figma Frame:** `744:774` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation
- **Implemented File:** `apps/web/app/vendedor/pedidos/[id]/cartao/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from WEB-029 when Credit Card selected. Directs to status (`/status`).
- **Functional Behavior:** Cardholder name, card number with Luhn mask, expiry date (MM/YY), CVV (3-4 digits), CPF of cardholder, installment dropdown (1x à vista). Submit dispatches card payment in demo mode.
- **Backend Dependencies:** Hosted field tokenization / PSP direct tokenization endpoint (`POST /tokens`).
- **Security Concerns:** Card details MUST NEVER touch our backend servers (PCI-DSS compliance). Form uses simulated tokenization for visual QA.
- **Visual Fidelity Issues:** None. Secure checkout card, lock icon, and SSL badge match Figma.
- **Final QA Status:** **PASS**

### WEB-032 — Payment Confirmation & Status
- **Canonical Route:** `/vendedor/pedidos/[id]/status`
- **Desktop Figma Frame:** `764:568` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation
- **Implemented File:** `apps/web/app/vendedor/pedidos/[id]/status/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from checkout or `/vendedor/pagamentos`.
- **Functional Behavior:** Order confirmation card: status icon (green check for paid, clock for pending, red cross for expired), order protocol, transaction date, plan activated, invoice download button, return to dashboard.
- **Backend Dependencies:** `GET /api/v1/payments/orders/{id}/status`.
- **Security Concerns:** Backend authoritative payment verification.
- **Visual Fidelity Issues:** None. Confirmation badge and receipt summary match Figma.
- **Final QA Status:** **PASS**

### WEB-033 — Payment History & Invoices
- **Canonical Route:** `/vendedor/pagamentos`
- **Desktop Figma Frame:** `764:660` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation
- **Implemented File:** `apps/web/app/vendedor/pagamentos/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Linked from SellerHeader and bottom nav. Links to `/status`, `/reembolsos`, and refund request.
- **Functional Behavior:** Payment history table: Listing title & thumbnail, plan/boost type, amount formatted, status badge (`PAID`, `PENDING`, `EXPIRED`), expiry date, view action, refund action. Search by vehicle/protocol. Status and plan filter dropdowns.
- **Backend Dependencies:** `GET /api/v1/seller/payments`.
- **Security Concerns:** Strict data isolation; seller can only see own invoices.
- **Visual Fidelity Issues:** None. Table columns, mobile overflow scroll, and filter bar match Figma.
- **Final QA Status:** **PASS**

### WEB-036 — Listing Renewal Flow
- **Canonical Route:** `/vendedor/anuncios/[id]/renovar`
- **Desktop Figma Frame:** `764:748` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation
- **Implemented File:** `apps/web/app/vendedor/anuncios/[id]/renovar/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from listing detail cockpit.
- **Functional Behavior:** Vehicle renewal card: shows current expiry, renewal plan duration options (30 days R$ 30,00 / 60 days R$ 50,00), payment method selection, new expiration calculation.
- **Backend Dependencies:** `POST /api/v1/seller/listings/{id}/renew`.
- **Security Concerns:** Renewal only allowed for published or expiring listings; server-side expiration update.
- **Visual Fidelity Issues:** None. Duration selection cards and renewal notice match Figma.
- **Final QA Status:** **PASS**

### WEB-037 — Featured Listing Boost
- **Canonical Route:** `/vendedor/anuncios/[id]/impulsionar`
- **Desktop Figma Frame:** `764:836` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation
- **Implemented File:** `apps/web/app/vendedor/anuncios/[id]/impulsionar/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from listing detail cockpit.
- **Functional Behavior:** Destaque Promocional card: 7 days highlight on homepage and top of category search. Price: R$ 10,00. Benefit list (up to 3x more views, badge "Destaque", priority search). Payment method selection.
- **Backend Dependencies:** `POST /api/v1/seller/listings/{id}/boost`.
- **Security Concerns:** No fake boost activation; requires paid order confirmation.
- **Visual Fidelity Issues:** None. Gold star icon, boost card callout, and pricing match Figma.
- **Final QA Status:** **PASS**

---

## Group 5 — Remaining Seller Features & Shared

### WEB-038 — Mark Listing as Sold
- **Canonical Route:** `/vendedor/anuncios/[id]/vendido`
- **Desktop Figma Frame:** `2802:2283` (overlay / modal / flow), `773:638`
- **Mobile Figma Frame:** `773:638` (responsive mobile card)
- **Implemented File:** `apps/web/app/vendedor/anuncios/[id]/vendido/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from listing detail action bar.
- **Functional Behavior:** Sale confirmation dialog & dedicated view: radio selector for sale channel (Vendido através da Feira de Carros / Vendido por outros canais), feedback rating prompt, irreversible status warning callout, confirm button.
- **Backend Dependencies:** `POST /api/v1/seller/listings/{id}/sold`.
- **Security Concerns:** Once marked sold, vehicle cannot be published again without full re-moderation. Safe 404 for unknown IDs.
- **Visual Fidelity Issues:** None. Warning callout and channel selection radios match Figma.
- **Final QA Status:** **PASS**

### WEB-039 — Seller Listing Analytics & Metrics
- **Canonical Route:** `/vendedor/anuncios/[id]/estatisticas`
- **Desktop Figma Frame:** `775:666` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation (stacked cards)
- **Implemented File:** `apps/web/app/vendedor/anuncios/[id]/estatisticas/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from listing detail "Ver estatísticas".
- **Functional Behavior:** 7-day performance metrics: total impressions, vehicle detail views, buyer contacts initiated. Click-through rate (CTR %) badge and contact conversion rate. Daily performance bar chart trend. Data isolation enforcement: unknown listing IDs strictly return 404 Not Found.
- **Backend Dependencies:** `GET /api/v1/seller/listings/{id}/analytics`.
- **Security Concerns:** **STRICT DATA ISOLATION FIX APPLIED**: Unknown IDs never return fallback data belonging to another listing.
- **Visual Fidelity Issues:** None. Chart layout and KPI metrics cards match Figma.
- **Final QA Status:** **PASS**

### WEB-045 — Seller Messaging Inbox
- **Canonical Route:** `/vendedor/mensagens`
- **Desktop Figma Frame:** `791:694` (1440px desktop split-pane)
- **Mobile Figma Frame:** `2725:2191` (mobile master-detail navigation)
- **Implemented File:** `apps/web/app/vendedor/mensagens/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Linked from SellerHeader and mobile bottom nav. Selecting a conversation loads chat.
- **Functional Behavior:** Conversation list with buyer name, avatar initials, vehicle title, last message snippet, timestamp, and unread count badge. Status tabs: Todas, Não lidas, Arquivadas. Live search filter. On desktop: split view with active chat; on mobile: navigates to `/vendedor/mensagens/[id]`.
- **Backend Dependencies:** `GET /api/v1/messages/conversations`.
- **Security Concerns:** Cross-user message isolation; buyer and seller roles strictly separated.
- **Visual Fidelity Issues:** None. Message preview list and unread badge styling match Figma.
- **Final QA Status:** **PASS**

### WEB-046 — Conversation Chat Thread & Reply
- **Canonical Route:** `/vendedor/mensagens/[id]`
- **Desktop Figma Frame:** `791:772` (1440px desktop)
- **Mobile Figma Frame:** `2725:2191` (390px mobile)
- **Implemented File:** `apps/web/app/vendedor/mensagens/[id]/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from inbox and directly accessible by ID. Links to safety actions (`/acoes`).
- **Functional Behavior:** Full conversation history thread: alternating buyer (left/gray) and seller (right/brand) message bubbles. Timestamp labels. Vehicle banner preview above chat. Photo attachment thumbnails. Message reply input and send action.
- **Backend Dependencies:** `GET /api/v1/messages/conversations/{id}/messages`, `POST /api/v1/messages/send`.
- **Security Concerns:** Unknown conversation IDs return safe Not Found UI. Chat message persistence is demo-only without backend API.
- **Visual Fidelity Issues:** None. Chat bubble radii, colors, and timestamps match Figma.
- **Final QA Status:** **PASS**

### WEB-048 — Conversation Safety Actions (Report / Block / Hide)
- **Canonical Route:** `/vendedor/mensagens/[id]/acoes`
- **Desktop Figma Frame:** `791:846` (1440px desktop)
- **Mobile Figma Frame:** `2802:2386` (390px mobile)
- **Implemented File:** `apps/web/app/vendedor/mensagens/[id]/acoes/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from conversation header safety icon. Back button returns to `/vendedor/mensagens/[id]`.
- **Functional Behavior:** Safety actions menu: Denunciar comprador (reason selection + details), Bloquear comprador (prevents further messages), Ocultar conversa (archives from inbox). Confirmation dialogs with instant visual feedback banner.
- **Backend Dependencies:** `POST /api/v1/messages/conversations/{id}/report`, `POST /api/v1/messages/conversations/{id}/block`.
- **Security Concerns:** Safety reports routed to back-office moderation queue; no client-side arbitrary unblocking.
- **Visual Fidelity Issues:** None. Safety action cards with alert icons match Figma.
- **Final QA Status:** **PASS**

### WEB-049 — Order Refund Request Form
- **Canonical Route:** `/vendedor/pedidos/[id]/reembolso`
- **Desktop Figma Frame:** `817:1179` (1440px desktop)
- **Mobile Figma Frame:** `2802:2466` (390px mobile)
- **Implemented File:** `apps/web/app/vendedor/pedidos/[id]/reembolso/page.tsx`
- **Render Status:** Dynamic (`ƒ`) on demand.
- **Navigation Status:** Linked from `/vendedor/pagamentos` paid invoice rows. Directs to `/vendedor/reembolsos`.
- **Functional Behavior:** Order summary card (ad title, plan, amount paid, payment method). Legal criteria callout (7-day cancellation right under CDC Art. 49). Reason dropdown (Não desejo continuar, Veículo vendido antes do término, Problemas técnicos, Cobrança indevida, Outro). Details textarea. Manual review notice: explicit disclaimer that request is submitted for administrative review and does not constitute automated gateway payout.
- **Backend Dependencies:** `POST /api/v1/payments/orders/{id}/refund`.
- **Security Concerns:** Only paid orders are eligible; prevents duplicate submissions; unknown IDs show safe 404 UI.
- **Visual Fidelity Issues:** None. Form alignment and policy card match Figma.
- **Final QA Status:** **PASS**

### WEB-050 — Refund History and Status Tracking
- **Canonical Route:** `/vendedor/reembolsos`
- **Desktop Figma Frame:** `817:1314` (1440px desktop)
- **Mobile Figma Frame:** Approved responsive derivation (card list)
- **Implemented File:** `apps/web/app/vendedor/reembolsos/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Linked from `/vendedor/pagamentos` header action button.
- **Functional Behavior:** Overview KPI cards (Total solicitações, Em análise, Aprovadas). Table of refund requests: Protocol (`REF-YYYY-XXX`), Order ID, Vehicle title, Amount formatted, Reason, Status badge (`REQUESTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`), Date. Search filter.
- **Backend Dependencies:** `GET /api/v1/payments/refunds`.
- **Security Concerns:** Strict data isolation; only displays user's own refund records.
- **Visual Fidelity Issues:** None. Status badges and refund table match Figma.
- **Final QA Status:** **PASS**

### WEB-012 — Shared User Account Settings
- **Canonical Route:** `/conta/configuracoes` (and `/vendedor/conta` link)
- **Desktop Figma Frame:** `1099:1379` (1440px desktop)
- **Mobile Figma Frame:** `1099:1426` (390px mobile)
- **Implemented File:** `apps/web/app/conta/configuracoes/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Accessible via user account dropdown and `/vendedor/conta`.
- **Functional Behavior:** Unified account cockpit: Personal profile section (Name, Email verified badge, Phone with mask and edit toggle, City/State). Identity section with **masked CPF (`***.456.789-**`) locked against edition**. Notification preferences toggles (E-mail marketing, WhatsApp alerts, New message alerts, Status updates). Seller role badge.
- **Backend Dependencies:** `GET /api/v1/users/me`, `PATCH /api/v1/users/me`.
- **Security Concerns:** Production fail-closed protection added to Next.js middleware. CPF is permanently read-only on the client to protect government identity records.
- **Visual Fidelity Issues:** None. Profile card, masked input field, and toggle switches match Figma.
- **Final QA Status:** **PASS**

### WEB-051 — Privacy Policy & LGPD Legal Terms
- **Canonical Route:** `/privacidade`
- **Desktop Figma Frame:** `1099:1619` (1440px desktop)
- **Mobile Figma Frame:** `1099:1666` (390px mobile)
- **Implemented File:** `apps/web/app/privacidade/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Linked from footer, legal consent checkboxes, and account settings.
- **Functional Behavior:** Complete legal documentation conforming to Brazilian General Data Protection Law (LGPD - Lei nº 13.709/2018). Sections: Data controller identity, types of personal data collected, legal basis, data sharing, storage and security, rights of data subjects (access, rectification, deletion), DPO contact channel (`dpo@feiradecarros.com.br`).
- **Backend Dependencies:** Static content / CMS delivery (`GET /api/v1/content/privacy`).
- **Security Concerns:** Content authenticity; no fabricated commercial guarantees.
- **Visual Fidelity Issues:** None. Clear typography, numbered sections, and contact callout match Figma.
- **Final QA Status:** **PASS**

### WEB-052 — Help Center & Support
- **Canonical Route:** `/ajuda`
- **Desktop Figma Frame:** `1099:1505` (1440px desktop)
- **Mobile Figma Frame:** `1099:1536` (390px mobile)
- **Implemented File:** `apps/web/app/ajuda/page.tsx`
- **Render Status:** Static prerendered (`○`), client hydration verified.
- **Navigation Status:** Linked from top navigation, footer, and mobile bottom nav.
- **Functional Behavior:** Interactive Help Center: Search bar for knowledge base. 4 category cards (Como anunciar, Pagamentos e planos, Segurança e privacidade, Dúvidas de compradores). Expandable accordion FAQs with smooth disclosure. Direct support contact channels (WhatsApp, E-mail, Phone hours).
- **Backend Dependencies:** CMS / Support API (`GET /api/v1/support/faq`).
- **Security Concerns:** Safe external links with `rel="noopener noreferrer"`.
- **Visual Fidelity Issues:** None. Accordion styling, category icons, and search input match Figma.
- **Final QA Status:** **PASS**

---

## Inventory Audit Conclusion
All 29 primary screens are **100% implemented** in `apps/web`, mapped to approved Figma nodes or responsive derivations, covered by TypeScript types and presentation adapters, and verified with zero compilation or runtime errors.
