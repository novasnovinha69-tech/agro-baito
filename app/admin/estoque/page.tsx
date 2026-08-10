import { AlertTriangle, Package, Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminEstoqueBaixo, adminListarProdutos } from "@/lib/admin-data";

export default async function AdminEstoquePage() {
  const [baixo, todos] = await Promise.all([
    adminEstoqueBaixo(),
    adminListarProdutos(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-agro-navy">
          Controle de Estoque
        </h1>
        <p className="text-sm text-muted-foreground">
          {baixo.length} produto(s) com estoque baixo · {todos.length} total
        </p>
      </div>

      {/* Alertas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-orange-500" /> Precisam
            reposição
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {baixo.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Package className="h-10 w-10 text-agro-emerald" />
              <p className="text-sm text-muted-foreground">
                Tudo certo! Nenhum produto com estoque baixo.
              </p>
            </div>
          ) : (
            baixo.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.nome}</p>
                  {item.categoria && (
                    <p className="text-xs text-muted-foreground">
                      {item.categoria}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.estoque === 0 ? "destructive" : "warn"}>
                    {item.estoque === 0
                      ? "Esgotado"
                      : `${item.estoque} un. (mín ${item.estoque_minimo})`}
                  </Badge>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/produtos/${item.id}`}>
                      <Plus className="h-3.5 w-3.5" /> repor
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
