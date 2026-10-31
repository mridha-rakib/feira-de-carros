# Feira de Carros — Step 8 Figma Preparation Notes v0.1

**Status:** Review-ready specification. No Figma file or visual screen design was created. 2026-10-22.

## Source-of-truth rules

- **Functional**: client-accepted SRS v0.3 (207 original IDs), latest client decisions, and Step 1–7 mappings.
- **Design**: Step 6 50 component candidates and Step 7 24 responsive patterns and 430 contexts are review aids; no invented features or approved breakpoints.
- **Implementation**: `shadcn/ui` and React Hook Form are web/Admin candidates, not native mobile libraries; all critical authorization, identity, payment and seller approval rules remain server-side.
- **Brand**: official red `#F42524`, black `#000000` from supplied chart. Magistral Bold Italic supplied for brand artwork; UI-wide use/license needs approval. Avoid distributing the font asset.

## Proposed Figma organisation

- `00_Readme_Controls` — Scope, source hierarchy, approval labels, owners, handoff instructions (REQUIRED_DOCUMENTATION)
- `01_Brand_References` — Source logo variant placements; institutional chart; font licensing hold (SOURCE + HOLD)
- `02_Foundations_PROPOSED` — Color aliases, type, spacing, radius, elevation, icons, responsive and accessibility policies (PROPOSED_TOKENS)
- `03_Components_Web_Admin` — 50-component web-candidate library; variants only where relevant (PROPOSED_LIBRARY)
- `04_Patterns_Native_Reference` — Platform equivalents specified, not web shadcn components copied (PROPOSED_NATIVE)
- `05_Admin_Desktop_MainAdmin` — 53 desktop screen contracts grouped by role and module (PRIORITY_1)
- `06_Admin_Sales_Support_HOLDS` — Scoped staff contexts, locked operations, assignment and privacy holds (GUARDED_REVIEW)
- `07_Admin_Mobile_Essentials` — 8 essential tasks; no cash entry, no inferred mobile approvals (PRIORITY_1)
- `08_Web_Public_Buyer` — Public browse, filters, details, favorites, chat (PRIORITY_2)
- `09_Web_Seller_Dealership` — Seller approval, ads, renewals, payments, reporting (PRIORITY_2)
- `10_iOS_Consumer` — 38 iOS screens; paid checkout branch held (PRIORITY_3)
- `11_Android_Consumer` — 38 Android screens; paid checkout branch held (PRIORITY_3)
- `12_Prototype_Flows` — 43 user-flow storyboard/index; no prohibited checkout simulation (PROPOSED_PROTOTYPES)
- `13_UI_States_Errors` — 28 states, 25 error semantics; privacy-safe examples (CROSS_CUTTING)
- `14_Responsive_Evidence` — 430 reference contexts; not an obligation to duplicate all frames (ADAPTATION_REFS)
- `15_Review_Gates_Archive` — Unresolved holds, source exceptions, annotation and audit trail (REVIEW_QUEUE)

## File and component structure (suggested)

```
Component/UI-007/Primary action button
  Variant=default | hover | focus-visible | disabled | loading
Screen/ADM-D-026 / Cash record — Main Admin desktop only
Flow/UF-12 / Main Admin records genuine offline cash on desktop
Context/ADM-D-026 / ADM-W
```

The examples above are naming suggestions only. Do not create blocked interactive behaviors or present permission controls as visual-only controls.

## Figma source traceability checklist

1. Record every screen's existing Step 4 Screen ID; do not generate new business feature screens.
2. Record SRS refs, UF flow IDs, Step 6 component IDs, responsive pattern IDs, role guard, decision holds.
3. Maintain 1,323 inherited access outcomes; Sales/Support fine-grained operations remain `DENY_PENDING` until a signed matrix exists.
4. Sketch only confirmed conditional states, and label unresolved native checkout screens as **BLOCKED_POLICY_DECISION**.
5. 430 responsive contexts are adaptation scenarios, not a blanket requirement for 430 distinct frames.
6. Avoid CPF document photos, selfie capture, WhatsApp chat attachments, vehicle purchase checkout, automatic GPS radius, and unapproved video features.
7. Main Admin-only final seller/ad approvals. Cash entry is Main Admin desktop browser only; mobile approvals unresolved.
8. Display staff-mediated legacy conversations as Feira de Carros team; show actual owner phone in public listing.
9. Show 3-business-day refund intent with legal-review warning; do not invent final legal rights or boost refund start.
10. For website Pix/card show only verified states; native app paid checkout is pending Apple/Google policy selection.

## Figma review gate labels

- `SOURCE_CONFIRMED`: directly established business/brand source.
- `PROPOSED_UI`: traceable derived visual concept only.
- `REVIEW-GATED`: feature intent exists but interaction details still open.
- `ANNOTATION-ONLY / POLICY HOLD`: no clickable active implementation of held actions.
- `OUT_OF_SCOPE`: never include as V1 feature.

## Next stage

Step 9 checks all prior nine-step inventories, permissions, brand conflicts and scope holds, then produces a controlled Figma authorization/handoff backlog. Designing in Figma is still pending.
