import { StatusProposta } from "@prisma/client";
import { cn } from "@/lib/utils";

interface PropostaStatusBadgeProps {
  status: StatusProposta;
  className?: string;
}

export function PropostaStatusBadge({ status, className }: PropostaStatusBadgeProps) {
  const configs: Record<StatusProposta, { label: string; classes: string }> = {
    RASCUNHO: {
      label: "Rascunho",
      classes: "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20",
    },
    SUBMETIDA: {
      label: "Submetida",
      classes: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    },
    EM_REVISAO: {
      label: "Em Revisão",
      classes: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    },
    APROVADA: {
      label: "Aprovada",
      classes: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    },
    REJEITADA: {
      label: "Recusada",
      classes: "bg-red-500/10 text-red-400 ring-red-500/20",
    },
    CANCELADA: {
      label: "Cancelada",
      classes: "bg-zinc-800 text-zinc-500 ring-zinc-800/30",
    },
  };

  const config = configs[status] || {
    label: status,
    classes: "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        config.classes,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
