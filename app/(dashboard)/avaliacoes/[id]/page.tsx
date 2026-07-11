import { auth } from "@/auth";
import { entregaRepository } from "@/repositories/entrega.repository";
import { AvaliacaoForm } from "@/components/entregas/AvaliacaoForm";
import Link from "next/link";
import { ArrowLeft, FileText, User, BookOpen, Clock } from "lucide-react";
import { redirect, notFound } from "next/navigation";

export default async function AvaliarEntregaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "DOCENTE") {
    redirect("/login");
  }

  const entrega = await entregaRepository.findById(id);

  if (!entrega) {
    notFound();
  }

  // Verifica se o docente é o orientador do estudante
  if (entrega.proposta.orientacao?.orientadorId !== session.user.id) {
    redirect("/avaliacoes");
  }

  const dataEntrega = entrega.entregueEm
    ? new Date(entrega.entregueEm).toLocaleDateString("pt-AO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Não informado";

  const tipoLabels: Record<string, string> = {
    PRE_PROJETO: "Pré-Projeto",
    PARCIAL: "Relatório Parcial",
    FINAL: "Documento Final",
  };

  return (
    <div className="space-y-6">
      {/* Voltar */}
      <div>
        <Link
          href="/avaliacoes"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Lista
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Info Entrega */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-xl p-6 border border-border/40 space-y-4">
            <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary inline-block">
              {tipoLabels[entrega.tipo] || entrega.tipo}
            </span>

            <h1 className="text-xl font-bold text-foreground leading-tight">
              Avaliar: {entrega.titulo}
            </h1>

            {entrega.descricao && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {entrega.descricao}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-3 border-t border-border/40">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-blue-400" />
                Estudante: <strong className="text-foreground font-medium">{entrega.proposta.estudante.name}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                Entregue em: <strong className="text-foreground font-medium">{dataEntrega}</strong>
              </span>
            </div>

            {/* Ficheiro PDF */}
            {entrega.urlFicheiro && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/40 mt-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-lg bg-red-500/10 p-2 text-red-400 shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {entrega.nomeArquivo || "documento.pdf"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {entrega.tamanhoBytes ? Math.round(entrega.tamanhoBytes / 1024) : 0} KB
                    </p>
                  </div>
                </div>
                <Link
                  href={entrega.urlFicheiro}
                  target="_blank"
                  className="rounded-lg bg-secondary px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  Ler Ficheiro PDF
                </Link>
              </div>
            )}
          </div>

          <AvaliacaoForm entregaId={id} />
        </div>

        {/* Info Orientação / Contexto */}
        <div className="space-y-6">
          <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" />
              Contexto do TFC
            </h3>
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <div className="space-y-0.5">
                <span className="font-bold text-foreground">Tema do Trabalho</span>
                <p>{entrega.proposta.titulo}</p>
              </div>
              <div className="space-y-0.5 pt-2 border-t border-border/40">
                <span className="font-bold text-foreground">Área Científica</span>
                <p>{entrega.proposta.area}</p>
              </div>
              <div className="space-y-0.5 pt-2 border-t border-border/40">
                <span className="font-bold text-foreground">Estudante</span>
                <p>
                  {entrega.proposta.estudante.name} (Nº {entrega.proposta.estudante.numero || "N/A"})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
