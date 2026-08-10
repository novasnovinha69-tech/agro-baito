import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/** Skeleton do formulario de edicao de produto. */
export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Card>
        <CardContent className="space-y-4 p-6">
          {/* Foto */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-40 w-full max-w-xs rounded-md" />
          </div>
          {/* Nome / slug */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
          {/* Precos */}
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
          {/* Categoria + estoque */}
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
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
