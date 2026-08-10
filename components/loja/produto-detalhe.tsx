"use client";

import {
  AlertTriangle,
  ChevronRight,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  precoEfetivoCents,
  precoPorUnidadeCents,
  temPromocao,
} from "@/lib/carrinho";
import { formatBRL, formatBRLValue, formatPeso } from "@/lib/money";
import { useCarrinho } from "@/lib/store/carrinho";
import type { Produto } from "@/types/database.types";

export function ProdutoDetalhe({ produto }: { produto: Produto }) {
  const adicionar = useCarrinho((s) => s.adicionar);
  const promo = temPromocao(produto);
  const preco = precoEfetivoCents(produto);
  const precoUn = precoPorUnidadeCents(produto);
  const semEstoque = produto.estoque <= 0;
  const estoqueBaixo =
    produto.estoque > 0 && produto.estoque <= produto.estoque_minimo;

  const [qtd, setQtd] = useState(produto.qtd_minima);

  function clamp(v: number) {
    let n = Math.max(produto.qtd_minima, v);
    if (produto.multiplo > 1)
      n = Math.ceil(n / produto.multiplo) * produto.multiplo;
    return Math.min(n, produto.estoque);
  }

  function handleAdd() {
    adicionar(produto, qtd);
    toast.success(`${produto.nome} (${qtd}x) adicionado ao carrinho`);
  }

  return (
    <div className="container-agro py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-agro-blue">
          Início
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/catalogo" className="hover:text-agro-blue">
          Catálogo
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{produto.nome}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* ===== Galeria ===== */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
          {produto.foto_url ? (
            <Image
              src={produto.foto_url}
              alt={produto.nome}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="grid h-full place-items-center text-muted-foreground">
              <Package className="h-20 w-20" />
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {promo && <Badge variant="promo">PROMOÇÃO</Badge>}
            {produto.destaque && <Badge variant="success">DESTAQUE</Badge>}
          </div>
        </div>

        {/* ===== Info ===== */}
        <div>
          <h1 className="font-display text-2xl font-bold leading-tight text-agro-blue-dark md:text-3xl">
            {produto.nome}
          </h1>

          {produto.preco_por_kg && produto.peso_kg ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Vendido por peso · Embalagem de{" "}
              {formatPeso(Number(produto.peso_kg))}
            </p>
          ) : null}

          {/* Preço */}
          <div className="mt-4 rounded-xl bg-agro-gray-light p-4">
            {promo && (
              <p className="text-sm text-muted-foreground line-through">
                De {formatBRL(produto.preco_cents)}
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-agro-blue-dark">
                {formatBRL(preco)}
              </span>
              {promo && (
                <Badge variant="promo">
                  -{Math.round((1 - preco / produto.preco_cents) * 100)}%
                </Badge>
              )}
            </div>
            {produto.preco_por_kg && produto.peso_kg ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Equivale a{" "}
                <strong className="text-agro-blue-dark">
                  {formatBRLValue(preco / Number(produto.peso_kg))}/kg
                </strong>
              </p>
            ) : null}
            <p className="mt-1 text-xs text-muted-foreground">à vista no Pix</p>
          </div>

          {/* Estoque */}
          <div className="mt-3 text-sm">
            {semEstoque ? (
              <p className="flex items-center gap-1 text-destructive">
                <AlertTriangle className="h-4 w-4" /> Produto esgotado
              </p>
            ) : estoqueBaixo ? (
              <p className="flex items-center gap-1 text-orange-600">
                <AlertTriangle className="h-4 w-4" /> Restam apenas{" "}
                {produto.estoque} em estoque!
              </p>
            ) : (
              <p className="flex items-center gap-1 text-agro-blue">
                <Package className="h-4 w-4" /> Em estoque ({produto.estoque}{" "}
                disponíveis)
              </p>
            )}
          </div>

          {/* Quantidade + regras */}
          {!semEstoque && (
            <>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center rounded-lg border">
                  <button
                    onClick={() => setQtd((q) => clamp(q - produto.multiplo))}
                    disabled={qtd <= produto.qtd_minima}
                    className="grid h-11 w-11 place-items-center hover:bg-muted disabled:opacity-40"
                    aria-label="Diminuir"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    value={qtd}
                    onChange={(e) =>
                      setQtd(
                        clamp(
                          parseInt(e.target.value.replace(/\D/g, "") || "1"),
                        ),
                      )
                    }
                    className="h-11 w-14 border-x bg-transparent text-center font-semibold"
                    inputMode="numeric"
                  />
                  <button
                    onClick={() => setQtd((q) => clamp(q + produto.multiplo))}
                    disabled={qtd >= produto.estoque}
                    className="grid h-11 w-11 place-items-center hover:bg-muted disabled:opacity-40"
                    aria-label="Aumentar"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-agro-blue-dark">
                    Subtotal: {formatBRL(preco * qtd)}
                  </p>
                  {produto.qtd_minima > 1 && (
                    <p className="text-xs text-muted-foreground">
                      Mínimo de {produto.qtd_minima} un.
                    </p>
                  )}
                  {produto.multiplo > 1 && (
                    <p className="text-xs text-muted-foreground">
                      Múltiplos de {produto.multiplo}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button size="xl" onClick={handleAdd} disabled={semEstoque}>
                  <ShoppingCart className="h-5 w-5" /> Adicionar ao carrinho
                </Button>
                <Button asChild size="xl" variant="outline">
                  <Link href="/checkout">Comprar agora</Link>
                </Button>
              </div>
            </>
          )}

          <Separator className="my-5" />

          {/* Selos */}
          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-agro-blue" />
              <span>Entrega no Litoral Norte</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-agro-blue" />
              <span>Produto original</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-agro-blue" />
              <span>Retire na loja</span>
            </div>
          </div>
        </div>
      </div>

      {/* Descrição */}
      {produto.descricao && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-agro-blue-dark">
            Descrição
          </h2>
          <Separator className="my-3" />
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
            {produto.descricao}
          </p>
        </section>
      )}
    </div>
  );
}
