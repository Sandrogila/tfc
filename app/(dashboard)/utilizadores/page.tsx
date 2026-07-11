import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Shield, GraduationCap, CircleUser, CheckCircle2, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { CriarUtilizadorForm } from "@/components/utilizadores/CriarUtilizadorForm";


interface PageProps {
  searchParams: Promise<{ created?: string }>;
}

export default async function GestaoUtilizadoresPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "COORDENACAO") {
    redirect("/login");
  }

  const params = await searchParams;
  const acabouDeCriar = params.created === "true";

  // Busca todos os utilizadores
  const utilizadores = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  const estudantes = utilizadores.filter((u) => u.role === "ESTUDANTE");
  const docentes = utilizadores.filter((u) => u.role === "DOCENTE");
  const coordenadores = utilizadores.filter((u) => u.role === "COORDENACAO");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestão de Utilizadores</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os estudantes, docentes e membros da coordenação académica do sistema.
        </p>
      </div>

      {/* Mensagem de sucesso após criar utilizador */}
      {acabouDeCriar && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-400">Utilizador criado com sucesso!</p>
            <p className="text-xs text-emerald-400/80">O novo utilizador já pode aceder ao sistema com as credenciais fornecidas.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lista de Utilizadores */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-foreground">Utilizadores Registados ({utilizadores.length})</h3>
              <p className="text-xs text-muted-foreground font-medium">
                {estudantes.length} Estudantes • {docentes.length} Docentes • {coordenadores.length} Coordenação
              </p>
            </div>

            <div className="divide-y divide-border/40 overflow-hidden rounded-xl border border-border/40 bg-background/30">
              {utilizadores.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CircleUser className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">Nenhum utilizador registado</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Use o formulário ao lado para criar o primeiro utilizador.</p>
                </div>
              ) : (
                utilizadores.map((u) => {
                  const isDocente = u.role === "DOCENTE";
                  const isCoord = u.role === "COORDENACAO";

                  return (
                    <div key={u.id} className="flex items-center justify-between p-4 hover:bg-background/50 transition-colors">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={cn(
                          "rounded-lg p-2 shrink-0",
                          isCoord ? "bg-purple-500/10 text-purple-400" : isDocente ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                        )}>
                          {isCoord ? <Shield className="h-5 w-5" /> : isDocente ? <GraduationCap className="h-5 w-5" /> : <CircleUser className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{u.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email} • {u.numero || "Sem Nº"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn(
                          "rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                          isCoord ? "text-purple-400 bg-purple-500/10" : isDocente ? "text-emerald-400 bg-emerald-500/10" : "text-blue-400 bg-blue-500/10"
                        )}>
                          {u.role}
                        </span>
                        {u.ativo ? (
                          <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Ativo
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-red-400 flex items-center gap-1">
                            <UserX className="h-3.5 w-3.5" /> Inativo
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Criação de Novo Utilizador — Componente Cliente com feedback */}
        <div className="space-y-6">
          <CriarUtilizadorForm />
        </div>
      </div>
    </div>
  );
}
