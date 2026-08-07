# 🚀 Guia de Configuração — Sistema 100% Automático

Este guia mostra como ativar o **agendamento automático** da High Line.
Depois de configurar (1 vez, ~5 minutos), você nunca mais precisa mexer em nada.

---

## ✨ O que muda depois de configurar

| Antes (modo local) | Depois (modo automático) |
|--------------------|--------------------------|
| Você edita `horarios.js` manualmente | **Tudo automático** — não mexe em nada |
| Cliente pode marcar horário já ocupado | **Impossível** — sistema bloqueia sozinho |
| Painel só funciona no seu PC | **Funciona em qualquer dispositivo** |
| Horários só atualizam quando você mexe | **Tempo real** — todos veem igual |

---

## 📋 Passo a Passo (5 minutos)

### Passo 1 — Criar conta grátis no Supabase (1 min)

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"** (canto superior direito)
3. Faça login com sua conta **Google** (mais rápido) ou GitHub
4. Aceite os termos

### Passo 2 — Criar o projeto (1 min)

1. Clique em **"New project"**
2. Preencha:
   - **Name**: `high-line` (ou o nome que quiser)
   - **Database Password**: crie uma senha forte e **anote em lugar seguro** 📝
   - **Region**: `South America (São Paulo)` — mais próximo do Brasil
3. Clique em **"Create new project"**
4. **Aguarde ~2 minutos** enquanto ele cria (vai aparecer uma barra de progresso)

### Passo 3 — Criar a tabela de agendamentos (2 min)

1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique em **"New query"** (ou "+ New")
3. **Cole o código abaixo** na caixa de texto:

```sql
CREATE TABLE agendamentos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  veiculo TEXT NOT NULL,
  servico TEXT NOT NULL,
  preco TEXT,
  data DATE NOT NULL,
  horario TEXT NOT NULL,
  observacoes TEXT,
  status TEXT DEFAULT 'pendente',
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT horario_unico UNIQUE (data, horario)
);

ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso publico" ON agendamentos
  FOR ALL USING (true) WITH CHECK (true);
```

4. Clique em **"Run"** (botão verde)
5. Vai aparecer **"Success. No rows returned"** ✅

### Passo 4 — Pegar suas chaves (30 segundos)

1. No menu lateral, clique em **"Project Settings"** (ícone de engrenagem ⚙️)
2. Clique em **"API"**
3. Você verá dois valores importantes:
   - **Project URL**: algo como `https://xyzaaaaa.supabase.co`
   - **anon public key**: uma chave bem longa (começa com `eyJ...`)

**Copie os dois valores.**

### Passo 5 — Colar no arquivo config.js (30 segundos)

1. Abra o arquivo **`config.js`** (na pasta do site)
2. Substitua os valores vazios pelas suas chaves:

```javascript
window.SUPABASE_CONFIG = {
  url: "https://xyzaaaaa.supabase.co",     // ← cole sua URL aqui
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5..."  // ← cole sua chave aqui
};
```

3. Salve o arquivo.

### Passo 6 — Testar! 🎉

1. Abra o site
2. Faça um agendamento de teste
3. Abra o **`admin.html`** — deve aparecer lá!
4. Faça outro agendamento no mesmo horário — **o sistema vai bloquear** ✅

---

## 💰 Custo

**TOTALMENTE GRÁTIS** para o volume de uma estética automotiva.

O Supabase oferece no plano grátis:
- **500 MB** de banco de dados (cabe milhares de agendamentos)
- **50.000 requisições/mês** (muito mais do que você vai usar)
- **Sem limite de tempo** — grátis para sempre

Se um dia a High Line crescer muito (centenas de agendamentos por dia),
aí sim vale a pena pagar (US$ 25/mês). Mas pra começar, grátis.

---

## 📱 Como acessar seu painel de qualquer lugar

Depois de subir o site na internet (Netlify), você acessa:

```
https://seu-endereco.netlify.app/admin.html
```

Funciona no celular, tablet, PC — em qualquer lugar do mundo.
Atualiza sozinho a cada 30 segundos.

---

## ❓ Problemas comuns

**"O painel admin não mostra nada"**
→ Verifique se preencheu corretamente o `config.js` (URL e chave)

**"Cliente não consegue agendar"**
→ Verifique se rodou o código SQL do Passo 3 sem erros

**"Esqueci minha senha do banco"**
→ No painel do Supabase: Project Settings → Database → Reset password

---

## 🆘 Precisa de ajuda?

Se travar em qualquer passo, me chama que eu te ajudo!
