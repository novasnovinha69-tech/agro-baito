# 📘 COMO USAR O SISTEMA — Guia passo a passo

> Este documento é para **você que está aprendendo** junto com o projeto.
> Cada etapa diz **onde clicar**, **o que fazer** e **o que vai acontecer**.
> Leia em ordem. Se travar em algum passo, me avise qual.

---

## 🎯 O que já está pronto (não precisa mexer)

| Parte | Status |
|---|---|
| 🏪 Site da loja (home, catálogo, produto, carrinho) | ✅ Pronto |
| 🎨 Visual azul profissional + WhatsApp | ✅ Pronto |
| 🔐 Painel admin (produtos, pedidos, fotos) | ✅ Pronto |
| 👑 Sistema de 2 usuários (Master = você / Admin = cliente) | ✅ Pronto |
| 🗄️ Conexão com banco de dados (Supabase) | ✅ Conectado |

---

## 👑 OS DOIS TIPOS DE USUÁRIO

O sistema tem **2 níveis de permissão** para proteger o site:

### 👑 MASTER (VOCÊ — dono do sistema)
- Pode **TUDO**: cadastrar produtos, ver pedidos, mexer em API, configurar tudo
- Pode **apagar** produtos, categorias, fotos
- Pode **criar outros usuários** (dar acesso ao cliente)
- Vê **todas as telas** do painel

### 👤 ADMIN DA LOJA (O CLIENTE)
- Pode **cadastrar e editar** produtos, **subir fotos**
- Pode **ver e mudar status** de pedidos (confirmado, saiu p/ entrega...)
- Pode **ver** o estoque e as zonas de entrega
- **NÃO pode** mexer em configurações de API (Mercado Pago, WhatsApp)
- **NÃO pode apagar** produtos nem categorias
- **NÃO vê** a tela "Configurações" no menu

> 💡 **Isso protege o cliente de si mesmo** — ele não derruba o pagamento nem apaga
> algo por engano. Você (master) resolve tudo o que for delicado.

---

## ✅ ETAPA 1 — Criar as tabelas no banco (FAZER 1 VEZ)

> 📍 **ONDE:** painel do Supabase → SQL Editor
> ⏱️ **TEMPO:** 2 minutos
> 🎯 **O QUE FAZ:** cria as "gavetas" onde o site guarda produtos e pedidos

### Passo a passo

1. Abra o navegador em: **https://supabase.com/dashboard**
2. Faça login (na conta que você já criou)
3. Clique no seu projeto **"agro-mundo"** (ou o nome que deu)
4. No **menu esquerdo**, clique em **SQL Editor** (ícone `>_`)
5. Clique no botão **"New query"** (canto superior)
6. Abra o arquivo `supabase/RODAR_NO_SUPABASE.sql` deste projeto no Bloco de Notas
7. **Copie todo o conteúdo** (Ctrl+A → Ctrl+C)
8. **Cole na caixa** do SQL Editor (Ctrl+V)
9. Clique no botão verde **"Run"** (ou Ctrl+Enter)
10. Vai aparecer: **"Success. No rows returned"** ✅

### 🎉 O que aconteceu:
- Criou todas as tabelas (produtos, pedidos, categorias, etc.)
- Criou as permissões de Master e Admin
- Cadastrou as categorias (Rações, Ferragens, etc.)
- Cadastrou as zonas de entrega (Itapema, BC, Vale do Itajaí)
- Criou a pasta `produtos` para guardar as fotos

---

## ✅ ETAPA 2 — Criar o SEU usuário Master (FAZER 1 VEZ)

> 📍 **ONDE:** painel do Supabase → Authentication → Users
> ⏱️ **TEMPO:** 3 minutos
> 🎯 **O QUE FAZ:** cria o login do DONO (você)

### Passo a passo

1. No painel do Supabase, menu esquerdo, clique em **Authentication** (ícone de escudo)
2. Clique em **Users** (sub-menu)
3. Clique no botão azul **"Add user"** → **"Create new user"**
4. Preencha:
   - **Email:** seu email (ex: `seuemail@gmail.com`)
   - **Password:** crie uma senha forte e **anote**
   - Marque **"Auto Confirm User"** ✅ (importante!)
5. Clique em **"Create user"**
6. O usuário vai aparecer na lista. Clique nele.
7. **Copie o "User UID"** (uma sequência longa de letras e números, ex: `a1b2c3d4-...`)

### Agora vem a parte que transforma ele em MASTER:

8. Volte no **SQL Editor** (menu esquerdo → `>_`)
9. Clique em **"New query"**
10. Cole o código abaixo, **substituindo o UID** pelo que você copiou:

```sql
INSERT INTO public.admins (user_id, nome, email, role)
VALUES ('COLE_SEU_UID_AQUI', 'Seu Nome', 'seuemail@gmail.com', 'master');
```

11. Clique em **Run** ✅

> 🎉 Pronto! Você agora é MASTER. Faça login em http://localhost:3000/entrar
> com esse email e senha.

---

## ✅ ETAPA 3 — Criar o usuário ADMIN da loja (para o CLIENTE)

> 📍 **ONDE:** painel do Supabase → Authentication → Users (logado como master)
> ⏱️ **TEMPO:** 3 minutos
> 🎯 **O QUE FAZ:** cria o login do CLIENTE (sem acesso a configs sensíveis)

### Passo a passo

1. No painel do Supabase → **Authentication → Users**
2. Clique em **"Add user"** → **"Create new user"**
3. Preencha:
   - **Email:** email do cliente (ex: `loja@agromundoanimal.com.br`)
   - **Password:** uma senha (depois dá pra eles trocarem)
   - Marque **"Auto Confirm User"** ✅
4. Clique em **"Create user"**
5. Copie o **User UID** desse novo usuário
6. Vá no **SQL Editor → New query**, cole (substituindo o UID):

```sql
INSERT INTO public.admins (user_id, nome, email, role)
VALUES ('COLE_UID_DO_CLIENTE', 'Agro Mundo Animal', 'loja@agromundoanimal.com.br', 'admin');
```

7. Clique em **Run** ✅

> 🎉 Agora o cliente tem acesso limitado. Quando ele logar, **não vai ver**
> a tela de Configurações.

---

## 🧪 ETAPA 4 — Testar tudo (validar)

### Teste 1: Login do MASTER (você)
1. Acesse **http://localhost:3000/entrar**
2. Digite seu email + senha
3. Deve entrar no painel e aparecer **👑 Master** no menu lateral
4. Clique em **Configurações** — deve abrir normal

### Teste 2: Login do ADMIN (cliente)
1. Acesse **http://localhost:3000/entrar**
2. Digite email + senha do cliente
3. Deve entrar no painel e aparecer **"Loja"** no menu (sem 👑)
4. **NÃO deve aparecer** "Configurações" no menu
5. Tente acessar `http://localhost:3000/admin/configuracoes` direto
   → deve aparecer **"Acesso restrito"** ✅

### Teste 3: Subir uma foto (o mais importante!)
1. Logue como admin (você ou cliente)
2. Vá em **Produtos → Novo produto**
3. Preencha nome, preço, etc.
4. Na área **"Foto do produto"**, clique em **"Clique para escolher"**
5. Escolha uma foto do computador → aparece o preview
6. Clique em **Salvar**
7. Vá no site (http://localhost:3000/catalogo) → a foto aparece! 🎉

---

## 🆘 PROBLEMAS COMUNS

### "Não consigo logar — diz credenciais inválidas"
- Confira se marcou **"Auto Confirm User"** ao criar o usuário
- Confira email e senha (copie/cole pra não errar)

### "Logo mas cai na tela de login de novo"
- Você criou o usuário no Authentication, mas esqueceu de rodar o SQL
  que adiciona ele na tabela `admins`. Volte na Etapa 2 ou 3, passo 8.

### "O cliente consegue ver Configurações"
- Confira se você usou `'admin'` (e não `'master'`) no SQL do cliente

### "A foto não sobe — diz erro"
- Confira se rodou o SQL completo (Etapa 1) — ele cria o bucket de fotos
- Tente uma foto menor que 5MB e formato JPG/PNG

---

## 📞 ONDE PEDIR AJUDA

Se travar em qualquer passo, me diga:
1. **Qual etapa** você estava fazendo (ex: "Etapa 2, passo 7")
2. **O que apareceu na tela** (pode mandar print)
3. **O que você esperava** que acontecesse

Eu te ajudo a destravar! 🚜
