"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/auth.actions";
import { PlusCircle, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CriarUtilizadorForm — Formulário cliente para criar utilizadores
// Mostra feedback de erro/sucesso sem redirecionar o utilizador
// ─────────────────────────────────────────────────────────────────────────────

const initialState = { sucesso: false, erro: undefined };

export function CriarUtilizadorForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
      <h3 className="text-base font-bold text-foreground">Registar Novo Utilizador</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Adicione estudantes, docentes ou membros da coordenação preenchendo as informações abaixo.
      </p>

      {/* Feedback de Erro */}
      {state.erro && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-400 font-medium">{state.erro}</p>
        </div>
      )}

      {/* Feedback de Sucesso */}
      {state.sucesso && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-xs text-emerald-400 font-medium">Utilizador criado com sucesso!</p>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* Campo hidden para redirecionar de volta para /utilizadores */}
        <input type="hidden" name="redirectTo" value="/utilizadores?created=true" />

        <div className="space-y-1">
          <label htmlFor="cu-name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Nome Completo
          </label>
          <input
            id="cu-name"
            name="name"
            type="text"
            required
            placeholder="Nome do Utilizador"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs transition-all focus:border-primary outline-none"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="cu-email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Endereço de Email
          </label>
          <input
            id="cu-email"
            name="email"
            type="email"
            required
            placeholder="exemplo@imetro.ao"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs transition-all focus:border-primary outline-none"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="cu-numero" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Nº Registo (Estudante/Docente)
          </label>
          <input
            id="cu-numero"
            name="numero"
            type="text"
            required
            placeholder="Ex: EST001, DOC001"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs transition-all focus:border-primary outline-none"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="cu-role" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Perfil de Acesso
          </label>
          <select
            id="cu-role"
            name="role"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs transition-all focus:border-primary outline-none"
          >
            <option value="ESTUDANTE">Estudante</option>
            <option value="DOCENTE">Docente</option>
            <option value="COORDENACAO">Coordenação</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="cu-password" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Senha Temporária (Mín. 8 chars, 1 Maiúscula, 1 Número)
          </label>
          <input
            id="cu-password"
            name="password"
            type="password"
            required
            placeholder="Temporaria@123"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs transition-all focus:border-primary outline-none"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="cu-confirmPassword" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Confirmar Senha
          </label>
          <input
            id="cu-confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="Temporaria@123"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs transition-all focus:border-primary outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              A criar conta...
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Criar Conta
            </>
          )}
        </button>
      </form>
    </div>
  );
}
