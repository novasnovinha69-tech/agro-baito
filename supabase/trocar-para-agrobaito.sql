-- =============================================================================
--  TROCAR AGRO MUNDO -> AGRO BAITO no banco de dados
--  Cole no SQL Editor do Supabase e clique em Run.
--  Limpa dados antigos e cadastra lojas/categorias/zonas da Agro Baito.
-- =============================================================================

-- 1) Limpa dados antigos da Agro Mundo ---------------------------------------
delete from public.pedido_itens;
delete from public.status_historico;
delete from public.pedidos;
delete from public.zonas_entrega;
delete from public.produtos;
delete from public.unidades where slug in ('tabuleiro','centro');
delete from public.categorias where slug in ('racoes','petiscos','medicamentos','pesca','ferramentas','ferragens','agro');

-- 2) Categorias novas (foco PET) ---------------------------------------------
insert into public.categorias (nome, slug, icone, ordem) values
  ('Rações',          'racoes',         'Wheat',    1),
  ('Acessórios Pet',  'acessorios-pet', 'Bone',     2),
  ('Veterinária',     'veterinaria',    'Pill',     3),
  ('Higiene e Beleza','higiene',        'Sparkles', 4),
  ('Jardinagem',      'jardinagem',     'Sprout',   5),
  ('Agro e Campo',    'agro',           'Tractor',  6)
on conflict (slug) do nothing;

-- 3) 3 unidades da Agro Baito ------------------------------------------------
insert into public.unidades (nome, slug, endereco, whatsapp, ativa) values
  ('Agro Baito - Perequê (Matriz)', 'pereque',
   'Av. Gov. Celso Ramos, 1187 - Perequê, Porto Belo/SC - CEP 88210-000',
   '5547997174539', true),
  ('Agro Baito - Bombas (Bombinhas)', 'bombas',
   'Av. Leopoldo Zarling, 2072 - Bombas, Bombinhas/SC',
   '5547999963657', true),
  ('Agro Baito - Meia Praia (Itapema)', 'meia-praia',
   'Av. Nereu Ramos, 330, Sala 01 - Meia Praia, Itapema/SC',
   '5547997174539', true)
on conflict (slug) do nothing;

-- 4) Zonas de entrega (% frete) ----------------------------------------------
insert into public.zonas_entrega (unidade_id, nome, tipo, valor, frete_percentual, prazo_horas, ativa)
select id, 'Retirada na loja (Perequê)','retirada','retirada',0,1,true from public.unidades where slug='pereque'
union all select id, 'Perequê e Centro de Porto Belo','bairro','perequê',5,24,true from public.unidades where slug='pereque'
union all select id, 'Porto Belo (demais bairros)','cidade','porto belo',7,24,true from public.unidades where slug='pereque'
union all select id, 'Bombinhas (Bombas/Zimbros)','cidade','bombinhas',8,48,true from public.unidades where slug='pereque'
union all select id, 'Itapema','cidade','itapema',8,48,true from public.unidades where slug='pereque'
on conflict do nothing;

insert into public.zonas_entrega (unidade_id, nome, tipo, valor, frete_percentual, prazo_horas, ativa)
select id, 'Retirada na loja (Bombas)','retirada','retirada',0,1,true from public.unidades where slug='bombas'
union all select id, 'Bombas e Bombinhas centro','bairro','bombas',5,24,true from public.unidades where slug='bombas'
on conflict do nothing;

insert into public.zonas_entrega (unidade_id, nome, tipo, valor, frete_percentual, prazo_horas, ativa)
select id, 'Retirada na loja (Meia Praia)','retirada','retirada',0,1,true from public.unidades where slug='meia-praia'
union all select id, 'Meia Praia e Centro de Itapema','bairro','meia praia',5,24,true from public.unidades where slug='meia-praia'
on conflict do nothing;

-- 5) Produtos de exemplo (foco PET) ------------------------------------------
insert into public.produtos (categoria_id, nome, slug, descricao, preco_cents, preco_promocional_cents, preco_por_kg, peso_kg, unidade_medida, estoque, estoque_minimo, qtd_minima, multiplo, foto_url, destaque, ativo)
select c.id, p.nome, p.slug, p.descricao, p.preco_cents, p.preco_promocional_cents, p.preco_por_kg, p.peso_kg, p.unidade_medida, p.estoque, p.estoque_minimo, 1, 1, p.foto_url, p.destaque, true
from public.categorias c
join (
  values
    ('racoes','Racao Premier Pet Caes Adultos 15kg','racao-premier-caes-adultos-15kg','Alimento completo e balanceado para caes adultos. Sabor carne e cereais.',18990,16990,true,15,'cx',24,5,'https://placehold.co/600x600/F59E0B/FFFFFF?text=Racao+Caes+15kg&font=manrope',true),
    ('racoes','Racao Whiskas Gatos Sabor Peixe 7,5kg','racao-whiskas-gatos-peixe-7-5kg','Nutricao completa para gatos adultos.',12490,null,true,7.5,'cx',12,4,'https://placehold.co/600x600/1A9D63/FFFFFF?text=Racao+Gatos+7,5kg&font=manrope',true),
    ('racoes','Racao Golden Filhotes 3kg','racao-golden-filhotes-3kg','Nutricao premium para filhotes de caes.',8990,null,true,3,'cx',18,4,'https://placehold.co/600x600/14563B/FFFFFF?text=Racao+Filhotes&font=manrope',false),
    ('acessorios-pet','Coleira Anti-Pulgas Caes ate 10kg','coleira-anti-pulgas-caes-10kg','Protecao por 8 meses contra pulgas e carrapatos.',11990,null,false,null,'un',15,4,'https://placehold.co/600x600/F59E0B/FFFFFF?text=Coleira&font=manrope',true),
    ('acessorios-pet','Cama Pet Medio 60cm','cama-pet-medio-60cm','Caminha macia e lavavel.',7990,6990,false,1.2,'un',10,3,'https://placehold.co/600x600/1A9D63/FFFFFF?text=Cama+Pet&font=manrope',false),
    ('veterinaria','Vermifugo Drontal Plus Caes 4cp','vermifugo-drontal-plus-caes-4cp','Anti-helmintico de amplo espectro.',4290,null,false,null,'cx',18,5,'https://placehold.co/600x600/DC2626/FFFFFF?text=Vermifugo&font=manrope',true),
    ('veterinaria','Antipulgas Frontline Caes ate 10kg','antipulgas-frontline-caes-10kg','Antipulgas e carrapaticida topico.',5990,5490,false,null,'un',8,5,'https://placehold.co/600x600/0EA5E9/FFFFFF?text=Antipulgas&font=manrope',false),
    ('higiene','Shampoo Sanol Dog Caes 500ml','shampoo-sanol-dog-500ml','Shampoo para peludos.',2490,null,false,0.5,'un',25,6,'https://placehold.co/600x600/F59E0B/FFFFFF?text=Shampoo&font=manrope',true),
    ('higiene','Areia Higienica para Gatos 4kg','areia-higienica-gatos-4kg','Areia sanitaria absorvente.',1890,null,true,4,'pct',40,10,'https://placehold.co/600x600/64748B/FFFFFF?text=Areia+Gato&font=manrope',false),
    ('jardinagem','Vaso de Ceramica Decorativo 30cm','vaso-ceramica-30cm','Vaso decorativo para plantas.',3490,null,false,1.5,'un',14,4,'https://placehold.co/600x600/1A9D63/FFFFFF?text=Vaso&font=manrope',true),
    ('jardinagem','Substrato Universal 25L','substrato-universal-25l','Terra adubada para plantas.',2990,null,false,8,'pct',30,8,'https://placehold.co/600x600/14563B/FFFFFF?text=Substrato&font=manrope',false),
    ('agro','Sal Mineral Bovinos 25kg','sal-mineral-bovinos-25kg','Sal mineralizado para bovinos.',7990,7490,true,25,'cx',22,6,'https://placehold.co/600x600/795548/FFFFFF?text=Sal+Mineral&font=manrope',false)
) as p(cat, nome, slug, descricao, preco_cents, preco_promocional_cents, preco_por_kg, peso_kg, unidade_medida, estoque, estoque_minimo, foto_url, destaque)
on c.slug = p.cat
on conflict (slug) do nothing;
