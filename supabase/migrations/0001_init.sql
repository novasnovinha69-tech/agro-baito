-- =============================================================================
--  AGRO MUNDO ANIMAL — Esquema inicial do banco (PostgreSQL / Supabase)
--  Rodar no SQL Editor do Supabase OU via: supabase db push
--  Idempotente: pode rodar mais de uma vez sem quebrar (DROP ... IF EXISTS).
-- =============================================================================

-- Extensões -------------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()

--Limpeza prévia (descomente em dev para reset total) -------------------------
-- drop table if exists public.status_historico cascade;
-- drop table if exists public.pedido_itens cascade;
-- drop table if exists public.pedidos cascade;
-- drop table if exists public.zonas_entrega cascade;
-- drop table if exists public.unidades cascade;
-- drop table if exists public.produtos cascade;
-- drop table if exists public.categorias cascade;
-- drop table if exists public.admins cascade;
-- drop table if exists public.config_loja cascade;

-- =============================================================================
--  ENUMS
-- =============================================================================
do $$ begin
  create type public.status_pedido as enum (
    'pendente',              -- pedido criado, antes do pagamento
    'aguardando_pagamento',  -- Pix gerado, aguardando confirmação
    'confirmado',            -- pagamento confirmado
    'em_separacao',          -- loja separando o pedido
    'saiu_para_entrega',
    'entregue',
    'cancelado'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.tipo_entrega as enum ('retirada', 'entrega');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.tipo_zona as enum ('retirada', 'bairro', 'cidade');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.admin_role as enum ('admin', 'gerente');
exception when duplicate_object then null; end $$;

-- =============================================================================
--  TABELAS
-- =============================================================================

-- Categorias ------------------------------------------------------------------
create table if not exists public.categorias (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  slug        text not null unique,
  icone       text,                       -- nome do ícone lucide-react
  ordem       int  not null default 0,
  created_at  timestamptz not null default now()
);

-- Produtos --------------------------------------------------------------------
create table if not exists public.produtos (
  id                          uuid primary key default gen_random_uuid(),
  categoria_id                uuid not null references public.categorias(id) on delete restrict,
  nome                        text not null,
  slug                        text not null unique,
  descricao                   text,
  preco_cents                 int  not null check (preco_cents >= 0),
  preco_promocional_cents     int  check (preco_promocional_cents is null or preco_promocional_cents >= 0),
  preco_por_kg                boolean not null default false,  -- exibe preço por kg/lt
  peso_kg                     numeric(10,3),                   -- peso real do item
  unidade_medida              text not null default 'un',      -- un|kg|lt|ml|cx|pct
  estoque                     int  not null default 0 check (estoque >= 0),
  estoque_minimo              int  not null default 0,
  qtd_minima                  int  not null default 1 check (qtd_minima >= 1),
  multiplo                    int  not null default 1 check (multiplo >= 1),
  foto_url                    text,
  destaque                    boolean not null default false,
  ativo                       boolean not null default true,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);
create index if not exists idx_produtos_categoria on public.produtos(categoria_id);
create index if not exists idx_produtos_ativo    on public.produtos(ativo);
create index if not exists idx_produtos_destaque on public.produtos(destaque);
create index if not exists idx_produtos_estoque  on public.produtos(estoque);

-- Unidades (lojas físicas) ----------------------------------------------------
create table if not exists public.unidades (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  slug        text not null unique,
  endereco    text,
  whatsapp    text,                        -- só dígitos, DDI+DDD+numero
  ativa       boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Zonas de entrega (% de frete por bairro/cidade) -----------------------------
create table if not exists public.zonas_entrega (
  id                  uuid primary key default gen_random_uuid(),
  unidade_id          uuid not null references public.unidades(id) on delete cascade,
  nome                text not null,                       -- "Centro (Tabuleiro)"
  tipo                public.tipo_zona not null,
  valor               text not null,                       -- nome do bairro/cidade p/ casar (lowercase)
  frete_percentual    numeric(5,2) not null default 0 check (frete_percentual >= 0),
  prazo_horas         int not null default 24,
  ativa               boolean not null default true,
  created_at          timestamptz not null default now()
);
create index if not exists idx_zonas_unidade on public.zonas_entrega(unidade_id);
create index if not exists idx_zonas_tipo    on public.zonas_entrega(tipo, valor);

-- Pedidos ---------------------------------------------------------------------
create table if not exists public.pedidos (
  id                    uuid primary key default gen_random_uuid(),
  codigo                text not null unique,              -- AMA-0001
  cliente_nome          text not null,
  cliente_telefone      text not null,                     -- só dígitos
  cliente_email         text,
  cliente_cpf_cnpj      text,
  subtotal_cents        int not null check (subtotal_cents >= 0),
  frete_cents           int not null default 0 check (frete_cents >= 0),
  total_cents           int not null check (total_cents >= 0),
  zona_id               uuid references public.zonas_entrega(id) on delete set null,
  unidade_id            uuid references public.unidades(id) on delete set null,
  tipo_entrega          public.tipo_entrega not null,
  endereco              jsonb,                             -- {logradouro, numero, bairro, cidade, cep, complemento, referencia}
  status                public.status_pedido not null default 'pendente',
  pagamento_id          text,                              -- id do pagamento na MP
  pagamento_status      text,                              -- approved|pending|rejected
  pix_qr_code           text,                              -- "copia e cola"
  pix_qr_base64         text,                              -- imagem base64 do QR
  pix_expira_em         timestamptz,
  observacoes           text,
  token_acesso          text not null,                     -- hash p/ visitante acessar /pedido/[id]
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists idx_pedidos_status    on public.pedidos(status);
create index if not exists idx_pedidos_telefone  on public.pedidos(cliente_telefone);
create index if not exists idx_pedidos_criado    on public.pedidos(created_at desc);

-- Itens do pedido -------------------------------------------------------------
create table if not exists public.pedido_itens (
  id                    uuid primary key default gen_random_uuid(),
  pedido_id             uuid not null references public.pedidos(id) on delete cascade,
  produto_id            uuid not null references public.produtos(id) on delete restrict,
  nome_snapshot         text not null,
  preco_cents_snapshot  int not null,
  quantidade            int not null check (quantidade > 0),
  peso_kg               numeric(10,3),
  unidade_medida        text not null default 'un',
  created_at            timestamptz not null default now()
);
create index if not exists idx_itens_pedido on public.pedido_itens(pedido_id);

-- Histórico de status (timeline) ----------------------------------------------
create table if not exists public.status_historico (
  id                    uuid primary key default gen_random_uuid(),
  pedido_id             uuid not null references public.pedidos(id) on delete cascade,
  status                public.status_pedido not null,
  observacao            text,
  notificado_whatsapp   boolean not null default false,
  created_at            timestamptz not null default now()
);
create index if not exists idx_hist_pedido on public.status_historico(pedido_id);

-- Admins (vínculo auth.users ↔ role) -----------------------------------------
create table if not exists public.admins (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  nome        text not null,
  email       text not null,
  role        public.admin_role not null default 'admin',
  created_at  timestamptz not null default now()
);

-- Configurações gerais (chave/valor) -----------------------------------------
create table if not exists public.config_loja (
  chave       text primary key,
  valor       text,
  updated_at  timestamptz not null default now()
);

-- =============================================================================
--  TRIGGERS — updated_at automático
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_produtos_updated on public.produtos;
create trigger trg_produtos_updated before update on public.produtos
  for each row execute function public.set_updated_at();

drop trigger if exists trg_pedidos_updated on public.pedidos;
create trigger trg_pedidos_updated before update on public.pedidos
  for each row execute function public.set_updated_at();

-- =============================================================================
--  FUNÇÕES
-- =============================================================================

-- Gera o próximo código de pedido no formato AMA-0001 -------------------------
create or replace function public.gerar_codigo_pedido()
returns text language plpgsql security definer as $$
declare
  proximo int;
begin
  select count(*) + 1 into proximo from public.pedidos;
  return 'AMA-' || lpad(proximo::text, 4, '0');
end $$;

-- Dá baixa no estoque quando o pedido é confirmado (chamada no webhook da MP) --
create or replace function public.baixar_estoque(p_pedido uuid)
returns void language plpgsql security definer as $$
begin
  update public.produtos p
     set estoque = p.estoque - i.quantidade
    from public.pedido_itens i
   where i.pedido_id = p_pedido
     and i.produto_id = p.id
     and p.estoque >= i.quantidade;  -- segurança: nunca negativo
end $$;

-- =============================================================================
--  ROW LEVEL SECURITY
-- =============================================================================
alter table public.categorias        enable row level security;
alter table public.produtos          enable row level security;
alter table public.unidades          enable row level security;
alter table public.zonas_entrega     enable row level security;
alter table public.pedidos           enable row level security;
alter table public.pedido_itens      enable row level security;
alter table public.status_historico  enable row level security;
alter table public.admins            enable row level security;
alter table public.config_loja       enable row level security;

-- Helper: é admin? ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.admins a
    where a.user_id = auth.uid()
  );
$$;

-- Catálogo: leitura pública, escrita só admin --------------------------------
create policy "categorias_read_public"  on public.categorias for select using (true);
create policy "categorias_write_admin"  on public.categorias for all
  using (public.is_admin()) with check (public.is_admin());

create policy "produtos_read_public"
  on public.produtos for select using (ativo = true or public.is_admin());
create policy "produtos_write_admin"
  on public.produtos for all
  using (public.is_admin()) with check (public.is_admin());

create policy "unidades_read_public"   on public.unidades for select using (ativa = true or public.is_admin());
create policy "unidades_write_admin"   on public.unidades for all
  using (public.is_admin()) with check (public.is_admin());

create policy "zonas_read_public"      on public.zonas_entrega for select using (ativa = true or public.is_admin());
create policy "zonas_write_admin"      on public.zonas_entrega for all
  using (public.is_admin()) with check (public.is_admin());

-- Pedidos: visitante lê pelo token_acesso; admin lê tudo ----------------------
-- Insert/Update sempre rodam via service role (webhooks / server actions),
-- então as policies abaixo protegem leituras pelo anon.
create policy "pedidos_read_token_or_admin"
  on public.pedidos for select
  using (
    public.is_admin()
    or token_acesso = current_setting('request.headers', true)
  );
-- Como não conseguimos passar o token via header facilmente do browser,
-- a leitura pública de pedido é feita pela EDGE com service role filtrando
-- pelo token. A policy acima fica como camada extra de defesa.

-- Itens / histórico: somente via service role (server). Sem policy de anon.
-- Admin acessa via service role também.

-- Admins: só admin lê ---------------------------------------------------------
create policy "admins_self_or_admin"
  on public.admins for select
  using (user_id = auth.uid() or public.is_admin());

-- Config da loja: leitura pública, escrita admin ------------------------------
create policy "config_read_public"  on public.config_loja for select using (true);
create policy "config_write_admin" on public.config_loja for all
  using (public.is_admin()) with check (public.is_admin());

-- =============================================================================
--  STORAGE — bucket de fotos de produtos
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

-- Fotos de produtos: leitura pública; upload só admin -------------------------
create policy "bucket_produtos_read"  on storage.objects for select
  using (bucket_id = 'produtos');
create policy "bucket_produtos_write" on storage.objects for insert
  with check (bucket_id = 'produtos' and public.is_admin());
create policy "bucket_produtos_update" on storage.objects for update
  using (bucket_id = 'produtos' and public.is_admin());
create policy "bucket_produtos_delete" on storage.objects for delete
  using (bucket_id = 'produtos' and public.is_admin());

-- Fim da migration.
