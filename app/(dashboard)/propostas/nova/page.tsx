import { auth } from "@/auth";
import { docenteRepository } from "@/repositories/docente.repository";
import { PropostaForm } from "@/components/propostas/PropostaForm";
import { redirect } from "next/navigation";

export default async function NovaPropostaPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ESTUDANTE") {
    redirect("/login");
  }

  // Lista os orientadores disponíveis (especialidade e disponibilidade) para preencher a selectbox
  const docentes = await docenteRepository.findDisponiveis();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Submeter Proposta TFC</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados do seu projecto e selecione o orientador pretendido.
        </p>
      </div>

      <PropostaForm docentes={docentes} />
    </div>
  );
}
