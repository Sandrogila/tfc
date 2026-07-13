import { diarioRepository } from "@/repositories/diario.repository";
import { propostaRepository } from "@/repositories/proposta.repository";

// Serviço do Diário de Bordo — Regras de Negócio (RF08)

export const diarioService = {

  // Cria um registo no Diário de Bordo

  async criarEntrada(
    autorId: string,
    data: {
      data: Date;
      resumo: string;
      proximasMetas: string;
      propostaId: string;
    },
  ) {
    const proposta = await propostaRepository.findById(data.propostaId);

    if (!proposta) {
      return { sucesso: false, erro: "Trabalho de TFC correspondente não encontrado." };
    }

    // Verificar se o autor (estudante ou orientador) pertence à orientação correspondente
    const eEstudante = proposta.estudanteId === autorId;
    const eOrientador = proposta.orientacao?.orientadorId === autorId;

    if (!eEstudante && !eOrientador) {
      return {
        sucesso: false,
        erro: "Não possui autorização para criar registos no Diário de Bordo deste trabalho.",
      };
    }

    try {
      const entrada = await diarioRepository.create({
        ...data,
        autorId,
      });
      return { sucesso: true, dados: entrada };
    } catch {
      return { sucesso: false, erro: "Ocorreu um erro ao registar a entrada no diário." };
    }
  },
};
