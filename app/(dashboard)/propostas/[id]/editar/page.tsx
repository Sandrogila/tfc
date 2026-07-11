import { auth } from "@/auth";
import { propostaRepository } from "@/repositories/proposta.repository";
import { PropostaForm } from "@/components/propostas/PropostaForm";
import { docenteRepository } from "@/repositories/docente.repository";
import { redirect, notFound } from "next/navigation";

export default async function EditarPropostaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ESTUDANTE") {
    redirect("/login");
  }

  const proposta = await propostaRepository.findById(id);

  if (!proposta) {
    notFound();
  }

  if (proposta.estudanteId !== session.user.id) {
    redirect("/propostas");
  }

  // Apenas RASCUNHO ou SUBMETIDA podem ser editadas (RF03)
  if (proposta.status !== "RASCUNHO" && proposta.status !== "SUBMETIDA") {
    redirect(`/propostas/${id}`);
  }

  const docentes = await docenteRepository.findDisponiveis();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Editar Proposta</h1>
        <p className="text-sm text-muted-foreground">
          Edite a proposta enquanto ela estiver pendente de avaliação.
        </p>
      </div>

      <PropostaForm proposta={proposta as unknown as Parameters<typeof PropostaForm>[0]["proposta"]} docentes={docentes} />
    </div>
  );
}
