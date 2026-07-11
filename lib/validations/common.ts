import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Validações Comuns — Reutilizáveis em toda a aplicação
// ─────────────────────────────────────────────────────────────────────────────

// Paginação
export const paginacaoSchema = z.object({
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().min(1).max(100).default(20),
  ordem: z.enum(["asc", "desc"]).default("desc"),
  ordenarPor: z.string().optional(),
});

// ID CUID
export const idSchema = z.object({
  id: z
    .string()
    .min(1, { message: "ID obrigatório." })
    .cuid({ message: "ID inválido." }),
});

// Datas
export const periodoSchema = z.object({
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
});

// Pesquisa
export const pesquisaSchema = z.object({
  q: z.string().trim().optional(),
});

// Tipos inferidos
export type PaginacaoInput = z.infer<typeof paginacaoSchema>;
export type IdInput = z.infer<typeof idSchema>;
export type PeriodoInput = z.infer<typeof periodoSchema>;
export type PesquisaInput = z.infer<typeof pesquisaSchema>;
