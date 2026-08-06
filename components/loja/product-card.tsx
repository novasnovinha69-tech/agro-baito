"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCarrinho } from "@/lib/store/carrinho";
import { formatBRL, formatPeso } from "@/lib/money";
import type { Produto } from "@/types/database.types";
import {
  precoEfetivoCents,
  temPromocao,
  precoPorUnidadeCents,
} from "@/lib/carrinho";

export function ProductCard({ produto }: { produto: Produto }) {
  const adicionar = useCarrinho((s) => s.adicionar);
  const promo = temPromocao(produto);
  const preco = precoEfetivoCents(produto);
  const precoUn = precoPorUnidadeCents(produto);
  const semEstoque = produto.estoque <= 0;
  const estoqueBaixo = produto.estoque > 0 && produto.estoque <= produto.estoque_minimo;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (semEstoque) return;
    adicionar(produto);
    toast.success(`${produto.nome} adicionado ao carrinho`);
  }

  return (
    <Link
      href={`/produto/${produto.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Imagem */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {produto.foto_url ? (
          <Image
            src={produto.foto_url}
            alt={produto.nome}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground">
            <Package className="h-12 w-12" />
          </div>
        )}

        {/* badges sobre a imagem */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {promo && <Badge variant="promo">PROMO</Badge>}
          {produto.destaque && !promo && (
            <Badge variant="success">DESTAQUE</Badge>
          )}
        </div>
        {semEstoque && (
          <div className="absolute inset-0 grid place-items-center bg-background/70">
            <Badge variant="destructive">Esgotado</Badge>
          </div>
        )}
        {estoqueBaixo && !semEstoque && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="warn">Últimas {produto.estoque}</Badge>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-agro-blue">
          {produto.nome}
        </h3>

        {produto.preco_por_kg && produto.peso_kg ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Embalagem {formatPeso(Number(produto.peso_kg))}
          </p>
        ) : null}

        <div className="mt-auto pt-2">
          {promo && (
            <p className="text-xs text-muted-foreground line-through">
              {formatBRL(produto.preco_cents)}
            </p>
          )}
          <div className="flex items-baseline gap-1">
            <span className="font-display text-lg font-bold text-agro-blue-dark">
              {formatBRL(preco)}
            </span>
          </div>
          {precoUn && (
            <p className="text-[11px] text-muted-foreground">
              ({formatBRL(precoUn)}/kg)
            </p>
          )}

          <Button
            onClick={handleAdd}
            disabled={semEstoque}
            size="sm"
            className="mt-2 w-full"
          >
            <ShoppingCart className="h-4 w-4" />
            {semEstoque ? "Esgotado" : "Adicionar"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
