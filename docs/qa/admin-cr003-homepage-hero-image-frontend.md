# Relatório de Implementação e QA Frontend: CR-003 (Gestão da Imagem Principal da Homepage)

**Data de Emissão:** 21 de Novembro de 2026  
**Autor:** Engenharia Frontend Sênior & Especialista Figma-to-Code  
**Branch de Implementação:** `feat/admin-cr003-homepage-hero-image`  
**Referência SRS:** Feira de Carros SRS v0.7 — Seção 12: CR-003 (`N-HERO-001` a `N-HERO-006`, `N-HERO-AC-01` a `N-HERO-AC-05`)  
**Design de Referência (Figma):** `JlRZIGImV7rRROPZndv6NT` (Telas `2940:10263`, `2942:10293`, `515:9959`)

---

## 1. Visão Geral da Mudança

Este documento formaliza a entrega da solicitação de mudança **CR-003: Homepage Hero Image Management** no frontend do painel administrativo (`apps/admin`). A funcionalidade permite que o **Administrador Principal (Main Admin)** visualize a imagem atualmente publicada no Hero da vitrine, selecione e valide uma imagem substituta (com drag-and-drop), visualize previews responsivos (Desktop 16:9 e Mobile 9:16) sem alterar a composição pública e publique ou descarte a alteração com segurança visual e persistência simulada em modo demonstrativo.

> [!IMPORTANT]
> **Proteção Estrita da Homepage Pública (N-HERO-003 / N-HERO-006):**
> O código-fonte de `apps/web/app/page.tsx` permaneceu **100% inalterado (0 diff)**. Nenhuma dimensão, texto ("Encontre seu próximo carro com segurança"), sobreposição de gradiente, caixa de busca, filtros de veículos, botões, regras de layout ou funcionalidades de banners (CR-002) foram modificados. A sincronização entre origens distintas aguarda a disponibilização do futuro endpoint de mídia/CDN no backend.

---

## 2. Telas e Componentes Implementados

### 2.1. Rotas e Arquitetura

| Rota | Descrição | Nó Figma | Status |
| :--- | :--- | :--- | :--- |
| `/configuracoes` | Central de Configurações (Settings Hub) com card conectado para a gestão do hero | `515:9959` | **Conectado** |
| `/configuracoes/imagem-principal` | Tela principal de configurações da imagem do hero (ADM-D-054) | `2940:10263` | **Implementado** |

### 2.2. Árvore de Componentes

```text
apps/admin/app/configuracoes/imagem-principal/
├── page.tsx                                  # Viewport com AdminShell e Suspense boundary
└── components/
    ├── HeroHeader.tsx                        # Breadcrumb, título, CR-003 pill, shield e barra QA
    ├── PublishedHeroCard.tsx                 # Card verde da imagem publicada com preview da busca
    ├── ReplaceHeroCard.tsx                   # Dropzone com drag-and-drop, input nativo e fila staged
    ├── ResponsivePreviewCard.tsx             # Previews responsivos Desktop (16:9) e Mobile (9:16)
    ├── ImageValidationCard.tsx               # Validações de formato, contraste e recorte responsivo
    ├── HeroActionFooter.tsx                  # Botões Descartar e Publicar, salvaguardas e notas
    └── HeroStateBanners.tsx                  # Banners dos 5 estados da prancheta 2942:10293
```

### 2.3. Camada de Dados e Tipos

- `apps/admin/lib/types/hero-image.ts`: Tipagem forte para `PublishedHeroImageRecord`, `StagedHeroImage`, `ValidationDetails`, `HeroImagePageState` e `AdminRole`.
- `apps/admin/lib/adapters/hero-image-adapter.ts`: Serviço desacoplado com repositório híbrido IndexedDB / localStorage / in-memory, salvaguardas de liberação de URLs temporárias (`URL.revokeObjectURL`) e validação de arquivos.

---

## 3. Matriz de Estados de Interface (Figma Node `2942:10293`)

Foram fielmente codificados os 5 estados da prancheta aprovada:

1. **STATE-01 — Processando / Validação (`VALIDATING`):**
   - Pill: *"Processando..."*
   - Título: *"Validando nova imagem"*
   - Mensagem: *"Aguarde enquanto a imagem é verificada. A imagem publicada não será alterada."*
   - Barra de progresso dinâmica com percentual da etapa de validação.
2. **STATE-02 — Arquivo rejeitado (`REJECTED`):**
   - Pill: *"Arquivo rejeitado"*
   - Título: *"Não foi possível utilizar esta imagem"*
   - Mensagem: *"Arquivo incompatível, corrompido ou acima do limite permitido. Selecione uma imagem segura e válida."*
   - Rodapé: *"A imagem publicada atualmente permanece ativa."*
3. **STATE-03 — Publicação concluída (`SUCCESS`):**
   - Pill: *"Imagem publicada"*
   - Título: *"Imagem principal atualizada com sucesso"*
   - Mensagem: *"A nova imagem será exibida na homepage em desktop e mobile após atualização de cache."*
   - Auditoria: *"Registro: Administrador principal • Publicado em DD/MM/AAAA às HH:MM"*
4. **STATE-04 — Falha ao publicar / Fallback (`FAILURE`):**
   - Pill: *"Falha ao publicar • Fallback"*
   - Título: *"A imagem anterior continua publicada"*
   - Mensagem: *"Não foi possível concluir a publicação. Nenhuma alteração foi aplicada à imagem visível da homepage."*
   - Ação: Botão *"Tentar novamente"*.
5. **STATE-05 — Acesso restrito (`RESTRICTED`):**
   - Pill: *"Acesso restrito"*
   - Título: *"Permissão insuficiente"*
   - Mensagem: *"Apenas o administrador principal pode carregar, substituir ou publicar a imagem do Hero. Outros perfis não podem alterar o conteúdo."*
   - Rodapé: *"Design state · A verificação real deverá ocorrer no servidor."*

---

## 4. Rastreabilidade de Requisitos (SRS v0.7)

| Requisito | Descrição | Implementação Frontend | Evidência / Teste | Status |
| :--- | :--- | :--- | :--- | :--- |
| **N-HERO-001** | Visualização da imagem atual e restrição Main Admin | Renderiza a imagem publicada original (`hero-desktop.png`), metadados e restrição exclusiva a `main_admin` | `hero-image-adapter.test.ts` & `admin-cr003-hero-image.spec.ts` | **PASS (Simulado)** |
| **N-HERO-002** | Staging de nova imagem, preview e publicação explícita | Permite selecionar JPEG/PNG/WebP, renderiza preview e linha não-publicada sem alterar a imagem ativa até o clique em "Salvar e publicar" | E2E `staging and discard flow` & `happy path publication` | **PASS (Simulado)** |
| **N-HERO-003** | Preservação da composição da homepage pública | Previews usam o gradiente oficial e sobreposições idênticas; código de `apps/web/app/page.tsx` intacto | Verificação de diff Git (0 diff em `apps/web`) | **PASS (Invariante)** |
| **N-HERO-004** | Validação de upload e UI restrita a Main Admin | Valida tipos permitidos, rejeita formatos inválidos e arquivos > 10MB; bloqueia controles para perfis `sales` e `support` | E2E `unauthorized roles are blocked` & unit tests | **PASS (Simulado)** |
| **N-HERO-005** | Feedback de sucesso, falha e fallback resiliente | Tratamento de erro mantém imagem anterior ativa sem previews em branco; simulação de falha com retry testada | E2E `publication failure triggers fallback` | **PASS (Simulado)** |
| **N-HERO-006** | Escopo estrito a uma única imagem | Apenas um slot de imagem gerenciável; sem carrossel, sem vídeo, sem agendamento temporal | Inspeção arquitetural e UI conforme ADM-D-054 | **PASS (Design)** |

### 4.1. Verificação dos Critérios de Aceite (Acceptance Checks)

- **`N-HERO-AC-01` (Happy Path):** Administrador seleciona imagem válida, confere recortes, publica, recebe feedback de sucesso com auditoria e visualiza imagem publicada atualizada. *(PASS - E2E Playwright)*
- **`N-HERO-AC-02` (Descarte):** Administrador seleciona substituta e clica em descartar; imagem atual permanece intacta e fila de upload é limpa. *(PASS - E2E Playwright)*
- **`N-HERO-AC-03` (Validação e Fallback):** Arquivo inválido ou corrompido é rejeitado com mensagem em pt-BR; falha de rede/servidor aciona fallback sem desconfigurar o hero ativo. *(PASS - E2E Playwright)*
- **`N-HERO-AC-04` (Autorização RBAC):** Perfis `sales` e `support` são impedidos de acionar controles de substituição e publicação, exibindo o card de acesso restrito aprovado. *(PASS - E2E Playwright)*
- **`N-HERO-AC-05` (Invariante Pública):** Vitrine e layout público do marketplace não sofrem alterações funcionais ou visuais involuntárias. *(PASS - Git Diff Zero em `apps/web`)*

---

## 5. Estratégia de Persistência e Limitações do Demo

1. **Armazenamento no Cliente:**
   - A imagem publicada ativa é gravada no IndexedDB do navegador (`fdc_admin_db` / `hero_image_settings`) como Data URL / Blob persistente, com fallback resiliente para `localStorage` e memória volátil em ambientes de teste SSR.
   - Isso garante que atualizações no demo sobrevivam ao recarregamento da página (F5) dentro da aplicação Admin.
2. **Ciclo de Vida de Memória:**
   - Todo Object URL temporário criado via `URL.createObjectURL` é monitorado e explicitamente desalocado com `URL.revokeObjectURL` durante o descarte ou reset da imagem, prevenindo vazamentos de memória no navegador.
3. **Limitação Crítica de Origem Cruzada:**
   - Como `apps/admin` e `apps/web` executam em portas/origens distintas em ambiente local e em produção, o armazenamento local do navegador não sincroniza a imagem publicada entre as duas aplicações.
   - A sincronização real da vitrine pública ocorrerá quando o backend disponibilizar a rota de upload e persistência centralizada de mídia em CDN.

---

## 6. Resultados dos Testes de Qualidade

### 6.1. Verificação de Tipos TypeScript (`pnpm check-types`)
- **Comando:** `turbo check-types`
- **Resultado:** 6 de 6 pacotes aprovados com 0 erros (`@feira/admin`, `@feira/web`, `@feira/ui`, `@feira/logger`, `@feira/api-client`, `@feira/testing`).

### 6.2. Lint e Formatação Biome (`pnpm lint`)
- **Comando:** `biome check .`
- **Resultado:** 451 arquivos verificados com 0 violações de formatação ou acessibilidade.

### 6.3. Testes Unitários Vitest (`pnpm test`)
- **Comando:** `turbo test`
- **Resultado:** 12 arquivos de teste do Admin executados, **101 testes unitários aprovados (100% de sucesso)**, incluindo 12 novos testes em `apps/admin/src/__tests__/hero-image-adapter.test.ts`.

### 6.4. Testes de Integração E2E Playwright (`pnpm test:e2e`)
- **Comando:** `playwright test "e2e/admin-cr003-hero-image.spec.ts" --project=desktop-chrome`
- **Resultado:** **6 de 6 cenários aprovados** em 4.8s:
  1. Navegação a partir do Settings Hub (`/configuracoes` → `/configuracoes/imagem-principal`) — **OK**
  2. Paridade visual com layout e seções do Figma ADM-D-054 — **OK**
  3. Fluxo de staging e descarte sem alteração da imagem ativa (AC-02) — **OK**
  4. Happy path de publicação com banner de sucesso e auditoria (AC-01) — **OK**
  5. Fallback e retenção de imagem após falha simulada (AC-03) — **OK**
  6. Bloqueio e UI de restrição para perfis não-Main Admin (AC-04) — **OK**

### 6.5. Build de Produção do Admin (`pnpm build`)
- **Comando:** `next build` em `apps/admin`
- **Resultado:** Build concluído com sucesso. Rota `/configuracoes/imagem-principal` pré-renderizada como página estática com Suspense boundary (13.7 kB).

---

## 7. Requisitos para Futura Integração com Backend

Quando a API backend do Feira de Carros for implementada, os seguintes endpoints deverão substituir o adaptador mock:

1. `GET /api/v1/admin/hero-image`: Retorna os metadados e URL CDN da imagem atualmente publicada.
2. `POST /api/v1/admin/hero-image/validate`: Recebe o payload da imagem para validação profunda no servidor (antivírus, sanitização EXIF, validação MIME mágica).
3. `POST /api/v1/admin/hero-image/publish`: Endpoint restrito a portadores do token JWT com claim `role: "main_admin"`. Salva no storage S3/GCS, invalida o cache da CDN da homepage e registra log formal de auditoria.

---

## 8. Informações de Versionamento e Entrega Git

- **Branch de Funcionalidade:** `feat/admin-cr003-homepage-hero-image`
- **Commit SHA:** `546511c8e90293d7d0850875d4c04648fdb69eda`
- **Repositório:** `https://github.com/mridha-rakib/feira-de-carros`

