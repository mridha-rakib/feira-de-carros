# Feira de Carros — Shared Authentication Architecture Audit
**Document ID:** `ARCH-AUTH-SHARED-AUDIT-v1.0`  
**Date:** November 17, 2026  
**Auditor:** Senior Software Architect, Application Security Engineer & Frontend Lead  
**Repository:** `mridha-rakib/feira-de-carros`  
**Figma Source of Truth:** File `JlRZIGImV7rRROPZndv6NT` (Pages `733:2`, `638:399`, `1566:2`, `2:8`)  
**Status:** Architecture Specification & Compliance Audit (No production backend code modified)

---

## 1. Executive Summary & AUTH-022 Verdict

### 1.1 AUTH-022 Final Decision: `CONFIRMED: NO`
An explicit client decision has confirmed the business policy for **AUTH-022**:

> **AUTH-022 — Decision:** An existing Buyer cannot become an Individual Seller using the same account.  
> **Direct Mandate:**
> 1. Buyer (`member`) and Individual Seller (`seller`) must have separate accounts.
> 2. Buyer-to-Seller account conversion is strictly prohibited.
> 3. Individual Seller registration must follow the approved Seller application workflow (`WEB-016`).
> 4. Seller ad publishing requires independent Admin approval.
> 5. Dealership (`dealer`) must possess a separate commercial business account (`WEB-017`).
> 6. One Dealership account manages its own vehicle inventory (`WEB-021`).
> 7. Multi-staff Dealership logins are not required for V1.

### 1.2 Core Architectural Principle: Shared Infrastructure ≠ Shared User Accounts
A fundamental distinction must be maintained:
- **Shared Authentication Infrastructure**: A unified, secure, hardened authentication gateway (`POST /v1/auth/login`) and session verification pipeline supporting all public and advertiser personas.
- **Separate User Accounts**: Individual accounts are bound strictly to a single persona (`member`, `seller`, or `dealer`). User profiles, storage keys, authorization scopes, and approval lifecycles are completely decoupled.

---

## 2. Review of Existing Frontend Auth Routes & Current State

| Route | Intended Persona | Implementation Status | Observed Behavior & Findings |
| :--- | :--- | :--- | :--- |
| `/entrar` | Shared Public Entry / Buyer | **Implemented (B3)** | Form validates email/password; includes Google button; offers "Modo Demonstração (Comprador)". Features hardened `getSafeRedirect()` validation. Currently sets `buyer_token` cookie. |
| `/cadastrar` | Buyer Registration | **Implemented (B3)** | Registers buyer (`member`) with 18+ age validation. Contains no seller application fields. |
| `/recuperar-senha` | Password Recovery | **Implemented (B3)** | Simulated password recovery email flow aligned with Figma `845:316`. |
| `/conta` | Buyer Account Dashboard | **Implemented (B3)** | Profile, stats (favoritos, buscas, mensagens), security quick actions. Protected by middleware. |
| `/conta/senha` | Buyer Password Change | **Implemented (B3)** | Re-authenticates current password, applies new password, displays Figma `1212:619` success view. |
| `/conta/exclusao`| Buyer LGPD Deletion | **Implemented (B3)** | Dual-checkbox consent gate issuing simulated `LGPD-xxxxxx` protocol. |
| `/vendedor/solicitacao` | Seller Application | **Implemented (S1)** | Individual seller application with CPF, address, terms. |
| `/vendedor/solicitacao/status` | Seller App Status | **Implemented (S1)** | Approval state tracking (`pending`, `rejected`, `approved`). |
| `/vendedor/anuncios` | Seller Dashboard | **Implemented (S1/S3)** | Seller vehicle listing management. Protected by middleware. |
| `/vendedor/conta` | Seller Account Settings | **Implemented (S5)** | Profile settings and account controls for individual sellers. |
| `/seller/*` | Legacy Aliases | **Implemented (S1)** | Permanent redirects (`301`/`308`) routing to canonical `/vendedor/*`. |
| `/login` | Legacy Alias | **Implemented (B3)** | Redirects to canonical `/entrar`. |
| `/admin/entrar` | Staff Login | **Implemented (Admin)** | Dedicated staff back-office login outside protected AdminShell (`ADM-D-001`). Authenticates `main_admin`, `sales`, `support`. |
| `/concessionaria/solicitacao` | Dealer Registration | **NOT IMPLEMENTED** | Required by Figma `WEB-017` (`1575:3428`). |
| `/concessionaria/anuncios` | Dealer Inventory | **NOT IMPLEMENTED** | Required by Figma `WEB-021` (`1592:3472`). |
| `/concessionaria/perfil` | Dealer Business Profile | **NOT IMPLEMENTED** | Required by Figma `WEB-022` (`1594:3516`). |

---

## 3. Shared Login Architecture Specification

### 3.1 Unified Authentication Endpoint
The backend OpenAPI v0.2 specification defines a single unified login endpoint:
```http
POST /v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Successful Response DTO (`200 OK`):
```json
{
  "token": "eyJhbGciOi...",
  "account": {
    "id": "acc-usr-84920",
    "email": "user@example.com",
    "fullName": "Carlos Silva",
    "role": "member", // "member" | "seller" | "dealer" | "sales" | "support" | "main_admin"
    "status": "active", // "active" | "pending_approval" | "correction_required" | "suspended"
    "dealershipId": null,
    "createdAt": "2026-11-01T10:00:00Z"
  }
}
```

### 3.2 Server-Verified Roles & Account Status Enforcement
Authorization is **never inferred from client-side state, localStorage, or UI element visibility**. Upon successful authentication, the server verifies both the role and account lifecycle status, instructing the frontend router on the mandatory destination:

```
[ POST /v1/auth/login ]
          │
          ├──> 401 Unauthorized (Invalid credentials)
          ├──> 403 Forbidden (Account Suspended -> Figma 1278:1186)
          │
          └──> 200 OK: Inspect { role, status }
                 │
                 ├── Role: "member" (Buyer)
                 │     └── Active -> Redirect to safe return target or /conta
                 │
                 ├── Role: "seller" (Individual Seller)
                 │     ├── status == "pending_approval"   -> Redirect to /vendedor/solicitacao/status (WEB-018)
                 │     ├── status == "correction_required"-> Redirect to /vendedor/solicitacao/corrigir (WEB-019)
                 │     └── status == "active"             -> Redirect to /vendedor/anuncios (WEB-020)
                 │
                 ├── Role: "dealer" (Dealership Advertiser)
                 │     ├── status == "pending_approval"   -> Redirect to /concessionaria/solicitacao/status
                 │     ├── status == "correction_required"-> Redirect to /concessionaria/solicitacao/corrigir
                 │     └── status == "active"             -> Redirect to /concessionaria/anuncios (WEB-021)
                 │
                 └── Role: "main_admin" | "sales" | "support" (Staff)
                       └── Back-office staff -> Redirect to /admin
```

### 3.3 Role-Specific Dashboard Destinations & Boundary Isolation
To guarantee complete isolation between roles:

| Role | Primary Route Shell | Storage Isolation Key | Allowed Route Namespaces | Forbidden Route Namespaces |
| :--- | :--- | :--- | :--- | :--- |
| `member` | `/conta` | `feira_buyer_*` | `/`, `/veiculos/*`, `/favoritos`, `/buscas-salvas`, `/mensagens`, `/conta/*` | `/vendedor/*`, `/concessionaria/*`, `/admin/*` |
| `seller` | `/vendedor/anuncios` | `feira_seller_*` | `/`, `/veiculos/*`, `/vendedor/*` | `/concessionaria/*`, `/admin/*` |
| `dealer` | `/concessionaria/anuncios` | `feira_dealer_*` | `/`, `/veiculos/*`, `/concessionaria/*` | `/vendedor/*`, `/admin/*` |
| `main_admin` | `/admin` | `feira_admin_*` | `/admin/*` | *(Staff back-office strictly segregated)* |

### 3.4 Safe Redirect Handling
The frontend login component (`/entrar`) enforces strict redirect sanitization via `getSafeRedirect()`:
- **Relative Path Validation**: URL must begin with a single slash `/` followed by an alphanumeric character or standard path character.
- **Protocol-Relative Rejection**: URLs starting with `//` (e.g. `//malicious.com`) are rejected.
- **Backslash Rejection**: URLs containing `\` or `/\` are rejected.
- **Role-Aware Destination Check**: If a `member` logs in with `?redirect=/vendedor/anuncios`, the application rejects the cross-role target and routes safely to `/conta`.

---

## 4. Ambiguous Login Identities & Email Reuse Policy (Decision Gate)

### 4.1 The Architectural Dilemma
If a user registers as a Buyer (`member`), can they later register as an Individual Seller (`seller`) or Dealership (`dealer`) using the **exact same email address**?
- **AUTH-022 explicitly states**: "Buyer and Individual Seller must have separate accounts. Buyer-to-Seller account conversion is prohibited."
- **However**: It does not specify whether the same email address can exist twice in the database under different account IDs and roles.

### 4.2 Three Architectural Options

```
                    [ User Enters email@example.com + Password ]
                                          │
                     ┌────────────────────┴────────────────────┐
                     ▼                                         ▼
            [ OPTION A (Strict) ]                     [ OPTION B (Disambiguation) ]
     Single Account per Email.                Multiple Accounts with Same Email.
     Email unique across all roles.           POST /v1/auth/login returns 409 or
     Server uniquely identifies role.         Session includes role picker:
     No collision possible.                   "Entrar como Comprador"
                                              "Entrar como Vendedor"
```

#### Option A: Strict Global Email Uniqueness (Recommended)
- **Rule**: One email = exactly one user account across the entire platform.
- **Behavior**: If `user@empresa.com` is registered as a Buyer, attempting to register with the same email on `/vendedor/solicitacao` or `/concessionaria/solicitacao` yields `409 Conflict: E-mail já cadastrado. Utilize um e-mail diferente para sua conta de anunciante.`
- **Advantages**: Completely eliminates login ambiguity, prevents credential confusion, simplifies password recovery, and adheres to standard security best practices.

#### Option B: Role-Scoped Accounts with Login Disambiguation Challenge
- **Rule**: Email uniqueness is scoped to `(email, role)`. A user may have a Buyer account and a Seller account under the same email.
- **Behavior**: Upon `POST /v1/auth/login`, if multiple accounts share the email and password, the server responds with `200 OK` with an account list or `409 MultipleAccountsFound`, prompting a modal on `/entrar`:
  - *"Encontramos mais de uma conta para este e-mail. Como deseja acessar?"*
  - `[ Acessar como Comprador ]` -> issues `member` session.
  - `[ Acessar como Concessionária ]` -> issues `dealer` session.
- **Drawbacks**: Complex password recovery (which account is being reset?), security risks with credential synchronization, and confusing user experience.

#### Option C: Role-Specific Login Routes
- **Rule**: Separate login routes: `/entrar` (Buyer), `/vendedor/entrar` (Individual Seller), `/concessionaria/entrar` (Dealership).
- **Drawbacks**: Figma does **not** provide separate login screens for sellers or dealerships. Introduces route proliferation inconsistent with approved designs.

> [!IMPORTANT]
> **Formal Recommendation:** Implement **Option A (Strict Global Email Uniqueness)**. If client business requirements require email reuse across personas, implement **Option B** via a clean UI disambiguation modal on `/entrar`.

---

## 5. Summary of Audit Findings & Guardrails

1. **AUTH-022 Compliance**: Fully verified. No conversion mechanisms exist or will be designed.
2. **Figma Fidelity**: Login screen (`845:164`) serves as the universal authentication view for public and advertiser accounts. Staff retains dedicated `/admin/entrar`.
3. **Session Integrity**: Session cookies must carry verified roles, preventing privilege escalation.
4. **Dealership Gap**: Dealership application (`WEB-017`), inventory overview (`WEB-021`), and profile editor (`WEB-022`) must be implemented on dedicated routes with independent state stores.
