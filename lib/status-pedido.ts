import type { BadgeProps } from "@/components/ui/badge";
import type { StatusPedido } from "@/types/database.types";

type Variant = NonNullable<BadgeProps["variant"]>;

/** Informações de exibição para cada status de pedido. */
export const STATUS_INFO: Record<
  StatusPedido,
  { label: string; variant: Variant; cor: string }
> = {
  pendente: { label: "Pendente", variant: "warn", cor: "bg-orange-100" },
  aguardando_pagamento: {
    label: "Aguardando Pagamento",
    variant: "warn",
    cor: "bg-orange-100",
  },
  confirmado: {
    label: "Confirmado",
    variant: "default",
    cor: "bg-agro-blue",
  },
  em_separacao: {
    label: "Em Separação",
    variant: "default",
    cor: "bg-agro-blue",
  },
  saiu_para_entrega: {
    label: "Saiu p/ Entrega",
    variant: "promo",
    cor: "bg-agro-emerald",
  },
  entregue: {
    label: "Entregue",
    variant: "success",
    cor: "bg-agro-emerald",
  },
  cancelado: {
    label: "Cancelado",
    variant: "destructive",
    cor: "bg-destructive",
  },
};

/** Lista ordenada dos status (para selects e timelines). */
export const STATUS_ORDEM: StatusPedido[] = [
  "pendente",
  "aguardando_pagamento",
  "confirmado",
  "em_separacao",
  "saiu_para_entrega",
  "entregue",
  "cancelado",
];
