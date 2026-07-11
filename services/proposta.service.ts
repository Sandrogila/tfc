import { propostaRepository } from "@/repositories/proposta.repository";


// ─────────────────────────────────────────────────────────────────────────────
// Serviço de Gestão de Propostas TFC — Regras de Negócio (RF03, RF04, RF05)
// ─────────────────────────────────────────────────────────────────────────────

export const propostaService = {
  /**
   * Submete uma proposta pelo estudante
   */
  async submeterProposta(
    estudanteId: string,
    data: {
      titulo: string;
      resumo: string;
      descricao: string;
      objetivos: string;
      area: string;
      orientadorPreferidoId?: string;
    },
  ) {
    // Valida se o estudante já tem propostas aprovadas ou submetidas
    const propostasExistentes = await propostaRepository.findByEstudante(estudanteId);
    const temPropostaAtiva = propostasExistentes.some(
      (p) => p.status === "APROVADA" || p.status === "SUBMETIDA" || p.status === "EM_REVISAO",
    );

    if (temPropostaAtiva) {
      return {
        sucesso: false,
        erro: "Já possui uma proposta ativa (submetida, em revisão ou aprovada) no sistema.",
      };
    }

    try {
      const proposta = await propostaRepository.create({
        ...data,
        estudanteId,
      });
      return { sucesso: true, dados: proposta };
    } catch {
      return { sucesso: false, erro: "Ocorreu um erro ao submeter a proposta." };
    }
  },

  /**
   * Edita uma proposta caso ainda esteja pendente (status RASCUNHO ou SUBMETIDA) (RF03)
   */
  async editarProposta(
    id: string,
    estudanteId: string,
    data: {
      titulo: string;
      resumo: string;
      descricao: string;
      objetivos: string;
      area: string;
      orientadorPreferidoId?: string;
    },
  ) {
    const proposta = await propostaRepository.findById(id);

    if (!proposta) {
      return { sucesso: false, erro: "Proposta não encontrada." };
    }

    if (proposta.estudanteId !== estudanteId) {
      return { sucesso: false, erro: "Não tem permissão para editar esta proposta." };
    }

    if (proposta.status !== "RASCUNHO" && proposta.status !== "SUBMETIDA") {
      return {
        sucesso: false,
        erro: `Não é possível editar uma proposta no estado atual: ${proposta.status}.`,
      };
    }

    try {
      const atualizada = await propostaRepository.update(id, {
        titulo: data.titulo,
        resumo: data.resumo,
        descricao: data.descricao,
        objetivos: data.objetivos,
        area: data.area,
        orientadorPreferidoId: data.orientadorPreferidoId || null,
      });
      return { sucesso: true, dados: atualizada };
    } catch {
      return { sucesso: false, erro: "Erro ao atualizar a proposta." };
    }
  },

  /**
   * Aceita uma proposta de TFC (RF04, RF05)
   */
  async aceitarProposta(propostaId: string, orientadorId: string) {
    const proposta = await propostaRepository.findById(propostaId);

    if (!proposta) {
      return { sucesso: false, erro: "Proposta não encontrada." };
    }

    if (proposta.status !== "SUBMETIDA") {
      return {
        sucesso: false,
        erro: "Esta proposta já foi avaliada ou não está pronta para aceitação.",
      };
    }

    // RF05 — Um docente não pode possuir mais de cinco orientações ativas.
    const totalOrientacoes = await propostaRepository.countOrientacoesAtivas(orientadorId);
    if (totalOrientacoes >= 5) {
      return {
        sucesso: false,
        erro: "Este docente já atingiu o limite máximo de orientações.",
      };
    }

    try {
      // 1. Atualizar status da proposta para APROVADA
      await propostaRepository.updateStatus(propostaId, "APROVADA");

      // 2. Criar a relação de orientação ativa
      const orientacao = await propostaRepository.criarOrientacao(propostaId, orientadorId);

      return { sucesso: true, dados: { propostaId, orientacaoId: orientacao.id } };
    } catch {
      return { sucesso: false, erro: "Erro ao aceitar a proposta de TFC." };
    }
  },

  /**
   * Recusa uma proposta com justificativa obrigatória (RF04)
   */
  async recusarProposta(propostaId: string, orientadorId: string, justificativaRecusa: string) {
    const proposta = await propostaRepository.findById(propostaId);

    if (!proposta) {
      return { sucesso: false, erro: "Proposta não encontrada." };
    }

    if (proposta.status !== "SUBMETIDA") {
      return {
        sucesso: false,
        erro: "Esta proposta já foi avaliada ou não está pronta para avaliação.",
      };
    }

    try {
      // Atualiza o status para REJEITADA com a justificativa
      const atualizada = await propostaRepository.updateStatus(propostaId, "REJEITADA", {
        justificativaRecusa,
      });

      return { sucesso: true, dados: atualizada };
    } catch {
      return { sucesso: false, erro: "Erro ao rejeitar a proposta de TFC." };
    }
  },
};
