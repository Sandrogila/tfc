"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { Role } from "@prisma/client";

interface MainLayoutProps {
  children: React.ReactNode;
  userRole?: Role;
}

export function MainLayout({ children, userRole }: MainLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar Desktop (fixa à esquerda) */}
      <Sidebar userRole={userRole} className="hidden md:flex w-64 flex-shrink-0" />

      {/* Sidebar Mobile (Gaveta/Overlay) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay escuro de fundo */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Gaveta lateral da Sidebar */}
          <div className="relative flex w-64 flex-col bg-background h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar
              userRole={userRole}
              className="flex h-full w-full"
              onClose={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Área principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar no topo com gatilho para menu mobile */}
        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

        {/* Conteúdo com scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-7xl p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
