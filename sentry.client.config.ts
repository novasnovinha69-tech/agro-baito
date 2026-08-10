import * as Sentry from "@sentry/nextjs";

/**
 * Config do Sentry para o BROWSER (client-side).
 *
 * Captura erros e performance automaticamente no cliente.
 * Se SENTRY_DSN nao estiver definida, o init e pulado (no-op) — nao
 * afeta desenvolvimento local nem build.
 */
export function register() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_RATE ?? 0.1),
    environment: process.env.NODE_ENV,
    // Repassa versao do app para correlacionar erros a releases
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    // FILTRO de ruido: nao enviar erros de extensao de navegador
    ignoreErrors: [
      "Non-Error promise rejection captured",
      "Hydration failed",
      // Erros comuns de rede que nao sao bugs nossos
      "Network request failed",
      "Load failed",
    ],
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}
