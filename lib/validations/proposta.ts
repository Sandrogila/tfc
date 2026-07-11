import { z } from "zod";


// ─────────────────────────────────────────────────────────────────────────────
// Validações de Proposta TFC (RF03, RF04, RF05) — Versão Fase 2
// ─────────────────────────────────────────────────────────────────────────────

export const criarPropostaSchema = z.object({
  titulo: z
    .string()
    .min(1, { message: "O título é obrigatório." })
    .min(10, { message: "O título deve ter pelo menos 10 caracteres." })
    .max(200, { message: "O título deve ter no máximo 200 caracteres." })
    .trim(),
  resumo: z
    .string()
    .min(1, { message: "O resumo é obrigatório." })
    .min(50, { message: "O resumo deve ter pelo menos 50 caracteres." })
    .max(1000, { message: "O resumo deve ter no máximo 1000 caracteres." })
    .trim(),
  descricao: z
    .string()
    .min(1, { message: "A descrição é obrigatória." })
    .min(50, { message: "A descrição deve ter pelo menos 50 caracteres." })
    .trim(),
  objetivos: z
    .string()
    .min(1, { message: "Os objetivos são obrigatórios." })
    .min(30, { message: "Os objetivos devem ter pelo menos 30 caracteres." })
    .max(2000, { message: "Os objetivos devem ter no máximo 2000 caracteres." })
    .trim(),
  area: z
    .string()
    .min(1, { message: "A área é obrigatória." })
    .min(2, { message: "Área inválida." })
    .trim(),
  orientadorPreferidoId: z.string().optional(),
  status: z.enum(["RASCUNHO", "SUBMETIDA"]).optional(),
});

export const editarPropostaSchema = criarPropostaSchema.extend({
  id: z.string().min(1, { message: "ID da proposta é obrigatório." }),
});

export const aceitarPropostaSchema = z.object({
  propostaId: z.string().min(1, { message: "ID da proposta é obrigatório." }),
  orientadorId: z.string().min(1, { message: "ID do orientador é obrigatório." }),
});

export const recusarPropostaSchema = z.object({
  propostaId: z.string().min(1, { message: "ID da proposta é obrigatório." }),
  justificativaRecusa: z
    .string()
    .min(1, { message: "A justificativa é obrigatória." })
    .min(20, {
      message: "A justificativa deve ter pelo menos 20 caracteres.",
    })
    .max(1000, {
      message: "A justificativa deve ter no máximo 1000 caracteres.",
    })
    .trim(),
});

export const avaliarPropostaSchema = z.object({
  id: z.string().cuid({ message: "ID inválido." }),
  status: z.enum(["APROVADA", "REJEITADA", "EM_REVISAO"], {
    message: "Status obrigatório.",
  }),
  observacoes: z
    .string()
    .max(1000, { message: "Observações devem ter no máximo 1000 caracteres." })
    .optional(),
});

// Novo esquema de avaliação para a Coordenação (com refine condicional)
export const avaliarPropostaCoordenacaoSchema = z.object({
  propostaId: z.string().min(1, { message: "ID da proposta é obrigatório." }),
  status: z.enum(["APROVADA", "REJEITADA"]),
  observacoes: z.string().max(1000).optional(),
  orientadorId: z.string().optional(),
}).refine((data) => {
  if (data.status === "APROVADA" && !data.orientadorId) {
    return false;
  }
  return true;
}, {
  message: "Deve indicar um orientador para aprovar a proposta.",
  path: ["orientadorId"],
});

// Tipos inferidos
export type CriarPropostaInput = z.infer<typeof criarPropostaSchema>;
export type EditarPropostaInput = z.infer<typeof editarPropostaSchema>;
export type AceitarPropostaInput = z.infer<typeof aceitarPropostaSchema>;
export type RecusarPropostaInput = z.infer<typeof recusarPropostaSchema>;
export type AvaliarPropostaInput = z.infer<typeof avaliarPropostaSchema>;
export type AvaliarPropostaCoordenacaoInput = z.infer<typeof avaliarPropostaCoordenacaoSchema>;

