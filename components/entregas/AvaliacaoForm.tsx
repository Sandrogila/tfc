"use client";

import { useActionState, useState } from "react";
import { avaliarEntregaAction } from "@/actions/entrega.actions";
import { Loader2, ArrowLeft, Award, MessageSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AvaliacaoFormProps {
  entregaId: string;
}

export function AvaliacaoForm({ entregaId }: AvaliacaoFormProps) {
  const [state, action, isPending] = useActionState(avaliarEntregaAction, null);

  const [nota, setNota] = useState("14");
  const [comentario, setComentario] = useState("");
  const [status, setStatus] = useState("APROVADA");

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <input type="hidden" name="id" value={entregaId} />

      {/* Alerta de erro */}
      {state && !state.sucesso && (
        <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
          <p className="text-sm text-red-400 font-medium">{state.erro}</p>
        </div>
      )}

      {/* Alerta de sucesso */}
      {state && state.sucesso && (
        <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20">
          <p className="text-sm text-emerald-400 font-medium">
            Avaliação registada com sucesso! Redirecionando...
          </p>
          <script
            dangerouslySetInnerHTML={{
              __html: `setTimeout(() => { window.location.href = '/avaliacoes'; }, 1500)`,
            }}
          />
        </div>
      )}

      <div className="glass rounded-xl p-6 space-y-5 border border-border/40">
        <div className="flex flex-col gap-1.5 md:flex-row md:gap-6">
          {/* Nota */}
          <div className="space-y-1.5 flex-1">
            <label htmlFor="nota" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-primary" />
              Nota do Trabalho (0 a 20)
            </label>
            <input
              id="nota"
              name="nota"
              type="number"
              min="0"
              max="20"
              step="0.5"
              required
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              disabled={isPending}
              placeholder="Ex: 14"
              className={cn(
                "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none",
                isPending && "opacity-50 pointer-events-none",
              )}
            />
          </div>

          {/* Resultado/Status */}
          <div className="space-y-1.5 flex-1">
            <label htmlFor="status" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Status da Avaliação
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isPending}
              className={cn(
                "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none",
                isPending && "opacity-50 pointer-events-none",
              )}
            >
              <option value="APROVADA">Aprovar Entrega</option>
              <option value="REJEITADA">Recusar Entrega</option>
              <option value="REENTREGA_SOLICITADA">Solicitar Correções (Reentrega)</option>
            </select>
          </div>
        </div>

        {/* Comentário / Justificativa */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <label htmlFor="comentarioOrientador" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
              Comentário Detalhado / Feedback (Min. 10 caracteres)
            </label>
            <span className="text-[10px] text-muted-foreground">{comentario.length}/2000</span>
          </div>
          <textarea
            id="comentarioOrientador"
            name="comentarioOrientador"
            required
            rows={5}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            disabled={isPending}
            placeholder="Forneça observações construtivas sobre a entrega do estudante..."
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y min-h-[120px]",
              isPending && "opacity-50 pointer-events-none",
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/avaliacoes"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 ml-auto disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              A processar...
            </>
          ) : (
            "Gravar Avaliação"
          )}
        </button>
      </div>
    </form>
  );
}
