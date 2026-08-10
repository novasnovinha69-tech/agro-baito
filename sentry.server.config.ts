import * as Sentry from "@sentry/nextjs";

/**
 * Config do Sentry para o SERVER (Node.js / server-side rendering).
 *
 * Captura erros em Server Components, Route Handlers e Server Actions.
 * Se SENTRY_DSN nao estiver definida, o init e pulado (no-op).
 */
export function register() {
  if (!process.env.SENTRY_DSN) return;

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_RATE ?? 0.1),
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    integrations: [],
  });
}
