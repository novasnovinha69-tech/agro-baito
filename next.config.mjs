import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
};

// Sentry: tree-shaking do bundle + upload de source maps.
// O upload so acontece se SENTRY_AUTH_TOKEN estiver definida (em CI/producao);
// caso contrario, e silenciosamente pulado — nao afeta dev local.
export default withSentryConfig(nextConfig, {
  // Desabilita o wizard interativo
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // So faz upload de source maps com auth token; sem token, pula silenciosamente
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Não falha o build se o upload falhar
  errorHandler: () => {},
});
