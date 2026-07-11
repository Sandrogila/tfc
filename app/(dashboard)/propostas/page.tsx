import { auth } from "@/auth";
import { propostaRepository } from "@/repositories/proposta.repository";
import { PropostaCard } from "@/components/propostas/PropostaCard";
import Link from "next/link";
import { PlusCircle, FileText } from "lucide-react";
import { redirect } from "next/navigation";

export default async function EstudantePropostasPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Apenas estudantes acessam esta versão da página
  if (session.user.role !== "ESTUDANTE") {
    redirect("/orientacoes"); // Docentes vão para orientacoes
  }

  const propostas = await propostaRepository.findByEstudante(session.user.id);

  // Regra: pode criar nova se não tiver proposta ativa (SUBMETIDA, APROVADA, EM_REVISAO)
  const temPropostaAtiva = propostas.some(
    (p) => p.status === "APROVADA" || p.status === "SUBMETIDA" || p.status === "EM_REVISAO",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">As Minhas Propostas</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre e acompanhe o estado das suas propostas de Trabalho de Fim de Curso.
          </p>
        </div>

        {!temPropostaAtiva && (
          <Link
            href="/propostas/nova"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
          >
            <PlusCircle className="h-4 w-4" />
            Nova Proposta
          </Link>
        )}
      </div>

      {propostas.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center max-w-lg mx-auto border border-border/40 space-y-4">
          <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mx-auto">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Nenhuma proposta cadastrada</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ainda não submeteu nenhuma proposta de TFC. Clique no botão acima para submeter a sua primeira proposta de trabalho.
            </p>
          </div>
          <Link
            href="/propostas/nova"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95"
          >
            Cadastrar Proposta
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {propostas.map((proposta) => (
            <PropostaCard
              key={proposta.id}
              proposta={proposta as unknown as Parameters<typeof PropostaCard>[0]["proposta"]}
              role="ESTUDANTE"
            />
          ))}
        </div>
      )}
    </div>
  );
}
