import { prisma } from "@/lib/prisma";
import { StatusProposta } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Repositório de Propostas TFC — Data Access Layer
// ─────────────────────────────────────────────────────────────────────────────

export const propostaRepository = {
  /**
   * Busca uma proposta pelo ID com todas as relações necessárias
   */
  async findById(id: string) {
    return prisma.propostaTFC.findUnique({
      where: { id },
      include: {
        estudante: { select: { id: true, name: true, email: true, numero: true } },
        orientadorPretendido: { select: { id: true, name: true, email: true, especialidade: true } },
        orientacao: {
          include: {
            orientador: { select: { id: true, name: true, email: true, especialidade: true } },
          },
        },
        entregas: { orderBy: { createdAt: "desc" } },
        diario: { orderBy: { data: "desc" } },
        banca: true,
      },
    });
  },

  /**
   * Lista todas as propostas do estudante autenticado
   */
  async findByEstudante(estudanteId: string) {
    return prisma.propostaTFC.findMany({
      where: { estudanteId },
      include: {
        orientacao: {
          include: {
            orientador: { select: { id: true, name: true, email: true } },
          },
        },
        _count: { select: { entregas: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Lista todas as propostas (para Coordenação)
   */
  async findAll(filtros?: { status?: StatusProposta; ano?: number }) {
    return prisma.propostaTFC.findMany({
      where: {
        ...(filtros?.status && { status: filtros.status }),
        ...(filtros?.ano && { ano: filtros.ano }),
      },
      include: {
        estudante: { select: { id: true, name: true, email: true, numero: true } },
        orientacao: {
          include: {
            orientador: { select: { id: true, name: true, email: true } },
          },
        },
        _count: { select: { entregas: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Lista propostas pendentes/submetidas ao orientador (para Docente ver e aceitar/recusar)
   */
  async findPropostasParaOrientador(orientadorId: string) {
    return prisma.propostaTFC.findMany({
      where: {
        OR: [
          { orientadorPreferidoId: orientadorId, status: "SUBMETIDA" },
          { orientacao: { orientadorId } },
        ],
      },
      include: {
        estudante: { select: { id: true, name: true, email: true, numero: true } },
        orientacao: true,
        _count: { select: { entregas: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Cria uma nova proposta
   */
  async create(data: {
    titulo: string;
    resumo: string;
    descricao: string;
    objetivos: string;
    area: string;
    estudanteId: string;
    orientadorPreferidoId?: string;
    status?: StatusProposta;
  }) {
    return prisma.propostaTFC.create({
      data: {
        ...data,
        status: data.status || "SUBMETIDA",
      },
    });
  },

  /**
   * Exclui uma proposta por ID
   */
  async delete(id: string) {
    return prisma.propostaTFC.delete({
      where: { id },
    });
  },


  /**
   * Atualiza uma proposta existente
   */
  async update(
    id: string,
    data: Partial<{
      titulo: string;
      resumo: string;
      descricao: string;
      objetivos: string;
      area: string;
      orientadorPreferidoId: string | null;
    }>,
  ) {
    return prisma.propostaTFC.update({
      where: { id },
      data,
    });
  },

  /**
   * Atualiza apenas o status e campos relacionados
   */
  async updateStatus(
    id: string,
    status: StatusProposta,
    extra?: { justificativaRecusa?: string; observacoes?: string },
  ) {
    return prisma.propostaTFC.update({
      where: { id },
      data: {
        status,
        ...(extra?.justificativaRecusa && {
          justificativaRecusa: extra.justificativaRecusa,
        }),
        ...(extra?.observacoes && { observacoes: extra.observacoes }),
      },
    });
  },

  /**
   * Conta orientações ativas de um docente (RF05 — limite de 5)
   */
  async countOrientacoesAtivas(orientadorId: string): Promise<number> {
    return prisma.orientacao.count({
      where: {
        orientadorId,
        ativo: true,
      },
    });
  },

  /**
   * Cria a orientação após aceitação da proposta
   */
  async criarOrientacao(propostaId: string, orientadorId: string) {
    return prisma.orientacao.create({
      data: {
        propostaId,
        orientadorId,
        ativo: true,
      },
    });
  },

  /**
   * Atualiza o orientador de uma orientação existente
   */
  async updateOrientacaoOrientador(orientacaoId: string, novoOrientadorId: string) {
    return prisma.orientacao.update({
      where: { id: orientacaoId },
      data: { orientadorId: novoOrientadorId },
    });
  },
};

