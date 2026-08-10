// =============================================================================
//  CONFIGURAÇÃO DA LOJA  —  PONTO ÚNICO PARA TROCAR DE EMPRESA
// =============================================================================
//  Para usar este site para OUTRA empresa, edite SÓ este arquivo.
// =============================================================================

export const LOJA = {
  nome: "Agro Baito",
  slogan: "Somos loucos por PET! 🐾",
  telefone: "(47) 99717-4539",
  whatsappNumero: "5547997174539",
  email: "agrobaito@hotmail.com",
  cidade: "Porto Belo/SC",
  regiao: "Litoral Norte de SC (Porto Belo, Bombinhas e Itapema)",
  instagram: "https://www.instagram.com/insta_baito/",
  horarioAtendimento: "Seg a sex 08:15–18:45 · Sábado 08:15–18:00",
  linkAvaliacaoGoogle: "https://www.google.com/search?q=Agro+Baito+Porto+Belo",
  unidades: [
    {
      nome: "Loja Perequê — Porto Belo",
      endereco:
        "Av. Gov. Celso Ramos, 1187 — Perequê, Porto Belo/SC · CEP 88210-000",
    },
    {
      nome: "Loja Bombas — Bombinhas",
      endereco: "Av. Leopoldo Zarling, 2072 — Bombas, Bombinhas/SC",
    },
    {
      nome: "Loja Meia Praia — Itapema",
      endereco: "Av. Nereu Ramos, 330, Sala 01 — Meia Praia, Itapema/SC",
    },
  ],
  segmentos: [
    "Rações",
    "Acessórios Pet",
    "Veterinária",
    "Higiene",
    "Jardinagem",
    "Agro",
  ],
} as const;

export const LINKS_NAV = [
  { label: "Início", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Rações", href: "/categoria/racoes" },
  { label: "Acessórios", href: "/categoria/acessorios-pet" },
  { label: "Veterinária", href: "/categoria/veterinaria" },
  { label: "Higiene", href: "/categoria/higiene" },
  { label: "Jardinagem", href: "/categoria/jardinagem" },
  { label: "Agro", href: "/categoria/agro" },
] as const;

/** Monta o link wa.me com mensagem opcional. */
export function linkWhatsApp(mensagem?: string): string {
  const base = `https://wa.me/${LOJA.whatsappNumero}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}
