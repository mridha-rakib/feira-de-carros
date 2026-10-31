# Feira de Carros — Figma Phase 2 Component Library Manifest v0.1

**Date:** 25 October 2026  
**Figma design file:** https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT  
**Status:** Built in Figma, structurally and visually reviewed; **not client-approved UI or production behavior**.

## Verified build results

- 50/50 Step 6 component families (`UI-001` to `UI-050`) implemented as genuine Figma `COMPONENT_SET` masters with unique state names.
- 131 Figma `COMPONENT` variant children (100 initial + 31 applicable extra variants).
- 50/50 sets have editable TEXT component label properties; 50/50 hold source SRS references in component descriptions.
- 49/50 sets have Figma-variable-bound component fills; UI-001 deliberately uses original supplied logo images, not a recolored vector substitute.
- 16 editable SVG-vector icon component masters plus one true `INSTANCE_SWAP` example.
- Existing foundations retained: 41 scoped design variables, 8 proposed text styles, official logos, review holds.
- 19 organized Figma pages; the `07 · ADMIN DESKTOP / BATCH 01` page remains empty—no finished screens claimed.
- QA: no missing sets, duplicated variant names, text-property omissions, missing SRS descriptions, or stray cloned components on the cover.

## Exact Figma component mapping

| Step 6 ID | Component family | Main Figma set ID | Live variants | SRS trace |
|---|---|---|---:|---|
| UI-001 | Brand logo / variant slot | `23:29` | 2 | BUS-004 |
| UI-002 | Page shell / header / footer | `23:69` | 2 | BUS-002; ADM-001 |
| UI-003 | Sidebar / role menu | `23:113` | 2 | ADM-004; ADM-005 |
| UI-004 | Mobile essential staff navigation | `23:156` | 2 | ADM-003; ADM-019 |
| UI-005 | Breadcrumb / return | `23:200` | 2 | ADM-010; VEH-015 |
| UI-006 | Tabs / segmented scope | `23:243` | 2 | ADM-008; VEH-027 |
| UI-007 | Primary action button | `23:285` | 5 | BUS-002 |
| UI-008 | Secondary/outline button | `23:313` | 4 | BUS-002 |
| UI-009 | Destructive confirmation | `23:348` | 2 | VEH-021; AUTH-013 |
| UI-010 | Dropdown action menu | `23:389` | 2 | ADM-010; MSG-011 |
| UI-011 | Inline link / authenticated gate | `23:425` | 2 | MSG-001; SEARCH-001 |
| UI-012 | Text and email input | `24:27` | 4 | AUTH-001; AUTH-027 |
| UI-013 | Password input | `24:58` | 4 | AUTH-001; AUTH-012 |
| UI-014 | Date of birth DD/MM/YYYY | `24:90` | 3 | AUTH-005; AUTH-006 |
| UI-015 | CPF/CNPJ private input | `24:121` | 3 | AUTH-016; AUTH-017; SEC-003 |
| UI-016 | Phone input / public reveal | `24:153` | 2 | AUTH-008; VEH-009 |
| UI-017 | Category / catalogue select | `24:188` | 3 | VEH-002; VEH-003 |
| UI-018 | Filter panel / sort | `24:226` | 2 | SEARCH-003; SEARCH-004 |
| UI-019 | Checkbox / radio option | `24:259` | 3 | VEH-005; NOT-005 |
| UI-020 | Field validation/error text | `24:291` | 3 | AUTH-005; AUTH-027; VEH-004 |
| UI-021 | Action/review notes and reason | `24:320` | 2 | AUTH-019; PAY-019 |
| UI-022 | Photo upload and quota | `24:365` | 3 | VEH-010; VEH-011; VEH-012 |
| UI-023 | Choose cover image | `24:411` | 2 | VEH-012 |
| UI-024 | Vehicle card | `24:468` | 3 | SEARCH-001; VEH-004 |
| UI-025 | Vehicle detail display | `24:529` | 2 | VEH-004; VEH-009; SEC-003 |
| UI-026 | Location selector | `24:575` | 2 | SEARCH-005; BUS-008 |
| UI-027 | Favorite save/remove | `24:608` | 3 | SEARCH-007 |
| UI-028 | Saved search editor | `24:640` | 2 | SEARCH-008; SEARCH-009 |
| UI-029 | Status label / badge | `26:25` | 5 | VEH-019; PAY-009 |
| UI-030 | Sortable/filterable data table | `26:65` | 4 | ADM-011; PAY-023 |
| UI-031 | Pagination / result summary | `26:112` | 2 | SEARCH-004; ADM-011 |
| UI-032 | Counts/summary metric card | `26:150` | 2 | ADM-008; ANA-001 |
| UI-033 | Empty/loading/retry | `26:181` | 3 | TECH-010; ADM-001 |
| UI-034 | Alert / toast | `26:209` | 4 | NOT-003; AUTH-025 |
| UI-035 | Modal / confirmation | `26:248` | 3 | VEH-021; AUTH-013 |
| UI-036 | Restricted/access denied | `26:285` | 2 | AUTH-024; AUTH-025 |
| UI-037 | Chat inbox/thread list | `26:624` | 3 | MSG-007; MSG-008 |
| UI-038 | Text-only chat composer | `26:664` | 3 | MSG-002; MSG-006 |
| UI-039 | Presence/read/unread | `26:695` | 3 | MSG-005; MSG-008 |
| UI-040 | Report, block, hide conversation | `26:727` | 2 | MSG-011; MSG-012; MSG-013 |
| UI-041 | Legacy staff mediation disclosure | `26:762` | 2 | MSG-017; MSG-020; SEC-010 |
| UI-042 | Plan comparison / selection | `26:805` | 2 | ADV-002; ADV-003 |
| UI-043 | Revision comparison / moderation | `26:841` | 2 | VEH-018; VEH-019; ADM-006 |
| UI-044 | Pix/card pending/success state | `26:876` | 3 | PAY-008; PAY-009 |
| UI-045 | Cash record desktop-only | `26:910` | 2 | PAY-013; PAY-014; ADM-020 |
| UI-046 | Refund request and review | `26:945` | 2 | PAY-018; PAY-019 |
| UI-047 | Report-linked moderation view | `26:984` | 2 | MSG-014; ADM-012 |
| UI-048 | Configuration fields and actions | `26:1018` | 2 | ADV-008; ADM-015; ADM-016 |
| UI-049 | Seller approval result/corrections | `26:1049` | 3 | AUTH-019; AUTH-026 |
| UI-050 | Delete account request/status | `26:1081` | 2 | AUTH-013; AUTH-014; SEC-008 |

## Component variants and behavior notes

- **UI-001 — Brand logo / variant slot:** Light, Dark. **Source classification:** SOURCE BRAND + UX PROPOSED.
- **UI-002 — Page shell / header / footer:** Desktop, Mobile. **Source classification:** UX DERIVED.
- **UI-003 — Sidebar / role menu:** Expanded, Collapsed. **Source classification:** UX DERIVED / RBAC HOLD.
- **UI-004 — Mobile essential staff navigation:** Open, Closed. **Source classification:** UX DERIVED.
- **UI-005 — Breadcrumb / return:** Default, Active. **Source classification:** UX DERIVED.
- **UI-006 — Tabs / segmented scope:** Default, Selected. **Source classification:** UX DERIVED.
- **UI-007 — Primary action button:** Default, Disabled, Hover, Focus, Loading. **Source classification:** UX DERIVED.
- **UI-008 — Secondary/outline button:** Default, Hover, Focus, Disabled. **Source classification:** UX DERIVED.
- **UI-009 — Destructive confirmation:** Confirm, Cancel. **Source classification:** UX DERIVED.
- **UI-010 — Dropdown action menu:** Open, Restricted. **Source classification:** UX DERIVED.
- **UI-011 — Inline link / authenticated gate:** Guest, Signed-in. **Source classification:** UX DERIVED.
- **UI-012 — Text and email input:** Default, Focused, Error, Disabled. **Source classification:** CONFIRMED INPUT / UX DERIVED.
- **UI-013 — Password input:** Default, Error, Focused, Disabled. **Source classification:** CONFIRMED INPUT / UX DERIVED.
- **UI-014 — Date of birth DD/MM/YYYY:** Default, Error, Focused. **Source classification:** CONFIRMED FORMAT / UX DERIVED.
- **UI-015 — CPF/CNPJ private input:** Masked, Restricted, Error. **Source classification:** CONFIRMED FIELD / RBAC HOLD.
- **UI-016 — Phone input / public reveal:** Masked, Revealed. **Source classification:** CONFIRMED BEHAVIOR / UX DERIVED.
- **UI-017 — Category / catalogue select:** Default, Expanded, Disabled. **Source classification:** CONFIRMED FEATURE / FIELD REQUIREDNESS HOLD.
- **UI-018 — Filter panel / sort:** Default, Applied. **Source classification:** CONFIRMED FILTERS / UI DERIVED.
- **UI-019 — Checkbox / radio option:** Unselected, Selected, Disabled. **Source classification:** UX DERIVED.
- **UI-020 — Field validation/error text:** Default, Error, Success. **Source classification:** UX DERIVED.
- **UI-021 — Action/review notes and reason:** Default, Required. **Source classification:** CONFIRMED WORKFLOW / UX DERIVED.
- **UI-022 — Photo upload and quota:** Progress, Limit, Error. **Source classification:** CONFIRMED FEATURE / FILE LIMITS HOLD.
- **UI-023 — Choose cover image:** Unselected, Selected. **Source classification:** CONFIRMED FEATURE / UX DERIVED.
- **UI-024 — Vehicle card:** Default, Saved, Loading. **Source classification:** CONFIRMED DATA / UX DERIVED.
- **UI-025 — Vehicle detail display:** Overview, Specifications. **Source classification:** CONFIRMED BEHAVIOR / UX DERIVED.
- **UI-026 — Location selector:** Default, Searching. **Source classification:** CONFIRMED MANUAL LOCATION.
- **UI-027 — Favorite save/remove:** Unsaved, Saved, Login required. **Source classification:** CONFIRMED BEHAVIOR / UX DERIVED.
- **UI-028 — Saved search editor:** Saved, Editing. **Source classification:** CONFIRMED BEHAVIOR / UX DERIVED.
- **UI-029 — Status label / badge:** Pending, Approved, Rejected, Expired, Hidden. **Source classification:** CONFIRMED STATES / UX DERIVED.
- **UI-030 — Sortable/filterable data table:** Default, Filtered, Empty, Loading. **Source classification:** CONFIRMED NEED / UX DERIVED.
- **UI-031 — Pagination / result summary:** Default, Next. **Source classification:** UX DERIVED.
- **UI-032 — Counts/summary metric card:** Default, Updated. **Source classification:** CONFIRMED ANALYTICS / UX DERIVED.
- **UI-033 — Empty/loading/retry:** Empty, Retry, Loading. **Source classification:** UX DERIVED.
- **UI-034 — Alert / toast:** Success, Error, Warning, Info. **Source classification:** UX DERIVED.
- **UI-035 — Modal / confirmation:** Open, Confirmed, Cancelled. **Source classification:** UX DERIVED.
- **UI-036 — Restricted/access denied:** Denied, Suspended. **Source classification:** CONFIRMED DENIAL / UX DERIVED.
- **UI-037 — Chat inbox/thread list:** Unread, Read, Empty. **Source classification:** CONFIRMED BEHAVIOR / UX DERIVED.
- **UI-038 — Text-only chat composer:** Compose, Read-only, Disabled. **Source classification:** CONFIRMED BEHAVIOR / UX DERIVED.
- **UI-039 — Presence/read/unread:** Online, Offline, Unread. **Source classification:** CONFIRMED BEHAVIOR / UX DERIVED.
- **UI-040 — Report, block, hide conversation:** Open, Blocked. **Source classification:** CONFIRMED BEHAVIOR / UX DERIVED.
- **UI-041 — Legacy staff mediation disclosure:** Visible, Acknowledged. **Source classification:** CONFIRMED MANDATORY DISCLOSURE.
- **UI-042 — Plan comparison / selection:** Default, Selected. **Source classification:** CONFIRMED BEHAVIOR / UX DERIVED.
- **UI-043 — Revision comparison / moderation:** Pending, Approved. **Source classification:** CONFIRMED BEHAVIOR / UX DERIVED.
- **UI-044 — Pix/card pending/success state:** Pending, Confirmed, Failed. **Source classification:** CONFIRMED BEHAVIOR / PROVIDER HOLD.
- **UI-045 — Cash record desktop-only:** Desktop only, Recorded. **Source classification:** CONFIRMED RESTRICTION.
- **UI-046 — Refund request and review:** Requested, Under review. **Source classification:** CONFIRMED INTENT / LEGAL HOLD.
- **UI-047 — Report-linked moderation view:** Review, Restricted. **Source classification:** CONFIRMED MODERATION / RBAC HOLD.
- **UI-048 — Configuration fields and actions:** Default, Saved. **Source classification:** CONFIRMED CONFIG / UX DERIVED.
- **UI-049 — Seller approval result/corrections:** Pending, Correction, Approved. **Source classification:** CONFIRMED BUSINESS RULE.
- **UI-050 — Delete account request/status:** Requested, Under review. **Source classification:** CONFIRMED INTENT / PRIVACY HOLD.

## Correctness and safety constraints

- The library demonstrates design states, not functional authorization, backend integration, payment settlement, real notifications, or signed product approvals.
- Exclusive Main Admin seller/ad approvals and cash recording on desktop remain enforced design restrictions; cash entry is not offered in responsive mobile contexts.
- The 12 sensitive Sales/Support operations remain `DENY_PENDING`; no UI state overrides server-side RBAC.
- iOS/Android native listing/boost payment checkout remains `BLOCKED_POLICY_DECISION` pending app store policies and PSP provider; website Pix/card samples are state presentations only.
- CPF/CNPJ private sample remains masked and permission-bound; no actual personal records, CPF document photo or selfie are used.
- Chat remains text-only, buyer-initiated, with read-only state for sold ads; no attachments or unauthorized admin browsing.
- Refund legal details, deletion/retention decisions, responsive and font licensing holds remain open.
- Official logo artwork is user supplied. Red `#F42524` and black `#000000` are source official; darker action red and Inter typography remain proposed.
- The vehicle-card and cover-image component specimens currently contain illustrative vector artwork, **not actual vehicle photographs**. Real properly sourced/licensed vehicle photos and realistic but fictional populated records belong to the first four-screen batch. Do not present Phase 2 library thumbnails as fully populated production screens.

## Visual QA performed

- Reviewed Figma screenshots of Foundation, Forms, Media/Discovery, Icon Library, button states, payment states and critical state review board.
- Verified non-placeholder editable SVG icons, official logo source imagery, visible state descriptions and readable action fields.

## Next phase — first four complete Admin Desktop screens

1. `ADM-D-002` — Dashboard Overview
2. `ADM-D-003` — User Management
3. `ADM-D-005` — Seller Approval Queue
4. `ADM-D-012` — Advertisement Management

**Batch rule:** finish only four screens at a time; fully populate each with consistent fictional Brazilian user/vehicle data, meaningful SVG icons and appropriately licensed vehicle photographs; review the batch before proceeding.

