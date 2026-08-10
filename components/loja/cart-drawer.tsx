"use client";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatBRL } from "@/lib/money";
import { useCarrinho } from "@/lib/store/carrinho";

export function CartDrawer() {
  const { itens, aberto, fechar, atualizarQuantidade, remover, subtotalCents } =
    useCarrinho();
  const subtotal = subtotalCents();

  return (
    <Sheet open={aberto} onOpenChange={(o) => (o ? null : fechar())}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b bg-agro-blue text-white">
          <SheetTitle className="flex items-center gap-2 text-white">
            <ShoppingBag className="h-5 w-5" /> Seu carrinho
          </SheetTitle>
        </SheetHeader>

        {itens.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-medium">Seu carrinho está vazio</p>
            <p className="text-sm text-muted-foreground">
              Adicione produtos para continuar a compra.
            </p>
            <Button asChild onClick={() => fechar()}>
              <Link href="/catalogo">Ver catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Itens */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {itens.map((i) => (
                <div key={i.produtoId} className="flex gap-3">
                  <Link
                    href={`/produto/${i.slug}`}
                    onClick={() => fechar()}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted"
                  >
                    {i.fotoUrl ? (
                      <Image
                        src={i.fotoUrl}
                        alt={i.nome}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : null}
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/produto/${i.slug}`}
                      onClick={() => fechar()}
                      className="line-clamp-2 text-sm font-medium hover:text-agro-blue"
                    >
                      {i.nome}
                    </Link>
                    {i.precoPorKg && i.pesoKg ? (
                      <p className="text-xs text-muted-foreground">
                        {i.pesoKg.toString().replace(".", ",")} kg · preço por
                        kg
                      </p>
                    ) : null}
                    <p className="mt-0.5 text-sm font-semibold text-agro-blue-dark">
                      {formatBRL(i.precoCents * i.quantidade)}
                    </p>

                    <div className="mt-auto flex items-center gap-2 pt-1">
                      <div className="flex items-center rounded-md border">
                        <button
                          onClick={() =>
                            atualizarQuantidade(i.produtoId, i.quantidade - 1)
                          }
                          disabled={i.quantidade <= 1}
                          className="grid h-7 w-7 place-items-center text-muted-foreground hover:bg-muted disabled:opacity-40"
                          aria-label="Diminuir"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <input
                          value={i.quantidade}
                          onChange={(e) =>
                            atualizarQuantidade(
                              i.produtoId,
                              parseInt(
                                e.target.value.replace(/\D/g, "") || "1",
                              ),
                            )
                          }
                          className="h-7 w-10 border-x bg-transparent text-center text-sm"
                          inputMode="numeric"
                        />
                        <button
                          onClick={() =>
                            atualizarQuantidade(i.produtoId, i.quantidade + 1)
                          }
                          disabled={i.quantidade >= i.estoque}
                          className="grid h-7 w-7 place-items-center text-muted-foreground hover:bg-muted disabled:opacity-40"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => remover(i.produtoId)}
                        className="ml-auto grid h-7 w-7 place-items-center rounded-md text-destructive hover:bg-destructive/10"
                        aria-label="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {i.quantidade >= i.estoque && (
                      <p className="mt-1 text-[11px] text-orange-600">
                        Estoque máximo atingido ({i.estoque})
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="border-t bg-muted/30 p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-lg font-bold text-agro-blue-dark">
                  {formatBRL(subtotal)}
                </span>
              </div>
              <Separator className="mb-3" />
              <p className="mb-3 text-xs text-muted-foreground">
                O frete é calculado no checkout conforme a zona de entrega.
              </p>
              <div className="grid grid-cols-1 gap-2">
                <Button asChild size="lg" onClick={() => fechar()}>
                  <Link href="/checkout">Finalizar compra</Link>
                </Button>
                <Button asChild variant="outline" onClick={() => fechar()}>
                  <Link href="/carrinho">Ver carrinho completo</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
