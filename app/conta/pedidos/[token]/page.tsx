import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, Truck, MapPin } from "lucide-react";
import { obterPedidoPorToken } from "@/lib/pedidos";
import { isSupabaseConfigured } from "@/lib/carrinho";
import { STATUS_INFO, STATUS_ORDEM } from "@/lib/status-pedido";
import { formatBRL } from "@/lib/money";
import type { StatusPedido } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: { token: string };
}) {
  return { title: `Pedido ${params.token.slice(0, 8)}` };
}

export default async function AcompanharPedidoPage({
  params,
}: {
  params: { token: string };
}) {
  // Modo demo: sem Supabase, mostra tela informativa
  if (!isSupabaseConfigured()) {
    return (
      <div className="container-agro py-12">
        <Card className="mx-auto max-w-lg">
          <CardContent className="p-8 text-center">
            <Package className="mx-auto mb-3 h-12 w-12 text-muted" />
            <h1 className="font-display text-xl font-bold">
              Acompanhamento de pedido
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Modo demonstração. O acompanhamento em tempo real funcionará quando
              o sistema estiver online.
            </p>
            <Button asChild className="mt-4">
              <Link href="/catalogo">Voltar ao catálogo</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pedido = await obterPedidoPorToken(params.token);
  if (!pedido) notFound();

  const info = STATUS_INFO[pedido.status];
  const statusAtualIdx = STATUS_ORDEM.indexOf(pedido.status as StatusPedido);

  const passos = [
    {
      icon: CheckCircle2,
      label: "Pedido criado",
      status: "pendente" as StatusPedido,
    },
    {
      icon: CheckCircle2,
      label: "Pagamento confirmado",
      status: "confirmado" as StatusPedido,
    },
    {
      icon: Package,
      label: "Em separação",
      status: "em_separacao" as StatusPedido,
    },
    {
      icon: Truck,
      label:
        pedido.tipo_entrega === "retirada"
          ? "Pronto para retirada"
          : "Saiu para entrega",
      status:
        pedido.tipo_entrega === "retirada"
          ? ("em_separacao" as StatusPedido)
          : ("saiu_para_entrega" as StatusPedido),
    },
    {
      icon: MapPin,
      label: pedido.tipo_entrega === "retirada" ? "Retirado" : "Entregue",
      status: "entregue" as StatusPedido,
    },
  ];

  return (
    <div className="container-agro py-8">
      <div className="mx-auto max-w-2xl">
        {/* Cabecalho */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-agro-navy">
              Pedido {pedido.codigo}
            </h1>
            <p className="text-sm text-muted-foreground">
              {new Date(pedido.created_at).toLocaleString("pt-BR")}
            </p>
          </div>
          <Badge variant={info.variant}>{info.label}</Badge>
        </div>

        {/* Timeline de status */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {passos.map((passo, idx) => {
                const passoIdx = STATUS_ORDEM.indexOf(passo.status);
                const concluido = statusAtualIdx >= passoIdx;
                const atual = pedido.status === passo.status;
                const Icon = passo.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                        concluido
                          ? "bg-agro-emerald text-white"
                          : "bg-muted text-muted-foreground"
                      } ${atual ? "ring-2 ring-agro-emerald ring-offset-2" : ""}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          concluido ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {passo.label}
                      </p>
                    </div>
                    {concluido && (
                      <CheckCircle2 className="h-4 w-4 text-agro-emerald" />
                    )}
                  </div>
                );
              })}
            </div>
            {pedido.status === "cancelado" && (
              <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
                Este pedido foi cancelado.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo */}
        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-base font-bold">Resumo</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatBRL(pedido.subtotal_cents)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span>
                {pedido.frete_cents === 0
                  ? "Grátis"
                  : formatBRL(pedido.frete_cents)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3 text-base font-bold">
              <span>Total</span>
              <span>{formatBRL(pedido.total_cents)}</span>
            </div>

            {pedido.pagamento_status === "pending" && (
              <div className="rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                Aguardando pagamento Pix...
              </div>
            )}
            {pedido.pagamento_status === "approved" && (
              <div className="rounded-lg bg-agro-emerald/10 p-3 text-sm text-agro-emerald-dark">
                Pagamento confirmado
              </div>
            )}

            <Button asChild variant="outline" className="w-full">
              <Link href="/catalogo">Continuar comprando</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
