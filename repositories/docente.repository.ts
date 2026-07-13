import { prisma } from "@/lib/prisma";


export const docenteRepository = {
  async findById(id: string) {
    return prisma.user.findFirst({
      where: { id, role: "DOCENTE" },
      select: {
        id: true,
        name: true,
        email: true,
        numero: true,
        departamento: true,
        especialidade: true,
        disponivel: true,
      },
    });
  },


  // Lista todos os docentes disponíveis para orientação

  async findDisponiveis() {
    return prisma.user.findMany({
      where: {
        role: "DOCENTE",
        disponivel: true,
        ativo: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        especialidade: true,
      },
      orderBy: { name: "asc" },
    });
  },


  // Lista todos os docentes em geral

  async findAll() {
    return prisma.user.findMany({
      where: { role: "DOCENTE" },
      select: {
        id: true,
        name: true,
        email: true,
        especialidade: true,
        disponivel: true,
        departamento: true,
        _count: {
          select: {
            orientacoesComoOrientador: { where: { ativo: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });
  },


  // Atualiza a especialidade e disponibilidade de orientação do docente (RF02)

  async updatePerfil(
    id: string,
    data: {
      especialidade: string;
      disponivel: boolean;
    },
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },
};
