import { AdminSidebar, AdminTopbar } from "@/components/admin/admin-sidebar";
import { getAdminAtual } from "@/lib/auth-server";
import { isSupabaseConfigured } from "@/lib/carrinho";

export const metadata = {
  title: "Painel Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Em modo demo, role fica null (mostra tudo). Em modo real, busca do banco.
  const admin = isSupabaseConfigured() ? await getAdminAtual() : null;
  const role = admin?.role ?? null;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar role={role} nome={admin?.nome} />
      <div className="flex flex-1 flex-col">
        <AdminTopbar role={role} nome={admin?.nome} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
