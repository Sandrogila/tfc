import { auth } from "@/auth";
import { propostaRepository } from "@/repositories/proposta.repository";
import { NovaEntregaForm } from "@/components/entregas/NovaEntregaForm";
import { redirect } from "next/navigation";

export default async function NovaEntregaPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ESTUDANTE") {
    redirect("/login");
  }

  // Busca propostas do estudante
  const propostas = await propostaRepository.findByEstudante(session.user.id);
  const propostaAprovada = propostas.find((p) => p.status === "APROVADA");

  if (!propostaAprovada) {
    redirect("/entregas");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Nova Entrega de Documento</h1>
        <p className="text-sm text-muted-foreground">
          Envie o documento PDF da respectiva fase do seu Trabalho de Fim de Curso.
        </p>
      </div>

      <NovaEntregaForm propostaId={propostaAprovada.id} />
    </div>
  );
}
