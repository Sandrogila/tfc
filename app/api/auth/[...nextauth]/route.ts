import { handlers } from "@/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Route Handler do Auth.js
// Processa todas as rotas /api/auth/* (signIn, signOut, session, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export const { GET, POST } = handlers;
