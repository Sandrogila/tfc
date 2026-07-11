import { auth } from "@/auth";
import { propostaRepository } from "@/repositories/proposta.repository";
import { PropostaCard } from "@/components/propostas/PropostaCard";
import { Info, BarChart3, Users, GraduationCap, FileCheck } from "lucide-react";
import { redirect } from "next/navigation";

export default async function GestaoPropostasPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "COORDENACAO") {
    redirect("/login");
  }

  // Busca todas as propostas do sistema
  const propostas = await propostaRepository.findAll();

  // Estatísticas rápidas
  const total = propostas.length;
  const aprovadas = propostas.filter((p) => p.status === "APROVADA").length;
  const pendentes = propostas.filter((p) => p.status === "SUBMETIDA" || p.status === "EM_REVISAO").length;
  const recusadas = propostas.filter((p) => p.status === "REJEITADA").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Acompanhamento de Propostas</h1>
        <p className="text-sm text-muted-foreground">
          Consulte o progresso de submissões e orientações ativas no IMETRO.
        </p>
      </div>

      {/* Cards de Métricas rápidas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Submissões", value: total, icon: BarChart3, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Aprovadas / Ativas", value: aprovadas, icon: FileCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Pendentes Revisão", value: pendentes, icon: Users, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Recusadas / Devolvidas", value: recusadas, icon: GraduationCap, color: "text-red-400", bg: "bg-red-500/10" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass rounded-xl p-4 border border-border/40 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">{card.label}</span>
                <span className="text-xl font-bold text-foreground">{card.value}</span>
              </div>
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {propostas.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center max-w-lg mx-auto border border-border/40 space-y-4">
          <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mx-auto">
            <Info className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Nenhuma proposta submetida</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O sistema não regista nenhuma proposta de TFC de estudantes até ao momento.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {propostas.map((proposta) => (
            <PropostaCard
              key={proposta.id}
              proposta={proposta as unknown as Parameters<typeof PropostaCard>[0]["proposta"]}
              role="COORDENACAO"
            />
          ))}
        </div>
      )}
    </div>
  );
}
