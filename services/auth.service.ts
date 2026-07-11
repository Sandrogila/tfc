import { userRepository } from "@/repositories/user.repository";
import { compare } from "bcryptjs";
import { Role } from "@prisma/client";


// ─────────────────────────────────────────────────────────────────────────────
// services/auth.service.ts — Lógica de negócio da autenticação
// ─────────────────────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Verificar credenciais para login
   */
  async verificarCredenciais(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.password) {
      return { sucesso: false, erro: "Credenciais inválidas." };
    }
    if (!user.ativo) {
      return { sucesso: false, erro: "Conta desativada." };
    }
    const senhaValida = await compare(password, user.password);
    if (!senhaValida) {
      return { sucesso: false, erro: "Credenciais inválidas." };
    }
    return { sucesso: true, user };
  },

  /**
   * Registar novo utilizador
   */
  async registar(dados: {
    name: string;
    email: string;
    password: string;
    role: Role;
    numero: string;
    departamento?: string;
  }) {
    // Verificar se email já existe
    const emailExistente = await userRepository.findByEmail(dados.email);
    if (emailExistente) {
      return { sucesso: false, erro: "Este email já está registado." };
    }

    // Verificar se número já existe
    if (dados.numero) {
      const numeroExistente = await userRepository.findByNumero(dados.numero);
      if (numeroExistente) {
        return {
          sucesso: false,
          erro: "Este número de estudante/docente já está registado.",
        };
      }
    }

    const user = await userRepository.create(dados);
    return { sucesso: true, user };
  },

  /**
   * Alterar senha do utilizador
   */
  async alterarSenha(
    userId: string,
    senhaAtual: string,
    novaSenha: string,
  ) {
    const user = await userRepository.findById(userId);
    if (!user || !user.password) {
      return { sucesso: false, erro: "Utilizador não encontrado." };
    }

    const senhaAtualValida = await compare(senhaAtual, user.password);
    if (!senhaAtualValida) {
      return { sucesso: false, erro: "Senha atual incorreta." };
    }

    await userRepository.update(userId, { password: novaSenha });
    return { sucesso: true };
  },
};
