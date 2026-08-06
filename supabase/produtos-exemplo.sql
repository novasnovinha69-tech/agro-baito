-- =============================================================================
--  PRODUTOS DE EXEMPLO para demonstração
--  Cole no SQL Editor do Supabase e clique em Run.
--  Cadastra 12 produtos com fotos (placeholders coloridos da marca).
--  Preços fictícios mas realistas.
-- =============================================================================

insert into public.produtos (categoria_id, nome, slug, descricao, preco_cents, preco_promocional_cents, preco_por_kg, peso_kg, unidade_medida, estoque, estoque_minimo, qtd_minima, multiplo, foto_url, destaque, ativo)
select c.id, p.nome, p.slug, p.descricao, p.preco_cents, p.preco_promocional_cents, p.preco_por_kg, p.peso_kg, p.unidade_medida, p.estoque, p.estoque_minimo, 1, 1, p.foto_url, p.destaque, true
from public.categorias c
join (
  values
    -- RAÇÕES
    ('racoes', 'Racao Premier Pet Caes Adultos 15kg', 'racao-premier-pet-caes-adultos-15kg', 'Alimento completo e balanceado para caes adultos de porte medio. Sabor carne e cereais.', 18990, 16990, true, 15, 'cx', 24, 5, 'https://placehold.co/600x600/0F3D91/F7F9FC?text=Racao+Caes+15kg&font=manrope', true),
    ('racoes', 'Racao Whiskas Gatos Sabor Peixe 7,5kg', 'racao-whiskas-gatos-peixe-7-5kg', 'Nutricao completa para gatos adultos. Rica em peixes selecionados.', 12490, null, true, 7.5, 'cx', 12, 4, 'https://placehold.co/600x600/1E40AF/F7F9FC?text=Racao+Gatos+7,5kg&font=manrope', true),
    ('racoes', 'Racao Polet Inicial Frangos 25kg', 'racao-polet-inicial-frangos-25kg', 'Para frangos de corte na fase inicial (1 a 21 dias). Alta proteina.', 8990, null, true, 25, 'cx', 40, 8, 'https://placehold.co/600x600/25A06B/FFFFFF?text=Racao+Frangos+25kg&font=manrope', true),
    ('racoes', 'Sal Mineral Boi Forte 25kg', 'sal-mineral-boi-forte-25kg', 'Sal mineralizado para bovinos de corte e leite.', 7990, 7490, true, 25, 'cx', 60, 10, 'https://placehold.co/600x600/795548/FFFFFF?text=Sal+Mineral+25kg&font=manrope', false),

    -- PETISCOS
    ('petiscos', 'Bifinho Snack Caes 500g', 'bifinho-snack-caes-500g', 'Petisco macio e saboroso. Ideal como recompensa no adestramento.', 1890, null, false, 0.5, 'pct', 30, 6, 'https://placehold.co/600x600/F59E0B/FFFFFF?text=Bifinho+500g&font=manrope', true),

    -- MEDICAMENTOS
    ('medicamentos', 'Vermifugo Drontal Plus Caes 4cp', 'vermifugo-drontal-plus-caes-4cp', 'Anti-helmintico de amplo espectro para caes. Dose unica.', 4290, null, false, null, 'cx', 18, 5, 'https://placehold.co/600x600/DC2626/FFFFFF?text=Vermifugo&font=manrope', true),
    ('medicamentos', 'Antipulgas Frontline Caes ate 10kg', 'antipulgas-frontline-caes-10kg', 'Antipulgas e carrapaticida topico. Protecao por 30 dias.', 5990, 5490, false, null, 'un', 8, 5, 'https://placehold.co/600x600/0EA5E9/FFFFFF?text=Antipulgas&font=manrope', true),

    -- PESCA
    ('pesca', 'Vara de Pesca Telescopica 3,60m', 'vara-pesca-telescopica-3-60m', 'Vara de fibra de vidro, leve e resistente. Para pesca esportiva.', 6490, null, false, null, 'un', 15, 4, 'https://placehold.co/600x600/0369A1/FFFFFF?text=Vara+Pesca&font=manrope', true),
    ('pesca', 'Kit Anzois Variados 50 pecas', 'kit-anzois-variados-50pecas', 'Sortimento de anzois de aco em organizador.', 2490, null, false, null, 'cx', 25, 5, 'https://placehold.co/600x600/0F3D91/F7F9FC?text=Kit+Anzois&font=manrope', false),

    -- FERRAMENTAS
    ('ferramentas', 'Enxada Aco Corte 6 polegadas', 'enxada-aco-corte-6-polegadas', 'Lamina de aco temperado, cabo de madeira reflorestada.', 4990, null, false, 1.8, 'un', 20, 5, 'https://placehold.co/600x600/7C2D12/FFFFFF?text=Enxada&font=manrope', true),
    ('ferramentas', 'Tesoura de Poda Bypass Manual', 'tesoura-poda-bypass-manual', 'Lamina de aco teflon, cabo ergonomico. Galhos ate 2cm.', 3490, 2990, false, 0.3, 'un', 14, 4, 'https://placehold.co/600x600/166534/FFFFFF?text=Tesoura+Poda&font=manrope', false),

    -- FERRAGENS
    ('ferragens', 'Prego 17/21 Aco Galvanizado 1kg', 'prego-17-21-galvanizado-1kg', 'Prego galvanizado a fogo, 2,4mm x 54mm. Vendido por quilo.', 1890, null, true, 1, 'kg', 80, 15, 'https://placehold.co/600x600/475569/FFFFFF?text=Prego+1kg&font=manrope', true),
    ('ferragens', 'Arame Farpado 500m Rolo', 'arame-farpado-500m-rolo', 'Arme farpado galvanizado para cercas. Rolo com 500 metros.', 12990, 11990, false, 22, 'un', 12, 3, 'https://placehold.co/600x600/334155/FFFFFF?text=Arme+Farpado&font=manrope', false)
) as p(cat, nome, slug, descricao, preco_cents, preco_promocional_cents, preco_por_kg, peso_kg, unidade_medida, estoque, estoque_minimo, foto_url, destaque)
on c.slug = p.cat
on conflict (slug) do nothing;
