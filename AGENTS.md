# AGENTS.md — Instruções canônicas para qualquer agente

> Este arquivo é a **fonte da verdade** sobre como trabalhamos neste repositório.
> Qualquer agente (qualquer modelo, qualquer ferramenta — ZCode, Claude, Copilot,
> Cursor, Codex, etc.) **DEVE seguir estas regras** antes de tocar no código.
>
> Se você é um agente e acabou de carregar este arquivo: leia tudo até o fim
> antes de fazer qualquer alteração.

**Projeto:** Agro Baito / Agro Mundo Animal — e-commerce (Next.js 14 + Supabase + Mercado Pago)
**Repo:** `novasnovinha69-tech/agro-baito`
**Produção:** Vercel (deploy automático a partir de `main`)
**Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind, Supabase, Zustand

---

## 🧭 Princípios gerais

1. **Nunca commite direto em `main`.** Toda mudança passa por Issue → Branch → PR.
2. **Toda tarefa começa como Issue.** Não existe "só vou mexer" — se é trabalho,
   vira Issue primeiro.
3. **Todo deploy é gerenciado por PR.** O merge para `main` = deploy para a Vercel.
4. **Mencione a issue no PR** (`Closes #N` / `Fixes #N` / `Ref #N`).
5. **Um PR = uma issue.** Não misture escopos. Se cresceu, abra outra issue/PR.
6. **Escreva em PT-BR** nas issues, PRs, commits e mensagens para o usuário.
   Código e identificadores em inglês (convenção do projeto).

---

## 📋 Workflow padrão (OBRIGATÓRIO)

```
Issue  →  Branch  →  Commits  →  Push  →  PR (closes #N)  →  Review  →  Merge em main  →  Deploy Vercel
```

### Passo a passo

#### 1. Criar a Issue
Antes de qualquer código, garanta que existe uma issue descrevendo o trabalho.
Toda issue recebe **exatamente um tipo** (label obrigatória):

| Label | Quando usar |
|---|---|
| `bug` / `correcao` | Algo quebrado ou regressão |
| `melhoria` | Refator, performance, UX sobre algo que já existe |
| `nova-funcao` | Funcionalidade nova que não existe |
| `infra` | Deploy, CI/CD, build, config, dependências |
| `docs` | Documentação |

Labels opcionais adicionais podem ser adicionadas, mas **uma das acima é obrigatória**.

#### 2. Criar a Branch a partir de `main`
Convenção de nome (sem acento, sem espaço, kebab-case):

```
<tipo>/<numero-da-issue>-<descricao-curta>
```

Exemplos:
- `correcao/42-checkout-pix`
- `melhoria/17-loading-catalogo`
- `nova-funcao/8-cupom-desconto`
- `infra/5-configurar-dominio`

Onde `<tipo>` ∈ {`correcao`, `melhoria`, `nova-funcao`, `infra`, `docs`}.

#### 3. Commits
- Mensagens em PT-BR, no padrão **Conventional Commits**:
  - `feat: ...` (nova-funcao)
  - `fix: ...` (correcao/bug)
  - `refactor: ...` (melhoria)
  - `perf: ...` (melhoria de performance)
  - `chore: ...` / `ci: ...` (infra)
  - `docs: ...` (docs)
- Referencie a issue no corpo quando relevante: `Refs #42`.
- Commits pequenos e focados.

#### 4. Abrir o PR
- **Branch base:** `main` (é o que dispara o deploy na Vercel).
- **Título:** claro, em PT-BR.
- **Descrição obrigatória** contendo:
  - `Closes #N` (ou `Fixes #N` / `Resolves #N`) — **obrigatório** para vincular a issue.
  - **O que mudou** (resumo executivo).
  - **Como testar** (passos manuais ou comando).
  - **Tipo:** correção / melhoria / nova função.
- **Labels:** replicar a label de tipo da issue + `deploy` (pois merge em `main` publica).
- Só abrir o PR depois de `typecheck` e `lint` passarem localmente.

#### 5. Review e Merge
- Validar que o build/CI está verde.
- Merge preferencialmente **Squash and merge** (mantém o histórico limpo).
- Ao mergir em `main`, a Vercel publica automaticamente em produção.

#### 6. Fechar a issue
- Usar `Closes #N` no PR fecha a issue automaticamente no merge.
- Se a issue não deve ser fechada (ex: PR parcial), use `Refs #N` e feche manualmente ao final.

---

## 🚀 Deploys (Vercel)

- `main` = **produção**. Todo merge aqui publica automaticamente.
- Não existe ambiente de staging configurado por padrão. Se precisar, criar branch
  de preview e discutir antes.
- **Nunca** force-push para `main`.
- Se um deploy quebrar produção: reverta o PR (`Revert` no GitHub) ao invés de
  fazer commit de hotfix direto — isso cria um PR de revert rastreável.

---

## 🤖 Como operar o GitHub (sem `gh` CLI)

O `gh` CLI **não está instalado** neste ambiente. Use a API REST do GitHub via
`curl` com o token que já está no remote do git. Exemplos:

```bash
TOKEN="ghp_..."   # já embutido no remote origin
REPO="novasnovinha69-tech/agro-baito"
AUTH="Authorization: token $TOKEN"

# Criar issue
curl -s -X POST -H "$AUTH" -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO/issues" \
  -d '{"title":"...","body":"...","labels":["bug"]}'

# Criar branch (a partir do SHA mais recente da main)
SHA=$(git rev-parse origin/main)
curl -s -X POST -H "$AUTH" -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO/git/refs" \
  -d "{\"ref\":\"refs/heads/correcao/42-x\",\"sha\":\"$SHA\"}"

# Abrir PR
curl -s -X POST -H "$AUTH" -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO/pulls" \
  -d '{"title":"...","head":"correcao/42-x","base":"main","body":"Closes #42 ..."}'

# Adicionar labels a um PR/issue
curl -s -X POST -H "$AUTH" -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO/issues/N/labels" \
  -d '{"labels":["deploy","correcao"]}'
```

> Para operações de git (commit/push), use `git` normalmente — o remote já tem o token.

---

## 🧪 Verificações locais antes de abrir PR

Rode sempre (devem passar sem erros):

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run build       # next build (build de produção)
```

Se `build` estiver muito lento para iteração, no mínimo `typecheck` + `lint`.

---

## 🗂️ Estrutura do projeto (referência rápida)

```
app/              # App Router (páginas e rotas da API)
components/       # Componentes React/UI (shadcn/ui)
lib/              # Helpers, clientes Supabase/Mercado Pago, utils
types/            # Tipos TypeScript (incl. database.types.ts)
supabase/         # Migrações e SQL do banco
middleware.ts     # Proteção de rotas / auth
public/           # Assets estáticos
plataforma-modelos/  # Projeto SEPARADO (não pertence ao site) — ignorar
```

> `plataforma-modelos/` é um projeto à parte. Não o inclua em PRs do site.

---

## ⚠️ O que NUNCA fazer

- ❌ Commitar direto em `main`.
- ❌ Force-push em `main`.
- ❌ Commitar `.env*`, `.vercel/`, `node_modules/`, `*.log`, `.next/`.
- ❌ Abrir PR sem `Closes #N` / `Refs #N`.
- ❌ Abrir PR com `typecheck` ou `lint` quebrando.
- ❌ Misturar mais de uma issue no mesmo PR.
- ❌ Mexer em `plataforma-modelos/` num PR do site principal.

---

## 📌 Notas finais

- Mantenha este arquivo atualizado se o workflow evoluir (via PR, claro — meta? sim).
- Quando em dúvida entre "corrigir" ou "melhorar": se já existia e quebrou → `correcao`;
  se existia e funciona mas pode ficar melhor → `melhoria`.
- Comunicação com o usuário é sempre em PT-BR.
