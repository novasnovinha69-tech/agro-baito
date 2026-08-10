import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/** KPI card skeleton — espelho do KpiCard do dashboard. */
export function KpiCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="mt-2 h-7 w-16" />
        <Skeleton className="mt-1 h-3 w-24" />
      </CardContent>
    </Card>
  );
}

/** Linha de lista (pedidos/estoque) — card com duas linhas + badge. */
export function ListaLinhaSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="min-w-0 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

/** Bloco de KPIs (4 cards) do dashboard. */
export function KpiGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <KpiCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Dois cards de lista lado a lado (ultimos pedidos + alertas). */
export function DashboardListasSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-16" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <ListaLinhaSkeleton key={j} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/** Cabecalho de pagina admin (titulo + botao). */
export function AdminHeaderSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-10 w-36 rounded-md" />
    </div>
  );
}

/** Linha de tabela (para listas de produtos/pedidos em formato tabela). */
export function TabelaLinhaSkeleton({ colunas = 4 }: { colunas?: number }) {
  return (
    <tr className="border-b">
      {Array.from({ length: colunas }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

/** Tabela completa com cabecalho + N linhas. */
export function TabelaSkeleton({
  linhas = 8,
  colunas = 4,
}: {
  linhas?: number;
  colunas?: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr className="border-b">
            {Array.from({ length: colunas }).map((_, i) => (
              <th key={i} className="p-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: linhas }).map((_, i) => (
            <TabelaLinhaSkeleton key={i} colunas={colunas} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
