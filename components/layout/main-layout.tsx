import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { Role } from "@prisma/client";

interface MainLayoutProps {
  children: React.ReactNode;
  userRole?: Role;
}

export function MainLayout({ children, userRole }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar fixa à esquerda com a role do servidor */}
      <Sidebar userRole={userRole} className="hidden md:flex" />

      {/* Área principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar no topo */}
        <Navbar />

        {/* Conteúdo com scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-7xl p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

