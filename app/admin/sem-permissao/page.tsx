import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/** Página exibida quando um admin comum tenta acessar área só do master. */
export default function SemPermissaoPage() {
  return (
    <div className="grid place-items-center py-16">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="font-display text-xl font-bold text-agro-navy">
            Acesso restrito
          </h1>
          <p className="text-sm text-muted-foreground">
            Esta área é exclusiva do <strong>administrador master</strong>{" "}
            (proprietário do sistema). Se você é o cliente da loja e precisa de
            algo daqui, entre em contato com o suporte.
          </p>
          <Button asChild>
            <Link href="/admin">Voltar ao painel</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
