import { prisma } from "@/lib/prisma";
import { TipoEntrega, StatusEntrega } from "@prisma/client";


export const entregaRepository = {

  async findById(id: string) {
    return prisma.entrega.findUnique({
      where: { id },
      include: {
        proposta: {
          include: {
            estudante: { select: { id: true, name: true, email: true, numero: true } },
            orientacao: {
              include: {
                orientador: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });
  },

  // Lista todas as entregas associadas a uma proposta   
  async findByProposta(propostaId: string) {
    return prisma.entrega.findMany({
      where: { propostaId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Lista todas as entregas dirigidas a um orientador (para docente avaliar)

  async findEntregasParaAvaliar(orientadorId: string) {
    return prisma.entrega.findMany({
      where: {
        proposta: {
          orientacao: {
            orientadorId,
            ativo: true,
          },
        },
      },
      include: {
        proposta: {
          include: {
            estudante: { select: { id: true, name: true, email: true, numero: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // Cria um registro de entrega
  async create(data: {
    titulo: string;
    descricao?: string;
    tipo: TipoEntrega;
    urlFicheiro: string;
    nomeArquivo: string;
    tamanhoBytes: number;
    propostaId: string;
  }) {
    return prisma.entrega.create({
      data: {
        ...data,
        status: "ENTREGUE",
        entregueEm: new Date(),
      },
    });
  },

  //Regista a avaliação (nota + feedback) do orientador (RF07)

  async avaliar(
    id: string,
    data: {
      nota: number;
      comentarioOrientador: string;
      status: StatusEntrega;
    },
  ) {
    return prisma.entrega.update({
      where: { id },
      data: {
        ...data,
        avaliadoEm: new Date(),
      },
    });
  },
};
