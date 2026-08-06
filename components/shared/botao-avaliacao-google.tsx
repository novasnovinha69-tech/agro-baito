import { LOJA } from "@/lib/loja-config";

/**
 * Botão oficial de avaliação no Google.
 * Mostra o logo do Google + 5 estrelas + texto "Avaliar no Google".
 *
 * O link vem de LOJA.linkAvaliacaoGoogle (configurável em lib/loja-config.ts).
 * Substitua pelo link real do Google Meu Negócio quando disponível.
 */
export function BotaoAvaliacaoGoogle({
  variant = "compacto",
  className = "",
}: {
  variant?: "compacto" | "cheio";
  className?: string;
}) {
  const href = LOJA.linkAvaliacaoGoogle ?? "#";

  if (variant === "compacto") {
    // Versão compacta (ícone no header)
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label="Avaliar no Google"
        title="Avaliar no Google"
        className={className}
      >
        <GoogleLogo className="h-6 w-6" />
      </a>
    );
  }

  // Versão cheia (card no checkout/rodapé)
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <GoogleLogo className="h-8 w-8 shrink-0" />
      <div className="flex flex-col">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Estrela key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-sm font-semibold text-gray-800">
          Avaliar no Google
        </span>
      </div>
    </a>
  );
}

/** Logo do Google (SVG oficial com as 4 cores) */
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/** Estrela amarela */
function Estrela({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
