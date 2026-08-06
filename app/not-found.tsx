import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-agro grid place-items-center py-20 text-center">
      <div>
        <p className="font-display text-6xl font-extrabold text-agro-blue">404</p>
        <h1 className="mt-2 font-display text-xl font-bold">Página não encontrada</h1>
        <p className="mt-1 text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  );
}
