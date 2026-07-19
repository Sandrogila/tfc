"use client";

import { useActionState, useState } from "react";
import { atualizarPerfilAction, alterarSenhaAction } from "@/actions/user.actions";
import { Loader2, User, Key, Shield, Info, CheckCircle2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerfilFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    numero?: string | null;
    departamento?: string | null;
    especialidade?: string | null;
    disponivel?: boolean;
  };
}

export function PerfilForm({ user }: PerfilFormProps) {
  const [activeTab, setActiveTab] = useState<"dados" | "senha">("dados");

  // Estados de formulário para Dados Gerais
  const [stateDados, actionDados, isPendingDados] = useActionState(atualizarPerfilAction, null);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [numero, setNumero] = useState(user.numero ?? "");
  const [departamento, setDepartamento] = useState(user.departamento ?? "");
  const [especialidade, setEspecialidade] = useState(user.especialidade ?? "");
  const [disponivel, setDisponivel] = useState(user.disponivel ?? true);

  // Estados de formulário para Senha
  const [stateSenha, actionSenha, isPendingSenha] = useActionState(alterarSenhaAction, null);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const isDocente = user.role === "DOCENTE";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Abas de Navegação */}
      <div className="flex border-b border-border/40 gap-4">
        <button
          onClick={() => setActiveTab("dados")}
          className={cn(
            "pb-3 text-sm font-semibold border-b-2 px-1 transition-all flex items-center gap-2",
            activeTab === "dados"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <User className="h-4 w-4" />
          Informações Gerais
        </button>
        <button
          onClick={() => setActiveTab("senha")}
          className={cn(
            "pb-3 text-sm font-semibold border-b-2 px-1 transition-all flex items-center gap-2",
            activeTab === "senha"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <Key className="h-4 w-4" />
          Segurança e Senha
        </button>
      </div>

      {activeTab === "dados" && (
        <form action={actionDados} className="space-y-6">
          {/* Feedbacks */}
          {stateDados && !stateDados.sucesso && (
            <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
              <p className="text-sm text-red-400 font-medium">{stateDados.erro}</p>
            </div>
          )}
          {stateDados && stateDados.sucesso && (
            <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <p className="text-sm text-emerald-400 font-medium">Perfil atualizado com sucesso!</p>
            </div>
          )}

          <div className="glass rounded-xl p-6 space-y-5 border border-border/40">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border/20 pb-3">
              <User className="h-4 w-4 text-primary" />
              Dados do Perfil
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nome */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Nome Completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPendingDados}
                  className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  E-mail Institucional
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPendingDados}
                  className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Número de Identificação */}
              <div className="space-y-1.5">
                <label htmlFor="numero" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Número de Identificação (Estudante/Docente)
                </label>
                <input
                  id="numero"
                  name="numero"
                  type="text"
                  required
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  disabled={isPendingDados}
                  className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Departamento */}
              <div className="space-y-1.5">
                <label htmlFor="departamento" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Departamento / Curso
                </label>
                <input
                  id="departamento"
                  name="departamento"
                  type="text"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  disabled={isPendingDados}
                  placeholder="Ex: Engenharia Informática"
                  className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* Configurações Adicionais de Docente */}
            {isDocente && (
              <div className="pt-4 border-t border-border/20 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-emerald-400" />
                  Perfil de Orientação (Docente)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="especialidade" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Especialidade Científica
                    </label>
                    <input
                      id="especialidade"
                      name="especialidade"
                      type="text"
                      value={especialidade}
                      onChange={(e) => setEspecialidade(e.target.value)}
                      disabled={isPendingDados}
                      placeholder="Ex: Inteligência Artificial, Engenharia de Software"
                      className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                      Disponibilidade para Orientação
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer mt-2.5">
                      <input
                        type="checkbox"
                        name="disponivel"
                        value="true"
                        checked={disponivel}
                        onChange={(e) => setDisponivel(e.target.checked)}
                        disabled={isPendingDados}
                        className="rounded border-border bg-background/50 text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-sm text-foreground font-medium">
                        Disponível para orientar novos projectos
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              id="btn-salvar-perfil"
              type="submit"
              disabled={isPendingDados}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPendingDados ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A guardar...
                </>
              ) : (
                "Guardar Alterações"
              )}
            </button>
          </div>
        </form>
      )}

      {activeTab === "senha" && (
        <form action={actionSenha} className="space-y-6">
          {/* Feedbacks */}
          {stateSenha && !stateSenha.sucesso && (
            <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
              <p className="text-sm text-red-400 font-medium">{stateSenha.erro}</p>
            </div>
          )}
          {stateSenha && stateSenha.sucesso && (
            <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <p className="text-sm text-emerald-400 font-medium">Senha alterada com sucesso!</p>
            </div>
          )}

          <div className="glass rounded-xl p-6 space-y-5 border border-border/40">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border/20 pb-3">
              <Key className="h-4 w-4 text-primary" />
              Alterar Senha de Acesso
            </h2>

            <div className="space-y-4 max-w-md">
              {/* Senha Atual */}
              <div className="space-y-1.5">
                <label htmlFor="senhaAtual" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Senha Atual
                </label>
                <input
                  id="senhaAtual"
                  name="senhaAtual"
                  type="password"
                  required
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  disabled={isPendingSenha}
                  className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Nova Senha */}
              <div className="space-y-1.5">
                <label htmlFor="novaSenha" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Nova Senha (Mín. 8 caracteres, maiúscula e número)
                </label>
                <input
                  id="novaSenha"
                  name="novaSenha"
                  type="password"
                  required
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  disabled={isPendingSenha}
                  className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Confirmar Nova Senha */}
              <div className="space-y-1.5">
                <label htmlFor="confirmarNovaSenha" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Confirmar Nova Senha
                </label>
                <input
                  id="confirmarNovaSenha"
                  name="confirmarNovaSenha"
                  type="password"
                  required
                  value={confirmarNovaSenha}
                  onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                  disabled={isPendingSenha}
                  className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              id="btn-alterar-senha"
              type="submit"
              disabled={isPendingSenha}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPendingSenha ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A alterar...
                </>
              ) : (
                "Alterar Senha"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
