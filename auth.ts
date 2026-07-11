import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { loginSchema } from "@/lib/validations/auth";

// ─────────────────────────────────────────────────────────────────────────────
// auth.ts — Configuração principal do Auth.js v5
// Inclui providers e adaptador Prisma (Node.js runtime only)
// ─────────────────────────────────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      name: "Credenciais",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "seu@email.com",
        },
        password: {
          label: "Senha",
          type: "password",
        },
      },

      async authorize(credentials) {
        // 1. Validar formato dos dados com Zod
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;

        // 2. Buscar utilizador no banco de dados
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            numero: true,
            image: true,
            ativo: true,
          },
        });

        if (!user || !user.password) return null;

        // 3. Verificar se a conta está ativa
        if (!user.ativo) {
          throw new Error("Conta desativada. Contacte o administrador.");
        }

        // 4. Comparar senha com hash
        const passwordsMatch = await compare(password, user.password);
        if (!passwordsMatch) return null;

        // 5. Retornar utilizador sem a senha
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          numero: user.numero ?? undefined,
          image: user.image,
        };
      },
    }),
  ],
});
