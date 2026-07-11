"use client";

import { useActionState, useState } from "react";
import { submeterPropostaAction, editarPropostaAction } from "@/actions/proposta.actions";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PropostaFormProps {
  proposta?: {
    id: string;
    titulo: string;
    resumo: string;
    descricao: string;
    objetivos: string;
    area: string;
    orientadorPreferidoId?: string | null;
  };
  docentes: Array<{ id: string; name: string; especialidade: string | null }>;
}

export function PropostaForm({ proposta, docentes }: PropostaFormProps) {
  const isEditing = !!proposta;
  const actionToUse = isEditing ? editarPropostaAction : submeterPropostaAction;

  const [state, action, isPending] = useActionState(actionToUse, null);

  const [titulo, setTitulo] = useState(proposta?.titulo ?? "");
  const [resumo, setResumo] = useState(proposta?.resumo ?? "");
  const [descricao, setDescricao] = useState(proposta?.descricao ?? "");
  const [objetivos, setObjetivos] = useState(proposta?.objetivos ?? "");
  const [area, setArea] = useState(proposta?.area ?? "");
  const [orientadorId, setOrientadorId] = useState(proposta?.orientadorPreferidoId ?? "");

  return (
    <form action={action} className="space-y-6 max-w-3xl">
      {isEditing && <input type="hidden" name="id" value={proposta.id} />}

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
            Proposta {isEditing ? "atualizada" : "submetida"} com sucesso! Redirecionando...
          </p>
          <script
            dangerouslySetInnerHTML={{
              __html: `setTimeout(() => { window.location.href = '/propostas'; }, 1500)`,
            }}
          />
        </div>
      )}

      <div className="glass rounded-xl p-6 space-y-5 border border-border/40">
        {/* Título */}
        <div className="space-y-1.5">
          <label htmlFor="titulo" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Título do Trabalho
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            disabled={isPending}
            placeholder="Ex: Sistema de Informação para Gestão Escolar..."
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none",
              isPending && "opacity-50 pointer-events-none",
            )}
          />
        </div>

        {/* Área científica */}
        <div className="space-y-1.5">
          <label htmlFor="area" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Área Científica / Tema
          </label>
          <input
            id="area"
            name="area"
            type="text"
            required
            value={area}
            onChange={(e) => setArea(e.target.value)}
            disabled={isPending}
            placeholder="Ex: Engenharia de Software, Redes, IA..."
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none",
              isPending && "opacity-50 pointer-events-none",
            )}
          />
        </div>

        {/* Orientador Pretendido (RF03) */}
        <div className="space-y-1.5">
          <label htmlFor="orientadorPreferidoId" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Orientador Pretendido (Opcional)
          </label>
          <select
            id="orientadorPreferidoId"
            name="orientadorPreferidoId"
            value={orientadorId}
            onChange={(e) => setOrientadorId(e.target.value)}
            disabled={isPending}
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none",
              isPending && "opacity-50 pointer-events-none",
            )}
          >
            <option value="">Selecione um orientador (opcional)</option>
            {docentes.map((docente) => (
              <option key={docente.id} value={docente.id}>
                {docente.name} {docente.especialidade ? `— ${docente.especialidade}` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Resumo (RF03) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <label htmlFor="resumo" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Resumo da Proposta (Min. 50 caracteres)
            </label>
            <span className="text-[10px] text-muted-foreground">{resumo.length}/1000</span>
          </div>
          <textarea
            id="resumo"
            name="resumo"
            required
            rows={4}
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            disabled={isPending}
            placeholder="Forneça um breve resumo contextualizando o trabalho..."
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y min-h-[100px]",
              isPending && "opacity-50 pointer-events-none",
            )}
          />
        </div>

        {/* Objetivos (RF03) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <label htmlFor="objetivos" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Objetivos (Geral e Específicos)
            </label>
            <span className="text-[10px] text-muted-foreground">{objetivos.length}/2000</span>
          </div>
          <textarea
            id="objetivos"
            name="objetivos"
            required
            rows={4}
            value={objetivos}
            onChange={(e) => setObjetivos(e.target.value)}
            disabled={isPending}
            placeholder="Enumere o objetivo geral e os objetivos específicos do seu trabalho..."
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y min-h-[100px]",
              isPending && "opacity-50 pointer-events-none",
            )}
          />
        </div>

        {/* Descrição Detalhada */}
        <div className="space-y-1.5">
          <label htmlFor="descricao" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Descrição Detalhada e Metodologia
          </label>
          <textarea
            id="descricao"
            name="descricao"
            required
            rows={6}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={isPending}
            placeholder="Detalhe a introdução, problemática, relevância do tema e a metodologia proposta..."
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y min-h-[150px]",
              isPending && "opacity-50 pointer-events-none",
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/propostas"
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
              <Send className="h-4 w-4" />
              {isEditing ? "Atualizar Proposta" : "Submeter Proposta TFC"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
