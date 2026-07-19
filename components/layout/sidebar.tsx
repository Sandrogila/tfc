"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";
import {
  LayoutDashboard,
  FileText,
  Users,
  BookOpen,
  GraduationCap,
  ChevronRight,
  BookMarked,
  ClipboardList,
  Upload,
  UserCog,
  BarChart3,
  Loader2,
} from "lucide-react";


import { Role } from "@prisma/client";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  badge?: string;
}

const navItems: NavItem[] = [
  // ─ Todos
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  // ─ ESTUDANTE
  {
    label: "Minhas Propostas",
    href: "/propostas",
    icon: FileText,
    roles: ["ESTUDANTE"],
  },
  {
    label: "Entregas de Documentos",
    href: "/entregas",
    icon: Upload,
    roles: ["ESTUDANTE"],
  },
  {
    label: "Diário de Bordo",
    href: "/diario",
    icon: BookMarked,
    roles: ["ESTUDANTE"],
  },

  // ─ DOCENTE
  {
    label: "Solicitações de Orientação",
    href: "/orientacoes",
    icon: ClipboardList,
    roles: ["DOCENTE"],
  },
  {
    label: "Avaliação de Entregas",
    href: "/avaliacoes",
    icon: BookOpen,
    roles: ["DOCENTE"],
  },
  {
    label: "Diário de Orientação",
    href: "/diario",
    icon: BookMarked,
    roles: ["DOCENTE"],
  },
  {
    label: "Perfil de Orientação",
    href: "/perfil",
    icon: UserCog,
    roles: ["DOCENTE"],
  },

  // ─ COORDENACAO
  {
    label: "Gestão de Propostas",
    href: "/gestao-propostas",
    icon: BarChart3,
    roles: ["COORDENACAO"],
  },
  {
    label: "Gestão de Utilizadores",
    href: "/utilizadores",
    icon: Users,
    roles: ["COORDENACAO"],
  },
];

interface SidebarProps {
  className?: string;
  userRole?: Role;
}

export function Sidebar({ className, userRole }: SidebarProps) {
  const pathname = usePathname();
  const { role: clientRole, isLoading: clientLoading } = usePermissions();

  // Se recebemos a role do servidor, usamos logo ela e não esperamos pelo cliente
  const activeRole = userRole || clientRole;
  const isLoading = !userRole && clientLoading;

  const filteredItems = navItems.filter((item) => {
    // Se ainda está a carregar o cliente e não temos a role do servidor
    if (isLoading) return !item.roles;
    // Se não há role, só mostra itens sem role restriction
    if (!activeRole) return !item.roles;
    // Itens sem roles aparecem para todos
    if (!item.roles) return true;
    // Itens com roles só aparecem para o role correto
    return item.roles.includes(activeRole);
  });


  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-border/40 bg-sidebar",
        className,
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border/40 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-none text-foreground">
            TFC_IMETRO
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            Gestão de TFC
          </span>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          filteredItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200",
                    !isActive && "group-hover:scale-110",
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-medium text-destructive-foreground">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                )}
              </Link>
            );
          })
        )}
      </nav>

      {/* Rodapé da sidebar */}
      <div className="border-t border-border/40 p-4">
        <p className="text-center text-[10px] text-muted-foreground">
          IMETRO © {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}
