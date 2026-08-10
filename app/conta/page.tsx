import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, Clock, LogOut } from "lucide-react";
import { getClienteAtual, listarPedidosDoCliente } from "@/lib/cliente-auth";
import { isSupabaseConfigured } from "@/lib/carrinho";
import { STATUS_INFO } from "@/lib/status-pedido";
import { formatBRL } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = { title: "Minha conta" };

export default async function ContaPage() {
  // Modo demo: sem Supabase, mostra tela informativa
  if (!isSupabaseConfigured()) {
    return (
      <div className="container-agro py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-2xl font-bold text-agro-navy">
            Minha conta
          </h1>
          <Card className="mt-6">
            <CardContent className="p-6 text-center text-muted-foreground">
              <Package className="mx-auto mb-3 h-12 w-12 text-muted" />
              <p>
                Modo demonstração. A área do cliente (meus pedidos, dados da
                conta) funcionará quando o sistema estiver conectado ao banco de
                dados.
              </p>
              <Button asChild className="mt-4">
                <Link href="/catalogo">Continuar comprando</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const cliente = await getClienteAtual();
  if (!cliente) {
    redirect("/entrar?tipo=cliente");
  }

  const pedidos = await listarPedidosDoCliente(cliente.email);

  return (
    <div className="container-agro py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-agro-navy">
            Minha conta
          </h1>
          <p className="text-sm text-muted-foreground">{cliente.email}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="/entrar">
            <LogOut className="h-4 w-4" /> Sair
          </a>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Pedidos */}
        <div>
          <h2 className="mb-3 font-display text-lg font-bold">Meus pedidos</h2>
          {pedidos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Package className="mx-auto mb-3 h-10 w-10 text-muted" />
                <p>Você ainda não fez pedidos.</p>
                <Button asChild className="mt-3">
                  <Link href="/catalogo">Ver catálogo</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pedidos.map((p) => {
                const info = STATUS_INFO[p.status];
                return (
                  <Link
                    key={p.id}
                    href={`/conta/pedidos/${p.token_acesso}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        {p.codigo} · {formatBRL(p.total_cents)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Badge variant={info.variant} className="ml-2 shrink-0">
                      {info.label}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Atalhos */}
        <div className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Atalhos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/catalogo"
                className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-muted"
              >
                <Package className="h-4 w-4 text-agro-blue" /> Continuar
                comprando
              </Link>
              <Link
                href="/contato"
                className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-muted"
              >
                <Clock className="h-4 w-4 text-agro-blue" /> Ajuda / contato
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
