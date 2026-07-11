import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Validações do Perfil do Docente (RF02)
// ─────────────────────────────────────────────────────────────────────────────

export const atualizarDocenteSchema = z.object({
  especialidade: z
    .string()
    .min(3, { message: "A especialidade deve ter pelo menos 3 caracteres." })
    .max(200, { message: "A especialidade deve ter no máximo 200 caracteres." })
    .trim(),
  disponivel: z.boolean({
    message: "A disponibilidade deve ser verdadeiro ou falso.",
  }),
});

export type AtualizarDocenteInput = z.infer<typeof atualizarDocenteSchema>;
