import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Layout do grupo de rotas de autenticação
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Autenticação",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      {/* Painel esquerdo — branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[hsl(224,71%,5%)] p-12 lg:flex">
        {/* Gradiente de fundo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, hsl(217,91%,60%,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, hsl(271,76%,53%,0.3) 0%, transparent 50%)",
          }}
        />

        {/* Grid pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(213,31%,91%) 1px, transparent 1px), linear-gradient(90deg, hsl(213,31%,91%) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">TFC_IMETRO</p>
            <p className="text-xs uppercase tracking-widest text-blue-400/80">
              Sistema de Gestão
            </p>
          </div>
        </div>

        {/* Conteúdo central */}
        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Gestão de Trabalhos
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              de Fim de Curso
            </span>
          </h1>
          <p className="max-w-sm text-base leading-relaxed text-slate-400">
            Plataforma integrada para gestão de propostas TFC, orientações
            académicas, entregas e bancas de avaliação do IMETRO.
          </p>

          {/* Estatísticas placeholder */}
          <div className="flex gap-8 pt-4">
            {[
              { valor: "3 perfis", desc: "de utilizador" },
              { valor: "7 módulos", desc: "integrados" },
              { valor: "100%", desc: "digital" },
            ].map((stat) => (
              <div key={stat.desc}>
                <p className="text-2xl font-bold text-white">{stat.valor}</p>
                <p className="text-xs text-slate-500">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-slate-600">
          © {new Date().getFullYear()} IMETRO — Instituto de Metrologia
        </p>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
