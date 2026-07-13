import { prisma } from "@/lib/prisma";


export const diarioRepository = {

  // Procura uma entrada por ID

  async findById(id: string) {
    return prisma.diarioBordo.findUnique({
      where: { id },
      include: {
        autor: { select: { id: true, name: true, role: true } },
      },
    });
  },


  // Lista todas as entradas do Diário de Bordo de uma proposta específica

  async findByProposta(propostaId: string) {
    return prisma.diarioBordo.findMany({
      where: { propostaId },
      include: {
        autor: { select: { id: true, name: true, role: true } },
      },
      orderBy: { data: "desc" },
    });
  },

  // Cria uma entrada no diário   
  async create(data: {
    data: Date;
    resumo: string;
    proximasMetas: string;
    propostaId: string;
    autorId: string;
  }) {
    return prisma.diarioBordo.create({
      data,
    });
  },
};
