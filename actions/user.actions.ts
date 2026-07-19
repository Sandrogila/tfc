"use server";

import { auth } from "@/auth";
import { userRepository } from "@/repositories/user.repository";
import { authService } from "@/services/auth.service";
import {
  atualizarPerfilSchema,
  changePasswordSchema,
} from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";

export interface ActionResponse {
  sucesso: boolean;
  erro?: string;
  dados?: unknown;
}

/**
 * Atualiza os dados básicos do perfil do utilizador (Nome, Email, Número, Departamento, Especialidade, Disponivel)
 */
export async function atualizarPerfilAction(
  _prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user) {
    return { sucesso: false, erro: "Utilizador não autenticado." };
  }

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    numero: formData.get("numero") as string,
    departamento: (formData.get("departamento") as string) || undefined,
    especialidade: (formData.get("especialidade") as string) || undefined,
    disponivel: formData.get("disponivel") === "true",
  };

  const validated = atualizarPerfilSchema.safeParse(rawData);
  if (!validated.success) {
    const errorMsg = validated.error.issues[0]?.message ?? "Dados de perfil inválidos.";
    return { sucesso: false, erro: errorMsg };
  }

  try {
    // Verificar se o email já está em uso por outro utilizador
    const emailExistente = await userRepository.findByEmail(validated.data.email);
    if (emailExistente && emailExistente.id !== session.user.id) {
      return { sucesso: false, erro: "Este email já está a ser utilizado por outro utilizador." };
    }

    // Verificar se o número já está em uso por outro utilizador
    if (validated.data.numero) {
      const numeroExistente = await userRepository.findByNumero(validated.data.numero);
      if (numeroExistente && numeroExistente.id !== session.user.id) {
        return { sucesso: false, erro: "Este número de identificação já está registado." };
      }
    }

    // Preparar dados a serem atualizados
    const updateData: any = {
      name: validated.data.name,
      email: validated.data.email.toLowerCase().trim(),
      numero: validated.data.numero,
      departamento: validated.data.departamento,
    };

    // Campos exclusivos do Docente
    if (session.user.role === "DOCENTE") {
      updateData.especialidade = validated.data.especialidade;
      updateData.disponivel = validated.data.disponivel;
    }

    await userRepository.update(session.user.id, updateData);

    revalidatePath("/perfil");
    return { sucesso: true };
  } catch (err: any) {
    console.error("Erro ao atualizar perfil:", err);
    return { sucesso: false, erro: "Ocorreu um erro interno ao atualizar o perfil." };
  }
}

/**
 * Altera a senha do utilizador
 */
export async function alterarSenhaAction(
  _prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user) {
    return { sucesso: false, erro: "Utilizador não autenticado." };
  }

  const rawData = {
    senhaAtual: formData.get("senhaAtual") as string,
    novaSenha: formData.get("novaSenha") as string,
    confirmarNovaSenha: formData.get("confirmarNovaSenha") as string,
  };

  const validated = changePasswordSchema.safeParse(rawData);
  if (!validated.success) {
    const errorMsg = validated.error.issues[0]?.message ?? "Dados de alteração de senha inválidos.";
    return { sucesso: false, erro: errorMsg };
  }

  try {
    const res = await authService.alterarSenha(
      session.user.id,
      validated.data.senhaAtual,
      validated.data.novaSenha,
    );

    return res;
  } catch (err: any) {
    console.error("Erro ao alterar senha:", err);
    return { sucesso: false, erro: "Ocorreu um erro interno ao alterar a senha." };
  }
}
