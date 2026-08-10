import { CatalogoCliente } from "@/components/loja/catalogo-cliente-dynamic";
import { listarCategorias, listarProdutos } from "@/lib/data";
import { LOJA } from "@/lib/loja-config";

export const metadata = {
  title: "Catálogo completo",
  description: `Todos os produtos disponíveis na ${LOJA.nome}.`,
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const [produtos, categorias] = await Promise.all([
    listarProdutos(),
    listarCategorias(),
  ]);

  return (
    <div>
      <div className="bg-agro-blue text-white">
        <div className="container-agro py-6">
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            Catálogo completo
          </h1>
          <p className="text-white/80">
            {produtos.length} produtos disponíveis para entrega e retirada.
          </p>
        </div>
      </div>
      <CatalogoCliente
        produtos={produtos}
        categorias={categorias}
        buscaInicial={searchParams.q ?? ""}
      />
    </div>
  );
}
