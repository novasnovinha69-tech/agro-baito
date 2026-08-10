# Plano: Observabilidade + Qualidade + Testes

## Resumo
Montar do zero a infra completa de observabilidade (Sentry), qualidade de código (Biome + commitlint + husky + lint-staged + knip) e testes (Vitest unitário/integração + Playwright E2E + coverage Codecov), com CI no GitHub Actions. Issue única → branch → PR com `Closes #N`.

## Issue GitHub
- **Título:** "Observabilidade (Sentry) + qualidade (Biome/commitlint/knip) + testes (Vitest/Playwright/Codecov)"
- **Labels:** `nova-funcao`, `melhoria`, `infra`

---

## 1. Observabilidade — Sentry

**Por que Sentry:** escolhido pelo usuário. SDK nativo Next.js com auto-instrumentação de erros + performance. DSN opcional (se não configurado, o SDK no-ops silenciosamente — não quebra local/dev).

**Arquivos a criar:**
- `sentry.client.config.ts` — captura erros client-side (browser)
- `sentry.server.config.ts` — captura erros server-side (Node)
- `sentry.edge.config.ts` — captura erros edge (middleware)
- `instrumentation.ts` — hook que inicializa o Sentry server/edge

**Arquivos a modificar:**
- `next.config.mjs` — envolver config com `withSentryConfig` (tree-shaking do bundle Sentry, source maps upload silencioso sem auth token)
- `.env.example` — adicionar `SENTRY_DSN` (e `SENTRY_AUTH_TOKEN`/`SENTRY_ORG`/`SENTRY_PROJECT` comentados como opcionais)

**Dependências:** `@sentry/nextjs` (dev + prod)

**Comportamento sem DSN:** o `Sentry.init` é condicional — se `!process.env.SENTRY_DSN`, retorna sem inicializar. Zero impacto em dev.

---

## 2. Qualidade de código — Biome + hooks + commitlint + knip

### 2a. Biome (substitui ESLint + Prettier)
**Por que:** escolhido pelo usuário. 1 binário, 10-100x mais rápido, config única.

**Arquivos:**
- `biome.json` — config com formatação (2 espaços, aspas duplas, vírgula trailing) + linter (recommended + regras de a11y/style). `ignore` para `.next`, `node_modules`, `plataforma-modelos`, `*.config.*`.
- Remover `.eslintrc.json`
- `next.config.mjs` — remover `eslint: { ignoreDuringBuilds: true }` (não há mais ESLint)
- `package.json` scripts: `lint` → `biome lint`, `format` → `biome format --write`, `check` → `biome check`, `lint:fix` → `biome check --write`

**Dependências:** `@biomejs/biome` (dev)

### 2b. commitlint
Garante mensagens de commit no padrão Conventional Commits (que o AGENTS.md já determina).
- `commitlint.config.js` — extends `@commitlint/config-conventional`
- **Dep:** `@commitlint/cli`, `@commitlint/config-conventional`

### 2c. husky + lint-staged
Git hooks que rodam antes do commit.
- `.husky/pre-commit` → roda `lint-staged` (biome check --write nos arquivos staged + typecheck)
- `.husky/commit-msg` → roda `commitlint --edit`
- `package.json` → `"prepare": "husky"` + seção `lint-staged`
- **Deps:** `husky`, `lint-staged`

### 2d. knip
Detecta código morto (exports não usados, deps não usadas, arquivos órfãos).
- `knip.json` — `entry`: `app/**`, `components/**`, `lib/**`; `ignore`: `plataforma-modelos`, testes
- `package.json` script: `knip`
- **Dep:** `knip`

---

## 3. Testes

### 3a. Vitest (unitário + integração)
**Runner escolhido:** compatível com Vite/Next, API similar ao Jest, watch mode rápido, coverage integrada.

- `vitest.config.ts` — environment `jsdom` (para hooks do carrinho/Zustand), `setup.ts` com cleanup, alias `@/` → `./`, coverage `v8` com thresholds (statements/branches/functions/lines ≥ 80% nos arquivos de `lib/`), `include` glob para `**/*.test.ts`.
- `vitest.setup.ts` — reset de stores/mocks entre testes
- `package.json` scripts: `test`, `test:run` (`vitest run`), `test:watch`, `test:coverage`

**Deps:** `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react` (futuro p/ componentes), `@vitejs/plugin-react`

**Testes a escrever (lógica pura de `lib/`):**

| Arquivo de teste | Alvo | Casos principais |
|---|---|---|
| `lib/__tests__/money.test.ts` | `lib/money.ts` | `formatBRL` (centavos→R$, zero, negativo), `formatBRLValue`, `sumCents`, `applyPercent` (arredondamento), `maskPhone` (várias densidades), `maskCEP`, `maskCpfCnpj` (CPF vs CNPJ), `formatPeso` (null, inteiro, decimal) |
| `lib/__tests__/frete.test.ts` | `lib/frete.ts` | `calcularFretePorZona` (sem zona, zona inativa, zona ativa, % sobre subtotal, retirada), `descricaoTipoZona` (todos os tipos), `FRETE_GRATIS_MIN_CENTS` |
| `lib/__tests__/carrinho.test.ts` | `lib/carrinho.ts` | `precoEfetivoCents` (promo, sem promo, null), `temPromocao`, `precoPorUnidadeCents` (com peso, sem peso) |
| `lib/__tests__/status-pedido.test.ts` | `lib/status-pedido.ts` | `STATUS_INFO` (7 status, labels/variants), `STATUS_ORDEM` (ordem/7 itens) |
| `lib/__tests__/cep.test.ts` | `lib/cep.ts` | `casarZonaPorEndereco` (bairro exato, bairro parcial, cidade, sem match, normalização acento/case), `buscarCep` (mock fetch, CEP inválido, sucesso, erro) |
| `lib/__tests__/store-carrinho.test.ts` | `lib/store/carrinho.ts` | `clampQuantidade` (via store: qtd mínima, múltiplo), `adicionar` (novo item, item existente, limite estoque), `atualizarQuantidade`, `remover`, `limpar`, `subtotalCents`, `totalItens`, `sincronizarEstoque` |

### 3b. Playwright (E2E)
- `playwright.config.ts` — baseURL `localhost:3000`, 1 projeto Chromium, webServer auto-start do `npm run dev`, retries em CI
- `e2e/smoke.spec.ts` — teste de fumaça: home carrega, navega para catálogo, abre produto, fluxo até checkout (sem finalizar pagamento)
- `.gitignore` — adicionar `playwright-report/`, `test-results/`
- `package.json` script: `test:e2e`
- **Dep:** `@playwright/test`

### 3c. Codecov (coverage upload)
- `.github/workflows/ci.yml` (ver seção 4) roda `test:coverage` e faz upload pro Codecov com token.
- `codecov.yml` — config mínima (target 80%, apenas `lib/`)
- **Dep:** nenhuma (upload via action `codecov/codecov-action`)

---

## 4. CI — GitHub Actions
- `.github/workflows/ci.yml` — roda a cada push/PR:
  1. Checkout + setup Node 20 + cache npm
  2. `npm ci`
  3. `npm run typecheck`
  4. `npm run lint` (biome)
  5. `npm run test:run` (vitest)
  6. `npm run knip`
  7. Upload coverage pro Codecov
  8. `npm run build`

---

## 5. Arquivos novos/modificados — resumo

**Novos (24 arquivos):**
- `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`
- `biome.json`, `commitlint.config.js`, `knip.json`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `codecov.yml`
- `.husky/pre-commit`, `.husky/commit-msg`
- `lib/__tests__/money.test.ts`, `frete.test.ts`, `carrinho.test.ts`, `status-pedido.test.ts`, `cep.test.ts`, `store-carrinho.test.ts`
- `e2e/smoke.spec.ts`
- `.github/workflows/ci.yml`

**Modificados (5):**
- `next.config.mjs` (withSentryConfig + remover eslint ignore)
- `.env.example` (SENTRY_DSN)
- `package.json` (scripts + deps)
- `.gitignore` (playwright-report, test-results)
- Remover `.eslintrc.json`

---

## 6. Verificação antes do PR
- `npm run typecheck` — sem erros
- `npm run lint` (biome) — sem erros
- `npm run test:run` — todos os testes passam
- `npm run knip` — sem código morto (ou warnings aceitáveis)
- `npm run build` — compila com Sentry config

## 7. Workflow GitHub
1. Criar Issue (nova-funcao/melhoria/infra)
2. Branch `nova-funcao/N-observabilidade-qualidade-testes`
3. Commitar (Conventional Commits, em PT-BR)
4. PR `Closes #N` com labels `deploy`/`nova-funcao`/`melhoria`/`infra`
5. Merge = deploy Vercel

## Notas
- **Stryker (mutation testing)** foi citado mas fica de fora deste PR: é caro de rodar e mais útil como etapa madura. Posso adicionar depois como issue separada se quiser.
- **Datadog/New Relic** não incluídos (usuário escolheu Sentry-only).
- **arch-contract** é uma ferramenta muito nicho/sem adoção ampla — o `knip` + `biome` cobrem o mesmo espaço de forma mais robusta.
- O CI não bloqueia o deploy da Vercel (que é por merge em main), mas falhará o CI se algo quebrar — servindo como gate de qualidade visível.