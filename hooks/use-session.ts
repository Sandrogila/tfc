"use client";

import { useSession as useNextAuthSession } from "next-auth/react";
import type { Role } from "@prisma/client";

export function useSession() {
  const { data: session, status, update } = useNextAuthSession();

  const user = session?.user ?? null;

  return {
    session,
    user,
    status,
    update,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
    role: user?.role as Role | undefined,
    nome: user?.name ?? "",
    email: user?.email ?? "",
  };
}
