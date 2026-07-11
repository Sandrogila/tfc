import { auth } from "@/auth";
import { propostaRepository } from "@/repositories/proposta.repository";
import { PropostaCard } from "@/components/propostas/PropostaCard";
import { ClipboardList, GraduationCap } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DocenteOrientacoesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "DOCENTE") {
    redirect("/login");
  }

  // Busca propostas em que o orientador foi selecionado ou já está orientando
  const propostas = await propostaRepository.findPropostasParaOrientador(session.user.id);

  // Divide entre propostas pendentes (SUBMETIDA) e orientações em andamento (APROVADA)
  const pendentes = propostas.filter((p) => p.status === "SUBMETIDA");
  const ativas = propostas.filter((p) => p.status === "APROVADA");

  return (
    <div className="space-y-8">
      {/* Seção Propostas Pendentes de Aceitação */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Solicitações de Orientação</h1>
          <p className="text-sm text-muted-foreground">
            Novas propostas de estudantes que solicitaram a sua orientação (RF03, RF04).
          </p>
        </div>

        {pendentes.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center max-w-md border border-border/40 space-y-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground">
              Não tem nenhuma solicitação de orientação pendente neste momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendentes.map((proposta) => (
              <PropostaCard
                key={proposta.id}
                proposta={proposta as unknown as Parameters<typeof PropostaCard>[0]["proposta"]}
                role="DOCENTE"
              />
            ))}
          </div>
        )}
      </div>

      {/* Seção Orientações Ativas */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div>
          <h2 className="text-xl font-bold text-foreground">Estudantes Orientados ({ativas.length} de 5)</h2>
          <p className="text-sm text-muted-foreground">
            Trabalhos de Fim de Curso sob a sua orientação ativa (RF05).
          </p>
        </div>

        {ativas.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center max-w-md border border-border/40 space-y-2">
            <GraduationCap className="h-5 w-5 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground">
              Ainda não possui orientações ativas registadas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ativas.map((proposta) => (
              <PropostaCard
                key={proposta.id}
                proposta={proposta as unknown as Parameters<typeof PropostaCard>[0]["proposta"]}
                role="DOCENTE"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
