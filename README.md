# Feira de Carros — Frontend Monorepo

> **Automotive Marketplace & Administration Portal**  
> Architecture: `pnpm` workspaces + `Turborepo` + Next.js 15 (App Router) + TypeScript (Strict)  
> Code Quality & Testing: Biome + Husky + lint-staged + Vitest + Playwright

---

## 1. Repository Structure

```
feira-de-carros-frontend/
├── apps/
│   ├── web/                    # Public Marketplace, Buyer, Seller & Dealership
│   └── admin/                  # Main Admin, Sales & Support back-office
├── packages/
│   ├── ui/                     # Shared shadcn/ui components & Figma design tokens
│   ├── api-client/             # Typed OpenAPI v0.2 HTTP client & DTO contracts
│   ├── logger/                 # Isomorphic structured logging with PII redaction
│   ├── testing/                # Test harness, RTL renderers & MSW mock server
│   └── typescript-config/      # Shared strict tsconfig bases
├── .husky/                     # Git pre-commit hooks (lint-staged)
├── .github/workflows/          # CI pipeline (Biome, typecheck, Vitest, Turbo build)
├── biome.json                  # Unified formatting & linting configuration
└── turbo.json                  # Turborepo task pipeline definition
```

---

## 2. Quick Start

### Prerequisites
- **Node.js**: >= 20.x (Recommended: Node 22+ or 24)
- **pnpm**: >= 10.x / 11.x (`corepack enable pnpm`)

### Setup
```bash
# Clone and enter workspace
git clone <repo-url>
cd feira-de-carros-frontend

# Install dependencies across all workspaces
pnpm install

# Copy environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local

# Run developer servers concurrently
pnpm dev
```

- Public Marketplace (`apps/web`): http://localhost:3000
- Admin Back-Office (`apps/admin`): http://localhost:3001
- Admin Staff Login: http://localhost:3001/login

---

## 3. Toolchain & Quality Scripts

```bash
# Biome code formatting & lint check
pnpm lint

# Automatically format and organize imports
pnpm lint:fix
pnpm format

# TypeScript strict type checking across all packages
pnpm check-types

# Unit and integration tests (Vitest)
pnpm test

# End-to-end browser tests (Playwright)
pnpm test:e2e

# Production optimized build
pnpm build
```

---

## 4. Architectural Boundaries

- **Decoupled Backend**: Zero database or server-side ORM logic exists in frontend applications. All data access routes via `@feira/api-client`.
- **Backend-Authoritative RBAC**: Route middleware performs UX redirection only; authoritative access checks are verified on every API request.
- **Session Isolation**: `apps/web` uses `fdc_web_session`; `apps/admin` uses `fdc_admin_session`.
