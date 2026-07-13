"use client";

import { useSession } from "@/hooks/use-session";
import { logoutAction } from "@/actions/auth.actions";
import { useTheme } from "next-themes";
import {
  Bell,
  LogOut,
  Moon,
  Sun,
  User,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";


const roleLabels: Record<string, string> = {
  ESTUDANTE: "Estudante",
  DOCENTE: "Docente",
  COORDENACAO: "Coordenação",
};

const roleBadgeColors: Record<string, string> = {
  ESTUDANTE:
    "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
  DOCENTE:
    "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  COORDENACAO:
    "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20",
};

export function Navbar() {
  const { user, nome } = useSession();
  const { theme, setTheme } = useTheme();

  const roleLabel = user?.role ? roleLabels[user.role] ?? user.role : "";
  const roleBadge = user?.role ? roleBadgeColors[user.role] ?? "" : "";

  // Iniciais do nome para avatar
  const initials = nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-md">
      {/* Lado esquerdo — breadcrumb placeholder */}
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          TFC_IMETRO
        </span>
      </div>

      {/* Lado direito — ações */}
      <div className="flex items-center gap-2">
        {/* Toggle de tema */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border border-border/60",
            "text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
          )}
          aria-label="Alternar tema"
          id="theme-toggle"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Notificações */}
        <button
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-lg border border-border/60",
            "text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
          )}
          aria-label="Notificações"
          id="notifications-btn"
        >
          <Bell className="h-4 w-4" />
          {/* Badge de notificação */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* Separador */}
        <div className="mx-1 h-6 w-px bg-border/60" />

        {/* Perfil do utilizador */}
        <div className="group relative">
          <button
            className={cn(
              "flex items-center gap-2.5 rounded-lg border border-border/60 px-3 py-1.5",
              "text-sm transition-colors hover:bg-accent",
            )}
            id="user-menu-btn"
            aria-label="Menu do utilizador"
          >
            {/* Avatar */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {initials || <User className="h-3.5 w-3.5" />}
            </div>

            <div className="hidden flex-col items-start sm:flex">
              <span className="text-xs font-semibold leading-none text-foreground">
                {nome || "Utilizador"}
              </span>
              {roleLabel && (
                <span
                  className={cn(
                    "mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium",
                    roleBadge,
                  )}
                >
                  {roleLabel}
                </span>
              )}
            </div>

            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:rotate-180" />
          </button>

          {/* Dropdown menu */}
          <div
            className={cn(
              "invisible absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border/60",
              "bg-popover p-1 shadow-lg opacity-0 transition-all duration-200",
              "group-hover:visible group-hover:opacity-100",
            )}
          >
            <div className="px-3 py-2">
              <p className="truncate text-xs font-medium text-foreground">
                {user?.email}
              </p>
            </div>
            <div className="my-1 h-px bg-border/60" />
            <a
              href="/dashboard/perfil"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              id="profile-link"
            >
              <User className="h-4 w-4" />
              Meu Perfil
            </a>
            <button
              onClick={() => logoutAction()}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              id="logout-btn"
            >
              <LogOut className="h-4 w-4" />
              Terminar Sessão
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
