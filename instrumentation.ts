/**
 * instrumentation.ts — entrypoint do Next.js para instrumentacao.
 *
 * O Next.js chama register() uma vez por runtime (nodejs / edge) ao iniciar.
 * Aqui delegamos para o config do Sentry correspondente a cada runtime.
 *
 * Referencia: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
