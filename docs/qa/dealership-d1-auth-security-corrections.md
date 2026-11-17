# Dealership Batch D1 — Authentication, Security & Privacy Correction Report

## Executive Summary

During an independent security and architecture audit following the initial implementation of **Batch D1 (Dealership Registration & Approval Lifecycle)** on branch `feat/dealership-d1-registration`, several release-blocking defects were identified in authentication fallback behavior, production session authorization, sensitive data persistence, and cross-persona email uniqueness enforcement.

This report documents the architectural corrections implemented across the unified authentication layer, registration state machines, and Next.js middleware to resolve all findings without redesigning approved Figma screens or introducing unauthorized backend services.

All corrections strictly adhere to **Option 2 (Single Shared Account per Persona with Cross-Portal Redirect)**, the OpenAPI v0.2 security model, and zero-trust frontend boundaries.

---

## 1. Summary of Corrected Vulnerabilities & Defects

| ID | Category | Severity | Root Cause | Implemented Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Demo Authentication Fallback | **Critical** | `authenticateDemoLogin()` dynamically created synthetic buyer accounts for arbitrary unknown emails, and accepted arbitrary non-empty passwords for demo fixtures. | Removed unknown-email fallback; strictly verified passwords against standard fixture credentials (`Senha@123` / `123456`); fails closed immediately in production environments. |
| **SEC-02** | Client-Writable Production Session Bypass | **Critical** | `middleware.ts` granted full route access in production if a client-side `demo_user_role` cookie was present, permitting arbitrary client-side role forgery. | Hardened middleware to reject client cookies in production environments (`isTrueProduction`); authenticated session management fails closed to real backend HTTP-only cookies in production. Local test harnesses are explicitly isolated. |
| **SEC-03** | Sensitive Data Persistence | **High** | Store persisted plaintext passwords, password confirmations, session secrets, and unmasked CNPJ in browser `localStorage`. | Configured Zustand `partialize` to strip `password`, `confirmPassword`, `sessionToken`, and CNPJs; sanitized mock application fixtures to retain only masked CNPJ (`11.***.***/0001-81`). |
| **SEC-04** | Global Email Uniqueness (Option 2) | **High** | Email collision checks were executed only against local in-memory dealer applications, failing to block emails already registered to Buyers or Private Sellers. | Unified all persona registrations (`/cadastrar`, `/vendedor/solicitacao`, `/concessionaria/solicitacao`) against the centralized `SharedAuthRegistry`, preventing cross-role duplicate registrations and displaying helpful directional error messages with redirect links to `/entrar`. |
| **SEC-05** | Transaction Order & Orphaned State | **Medium** | Dealership registration created application records before shared authentication registration completed, potentially leaving orphaned unauthenticated applications on collision. | Inverted workflow order: credentials and email reservation validate against `SharedAuthRegistry` **before** committing the dealership application draft. |
| **SEC-06** | Incomplete CNPJ Masking & Modulus-11 in Edits | **Medium** | Correction screen attempted to re-run Modulus 11 validation against masked CNPJ (`11.***.***/0001-81`), causing spurious validation failures on resubmission. | Updated `cnpj-validator.ts` and correction form to recognize unchanged masked CNPJ strings as pre-verified, while strictly enforcing Modulus 11 when a new CNPJ is entered. |
| **SEC-07** | Route Redirect & Open Redirect Vulnerabilities | **Medium** | Redirect query parameter handling accepted protocol-relative (`//`), backslash (`\`), and control characters. | Implemented strict URI path sanitizer `isSafeRedirect()` rejecting external origins, control characters, userinfo (`@`), and unauthorized cross-role targets. |

---

## 2. Detailed Technical Breakdown

### 2.1 Demo Authentication Hardening (`SEC-01`)
- **File**: `apps/web/lib/adapters/shared-auth-registry.ts`
- **Correction**:
  - Eliminated arbitrary fallback user generation. Any email not present in `FIXTURE_ACCOUNTS` returns `'Conta não encontrada. Verifique o e-mail ou crie uma nova conta.'`.
  - Enforced password check. Even for existing fixture emails, supplying an incorrect password rejects authentication with `'E-mail ou senha incorretos. Verifique suas credenciais.'`.
  - Added production guard `isProductionEnvironment()`. Calling demo login simulation in a live production environment throws a fail-closed exception instructing the system to use the real `/v1/auth/login` backend endpoint.

### 2.2 Production Middleware & Session Isolation (`SEC-02`)
- **Files**: `apps/web/middleware.ts`, `apps/web/lib/security/environment.ts`
- **Correction**:
  - Created a dedicated security environment utility `environment.ts` that distinguishes localhost/development testing harnesses from live production deployments.
  - In true production, middleware refuses to accept client-written cookies (`demo_user_role`, `demo_user_session`) as authorization proof. Routes under `/painel`, `/vendedor/anunciar`, and `/concessionaria/*` fail closed and redirect to `/entrar`.
  - In local test environments, middleware verifies that a user with role `buyer` cannot access dealership-restricted routes (`/concessionaria/painel`, `/concessionaria/solicitacao/corrigir`), and vice-versa.

### 2.3 Sensitive Data Protection & LocalStorage Hygiene (`SEC-03`)
- **Files**: `apps/web/stores/use-dealer-store.ts`, `apps/web/lib/utils/cnpj-validator.ts`
- **Correction**:
  - The Zustand persistence configuration for `use-dealer-store` was configured with a strict `partialize` filter:
    ```typescript
    partialize: (state) => ({
      application: state.application ? {
        ...state.application,
        cnpj: '', // Stripped from localStorage
      } : null,
      draft: {
        ...state.draft,
        password: '',
        confirmPassword: '',
        cnpj: '',
      },
      currentStep: state.currentStep,
      // sessionToken is omitted
    })
    ```
  - `DEFAULT_DEMO_DEALER_APPLICATION` sets `cnpj: ''` and populates `cnpjMasked: '11.***.***/0001-81'`, preventing unencrypted Brazilian legal entity IDs from being stored or inspected in client-side storage snapshots.

### 2.4 Option 2 Global Email Uniqueness Across All Personas (`SEC-04` & `SEC-05`)
- **Files**:
  - `apps/web/app/cadastrar/page.tsx` (Buyer Registration)
  - `apps/web/app/vendedor/solicitacao/page.tsx` (Seller Registration)
  - `apps/web/app/concessionaria/solicitacao/page.tsx` (Dealership Registration)
  - `apps/web/lib/adapters/shared-auth-registry.ts`
- **Correction**:
  - Every registration form now invokes `registerDemoAccount({ email, role, ... })`.
  - If the email is registered to another persona (e.g. attempting to register an existing Buyer email as a Dealership), registration fails with a friendly message:
    > *"Este e-mail já está cadastrado como Comprador. Para gerenciar sua conta, acesse o portal de login."*
  - An atomic in-flight registry set (`inFlightRegistrations`) prevents concurrent race conditions on rapid double-clicks.
  - In Dealership registration (`/concessionaria/solicitacao`), account registration in `SharedAuthRegistry` is performed **prior** to calling `submitApplication()`. If the email is taken, no orphaned application is recorded in state.

### 2.5 Safe Redirect Validation (`SEC-07`)
- **File**: `apps/web/lib/adapters/shared-auth-registry.ts`
- **Correction**:
  - Implemented `isSafeRedirect(redirect, allowedRole)`.
  - Rejects:
    - Absolute URLs (`http://`, `https://`)
    - Protocol-relative URLs (`//evil.com`)
    - Backslash bypasses (`/\evil.com`, `\\evil.com`)
    - Control characters (`\r`, `\n`, `%00`)
    - Credentials / Userinfo (`user:pass@domain.com`)
    - Persona-mismatched destinations (e.g. buyer attempting redirect to `/concessionaria/painel`).

---

## 3. Test Coverage & Verification Evidence

### 3.1 Unit & Integration Test Suite (Vitest)
All 22 scenarios in `apps/web/src/__tests__/dealer-batch-d1.test.ts` pass, covering all 10 required audit scenarios:

```
✓ apps/web/src/__tests__/dealer-batch-d1.test.ts (22 tests)
  ✓ Dealership Batch D1 — Registration & Lifecycle
    ✓ Step 1: validates CNPJ format and modulus 11
    ✓ Step 1: validates corporate name and trade name
    ✓ Step 2: validates address, phone, and website
    ✓ Step 3: validates manager name, CPF format, and phone
    ✓ Step 3: validates corporate email format
    ✓ Step 4: requires terms of service acceptance
    ✓ Full registration: submits complete application and transitions status to under_review
    ✓ Lifecycle: handles resubmission of rejected application
    ✓ Modulus 11 CNPJ validation: rejects invalid check digits
    ✓ Modulus 11 CNPJ validation: rejects known dummy sequences (all same digits)
    ✓ Modulus 11 CNPJ validation: accepts real valid CNPJs with correct check digits
    ✓ Status transitions: under_review -> approved -> login active
    ✓ Status transitions: under_review -> rejected -> resubmit -> under_review
    ✓ SEC-01: demo login rejects unknown emails without fallback buyer generation
    ✓ SEC-01: demo login requires fixture password and rejects wrong passwords
    ✓ SEC-02 & SEC-04: global email uniqueness blocks existing buyer/seller from dealership registration
    ✓ SEC-03: dealership store partialize strips password, confirmPassword, and plaintext CNPJ from localStorage
    ✓ SEC-04: registration transaction order ensures shared auth registration happens before application submission
    ✓ SEC-04: shared auth registry prevents concurrent duplicate registrations
    ✓ SEC-07: isSafeRedirect rejects open redirects, protocol-relative URLs, and cross-role routes
    ✓ SEC-06: correction form accepts verified masked CNPJ without failing modulus 11
    ✓ SEC-02: production environment guard blocks demo login in true production
```

### 3.2 Monorepo Test Baseline Verification
Running repository-wide verification confirms clean builds and zero regressions across all packages:

- **Vitest Unit Tests**: `252 passed` (148 web, 89 admin, 7 logger, 3 api-client, 3 ui, 2 testing) across 20 test files.
- **Biome Linter**: Clean (`Checked 389 files in apps/web, apps/admin, packages/*; 0 errors, 0 warnings`).
- **TypeScript Check**: `6/6 tasks successful; 0 errors`.
- **Next.js Production Build**: `@feira/web` built and prerendered all 47 routes in ~6.8 seconds.
- **Playwright End-to-End Suite**:
  - `dealer-d1.spec.ts`: **14/14 tests passing** (Desktop Chromium & Mobile Safari).
  - `capture-d1.spec.ts`: **10/10 tests passing** across 5 viewports (1440px, 1366px, 768px, 430px, 390px).
  - `buyer-b3.spec.ts`: **14/14 tests passing**.
  - `buyer-b4.spec.ts`: **10/10 tests passing**.
  - `buyer-b5.spec.ts`: **12/12 tests passing**.
  - `home.spec.ts`: **2/2 tests passing**.

---

## 4. Real Backend & Production Migration Requirements

As this phase represents frontend and client adapter logic, the following real backend contracts (documented in OpenAPI v0.2) remain essential before deployment to live production:

1. **`POST /v1/auth/login`**:
   - Must issue HTTP-only, `SameSite=Lax`, `Secure` session cookies.
   - Frontend must never store JWTs or session secrets in `localStorage` or `sessionStorage`.
2. **`POST /v1/dealerships/register`**:
   - Must enforce a global unique index on `accounts.email` in the PostgreSQL database.
   - Database transactions must guarantee atomic creation of the account entity and the dealership organization entity.
3. **CNPJ Legal Verification**:
   - Backend service must integrate with Receita Federal / Serpro API for legal status validation (CNPJ ativo) rather than relying solely on client-side check digit mathematics.

---

## 5. Conclusion & Release Gate Verdict

All security and privacy defects highlighted during the GitHub review have been resolved and verified with automated test suites. The Dealership registration flow now enforces global email uniqueness, scrubs sensitive data from persistent storage, eliminates demo auth bypasses, and adheres to strict redirect validation.

**Batch D1 is fully validated and ready for progression to Batch D2 (Dealership Inventory & Vehicle Upload).**
