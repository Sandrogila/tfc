import { auth } from "@/auth";
import { propostaRepository } from "@/repositories/proposta.repository";
import { DiarioForm } from "@/components/diario/DiarioForm";
import { redirect } from "next/navigation";

export default async function NovaEntradaDiarioPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ESTUDANTE") {
    redirect("/login");
  }

  // Busca propostas do estudante
  const propostas = await propostaRepository.findByEstudante(session.user.id);
  const propostaAprovada = propostas.find((p) => p.status === "APROVADA");

  if (!propostaAprovada) {
    redirect("/diario");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Registar Sessão / Reunião</h1>
        <p className="text-sm text-muted-foreground">
          Adicione um registo detalhado do progresso e as metas combinadas com o seu orientador.
        </p>
      </div>

      <DiarioForm propostaId={propostaAprovada.id} />
    </div>
  );
}
