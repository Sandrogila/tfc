import { auth } from "@/auth";
import { propostaRepository } from "@/repositories/proposta.repository";
import { PropostaStatusBadge } from "@/components/propostas/PropostaStatusBadge";
import { PropostaAcoesEstudante } from "@/components/propostas/PropostaAcoesEstudante";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  GraduationCap,
  MessageSquare,
  BookOpen,
  Edit,
  ClipboardList,
} from "lucide-react";
import { redirect, notFound } from "next/navigation";

export default async function PropostaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const proposta = await propostaRepository.findById(id);

  if (!proposta) {
    notFound();
  }

  // Permissões: apenas estudante proprietário ou coordenação/docentes associados
  const eEstudanteProprietario = proposta.estudanteId === session.user.id;
  const eOrientador = proposta.orientacao?.orientadorId === session.user.id;
  const eOrientadorPretendido = proposta.orientadorPreferidoId === session.user.id;
  const eCoordenador = session.user.role === "COORDENACAO";

  if (!eEstudanteProprietario && !eOrientador && !eOrientadorPretendido && !eCoordenador) {
    redirect("/propostas");
  }

  const dataCriacao = new Date(proposta.createdAt).toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Botão voltar e acções rápidos */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href={session.user.role === "ESTUDANTE" ? "/propostas" : "/orientacoes"}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Lista
        </Link>

        {/* Botões de ação do estudante proprietário */}
        {session.user.role === "ESTUDANTE" && eEstudanteProprietario && (
          <div className="flex flex-wrap items-center gap-3">
            {(proposta.status === "RASCUNHO" || proposta.status === "SUBMETIDA") && (
              <Link
                href={`/propostas/${proposta.id}/editar`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
              >
                <Edit className="h-3.5 w-3.5" />
                Editar Proposta
              </Link>
            )}
            <PropostaAcoesEstudante propostaId={proposta.id} status={proposta.status} />
          </div>
        )}
      </div>


      {/* Cabeçalho */}
      <div className="glass rounded-xl p-6 border border-border/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PropostaStatusBadge status={proposta.status} className="text-sm px-3.5 py-1" />
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            Cadastrado em {dataCriacao}
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
              {proposta.estudante.name} ({proposta.estudante.numero || "Sem Nº"})
            </strong>
          </span>
          {proposta.orientacao?.orientador && (
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              Orientador:{" "}
              <strong className="text-foreground font-medium">{proposta.orientacao.orientador.name}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Justificativa de Recusa (RF04) */}
      {proposta.status === "REJEITADA" && proposta.justificativaRecusa && (
        <div className="rounded-xl bg-red-500/10 p-5 border border-red-500/20 space-y-2">
          <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-red-400" />
            Justificativa de Recusa do Orientador
          </h3>
          <p className="text-sm text-red-400/90 leading-relaxed pl-6 font-medium">
            {proposta.justificativaRecusa}
          </p>
        </div>
      )}

      {/* Corpo da proposta */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Resumo */}
          <div className="glass rounded-xl p-6 border border-border/40 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4 text-primary" />
              Resumo do Projeto
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {proposta.resumo}
            </p>
          </div>

          {/* Objetivos */}
          <div className="glass rounded-xl p-6 border border-border/40 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4 text-emerald-400" />
              Objetivos do Trabalho
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {proposta.objetivos}
            </p>
          </div>

          {/* Descrição e Metodologia */}
          <div className="glass rounded-xl p-6 border border-border/40 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" />
              Descrição Detalhada & Metodologia
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {proposta.descricao}
            </p>
          </div>
        </div>

        {/* Sidebar de Relações */}
        <div className="space-y-6">
          <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Informações de Orientação</h3>

            <div className="space-y-3.5">
              {proposta.orientadorPretendido && (
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Docente Pretendido
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {proposta.orientadorPretendido.name}
                  </p>
                  {proposta.orientadorPretendido.especialidade && (
                    <p className="text-xs text-muted-foreground italic">
                      {proposta.orientadorPretendido.especialidade}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Ano Académico
                </span>
                <p className="text-sm font-semibold text-foreground">{proposta.ano}</p>
              </div>

              {proposta.orientacao && (
                <div className="space-y-1 pt-1.5 border-t border-border/40">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider text-emerald-400">
                    Orientação Ativa
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Este projeto possui uma orientação ativa aprovada. Pode agora submeter entregas e registar diários de bordo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
