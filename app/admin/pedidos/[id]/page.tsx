import {
  ArrowLeft,
  CreditCard,
  MapPin,
  MessageCircle,
  Package,
  User,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NotificarCliente } from "@/components/admin/notificar-cliente";
import { StatusControle } from "@/components/admin/status-controle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { adminObterPedidoPorId } from "@/lib/admin-data";
import { formatBRL } from "@/lib/money";

export default async function AdminPedidoDetalhePage({
  params,
}: {
  params: { id: string };
}) {
  const pedido = await adminObterPedidoPorId(params.id);
  if (!pedido) notFound();

  const endereco = (pedido.endereco ?? null) as {
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    cep?: string;
    complemento?: string;
    referencia?: string;
  } | null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/pedidos">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-xl font-bold text-agro-navy">
            Pedido {pedido.codigo}
          </h1>
          <p className="text-xs text-muted-foreground">
            {new Date(pedido.created_at).toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Coluna principal */}
        <div className="space-y-5">
          {/* Itens — obs: em demo não temos itens separados, mostramos resumo */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4" /> Itens do pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatBRL(pedido.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span>{formatBRL(pedido.frete_cents)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg text-agro-navy">
                  {formatBRL(pedido.total_cents)}
                </span>
              </div>
              {pedido.pagamento_status && (
                <p className="pt-1 text-xs text-muted-foreground">
                  Pagamento: {pedido.pagamento_status}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Dados do cliente */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" /> Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{pedido.cliente_nome}</p>
              <p className="text-muted-foreground">{pedido.cliente_telefone}</p>
              {pedido.cliente_email && (
                <p className="text-muted-foreground">{pedido.cliente_email}</p>
              )}
              {pedido.cliente_cpf_cnpj && (
                <p className="text-muted-foreground">
                  CPF/CNPJ: {pedido.cliente_cpf_cnpj}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Endereço */}
          {endereco && pedido.tipo_entrega === "entrega" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" /> Endereço de entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>
                  {endereco.logradouro}, {endereco.numero}
                  {endereco.complemento ? ` - ${endereco.complemento}` : ""}
                </p>
                <p className="text-muted-foreground">
                  {endereco.bairro} - {endereco.cidade} · CEP {endereco.cep}
                </p>
                {endereco.referencia && (
                  <p className="text-muted-foreground">
                    Ref.: {endereco.referencia}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {pedido.tipo_entrega === "retirada" && (
            <Card>
              <CardContent className="flex items-center gap-3 p-5 text-sm">
                <Package className="h-5 w-5 text-agro-blue" />
                <span>Cliente retirará em uma das lojas da Agro Baito.</span>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna lateral — controle de status */}
        <div>
          <div className="space-y-5">
            <Card className="lg:sticky lg:top-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4" /> Status do pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StatusControle
                  pedidoId={pedido.id}
                  statusAtual={pedido.status}
                />
              </CardContent>
            </Card>

            {/* Confirmação + notificação WhatsApp ao cliente */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageCircle className="h-4 w-4" /> Avisar cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NotificarCliente pedido={pedido} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
