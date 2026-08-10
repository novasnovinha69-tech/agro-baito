import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardGridSkeleton } from "@/components/loja/product-card-skeleton";

/** Skeleton da pagina de busca. */
export default function Loading() {
  return (
    <div className="container-agro py-6">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-28 space-y-5">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-9 w-full rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </aside>
        <div>
          <Skeleton className="mb-4 h-8 w-56" />
          <ProductCardGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}
