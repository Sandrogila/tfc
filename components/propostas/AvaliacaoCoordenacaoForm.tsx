"use client";

import { useActionState, useState } from "react";
import { avaliarPropostaCoordenacaoAction, ActionResponse } from "@/actions/proposta.actions";
import { CheckCircle, XCircle, Loader2, MessageSquare, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface AvaliacaoCoordenacaoFormProps {
  propostaId: string;
  docentes: Array<{ id: string; name: string; especialidade: string | null }>;
  orientadorAtualId?: string | null;
}

export function AvaliacaoCoordenacaoForm({
  propostaId,
  docentes,
  orientadorAtualId,
}: AvaliacaoCoordenacaoFormProps) {
  const [state, action, isPending] = useActionState<ActionResponse | null, FormData>(
    avaliarPropostaCoordenacaoAction,
    null,
  );
  const [statusSelecionado, setStatusSelecionado] = useState<"APROVADA" | "REJEITADA" | "">("");
  const router = useRouter();

  if (state?.sucesso) {
    setTimeout(() => router.refresh(), 1200);
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="propostaId" value={propostaId} />

      {/* Resultado */}
      {state && !state.sucesso && (
        <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
          <p className="text-sm text-red-400 font-medium">{state.erro}</p>
        </div>
      )}
      {state?.sucesso && (
        <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20">
          <p className="text-sm text-emerald-400 font-medium">Avaliação registada com sucesso!</p>
        </div>
      )}

      {/* Seleção de Decisão */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Decisão da Coordenação
        </label>
        <div className="flex gap-3">
          <label
            className={cn(
              "flex-1 flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all",
              statusSelecionado === "APROVADA"
                ? "border-emerald-500/60 bg-emerald-500/10"
                : "border-border hover:border-emerald-500/40 hover:bg-emerald-500/5",
            )}
          >
            <input
              type="radio"
              name="status"
              value="APROVADA"
              required
              className="sr-only"
              onChange={() => setStatusSelecionado("APROVADA")}
            />
            <CheckCircle
              className={cn(
                "h-5 w-5 transition-colors",
                statusSelecionado === "APROVADA" ? "text-emerald-400" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-sm font-semibold",
                statusSelecionado === "APROVADA" ? "text-emerald-400" : "text-foreground",
              )}
            >
              Aprovar Proposta
            </span>
          </label>

          <label
            className={cn(
              "flex-1 flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all",
              statusSelecionado === "REJEITADA"
                ? "border-red-500/60 bg-red-500/10"
                : "border-border hover:border-red-500/40 hover:bg-red-500/5",
            )}
          >
            <input
              type="radio"
              name="status"
              value="REJEITADA"
              required
              className="sr-only"
              onChange={() => setStatusSelecionado("REJEITADA")}
            />
            <XCircle
              className={cn(
                "h-5 w-5 transition-colors",
                statusSelecionado === "REJEITADA" ? "text-red-400" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-sm font-semibold",
                statusSelecionado === "REJEITADA" ? "text-red-400" : "text-foreground",
              )}
            >
              Rejeitar Proposta
            </span>
          </label>
        </div>
      </div>

      {/* Indicação do Orientador (obrigatório ao aprovar) */}
      {statusSelecionado === "APROVADA" && (
        <div className="space-y-2">
          <label
            htmlFor="orientadorId"
            className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
          >
            <GraduationCap className="h-4 w-4 text-emerald-400" />
            Orientador Designado{" "}
            <span className="text-red-400 font-bold">*</span>
          </label>
          <select
            id="orientadorId"
            name="orientadorId"
            required
            defaultValue={orientadorAtualId ?? ""}
            disabled={isPending}
            className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="">Selecione o orientador...</option>
            {docentes.map((docente) => (
              <option key={docente.id} value={docente.id}>
                {docente.name}
                {docente.especialidade ? ` — ${docente.especialidade}` : ""}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-muted-foreground">
            Máx. 5 orientações ativas por docente (RF05). Docentes com limite atingido não aparecem nesta lista.
          </p>
        </div>
      )}

      {/* Observações / Justificativa */}
      <div className="space-y-2">
        <label
          htmlFor="observacoes"
          className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
        >
          <MessageSquare className="h-4 w-4 text-primary" />
          Observações / Justificativa{statusSelecionado === "REJEITADA" && " *"}
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={4}
          required={statusSelecionado === "REJEITADA"}
          disabled={isPending}
          placeholder={
            statusSelecionado === "REJEITADA"
              ? "Indique o motivo da rejeição da proposta..."
              : "Adicione observações ou comentários sobre a proposta (opcional)..."
          }
          className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y min-h-[100px]"
        />
      </div>

      {/* Botão de submissão */}
      <button
        id="btn-submeter-avaliacao"
        type="submit"
        disabled={isPending || !statusSelecionado}
        className={cn(
          "w-full inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition-all disabled:opacity-50 disabled:pointer-events-none",
          statusSelecionado === "APROVADA"
            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
            : statusSelecionado === "REJEITADA"
              ? "bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-500/20"
              : "bg-primary text-primary-foreground",
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            A registar avaliação...
          </>
        ) : statusSelecionado === "APROVADA" ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Confirmar Aprovação
          </>
        ) : statusSelecionado === "REJEITADA" ? (
          <>
            <XCircle className="h-4 w-4" />
            Confirmar Rejeição
          </>
        ) : (
          "Selecione uma decisão"
        )}
      </button>
    </form>
  );
}
