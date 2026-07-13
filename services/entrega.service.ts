import { entregaRepository } from "@/repositories/entrega.repository";
import { TipoEntrega, StatusEntrega } from "@prisma/client";


// Serviço de Entregas — Regras de Negócio (RF06, RF07)

export const entregaService = {

  // Submete um arquivo PDF de entrega do estudante (RF06)

  async submitEntrega(data: {
    titulo: string;
    descricao?: string;
    tipo: TipoEntrega;
    urlFicheiro: string;
    nomeArquivo: string;
    tamanhoBytes: number;
    propostaId: string;
  }) {
    try {
      const entrega = await entregaRepository.create(data);
      return { sucesso: true, dados: entrega };
    } catch {
      return { sucesso: false, erro: "Ocorreu um erro ao registar a entrega." };
    }
  },


  // Regista a nota e comentário/feedback do orientador (RF07)

  async avaliarEntrega(
    id: string,
    orientadorId: string,
    data: {
      nota: number;
      comentarioOrientador: string;
      status?: StatusEntrega;
    },
  ) {
    const entrega = await entregaRepository.findById(id);

    if (!entrega) {
      return { sucesso: false, erro: "Entrega não encontrada." };
    }

    // Verificar se o docente avaliando é de facto o orientador
    const orientadorProposta = entrega.proposta.orientacao?.orientadorId;
    if (orientadorProposta !== orientadorId) {
      return {
        sucesso: false,
        erro: "Apenas o orientador oficial pode avaliar esta entrega.",
      };
    }

    try {
      const statusFinal = data.status || (data.nota >= 10 ? "APROVADA" : "REJEITADA");

      const avaliada = await entregaRepository.avaliar(id, {
        nota: data.nota,
        comentarioOrientador: data.comentarioOrientador,
        status: statusFinal,
      });

      return { sucesso: true, dados: avaliada };
    } catch {
      return { sucesso: false, erro: "Erro ao registar a avaliação da entrega." };
    }
  },
};
