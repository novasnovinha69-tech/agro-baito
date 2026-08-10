import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { adminListarPedidos } from "@/lib/admin-data";
import { formatBRL } from "@/lib/money";
import { STATUS_INFO } from "@/lib/status-pedido";

export default async function AdminPedidosPage() {
  const pedidos = await adminListarPedidos();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-agro-navy">
          Pedidos
        </h1>
        <p className="text-sm text-muted-foreground">
          {pedidos.length} pedido(s) no total
        </p>
      </div>

      {pedidos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="font-medium">Nenhum pedido ainda</p>
            <p className="text-sm text-muted-foreground">
              Os pedidos aparecerão aqui quando os clientes comprarem.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="hidden grid-cols-[100px_1fr_120px_100px_120px] gap-3 border-b bg-muted px-4 py-3 text-xs font-semibold uppercase text-muted-foreground md:grid">
            <span>Código</span>
            <span>Cliente</span>
            <span>Total</span>
            <span>Entrega</span>
            <span>Status</span>
          </div>
          {pedidos.map((p) => {
            const info = STATUS_INFO[p.status];
            return (
              <Link
                key={p.id}
                href={`/admin/pedidos/${p.id}`}
                className="grid grid-cols-2 gap-2 border-b px-4 py-3 last:border-0 transition-colors hover:bg-muted md:grid-cols-[100px_1fr_120px_100px_120px] md:items-center md:gap-3"
              >
                <span className="font-mono text-sm font-semibold">
                  {p.codigo}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {p.cliente_nome}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="font-semibold">
                  {formatBRL(p.total_cents)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {p.tipo_entrega === "retirada" ? "Retirada" : "Entrega"}
                </span>
                <Badge variant={info.variant}>{info.label}</Badge>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
