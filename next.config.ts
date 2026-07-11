import type { NextConfig } from "next";

// ─────────────────────────────────────────────────────────────────────────────
// next.config.ts — Configuração do Next.js
// ─────────────────────────────────────────────────────────────────────────────

const nextConfig: NextConfig = {
  // Experimental features
  experimental: {
    // Server Actions estão disponíveis por padrão no Next.js 15+
  },

  // Imagens externas permitidas (adicione domínios conforme necessário)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },

  // Cabeçalhos de segurança
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
