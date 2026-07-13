"use client";

import { useSession } from "./use-session";
import type { Role } from "@prisma/client";


export function usePermissions() {
  const { role, isAuthenticated, isLoading } = useSession();

  const isEstudante = role === "ESTUDANTE";
  const isDocente = role === "DOCENTE";
  const isCoordenacao = role === "COORDENACAO";

  /**
   * Verifica se o utilizador tem o role especificado
   */
  function hasRole(checkRole: Role): boolean {
    return role === checkRole;
  }

  /**
   * Verifica se o utilizador tem qualquer um dos roles especificados
   */
  function hasAnyRole(roles: Role[]): boolean {
    if (!role) return false;
    return roles.includes(role);
  }

  /**
   * Verifica se o utilizador pode realizar uma ação de coordenação ou docente
   */
  const canManage = isDocente || isCoordenacao;

  /**
   * Verifica se o utilizador tem acesso administrativo (apenas coordenação)
   */
  const isAdmin = isCoordenacao;

  return {
    role,
    isAuthenticated,
    isLoading,
    isEstudante,
    isDocente,
    isCoordenacao,
    canManage,
    isAdmin,
    hasRole,
    hasAnyRole,
  };
}
