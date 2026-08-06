import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware que:
 *  1. Refresha a sessão do Supabase (cookies).
 *  2. Protege rotas /admin/* — exige usuário autenticado + role admin.
 *
 * Quando o Supabase não está configurado, libera tudo (modo demo/visual).
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const ehAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  // Sem Supabase configurado → modo visual: libera, mas avisa no admin.
  if (!url || !anon) {
    if (ehAdminRoute) {
      // Em modo demo, o admin funciona com dados mockados.
      return res;
    }
    return res;
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(
        cookiesToSet: Array<{
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }>,
      ) {
        cookiesToSet.forEach(({ name, value, options }) => {
          req.cookies.set(name, value);
          res.cookies.set(name, value, options as never);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protege /admin/*
  if (ehAdminRoute) {
    if (!user) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/entrar";
      loginUrl.searchParams.set("next", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    // valida role admin
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!admin) {
      const url = req.nextUrl.clone();
      url.pathname = "/entrar";
      url.searchParams.set("erro", "sem_permissao");
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
