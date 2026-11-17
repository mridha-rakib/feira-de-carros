# Feira de Carros — Dealership Frontend Gap Audit
**Document ID:** `AUDIT-DEALERSHIP-GAP-v1.0`  
**Date:** November 17, 2026  
**Auditor:** Senior Software Architect, Figma Design Auditor & Frontend Engineering Lead  
**Repository:** `mridha-rakib/feira-de-carros`  
**Approved Figma Source:** File `JlRZIGImV7rRROPZndv6NT` (Page `733:2` Zone 3 & Page `1566:2` Zone 4)  
**Status:** Audit & Gap Analysis Complete (No implementation started)

---

## 1. Executive Summary

This independent audit evaluates the **Dealership Frontend** requirements, inspects all approved Dealership screens in Figma File `JlRZIGImV7rRROPZndv6NT`, assesses the existing Seller frontend components in `apps/web`, and defines the exact gap between current repository assets and the approved Dealership specifications.

### Key Audit Findings
1. **Existing Dealership Implementation**: Only **1 of 4 canonical Dealership screens** is currently implemented: the **Public Dealership Showroom (`WEB-007`)** at `/concessionarias/[id]` (delivered in Buyer Batch B2).
2. **Missing Private Dealership Screens**: All **3 private Dealership advertiser screens** are currently **UNIMPLEMENTED**:
   - `WEB-017`: Dealership Advertiser Registration & Application
   - `WEB-021`: Dealership Vehicle Inventory Overview (Dashboard)
   - `WEB-022`: Dealership Public Business Profile Editor
3. **High Component Reuse Potential**: Approximately **75% of operational vehicle management workflows** (Ad Creation Wizard, Listing Edit, Revision Moderation, Sold Listing Removal, Per-Vehicle Plan/Boost/Renewal Checkout, and Advertiser Messaging) can be directly reused from the existing Individual Seller frontend (`S1–S5`), preventing massive code duplication.
4. **Privacy Invariant Compliance**: The Dealership Business Profile Editor (`WEB-022`) and Public Showroom (`WEB-007`) strictly enforce `SEC-003` and `AUTH-021`: **CNPJ, legal corporate names, and private owner credentials remain strictly confidential to back-office staff and are never rendered on public buyer surfaces.**

---

## 2. Complete Dealership Figma Design Inventory

Every Dealership-related node in Figma File `JlRZIGImV7rRROPZndv6NT` was cataloged from Page `733:2` (Zone 03: Dealership Only) and Page `1566:2` (Design Documentation):

| Screen ID | Canonical Screen Name | Desktop Node | Mobile Node | Route (`apps/web`) | Implementation Status | Functional Scope & Gaps |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **WEB-007** | Public Dealership Showroom | `1211:2395` | `1211:2461` | `/concessionarias/[id]` | **IMPLEMENTED (B2)** | Buyer-facing public showroom with dealer profile, address, operating hours, masked phone, and active inventory grid. |
| **WEB-017** | Dealership Registration Application | `1575:3428` | `1582:3455` | `/concessionaria/solicitacao` | **MISSING (G-01)** | Business application collecting Razão Social, CNPJ (private), trading name, address, phone, and account credentials. |
| **WEB-017-S**| Application Status Tracking | `1629:3592` | `1629:3646` | `/concessionaria/solicitacao/status` | **MISSING (G-02)** | Displays pending review state, approval timeline disclaimer, and contact instructions. |
| **WEB-017-C**| Application Correction | `1629:3560` | `1629:3614` | `/concessionaria/solicitacao/corrigir`| **MISSING (G-03)** | Allows editing and resubmitting rejected/correction-requested applications. |
| **WEB-021** | Dealership Inventory Overview | `1592:3472` | `1592:3701` | `/concessionaria/anuncios` | **MISSING (G-04)** | Dealership management dashboard with 30-day views metric (`ANA-001`), top visitor cities (`ANA-002`), multi-vehicle status table, filter chips, and CTA. |
| **WEB-022** | Public Business Profile Editor | `1594:3516` | `1594:3671` | `/concessionaria/perfil` | **MISSING (G-05)** | Management screen for trading name, logo upload, address display toggle, live showroom preview card, and CNPJ privacy notice. |
| **PROTO-S** | Prototype Success / Sent Modal | `1629:3572` | `1629:3626` | *(Interactive Modal)* | **MISSING (G-06)** | Dialog confirming submission of application or profile updates. |
| **PROTO-V** | Prototype Saved Toast/State | `1629:3582` | `1629:3636` | *(Feedback Toast)* | **MISSING (G-07)** | Inline toast indicating changes saved successfully. |
| **PROTO-H** | Prototype Helper Guidance | `1629:3604` | `1629:3658` | *(Help Modal)* | **MISSING (G-08)** | Contextual modal explaining Dealership advertising guidelines and requirements. |

---

## 3. Dealership Implemented vs Missing Detailed Comparison

```
========================================================================================
DEALERSHIP SCREEN SURFACE COMPARISON
========================================================================================
[ IMPLEMENTED ]                                 [ MISSING / REQUIRED ]
────────────────────────────────────────────────────────────────────────────────────────
• /concessionarias/[id] (WEB-007)                • /concessionaria/solicitacao (WEB-017)
  (Public Showroom, Desktop & Mobile)             (Advertiser Registration & Application)
                                                 • /concessionaria/solicitacao/status
                                                   (Application Review Status)
                                                 • /concessionaria/solicitacao/corrigir
                                                   (Application Resubmission)
                                                 • /concessionaria/anuncios (WEB-021)
                                                   (Fleet Inventory Dashboard & Analytics)
                                                 • /concessionaria/perfil (WEB-022)
                                                   (Business Profile & Logo Editor)
                                                 • /concessionaria/mensagens
                                                   (Dealership Advertiser Inbox)
                                                 • /concessionaria/anuncios/novo/*
                                                   (Dealership Listing Wizard Routing)
========================================================================================
```

---

## 4. Seller Component Reuse Assessment

A critical architectural mandate is avoiding duplication of the entire Seller frontend. The table below analyzes how existing Seller (`apps/web/app/vendedor/*`) components map to Dealership requirements:

| Existing Seller Screen / Component | Route | Dealership Applicability | Reuse Strategy |
| :--- | :--- | :--- | :--- |
| **Ad Wizard: Category (`WEB-023`)** | `/vendedor/anuncios/novo/categoria` | **Directly Reusable (100%)** | Dealership vehicle categorization uses identical taxonomy (Sedan, Hatch, SUV, etc.). Reuse shared wizard step. |
| **Ad Wizard: Details (`WEB-024`)** | `/vendedor/anuncios/novo/detalhes` | **Directly Reusable (100%)** | Vehicle attributes, specs, options, and pricing fields are identical. |
| **Ad Wizard: Photos (`WEB-025`)** | `/vendedor/anuncios/novo/fotos` | **Directly Reusable (100%)** | Photo upload dropzone, reordering, and cover selection follow identical rules. |
| **Ad Wizard: Review (`WEB-026`)** | `/vendedor/anuncios/novo/revisao` | **Directly Reusable (100%)** | Final pre-submission summary card and terms agreement. |
| **Ad Edit (`WEB-034`)** | `/vendedor/anuncios/[id]/editar` | **Directly Reusable (100%)** | In Figma, `WEB-021` row `Editar` button links directly to node `698-547` (`WEB-034`). Reuse listing editor. |
| **Pending Revisions (`WEB-035`)** | `/vendedor/anuncios/[id]/revisoes` | **Directly Reusable (100%)** | Side-by-side diff between published version and pending revision. |
| **Sold Listing Removal (`WEB-038`)**| `/vendedor/anuncios/[id]/vendido` | **Directly Reusable (100%)** | Mark vehicle as sold, archive listing, transition buyer chats to read-only. |
| **Ad Plans & Boost (`WEB-029–037`)**| `/vendedor/anuncios/[id]/*` | **Directly Reusable (100%)** | Per-vehicle plan selection (`WEB-029`), Pix (`WEB-030`), Card (`WEB-031`), Boost (`WEB-037`), Renewal (`WEB-036`). |
| **Advertiser Messaging (`WEB-045–048`)**| `/vendedor/mensagens/*` | **Configurable Variant (90%)** | Reuse messaging adapter with Dealership store context (`feira_dealer_messages`). Header indicates Dealership brand. |
| **Per-Ad Analytics (`WEB-039`)** | `/vendedor/anuncios/[id]/estatisticas`| **Directly Reusable (100%)** | Individual vehicle views and performance trends. |
| **My Listings (`WEB-020`)** | `/vendedor/anuncios` | **Role-Specific Variant Needed** | Individual seller card list differs from Dealership's multi-vehicle data table with top view metrics (`WEB-021`). |
| **Seller Onboarding (`WEB-016`)** | `/vendedor/solicitacao` | **New Screen Required (`WEB-017`)**| Individual CPF flow cannot be reused; Dealership requires CNPJ, Razão Social, and trading name. |
| **Seller Account (`WEB-012`)** | `/vendedor/conta` | **New Screen Required (`WEB-022`)**| Personal seller settings differ from Dealership public business profile and showroom editor. |

---

## 5. Dealership Lifecycle & Privacy Invariant Analysis

### 5.1 Application & Approval Lifecycle
The Dealership onboarding lifecycle follows strict state machine transitions:

```
[ Unregistered Dealer ] ──> Submits WEB-017 (CNPJ, Razão Social, Credentials)
                                   │
                                   ▼
                        [ status: pending_approval ] ──> Views WEB-017-S (Status Screen)
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
          [ Admin Rejection ]         [ Admin Approval ]
                     │                           │
                     ▼                           ▼
        Views WEB-017-C (Correction)    [ status: active ]
                     │                           │
                     ▼                           ▼
            Resubmits Application      Accesses WEB-021 (Inventory Dashboard)
                                       Can publish listings after per-vehicle plan payment
```

### 5.2 Business Identity & CNPJ Privacy Safeguards (`SEC-003`, `AUTH-021`)
1. **CNPJ Secrecy**: The CNPJ is collected strictly for staff verification and fraud prevention (`AUTH-017`). It is **NEVER** displayed on public vehicle cards, search filters, the public showroom (`/concessionarias/[id]`), or buyer messaging threads.
2. **Razão Social vs. Nome Fantasia**: The corporate legal name (`Razão Social`) is restricted to staff review. The public showroom and listings only render the trading name (`Nome Fantasia / Nome da Revenda`).
3. **Address Disclosure**: In the profile editor (`WEB-022`), the physical address has an explicit visibility control (`Endereço visível (opcional)`). Only the city and state are mandatory public attributes.

---

## 6. Implementation Priorities

To deliver the Dealership Frontend safely without regression:
1. **Priority 1 (D1 — Registration & Lifecycle)**: Implement `WEB-017`, status tracking, and correction states.
2. **Priority 2 (D2 — Inventory Overview & KPIs)**: Implement `WEB-021` multi-vehicle dashboard with views metrics.
3. **Priority 3 (D3 — Listing Lifecycle Integration)**: Wire Dealership routes to the existing Ad Wizard and lifecycle actions.
4. **Priority 4 (D4 — Business Profile Editor)**: Implement `WEB-022` with logo upload and showroom live preview.
5. **Priority 5 (D5 — Messaging & Payments Integration)**: Wire Dealership inbox, plan checkouts, and account settings.
