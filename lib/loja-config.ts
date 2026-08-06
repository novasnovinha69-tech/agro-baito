// =============================================================================
//  CONFIGURAÇÃO DA LOJA  —  PONTO ÚNICO PARA TROCAR DE EMPRESA
// =============================================================================
//  👉 Para usar este site para OUTRA empresa, edite SÓ este arquivo.
//     - Nome, telefone, WhatsApp, endereço, cidade, região de atendimento
//     - As cores ficam em `app/globals.css` (variáveis --primary etc.)
// =============================================================================

export const LOJA = {
  nome: "Agro Mundo Animal",
  slogan: "Tudo para sua criação, seu pet e sua roça",
  // Telefone e WhatsApp no formato exibido e só dígitos (DDI+DDD+numero)
  telefone: "(47) 99989-5365",
  whatsappNumero: "5547999895365",
  email: "contato@agromundoanimal.com.br",
  // CIDADE-SEDE e região atendida (importante para o frete)
  cidade: "Itapema/SC",
  regiao: "Vale do Itajaí e Litoral Norte de SC",
  instagram: "https://www.instagram.com/agromundoanimaltabuleiro/",
  // Horário de atendimento (aparece no rodapé e nas notificações)
  horarioAtendimento: "Segunda a sábado, das 08h às 20h",
  // 🔗 Link de avaliação no Google — substitua pelo link real do Google Maps
  // da loja (ex: https://g.page/r/XXXXXXXXX/review ou o link do Google Meu Negócio).
  // Enquanto estiver null, o botão leva pra busca da loja no Google.
  linkAvaliacaoGoogle: "https://www.google.com/search?q=Agro+Mundo+Animal+Itapema",
  // Unidades físicas (cada uma pode ter suas próprias zonas de entrega no admin)
  unidades: [
    {
      nome: "Agro Mundo Animal — Tabuleiro (Matriz)",
      endereco: "Rua 600, nº 555, Sala 01 — Tabuleiro dos Oliveiras, Itapema/SC · CEP 88220-000",
    },
    {
      nome: "Agro Mundo Animal — Centro",
      endereco: "Centro, Itapema/SC",
    },
  ],
  // Segmentos que aparecem na home/hero (já inclui FERRAGENS, que a loja atende)
  segmentos: ["Rações", "Petiscos", "Medicamentos", "Pesca", "Ferramentas", "Ferragens", "Agro"],
} as const;

// Menu de navegação (as categorias com slug precisam existir no banco/mock)
export const LINKS_NAV = [
  { label: "Início", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Rações", href: "/categoria/racoes" },
  { label: "Medicamentos", href: "/categoria/medicamentos" },
  { label: "Pesca", href: "/categoria/pesca" },
  { label: "Ferramentas", href: "/categoria/ferramentas" },
  { label: "Ferragens", href: "/categoria/ferragens" },
  { label: "Agro", href: "/categoria/agro" },
] as const;

/** Monta o link wa.me com mensagem opcional. */
export function linkWhatsApp(mensagem?: string): string {
  const base = `https://wa.me/${LOJA.whatsappNumero}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}
