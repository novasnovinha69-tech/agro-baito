import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { obterProdutoPorSlug } from "@/lib/data";
import { ProdutoDetalheSkeleton } from "@/components/loja/produto-detalhe-skeleton";

/**
 * ProdutoDetalhe (client component com seletor de qty, galeria, add ao carrinho)
 * carregado via next/dynamic para code-split do bundle. SSR mantido para SEO.
 *
 * Motion principle (Emil - performance): lazy load de codigo nao critico.
 */
const ProdutoDetalhe = dynamic(
  () =>
    import("@/components/loja/produto-detalhe").then((m) => m.ProdutoDetalhe),
  {
    ssr: true,
    loading: () => <ProdutoDetalheSkeleton />,
  },
);

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const produto = await obterProdutoPorSlug(params.slug);
  if (!produto) return { title: "Produto não encontrado" };
  return {
    title: produto.nome,
    description:
      produto.descricao ??
      `${produto.nome} na Agro Baito. Entrega em Porto Belo.`,
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: { slug: string };
}) {
  const produto = await obterProdutoPorSlug(params.slug);
  if (!produto) notFound();

  return <ProdutoDetalhe produto={produto} />;
}
