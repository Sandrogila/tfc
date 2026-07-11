import { auth } from "@/auth";
import { propostaRepository } from "@/repositories/proposta.repository";
import { docenteRepository } from "@/repositories/docente.repository";
import { PropostaStatusBadge } from "@/components/propostas/PropostaStatusBadge";
import { AvaliacaoCoordenacaoForm } from "@/components/propostas/AvaliacaoCoordenacaoForm";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  GraduationCap,
  MessageSquare,
  BookOpen,
  ClipboardList,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { redirect, notFound } from "next/navigation";

export default async function GestaopropostasDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user || session.user.role !== "COORDENACAO") {
    redirect("/dashboard");
  }

  const [proposta, docentes] = await Promise.all([
    propostaRepository.findById(id),
    docenteRepository.findDisponiveis(),
  ]);

  if (!proposta) {
    notFound();
  }

  const dataCriacao = new Date(proposta.createdAt).toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const podeAvaliar = proposta.status === "SUBMETIDA" || proposta.status === "EM_REVISAO";

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Cabeçalho / navegação */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/gestao-propostas"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Propostas
        </Link>

        <PropostaStatusBadge status={proposta.status} className="text-sm px-3.5 py-1" />
      </div>

      {/* Título e metadados */}
      <div className="glass rounded-xl p-6 border border-border/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            Submetida em {dataCriacao}
          </span>
        </div>

        <h1 className="text-2xl font-black text-foreground leading-tight">{proposta.titulo}</h1>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border/40">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-primary" />
            Área: <strong className="text-foreground font-medium">{proposta.area}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-blue-400" />
            Estudante:{" "}
            <strong className="text-foreground font-medium">
              {proposta.estudante.name} ({proposta.estudante.numero ?? "Sem Nº"})
            </strong>
          </span>
          {proposta.orientadorPretendido && (
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-amber-400" />
              Orientador pretendido:{" "}
              <strong className="text-foreground font-medium">{proposta.orientadorPretendido.name}</strong>
            </span>
          )}
          {proposta.orientacao?.orientador && (
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              Orientador designado:{" "}
              <strong className="text-foreground font-medium">{proposta.orientacao.orientador.name}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Observações da Coordenação (se existirem) */}
      {proposta.observacoes && (
        <div className="rounded-xl bg-amber-500/10 p-5 border border-amber-500/20 space-y-2">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Observações da Coordenação
          </h3>
          <p className="text-sm text-amber-400/90 leading-relaxed pl-6 font-medium">
            {proposta.observacoes}
          </p>
        </div>
      )}

      {/* Justificativa de Rejeição (se existir) */}
      {proposta.status === "REJEITADA" && proposta.justificativaRecusa && (
        <div className="rounded-xl bg-red-500/10 p-5 border border-red-500/20 space-y-2">
          <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Motivo de Rejeição
          </h3>
          <p className="text-sm text-red-400/90 leading-relaxed pl-6 font-medium">
            {proposta.justificativaRecusa}
          </p>
        </div>
      )}

      {/* Status de Aprovação */}
      {proposta.status === "APROVADA" && (
        <div className="rounded-xl bg-emerald-500/10 p-5 border border-emerald-500/20 space-y-2">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Proposta Aprovada
          </h3>
          <p className="text-sm text-emerald-400/90 leading-relaxed pl-6 font-medium">
            {proposta.orientacao?.orientador
              ? `Orientador designado: ${proposta.orientacao.orientador.name}`
              : "Aguardando confirmação do orientador."}
          </p>
        </div>
      )}

      {/* Grid: conteúdo + avaliação */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Coluna principal — conteúdo da proposta */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass rounded-xl p-6 border border-border/40 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4 text-primary" />
              Resumo do Projeto
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {proposta.resumo}
            </p>
          </div>

          <div className="glass rounded-xl p-6 border border-border/40 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4 text-emerald-400" />
              Objetivos do Trabalho
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {proposta.objetivos}
            </p>
          </div>

          <div className="glass rounded-xl p-6 border border-border/40 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" />
              Descrição Detalhada &amp; Metodologia
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {proposta.descricao}
            </p>
          </div>
        </div>

        {/* Coluna lateral — painel de avaliação */}
        <div className="lg:col-span-2">
          <div className="glass rounded-xl p-6 border border-border/40 space-y-5 sticky top-6">
            <div>
              <h2 className="text-base font-bold text-foreground">Painel de Avaliação</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {podeAvaliar
                  ? "Analise a proposta e registe a sua decisão."
                  : "Esta proposta já foi avaliada e não pode ser alterada neste painel."}
              </p>
            </div>

            {podeAvaliar ? (
              <AvaliacaoCoordenacaoForm
                propostaId={proposta.id}
                docentes={docentes}
                orientadorAtualId={proposta.orientadorPreferidoId}
              />
            ) : (
              <div className="rounded-lg bg-secondary/40 p-4 border border-border/40 text-center space-y-1">
                <PropostaStatusBadge status={proposta.status} className="mx-auto" />
                <p className="text-xs text-muted-foreground mt-2">
                  Estado final registado. Consulte o histórico para detalhes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
