import {
  AdminHeaderSkeleton,
  KpiGridSkeleton,
  DashboardListasSkeleton,
} from "@/components/admin/admin-skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/** Skeleton do dashboard admin: header + KPIs + listas + acoes rapidas. */
export default function Loading() {
  return (
    <div className="space-y-6">
      <AdminHeaderSkeleton />
      <KpiGridSkeleton />
      <DashboardListasSkeleton />
      {/* Acoes rapidas */}
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
