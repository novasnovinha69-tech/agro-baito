// =============================================================================
//  Cálculo de FRETE por zona — % sobre o subtotal dos produtos.
//  A regra: cada zona tem um frete_percentual. O frete = subtotal * % / 100.
//  Zona de "retirada" tem % = 0 (cliente busca na loja).
//  BÔNUS: acima de FRETE_GRATIS_MIN_CENTS → frete GRÁTIS em qualquer zona.
// =============================================================================

import type { ZonaEntrega } from "@/types/database.types";

/** Acima deste valor (em centavos), o frete é grátis. R$1.000,00 = 100000 cents. */
export const FRETE_GRATIS_MIN_CENTS = 100000; // R$ 1.000,00

export type ResultadoFrete = {
  zona: ZonaEntrega | undefined;
  freteCents: number;
  prazoHoras: number;
  atendido: boolean;
  mensagem?: string;
};

/**
 * Calcula o frete dado um subtotal e o id da zona escolhida.
 * Se a zona não existir ou estiver inativa → não atendido.
 */
export function calcularFretePorZona(
  subtotalCents: number,
  zonaId: string | null,
  zonasDisponiveis: ZonaEntrega[],
): ResultadoFrete {
  if (!zonaId) {
    return {
      zona: undefined,
      freteCents: 0,
      prazoHoras: 0,
      atendido: false,
      mensagem: "Selecione uma opção de entrega.",
    };
  }
  const zona = zonasDisponiveis.find((z) => z.id === zonaId);
  if (!zona || !zona.ativa) {
    return {
      zona: undefined,
      freteCents: 0,
      prazoHoras: 0,
      atendido: false,
      mensagem: "Não atendemos para entrega nesta região. Retirada disponível.",
    };
  }
  const frete = Math.round(
    (subtotalCents * Number(zona.frete_percentual)) / 100,
  );
  return {
    zona,
    freteCents: frete,
    prazoHoras: zona.prazo_horas,
    atendido: true,
  };
}

/**
 * Texto explicativo amigável do tipo da zona.
 */
export function descricaoTipoZona(zona: ZonaEntrega): string {
  switch (zona.tipo) {
    case "retirada":
      return "Retirada na loja";
    case "bairro":
      return `Entrega no bairro`;
    case "cidade":
      return "Entrega na cidade";
    default:
      return "Entrega";
  }
}
