# AGENTS.md — Contributor Guidelines for Antigravity & AI Agents

## Operating Guidelines & Project Invariants

1. **Monorepo Boundary**:
   - `apps/web` is strictly for public buyers, private sellers, and dealerships.
   - `apps/admin` is strictly for staff back-office (Main Admin, Sales, Support).
   - `packages/*` contains reusable primitives. Never duplicate shared components across apps.

2. **Backend Separation**:
   - Do NOT implement database connections, ORM models, direct SQL queries, or backend business logic inside Next.js server actions or route handlers.
   - All backend interaction must use `@feira/api-client` matching the OpenAPI v0.2 contract.

3. **RBAC & Authorization**:
   - Do NOT rely on session cookies alone as proof of authorization.
   - Roles: `main_admin`, `sales`, `support`, `member`, `seller`, `dealer`, `public`.
   - `DENY_PENDING` operations in Sales/Support must remain blocked until backend fine-grained permissions are signed off.

4. **Design & Figma Compliance**:
   - Use official Figma design tokens from `@feira/ui` (`#F42524` brand red, `#B91C1C` UI primary, `#000000` text).
   - Support responsive breakpoints: 1600px/1366px desktop, 768px tablet, 360/375/390/430px mobile.
   - Do NOT display fabricated commercial statistics or claims (e.g. "Vendedores verificados", fictitious revenue numbers) as factual data. Always tag mock data with explicit `DEMO DATA` provenance.

5. **Tooling & Standards**:
   - Use Biome for formatting and linting. Do NOT add ESLint or Prettier.
   - Always run `pnpm lint`, `pnpm check-types`, and `pnpm test` before committing changes.
