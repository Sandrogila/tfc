"use server";

import { auth } from "@/auth";
import { docenteService } from "@/services/docente.service";
import { atualizarDocenteSchema } from "@/lib/validations/docente";
import { revalidatePath } from "next/cache";

export interface ActionResponse {
  sucesso: boolean;
  erro?: string;
  dados?: unknown;
}

/**
 * Action para docente atualizar especialidade e disponibilidade (RF02)
 */
export async function atualizarDocenteAction(
  _prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user || session.user.role !== "DOCENTE") {
    return { sucesso: false, erro: "Acesso não autorizado." };
  }

  const rawData = {
    especialidade: formData.get("especialidade") as string,
    disponivel: formData.get("disponivel") === "true",
  };

  const validated = atualizarDocenteSchema.safeParse(rawData);
  if (!validated.success) {
    const errorMsg = validated.error.issues[0]?.message ?? "Dados de perfil inválidos.";
    return { sucesso: false, erro: errorMsg };
  }

  const res = await docenteService.atualizarPerfil(session.user.id, validated.data);

  if (res.sucesso) {
    revalidatePath("/perfil-docente");
  }

  return res;
}
