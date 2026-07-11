import type { NextAuthConfig } from "next-auth";

// ─────────────────────────────────────────────────────────────────────────────
// auth.config.ts — Configuração compartilhada (Edge-safe)
// Não importa nada que seja incompatível com o Edge Runtime (ex: Prisma, bcrypt)
// ─────────────────────────────────────────────────────────────────────────────

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicRoute =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/api/auth");

      if (isPublicRoute) {
        // Redireciona utilizadores já autenticados para o dashboard
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Protege todas as rotas privadas
      if (!isLoggedIn) {
        const callbackUrl = encodeURIComponent(nextUrl.pathname);
        return Response.redirect(
          new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl),
        );
      }

      return true;
    },

    jwt({ token, user }) {
      // Persiste dados do utilizador no token JWT
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role as "ESTUDANTE" | "DOCENTE" | "COORDENACAO";
        token.numero = (user as { numero?: string }).numero;
      }
      return token;
    },

    session({ session, token }) {
      // Expõe dados do token na sessão cliente
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ESTUDANTE" | "DOCENTE" | "COORDENACAO";
        session.user.numero = token.numero as string | undefined;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },

  providers: [], // Providers configurados em auth.ts
} satisfies NextAuthConfig;
