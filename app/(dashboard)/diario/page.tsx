import { auth } from "@/auth";
import { propostaRepository } from "@/repositories/proposta.repository";
import { diarioRepository } from "@/repositories/diario.repository";
import { DiarioCard } from "@/components/diario/DiarioCard";
import Link from "next/link";
import { PlusCircle, Info, BookOpen } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DiarioBordoPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Se o utilizador for Docente, a lista do Diário de Bordo deve ser mostrada
  // mas baseada nas suas orientações ativas.
  // Vamos primeiro definir a proposta correspondente.
  let propostaAtivaId: string | null = null;
  let tituloTrabalho = "";

  if (session.user.role === "ESTUDANTE") {
    const propostas = await propostaRepository.findByEstudante(session.user.id);
    const aprovada = propostas.find((p) => p.status === "APROVADA");
    if (aprovada) {
      propostaAtivaId = aprovada.id;
      tituloTrabalho = aprovada.titulo;
    }
  }

  // Caso não tenha proposta ativa aprovada
  if (session.user.role === "ESTUDANTE" && !propostaAtivaId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Diário de Bordo</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe as reuniões de orientação e os próximos passos combinados.
          </p>
        </div>

        <div className="glass rounded-xl p-8 text-center max-w-lg mx-auto border border-border/40 space-y-4">
          <div className="rounded-full bg-amber-500/10 p-3 w-12 h-12 flex items-center justify-center mx-auto">
            <Info className="h-6 w-6 text-amber-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Sem Orientação Aprovada</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Só é possível registar reuniões e notas de acompanhamento após ter uma proposta de TFC **Aprovada** e orientador associado.
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

  // Para docentes, se entrarem na raiz do diário de bordo geral,
  // vamos mostrar a lista de diários das suas orientações.
  let entradas: Array<Parameters<typeof DiarioCard>[0]["entrada"]> = [];

  if (session.user.role === "ESTUDANTE" && propostaAtivaId) {
    entradas = await diarioRepository.findByProposta(propostaAtivaId);
  } else if (session.user.role === "DOCENTE") {
    // Busca as propostas orientadas pelo docente
    const propostasOrientadas = await propostaRepository.findPropostasParaOrientador(session.user.id);
    const aprovadas = propostasOrientadas.filter((p) => p.status === "APROVADA");

    // Coleta todas as entradas de todas as propostas que este docente orienta
    const promessas = aprovadas.map((p) => diarioRepository.findByProposta(p.id));
    const resultados = await Promise.all(promessas);
    entradas = resultados.flat().sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Diário de Bordo</h1>
          <p className="text-sm text-muted-foreground">
            {session.user.role === "ESTUDANTE"
              ? `Acompanhamento do TFC: ${tituloTrabalho}`
              : "Registo histórico das reuniões de orientação de todos os seus estudantes."}
          </p>
        </div>

        {session.user.role === "ESTUDANTE" && propostaAtivaId && (
          <Link
            href="/diario/nova"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
          >
            <PlusCircle className="h-4 w-4" />
            Registar Reunião
          </Link>
        )}
      </div>

      {entradas.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center max-w-lg mx-auto border border-border/40 space-y-4">
          <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mx-auto">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Diário de Bordo Vazio</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ainda não possui reuniões ou registos de progresso adicionados.
            </p>
          </div>
          {session.user.role === "ESTUDANTE" && (
            <Link
              href="/diario/nova"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95"
            >
              Registar Primeira Reunião
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {entradas.map((entrada) => (
            <DiarioCard key={entrada.id} entrada={entrada} />
          ))}
        </div>
      )}
    </div>
  );
}
