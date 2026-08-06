import Link from "next/link";
import {
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  Truck,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  adminListarProdutos,
  adminListarPedidos,
  adminEstoqueBaixo,
} from "@/lib/admin-data";
import { formatBRL } from "@/lib/money";
import { STATUS_INFO } from "@/lib/status-pedido";

export default async function AdminDashboardPage() {
  const [produtos, pedidos, estoqueBaixo] = await Promise.all([
    adminListarProdutos(),
    adminListarPedidos(),
    adminEstoqueBaixo(),
  ]);

  const totalProdutos = produtos.length;
  const totalPedidos = pedidos.length;
  const pedidosPendentes = pedidos.filter(
    (p) => p.status === "pendente" || p.status === "aguardando_pagamento",
  ).length;
  const faturamento = pedidos
    .filter((p) => p.status !== "cancelado")
    .reduce((acc, p) => acc + p.total_cents, 0);

  const ultimosPedidos = pedidos.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-agro-navy">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Visão geral da Agro Mundo Animal
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/produtos/novo">
            <Plus className="h-4 w-4" /> Novo produto
          </Link>
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={TrendingUp}
          label="Faturamento"
          value={formatBRL(faturamento)}
          hint={`${totalPedidos} pedido(s)`}
          cor="text-agro-emerald"
        />
        <KpiCard
          icon={ShoppingCart}
          label="Pedidos"
          value={String(totalPedidos)}
          hint={`${pedidosPendentes} pendente(s)`}
          cor="text-agro-blue"
        />
        <KpiCard
          icon={Package}
          label="Produtos"
          value={String(totalProdutos)}
          hint="cadastrados"
          cor="text-agro-navy"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Estoque baixo"
          value={String(estoqueBaixo.length)}
          hint="precisam reposição"
          cor={
            estoqueBaixo.length > 0 ? "text-destructive" : "text-agro-emerald"
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Últimos pedidos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Últimos pedidos</CardTitle>
            <Link
              href="/admin/pedidos"
              className="text-xs font-semibold text-agro-blue hover:underline"
            >
              Ver todos →
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {ultimosPedidos.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhum pedido ainda.
              </p>
            ) : (
              ultimosPedidos.map((p) => {
                const info = STATUS_INFO[p.status];
                return (
                  <Link
                    key={p.id}
                    href={`/admin/pedidos/${p.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {p.codigo} · {p.cliente_nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatBRL(p.total_cents)} ·{" "}
                        {p.tipo_entrega === "retirada" ? "Retirada" : "Entrega"}
                      </p>
                    </div>
                    <Badge
                      variant={info.variant}
                      className="ml-2 shrink-0"
                    >
                      {info.label}
                    </Badge>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Estoque baixo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Alertas de estoque</CardTitle>
            <Link
              href="/admin/estoque"
              className="text-xs font-semibold text-agro-blue hover:underline"
            >
              Gerenciar →
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {estoqueBaixo.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <Package className="h-8 w-8 text-agro-emerald" />
                <p className="text-sm text-muted-foreground">
                  Tudo certo! Nenhum produto com estoque baixo.
                </p>
              </div>
            ) : (
              estoqueBaixo.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.nome}</p>
                    {item.categoria && (
                      <p className="text-xs text-muted-foreground">
                        {item.categoria}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={item.estoque === 0 ? "destructive" : "warn"}
                    className="ml-2 shrink-0"
                  >
                    {item.estoque === 0
                      ? "Sem estoque"
                      : `${item.estoque} un.`}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ações rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/produtos"
            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:border-agro-blue hover:bg-muted"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-5 w-5 text-agro-blue" /> Gerenciar produtos
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href="/admin/zonas-entrega"
            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:border-agro-blue hover:bg-muted"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <Truck className="h-5 w-5 text-agro-blue" /> Zonas de entrega
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href="/admin/pedidos"
            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:border-agro-blue hover:bg-muted"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <ShoppingCart className="h-5 w-5 text-agro-blue" /> Ver pedidos
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  cor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint: string;
  cor: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <Icon className={`h-5 w-5 ${cor}`} />
        </div>
        <p className="mt-2 font-display text-2xl font-bold text-agro-navy">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
