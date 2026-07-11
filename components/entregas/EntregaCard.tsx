import { FileText, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EntregaCardProps {
  entrega: {
    id: string;
    titulo: string;
    descricao: string | null;
    tipo: "PRE_PROJETO" | "PARCIAL" | "FINAL";
    status: string;
    urlFicheiro: string | null;
    nomeArquivo: string | null;
    tamanhoBytes: number | null;
    nota: number | null;
    comentarioOrientador: string | null;
    entregueEm: Date | null;
    avaliadoEm: Date | null;
  };
  role: "ESTUDANTE" | "DOCENTE";
}

export function EntregaCard({ entrega, role }: EntregaCardProps) {
  const dataEntrega = entrega.entregueEm
    ? new Date(entrega.entregueEm).toLocaleDateString("pt-AO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Não entregue";

  const dataAvaliacao = entrega.avaliadoEm
    ? new Date(entrega.avaliadoEm).toLocaleDateString("pt-AO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const configs: Record<string, { label: string; bg: string; text: string; border: string }> = {
    PENDENTE: {
      label: "Pendente",
      bg: "bg-zinc-500/10",
      text: "text-zinc-400",
      border: "border-zinc-500/20",
    },
    ENTREGUE: {
      label: "Entregue (Aguardando Avaliação)",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
    },
    EM_AVALIACAO: {
      label: "Em Avaliação",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
    },
    APROVADA: {
      label: "Aprovada",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    REJEITADA: {
      label: "Recusada",
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
    },
    REENTREGA_SOLICITADA: {
      label: "Reentrega Solicitada",
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
    },
  };

  const statusConfig = configs[entrega.status] || {
    label: entrega.status,
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/20",
  };

  const tipoLabels: Record<string, string> = {
    PRE_PROJETO: "Pré-Projeto",
    PARCIAL: "Relatório Parcial",
    FINAL: "Documento Final",
  };

  const tamanhoKB = entrega.tamanhoBytes ? Math.round(entrega.tamanhoBytes / 1024) : 0;

  return (
    <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
      {/* Topo */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {tipoLabels[entrega.tipo] || entrega.tipo}
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
            statusConfig.bg,
            statusConfig.text,
            statusConfig.border,
          )}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Título & Descrição */}
      <div className="space-y-1">
        <h4 className="text-base font-bold text-foreground">{entrega.titulo}</h4>
        {entrega.descricao && (
          <p className="text-sm text-muted-foreground leading-relaxed">{entrega.descricao}</p>
        )}
      </div>

      {/* Arquivo PDF */}
      {entrega.urlFicheiro && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg bg-red-500/10 p-2 shrink-0">
              <FileText className="h-5 w-5 text-red-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {entrega.nomeArquivo || "documento.pdf"}
              </p>
              <p className="text-[10px] text-muted-foreground">{tamanhoKB} KB</p>
            </div>
          </div>
          <Link
            href={entrega.urlFicheiro}
            target="_blank"
            className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors shrink-0"
          >
            Visualizar PDF
          </Link>
        </div>
      )}

      {/* Info Entrega */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
        <Clock className="h-4 w-4" />
        <span>Submetido em: <strong className="text-foreground font-medium">{dataEntrega}</strong></span>
      </div>

      {/* Avaliação (RF07) */}
      {(entrega.nota !== null || entrega.comentarioOrientador) && (
        <div className="mt-4 pt-4 border-t border-border/40 space-y-3">
          <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Avaliação do Orientador
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {entrega.nota !== null && (
              <div className="glass rounded-lg p-3 border border-border/60 flex flex-col justify-center items-center text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Nota do TFC
                </span>
                <span
                  className={cn(
                    "text-2xl font-black mt-1",
                    entrega.nota >= 10 ? "text-emerald-400" : "text-red-400",
                  )}
                >
                  {entrega.nota.toFixed(1)}
                  <span className="text-xs text-muted-foreground font-normal"> /20</span>
                </span>
              </div>
            )}

            {entrega.comentarioOrientador && (
              <div className="md:col-span-3 glass rounded-lg p-3.5 border border-border/60">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Comentário
                  </span>
                  {dataAvaliacao && (
                    <span className="text-[9px] text-muted-foreground ml-auto">
                      Avaliado em {dataAvaliacao}
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  {entrega.comentarioOrientador}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {role === "DOCENTE" && entrega.status === "ENTREGUE" && (
        <div className="pt-2">
          <Link
            href={`/avaliacoes/${entrega.id}`}
            className="inline-flex items-center justify-center w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 transition-all"
          >
            Avaliar esta Entrega
          </Link>
        </div>
      )}
    </div>
  );
}
