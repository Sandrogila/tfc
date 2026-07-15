import type { Metadata } from "next";
import { auth } from "@/auth";
import {
  FileText,
  BookOpen,
  Calendar,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";


export const metadata: Metadata = {
  title: "Dashboard",
};

// Cards de estatísticas de exemplo
const statCards = [
  {
    label: "Propostas Activas",
    value: "—",
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    trend: "A carregar...",
  },
  {
    label: "Orientações",
    value: "—",
    icon: BookOpen,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    trend: "A carregar...",
  },
  {
    label: "Próximas Reuniões",
    value: "—",
    icon: Calendar,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    trend: "A carregar...",
  },
  {
    label: "Bancas Agendadas",
    value: "—",
    icon: GraduationCap,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    trend: "A carregar...",
  },
];

const statusItems = [
  { icon: CheckCircle, label: "Auth.js v5 configurado", ok: true },
  { icon: CheckCircle, label: "Prisma ORM pronto", ok: true },
  { icon: CheckCircle, label: "Rotas protegidas por role", ok: true },
  { icon: CheckCircle, label: "Design system activo", ok: true },
  { icon: AlertCircle, label: "Dados reais disponíveis na Fase 2", ok: false },
];

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  const roleLabel =
    user?.role === "ESTUDANTE"
      ? "Estudante"
      : user?.role === "DOCENTE"
        ? "Docente"
        : user?.role === "COORDENACAO"
          ? "Coordenação"
          : "";

  const hora = new Date().getHours();
  const saudacao =
    hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="space-y-8">
      {/* Cabeçalho de boas-vindas */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">
          {saudacao}, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Bem-vindo ao TFC_IMETRO •{" "}
          <span className="font-medium text-foreground">{roleLabel}</span>
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="glass rounded-xl p-5 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                </div>
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{card.trend}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado do sistema — Fase 1 */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Estado da Infraestrutura — Fase 1
          </h2>
          <span className="ml-auto rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
            Concluída
          </span>
        </div>
        <div className="space-y-2.5">
          {statusItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 shrink-0 ${item.ok ? "text-emerald-400" : "text-amber-400"}`}
                />
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Informação de sessão */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Informação da Sessão
        </h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: "ID", value: user?.id ?? "—" },
            { label: "Nome", value: user?.name ?? "—" },
            { label: "Email", value: user?.email ?? "—" },
            { label: "Perfil", value: roleLabel || "—" },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-xs font-medium text-muted-foreground">
                {item.label}
              </dt>
              <dd className="mt-0.5 truncate text-sm font-mono text-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
