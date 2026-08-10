"use client";

import { ImageIcon, Loader2, Save, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { isSupabaseConfigured } from "@/lib/carrinho";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Categoria } from "@/types/database.types";

type ProdutoForm = {
  id?: string;
  nome: string;
  slug: string;
  descricao: string | null;
  preco_cents: number;
  preco_promocional_cents: number | null;
  categoria_id: string;
  preco_por_kg: boolean;
  peso_kg: number | null;
  unidade_medida: string;
  estoque: number;
  estoque_minimo: number;
  qtd_minima: number;
  multiplo: number;
  foto_url: string | null;
  destaque: boolean;
  ativo: boolean;
};

export function ProdutoForm({
  produto,
  categorias,
}: {
  produto: ProdutoForm | null;
  categorias: Categoria[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [salvando, setSalvando] = useState(false);
  const [subindoFoto, setSubindoFoto] = useState(false);
  const [previewFoto, setPreviewFoto] = useState<string | null>(
    produto?.foto_url ?? null,
  );
  const configurado = isSupabaseConfigured();

  const [form, setForm] = useState<ProdutoForm>({
    id: produto?.id,
    nome: produto?.nome ?? "",
    slug: produto?.slug ?? "",
    descricao: produto?.descricao ?? "",
    preco_cents: produto?.preco_cents ?? 0,
    preco_promocional_cents: produto?.preco_promocional_cents ?? null,
    categoria_id: produto?.categoria_id ?? categorias[0]?.id ?? "",
    preco_por_kg: produto?.preco_por_kg ?? false,
    peso_kg: produto?.peso_kg ?? null,
    unidade_medida: produto?.unidade_medida ?? "un",
    estoque: produto?.estoque ?? 0,
    estoque_minimo: produto?.estoque_minimo ?? 5,
    qtd_minima: produto?.qtd_minima ?? 1,
    multiplo: produto?.multiplo ?? 1,
    foto_url: produto?.foto_url ?? null,
    destaque: produto?.destaque ?? false,
    ativo: produto?.ativo ?? true,
  });

  // Gera slug automaticamente a partir do nome (se slug vazio)
  useEffect(() => {
    if (!form.slug && form.nome) {
      const slug = form.nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setForm((f) => ({ ...f, slug }));
    }
  }, [form.nome]); // eslint-disable-line react-hooks/exhaustive-deps

  function atualizar<K extends keyof ProdutoForm>(
    campo: K,
    valor: ProdutoForm[K],
  ) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  // ====== UPLOAD DE FOTO ======
  async function handleFoto(file: File) {
    // Validações
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo de 5MB.");
      return;
    }

    // Preview imediato
    const previewUrl = URL.createObjectURL(file);
    setPreviewFoto(previewUrl);

    // Em modo demo, não sobe para o storage (mantém só o preview)
    if (!configurado) {
      toast.info(
        "Modo demo: a foto não é salva. Conecte o Supabase para salvar de verdade.",
      );
      return;
    }

    setSubindoFoto(true);
    try {
      const sb = createSupabaseBrowserClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const nomeArquivo = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;
      const caminho = `produtos/${nomeArquivo}`;

      const { error: uploadError } = await sb.storage
        .from("produtos")
        .upload(caminho, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = sb.storage.from("produtos").getPublicUrl(caminho);
      atualizar("foto_url", data.publicUrl);
      toast.success("Foto enviada com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar foto.");
      setPreviewFoto(produto?.foto_url ?? null);
    } finally {
      setSubindoFoto(false);
    }
  }

  async function removerFoto() {
    setPreviewFoto(null);
    atualizar("foto_url", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ====== SALVAR ======
  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);

    try {
      // Validações básicas
      if (!form.nome.trim()) throw new Error("Informe o nome do produto.");
      if (form.preco_cents <= 0) throw new Error("Informe um preço válido.");
      if (!form.categoria_id) throw new Error("Selecione uma categoria.");

      if (!configurado) {
        toast.info(
          "Modo demo: alterações não são salvas. Conecte o Supabase para salvar.",
        );
        router.push("/admin/produtos");
        return;
      }

      const sb = createSupabaseBrowserClient();
      const dados = {
        ...form,
        peso_kg: form.preco_por_kg ? form.peso_kg : null,
      };

      if (form.id) {
        // Atualizar
        const { id: _id, ...paraUpdate } = dados;
        const { error } = await sb
          .from("produtos")
          .update(paraUpdate as never)
          .eq("id", form.id);
        if (error) throw error;
        toast.success("Produto atualizado!");
      } else {
        // Criar
        const { id: _id, ...paraInsert } = dados;
        const { error } = await sb.from("produtos").insert(paraInsert as never);
        if (error) throw error;
        toast.success("Produto cadastrado!");
      }
      router.push("/admin/produtos");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={salvar} className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-agro-navy">
          {produto ? "Editar produto" : "Novo produto"}
        </h1>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/produtos")}
          >
            <X className="h-4 w-4" /> Cancelar
          </Button>
          <Button type="submit" disabled={salvando}>
            {salvando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* ===== Coluna principal ===== */}
        <div className="space-y-5">
          {/* Dados básicos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do produto *</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  onChange={(e) => atualizar("nome", e.target.value)}
                  placeholder="Ex: Ração Premier Cães Adultos 15kg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <textarea
                  id="descricao"
                  value={form.descricao ?? ""}
                  onChange={(e) => atualizar("descricao", e.target.value)}
                  placeholder="Descreva o produto..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <select
                    id="categoria"
                    value={form.categoria_id}
                    onChange={(e) => atualizar("categoria_id", e.target.value)}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade de medida</Label>
                  <select
                    id="unidade"
                    value={form.unidade_medida}
                    onChange={(e) =>
                      atualizar("unidade_medida", e.target.value)
                    }
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="un">Unidade (un)</option>
                    <option value="kg">Quilo (kg)</option>
                    <option value="lt">Litro (lt)</option>
                    <option value="ml">Mililitro (ml)</option>
                    <option value="cx">Caixa (cx)</option>
                    <option value="pct">Pacote (pct)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preço */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="preco">
                    Preço (R$) *{" "}
                    <span className="text-xs text-muted-foreground">
                      — use vírgula
                    </span>
                  </Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    min="0"
                    value={
                      form.preco_cents
                        ? (form.preco_cents / 100).toString()
                        : ""
                    }
                    onChange={(e) =>
                      atualizar(
                        "preco_cents",
                        Math.round(parseFloat(e.target.value || "0") * 100),
                      )
                    }
                    placeholder="0,00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preco-promo">
                    Preço promocional (R$){" "}
                    <span className="text-xs text-muted-foreground">
                      — opcional
                    </span>
                  </Label>
                  <Input
                    id="preco-promo"
                    type="number"
                    step="0.01"
                    min="0"
                    value={
                      form.preco_promocional_cents
                        ? (form.preco_promocional_cents / 100).toString()
                        : ""
                    }
                    onChange={(e) =>
                      atualizar(
                        "preco_promocional_cents",
                        e.target.value
                          ? Math.round(parseFloat(e.target.value) * 100)
                          : null,
                      )
                    }
                    placeholder="0,00"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.preco_por_kg}
                  onChange={(e) => atualizar("preco_por_kg", e.target.checked)}
                />
                Vendido por peso (mostrar preço por kg/litro)
              </label>

              {form.preco_por_kg && (
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.001"
                    min="0"
                    value={form.peso_kg ?? ""}
                    onChange={(e) =>
                      atualizar(
                        "peso_kg",
                        e.target.value ? parseFloat(e.target.value) : null,
                      )
                    }
                    placeholder="Ex: 15"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estoque */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Estoque</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="estoque">Quantidade</Label>
                <Input
                  id="estoque"
                  type="number"
                  min="0"
                  value={form.estoque}
                  onChange={(e) =>
                    atualizar("estoque", parseInt(e.target.value || "0"))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoque-min">
                  Estoque mínimo{" "}
                  <span className="text-xs text-muted-foreground">
                    — alerta
                  </span>
                </Label>
                <Input
                  id="estoque-min"
                  type="number"
                  min="0"
                  value={form.estoque_minimo}
                  onChange={(e) =>
                    atualizar("estoque_minimo", parseInt(e.target.value || "0"))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qtd-min">Qtd. mínima</Label>
                <Input
                  id="qtd-min"
                  type="number"
                  min="1"
                  value={form.qtd_minima}
                  onChange={(e) =>
                    atualizar("qtd_minima", parseInt(e.target.value || "1"))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="multiplo">Múltiplo de</Label>
                <Input
                  id="multiplo"
                  type="number"
                  min="1"
                  value={form.multiplo}
                  onChange={(e) =>
                    atualizar("multiplo", parseInt(e.target.value || "1"))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== Coluna lateral ===== */}
        <div className="space-y-5">
          {/* UPLOAD DE FOTO — a parte que você perguntou! */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Foto do produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Preview / Dropzone */}
              <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-dashed bg-muted">
                {previewFoto ? (
                  <>
                    <Image
                      src={previewFoto}
                      alt="Preview"
                      fill
                      sizes="280px"
                      className="object-cover"
                      unoptimized={previewFoto.startsWith("blob:")}
                    />
                    <button
                      type="button"
                      onClick={removerFoto}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-destructive"
                      aria-label="Remover foto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    {subindoFoto ? (
                      <Loader2 className="h-10 w-10 animate-spin" />
                    ) : (
                      <ImageIcon className="h-10 w-10" />
                    )}
                    <span className="text-sm font-medium">
                      {subindoFoto ? "Enviando..." : "Clique para escolher"}
                    </span>
                    <span className="text-xs">JPG, PNG ou WebP · máx 5MB</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFoto(f);
                }}
              />

              {previewFoto && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" /> Trocar foto
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Opções */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Opções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.destaque}
                  onChange={(e) => atualizar("destaque", e.target.checked)}
                />
                Produto em destaque (aparece na home)
              </label>
              <Separator />
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(e) => atualizar("ativo", e.target.checked)}
                />
                Produto ativo (visível no site)
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
