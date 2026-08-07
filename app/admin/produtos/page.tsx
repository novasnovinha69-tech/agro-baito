import Link from "next/link";
import Image from "next/image";
import { Plus, Package, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { adminListarProdutos } from "@/lib/admin-data";
import { formatBRL } from "@/lib/money";

export default async function AdminProdutosPage() {
  const produtos = await adminListarProdutos();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-agro-navy">
            Produtos
          </h1>
          <p className="text-sm text-muted-foreground">
            {produtos.length} produto(s) cadastrado(s)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/produtos/novo">
            <Plus className="h-4 w-4" /> Novo produto
          </Link>
        </Button>
      </div>

      {produtos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className="font-medium">Nenhum produto cadastrado</p>
            <p className="text-sm text-muted-foreground">
              Clique em &quot;Novo produto&quot; para cadastrar o primeiro.
            </p>
            <Button asChild>
              <Link href="/admin/produtos/novo">
                <Plus className="h-4 w-4" /> Cadastrar produto
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          {/* Cabeçalho da tabela (desktop) */}
          <div className="hidden grid-cols-[80px_1fr_140px_120px_100px_80px] gap-3 border-b bg-muted px-4 py-3 text-xs font-semibold uppercase text-muted-foreground md:grid">
            <span>Foto</span>
            <span>Produto</span>
            <span>Categoria</span>
            <span className="text-right">Preço</span>
            <span className="text-center">Estoque</span>
            <span className="text-right">Ações</span>
          </div>

          {/* Linhas */}
          {produtos.map((p) => {
            const baixo = p.estoque <= p.estoque_minimo;
            return (
              <div
                key={p.id}
                className="grid grid-cols-1 gap-3 border-b px-4 py-3 last:border-0 md:grid-cols-[80px_1fr_140px_120px_100px_80px] md:items-center"
              >
                {/* Foto */}
                <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-muted">
                  {p.foto_url ? (
                    <Image
                      src={p.foto_url}
                      alt={p.nome}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Nome */}
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.nome}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.preco_por_kg && p.peso_kg
                      ? `${Number(p.peso_kg)}kg · preço por kg`
                      : p.unidade_medida}
                    {!p.ativo && " · inativo"}
                  </p>
                </div>

                {/* Categoria */}
                <span className="text-sm text-muted-foreground">
                  {p.categoria?.nome ?? "—"}
                </span>

                {/* Preço */}
                <span className="font-semibold text-agro-navy md:text-right">
                  {formatBRL(p.preco_promocional_cents ?? p.preco_cents)}
                </span>

                {/* Estoque */}
                <div className="md:text-center">
                  <Badge variant={baixo ? "warn" : "outline"}>
                    {p.estoque} un.
                  </Badge>
                </div>

                {/* Ações */}
                <div className="md:text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/produtos/${p.id}`}>
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
