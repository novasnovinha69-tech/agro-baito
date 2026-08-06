"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { ProductCard } from "@/components/loja/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Produto, Categoria } from "@/types/database.types";
import { formatBRL } from "@/lib/money";

type Props = {
  produtos: Produto[];
  categorias: Categoria[];
  categoriaAtivaSlug?: string;
  buscaInicial?: string;
};

type Ordenacao = "recentes" | "menor-preco" | "maior-preco" | "nome";

export function CatalogoCliente({
  produtos,
  categorias,
  categoriaAtivaSlug,
  buscaInicial = "",
}: Props) {
  const [busca, setBusca] = useState(buscaInicial);
  const [ordem, setOrdem] = useState<Ordenacao>("recentes");
  const [soPromocao, setSoPromocao] = useState(false);
  const [soEstoque, setSoEstoque] = useState(false);
  const [precoMax, setPrecoMax] = useState<number | null>(null);

  const filtrados = useMemo(() => {
    let lista = [...produtos];
    if (busca.trim()) {
      const q = busca.toLowerCase();
      lista = lista.filter(
        (p) =>
          p.nome.toLowerCase().includes(q) ||
          (p.descricao ?? "").toLowerCase().includes(q),
      );
    }
    if (soPromocao) {
      lista = lista.filter(
        (p) =>
          p.preco_promocional_cents != null &&
          p.preco_promocional_cents < p.preco_cents,
      );
    }
    if (soEstoque) lista = lista.filter((p) => p.estoque > 0);
    if (precoMax != null) {
      lista = lista.filter((p) => {
        const ef =
          p.preco_promocional_cents ?? p.preco_cents;
        return ef <= precoMax;
      });
    }

    const ef = (p: Produto) => p.preco_promocional_cents ?? p.preco_cents;
    switch (ordem) {
      case "menor-preco":
        lista.sort((a, b) => ef(a) - ef(b));
        break;
      case "maior-preco":
        lista.sort((a, b) => ef(b) - ef(a));
        break;
      case "nome":
        lista.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      default:
        lista.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    return lista;
  }, [produtos, busca, ordem, soPromocao, soEstoque, precoMax]);

  const temFiltros =
    soPromocao || soEstoque || precoMax != null || busca.trim() !== "";

  function limparFiltros() {
    setBusca("");
    setSoPromocao(false);
    setSoEstoque(false);
    setPrecoMax(null);
    setOrdem("recentes");
  }

  const maioresPrecos = produtos
    .map((p) => p.preco_promocional_cents ?? p.preco_cents)
    .sort((a, b) => a - b);
  const faixas = useMemo(() => {
    if (maioresPrecos.length === 0) return [];
    const max = maioresPrecos[maioresPrecos.length - 1];
    return [
      { label: "Até R$ 25", valor: 2500 },
      { label: "Até R$ 50", valor: 5000 },
      { label: "Até R$ 100", valor: 10000 },
      { label: "Até R$ 200", valor: 20000 },
    ].filter((f) => f.valor <= max);
  }, [produtos]);

  return (
    <div className="container-agro py-6">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        {/* ===== Sidebar de filtros ===== */}
        <aside className="hidden md:block">
          <div className="sticky top-28 space-y-5">
            <div>
              <p className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-agro-blue-dark">
                <SlidersHorizontal className="h-4 w-4" /> Filtros
              </p>
            </div>

            {/* Busca */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="h-9 pl-8"
              />
            </div>

            {/* Categorias */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                Categorias
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  <a
                    href="/catalogo"
                    className="block rounded px-2 py-1 hover:bg-muted"
                  >
                    Todas
                  </a>
                </li>
                {categorias.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`/categoria/${c.slug}`}
                      className={`block rounded px-2 py-1 hover:bg-muted ${
                        c.slug === categoriaAtivaSlug
                          ? "bg-muted font-semibold text-agro-blue"
                          : ""
                      }`}
                    >
                      {c.nome}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Faixa de preço */}
            {faixas.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Preço máximo
                </p>
                <ul className="space-y-1 text-sm">
                  {faixas.map((f) => (
                    <li key={f.valor}>
                      <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted">
                        <input
                          type="radio"
                          name="preco"
                          checked={precoMax === f.valor}
                          onChange={() => setPrecoMax(f.valor)}
                        />
                        {f.label}
                      </label>
                    </li>
                  ))}
                  <li>
                    <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted">
                      <input
                        type="radio"
                        name="preco"
                        checked={precoMax === null}
                        onChange={() => setPrecoMax(null)}
                      />
                      Qualquer preço
                    </label>
                  </li>
                </ul>
              </div>
            )}

            {/* Toggles */}
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={soPromocao}
                  onChange={(e) => setSoPromocao(e.target.checked)}
                />
                Somente promoções
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={soEstoque}
                  onChange={(e) => setSoEstoque(e.target.checked)}
                />
                Somente em estoque
              </label>
            </div>

            {temFiltros && (
              <Button variant="ghost" size="sm" onClick={limparFiltros}>
                <X className="h-4 w-4" /> Limpar filtros
              </Button>
            )}
          </div>
        </aside>

        {/* ===== Lista de produtos ===== */}
        <div>
          {/* Top bar mobile + ordenação */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 md:hidden">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="h-9 pl-8"
              />
            </div>
            <select
              value={ordem}
              onChange={(e) => setOrdem(e.target.value as Ordenacao)}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="recentes">Mais recentes</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="nome">A–Z</option>
            </select>
            <span className="text-sm text-muted-foreground">
              {filtrados.length} produto{filtrados.length !== 1 && "s"}
            </span>
          </div>

          {/* chips de filtros ativos (mobile) */}
          <div className="mb-3 flex flex-wrap gap-2 md:hidden">
            {soPromocao && (
              <Badge
                variant="promo"
                className="cursor-pointer"
                onClick={() => setSoPromocao(false)}
              >
                Promoção ×
              </Badge>
            )}
            {soEstoque && (
              <Badge
                variant="success"
                className="cursor-pointer"
                onClick={() => setSoEstoque(false)}
              >
                Em estoque ×
              </Badge>
            )}
          </div>

          {filtrados.length === 0 ? (
            <div className="grid place-items-center rounded-xl border border-dashed py-16 text-center">
              <div>
                <p className="font-medium">Nenhum produto encontrado</p>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar a busca ou os filtros.
                </p>
                {temFiltros && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={limparFiltros}
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {filtrados.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
