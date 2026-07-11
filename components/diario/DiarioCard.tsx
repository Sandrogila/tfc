import { Calendar, User, Compass, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiarioCardProps {
  entrada: {
    id: string;
    data: Date;
    resumo: string;
    proximasMetas: string;
    autor: {
      name: string;
      role: "ESTUDANTE" | "DOCENTE" | "COORDENACAO";
    };
  };
}

export function DiarioCard({ entrada }: DiarioCardProps) {
  const dataFormatada = new Date(entrada.data).toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const autorRoleLabel =
    entrada.autor.role === "ESTUDANTE"
      ? "Estudante"
      : entrada.autor.role === "DOCENTE"
        ? "Orientador"
        : "Coordenação";

  const autorCor =
    entrada.autor.role === "ESTUDANTE" ? "text-blue-400 bg-blue-500/10" : "text-emerald-400 bg-emerald-500/10";

  return (
    <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
        <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-primary" />
          {dataFormatada}
        </span>
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">{entrada.autor.name}</span>
          <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", autorCor)}>
            {autorRoleLabel}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="space-y-4">
        {/* Resumo */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-primary" />
            Resumo do Trabalho / Reunião
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed pl-5 whitespace-pre-line">
            {entrada.resumo}
          </p>
        </div>

        {/* Metas */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Target className="h-4 w-4 text-emerald-400" />
            Próximas Metas Planeadas
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed pl-5 whitespace-pre-line">
            {entrada.proximasMetas}
          </p>
        </div>
      </div>
    </div>
  );
}
