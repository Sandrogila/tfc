import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FileText,
  BookOpen,
  Upload,
  BookMarked,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight,
  Shield,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard — Página inicial com estatísticas reais da base de dados
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Dashboard | TFC_IMETRO",
  description: "Sistema de Gestão de Trabalhos de Fim de Curso — IMETRO",
};

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const roleLabel =
    user?.role === "ESTUDANTE"
      ? "Estudante"
      : user?.role === "DOCENTE"
        ? "Docente"
        : user?.role === "COORDENACAO"
          ? "Coordenação"
          : "";

  // ──────────── Estatísticas por Role ────────────

  let statCards: Array<{
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    bg: string;
    href: string;
    desc: string;
  }> = [];

  let quickLinks: Array<{ label: string; href: string; icon: React.ElementType }> = [];

  if (user?.role === "ESTUDANTE") {
    const [propostas, entregas, diario] = await Promise.all([
      prisma.propostaTFC.count({ where: { estudanteId: user.id } }),
      prisma.entrega.count({
        where: { proposta: { estudanteId: user.id } },
      }),
      prisma.diarioBordo.count({
        where: { propostaId: { in: await prisma.propostaTFC.findMany({ where: { estudanteId: user.id }, select: { id: true } }).then((p) => p.map((x) => x.id)) } },
      }),
    ]);

    const propostaAprovada = await prisma.propostaTFC.findFirst({
      where: { estudanteId: user.id, status: "APROVADA" },
    });

    statCards = [
      {
        label: "Minhas Propostas",
        value: propostas,
        icon: FileText,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        href: "/propostas",
        desc: propostas === 0 ? "Submeta o seu primeiro TFC" : "Ver detalhes",
      },
      {
        label: "Entregas Submetidas",
        value: entregas,
        icon: Upload,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        href: "/entregas",
        desc: propostaAprovada ? "Gestão de entregas activa" : "Aguardando aprovação",
      },
      {
        label: "Diário de Bordo",
        value: diario,
        icon: BookMarked,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        href: "/diario",
        desc: "Registos de reuniões",
      },
      {
        label: "Estado da Proposta",
        value: propostaAprovada ? "✓ Aprovada" : propostas > 0 ? "Pendente" : "—",
        icon: propostaAprovada ? CheckCircle : Clock,
        color: propostaAprovada ? "text-emerald-400" : "text-amber-400",
        bg: propostaAprovada ? "bg-emerald-500/10" : "bg-amber-500/10",
        href: "/propostas",
        desc: propostaAprovada ? "Orientação ativa" : "Aguardando decisão do docente",
      },
    ];

    quickLinks = [
      { label: "Submeter Nova Proposta TFC", href: "/propostas/nova", icon: FileText },
      { label: "Enviar Documento PDF", href: "/entregas/nova", icon: Upload },
      { label: "Registar Reunião no Diário", href: "/diario/nova", icon: BookMarked },
    ];
  } else if (user?.role === "DOCENTE") {
    const [totalOrientacoes, pendentes, entregas, diario] = await Promise.all([
      prisma.orientacao.count({ where: { orientadorId: user.id, ativo: true } }),
      prisma.propostaTFC.count({ where: { orientadorPreferidoId: user.id, status: "SUBMETIDA" } }),
      prisma.entrega.count({
        where: { proposta: { orientacao: { orientadorId: user.id } }, status: "ENTREGUE" },
      }),
      prisma.diarioBordo.count({
        where: { proposta: { orientacao: { orientadorId: user.id } } },
      }),
    ]);

    statCards = [
      {
        label: "Orientações Ativas",
        value: `${totalOrientacoes} / 5`,
        icon: BookOpen,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        href: "/orientacoes",
        desc: totalOrientacoes < 5 ? "Disponível para mais" : "Limite atingido (RF05)",
      },
      {
        label: "Propostas Pendentes",
        value: pendentes,
        icon: FileText,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        href: "/orientacoes",
        desc: pendentes > 0 ? "Aguardam a sua decisão" : "Sem solicitações novas",
      },
      {
        label: "Entregas para Avaliar",
        value: entregas,
        icon: Upload,
        color: "text-red-400",
        bg: "bg-red-500/10",
        href: "/avaliacoes",
        desc: entregas > 0 ? "Documentos aguardam avaliação" : "Em dia com avaliações",
      },
      {
        label: "Entradas no Diário",
        value: diario,
        icon: BookMarked,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        href: "/diario",
        desc: "Acompanhamento histórico",
      },
    ];

    quickLinks = [
      { label: "Ver Propostas Recebidas", href: "/orientacoes", icon: FileText },
      { label: "Avaliar Entregas Pendentes", href: "/avaliacoes", icon: Upload },
      { label: "Actualizar Perfil Docente", href: "/perfil-docente", icon: BookOpen },
    ];
  } else if (user?.role === "COORDENACAO") {
    const [totalProp, aprovadas, pendentes, totalUsers, totalDocentes, totalEst] = await Promise.all([
      prisma.propostaTFC.count(),
      prisma.propostaTFC.count({ where: { status: "APROVADA" } }),
      prisma.propostaTFC.count({ where: { status: "SUBMETIDA" } }),
      prisma.user.count({ where: { ativo: true } }),
      prisma.user.count({ where: { role: "DOCENTE", ativo: true } }),
      prisma.user.count({ where: { role: "ESTUDANTE", ativo: true } }),
    ]);

    statCards = [
      {
        label: "Total de Propostas",
        value: totalProp,
        icon: FileText,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        href: "/gestao-propostas",
        desc: `${aprovadas} aprovadas, ${pendentes} pendentes`,
      },
      {
        label: "Utilizadores Ativos",
        value: totalUsers,
        icon: Users,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        href: "/utilizadores",
        desc: `${totalDocentes} docentes, ${totalEst} estudantes`,
      },
      {
        label: "Aprovadas / Ativas",
        value: aprovadas,
        icon: CheckCircle,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        href: "/gestao-propostas",
        desc: "TFC com orientação ativa",
      },
      {
        label: "Pendentes Revisão",
        value: pendentes,
        icon: Clock,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        href: "/gestao-propostas",
        desc: "Aguardam decisão do docente",
      },
    ];

    quickLinks = [
      { label: "Gerir Utilizadores", href: "/utilizadores", icon: Users },
      { label: "Acompanhar Propostas", href: "/gestao-propostas", icon: FileText },
    ];
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho de boas-vindas */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            {saudacao}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            Bem-vindo ao TFC_IMETRO •{" "}
            <span className="font-semibold text-foreground">{roleLabel}</span>
          </p>
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          {new Date().toLocaleDateString("pt-AO", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Cards de estatísticas reais */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="glass rounded-xl p-5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-200 group border border-border/40 hover:border-primary/20"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="text-2xl font-black text-foreground">{card.value}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{card.desc}</p>
                <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Ações Rápidas */}
      {quickLinks.length > 0 && (
        <div className="glass rounded-xl p-6 border border-border/40 space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Ações Rápidas
          </h2>
          <div className="flex flex-wrap gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 group"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Informação da sessão */}
      <div className="glass rounded-xl p-6 border border-border/40">
        <h2 className="mb-4 text-sm font-bold text-foreground">Detalhes da Conta</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Nome Completo", value: user?.name ?? "—" },
            { label: "Email Institucional", value: user?.email ?? "—" },
            { label: "Perfil de Acesso", value: roleLabel || "—" },
            { label: "ID da Conta", value: user?.id ? user.id.substring(0, 10) + "..." : "—" },
          ].map((item) => (
            <div key={item.label} className="space-y-0.5">
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </dt>
              <dd className="text-sm font-medium text-foreground truncate">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
