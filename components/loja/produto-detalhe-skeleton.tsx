import { Skeleton } from "@/components/ui/skeleton";

/**
 * ProdutoDetalheSkeleton — espelho da pagina de detalhe de produto.
 * Galeria (aspect-square grande) + coluna de info (titulo, preco, botoes).
 */
export function ProdutoDetalheSkeleton() {
  return (
    <div className="container-agro grid gap-8 py-8 md:grid-cols-2">
      {/* Galeria */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="mt-3 h-4 w-1/2" />

        <div className="mt-6">
          <Skeleton className="h-9 w-2/5" />
          <Skeleton className="mt-2 h-4 w-1/4" />
        </div>

        {/* Seletor de quantidade */}
        <div className="mt-6 flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>

        {/* Botoes */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Skeleton className="h-12 w-48 rounded-md" />
          <Skeleton className="h-12 w-48 rounded-md" />
        </div>

        {/* Descricao */}
        <div className="mt-8 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}
