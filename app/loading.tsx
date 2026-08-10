import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardGridSkeleton } from "@/components/loja/product-card-skeleton";

/** Skeleton da home: hero + beneficios + categorias + destaques. */
export default function Loading() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-agro-gradient text-white">
        <div className="container-agro grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-44 rounded-full bg-white/20" />
              <Skeleton className="h-6 w-44 rounded-full bg-white/20" />
            </div>
            <Skeleton className="h-12 w-full bg-white/20" />
            <Skeleton className="h-12 w-3/4 bg-white/20" />
            <Skeleton className="h-5 w-80 max-w-full bg-white/20" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-12 w-44 rounded-md bg-white/20" />
              <Skeleton className="h-12 w-44 rounded-md bg-white/20" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-square rounded-2xl bg-white/15"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="border-b bg-card">
        <div className="container-agro grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="container-agro py-12">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4"
            >
              <Skeleton className="h-14 w-14 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section className="bg-agro-gray-light py-12">
        <div className="container-agro">
          <div className="mb-6 space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-48" />
          </div>
          <ProductCardGridSkeleton count={8} />
        </div>
      </section>
    </div>
  );
}
