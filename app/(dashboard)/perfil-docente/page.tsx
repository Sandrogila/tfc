import { auth } from "@/auth";
import { docenteRepository } from "@/repositories/docente.repository";
import { PerfilDocenteForm } from "@/components/docente/PerfilDocenteForm";
import { redirect } from "next/navigation";

export default async function PerfilDocentePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "DOCENTE") {
    redirect("/login");
  }

  const docente = await docenteRepository.findById(session.user.id);

  if (!docente) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Perfil de Orientação</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie a sua especialidade científica e a sua disponibilidade para orientar novos projectos (RF02).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <PerfilDocenteForm
            especialidade={docente.especialidade}
            disponivel={docente.disponivel}
          />
        </div>

        <div className="glass rounded-xl p-5 border border-border/40 h-fit space-y-3.5">
          <h3 className="text-sm font-bold text-foreground">Regras de Orientação</h3>
          <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4 leading-relaxed">
            <li>
              A sua **especialidade** será exibida para os estudantes no momento em que criam propostas de TFC.
            </li>
            <li>
              Ao desativar a sua **disponibilidade**, o seu nome deixará de constar na lista de orientadores preferidos para novos projetos.
            </li>
            <li>
              **Regra de Limite (RF05)**: O sistema impõe um limite máximo de **5 orientações ativas** por docente. Não será possível aceitar novos estudantes se atingir este limite.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
