"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";
import { redirect } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// actions/auth.actions.ts — Server Actions de autenticação
// ─────────────────────────────────────────────────────────────────────────────

export type ActionResult = {
  sucesso: boolean;
  erro?: string;
};

/**
 * Action de login com email e senha
 */
export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validar dados
  const validated = loginSchema.safeParse(rawData);
  if (!validated.success) {
    const firstError = validated.error.issues[0]?.message ?? "Dados inválidos.";
    return { sucesso: false, erro: firstError };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    });

    return { sucesso: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { sucesso: false, erro: "Email ou senha incorretos." };
        case "CallbackRouteError":
          return {
            sucesso: false,
            erro: error.cause?.err?.message ?? "Erro de autenticação.",
          };
        default:
          return { sucesso: false, erro: "Ocorreu um erro. Tente novamente." };
      }
    }
    throw error;
  }
}

/**
 * Action de logout
 */
export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}

/**
 * Action de registo de novo utilizador
 * Pode ser chamada da página de login (redireciona para /login) ou
 * do painel da coordenação (redireciona para /utilizadores)
 */
export async function registerAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    numero: formData.get("numero") as string,
    role: formData.get("role") as string,
  };

  // Campo opcional que indica para onde redirecionar após o registo
  const redirectTo = (formData.get("redirectTo") as string) || "/login";

  // Validar dados
  const validated = registerSchema.safeParse(rawData);
  if (!validated.success) {
    const firstError = validated.error.issues[0]?.message ?? "Dados inválidos.";
    return { sucesso: false, erro: firstError };
  }

  const resultado = await authService.registar(validated.data);
  if (!resultado.sucesso) {
    return { sucesso: false, erro: resultado.erro };
  }

  // Redireciona para a página correta após registo
  redirect(redirectTo);
}

