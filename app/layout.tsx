import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { auth } from "@/auth";

// Root Layout — TFC_IMETRO

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TFC_IMETRO — Sistema de Gestão de TFC",
    template: "%s | TFC_IMETRO",
  },
  description:
    "Sistema de Gestão de Trabalhos de Fim de Curso do IMETRO. Gerencie propostas, orientações, entregas e bancas de avaliação.",
  keywords: ["TFC", "IMETRO", "gestão", "trabalho", "fim de curso", "Angola"],
  authors: [{ name: "IMETRO" }],
  robots: "noindex, nofollow", // Sistema interno
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="pt-AO"
      suppressHydrationWarning
      className={inter.variable}
    >
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>
          <SessionProvider session={session}>
            <QueryProvider>{children}</QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
