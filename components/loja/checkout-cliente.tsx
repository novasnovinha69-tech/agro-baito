"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  MapPin,
  Search,
  Truck,
  Store,
  CreditCard,
  Loader2,
  CheckCircle2,
  Navigation,
  AlertCircle,
  Clock,
  MessageCircle,
  Copy,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCarrinho } from "@/lib/store/carrinho";
import { formatBRL, maskCEP, maskPhone, maskCpfCnpj } from "@/lib/money";
import type { UnidadeComZonas } from "@/lib/data";
import type { ZonaEntrega } from "@/types/database.types";
import { casarZonaPorEndereco, buscarCep } from "@/lib/cep";
import { FRETE_GRATIS_MIN_CENTS } from "@/lib/frete";
import { LOJA, linkWhatsApp } from "@/lib/loja-config";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { BotaoAvaliacaoGoogle } from "@/components/shared/botao-avaliacao-google";

type Props = {
  unidades: UnidadeComZonas[];
};

type EnderecoForm = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  referencia: string;
};

export function CheckoutCliente({ unidades }: Props) {
  const router = useRouter();
  const { itens, subtotalCents, limpar } = useCarrinho();
  const subtotal = subtotalCents();

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [endereco, setEndereco] = useState<EnderecoForm>({
    cep: "", logradouro: "", numero: "", complemento: "",
    bairro: "", cidade: "", uf: "", referencia: "",
  });

  // Cliente
  const [cliente, setCliente] = useState({
    nome: "", telefone: "", email: "", cpfCnpj: "",
  });

  // Entrega
  const [tipoEntrega, setTipoEntrega] = useState<"retirada" | "entrega" | null>(null);
  const [unidadeRetiradaId, setUnidadeRetiradaId] = useState<string>("");
  const [zonaSelecionadaId, setZonaSelecionadaId] = useState<string>("");
  const [zonaSugerida, setZonaSugerida] = useState<ZonaEntrega | null>(null);

  // Pagamento
  type MetodoPagamento = "pix" | "whatsapp" | "nao_loja";
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>("pix");
  const [criandoPedido, setCriandoPedido] = useState(false);
  const [pixGerado, setPixGerado] = useState<{
    qrCode: string;
    qrCodeBase64: string | null;
    pedidoCodigo: string;
    pedidoToken: string;
  } | null>(null);
  const [pixCopiado, setPixCopiado] = useState(false);

  // Tudo de zonas disponíveis numa lista plana
  const todasZonas: ZonaEntrega[] = unidades.flatMap((u) => u.zonas);

  // Sugere zona automaticamente quando o endereço muda
  useEffect(() => {
    if (tipoEntrega !== "entrega") return;
    if (!endereco.bairro && !endereco.cidade) {
      setZonaSugerida(null);
      return;
    }
    const match = casarZonaPorEndereco(
      { bairro: endereco.bairro, localidade: endereco.cidade },
      todasZonas,
    );
    if (match) {
      const z = todasZonas.find((x) => x.id === match.id);
      if (z) {
        setZonaSugerida(z);
        setZonaSelecionadaId(z.id);
        return;
      }
    }
    setZonaSugerida(null);
  }, [endereco.bairro, endereco.cidade, tipoEntrega]); // eslint-disable-line

  const zona = todasZonas.find((z) => z.id === zonaSelecionadaId);
  const ganhouFreteGratis =
    subtotal >= FRETE_GRATIS_MIN_CENTS && tipoEntrega === "entrega";
  const freteCents =
    zona && !ganhouFreteGratis
      ? Math.round((subtotal * Number(zona.frete_percentual)) / 100)
      : 0;
  const totalCents = subtotal + (ganhouFreteGratis ? 0 : freteCents);

  // ===== Buscar CEP =====
  async function handleBuscarCep(cep: string) {
    const limpo = cep.replace(/\D/g, "");
    if (limpo.length !== 8) return;
    setBuscandoCep(true);
    const data = await buscarCep(limpo);
    setBuscandoCep(false);
    if (!data) {
      toast.error("CEP não encontrado. Verifique ou preencha manualmente.");
      return;
    }
    setEndereco((e) => ({
      ...e,
      cep: data.cep.replace("-", ""),
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf,
      complemento: data.complemento,
    }));
    toast.success(`Endereço: ${data.localidade}/${data.uf}`);
  }

  // ===== Validação comum =====
  function validarPedido(): boolean {
    if (!cliente.nome || !cliente.telefone) {
      toast.error("Preencha nome e telefone.");
      return false;
    }
    if (!tipoEntrega) {
      toast.error("Escolha retirada ou entrega.");
      return false;
    }
    if (tipoEntrega === "entrega" && !zona) {
      toast.error("Selecione uma zona de entrega válida.");
      return false;
    }
    if (tipoEntrega === "entrega" && (!endereco.cep || !endereco.numero)) {
      toast.error("Preencha CEP e número do endereço.");
      return false;
    }
    if (tipoEntrega === "retirada" && !unidadeRetiradaId) {
      toast.error("Escolha a loja para retirada.");
      return false;
    }
    return true;
  }

  // ===== Monta a mensagem de WhatsApp com o pedido completo =====
  function montarMensagemWhatsApp(): string {
    const linhas: string[] = [];
    linhas.push("🛒 *NOVO PEDIDO* 🛒");
    linhas.push("");
    linhas.push("👤 *CLIENTE*");
    linhas.push(`Nome: ${cliente.nome}`);
    linhas.push(`Telefone: ${cliente.telefone}`);
    if (cliente.cpfCnpj) linhas.push(`CPF/CNPJ: ${cliente.cpfCnpj}`);
    if (cliente.email) linhas.push(`E-mail: ${cliente.email}`);
    linhas.push("");
    linhas.push("📦 *ITENS*");
    itens.forEach((i, idx) => {
      linhas.push(
        `${idx + 1}. ${i.nome}`,
      );
      linhas.push(
        `   ${i.quantidade}x ${formatBRL(i.precoCents)} = ${formatBRL(i.precoCents * i.quantidade)}`,
      );
    });
    linhas.push("");
    linhas.push(`Subtotal: ${formatBRL(subtotal)}`);
    linhas.push("");
    linhas.push("🚚 *ENTREGA*");
    if (tipoEntrega === "retirada") {
      const uni = unidades.find((u) => u.id === unidadeRetiradaId);
      linhas.push("Tipo: Retirada na loja");
      linhas.push(`Loja: ${uni?.nome ?? "-"}`);
      linhas.push(`Frete: GRÁTIS`);
    } else if (zona) {
      linhas.push("Tipo: Entrega");
      linhas.push(`Zona: ${zona.nome}`);
      linhas.push(
        `Endereço: ${endereco.logradouro}, ${endereco.numero}${endereco.complemento ? ` - ${endereco.complemento}` : ""}`,
      );
      linhas.push(`Bairro: ${endereco.bairro}`);
      linhas.push(`Cidade: ${endereco.cidade}/${endereco.uf}`);
      linhas.push(`CEP: ${endereco.cep}`);
      if (endereco.referencia) linhas.push(`Referência: ${endereco.referencia}`);
      linhas.push(
        `Frete: ${ganhouFreteGratis ? "GRÁTIS (acima de R$1.000)" : formatBRL(freteCents)}`,
      );
      linhas.push(`Prazo: ${zona.prazo_horas}h`);
    }
    linhas.push("");
    linhas.push(`💰 *TOTAL: ${formatBRL(totalCents)}*`);
    linhas.push("");
    linhas.push("💳 Pagamento: a combinar");
    return linhas.join("\n");
  }

  // ===== Enviar pedido por WhatsApp =====
  // Lógica: usa o WhatsApp da loja certa conforme a escolha do cliente.
  //  - Retirada: número da loja selecionada (Perequê, Bombas ou Meia Praia)
  //  - Entrega: número da unidade responsável pela zona de entrega
  //  - Fallback: número principal (Perequê)
  function enviarPorWhatsApp() {
    if (!validarPedido()) return;
    const msg = montarMensagemWhatsApp();

    // Descobre qual número de WhatsApp usar
    let numeroWhats: string = LOJA.whatsappNumero; // padrão (Perequê)
    if (tipoEntrega === "retirada") {
      const uni = unidades.find((u) => u.id === unidadeRetiradaId);
      if (uni?.whatsapp) numeroWhats = uni.whatsapp;
    } else if (zona) {
      // Acha a unidade dona da zona selecionada
      const uniZona = unidades.find((u) =>
        u.zonas.some((z) => z.id === zonaSelecionadaId),
      );
      if (uniZona?.whatsapp) numeroWhats = uniZona.whatsapp;
    }

    const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    toast.success("Abrindo WhatsApp com seu pedido...");
    // Marca como confirmado e limpa o carrinho
    setPedidoConfirmado(true);
    setTimeout(() => limpar(), 500);
  }

  // ===== Estado de pedido confirmado (mostra tela de sucesso) =====
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);

  // ===== Finalizar — mostra tela de sucesso e limpa carrinho =====
  function finalizar() {
    if (!validarPedido()) return;
    setPedidoConfirmado(true);
    setTimeout(() => limpar(), 500);
  }

  // ===== Finalizar com Pix (cria pedido + gera QR Code) =====
  async function finalizarComPix() {
    if (!validarPedido()) return;
    setCriandoPedido(true);
    setPixGerado(null);
    try {
      const resp = await fetch("/api/checkout/criar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itens: itens.map((i) => ({
            produtoId: i.produtoId,
            nome: i.nome,
            precoCents: i.precoCents,
            quantidade: i.quantidade,
            pesoKg: i.pesoKg,
            unidadeMedida: i.unidadeMedida,
          })),
          cliente: {
            nome: cliente.nome,
            telefone: cliente.telefone,
            email: cliente.email || undefined,
            cpfCnpj: cliente.cpfCnpj || undefined,
          },
          entrega: {
            tipo: tipoEntrega,
            zonaId: zonaSelecionadaId || null,
            unidadeId: unidadeRetiradaId || null,
            endereco:
              tipoEntrega === "entrega"
                ? {
                    cep: endereco.cep,
                    logradouro: endereco.logradouro,
                    numero: endereco.numero,
                    complemento: endereco.complemento,
                    bairro: endereco.bairro,
                    cidade: endereco.cidade,
                    uf: endereco.uf,
                    referencia: endereco.referencia,
                  }
                : null,
          },
          pagamento: { metodo: "pix" },
          valores: {
            subtotalCents: subtotal,
            freteCents: tipoEntrega === "retirada" ? 0 : freteCents,
            totalCents: tipoEntrega === "retirada" ? subtotal : totalCents,
          },
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.erro ?? "Erro ao criar pedido");
      }
      if (data.pix?.qrCode) {
        setPixGerado({
          qrCode: data.pix.qrCode,
          qrCodeBase64: data.pix.qrCodeBase64,
          pedidoCodigo: data.pedido.codigo,
          pedidoToken: data.pedido.token,
        });
        toast.success(`Pedido ${data.pedido.codigo} criado! Pague o Pix para confirmar.`);
      } else {
        // Pix indisponivel — fallback para sucesso via WhatsApp
        toast.info(data.aviso ?? "Pix indisponivel. Use o WhatsApp.");
        setPedidoConfirmado(true);
        setTimeout(() => limpar(), 500);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao processar pedido.",
      );
    } finally {
      setCriandoPedido(false);
    }
  }

  // ===== Copiar QR Code (copia e cola) =====
  function copiarQrCode() {
    if (!pixGerado) return;
    navigator.clipboard.writeText(pixGerado.qrCode);
    setPixCopiado(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setPixCopiado(false), 2000);
  }

  // ===== Tela de QR Code Pix (aguardando pagamento) =====
  if (pixGerado) {
    return (
      <div className="container-agro py-12">
        <div className="mx-auto max-w-md rounded-2xl border-2 border-agro-blue/30 bg-agro-blue/5 p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-agro-blue">
            <QrCode className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-agro-navy">
            Pague com Pix para confirmar
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pedido <strong>{pixGerado.pedidoCodigo}</strong> · {formatBRL(tipoEntrega === "retirada" ? subtotal : totalCents)}
          </p>

          {/* QR Code imagem */}
          {pixGerado.qrCodeBase64 && (
            <div className="mt-5 grid place-items-center">
              <img
                src={`data:image/png;base64,${pixGerado.qrCodeBase64}`}
                alt="QR Code Pix"
                className="rounded-lg border bg-white p-3"
                width={240}
                height={240}
              />
            </div>
          )}

          {/* Copia e cola */}
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-semibold uppercase text-muted-foreground">
              Pix Copia e Cola
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-md border bg-background px-3 py-2 text-xs">
                {pixGerado.qrCode}
              </code>
              <Button
                type="button"
                variant={pixCopiado ? "accent" : "outline"}
                size="icon"
                onClick={copiarQrCode}
                aria-label="Copiar código Pix"
              >
                {pixCopiado ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              O QR Code expira em 30 minutos. Após o pagamento, a confirmação é
              automática.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href={`/conta/pedidos/${pixGerado.pedidoToken}`}>
                Acompanhar meu pedido
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setPixGerado(null);
                setPedidoConfirmado(true);
                setTimeout(() => limpar(), 500);
              }}
            >
              Já paguei / voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ===== Tela de pedido confirmado =====
  if (pedidoConfirmado) {
    return (
      <div className="container-agro py-12">
        <div className="mx-auto max-w-lg rounded-2xl border-2 border-agro-green/30 bg-agro-green/5 p-8 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-agro-green">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-agro-navy">
            Pedido confirmado! 🎉
          </h2>
          <p className="mt-2 text-muted-foreground">
            Recebemos seu pedido e em breve nossa equipe entrará em contato pelo
            WhatsApp para confirmar os detalhes e o prazo de entrega.
          </p>

          <div className="mt-5 rounded-lg bg-white p-4 text-left text-sm">
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-agro-green" />
              <span>
                <strong>Atendimento:</strong> {LOJA.horarioAtendimento}
              </span>
            </p>
            <p className="mt-2 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-whatsapp" />
              <span>
                Dúvidas? Fale com a gente pelo WhatsApp de qualquer uma das nossas
                3 lojas.
              </span>
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild variant="whatsapp">
              <a
                href={`https://wa.me/${LOJA.whatsappNumero}?text=${encodeURIComponent("Olá! Acabei de fazer um pedido pelo site e gostaria de confirmar.")}`}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/catalogo">Continuar comprando</Link>
            </Button>
          </div>

          {/* Avaliação no Google */}
          <div className="mt-5">
            <BotaoAvaliacaoGoogle variant="cheio" className="w-full justify-center" />
          </div>
        </div>
      </div>
    );
  }

  // ===== Carrinho vazio =====
  if (itens.length === 0) {
    return (
      <div className="container-agro py-12 text-center">
        <p>Seu carrinho está vazio.</p>
        <Button asChild className="mt-3">
          <a href="/catalogo">Ver catálogo</a>
        </Button>
      </div>
    );
  }

  // URL do mapa (Google Maps embed sem chave)
  const enderecoMapa = [
    endereco.logradouro,
    endereco.numero,
    endereco.bairro,
    endereco.cidade,
    endereco.uf,
  ].filter(Boolean).join(", ");
  const mapaUrl = enderecoMapa
    ? `https://maps.google.com/maps?q=${encodeURIComponent(enderecoMapa)}&z=15&output=embed`
    : null;

  return (
    <div className="container-agro py-6">
      <h1 className="mb-3 font-display text-2xl font-bold text-agro-navy">
        Finalizar compra
      </h1>

      {/* Banner: frete grátis acima de R$1.000 */}
      {ganhouFreteGratis ? (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-agro-emerald/15 px-4 py-2.5 text-sm font-semibold text-agro-emerald-dark">
          🎉 <span>Parabéns! Você ganhou <strong>FRETE GRÁTIS</strong> (pedido acima de R$1.000)</span>
        </div>
      ) : (
        <div className="mb-4 flex items-center justify-between gap-2 rounded-lg bg-agro-blue/10 px-4 py-2.5 text-sm text-agro-blue">
          <span>🚚 Faltam <strong>{formatBRL(FRETE_GRATIS_MIN_CENTS - subtotal)}</strong> para você ganhar <strong>FRETE GRÁTIS</strong></span>
          <a href="/catalogo" className="shrink-0 font-semibold underline">Comprar mais</a>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* ===== COLUNA PRINCIPAL ===== */}
        <div className="space-y-5">
          {/* 1. Dados do cliente */}
          <Card>
            <CardContent className="space-y-4 p-5">
              <h2 className="flex items-center gap-2 font-display text-base font-bold">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-agro-blue text-xs text-white">1</span>
                Seus dados
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="nome">Nome completo *</Label>
                  <Input
                    id="nome"
                    value={cliente.nome}
                    onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
                    placeholder="Ex: João da Silva"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tel">WhatsApp / Telefone *</Label>
                  <Input
                    id="tel"
                    value={cliente.telefone}
                    onChange={(e) =>
                      setCliente({ ...cliente, telefone: maskPhone(e.target.value) })
                    }
                    placeholder="(47) 99999-9999"
                    inputMode="tel"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cpf">CPF / CNPJ</Label>
                  <Input
                    id="cpf"
                    value={cliente.cpfCnpj}
                    onChange={(e) =>
                      setCliente({ ...cliente, cpfCnpj: maskCpfCnpj(e.target.value) })
                    }
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="email">E-mail (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cliente.email}
                    onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Entrega */}
          <Card>
            <CardContent className="space-y-4 p-5">
              <h2 className="flex items-center gap-2 font-display text-base font-bold">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-agro-blue text-xs text-white">2</span>
                Entrega ou retirada
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setTipoEntrega("retirada");
                    setZonaSelecionadaId("");
                  }}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                    tipoEntrega === "retirada"
                      ? "border-agro-blue bg-agro-blue/5 ring-1 ring-agro-blue"
                      : "hover:border-agro-blue/50"
                  }`}
                >
                  <Store className="h-6 w-6 text-agro-blue" />
                  <div>
                    <p className="text-sm font-semibold">Retirar na loja</p>
                    <p className="text-xs text-muted-foreground">Grátis · pronto em ~1h</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setTipoEntrega("entrega")}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                    tipoEntrega === "entrega"
                      ? "border-agro-blue bg-agro-blue/5 ring-1 ring-agro-blue"
                      : "hover:border-agro-blue/50"
                  }`}
                >
                  <Truck className="h-6 w-6 text-agro-blue" />
                  <div>
                    <p className="text-sm font-semibold">Receber em casa</p>
                    <p className="text-xs text-muted-foreground">Frete por zona</p>
                  </div>
                </button>
              </div>

              {/* Retirada: escolher unidade */}
              {tipoEntrega === "retirada" && (
                <div className="space-y-1.5">
                  <Label>Escolha a loja para retirada</Label>
                  <select
                    className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                    value={unidadeRetiradaId}
                    onChange={(e) => setUnidadeRetiradaId(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {unidades.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome} — {u.endereco}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Entrega: endereço + CEP + mapa */}
              {tipoEntrega === "entrega" && (
                <div className="space-y-3">
                  {/* CEP com busca */}
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <div className="space-y-1.5">
                      <Label htmlFor="cep">CEP *</Label>
                      <div className="relative">
                        <Input
                          id="cep"
                          value={maskCEP(endereco.cep)}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "");
                            setEndereco({ ...endereco, cep: v });
                          }}
                          onBlur={(e) => handleBuscarCep(e.target.value)}
                          placeholder="00000-000"
                          inputMode="numeric"
                        />
                        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-6"
                      onClick={() => handleBuscarCep(endereco.cep)}
                      disabled={buscandoCep || endereco.cep.length !== 8}
                    >
                      {buscandoCep ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      Buscar
                    </Button>
                  </div>

                  {(endereco.logradouro || endereco.cidade) && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="rua">Rua / Logradouro</Label>
                        <Input
                          id="rua"
                          value={endereco.logradouro}
                          onChange={(e) =>
                            setEndereco({ ...endereco, logradouro: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="numero">Número *</Label>
                        <Input
                          id="numero"
                          value={endereco.numero}
                          onChange={(e) =>
                            setEndereco({ ...endereco, numero: e.target.value })
                          }
                          placeholder="123"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="comp">Complemento</Label>
                        <Input
                          id="comp"
                          value={endereco.complemento}
                          onChange={(e) =>
                            setEndereco({ ...endereco, complemento: e.target.value })
                          }
                          placeholder="Apto, bloco..."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input
                          id="bairro"
                          value={endereco.bairro}
                          onChange={(e) =>
                            setEndereco({ ...endereco, bairro: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          value={endereco.cidade}
                          onChange={(e) =>
                            setEndereco({ ...endereco, cidade: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="ref">Ponto de referência</Label>
                        <Input
                          id="ref"
                          value={endereco.referencia}
                          onChange={(e) =>
                            setEndereco({ ...endereco, referencia: e.target.value })
                          }
                          placeholder="Próximo a..., portão azul..."
                        />
                      </div>
                    </div>
                  )}

                  {/* MAPA embedado */}
                  {mapaUrl && (
                    <div className="overflow-hidden rounded-lg border">
                      <div className="flex items-center gap-2 bg-muted px-3 py-2 text-xs text-muted-foreground">
                        <Navigation className="h-3.5 w-3.5" />
                        Localização no mapa
                      </div>
                      <iframe
                        src={mapaUrl}
                        className="h-64 w-full"
                        loading="lazy"
                        title="Mapa do endereço"
                      />
                    </div>
                  )}

                  {/* Zona sugerida / seleção manual */}
                  <Separator />
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> Zona de entrega
                    </Label>

                    {zonaSugerida ? (
                      <div className="flex items-start gap-2 rounded-lg bg-agro-emerald/10 p-3 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-agro-emerald" />
                        <div>
                          <p className="font-medium">
                            Zona detectada: {zonaSugerida.nome}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Frete {Number(zonaSugerida.frete_percentual)}% · prazo{" "}
                            {zonaSugerida.prazo_horas}h
                          </p>
                        </div>
                      </div>
                    ) : endereco.cidade ? (
                      <div className="flex items-start gap-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                          <p className="font-medium">
                            Não atendemos entrega em {endereco.cidade} ainda.
                          </p>
                          <p className="text-xs">
                            Você pode escolher retirada na loja ou selecionar a
                            zona mais próxima abaixo.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Preencha o CEP para detectar a zona automaticamente.
                      </p>
                    )}

                    {/* Seletor manual de zona */}
                    <select
                      className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                      value={zonaSelecionadaId}
                      onChange={(e) => setZonaSelecionadaId(e.target.value)}
                    >
                      <option value="">
                        {zonaSugerida ? "Trocar de zona..." : "Selecione uma zona..."}
                      </option>
                      {unidades.flatMap((u) =>
                        u.zonas
                          .filter((z) => z.tipo !== "retirada")
                          .map((z) => (
                            <option key={z.id} value={z.id}>
                              {u.nome.split("—")[1]?.trim() ?? u.nome} · {z.nome} ·{" "}
                              {Number(z.frete_percentual)}% · {z.prazo_horas}h
                            </option>
                          )),
                      )}
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Pagamento */}
          <Card>
            <CardContent className="space-y-3 p-5">
              <h2 className="flex items-center gap-2 font-display text-base font-bold">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-agro-blue text-xs text-white">3</span>
                Pagamento
              </h2>

              {/* Seletor de metodo */}
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => setMetodoPagamento("pix")}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                    metodoPagamento === "pix"
                      ? "border-agro-blue bg-agro-blue/5 ring-1 ring-agro-blue"
                      : "hover:border-agro-blue/50"
                  }`}
                >
                  <QrCode className="h-6 w-6 shrink-0 text-agro-blue" />
                  <div>
                    <p className="text-sm font-semibold">Pix — aprovação imediata</p>
                    <p className="text-xs text-muted-foreground">
                      Pague com QR Code. Confirmação automática.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoPagamento("whatsapp")}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                    metodoPagamento === "whatsapp"
                      ? "border-agro-blue bg-agro-blue/5 ring-1 ring-agro-blue"
                      : "hover:border-agro-blue/50"
                  }`}
                >
                  <MessageCircle className="h-6 w-6 shrink-0 text-whatsapp" />
                  <div>
                    <p className="text-sm font-semibold">Enviar pedido por WhatsApp</p>
                    <p className="text-xs text-muted-foreground">
                      Finaliza e abre o WhatsApp da loja com o pedido pronto.
                    </p>
                  </div>
                </button>

                {tipoEntrega === "retirada" && (
                  <button
                    type="button"
                    onClick={() => setMetodoPagamento("nao_loja")}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                      metodoPagamento === "nao_loja"
                        ? "border-agro-blue bg-agro-blue/5 ring-1 ring-agro-blue"
                        : "hover:border-agro-blue/50"
                    }`}
                  >
                    <Store className="h-6 w-6 shrink-0 text-agro-blue" />
                    <div>
                      <p className="text-sm font-semibold">Pagar na retirada</p>
                      <p className="text-xs text-muted-foreground">
                        Pix, cartão ou dinheiro ao buscar na loja.
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== COLUNA LATERAL — RESUMO ===== */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardContent className="p-5">
              <h2 className="font-display text-base font-bold">Seu pedido</h2>

              {/* Itens */}
              <div className="mt-3 max-h-60 space-y-2 overflow-y-auto">
                {itens.map((i) => (
                  <div key={i.produtoId} className="flex gap-2">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border bg-muted">
                      {i.fotoUrl && (
                        <Image
                          src={i.fotoUrl}
                          alt={i.nome}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{i.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.quantidade}x · {formatBRL(i.precoCents)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold">
                      {formatBRL(i.precoCents * i.quantidade)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-3" />

              {/* Totais */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Frete{" "}
                    {zona && !ganhouFreteGratis && (
                      <span className="text-xs">
                        ({Number(zona.frete_percentual)}% · {zona.nome})
                      </span>
                    )}
                  </span>
                  <span
                    className={
                      ganhouFreteGratis || freteCents === 0
                        ? "font-semibold text-agro-emerald"
                        : ""
                    }
                  >
                    {tipoEntrega === "retirada"
                      ? "Grátis"
                      : ganhouFreteGratis
                        ? "GRÁTIS 🎉"
                        : zona
                          ? formatBRL(freteCents)
                          : "—"}
                  </span>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex items-baseline justify-between">
                <span className="font-medium">Total</span>
                <span className="font-display text-xl font-bold text-agro-navy">
                  {formatBRL(tipoEntrega === "retirada" ? subtotal : totalCents)}
                </span>
              </div>
              {zona && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Entrega em até {zona.prazo_horas}h após confirmação
                </p>
              )}

              {/* Botao principal — muda conforme metodo de pagamento */}
              {metodoPagamento === "pix" && (
                <>
                  <Button
                    variant="accent"
                    className="mt-4 w-full"
                    size="lg"
                    onClick={finalizarComPix}
                    disabled={criandoPedido}
                  >
                    {criandoPedido ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <QrCode className="h-5 w-5" />
                    )}
                    {criandoPedido ? "Gerando Pix..." : "Pagar com Pix"}
                  </Button>
                  <p className="mt-1.5 text-center text-xs text-muted-foreground">
                    Gera o QR Code para pagamento imediato
                  </p>
                </>
              )}

              {metodoPagamento === "whatsapp" && (
                <>
                  <Button
                    variant="whatsapp"
                    className="mt-4 w-full"
                    size="lg"
                    onClick={enviarPorWhatsApp}
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Enviar pedido por WhatsApp
                  </Button>
                  <p className="mt-1.5 text-center text-xs text-muted-foreground">
                    Abre o WhatsApp da loja com seu pedido pronto pra enviar
                  </p>
                </>
              )}

              {metodoPagamento === "nao_loja" && (
                <>
                  <Button
                    className="mt-4 w-full"
                    size="lg"
                    onClick={finalizar}
                  >
                    <Store className="h-5 w-5" />
                    Confirmar pedido
                  </Button>
                  <p className="mt-1.5 text-center text-xs text-muted-foreground">
                    Pagamento na retirada na loja
                  </p>
                </>
              )}

              <div className="my-3 flex items-center gap-2">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">ou</span>
                <Separator className="flex-1" />
              </div>

              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={finalizar}
              >
                Confirmar sem pagamento online
              </Button>

              {/* Avaliação no Google (botão oficial) */}
              <div className="mt-3">
                <BotaoAvaliacaoGoogle variant="cheio" className="w-full justify-center" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
