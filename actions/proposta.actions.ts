"use server";

import { auth } from "@/auth";
import { propostaService } from "@/services/proposta.service";
import {
  criarPropostaSchema,
  editarPropostaSchema,
  aceitarPropostaSchema,
  recusarPropostaSchema,
} from "@/lib/validations/proposta";
import { revalidatePath } from "next/cache";

export interface ActionResponse {
  sucesso: boolean;
  erro?: string;
  dados?: unknown;
}

/**
 * Action para submeter uma proposta de TFC (RF03)
 */
export async function submeterPropostaAction(
  _prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ESTUDANTE") {
    return { sucesso: false, erro: "Apenas estudantes autenticados podem submeter propostas." };
  }

  const rawData = {
    titulo: formData.get("titulo") as string,
    resumo: formData.get("resumo") as string,
    descricao: formData.get("descricao") as string,
    objetivos: formData.get("objetivos") as string,
    area: formData.get("area") as string,
    orientadorPreferidoId: formData.get("orientadorPreferidoId") as string || undefined,
  };

  const validated = criarPropostaSchema.safeParse(rawData);
  if (!validated.success) {
    const errorMsg = validated.error.issues[0]?.message ?? "Dados inválidos.";
    return { sucesso: false, erro: errorMsg };
  }

  const res = await propostaService.submeterProposta(session.user.id, validated.data);

  if (res.sucesso) {
    revalidatePath("/propostas");
  }

  return res;
}

/**
 * Action para editar uma proposta pendente (RF03)
 */
export async function editarPropostaAction(
  _prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ESTUDANTE") {
    return { sucesso: false, erro: "Apenas estudantes autenticados podem editar propostas." };
  }

  const rawData = {
    id: formData.get("id") as string,
    titulo: formData.get("titulo") as string,
    resumo: formData.get("resumo") as string,
    descricao: formData.get("descricao") as string,
    objetivos: formData.get("objetivos") as string,
    area: formData.get("area") as string,
    orientadorPreferidoId: formData.get("orientadorPreferidoId") as string || undefined,
  };

  const validated = editarPropostaSchema.safeParse(rawData);
  if (!validated.success) {
    const errorMsg = validated.error.issues[0]?.message ?? "Dados inválidos.";
    return { sucesso: false, erro: errorMsg };
  }

  const { id, ...data } = validated.data;
  const res = await propostaService.editarProposta(id, session.user.id, data);

  if (res.sucesso) {
    revalidatePath(`/propostas/${id}`);
    revalidatePath("/propostas");
  }

  return res;
}

/**
 * Action para docente aceitar proposta de TFC (RF04, RF05)
 */
export async function aceitarPropostaAction(
  propostaId: string,
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user || session.user.role !== "DOCENTE") {
    return { sucesso: false, erro: "Acesso não autorizado." };
  }

  const validated = aceitarPropostaSchema.safeParse({
    propostaId,
    orientadorId: session.user.id,
  });

  if (!validated.success) {
    return { sucesso: false, erro: validated.error.issues[0]?.message };
  }

  const res = await propostaService.aceitarProposta(propostaId, session.user.id);

  if (res.sucesso) {
    revalidatePath(`/orientacoes/${propostaId}`);
    revalidatePath("/orientacoes");
  }

  return res;
}

/**
 * Action para docente recusar proposta de TFC com justificativa (RF04)
 */
export async function recusarPropostaAction(
  _prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user || session.user.role !== "DOCENTE") {
    return { sucesso: false, erro: "Acesso não autorizado." };
  }

  const rawData = {
    propostaId: formData.get("propostaId") as string,
    justificativaRecusa: formData.get("justificativaRecusa") as string,
  };

  const validated = recusarPropostaSchema.safeParse(rawData);
  if (!validated.success) {
    const errorMsg = validated.error.issues[0]?.message ?? "Justificativa de recusa inválida.";
    return { sucesso: false, erro: errorMsg };
  }

  const { propostaId, justificativaRecusa } = validated.data;
  const res = await propostaService.recusarProposta(propostaId, session.user.id, justificativaRecusa);

  if (res.sucesso) {
    revalidatePath(`/orientacoes/${propostaId}`);
    revalidatePath("/orientacoes");
  }

  return res;
}
