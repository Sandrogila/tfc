"use client";

import { useState, useTransition } from "react";
import { excluirPropostaAction, publicarPropostaAction } from "@/actions/proposta.actions";
import { Trash2, Send, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PropostaAcoesEstudanteProps {
  propostaId: string;
  status: string;
}

export function PropostaAcoesEstudante({ propostaId, status }: PropostaAcoesEstudanteProps) {
  const router = useRouter();
  const [isPendingPublicar, startPublicar] = useTransition();
  const [isPendingExcluir, startExcluir] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const podePublicar = status === "RASCUNHO";
  const podeExcluir = status === "RASCUNHO" || status === "SUBMETIDA";

  const handlePublicar = () => {
    setErro(null);
    startPublicar(async () => {
      const res = await publicarPropostaAction(propostaId);
      if (res.sucesso) {
        router.refresh();
      } else {
        setErro(res.erro ?? "Erro ao submeter proposta.");
      }
    });
  };

  const handleExcluir = () => {
    setErro(null);
    startExcluir(async () => {
      const res = await excluirPropostaAction(propostaId);
      if (res.sucesso) {
        router.push("/propostas");
      } else {
        setErro(res.erro ?? "Erro ao excluir proposta.");
        setConfirmarExclusao(false);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Erro inline */}
      {erro && (
        <p className="w-full text-xs text-red-400 font-medium bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
          {erro}
        </p>
      )}

      {/* Botão Submeter para Avaliação (só rascunho) */}
      {podePublicar && (
        <button
          id="btn-submeter-proposta"
          onClick={handlePublicar}
          disabled={isPendingPublicar || isPendingExcluir}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/10 disabled:opacity-50"
        >
          {isPendingPublicar ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Submetendo...
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Submeter para Avaliação
            </>
          )}
        </button>
      )}

      {/* Botão Excluir */}
      {podeExcluir && !confirmarExclusao && (
        <button
          id="btn-excluir-proposta"
          onClick={() => setConfirmarExclusao(true)}
          disabled={isPendingPublicar || isPendingExcluir}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Excluir Proposta
        </button>
      )}

      {/* Confirmação de exclusão */}
      {confirmarExclusao && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2">
          <AlertTriangle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
          <span className="text-xs text-red-400 font-medium">Tem a certeza?</span>
          <button
            id="btn-confirmar-exclusao"
            onClick={handleExcluir}
            disabled={isPendingExcluir}
            className="ml-1 text-xs font-bold text-red-400 underline hover:text-red-300 disabled:opacity-50"
          >
            {isPendingExcluir ? <Loader2 className="h-3 w-3 animate-spin inline" /> : "Sim, excluir"}
          </button>
          <button
            onClick={() => setConfirmarExclusao(false)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
