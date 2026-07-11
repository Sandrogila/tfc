"use server";

import { auth } from "@/auth";
import { diarioService } from "@/services/diario.service";
import { criarEntradaDiarioSchema } from "@/lib/validations/diario";
import { revalidatePath } from "next/cache";

export interface ActionResponse {
  sucesso: boolean;
  erro?: string;
  dados?: unknown;
}

/**
 * Action para registar reuniões de orientação no Diário de Bordo (RF08)
 */
export async function criarEntradaDiarioAction(
  _prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user) {
    return { sucesso: false, erro: "Autenticação requerida." };
  }

  const rawData = {
    data: formData.get("data") as string,
    resumo: formData.get("resumo") as string,
    proximasMetas: formData.get("proximasMetas") as string,
    propostaId: formData.get("propostaId") as string,
  };

  const validated = criarEntradaDiarioSchema.safeParse(rawData);
  if (!validated.success) {
    const errorMsg = validated.error.issues[0]?.message ?? "Dados do diário inválidos.";
    return { sucesso: false, erro: errorMsg };
  }

  const res = await diarioService.criarEntrada(session.user.id, validated.data);

  if (res.sucesso) {
    revalidatePath("/diario");
    revalidatePath(`/propostas/${validated.data.propostaId}`);
  }

  return res;
}
