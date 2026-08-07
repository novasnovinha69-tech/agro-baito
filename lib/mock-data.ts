// =============================================================================
//  DADOS MOCKADOS — AgroBaito. Usados quando Supabase não configurado.
//  Categorias com foco PET (slogan: "Somos loucos por PET!").
// =============================================================================

import type {
  Categoria,
  Produto,
  Unidade,
  ZonaEntrega,
} from "@/types/database.types";

const img = (seed: string, cor = "1A9D63") =>
  `https://placehold.co/600x600/${cor}/F1F8F4?text=${encodeURIComponent(seed)}&font=manrope`;

export const mockCategorias: Categoria[] = [
  { id: "cat-racoes", nome: "Rações", slug: "racoes", icone: "Wheat", ordem: 1, created_at: new Date().toISOString() },
  { id: "cat-acessorios", nome: "Acessórios Pet", slug: "acessorios-pet", icone: "Bone", ordem: 2, created_at: new Date().toISOString() },
  { id: "cat-veterinaria", nome: "Veterinária", slug: "veterinaria", icone: "Pill", ordem: 3, created_at: new Date().toISOString() },
  { id: "cat-higiene", nome: "Higiene e Beleza", slug: "higiene", icone: "Sparkles", ordem: 4, created_at: new Date().toISOString() },
  { id: "cat-jardinagem", nome: "Jardinagem", slug: "jardinagem", icone: "Sprout", ordem: 5, created_at: new Date().toISOString() },
  { id: "cat-agro", nome: "Agro & Campo", slug: "agro", icone: "Tractor", ordem: 6, created_at: new Date().toISOString() },
];

export const mockProdutos: Produto[] = [
  // RAÇÕES
  { id: "p-racao-caes-15", categoria_id: "cat-racoes", nome: "Ração Premier Pet Cães Adultos 15kg", slug: "racao-premier-caes-adultos-15kg", descricao: "Alimento completo e balanceado para cães adultos. Sabor carne e cereais.", preco_cents: 18990, preco_promocional_cents: 16990, preco_por_kg: true, peso_kg: 15, unidade_medida: "cx", estoque: 24, estoque_minimo: 5, qtd_minima: 1, multiplo: 1, foto_url: img("Ração Cães 15kg", "F59E0B"), destaque: true, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p-racao-gatos-7", categoria_id: "cat-racoes", nome: "Ração Whiskas Gatos Sabor Peixe 7,5kg", slug: "racao-whiskas-gatos-peixe-7-5kg", descricao: "Nutrição completa para gatos adultos. Rica em peixes.", preco_cents: 12490, preco_promocional_cents: null, preco_por_kg: true, peso_kg: 7.5, unidade_medida: "cx", estoque: 12, estoque_minimo: 4, qtd_minima: 1, multiplo: 1, foto_url: img("Ração Gatos 7,5kg", "1A9D63"), destaque: true, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p-racao-filhotes", categoria_id: "cat-racoes", nome: "Ração Golden Filhotes 3kg", slug: "racao-golden-filhotes-3kg", descricao: "Nutrição premium para filhotes de cães até 12 meses.", preco_cents: 8990, preco_promocional_cents: null, preco_por_kg: true, peso_kg: 3, unidade_medida: "cx", estoque: 18, estoque_minimo: 4, qtd_minima: 1, multiplo: 1, foto_url: img("Ração Filhotes 3kg", "14563B"), destaque: false, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // ACESSÓRIOS PET
  { id: "p-coleira", categoria_id: "cat-acessorios", nome: "Coleira Anti-Pulgas Cães até 10kg", slug: "coleira-anti-pulgas-caes-10kg", descricao: "Proteção por 8 meses contra pulgas e carrapatos.", preco_cents: 11990, preco_promocional_cents: null, preco_por_kg: false, peso_kg: null, unidade_medida: "un", estoque: 15, estoque_minimo: 4, qtd_minima: 1, multiplo: 1, foto_url: img("Coleira Antipulgas", "F59E0B"), destaque: true, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p-cama-pet", categoria_id: "cat-acessorios", nome: "Cama Pet Médio 60cm", slug: "cama-pet-medio-60cm", descricao: "Caminha macia e lavável. Conforto para seu pet descansar.", preco_cents: 7990, preco_promocional_cents: 6990, preco_por_kg: false, peso_kg: 1.2, unidade_medida: "un", estoque: 10, estoque_minimo: 3, qtd_minima: 1, multiplo: 1, foto_url: img("Cama Pet 60cm", "1A9D63"), destaque: false, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // VETERINÁRIA
  { id: "p-vermifugo", categoria_id: "cat-veterinaria", nome: "Vermífugo Drontal Plus Cães 4cp", slug: "vermifugo-drontal-plus-caes-4cp", descricao: "Anti-helmíntico de amplo espectro. Dose única.", preco_cents: 4290, preco_promocional_cents: null, preco_por_kg: false, peso_kg: null, unidade_medida: "cx", estoque: 18, estoque_minimo: 5, qtd_minima: 1, multiplo: 1, foto_url: img("Vermífugo", "DC2626"), destaque: true, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p-antipulgas", categoria_id: "cat-veterinaria", nome: "Antipulgas Frontline Cães até 10kg", slug: "antipulgas-frontline-caes-10kg", descricao: "Antipulgas e carrapaticida tópico. 30 dias de proteção.", preco_cents: 5990, preco_promocional_cents: 5490, preco_por_kg: false, peso_kg: null, unidade_medida: "un", estoque: 8, estoque_minimo: 5, qtd_minima: 1, multiplo: 1, foto_url: img("Antipulgas", "0EA5E9"), destaque: false, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // HIGIENE
  { id: "p-shampoo", categoria_id: "cat-higiene", nome: "Shampoo Sanol Dog Cães 500ml", slug: "shampoo-sanol-dog-500ml", descricao: "Shampoo sanitário para peludos. Limpa, perfuma e hidrata.", preco_cents: 2490, preco_promocional_cents: null, preco_por_kg: false, peso_kg: 0.5, unidade_medida: "un", estoque: 25, estoque_minimo: 6, qtd_minima: 1, multiplo: 1, foto_url: img("Shampoo 500ml", "F59E0B"), destaque: true, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p-areia-gato", categoria_id: "cat-higiene", nome: "Areia Higiênica para Gatos 4kg", slug: "areia-higienica-gatos-4kg", descricao: "Areia sanitária absorvente. Controla odores por mais tempo.", preco_cents: 1890, preco_promocional_cents: null, preco_por_kg: true, peso_kg: 4, unidade_medida: "pct", estoque: 40, estoque_minimo: 10, qtd_minima: 1, multiplo: 1, foto_url: img("Areia Gato 4kg", "64748B"), destaque: false, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // JARDINAGEM
  { id: "p-vaso", categoria_id: "cat-jardinagem", nome: "Vaso de Cerâmica Decorativo 30cm", slug: "vaso-ceramica-30cm", descricao: "Vaso decorativo para plantas. Design elegante.", preco_cents: 3490, preco_promocional_cents: null, preco_por_kg: false, peso_kg: 1.5, unidade_medida: "un", estoque: 14, estoque_minimo: 4, qtd_minima: 1, multiplo: 1, foto_url: img("Vaso 30cm", "1A9D63"), destaque: true, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p-substrato", categoria_id: "cat-jardinagem", nome: "Substrato Universal 25L", slug: "substrato-universal-25l", descricao: "Terra adubada pronta para plantas ornamentais e hortas.", preco_cents: 2990, preco_promocional_cents: null, preco_por_kg: false, peso_kg: 8, unidade_medida: "pct", estoque: 30, estoque_minimo: 8, qtd_minima: 1, multiplo: 1, foto_url: img("Substrato 25L", "14563B"), destaque: false, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // AGRO
  { id: "p-sal-mineral", categoria_id: "cat-agro", nome: "Sal Mineral Bovinos 25kg", slug: "sal-mineral-bovinos-25kg", descricao: "Sal mineralizado para bovinos de corte e leite.", preco_cents: 7990, preco_promocional_cents: 7490, preco_por_kg: true, peso_kg: 25, unidade_medida: "cx", estoque: 22, estoque_minimo: 6, qtd_minima: 1, multiplo: 1, foto_url: img("Sal Mineral 25kg", "795548"), destaque: false, ativo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const mockUnidades: (Unidade & { zonas: ZonaEntrega[] })[] = [
  {
    id: "uni-pereque", nome: "Agro Baito — Perequê (Matriz)", slug: "pereque",
    endereco: "Av. Gov. Celso Ramos, 1187 — Perequê, Porto Belo/SC · CEP 88210-000",
    whatsapp: "5547997174539", ativa: true, created_at: new Date().toISOString(),
    zonas: [
      { id: "z1", unidade_id: "uni-pereque", nome: "Retirada na loja (Perequê)", tipo: "retirada", valor: "retirada", frete_percentual: 0, prazo_horas: 1, ativa: true, created_at: new Date().toISOString() },
      { id: "z2", unidade_id: "uni-pereque", nome: "Perequê e Centro de Porto Belo", tipo: "bairro", valor: "perequê", frete_percentual: 5, prazo_horas: 24, ativa: true, created_at: new Date().toISOString() },
      { id: "z3", unidade_id: "uni-pereque", nome: "Porto Belo (demais bairros)", tipo: "cidade", valor: "porto belo", frete_percentual: 7, prazo_horas: 24, ativa: true, created_at: new Date().toISOString() },
      { id: "z4", unidade_id: "uni-pereque", nome: "Bombinhas (Bombas/Zimbros)", tipo: "cidade", valor: "bombinhas", frete_percentual: 8, prazo_horas: 48, ativa: true, created_at: new Date().toISOString() },
      { id: "z5", unidade_id: "uni-pereque", nome: "Itapema", tipo: "cidade", valor: "itapema", frete_percentual: 8, prazo_horas: 48, ativa: true, created_at: new Date().toISOString() },
    ],
  },
  {
    id: "uni-bombas", nome: "Agro Baito — Bombas (Bombinhas)", slug: "bombas",
    endereco: "Av. Leopoldo Zarling, 2072 — Bombas, Bombinhas/SC",
    whatsapp: "5547999963657", ativa: true, created_at: new Date().toISOString(),
    zonas: [
      { id: "z6", unidade_id: "uni-bombas", nome: "Retirada na loja (Bombas)", tipo: "retirada", valor: "retirada", frete_percentual: 0, prazo_horas: 1, ativa: true, created_at: new Date().toISOString() },
      { id: "z7", unidade_id: "uni-bombas", nome: "Bombas e Bombinhas centro", tipo: "bairro", valor: "bombas", frete_percentual: 5, prazo_horas: 24, ativa: true, created_at: new Date().toISOString() },
    ],
  },
  {
    id: "uni-meia-praia", nome: "Agro Baito — Meia Praia (Itapema)", slug: "meia-praia",
    endereco: "Av. Nereu Ramos, 330, Sala 01 — Meia Praia, Itapema/SC",
    whatsapp: "5547997174539", ativa: true, created_at: new Date().toISOString(),
    zonas: [
      { id: "z8", unidade_id: "uni-meia-praia", nome: "Retirada na loja (Meia Praia)", tipo: "retirada", valor: "retirada", frete_percentual: 0, prazo_horas: 1, ativa: true, created_at: new Date().toISOString() },
      { id: "z9", unidade_id: "uni-meia-praia", nome: "Meia Praia e Centro de Itapema", tipo: "bairro", valor: "meia praia", frete_percentual: 5, prazo_horas: 24, ativa: true, created_at: new Date().toISOString() },
    ],
  },
];
