"use client";

import { useActionState, useState } from "react";
import { criarEntradaDiarioAction } from "@/actions/diario.actions";
import { Loader2, ArrowLeft, Save, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DiarioFormProps {
  propostaId: string;
}

export function DiarioForm({ propostaId }: DiarioFormProps) {
  const [state, action, isPending] = useActionState(criarEntradaDiarioAction, null);

  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [resumo, setResumo] = useState("");
  const [proximasMetas, setProximasMetas] = useState("");

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <input type="hidden" name="propostaId" value={propostaId} />

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
            Registo adicionado com sucesso! Redirecionando...
          </p>
          <script
            dangerouslySetInnerHTML={{
              __html: `setTimeout(() => { window.location.href = '/diario'; }, 1500)`,
            }}
          />
        </div>
      )}

      <div className="glass rounded-xl p-6 space-y-5 border border-border/40">
        {/* Data da Reunião / Sessão */}
        <div className="space-y-1.5">
          <label htmlFor="data" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            Data do Trabalho / Reunião
          </label>
          <input
            id="data"
            name="data"
            type="date"
            required
            value={data}
            onChange={(e) => setData(e.target.value)}
            disabled={isPending}
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none",
              isPending && "opacity-50 pointer-events-none",
            )}
          />
        </div>

        {/* Resumo */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <label htmlFor="resumo" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-emerald-400" />
              Resumo das Actividades Realizadas (Min. 20 caracteres)
            </label>
            <span className="text-[10px] text-muted-foreground">{resumo.length}/2000</span>
          </div>
          <textarea
            id="resumo"
            name="resumo"
            required
            rows={5}
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            disabled={isPending}
            placeholder="Descreva o progresso feito, as dificuldades encontradas e o que foi discutido..."
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y min-h-[120px]",
              isPending && "opacity-50 pointer-events-none",
            )}
          />
        </div>

        {/* Próximas metas */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <label htmlFor="proximasMetas" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Próximas Metas e Tarefas Combinadas
            </label>
            <span className="text-[10px] text-muted-foreground">{proximasMetas.length}/2000</span>
          </div>
          <textarea
            id="proximasMetas"
            name="proximasMetas"
            required
            rows={4}
            value={proximasMetas}
            onChange={(e) => setProximasMetas(e.target.value)}
            disabled={isPending}
            placeholder="Liste as próximas tarefas a desenvolver e os prazos estimados..."
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y min-h-[100px]",
              isPending && "opacity-50 pointer-events-none",
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/diario"
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
              Processando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Registar no Diário
            </>
          )}
        </button>
      </div>
    </form>
  );
}
