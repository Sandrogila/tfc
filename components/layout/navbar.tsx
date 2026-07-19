"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "@/hooks/use-session";
import { logoutAction } from "@/actions/auth.actions";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  Bell,
  LogOut,
  Moon,
  Sun,
  User,
  ChevronDown,
  GraduationCap,
  Menu,
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

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, nome } = useSession();
  const { theme, setTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      {/* Lado esquerdo — hambúrguer para mobile e logo */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
            aria-label="Abrir menu"
            id="mobile-menu-toggle"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            TFC_IMETRO
          </span>
        </div>
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
        <Link
          href="/notificacoes"
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
        </Link>

        {/* Separador */}
        <div className="mx-1 h-6 w-px bg-border/60" />

        {/* Perfil do utilizador */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
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

            <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", userMenuOpen && "rotate-180")} />
          </button>

          {/* Dropdown menu */}
          <div
            className={cn(
              "absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border/60",
              "bg-popover p-1 shadow-lg transition-all duration-200",
              userMenuOpen ? "visible opacity-100" : "invisible opacity-0",
            )}
          >
            <div className="px-3 py-2">
              <p className="truncate text-xs font-medium text-foreground">
                {user?.email}
              </p>
            </div>
            <div className="my-1 h-px bg-border/60" />
            <Link
              href="/perfil"
              onClick={() => setUserMenuOpen(false)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              id="profile-link"
            >
              <User className="h-4 w-4" />
              Meu Perfil
            </Link>
            <button
              onClick={() => {
                setUserMenuOpen(false);
                logoutAction();
              }}
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
