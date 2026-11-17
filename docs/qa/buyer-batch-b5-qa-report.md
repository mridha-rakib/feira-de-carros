# FEIRA DE CARROS — BUYER FRONTEND BATCH B5 QA REPORT
## Messaging, Conversations, Reporting & Safety

**Date**: November 17, 2026  
**Status**: APPROVED / RELEASE READY  
**Application**: `apps/web` (Customer-Facing Buyer Website)  
**Git Branch**: `feat/buyer-b1-discovery-search`  
**Monorepo Invariant**: `apps/admin` strictly frozen (0 line changes)  
**Approved Figma File**: `JlRZIGImV7rRROPZndv6NT` (Buyer Section `733:2` / `1168:*`)  

---

## 1. Executive Summary

Batch B5 completes the core functional implementation of the Feira de Carros Buyer Website. This batch introduces the complete Buyer-to-Seller messaging experience, conversation thread management, safety moderation reporting, user blocking, and official staff mediation presentation.

All 8 planned screen pairs (16 Figma desktop and mobile frames) have been implemented, visually verified, and covered with automated Vitest unit tests and Playwright E2E integration suites.

### Deliverables Completed
1. **BUYER / WEB-012 — Buyer Inbox (`/mensagens`)**:
   - Desktop node `1168:202` | Mobile node `1168:266`.
   - Dual-column responsive layout (Desktop: split inbox list + active thread + right rail; Mobile/Tablet: seamless drill-down with back navigation).
   - Conversation cards with seller avatar, initials, dealership badge, vehicle title, last message preview, timestamp, unread badge pill, and active selection border (`#b91c1c`).
   - Keyword search across conversations and unread filter tabs.
2. **BUYER / WEB-013 — Active Conversation Thread (`/mensagens?id=...`)**:
   - Desktop node `1168:310` | Mobile node `1168:369`.
   - Message direction alignment: Outgoing buyer messages are aligned to the right with `#fee2e2` bubble, `#991b1b` text, and `Você · HH:MM` timestamp; Incoming seller messages are aligned to the left with seller avatar, `#ffffff` bubble with border `#e2e7ee`, and `[Nome] · HH:MM` timestamp.
   - Active thread header with vehicle title linking directly to `/veiculos/[id]`.
   - Options dropdown with one-click actions: "Denunciar anunciante", "Bloquear vendedor", and "Ver anúncio do carro".
   - Right rail featuring vehicle thumbnail, bold price, safety checklist, and privacy assurance notice.
3. **BUYER / WEB-014 — Start Conversation from Listing (`/veiculos/[id]`)**:
   - Desktop node `1168:419` | Mobile node `1168:458`.
   - Connected "Enviar Mensagem" CTA in the contact card and mobile sticky bar.
   - Unauthenticated visitors are prompted by the Auth Gate (`FavoritesLoginModal`) to sign in before messaging.
   - Authenticated buyers open a dedicated message composer modal; upon send, the conversation is deduplicated against existing threads and redirects to `/mensagens?id=${conv.id}`.
4. **BUYER / WEB-015 — Login Required State (`/mensagens`)**:
   - Desktop node `1168:488` | Mobile node `1168:527`.
   - Clean, secure state presented when an unauthenticated guest accesses `/mensagens`.
   - Explains privacy benefits and provides direct CTAs to "Entrar na minha conta" and "Criar conta gratuita" with automatic `?redirect=/mensagens` forwarding.
   - Non-production demonstration helper included for rapid reviewer evaluation.
5. **BUYER / WEB-016 — Empty Inbox State (`/mensagens`)**:
   - Desktop node `1168:557` | Mobile node `1168:590`.
   - Displayed when an authenticated buyer has zero active conversation threads.
   - Direct CTA to explore vehicles in the marketplace (`/veiculos`) and a button to restore demo conversations.
6. **BUYER / WEB-017 — Safety Report and Block Modal**:
   - Desktop node `1168:614` | Mobile node `1168:658`.
   - Accessible modal (`ReportConversationModal.tsx`) with categorized complaint reasons:
     - Pedido de sinal ou pagamento antecipado (anti-fraud priority)
     - Fraude ou anúncio falso
     - Veículo já vendido ou indisponível
     - Comportamento inadequado ou ofensivo
     - Outro motivo
   - Optional details textarea and "Bloquear este vendedor" checkbox.
   - Confirmation step with clear feedback and automatic thread archival.
7. **BUYER / WEB-018 — Read Only / Blocked Conversation (`/mensagens?id=conv-bloqueada-polo`)**:
   - Desktop node `1168:693` | Mobile node `1168:746`.
   - When a conversation is blocked or the listing is sold, the composer input is disabled and replaced with the official security notice: *"Esta conversa está arquivada e não aceita novas mensagens."*
   - Illustrated by deterministic mock thread `conv-bloqueada-polo`.
8. **BUYER / WEB-019 — Official Team Mediated Conversation (`/mensagens?id=conv-mediada-compass`)**:
   - Desktop node `1168:790` | Mobile node `1168:846`.
   - Displays verified blue banner: *"Equipe Feira de Carros • Mediação Oficial"*.
   - Staff messages feature official staff badges (`IconShield`, `#eff6ff` bubble) ensuring staff cannot be spoofed by private sellers.

---

## 2. Monorepo Boundary & Security Enforcement

In accordance with `AGENTS.md` and repository contributor guidelines:
- **`apps/admin` Frozen Invariant**: Exactly **0 lines changed** in `apps/admin`. All changes are strictly confined to `apps/web`.
- **Frontend Only Mandate**: No production databases, WebSockets, real payment gateways, or live backend APIs were instantiated. All state persistence uses deterministic adapters and browser localStorage/cookie sync.
- **Fail-Closed Routing & Middleware**: `apps/web/middleware.ts` allows guest access to canonical authentication entrypoints and public informational gates (`/mensagens`, `/favoritos`), while sensitive seller operations and profile mutations remain strictly gated by session checks.
- **Anti-Scraping Preservation**: Unmasked seller phone numbers remain guarded behind the on-demand interaction barrier (`SellerPhoneModal`). Chat conversations never leak private seller CPFs or sensitive account records.
- **Clear Demo Provenance**: All mock threads and safety logs are clearly identified with deterministic `DEMO DATA` provenance.

---

## 3. Test Suites & Test Count Reconciliation

### Repository-Wide Test Counts (All Workspaces)
| Package / Workspace | Previous Baseline (B4) | Added in B5 | Current Total | Status |
| :--- | :---: | :---: | :---: | :---: |
| `@feira/web` | 115 | +11 | **126** | PASS |
| `@feira/admin` | 89 | 0 | **89** | PASS (Preserved) |
| `@feira/logger` | 7 | 0 | **7** | PASS (Preserved) |
| `@feira/api-client` | 3 | 0 | **3** | PASS (Preserved) |
| `@feira/ui` | 3 | 0 | **3** | PASS (Preserved) |
| `@feira/testing` | 2 | 0 | **2** | PASS (Preserved) |
| **Total Monorepo Tests** | **219** | **+11** | **230** | **100% PASS** |

### Automated Unit Test Suite (`apps/web/src/__tests__/buyer-batch-b5.test.ts`)
11 tests passing in 38ms:
- `WEB-012 & WEB-016: Inbox and Conversation Retrieval`:
  - Retrieves default demo conversations seeded with vehicle linkages.
  - Searches conversations by seller name or vehicle title.
  - Handles empty inbox state cleanly when all conversations are cleared and restores demo baseline.
- `WEB-013: Active Conversation Thread & Direction Alignment`:
  - Sends an outgoing buyer message and appends it with buyer direction alignment (`#fee2e2`, `#991b1b`).
  - Clears unread badge count when a conversation is opened.
- `WEB-014: Start Conversation from Listing & Deduplication`:
  - Creates a new conversation linked to vehicle details when none exists.
  - Deduplicates conversation threads when contacting an already active vehicle listing.
- `WEB-017 & WEB-018: Reporting, Blocking & Read-Only Invariants`:
  - Records safety report and blocks seller when `blockSeller` is true.
  - Rejects sending messages to a blocked or sold conversation thread with error.
- `WEB-019: Official Team Mediation Presentation`:
  - Identifies official team mediated conversations without spoofing private sellers.
- `WEB-015: Authentication State Gate`:
  - Preserves unauthenticated guest state without fabricating unauthorized sessions.

### Playwright E2E Integration Suite (`apps/web/e2e/buyer-b5.spec.ts`)
6 automated journeys running against production build:
1. `WEB-015`: Unauthenticated guest on `/mensagens` renders Login Required State.
2. `WEB-012 & WEB-013`: Authenticated buyer inbox renders search, seller list, active thread header, and safety rail.
3. `WEB-013`: Sending a message updates both the conversation thread and the left-rail last message preview.
4. `WEB-014`: Vehicle details page contact CTA triggers auth gate for guests, allows message composition, and redirects to `/mensagens?id=...`.
5. `WEB-017 & WEB-018`: Safety report modal submission blocks seller and transitions active thread to read-only state.
6. `WEB-019`: Team mediated conversation renders verified official badge and explanation banner.

**Total Playwright Tests across `@feira/web`**: **35 passing tests** on Chromium (0 failures).

---

## 4. Code Quality & Tooling Compliance

- **Biome Formatting & Linting**: `pnpm lint` checked 369 files with 0 errors. Biome rules `a11y/useSemanticElements`, `a11y/noLabelWithoutControl`, and `style/useConst` are strictly satisfied.
- **TypeScript Compilation**: `pnpm check-types` passed with 0 errors across all 7 packages.
- **Next.js Production Build**: `pnpm --filter @feira/web build` compiles 43 static/dynamic routes in 4.5s with zero build warnings.

---

## 5. Visual QA & Responsive Breakpoints

Visual screenshot captures were generated across all 5 mandatory breakpoints:
- Desktop Large: **1440 × 900 px**
- Desktop Standard: **1366 × 768 px**
- Tablet: **768 × 1024 px**
- Mobile Standard: **390 × 844 px**
- Mobile Large: **430 × 932 px**

Stored in: `screenshots/b5/`:
- `web_012_buyer_inbox_*.png`
- `web_013_active_conversation_*.png`
- `web_015_login_required_*.png`
- `web_017_report_modal_*.png`
- `web_018_read_only_*.png`
- `web_019_team_mediated_*.png`

---

## 6. Summary of Completed Buyer Website Batches

With Batch B5 complete, the entire planned Buyer Website roadmap has been realized on branch `feat/buyer-b1-discovery-search`:
- **Batch B1**: Marketplace Discovery & Search (`/`, `/veiculos`, `/localidade`, `/categorias`)
- **Batch B2**: Vehicle Detail, Phone Reveal & Dealership Showrooms (`/veiculos/[id]`, `/concessionarias/[id]`)
- **Batch B3**: Buyer Authentication & Account Management (`/entrar`, `/cadastrar`, `/recuperar-senha`, `/conta`, `/conta/senha`, `/conta/exclusao`)
- **Batch B4**: Favorites, Saved Searches, Alerts & Preferences (`/favoritos`, `/buscas-salvas`, `/conta/alertas`, `/conta/notificacoes`)
- **Batch B5**: Buyer Messaging, Conversations, Safety Reporting & Mediation (`/mensagens`, `/mensagens/[id]`, modal flows)

The project is now fully prepared for **Phase 12 / Final QA, Security Audit, and Backend Integration Readiness**.
