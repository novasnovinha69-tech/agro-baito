-- =============================================================================
--  SEED — dados iniciais para a Agro Mundo Animal.
--  Rode no SQL Editor do Supabase APÓS a migration 0001_init.sql.
--  Em modo demo (sem Supabase), os mocks em lib/mock-data.ts substituem isto.
-- =============================================================================

-- Categorias ------------------------------------------------------------------
insert into public.categorias (id, nome, slug, icone, ordem) values
  ('cat-racoes',        'Rações',                  'racoes',        'Wheat',   1),
  ('cat-petiscos',      'Petiscos',                'petiscos',      'Bone',    2),
  ('cat-medicamentos',  'Medicamentos Veterinários','medicamentos', 'Pill',    3),
  ('cat-pesca',         'Pesca',                   'pesca',         'Fish',    4),
  ('cat-ferramentas',   'Ferramentas',             'ferramentas',   'Hammer',  5),
  ('cat-ferragens',     'Ferragens',               'ferragens',     'Wrench',  6),
  ('cat-agro',          'Agro & Insumos',          'agro',          'Sprout',  7)
on conflict (slug) do nothing;

-- Unidades --------------------------------------------------------------------
insert into public.unidades (id, nome, slug, endereco, whatsapp, ativa) values
  ('uni-tabuleiro', 'Agro Mundo Animal — Tabuleiro (Matriz)', 'tabuleiro',
   'Rua 600, nº 555, Sala 01 — Tabuleiro dos Oliveiras, Itapema/SC · CEP 88220-000',
   '5547999895365', true),
  ('uni-centro', 'Agro Mundo Animal — Centro', 'centro',
   'Centro, Itapema/SC', '5547999895365', true)
on conflict (slug) do nothing;

-- Zonas de entrega (% frete por região do Vale do Itajaí) ---------------------
-- Frete = % sobre o subtotal dos produtos. Acima de R$1.000 = GRÁTIS.
insert into public.zonas_entrega (id, unidade_id, nome, tipo, valor, frete_percentual, prazo_horas, ativa) values
  ('z-tab-retirada',   'uni-tabuleiro', 'Retirada na loja (Tabuleiro)',            'retirada', 'retirada',                  0,  1, true),
  ('z-tab-bairro',     'uni-tabuleiro', 'Tabuleiro dos Oliveiras e bairros próximos','bairro',   'tabuleiro dos oliveiras',   3,  24, true),
  ('z-tab-itapema',    'uni-tabuleiro', 'Itapema (demais bairros)',                'cidade',   'itapema',                   3,  24, true),
  ('z-tab-balneario',  'uni-tabuleiro', 'Balneário Camboriú / Camboriú',           'cidade',   'balneário camboriú',        5,  48, true),
  ('z-tab-porto',      'uni-tabuleiro', 'Porto Belo / Itajaí / Navegantes',        'cidade',   'itajaí',                    5,  48, true),
  ('z-tab-blumenau',   'uni-tabuleiro', 'Blumenau / Brusque (Vale do Itajaí)',     'cidade',   'blumenau',                  10, 72, true),
  ('z-cent-retirada',  'uni-centro',    'Retirada na loja (Centro)',               'retirada', 'retirada',                  0,  1, true),
  ('z-cent-centro',    'uni-centro',    'Centro de Itapema',                        'bairro',   'centro',                    3,  24, true)
on conflict (id) do nothing;

-- =============================================================================
--  ADMIN INICIAL
--  Para criar o primeiro admin:
--   1. Cadastre um usuário em Authentication → Users → "Add user" no Supabase
--   2. Copie o UID gerado
--   3. Substitua <USER_UID> abaixo e rode este trecho
-- =============================================================================
-- insert into public.admins (user_id, nome, email, role) values
--   ('<USER_UID>', 'Administrador', 'admin@agromundoanimal.com.br', 'admin')
-- on conflict (user_id) do nothing;
