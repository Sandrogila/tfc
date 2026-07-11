import Link from "next/link";
import { PropostaStatusBadge } from "./PropostaStatusBadge";
import { Calendar, User, BookOpen, ArrowRight } from "lucide-react";

import { StatusProposta } from "@prisma/client";

interface PropostaCardProps {
  proposta: {
    id: string;
    titulo: string;
    resumo: string;
    area: string;
    status: StatusProposta;
    createdAt: Date;
    estudante?: { name: string; numero: string | null };
    orientacao?: {
      orientador: { name: string };
    } | null;
  };
  role: "ESTUDANTE" | "DOCENTE" | "COORDENACAO";
}

export function PropostaCard({ proposta, role }: PropostaCardProps) {
  const dataCriacao = new Date(proposta.createdAt).toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // URL de visualização varia dependendo do perfil
  const detailUrl =
    role === "DOCENTE"
      ? `/orientacoes/${proposta.id}`
      : role === "COORDENACAO"
        ? `/gestao-propostas/${proposta.id}`
        : `/propostas/${proposta.id}`;

  return (
    <div className="glass rounded-xl p-5 hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full border border-border/40">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <PropostaStatusBadge status={proposta.status} />
          <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {dataCriacao}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground line-clamp-2 leading-snug">
            {proposta.titulo}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
            {proposta.resumo}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/40 flex flex-col gap-3">
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            <span>Área: <strong className="text-foreground font-medium">{proposta.area}</strong></span>
          </div>

          {role !== "ESTUDANTE" && proposta.estudante && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <User className="h-3.5 w-3.5 shrink-0 text-blue-400/70" />
              <span className="truncate">
                Estudante: <strong className="text-foreground font-medium">{proposta.estudante.name}</strong>
                {proposta.estudante.numero && ` (${proposta.estudante.numero})`}
              </span>
            </div>
          )}

          {proposta.orientacao?.orientador && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <User className="h-3.5 w-3.5 shrink-0 text-emerald-400/70" />
              <span className="truncate">
                Orientador: <strong className="text-foreground font-medium">{proposta.orientacao.orientador.name}</strong>
              </span>
            </div>
          )}
        </div>

        <Link
          href={detailUrl}
          className="inline-flex items-center justify-center gap-1.5 w-full rounded-lg bg-secondary py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          Ver Detalhes
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
