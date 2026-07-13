import { docenteRepository } from "@/repositories/docente.repository";

// Serviço de Perfil de Docente — Regras de Negócio (RF02)

export const docenteService = {

  // Atualiza a especialidade e disponibilidade de orientação do docente

  async atualizarPerfil(
    id: string,
    data: {
      especialidade: string;
      disponivel: boolean;
    },
  ) {
    try {
      const atualizado = await docenteRepository.updatePerfil(id, data);
      return { sucesso: true, dados: atualizado };
    } catch {
      return { sucesso: false, erro: "Ocorreu um erro ao atualizar o perfil do docente." };
    }
  },
};
