import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardGridSkeleton } from "@/components/loja/product-card-skeleton";

/** Skeleton do catalogo: sidebar de filtros + grid de produtos. */
export default function Loading() {
  return (
    <div className="container-agro py-6">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar de filtros */}
        <aside className="hidden md:block">
          <div className="sticky top-28 space-y-5">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-9 w-full rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-9 w-40 rounded-md" />
            <Skeleton className="h-4 w-24" />
          </div>
          <ProductCardGridSkeleton count={12} />
        </div>
      </div>
    </div>
  );
}
