import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton do checkout: formulario + resumo do pedido. */
export default function Loading() {
  return (
    <div className="container-agro py-8">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Formulario */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
        </div>

        {/* Resumo */}
        <div className="rounded-xl border p-5">
          <Skeleton className="mb-4 h-6 w-36" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-2 h-12 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
