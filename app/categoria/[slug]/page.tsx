import { notFound } from "next/navigation";
import { CatalogoCliente } from "@/components/loja/catalogo-cliente";
import { listarProdutos, listarCategorias } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const categorias = await listarCategorias();
  const cat = categorias.find((c) => c.slug === params.slug);
  if (!cat) return { title: "Categoria" };
  return {
    title: cat.nome,
    description: `Produtos da categoria ${cat.nome} na Agro Mundo Animal.`,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: { slug: string };
}) {
  const categorias = await listarCategorias();
  const categoria = categorias.find((c) => c.slug === params.slug);
  if (!categoria) notFound();

  const produtos = await listarProdutos({ categoriaSlug: params.slug });

  return (
    <div>
      <div className="bg-agro-blue text-white">
        <div className="container-agro py-6">
          <p className="text-sm text-white/70">Categoria</p>
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            {categoria.nome}
          </h1>
          <p className="text-white/80">
            {produtos.length} produto{produtos.length !== 1 && "s"} nesta
            categoria.
          </p>
        </div>
      </div>
      <CatalogoCliente
        produtos={produtos}
        categorias={categorias}
        categoriaAtivaSlug={params.slug}
      />
    </div>
  );
}
