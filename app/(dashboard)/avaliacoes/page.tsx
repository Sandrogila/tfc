import { auth } from "@/auth";
import { entregaRepository } from "@/repositories/entrega.repository";
import { EntregaCard } from "@/components/entregas/EntregaCard";
import { Info, ClipboardList } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DocenteAvaliacoesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "DOCENTE") {
    redirect("/login");
  }

  // Busca entregas de estudantes orientados por este docente
  const entregas = await entregaRepository.findEntregasParaAvaliar(session.user.id);

  // Divide entre entregas pendentes de avaliação (ENTREGUE) e entregas já avaliadas
  const pendentes = entregas.filter(
    (e) => e.status === "ENTREGUE" || e.status === "EM_AVALIACAO",
  );
  const avaliadas = entregas.filter(
    (e) => e.status === "APROVADA" || e.status === "REJEITADA" || e.status === "REENTREGA_SOLICITADA",
  );

  return (
    <div className="space-y-8">
      {/* Pendentes de Avaliação */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Entregas a Avaliar</h1>
          <p className="text-sm text-muted-foreground">
            Documentos PDF submetidos pelos seus estudantes orientados aguardando avaliação (RF06, RF07).
          </p>
        </div>

        {pendentes.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center max-w-md border border-border/40 space-y-2">
            <Info className="h-5 w-5 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground">
              Não tem nenhuma entrega aguardando avaliação neste momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {pendentes.map((entrega) => (
              <EntregaCard
                key={entrega.id}
                entrega={entrega as unknown as Parameters<typeof EntregaCard>[0]["entrega"]}
                role="DOCENTE"
              />
            ))}
          </div>
        )}
      </div>

      {/* Histórico de Avaliações */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div>
          <h2 className="text-xl font-bold text-foreground">Histórico de Notas e Avaliações</h2>
          <p className="text-sm text-muted-foreground">
            Documentos avaliados anteriormente com comentários e notas registadas.
          </p>
        </div>

        {avaliadas.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center max-w-md border border-border/40 space-y-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground">
              Ainda não efetuou nenhuma avaliação de entregas.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {avaliadas.map((entrega) => (
              <EntregaCard
                key={entrega.id}
                entrega={entrega as unknown as Parameters<typeof EntregaCard>[0]["entrega"]}
                role="DOCENTE"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
