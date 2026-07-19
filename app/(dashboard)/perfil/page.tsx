import { auth } from "@/auth";
import { userRepository } from "@/repositories/user.repository";
import { PerfilForm } from "@/components/perfil/PerfilForm";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Buscar utilizador mais atualizado da base de dados
  const user = await userRepository.findById(session.user.id);
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">O Meu Perfil</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as suas informações de utilizador, configurações de conta e segurança.
        </p>
      </div>

      <PerfilForm user={user} />
    </div>
  );
}
