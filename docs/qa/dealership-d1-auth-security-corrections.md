# Dealership Batch D1 — Authentication, Security & Privacy Correction Report

## Executive Summary

During an independent security and architecture audit following the initial implementation of **Batch D1 (Dealership Registration & Approval Lifecycle)** on branch `feat/dealership-d1-registration`, several release-blocking defects were identified in authentication fallback behavior, production session authorization, sensitive data persistence, cross-persona email uniqueness enforcement, and request-controlled environment bypasses.

This report documents the architectural corrections implemented across the unified authentication layer, registration state machines, server-side session verifier, and Next.js middleware to resolve all findings without redesigning approved Figma screens or introducing unauthorized backend services.

All corrections strictly adhere to **Option 2 (Single Shared Account per Persona with Cross-Portal Redirect)**, the OpenAPI v0.2 security model, and zero-trust frontend boundaries.

---

## 1. Summary of Corrected Vulnerabilities & Defects

| ID | Category | Severity | Root Cause | Implemented Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Demo Authentication Fallback | **Critical** | `authenticateDemoLogin()` dynamically created synthetic buyer accounts for arbitrary unknown emails, and accepted arbitrary non-empty passwords for demo fixtures. | Removed unknown-email fallback; strictly verified passwords against standard fixture credentials (`Senha@123` / `123456`); fails closed immediately in production environments. |
| **SEC-02** | Client-Writable Production Session Bypass | **Critical** | `middleware.ts` granted full route access in production if a client-side `demo_user_role` cookie was present, permitting arbitrary client-side role forgery. | Hardened middleware to reject client cookies in production environments; authenticated session management fails closed to real backend HTTP-only cookies in production. Local test harnesses are explicitly isolated. |
| **SEC-03** | Sensitive Data Persistence | **High** | Store persisted plaintext passwords, password confirmations, session secrets, and unmasked CNPJ in browser `localStorage`. | Configured Zustand `partialize` to strip `password`, `confirmPassword`, `sessionToken`, and CNPJs; sanitized mock application fixtures to retain only masked CNPJ (`11.***.***/0001-81`). |
| **SEC-04** | Global Email Uniqueness (Option 2) | **High** | Email collision checks were executed only against local in-memory dealer applications, failing to block emails already registered to Buyers or Private Sellers. | Unified all persona registrations (`/cadastrar`, `/vendedor/solicitacao`, `/concessionaria/solicitacao`) against the centralized `SharedAuthRegistry`, preventing cross-role duplicate registrations and displaying helpful directional error messages with redirect links to `/entrar`. |
| **SEC-05** | Transaction Order & Orphaned State | **Medium** | Dealership registration created application records before shared authentication registration completed, potentially leaving orphaned unauthenticated applications on collision. | Inverted workflow order: credentials and email reservation validate against `SharedAuthRegistry` **before** committing the dealership application draft. |
| **SEC-06** | Incomplete CNPJ Masking & Modulus-11 in Edits | **Medium** | Correction screen attempted to re-run Modulus 11 validation against masked CNPJ (`11.***.***/0001-81`), causing spurious validation failures on resubmission. | Updated `cnpj-validator.ts` and correction form to recognize unchanged masked CNPJ strings as pre-verified, while strictly enforcing Modulus 11 when a new CNPJ is entered. |
| **SEC-07** | Route Redirect & Open Redirect Vulnerabilities | **Medium** | Redirect query parameter handling accepted protocol-relative (`//`), backslash (`\`), and control characters. | Implemented strict URI path sanitizer `isSafeRedirect()` rejecting external origins, control characters, userinfo (`@`), and unauthorized cross-role targets. |
| **SEC-08** | Request-Controlled Test Mode Bypass | **Critical** | `middleware.ts` evaluated `fdc_runtime_env` request cookie and `x-fdc-test-env` header, enabling external visitors to switch the server into test mode and bypass production guards. | Eliminated all request-controlled environment toggles; environment is strictly evaluated from trusted server-side configuration (`NODE_ENV`, `FEIRA_E2E_MOCK` on loopback). In production, external requests fail closed unconditionally. |
| **SEC-09** | Role Inference from Cookie Substrings | **High** | `middleware.ts` used `.includes('buyer')` and `.includes('seller')` to guess roles from cookie values, permitting cookie forgery and privilege escalation. | Implemented `verifyWebSession` with an exact token registry lookup, zero substring matching, and strict role boundary enforcement. |

---

## 2. Detailed Technical Breakdown

### 2.1 Demo Authentication Hardening (`SEC-01`)
- **File**: `apps/web/lib/adapters/shared-auth-registry.ts`
- **Correction**:
  - Eliminated arbitrary fallback user generation. Any email not present in `FIXTURE_ACCOUNTS` returns `'Conta não encontrada. Verifique o e-mail ou crie uma nova conta.'`.
  - Enforced password check. Even for existing fixture emails, supplying an incorrect password rejects authentication with `'E-mail ou senha incorretos. Verifique suas credenciais.'`.
  - Added production guard `isProductionEnvironment()`. Calling demo login simulation in a live production environment throws a fail-closed exception instructing the system to use the real `/v1/auth/login` backend endpoint.

### 2.2 Request-Controlled Bypass Elimination & Server Environment (`SEC-08`)
- **Files**: `apps/web/middleware.ts`, `apps/web/lib/security/environment.ts`
- **Correction**:
  - `middleware.ts` and `environment.ts` NEVER inspect incoming cookies (`fdc_runtime_env`), headers (`x-fdc-test-env`), query parameters (`?demo=true`), or user-agent strings to determine environment or bypass security guards.
  - Environment determination relies exclusively on private server-side variables:
    - `NODE_ENV === 'test'` or `'development'` -> Dev/Test mode.
    - `NODE_ENV === 'production'` -> Production mode (fail closed), unless started on local loopback with private runner flag `FEIRA_E2E_MOCK === 'true'`.
    - Any remote/external hostname (`!isLocalhost`) unconditionally fails closed to production mode regardless of environment variables.
  - Browser and middleware evaluation cannot disagree: on public domains, both enforce production mode; on local development loopback, both operate in test harness mode.

### 2.3 Server-Side Session Verifier & Elimination of Substring Role Guessing (`SEC-09`)
- **Files**: `apps/web/lib/security/session-verifier.ts`, `apps/web/middleware.ts`
- **Correction**:
  - Authored dedicated `verifyWebSession(cookieValue, options)`:
    - In production (`isProduction === true`): All sessions fail closed with `PRODUCTION_AUTH_FAIL_CLOSED`. No client-written or mock cookie can grant access.
    - In dev/test: Exact token matching against `REGISTERED_FIXTURE_SESSIONS`.
    - Completely eliminated substring checks (`.includes('buyer')`, `.includes('seller')`) and prefix checking.
    - Unauthorized roles or fabricated tokens (`INVALID_SESSION_TOKEN`, `UNAUTHORIZED_ROLE`) are strictly rejected and redirected to `/entrar` with explicit query parameters.

### 2.4 Sensitive Data Protection & LocalStorage Hygiene (`SEC-03`)
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

### 2.5 Option 2 Global Email Uniqueness Across All Personas (`SEC-04` & `SEC-05`)
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

### 2.6 Mock Credential Policy & Registration Transparency
- **Files**: `apps/web/app/cadastrar/page.tsx`, `apps/web/lib/adapters/shared-auth-registry.ts`
- **Correction**:
  - On the registration confirmation screen, a prominent simulated credential note informs the user:
    > *"Nota de Simulação: Para acessar sua conta no ambiente de demonstração, utilize as credenciais padrão do fixture (senha: Senha@123 ou 123456). Senhas personalizadas não são persistidas sem backend integrado."*
  - Plaintext passwords and password hashes are never stored in browser persistence or cookies.

### 2.7 Safe Redirect Validation (`SEC-07`)
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
All 22 scenarios in `apps/web/src/__tests__/dealer-batch-d1.test.ts` and all 22 scenarios in `apps/web/src/__tests__/security-request-hardening.test.ts` pass cleanly:

```
✓ apps/web/src/__tests__/security-request-hardening.test.ts (22 tests)
  ✓ Environment Security Guard (isProductionEnvironment)
    ✓ fails closed to production in NODE_ENV=production regardless of NEXT_PUBLIC variables
    ✓ fails closed to production when NODE_ENV is unset or invalid
    ✓ permits test harness only when private server FEIRA_E2E_MOCK=true is explicitly set
    ✓ enables dev/test mode in NODE_ENV=test and NODE_ENV=development
  ✓ Session Verifier (verifyWebSession)
    ✓ CRITICAL: strictly fails closed in production and rejects mock tokens
    ✓ CRITICAL: strictly rejects fabricated session values in production
    ✓ in dev/test mode: rejects fabricated tokens and substring tricks
    ✓ in dev/test mode: accepts only exact registered fixture session tokens
  ✓ Middleware Production Route Protection
    ✓ REGRESSION: blocks request with fdc_runtime_env=test cookie in production
    ✓ REGRESSION: blocks request with fdc_runtime_env=development cookie in production
    ✓ REGRESSION: blocks request with x-fdc-test-env: true header in production
    ✓ REGRESSION: blocks fabricated fdc_web_session in production
    ✓ REGRESSION: blocks fabricated dealer/seller session values even with test query params
  ✓ Middleware Cross-Role Authorization (Dev/Test Harness)
    ✓ blocks Buyer session from accessing Dealership routes
    ✓ blocks Buyer session from accessing Seller routes
    ✓ blocks Seller session from accessing Dealership routes
    ✓ blocks Dealership session from accessing Buyer personal account routes
    ✓ permits authorized roles to their respective matching routes
  ✓ Cross-Role Redirect Parameter Security
    ✓ sanitizes and blocks cross-role redirect parameters in getRoleDestination
    ✓ rejects malicious open redirect vectors in middleware redirect query param
  ✓ Authentication Actions Fail-Closed in Production
    ✓ authenticateDemoLogin unconditionally rejects in production
    ✓ loginSimulation in useDealerStore unconditionally rejects in production
```

### 3.2 Monorepo Test Baseline Verification
Running repository-wide verification confirms clean builds and zero regressions across all packages:

- **Vitest Unit Tests**: `274 passed` (170 web, 89 admin, 7 logger, 3 api-client, 3 ui, 2 testing) across 21 test files.
- **Biome Linter**: Clean (`Checked 392 files in apps/web, apps/admin, packages/*; 0 errors, 0 warnings`).
- **TypeScript Check**: `6/6 tasks successful; 0 errors`.
- **Next.js Production Build**: `@feira/web` built and prerendered all 47 routes in ~6.7 seconds.
- **Playwright End-to-End Suite**:
  - `dealer-d1.spec.ts`: **14/14 tests passing** (Desktop Chromium & Mobile Safari).
  - `capture-d1.spec.ts`: **10/10 tests passing** across 5 viewports (1440px, 1366px, 768px, 430px, 390px).
  - `buyer-b3.spec.ts`: **14/14 tests passing**.
  - `buyer-b4.spec.ts`: **10/10 tests passing**.
  - `buyer-b5.spec.ts`: **12/12 tests passing**.
  - `home.spec.ts`: **2/2 tests passing**.
  - **Total E2E**: **62/62 passing tests**.

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

All request-controlled authentication bypasses and substring role inferences have been completely eliminated. The application enforces fail-closed production security, exact session verification, global email uniqueness, transparent simulation credential disclosures, and strict cross-role isolation.

**Batch D1 is fully validated, secure, and ready for progression to Batch D2 (Dealership Inventory & Vehicle Upload).**
