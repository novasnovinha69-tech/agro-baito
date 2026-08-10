// =============================================================================
//  CONFIGURAÇÃO DA LOJA  —  PONTO ÚNICO PARA TROCAR DE EMPRESA
// =============================================================================
//  Para usar este site para OUTRA empresa, edite SÓ este arquivo.
//
//  ⚠️  MODO DEMONSTRAÇÃO: os dados abaixo são PLACEHOLDERS genéricos.
//      Para colocar no ar para um cliente real, substitua pelos dados dele.
// =============================================================================

export const LOJA = {
  nome: "Sua Empresa",
  slogan: "Seu slogan aqui!",
  telefone: "(00) 00000-0000",
  whatsappNumero: "5500000000000", // 55 + DDD + numero (so digitos)
  email: "contato@suaempresa.com.br",
  cidade: "Sua Cidade/UF",
  regiao: "Sua região de atendimento",
  instagram: "https://www.instagram.com/sua_empresa/",
  horarioAtendimento: "Seg a sex 08:00–18:00 · Sábado 08:00–12:00",
  linkAvaliacaoGoogle: "#", // cole o link do Google Maps da empresa
  // Texto do hero (primeira seção da home) — personalizavel
  heroTitulo: "Sua loja online profissional",
  heroDestaque: "pronta para vender!",
  heroTexto:
    "Este é um site de demonstração. Todos os dados (nome, telefone, endereço, produtos) são exemplos. Ao contratar, personalizamos tudo com as informações reais do seu negócio.",
  heroBadge1: "⭐ SEU DIFERENCIAL AQUI",
  heroBadge2: "🚚 Entregas na sua região",
  // Botão do hero
  heroTextoBotao: "Olá! Vim pelo site e gostaria de atendimento.",
  unidades: [
    {
      nome: "Loja 1 — Matriz",
      endereco: "Seu endereço aqui — Sua Cidade/UF · CEP 00000-000",
      whatsapp: "5500000000000",
      telefone: "(00) 00000-0000",
    },
    {
      nome: "Loja 2 — Filial",
      endereco: "Seu endereço aqui — Sua Cidade/UF",
      whatsapp: "5500000000000",
      telefone: "(00) 00000-0000",
    },
    {
      nome: "Loja 3 — Filial",
      endereco: "Seu endereço aqui — Sua Cidade/UF",
      whatsapp: "5500000000000",
      telefone: "(00) 00000-0000",
    },
  ],
  segmentos: [
    "Categoria 1",
    "Categoria 2",
    "Categoria 3",
    "Categoria 4",
    "Categoria 5",
  ],
} as const;

/**
 * Indica se o site esta em modo demonstracao (dados placeholder).
 * Quando o cliente preencher os dados reais no loja-config.ts,
 * basta trocar para `false` e o banner de demonstracao some.
 */
export const MODO_DEMONSTRACAO = true;

export const LINKS_NAV = [
  { label: "Início", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
] as const;

/** Monta o link wa.me com mensagem opcional. */
export function linkWhatsApp(mensagem?: string): string {
  const base = `https://wa.me/${LOJA.whatsappNumero}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}
