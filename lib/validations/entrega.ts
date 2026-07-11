import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Validações de Entrega (RF06, RF07)
// ─────────────────────────────────────────────────────────────────────────────

export const tiposEntrega = ["PRE_PROJETO", "PARCIAL", "FINAL"] as const;

export const criarEntregaSchema = z.object({
  titulo: z
    .string()
    .min(1, { message: "O título é obrigatório." })
    .min(5, { message: "O título deve ter pelo menos 5 caracteres." })
    .max(200, { message: "O título deve ter no máximo 200 caracteres." })
    .trim(),
  descricao: z
    .string()
    .max(1000, { message: "A descrição deve ter no máximo 1000 caracteres." })
    .optional(),
  tipo: z.enum(tiposEntrega, {
    message: "Tipo de entrega inválido. Escolha: Pré-projeto, Parcial ou Final.",
  }),
  propostaId: z.string().min(1, { message: "A proposta é obrigatória." }),
  prazo: z.coerce.date().optional(),
});

export const avaliarEntregaSchema = z.object({
  id: z.string().min(1, { message: "ID da entrega é obrigatório." }),
  nota: z
    .number({
      message: "A nota deve ser um número.",
    })
    .min(0, { message: "A nota mínima é 0." })
    .max(20, { message: "A nota máxima é 20." }),
  comentarioOrientador: z
    .string()
    .min(1, { message: "O comentário é obrigatório." })
    .min(10, {
      message: "O comentário deve ter pelo menos 10 caracteres.",
    })
    .max(2000, { message: "O comentário deve ter no máximo 2000 caracteres." })
    .trim(),
  status: z
    .enum(
      [
        "APROVADA",
        "REJEITADA",
        "REENTREGA_SOLICITADA",
        "EM_AVALIACAO",
      ] as const,
      { message: "Status inválido." },
    )
    .optional(),
});

export type CriarEntregaInput = z.infer<typeof criarEntregaSchema>;
export type AvaliarEntregaInput = z.infer<typeof avaliarEntregaSchema>;
