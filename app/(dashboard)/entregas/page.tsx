import { auth } from "@/auth";
import { propostaRepository } from "@/repositories/proposta.repository";
import { entregaRepository } from "@/repositories/entrega.repository";
import { EntregaCard } from "@/components/entregas/EntregaCard";
import Link from "next/link";
import { Info, Upload } from "lucide-react";
import { redirect } from "next/navigation";

export default async function EstudanteEntregasPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ESTUDANTE") {
    redirect("/login");
  }

  // Busca as propostas do estudante
  const propostas = await propostaRepository.findByEstudante(session.user.id);
  // Apenas propostas APROVADAS podem receber entregas (devem ter orientador)
  const propostaAprovada = propostas.find((p) => p.status === "APROVADA");

  if (!propostaAprovada) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Entregas de Documentos</h1>
          <p className="text-sm text-muted-foreground">
            Submeta os seus relatórios e acompanhe os feedbacks do seu orientador.
          </p>
        </div>

        <div className="glass rounded-xl p-8 text-center max-w-lg mx-auto border border-border/40 space-y-4">
          <div className="rounded-full bg-amber-500/10 p-3 w-12 h-12 flex items-center justify-center mx-auto">
            <Info className="h-6 w-6 text-amber-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Sem Orientação Aprovada</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Só é possível submeter entregas de documentos após ter uma proposta de TFC **Aprovada** e um orientador associado.
            </p>
          </div>
          <Link
            href="/propostas"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95"
          >
            Ver Propostas
          </Link>
        </div>
      </div>
    );
  }

  const entregas = await entregaRepository.findByProposta(propostaAprovada.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Entregas de Documentos</h1>
          <p className="text-sm text-muted-foreground">
            Gestão de entregas para o TFC: <strong className="text-foreground font-semibold">{propostaAprovada.titulo}</strong>
          </p>
        </div>

        <Link
          href="/entregas/nova"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
        >
          <Upload className="h-4 w-4" />
          Submeter Ficheiro
        </Link>
      </div>

      {entregas.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center max-w-lg mx-auto border border-border/40 space-y-4">
          <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mx-auto">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Nenhuma entrega registada</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ainda não submeteu nenhum documento para este trabalho. Submeta o seu Pré-projeto, Relatório Parcial ou Versão Final em PDF.
            </p>
          </div>
          <Link
            href="/entregas/nova"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95"
          >
            Fazer Upload PDF
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {entregas.map((entrega) => (
            <EntregaCard
              key={entrega.id}
              entrega={entrega as unknown as Parameters<typeof EntregaCard>[0]["entrega"]}
              role="ESTUDANTE"
            />
          ))}
        </div>
      )}
    </div>
  );
}
