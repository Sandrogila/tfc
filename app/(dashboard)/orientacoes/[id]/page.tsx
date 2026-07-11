import { auth } from "@/auth";
import { propostaRepository } from "@/repositories/proposta.repository";
import { PropostaStatusBadge } from "@/components/propostas/PropostaStatusBadge";
import { aceitarPropostaAction, recusarPropostaAction } from "@/actions/proposta.actions";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { redirect, notFound } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function DocentePropostaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "DOCENTE") {
    redirect("/login");
  }

  const proposta = await propostaRepository.findById(id);

  if (!proposta) {
    notFound();
  }

  // Verifica se o docente é o orientador pretendido ou atual
  const eOrientadorAtivo = proposta.orientacao?.orientadorId === session.user.id;
  const eOrientadorPretendido = proposta.orientadorPreferidoId === session.user.id;

  if (!eOrientadorAtivo && !eOrientadorPretendido) {
    redirect("/orientacoes");
  }

  const dataCriacao = new Date(proposta.createdAt).toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const totalOrientacoes = await propostaRepository.countOrientacoesAtivas(session.user.id);
  const limiteAtingido = totalOrientacoes >= 5;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Voltar */}
      <div>
        <Link
          href="/orientacoes"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Lista
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="glass rounded-xl p-6 border border-border/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PropostaStatusBadge status={proposta.status} className="text-sm px-3.5 py-1" />
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            Recebido em {dataCriacao}
          </span>
        </div>

        <h1 className="text-2xl font-black text-foreground leading-tight">{proposta.titulo}</h1>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border/40">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-blue-400" />
            Estudante:{" "}
            <strong className="text-foreground font-medium">
              {proposta.estudante.name} ({proposta.estudante.numero || "Sem Nº"})
            </strong>
          </span>
          <span className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-emerald-400" />
            Docente Selecionado:{" "}
            <strong className="text-foreground font-medium">{session.user.name}</strong>
          </span>
        </div>
      </div>

      {/* Alerta de limite atingido (RF05) */}
      {proposta.status === "SUBMETIDA" && limiteAtingido && (
        <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/20 flex gap-3 text-amber-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold">Limite de orientações atingido</p>
            <p className="text-xs text-amber-400/90 leading-relaxed">
              Atualmente orienta **5 estudantes ativos**. Não pode aceitar novas propostas sem antes concluir orientações existentes ou transferi-las.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Corpo principal */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass rounded-xl p-6 border border-border/40 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Resumo do Trabalho
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {proposta.resumo}
            </p>
          </div>

          <div className="glass rounded-xl p-6 border border-border/40 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Objetivos do Trabalho
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {proposta.objetivos}
            </p>
          </div>

          <div className="glass rounded-xl p-6 border border-border/40 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Descrição e Metodologia
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {proposta.descricao}
            </p>
          </div>
        </div>

        {/* Barra lateral / Painel de Decisão (RF04, RF05) */}
        <div className="space-y-6">
          {proposta.status === "SUBMETIDA" ? (
            <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Avaliação da Proposta</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Analise o trabalho e selecione uma decisão. Ao recusar, informe obrigatoriamente a justificativa.
              </p>

              {/* Botão Aceitar (Só habilitado se docente tiver < 5 orientações) */}
              <form action={async () => {
                "use server";
                await aceitarPropostaAction(id);
              }}>
                <button
                  type="submit"
                  disabled={limiteAtingido}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-bold text-emerald-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/10 cursor-pointer",
                    limiteAtingido && "opacity-50 pointer-events-none",
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Aceitar Orientação
                </button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border/60"></div>
                <span className="flex-shrink mx-4 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">OU</span>
                <div className="flex-grow border-t border-border/60"></div>
              </div>

              {/* Formulário de Recusa (RF04) */}
              <form
                action={async (formData: FormData) => {
                  "use server";
                  await recusarPropostaAction(null, formData);
                }}
                className="space-y-3.5"
              >
                <input type="hidden" name="propostaId" value={id} />
                <div className="space-y-1">
                  <label htmlFor="justificativaRecusa" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Justificativa de Recusa
                  </label>
                  <textarea
                    id="justificativaRecusa"
                    name="justificativaRecusa"
                    required
                    rows={4}
                    placeholder="Indique os motivos da recusa de orientação..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs transition-all focus:border-primary outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  Recusar e Devolver
                </button>
              </form>
            </div>
          ) : (
            <div className="glass rounded-xl p-5 border border-border/40 space-y-3.5">
              <h3 className="text-sm font-bold text-foreground">Status do Projecto</h3>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Resultado da Proposta</span>
                <p className="text-xs text-muted-foreground">
                  Esta proposta já foi avaliada e encontra-se no estado:
                </p>
                <div className="pt-2">
                  <PropostaStatusBadge status={proposta.status} />
                </div>
              </div>

              {proposta.justificativaRecusa && (
                <div className="space-y-1 pt-3 border-t border-border/40">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block text-red-400">
                    Justificativa de Recusa
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    &ldquo;{proposta.justificativaRecusa}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
