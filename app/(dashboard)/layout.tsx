import { MainLayout } from "@/components/layout/main-layout";
import { requireAuth } from "@/lib/auth/permissions";

// ─────────────────────────────────────────────────────────────────────────────
// Layout do grupo de rotas do Dashboard
// Protege todas as rotas /dashboard/* com autenticação
// ─────────────────────────────────────────────────────────────────────────────

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Garante sessão ativa — redireciona para /login se não autenticado
  const session = await requireAuth();

  return <MainLayout userRole={session.user.role}>{children}</MainLayout>;
}

