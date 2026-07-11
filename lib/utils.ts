import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ─────────────────────────────────────────────────────────────────────────────
// lib/utils.ts — Utilitários gerais
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Combina classes CSS com suporte a Tailwind merge
 * Padrão utilizado pelo Shadcn/UI
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata uma data para o padrão pt-AO (Angola)
 */
export function formatarData(
  data: Date | string,
  opcoes?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...opcoes,
  });
}

/**
 * Formata data e hora
 */
export function formatarDataHora(data: Date | string): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleString("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formata bytes para leitura humana
 */
export function formatarTamanho(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Trunca texto a um número máximo de caracteres
 */
export function truncar(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  return `${texto.slice(0, max)}...`;
}

/**
 * Retorna as iniciais de um nome completo (até 2 letras)
 */
export function obterIniciais(nome: string): string {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}
