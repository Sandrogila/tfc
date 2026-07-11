"use server";

import { auth } from "@/auth";
import { entregaService } from "@/services/entrega.service";
import { criarEntregaSchema, avaliarEntregaSchema } from "@/lib/validations/entrega";
import { revalidatePath } from "next/cache";

export interface ActionResponse {
  sucesso: boolean;
  erro?: string;
  dados?: unknown;
}

/**
 * Action para registar a submissão de entrega pelo estudante (RF06)
 */
export async function submeterEntregaAction(
  _prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ESTUDANTE") {
    return { sucesso: false, erro: "Apenas estudantes autenticados podem submeter entregas." };
  }

  const rawData = {
    titulo: formData.get("titulo") as string,
    descricao: formData.get("descricao") as string || undefined,
    tipo: formData.get("tipo") as string,
    propostaId: formData.get("propostaId") as string,
    // Estes dados vêm do upload do arquivo (Feito antes da Server Action por segurança e performance)
    urlFicheiro: formData.get("urlFicheiro") as string,
    nomeArquivo: formData.get("nomeArquivo") as string,
    tamanhoBytes: parseInt(formData.get("tamanhoBytes") as string || "0", 10),
  };

  const validated = criarEntregaSchema.safeParse(rawData);
  if (!validated.success) {
    const errorMsg = validated.error.issues[0]?.message ?? "Dados da entrega inválidos.";
    return { sucesso: false, erro: errorMsg };
  }

  if (!rawData.urlFicheiro || !rawData.nomeArquivo) {
    return { sucesso: false, erro: "O ficheiro PDF é obrigatório." };
  }

  const res = await entregaService.submitEntrega({
    ...validated.data,
    urlFicheiro: rawData.urlFicheiro,
    nomeArquivo: rawData.nomeArquivo,
    tamanhoBytes: rawData.tamanhoBytes,
  });

  if (res.sucesso) {
    revalidatePath("/entregas");
    revalidatePath(`/propostas/${validated.data.propostaId}`);
  }

  return res;
}

/**
 * Action para docente avaliar entrega (RF07)
 */
export async function avaliarEntregaAction(
  _prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user || session.user.role !== "DOCENTE") {
    return { sucesso: false, erro: "Apenas docentes podem avaliar entregas." };
  }

  const rawData = {
    id: formData.get("id") as string,
    nota: parseFloat(formData.get("nota") as string || "0"),
    comentarioOrientador: formData.get("comentarioOrientador") as string,
    status: (formData.get("status") as string) || undefined,
  };

  const validated = avaliarEntregaSchema.safeParse(rawData);
  if (!validated.success) {
    const errorMsg = validated.error.issues[0]?.message ?? "Avaliação inválida.";
    return { sucesso: false, erro: errorMsg };
  }

  const { id, ...data } = validated.data;
  const res = await entregaService.avaliarEntrega(id, session.user.id, data);

  if (res.sucesso) {
    revalidatePath("/avaliacoes");
    revalidatePath(`/entregas/${id}`);
  }

  return res;
}
