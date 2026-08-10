import { AdminHeaderSkeleton, TabelaSkeleton } from "@/components/admin/admin-skeletons";

/** Skeleton da lista de pedidos (tabela). */
export default function Loading() {
  return (
    <div className="space-y-6">
      <AdminHeaderSkeleton />
      <TabelaSkeleton linhas={8} colunas={5} />
    </div>
  );
}
