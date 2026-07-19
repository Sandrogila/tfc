import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Bell,
  Info,
  AlertCircle,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { propostaRepository } from "@/repositories/proposta.repository";

interface NotificacaoMock {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  lida: boolean;
  categoria: "urgente" | "info" | "sucesso" | "calendario";
  link?: string;
  linkText?: string;
}

export default async function NotificacoesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  const userName = session.user.name?.split(" ")[0] ?? "Utilizador";

  // Buscar dados reais para enriquecer o mock
  let propostasReais: any[] = [];
  try {
    if (role === "ESTUDANTE") {
      propostasReais = await propostaRepository.findByEstudante(session.user.id);
    } else if (role === "COORDENACAO") {
      propostasReais = await propostaRepository.findAll();
    }
  } catch (err) {
    console.error("Erro ao ler propostas para notificações:", err);
  }

  const propostaRecente = propostasReais[0];

  // Gerar notificações personalizadas com base no Perfil
  let notificacoes: NotificacaoMock[] = [];

  if (role === "ESTUDANTE") {
    notificacoes = [
      {
        id: "1",
        titulo: "Reunião de Orientação Agendada",
        descricao: "O seu orientador agendou uma nova reunião de alinhamento metodológico para o dia 24/07/2026 às 14:00.",
        data: "Há 2 horas",
        lida: false,
        categoria: "calendario",
        link: "/diario",
        linkText: "Ver Diário de Bordo",
      },
      {
        id: "2",
        titulo: propostaRecente 
          ? `Proposta de TFC Atualizada: "${propostaRecente.titulo.substring(0, 35)}..."`
          : "Proposta de TFC Recebida",
        descricao: propostaRecente
          ? `O status do seu projeto científico foi atualizado para ${propostaRecente.status}.`
          : "A sua proposta de TFC foi registada com sucesso no sistema.",
        data: "Há 1 dia",
        lida: false,
        categoria: "sucesso",
        link: propostaRecente ? `/propostas/${propostaRecente.id}` : "/propostas",
        linkText: "Ver Detalhes do Projeto",
      },
      {
        id: "3",
        titulo: "Novo Feedback Disponível",
        descricao: "O docente avaliou o documento correspondente à sua entrega 'Capítulo 1 - Introdução' e deixou comentários adicionais.",
        data: "Há 3 dias",
        lida: true,
        categoria: "info",
        link: "/entregas",
        linkText: "Ver Entregas",
      },
    ];
  } else if (role === "DOCENTE") {
    notificacoes = [
      {
        id: "1",
        titulo: "Novo Convite de Orientação",
        descricao: `O estudante Sandro Mussumba submeteu uma proposta de TFC sobre "Desenvolvimento de Aplicações com Next.js" e indicou-o como orientador preferido.`,
        data: "Há 3 horas",
        lida: false,
        categoria: "urgente",
        link: "/orientacoes",
        linkText: "Analisar Convite",
      },
      {
        id: "2",
        titulo: "Nova Entrega de Documento",
        descricao: "O estudante orientando Sandro Mussumba submeteu o ficheiro PDF do 'Capítulo 2 - Fundamentação Teórica' para revisão.",
        data: "Há 1 dia",
        lida: false,
        categoria: "info",
        link: "/avaliacoes",
        linkText: "Avaliar Entrega",
      },
      {
        id: "3",
        titulo: "Reunião de Orientação Confirmada",
        descricao: "O estudante confirmou a sua presença na reunião de bordo agendada para 24/07/2026.",
        data: "Há 2 dias",
        lida: true,
        categoria: "calendario",
      },
    ];
  } else if (role === "COORDENACAO") {
    const pendentesCount = propostasReais.filter(p => p.status === "SUBMETIDA").length;
    notificacoes = [
      {
        id: "1",
        titulo: "Novas Propostas Aguardando Revisão",
        descricao: pendentesCount > 0 
          ? `Atualmente existem ${pendentesCount} propostas de TFC no estado SUBMETIDA que precisam de avaliação da coordenação.`
          : "Existem novas propostas de TFC de estudantes que foram submetidas recentemente e aguardam parecer.",
        data: "Há 4 horas",
        lida: false,
        categoria: "urgente",
        link: "/gestao-propostas",
        linkText: "Ver Propostas",
      },
      {
        id: "2",
        titulo: "Orientação Vinculada",
        descricao: "O docente Sandro Gila aceitou oficialmente o convite de orientação de TFC do estudante Sandro Mussumba.",
        data: "Há 1 dia",
        lida: true,
        categoria: "sucesso",
      },
      {
        id: "3",
        titulo: "Novo Utilizador Cadastrado",
        descricao: 'O utilizador "Docente Carlos Mateus" foi cadastrado com sucesso no sistema e já pode acessar a plataforma.',
        data: "Há 2 dias",
        lida: true,
        categoria: "info",
        link: "/utilizadores",
        linkText: "Gerir Utilizadores",
      },
    ];
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Notificações da Conta
          </h1>
          <p className="text-sm text-muted-foreground">
            Olá {userName}, aqui estão os alertas e atualizações importantes associados ao seu perfil de {role.toLowerCase()}.
          </p>
        </div>
      </div>

      <div className="glass rounded-xl border border-border/40 divide-y divide-border/20 overflow-hidden">
        {notificacoes.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground space-y-2">
            <Info className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm font-semibold">Tudo limpo!</p>
            <p className="text-xs">Não tem notificações ou alertas novos na sua conta.</p>
          </div>
        ) : (
          notificacoes.map((item) => {
            return (
              <div
                key={item.id}
                className={`p-5 transition-all flex gap-4 ${
                  item.lida ? "opacity-75 bg-transparent" : "bg-primary/5 border-l-2 border-primary"
                }`}
              >
                {/* Ícone contextual */}
                <div className="mt-0.5 flex-shrink-0">
                  {item.categoria === "urgente" && (
                    <div className="rounded-full bg-red-500/10 p-2 border border-red-500/20">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    </div>
                  )}
                  {item.categoria === "calendario" && (
                    <div className="rounded-full bg-blue-500/10 p-2 border border-blue-500/20">
                      <Calendar className="h-4 w-4 text-blue-400" />
                    </div>
                  )}
                  {item.categoria === "sucesso" && (
                    <div className="rounded-full bg-emerald-500/10 p-2 border border-emerald-500/20">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                  )}
                  {item.categoria === "info" && (
                    <div className="rounded-full bg-amber-500/10 p-2 border border-amber-500/20">
                      <Info className="h-4 w-4 text-amber-400" />
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-bold text-foreground">{item.titulo}</h3>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.data}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.descricao}</p>

                  {/* Ação / Link */}
                  {item.link && (
                    <div className="pt-1.5">
                      <Link
                        href={item.link}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline transition-all"
                      >
                        {item.linkText ?? "Ir para página"}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
