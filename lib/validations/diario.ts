import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Validações do Diário de Bordo (RF08)
// ─────────────────────────────────────────────────────────────────────────────

export const criarEntradaDiarioSchema = z.object({
  data: z.coerce.date({
    message: "A data é obrigatória.",
  }),
  resumo: z
    .string()
    .min(1, { message: "O resumo é obrigatório." })
    .min(20, { message: "O resumo deve ter pelo menos 20 caracteres." })
    .max(2000, { message: "O resumo deve ter no máximo 2000 caracteres." })
    .trim(),
  proximasMetas: z
    .string()
    .min(1, { message: "As próximas metas são obrigatórias." })
    .min(10, {
      message: "As próximas metas devem ter pelo menos 10 caracteres.",
    })
    .max(2000, {
      message: "As próximas metas devem ter no máximo 2000 caracteres.",
    })
    .trim(),
  propostaId: z
    .string()
    .min(1, { message: "A proposta é obrigatória." }),
});

export type CriarEntradaDiarioInput = z.infer<typeof criarEntradaDiarioSchema>;
