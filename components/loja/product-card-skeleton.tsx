import { Skeleton } from "@/components/ui/skeleton";

/**
 * ProductCardSkeleton — espelho visual do <ProductCard>.
 * Mesma estrutura: caixa aspect-square + linhas de texto + botao,
 * para que a transicao de skeleton -> real seja o mais suave possivel
 * (sem layout shift).
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      {/* Imagem */}
      <div className="relative aspect-square bg-muted">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      </div>

      {/* Conteudo */}
      <div className="flex flex-1 flex-col p-3">
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="mt-2 h-3 w-2/5" />
        <div className="mt-auto pt-2">
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="mt-1 h-3 w-2/5" />
          <Skeleton className="mt-2 h-8 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

/** Grade de skeletons com N colunas (espelha o grid do catalogo/home). */
export function ProductCardGridSkeleton({
  count = 8,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
