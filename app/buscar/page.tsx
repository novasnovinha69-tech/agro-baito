import { CatalogoCliente } from "@/components/loja/catalogo-cliente";
import { listarProdutos, listarCategorias } from "@/lib/data";

export const metadata = { title: "Buscar" };

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? "";
  const [produtos, categorias] = await Promise.all([
    listarProdutos({ busca: q }),
    listarCategorias(),
  ]);

  return (
    <div>
      <div className="bg-agro-blue text-white">
        <div className="container-agro py-6">
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            {q ? `Resultados para "${q}"` : "Buscar produtos"}
          </h1>
          <p className="text-white/80">
            {produtos.length} produto{produtos.length !== 1 && "s"} encontrado
            {produtos.length !== 1 && "s"}.
          </p>
        </div>
      </div>
      <CatalogoCliente
        produtos={produtos}
        categorias={categorias}
        buscaInicial={q}
      />
    </div>
  );
}
