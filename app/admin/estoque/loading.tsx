import { AdminHeaderSkeleton, ListaLinhaSkeleton } from "@/components/admin/admin-skeletons";

/** Skeleton da pagina de estoque (lista de alertas). */
export default function Loading() {
  return (
    <div className="space-y-6">
      <AdminHeaderSkeleton />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListaLinhaSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
