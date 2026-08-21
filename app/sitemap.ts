import type { MetadataRoute } from "next";
import { listarCategorias, listarProdutos } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agora = new Date();

  const rotasEstaticas: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: agora,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/catalogo`,
      lastModified: agora,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/carrinho`,
      changeFrequency: "weekly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/institucional`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const [categorias, produtos] = await Promise.all([
      listarCategorias(),
      listarProdutos({}),
    ]);

    const urlsCategorias: MetadataRoute.Sitemap = categorias.map((c) => ({
      url: `${SITE_URL}/categoria/${c.slug}`,
      lastModified: agora,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const urlsProdutos: MetadataRoute.Sitemap = produtos.map((p) => ({
      url: `${SITE_URL}/produto/${p.slug}`,
      lastModified: agora,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...rotasEstaticas, ...urlsCategorias, ...urlsProdutos];
  } catch (err) {
    console.error("[sitemap] falha ao listar dados, sitemap parcial:", err);
    return rotasEstaticas;
  }
}
