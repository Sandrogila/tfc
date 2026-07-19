import { z } from "zod";
import { Role } from "@prisma/client";


// ─────────────────────────────────────────────────────────────────────────────
// Validações de Autenticação
// ─────────────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "O email é obrigatório." })
    .email({ message: "Formato de email inválido." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: "A senha é obrigatória." })
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "O nome é obrigatório." })
      .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
      .trim(),
    email: z
      .string()
      .min(1, { message: "O email é obrigatório." })
      .email({ message: "Formato de email inválido." })
      .trim()
      .toLowerCase(),
    numero: z
      .string()
      .min(1, { message: "O número é obrigatório." })
      .min(3, { message: "Número inválido." })
      .trim(),
    password: z
      .string()
      .min(1, { message: "A senha é obrigatória." })
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
      .regex(/[A-Z]/, {
        message: "A senha deve conter pelo menos uma letra maiúscula.",
      })
      .regex(/[0-9]/, {
        message: "A senha deve conter pelo menos um número.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "A confirmação da senha é obrigatória." }),
    role: z.nativeEnum(Role, {
      message: "O perfil é obrigatório.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    senhaAtual: z
      .string()
      .min(1, { message: "Senha atual obrigatória." }),
    novaSenha: z
      .string()
      .min(1, { message: "Nova senha obrigatória." })
      .min(8, { message: "A nova senha deve ter pelo menos 8 caracteres." }),
    confirmarNovaSenha: z
      .string()
      .min(1, { message: "Confirmação obrigatória." }),
  })
  .refine((data) => data.novaSenha === data.confirmarNovaSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarNovaSenha"],
  });

export const atualizarPerfilSchema = z.object({
  name: z
    .string()
    .min(1, { message: "O nome é obrigatório." })
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
    .trim(),
  email: z
    .string()
    .min(1, { message: "O email é obrigatório." })
    .email({ message: "Formato de email inválido." })
    .trim()
    .toLowerCase(),
  numero: z
    .string()
    .min(1, { message: "O número é obrigatório." })
    .min(3, { message: "Número inválido." })
    .trim(),
  departamento: z.string().optional(),
  especialidade: z.string().optional(),
  disponivel: z.boolean().optional(),
});

// Tipos inferidos
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AtualizarPerfilInput = z.infer<typeof atualizarPerfilSchema>;

