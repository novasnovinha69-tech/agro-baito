-- =============================================================================
--  ATUALIZAÇÃO DE PERMISSÕES — Adiciona role "master" ao sistema.
--  Rodar no SQL Editor do Supabase DEPOIS da migration 0001_init.sql.
--
--  Roles:
--    master  → você (super admin, acesso total, cria outros admins)
--    admin   → cliente da loja (produtos, fotos, pedidos — SEM configs/api)
--    gerente → igual admin (reservado p/ futuro)
-- =============================================================================

-- 1) Atualiza o tipo enum para incluir 'master' --------------------------------
do $$ begin
  alter type public.admin_role add value if not exists 'master';
exception when duplicate_object then null; end $$;

-- 2) Função: qual a role do usuário logado? ------------------------------------
create or replace function public.minha_role()
returns text language sql security definer stable as $$
  select a.role::text from public.admins a where a.user_id = auth.uid();
$$;

-- 3) Função: o usuário logado é MASTER? ---------------------------------------
create or replace function public.is_master()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid() and role = 'master'
  );
$$;

-- 4) Função: o usuário logado é admin OU master? (qualquer admin logado) ------
create or replace function public.is_admin_ou_master()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid() and role in ('admin', 'gerente', 'master')
  );
$$;

-- Substitui a antiga is_admin() para incluir todos os níveis ------------------
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select public.is_admin_ou_master();
$$;

-- 5) Políticas refinadas -------------------------------------------------------
-- Produtos: admin e master podem TUDO; cliente NÃO pode DELETAR (só master) ---
drop policy if exists "produtos_write_admin" on public.produtos;
create policy "produtos_write_admin" on public.produtos
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- DELETE de produto: SÓ master ------------------------------------------------
drop policy if exists "produtos_delete_master" on public.produtos;
create policy "produtos_delete_master" on public.produtos
  for delete to authenticated
  using (public.is_master());

-- Categorias: admin/master editam; DELETE só master ---------------------------
drop policy if exists "categorias_write_admin" on public.categorias;
create policy "categorias_write_admin" on public.categorias
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "categorias_delete_master" on public.categorias;
create policy "categorias_delete_master" on public.categorias
  for delete to authenticated
  using (public.is_master());

-- Zonas de entrega: admin pode VER, só master EDITA ---------------------------
drop policy if exists "zonas_write_admin" on public.zonas_entrega;
create policy "zonas_write_master" on public.zonas_entrega
  for all to authenticated
  using (true)                       -- todos admin podem ver (select)
  with check (public.is_master());   -- só master pode inserir/atualizar

-- Config da loja: só master ---------------------------------------------------
drop policy if exists "config_write_admin" on public.config_loja;
create policy "config_write_master" on public.config_loja
  for all to authenticated
  using (public.is_master())
  with check (public.is_master());

-- Unidades: admin vê, master edita --------------------------------------------
drop policy if exists "unidades_write_admin" on public.unidades;
create policy "unidades_write_master" on public.unidades
  for all to authenticated
  using (true)
  with check (public.is_master());

-- Storage: delete de foto só master -------------------------------------------
drop policy if exists "bucket_produtos_delete" on storage.objects;
create policy "bucket_produtos_delete" on storage.objects for delete
  using (bucket_id = 'produtos' and public.is_master());

-- Tabela admins: só master pode ver/criar/editar outros admins ---------------
drop policy if exists "admins_self_or_admin" on public.admins;
create policy "admins_read_master" on public.admins
  for select to authenticated
  using (public.is_master() or user_id = auth.uid());

create policy "admins_write_master" on public.admins
  for all to authenticated
  using (public.is_master())
  with check (public.is_master());

-- Fim.
