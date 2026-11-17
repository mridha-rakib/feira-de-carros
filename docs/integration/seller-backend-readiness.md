# Feira de Carros — Seller Backend Integration Readiness Report (Phase 12)

**Document Version:** 1.0.0  
**Date:** November 17, 2026  
**Auditor:** Principal Frontend Engineer, Senior AppSec Engineer & Software Architect  
**Scope:** Specification of backend API contracts, auth handshakes, data contracts, and integration readiness for the 29 Seller & Shared screens in `apps/web`.  
**Boundary Rule:** Frontend implementation is **complete**; this document details backend integration requirements. **NO BACKEND SERVICES WERE IMPLEMENTED IN THIS PHASE.**

---

## Executive Architecture Overview

The Feira de Carros platform uses a Next.js 15 App Router frontend communicating with backend microservices via the `@feira/api-client` typed package conforming to the OpenAPI v0.2 specification.

### Security Invariants & Role-Based Access Control (RBAC)
1. **Frontend Route Protection is Non-Authoritative**: Next.js edge middleware guards against casual unauthenticated navigation, but fine-grained authorization MUST be validated authoritatively on every backend endpoint.
2. **Session Cookie Integrity**: Possession of cookie `fdc_web_session` indicates an authenticated customer session, but does NOT grant Seller privileges. The backend session validator must check user role and seller application approval state (`role === 'seller'`).
3. **Data Isolation & Tenant Security**: All endpoints querying seller listings, orders, payments, messages, refunds, and profile data must infer the caller identity from the verified session claims (`req.user.id`). Never accept a client-supplied seller identifier in URL query params or request bodies.
4. **Fail-Closed Principle**: Any access to a non-existent or foreign resource (e.g., another seller's listing or conversation) MUST return HTTP 404 (or 403 Forbidden without leaking resource existence).

---

## H1. Authentication & Seller Approval Subsystem

### Integration Context
Individual sellers begin as guest visitors or registered buyers (`member` role). Transitioning to an active seller requires submitting an eligibility application (`WEB-016`), undergoing back-office verification by Admin staff (`apps/admin`), and receiving approval.

### Endpoints & Contracts
1. **`POST /api/v1/seller-applications` (WEB-016)**
   - **Purpose:** Submit initial seller registration application.
   - **Auth:** Authenticated user session (`member` role) or guest with inline account creation credentials.
   - **Payload:**
     ```typescript
     interface CreateSellerApplicationRequest {
       fullName: string;
       cpf: string; // 11 numeric digits, validated with Luhn mod 11
       email: string;
       phone: string; // E.164 or (XX) XXXXX-XXXX
       cep: string; // 8 numeric digits
       address: string;
       city: string;
       state: string; // 2-letter UF
       primaryCategory: 'cars' | 'motorcycles' | 'trucks';
       termsAccepted: boolean; // Must be true
       lgpdConsent: boolean; // Must be true
     }
     ```
   - **Response:** HTTP 201 Created with `{ applicationId: string; protocol: string; status: 'PENDING_REVIEW'; createdAt: string; }`.
   - **Status:** **READY** (Contract matches OpenAPI v0.2 `POST /v1/seller-applications`).

2. **`GET /api/v1/seller-applications/me` (WEB-018)**
   - **Purpose:** Retrieve status and timeline of the current applicant.
   - **Auth:** Mandatory session cookie.
   - **Response:**
     ```typescript
     interface SellerApplicationStatusResponse {
       id: string;
       protocol: string;
       status: 'PENDING_REVIEW' | 'UNDER_ANALYSIS' | 'APPROVED' | 'CORRECTION_REQUESTED' | 'REJECTED';
       statusLabel: string;
       correctionReason?: string;
       rejectionReason?: string;
       submittedAt: string;
       reviewedAt?: string;
       applicant: {
         fullName: string;
         cpfMasked: string;
         email: string;
         phone: string;
         city: string;
         state: string;
       };
     }
     ```
   - **Status:** **READY**.

3. **`PATCH /api/v1/seller-applications/me` (WEB-019)**
   - **Purpose:** Correct requested application attributes following admin review.
   - **Auth:** Applicant with status `CORRECTION_REQUESTED`.
   - **Security Restriction:** CPF remains immutable.
   - **Status:** **READY**.

---

## H2. Vehicle Listings Subsystem

### Integration Context
Sellers create, manage, edit, and track their advertisements. Public visibility requires moderator sign-off and active commercial plan coverage.

### Endpoints & Contracts
1. **`GET /api/v1/seller/listings` (WEB-020)**
   - **Purpose:** Fetch authenticated seller's inventory with status filtering and KPIs.
   - **Query Params:** `status=ALL|PUBLISHED|PENDING_REVIEW|PENDING_PAYMENT|SOLD`, `sort=recent|price_asc|price_desc`, `search=string`.
   - **Response:** List of `SellerListingItem` + aggregated KPI counts (`totalListings`, `activeListings`, `inReviewListings`, `soldListings`).
   - **Status:** **READY**.

2. **`POST /api/v1/seller/listings` (WEB-023 to WEB-026)**
   - **Purpose:** Create new vehicle advertisement draft or submit to moderation.
   - **Payload:** Category, brand, model, version, yearModel, yearManufacture, fuel, transmission, color, doors, mileageKm, priceCents, description, location (city/state), photoUrls (array of string), selectedPlanId ('basic' | 'extended').
   - **Response:** HTTP 201 Created with `{ listingId: string; status: 'PENDING_PAYMENT' | 'PENDING_REVIEW'; orderId?: string; }`.
   - **Status:** **READY**.

3. **`GET /api/v1/seller/listings/{id}` (WEB-028)**
   - **Purpose:** Fetch detailed seller vehicle cockpit data.
   - **Auth/Security:** Server verifies `listing.sellerId === req.user.id`. Returns 404 if not found or unauthorized.
   - **Status:** **READY**.

4. **`POST /api/v1/seller/listings/{id}/revisions` (WEB-034, WEB-035)**
   - **Purpose:** Propose updates to a published listing without unpublishing live public advertisement.
   - **Behavior:** Creates a shadow revision record with status `REVISED_PENDING`. Once admin approves, shadow record merges into live listing.
   - **Status:** **READY**.

5. **`POST /api/v1/seller/listings/{id}/sold` (WEB-038)**
   - **Purpose:** Transition listing to `SOLD` state.
   - **Payload:** `{ saleChannel: 'PLATFORM' | 'EXTERNAL'; feedbackRating?: number; notes?: string; }`.
   - **Status:** **READY**.

---

## H3. Advertisement Plans, Payments & Commercial Subsystem

### Integration Context
Feira de Carros charges individual sellers on a per-advertisement model (Basic: R$ 30,00 for 30 days; Extended: R$ 50,00 for 60 days; Featured Boost: R$ 10,00 for 7 days).

### Payment Gateway Policy & Unresolved Decisions
> [!IMPORTANT]
> **Payment Service Provider (PSP) Integration is on HOLD**:
> Real PSP credentials (e.g., Asaas, PagBank, Mercado Pago, or Stripe Brazil) are not yet finalized in the project requirements.
> 1. Frontend checkout pages (`WEB-030` PIX, `WEB-031` Card) currently present mock checkout flows clearly tagged with `DEMO DATA`.
> 2. Card details MUST NEVER touch Feira de Carros backend application servers (PCI-DSS Level 1 compliance). When PSP is selected, integration MUST use PSP Hosted Fields or SDK tokenization (`tokenizeCard(...) -> card_token`).
> 3. Refund operations (`WEB-049`, `WEB-050`) create a pending customer refund request requiring back-office staff review in `apps/admin`. They do NOT trigger automated automated PSP chargebacks.

### Endpoints & Contracts
1. **`POST /api/v1/seller/orders` (WEB-029, WEB-036, WEB-037)**
   - **Purpose:** Create a commercial charge for ad publication, renewal, or boost.
   - **Payload:** `{ listingId: string; orderType: 'PLAN' | 'RENEWAL' | 'BOOST'; planId: 'basic' | 'extended'; paymentMethod: 'PIX' | 'CREDIT_CARD'; }`.
   - **Response:** `{ orderId: string; amountCents: number; status: 'PENDING'; expiresAt: string; }`.
   - **Status:** **READY**.

2. **`GET /api/v1/payments/orders/{id}/pix` (WEB-030)**
   - **Purpose:** Retrieve PIX QR Code image URL and EMV copy-paste payload.
   - **Status:** **PARTIAL** (Blocked on PSP selection).

3. **`POST /api/v1/payments/orders/{id}/card-charge` (WEB-031)**
   - **Purpose:** Authorize credit card transaction using client-generated token.
   - **Payload:** `{ cardToken: string; installments: number; cardholderCpf: string; }`.
   - **Status:** **BLOCKED** (Requires PSP tokenization contract).

4. **`POST /api/v1/payments/orders/{id}/refund` (WEB-049)**
   - **Purpose:** Submit administrative refund request under CDC 7-day cancellation right.
   - **Payload:** `{ reason: string; details?: string; }`.
   - **Response:** `{ refundId: string; protocol: string; status: 'REQUESTED'; requestedAt: string; }`.
   - **Status:** **READY**.

5. **`GET /api/v1/payments/refunds` (WEB-050)**
   - **Purpose:** List seller's refund history and status.
   - **Status:** **READY**.

---

## H4. Messaging Subsystem

### Integration Context
Buyer-to-seller messaging enables lead generation while keeping user personal contacts private until mutual agreement.

### Endpoints & Contracts
1. **`GET /api/v1/messages/conversations` (WEB-045)**
   - **Purpose:** Retrieve seller conversation inbox with unread counts and vehicle references.
   - **Query Params:** `tab=all|unread|archived`, `search=string`.
   - **Status:** **READY**.

2. **`GET /api/v1/messages/conversations/{id}/messages` (WEB-046)**
   - **Purpose:** Fetch chronological chat thread.
   - **Response:** List of `{ id: string; sender: 'buyer' | 'seller'; senderName: string; text: string; time: string; photos?: string[]; }`.
   - **Status:** **READY**.

3. **`POST /api/v1/messages/conversations/{id}/send` (WEB-046)**
   - **Purpose:** Send a reply message in an active conversation.
   - **Payload:** `{ text: string; photoUrls?: string[]; }`.
   - **Delivery Architecture:** Recommendation: use Server-Sent Events (SSE) or WebSocket gateway for real-time delivery; fallback to HTTP polling.
   - **Status:** **READY** (HTTP contract), **PARTIAL** (Real-time gateway pending infrastructure decision).

4. **`POST /api/v1/messages/conversations/{id}/report` & `/block` (WEB-048)**
   - **Purpose:** Flag abusive buyer or block user from sending further messages.
   - **Status:** **READY**.

---

## H5. Analytics Subsystem

### Integration Context
Sellers track ad views, impressions, and customer leads over 7-day rolling windows.

### Endpoints & Contracts
1. **`GET /api/v1/seller/listings/{id}/analytics` (WEB-039)**
   - **Purpose:** Retrieve daily and aggregate performance metrics.
   - **Security:** Strict data isolation: caller MUST own the listing. Returns 404 for unknown or foreign listings.
   - **Response:**
     ```typescript
     interface ListingAnalyticsResponse {
       listingId: string;
       listingTitle: string;
       periodLabel: string;
       totalImpressions: number;
       totalDetailViews: number;
       totalContactsStarted: number;
       clickThroughRate: number; // percentage e.g. 20.0
       conversionRate: number; // percentage e.g. 6.3
       dailyMetrics: Array<{
         date: string; // YYYY-MM-DD
         dayLabel: string; // e.g. '21 out'
         impressions: number;
         detailViews: number;
         contactsStarted: number;
       }>;
     }
     ```
   - **Status:** **READY**.

---

## H6. Account and Support Subsystem

### Integration Context
User settings, legal documents, and support knowledge base.

### Endpoints & Contracts
1. **`GET /api/v1/users/me` (WEB-012)**
   - **Purpose:** Return personal account settings, notification preferences, and verification status.
   - **Security:** CPF must be returned masked (`***.456.789-**`) to protect PII.
   - **Status:** **READY**.

2. **`PATCH /api/v1/users/me` (WEB-012)**
   - **Purpose:** Update editable account settings (phone, notification preferences).
   - **Security:** Rejects any attempt to mutate `cpf` or `id`.
   - **Status:** **READY**.

3. **`GET /api/v1/content/privacy` & `GET /api/v1/support/faq` (WEB-051, WEB-052)**
   - **Purpose:** Legal text and dynamic FAQ delivery.
   - **Status:** **READY** (Can be statically served or CMS backed).

---

## Comprehensive API Readiness Matrix (All 29 Screens)

| Screen ID | Frontend Route | User Action / Trigger | API Endpoint & Method | Req DTO | Resp DTO | Auth Identity | Required Role | Backend Subsystem | Status | Blocking Decision / Gap | Integration Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **WEB-016** | `/vendedor/solicitacao` | Submit seller application | `POST /v1/seller-applications` | `CreateAppReq` | `AppResp` | Optional / Guest | None / `member` | Identity / Onboarding | **READY** | None | P1 |
| **WEB-018** | `/vendedor/solicitacao/status` | View application status | `GET /v1/seller-applications/me` | None | `AppStatusResp` | Required | `member` | Identity / Onboarding | **READY** | None | P1 |
| **WEB-019** | `/vendedor/solicitacao/corrigir` | Submit corrected application | `PATCH /v1/seller-applications/me` | `PatchAppReq` | `AppStatusResp` | Required | `member` | Identity / Onboarding | **READY** | None | P1 |
| **WEB-020** | `/vendedor/anuncios` | View seller dashboard | `GET /v1/seller/listings` | Query params | `ListingsListResp` | Required | `seller` | Vehicle Inventory | **READY** | None | P1 |
| **WEB-023** | `/vendedor/anuncios/novo/categoria` | Select vehicle category | `GET /v1/catalog/categories` | None | `CategoryList` | Required | `seller` | Catalog Taxonomy | **READY** | None | P1 |
| **WEB-024** | `/vendedor/anuncios/novo/detalhes` | Populate brand/model & specs | `GET /v1/catalog/brands` | Query params | `BrandList` | Required | `seller` | Catalog Taxonomy | **READY** | None | P1 |
| **WEB-025** | `/vendedor/anuncios/novo/fotos` | Upload vehicle photos | `POST /v1/uploads/presigned-url` | `UploadReq` | `PresignedResp` | Required | `seller` | Media Storage (S3/GCS) | **READY** | Cloud storage bucket setup | P1 |
| **WEB-026** | `/vendedor/anuncios/novo/revisao` | Submit listing for moderation | `POST /v1/seller/listings` | `CreateListingReq` | `ListingResp` | Required | `seller` | Vehicle Inventory | **READY** | None | P1 |
| **WEB-027** | `/vendedor/anuncios/[id]/corrigir` | Submit corrected listing | `PATCH /v1/seller/listings/{id}` | `PatchListingReq` | `ListingResp` | Required | `seller` (Owner) | Vehicle Inventory | **READY** | None | P2 |
| **WEB-028** | `/vendedor/anuncios/[id]` | View listing detail cockpit | `GET /v1/seller/listings/{id}` | None | `ListingDetailResp` | Required | `seller` (Owner) | Vehicle Inventory | **READY** | None | P1 |
| **WEB-034** | `/vendedor/anuncios/[id]/editar` | Submit revision of published ad | `POST /v1/seller/listings/{id}/revisions` | `CreateRevisionReq` | `RevisionResp` | Required | `seller` (Owner) | Vehicle Inventory | **READY** | None | P2 |
| **WEB-035** | `/vendedor/anuncios/[id]/revisoes` | Compare revision vs live ad | `GET /v1/seller/listings/{id}/revisions/latest` | None | `RevisionDiffResp` | Required | `seller` (Owner) | Vehicle Inventory | **READY** | None | P2 |
| **WEB-029** | `/vendedor/anuncios/[id]/plano` | Create order for ad plan | `POST /v1/seller/orders` | `CreateOrderReq` | `OrderResp` | Required | `seller` (Owner) | Payments & Plans | **READY** | None | P1 |
| **WEB-030** | `/vendedor/pedidos/[id]/pix` | Fetch PIX QR code & string | `GET /v1/payments/orders/{id}/pix` | None | `PixQrResp` | Required | `seller` (Owner) | Payment Gateway | **PARTIAL** | PSP partner selection on hold | P2 |
| **WEB-031** | `/vendedor/pedidos/[id]/cartao` | Pay order via credit card | `POST /v1/payments/orders/{id}/card-charge` | `CardChargeReq` | `ChargeResp` | Required | `seller` (Owner) | Payment Gateway | **BLOCKED** | PSP tokenizer / Hosted Fields hold | P2 |
| **WEB-032** | `/vendedor/pedidos/[id]/status` | Check order payment status | `GET /v1/payments/orders/{id}/status` | None | `OrderStatusResp` | Required | `seller` (Owner) | Payments & Plans | **READY** | PSP webhook processor | P1 |
| **WEB-033** | `/vendedor/pagamentos` | View payments & invoice history | `GET /v1/seller/payments` | Query params | `PaymentHistoryResp` | Required | `seller` | Payments & Plans | **READY** | None | P1 |
| **WEB-036** | `/vendedor/anuncios/[id]/renovar` | Create renewal order | `POST /v1/seller/orders` (type=RENEWAL) | `CreateOrderReq` | `OrderResp` | Required | `seller` (Owner) | Payments & Plans | **READY** | None | P2 |
| **WEB-037** | `/vendedor/anuncios/[id]/impulsionar` | Create featured boost order | `POST /v1/seller/orders` (type=BOOST) | `CreateOrderReq` | `OrderResp` | Required | `seller` (Owner) | Payments & Plans | **READY** | None | P2 |
| **WEB-038** | `/vendedor/anuncios/[id]/vendido` | Mark listing as sold | `POST /v1/seller/listings/{id}/sold` | `MarkSoldReq` | `ListingResp` | Required | `seller` (Owner) | Vehicle Inventory | **READY** | None | P2 |
| **WEB-039** | `/vendedor/anuncios/[id]/estatisticas` | Fetch 7-day listing metrics | `GET /v1/seller/listings/{id}/analytics` | None | `AnalyticsResp` | Required | `seller` (Owner) | Analytics / Telemetry | **READY** | Aggregation pipeline | P2 |
| **WEB-045** | `/vendedor/mensagens` | View conversation inbox | `GET /v1/messages/conversations` | Query params | `ConversationsList` | Required | `seller` | Messaging Service | **READY** | None | P2 |
| **WEB-046** | `/vendedor/mensagens/[id]` | Load conversation chat thread | `GET /v1/messages/conversations/{id}/messages` | None | `MessagesList` | Required | `seller` (Participant)| Messaging Service | **READY** | None | P2 |
| **WEB-046** | `/vendedor/mensagens/[id]` | Send reply message | `POST /v1/messages/conversations/{id}/send` | `SendMessageReq` | `MessageResp` | Required | `seller` (Participant)| Messaging Service | **PARTIAL** | Real-time WebSocket/SSE hold | P2 |
| **WEB-048** | `/vendedor/mensagens/[id]/acoes` | Report or block buyer | `POST /v1/messages/conversations/{id}/report` | `ReportReq` | `AckResp` | Required | `seller` (Participant)| Moderation & Safety | **READY** | None | P3 |
| **WEB-049** | `/vendedor/pedidos/[id]/reembolso` | Submit refund request | `POST /v1/payments/orders/{id}/refund` | `RefundReq` | `RefundResp` | Required | `seller` (Owner) | Payments & Finance | **READY** | None | P2 |
| **WEB-050** | `/vendedor/reembolsos` | View refund history & status | `GET /v1/payments/refunds` | None | `RefundHistoryResp` | Required | `seller` | Payments & Finance | **READY** | None | P2 |
| **WEB-012** | `/conta/configuracoes` | View/update account settings | `GET/PATCH /v1/users/me` | `PatchUserReq` | `UserProfileResp` | Required | `member`/`seller` | User Identity | **READY** | None | P1 |
| **WEB-051** | `/privacidade` | Read privacy policy | Static / `GET /v1/content/privacy` | None | `ContentResp` | Public | None | CMS / Static | **READY** | None | P3 |
| **WEB-052** | `/ajuda` | Search FAQs & help center | Static / `GET /v1/support/faq` | None | `FaqListResp` | Public | None | CMS / Support | **READY** | None | P3 |

---

## Suggested Phased Integration Plan

```
Phase 1: Identity, Application & Core Catalog (Priority 1)
  ├── 1.1: Session cookie verification & RBAC claims injection (Next.js Middleware + API Gateway)
  ├── 1.2: GET / PATCH /v1/users/me (WEB-012)
  ├── 1.3: POST /v1/seller-applications (WEB-016, WEB-018, WEB-019)
  └── 1.4: GET /v1/catalog/categories, brands, models (WEB-023, WEB-024)

Phase 2: Listing Management, S3 Uploads & Moderation Workflow (Priority 1)
  ├── 2.1: S3 presigned URL generation (WEB-025)
  ├── 2.2: POST /v1/seller/listings (WEB-026)
  ├── 2.3: GET /v1/seller/listings (WEB-020, WEB-028)
  └── 2.4: PATCH /v1/seller/listings/{id} & Revisions (WEB-027, WEB-034, WEB-035, WEB-038)

Phase 3: Orders, Payments & Commercial Activation (Priority 2)
  ├── 3.1: POST /v1/seller/orders (WEB-029, WEB-036, WEB-037)
  ├── 3.2: Payment Service Provider (PSP) selection sign-off (Asaas/MercadoPago/Stripe)
  ├── 3.3: PIX QR code generation & webhook listener (WEB-030, WEB-032)
  ├── 3.4: Card tokenization checkout & anti-fraud verification (WEB-031)
  └── 3.5: GET /v1/seller/payments & Refunds workflow (WEB-033, WEB-049, WEB-050)

Phase 4: Real-Time Messaging & Telemetry (Priority 2-3)
  ├── 4.1: Conversations inbox & message history (WEB-045, WEB-046)
  ├── 4.2: Real-time message exchange via WebSocket or SSE
  ├── 4.3: Safety moderation reports & user blocking (WEB-048)
  └── 4.4: 7-day impression/view aggregation pipeline (WEB-039)
```
