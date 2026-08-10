import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/** Skeleton do formulario de novo produto (mesma estrutura do de edicao). */
export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-40 w-full max-w-xs rounded-md" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}
