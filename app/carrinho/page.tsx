"use client";

import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatBRL, formatPeso } from "@/lib/money";
import { useCarrinho } from "@/lib/store/carrinho";

export default function CarrinhoPage() {
  const { itens, atualizarQuantidade, remover, subtotalCents, limpar } =
    useCarrinho();
  const subtotal = subtotalCents();

  if (itens.length === 0) {
    return (
      <div className="container-agro py-16">
        <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="mt-4 font-display text-xl font-bold">
            Seu carrinho está vazio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Que tal explorar nosso catálogo de rações, medicamentos e
            ferramentas?
          </p>
          <Button asChild className="mt-4" size="lg">
            <Link href="/catalogo">
              Ver catálogo <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-agro py-6">
      <h1 className="mb-4 font-display text-2xl font-bold text-agro-blue-dark md:text-3xl">
        Seu carrinho
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Itens */}
        <div className="space-y-3">
          {itens.map((i) => (
            <Card key={i.produtoId}>
              <CardContent className="flex gap-4 p-4">
                <Link
                  href={`/produto/${i.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted"
                >
                  {i.fotoUrl && (
                    <Image
                      src={i.fotoUrl}
                      alt={i.nome}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </Link>

                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/produto/${i.slug}`}
                    className="font-medium hover:text-agro-blue"
                  >
                    {i.nome}
                  </Link>
                  {i.precoPorKg && i.pesoKg && (
                    <p className="text-xs text-muted-foreground">
                      Embalagem {formatPeso(i.pesoKg)}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {formatBRL(i.precoCents)} cada
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-md border">
                      <button
                        onClick={() =>
                          atualizarQuantidade(i.produtoId, i.quantidade - 1)
                        }
                        disabled={i.quantidade <= 1}
                        className="grid h-8 w-8 place-items-center hover:bg-muted disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        value={i.quantidade}
                        onChange={(e) =>
                          atualizarQuantidade(
                            i.produtoId,
                            parseInt(e.target.value.replace(/\D/g, "") || "1"),
                          )
                        }
                        className="h-8 w-12 border-x bg-transparent text-center text-sm"
                        inputMode="numeric"
                      />
                      <button
                        onClick={() =>
                          atualizarQuantidade(i.produtoId, i.quantidade + 1)
                        }
                        disabled={i.quantidade >= i.estoque}
                        className="grid h-8 w-8 place-items-center hover:bg-muted disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-agro-blue-dark">
                        {formatBRL(i.precoCents * i.quantidade)}
                      </span>
                      <button
                        onClick={() => remover(i.produtoId)}
                        className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"
                        aria-label="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("Remover todos os itens do carrinho?")) limpar();
              }}
            >
              <Trash2 className="h-4 w-4" /> Limpar carrinho
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/catalogo">Continuar comprando</Link>
            </Button>
          </div>
        </div>

        {/* Resumo */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Card>
            <CardContent className="p-5">
              <h2 className="font-display text-lg font-bold">
                Resumo do pedido
              </h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-muted-foreground">
                    calculado no checkout
                  </span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-baseline justify-between">
                <span className="font-medium">Total estimado</span>
                <span className="font-display text-xl font-bold text-agro-blue-dark">
                  {formatBRL(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                + frete conforme sua zona de entrega.
              </p>

              <Button asChild size="xl" className="mt-4 w-full">
                <Link href="/checkout">
                  Finalizar compra <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Pix com aprovação imediata · Dados seguros
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
