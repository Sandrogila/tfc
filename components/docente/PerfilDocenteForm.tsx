"use client";

import { useActionState, useState } from "react";
import { atualizarDocenteAction } from "@/actions/docente.actions";
import { Loader2, Save, GraduationCap, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerfilDocenteFormProps {
  especialidade: string | null;
  disponivel: boolean;
}

export function PerfilDocenteForm({ especialidade: initialEspecialidade, disponivel: initialDisponivel }: PerfilDocenteFormProps) {
  const [state, action, isPending] = useActionState(atualizarDocenteAction, null);

  const [especialidade, setEspecialidade] = useState(initialEspecialidade ?? "");
  const [disponivel, setDisponivel] = useState(initialDisponivel);

  return (
    <form action={action} className="space-y-6 max-w-xl">
      {/* Alerta de erro */}
      {state && !state.sucesso && (
        <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
          <p className="text-sm text-red-400 font-medium">{state.erro}</p>
        </div>
      )}

      {/* Alerta de sucesso */}
      {state && state.sucesso && (
        <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-400 font-medium">
            Informações do perfil docente atualizadas com sucesso!
          </p>
        </div>
      )}

      <div className="glass rounded-xl p-6 space-y-5 border border-border/40">
        {/* Especialidade */}
        <div className="space-y-1.5">
          <label htmlFor="especialidade" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-primary" />
            Especialidade / Áreas de Orientação
          </label>
          <input
            id="especialidade"
            name="especialidade"
            type="text"
            required
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            disabled={isPending}
            placeholder="Ex: Engenharia de Software, Sistemas Distribuídos, Redes..."
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none",
              isPending && "opacity-50 pointer-events-none",
            )}
          />
        </div>

        {/* Disponibilidade */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Disponibilidade para Orientação
          </span>
          <label className="flex items-start gap-3 p-3.5 rounded-lg border border-border/50 bg-background/30 hover:bg-background/50 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              name="disponivel"
              value="true"
              checked={disponivel}
              onChange={(e) => setDisponivel(e.target.checked)}
              disabled={isPending}
              className="mt-1 h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-background"
            />
            {/* Campo oculto para mandar valor falso caso não marcado */}
            <input type="hidden" name="disponivel" value={disponivel ? "true" : "false"} />
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-foreground">
                Disponível para orientar novos estudantes
              </span>
              <p className="text-xs text-muted-foreground">
                Se desmarcado, os estudantes não poderão selecioná-lo como orientador preferencial na criação de propostas.
              </p>
            </div>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:pointer-events-none"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Gravando...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Salvar Perfil Docente
          </>
        )}
      </button>
    </form>
  );
}
