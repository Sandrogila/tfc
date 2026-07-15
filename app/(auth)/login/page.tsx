"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/actions/auth.actions";
import { GraduationCap, Loader2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";


export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction, null);

  // Redirecionar após login bem-sucedido
  useEffect(() => {
    if (state?.sucesso) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="animate-in space-y-8">
      {/* Cabeçalho mobile */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">TFC_IMETRO</span>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Bem-vindo de volta
        </h1>
        <p className="text-sm text-muted-foreground">
          Entre com as suas credenciais para aceder ao sistema.
        </p>
      </div>

      {/* Mensagem de erro */}
      {state && !state.sucesso && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <span className="mt-0.5 text-base leading-none">⚠</span>
          <span>{state.erro}</span>
        </div>
      )}

      {/* Formulário */}
      <form action={formAction} className="space-y-4" id="login-form">
        {/* Campo Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            Email institucional
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="seu@imetro.ao"
              className={cn(
                "w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm",
                "text-foreground placeholder:text-muted-foreground",
                "outline-none ring-0 transition-all",
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
              disabled={isPending}
            />
          </div>
        </div>

        {/* Campo Senha */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Senha
            </label>

          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className={cn(
                "w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-10 text-sm",
                "text-foreground placeholder:text-muted-foreground",
                "outline-none ring-0 transition-all",
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              id="toggle-password"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Botão de login */}
        <button
          type="submit"
          disabled={isPending}
          id="login-submit-btn"
          className={cn(
            "relative w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground",
            "transition-all duration-200",
            "hover:cursor-pointer hover:opacity-90 hover:shadow-lg hover:shadow-primary/25",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "disabled:cursor-not-allowed disabled:opacity-70",
          )}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              A entrar...
            </span>
          ) : (
            "Entrar no Sistema"
          )}
        </button>
      </form>

      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">
            Credenciais de demonstração
          </span>
        </div>
      </div>

      {/* Atalhos de teste */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { role: "Coordenação", email: "coord@imetro.ao" },
          { role: "Docente", email: "docente@imetro.ao" },
          { role: "Estudante", email: "estudante@imetro.ao" },
        ].map((demo) => (
          <button
            key={demo.role}
            type="button"
            className={cn(
              "cursor-pointer rounded-lg border border-border/60 p-2 text-xs text-muted-foreground",
              "transition-all duration-200",
              "hover:border-primary/40 hover:bg-accent hover:text-foreground",
              "hover:shadow-lg hover:shadow-primary/25",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
            onClick={() => {
              const emailInput = document.getElementById(
                "email"
              ) as HTMLInputElement;
              const passwordInput = document.getElementById(
                "password"
              ) as HTMLInputElement;

              if (emailInput) emailInput.value = demo.email;
              if (passwordInput) passwordInput.value = "Demo@1234";
            }}
          >
            {demo.role}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Sistema exclusivo para utilizadores IMETRO.
        <br />
        Problemas?{" "}
        <a
          href="mailto:suporte@imetro.ao"
          className="text-primary hover:underline"
        >
          Contacte o suporte
        </a>
      </p>
    </div>
  );
}
