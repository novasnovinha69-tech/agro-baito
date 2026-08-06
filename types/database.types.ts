// =============================================================================
//  Tipos do banco de dados (espelham o schema em supabase/migrations/0001_init.sql)
//  Gerenciado manualmente enquanto o projeto não está conectado ao Supabase CLI.
//  Para regenerar a partir do banco real: `npm run db:types`
// =============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: string;
          nome: string;
          slug: string;
          icone: string | null;
          ordem: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          slug: string;
          icone?: string | null;
          ordem?: number;
        };
        Update: Partial<Record<string, unknown>>;
      };

      produtos: {
        Row: {
          id: string;
          categoria_id: string;
          nome: string;
          slug: string;
          descricao: string | null;
          preco_cents: number;
          preco_promocional_cents: number | null;
          preco_por_kg: boolean;
          peso_kg: number | null;
          estoque: number;
          estoque_minimo: number;
          qtd_minima: number;
          multiplo: number;
          unidade_medida: string; // 'un', 'kg', 'lt', 'ml', 'cx', 'pct'
          foto_url: string | null;
          destaque: boolean;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          categoria_id: string;
          nome: string;
          slug: string;
          descricao?: string | null;
          preco_cents: number;
          preco_promocional_cents?: number | null;
          preco_por_kg?: boolean;
          peso_kg?: number | null;
          estoque: number;
          estoque_minimo?: number;
          qtd_minima?: number;
          multiplo?: number;
          unidade_medida?: string;
          foto_url?: string | null;
          destaque?: boolean;
          ativo?: boolean;
        };
        Update: Partial<Record<string, unknown>>;
      };

      unidades: {
        Row: {
          id: string;
          nome: string;
          slug: string;
          endereco: string | null;
          whatsapp: string | null;
          ativa: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          slug: string;
          endereco?: string | null;
          whatsapp?: string | null;
          ativa?: boolean;
        };
        Update: Partial<Record<string, unknown>>;
      };

      zonas_entrega: {
        Row: {
          id: string;
          unidade_id: string;
          nome: string;
          tipo: "retirada" | "bairro" | "cidade";
          valor: string; // nome do bairro/cidade p/ casar
          frete_percentual: number;
          prazo_horas: number;
          ativa: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          unidade_id: string;
          nome: string;
          tipo: "retirada" | "bairro" | "cidade";
          valor: string;
          frete_percentual?: number;
          prazo_horas?: number;
          ativa?: boolean;
        };
        Update: Partial<Record<string, unknown>>;
      };

      pedidos: {
        Row: {
          id: string;
          codigo: string; // AMA-0001
          cliente_nome: string;
          cliente_telefone: string;
          cliente_email: string | null;
          cliente_cpf_cnpj: string | null;
          subtotal_cents: number;
          frete_cents: number;
          total_cents: number;
          zona_id: string | null;
          unidade_id: string | null;
          tipo_entrega: "retirada" | "entrega";
          endereco: Json | null;
          status: StatusPedido;
          pagamento_id: string | null;
          pagamento_status: string | null;
          pix_qr_code: string | null;
          pix_qr_base64: string | null;
          pix_expira_em: string | null;
          observacoes: string | null;
          token_acesso: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          codigo?: string;
          cliente_nome: string;
          cliente_telefone: string;
          cliente_email?: string | null;
          cliente_cpf_cnpj?: string | null;
          subtotal_cents: number;
          frete_cents: number;
          total_cents: number;
          zona_id?: string | null;
          unidade_id?: string | null;
          tipo_entrega: "retirada" | "entrega";
          endereco?: Json | null;
          status?: StatusPedido;
          pagamento_id?: string | null;
          pagamento_status?: string | null;
          pix_qr_code?: string | null;
          pix_qr_base64?: string | null;
          pix_expira_em?: string | null;
          observacoes?: string | null;
          token_acesso?: string;
        };
        Update: Partial<Record<string, unknown>>;
      };

      pedido_itens: {
        Row: {
          id: string;
          pedido_id: string;
          produto_id: string;
          nome_snapshot: string;
          preco_cents_snapshot: number;
          quantidade: number;
          peso_kg: number | null;
          unidade_medida: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          pedido_id: string;
          produto_id: string;
          nome_snapshot: string;
          preco_cents_snapshot: number;
          quantidade: number;
          peso_kg?: number | null;
          unidade_medida?: string;
        };
        Update: Partial<Record<string, unknown>>;
      };

      status_historico: {
        Row: {
          id: string;
          pedido_id: string;
          status: StatusPedido;
          observacao: string | null;
          notificado_whatsapp: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          pedido_id: string;
          status: StatusPedido;
          observacao?: string | null;
          notificado_whatsapp?: boolean;
        };
        Update: Partial<Record<string, unknown>>;
      };

      admins: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          email: string;
          role: "admin" | "gerente";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nome: string;
          email: string;
          role?: "admin" | "gerente";
        };
        Update: Partial<Record<string, unknown>>;
      };

      config_loja: {
        Row: {
          chave: string;
          valor: string | null;
          updated_at: string;
        };
        Insert: {
          chave: string;
          valor?: string | null;
        };
        Update: {
          valor?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};

export type StatusPedido =
  | "pendente"
  | "aguardando_pagamento"
  | "confirmado"
  | "em_separacao"
  | "saiu_para_entrega"
  | "entregue"
  | "cancelado";

// =============================================================================
//  Aliases de conveniência — derivados do schema acima.
//  Permitem importar { Produto, Categoria, ... } diretamente.
// =============================================================================
export type Categoria = Database["public"]["Tables"]["categorias"]["Row"];
export type Produto = Database["public"]["Tables"]["produtos"]["Row"];
export type Unidade = Database["public"]["Tables"]["unidades"]["Row"];
export type ZonaEntrega =
  Database["public"]["Tables"]["zonas_entrega"]["Row"];
export type Pedido = Database["public"]["Tables"]["pedidos"]["Row"];
export type PedidoItem = Database["public"]["Tables"]["pedido_itens"]["Row"];
export type StatusHistorico =
  Database["public"]["Tables"]["status_historico"]["Row"];
export type Admin = Database["public"]["Tables"]["admins"]["Row"];
