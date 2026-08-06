import { Truck, MapPin, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listarUnidadesComZonas } from "@/lib/data";

export default async function AdminZonasPage() {
  const unidades = await listarUnidadesComZonas();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-agro-navy">
          Zonas de Entrega
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure o % de frete cobrado em cada região
        </p>
      </div>

      {unidades.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Nenhuma unidade cadastrada.
          </CardContent>
        </Card>
      ) : (
        unidades.map((unidade) => (
          <Card key={unidade.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-agro-blue" /> {unidade.nome}
              </CardTitle>
              {unidade.endereco && (
                <CardDescription>{unidade.endereco}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <div className="grid grid-cols-[1fr_90px_90px_90px] gap-2 border-b bg-muted px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                  <span>Zona</span>
                  <span className="text-center">Tipo</span>
                  <span className="text-center">Frete</span>
                  <span className="text-center">Prazo</span>
                </div>
                {unidade.zonas.map((z) => (
                  <div
                    key={z.id}
                    className="grid grid-cols-[1fr_90px_90px_90px] items-center gap-2 border-b px-3 py-2.5 text-sm last:border-0"
                  >
                    <span className="font-medium">{z.nome}</span>
                    <span className="text-center">
                      <Badge variant="outline">
                        {z.tipo === "retirada"
                          ? "Retirada"
                          : z.tipo === "bairro"
                            ? "Bairro"
                            : "Cidade"}
                      </Badge>
                    </span>
                    <span className="text-center font-semibold text-agro-blue">
                      {Number(z.frete_percentual) === 0
                        ? "Grátis"
                        : `${Number(z.frete_percentual)}%`}
                    </span>
                    <span className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {z.prazo_horas}h
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5" />
                O frete é calculado automaticamente no checkout como % sobre o
                subtotal dos produtos.
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
