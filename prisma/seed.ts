import { prisma } from "../lib/prisma";
import { hash } from "bcryptjs";

// ─────────────────────────────────────────────────────────────────────────────
// prisma/seed.ts — Dados iniciais de demonstração
// Execute com: npm run db:seed
// ─────────────────────────────────────────────────────────────────────────────

const SENHA_DEMO = "Demo@1234";

async function main() {
  console.log("🌱 Iniciando seed...");

  const senha = await hash(SENHA_DEMO, 12);

  // ─── Utilizadores ────────────────────────────────────────────────────────

  // 1. Coordenação
  await prisma.user.upsert({
    where: { email: "coord@imetro.ao" },
    update: {},
    create: {
      name: "Ana Coordenadora",
      email: "coord@imetro.ao",
      password: senha,
      role: "COORDENACAO",
      numero: "COORD001",
      departamento: "Coordenação Académica",
    },
  });

  // 2. Docentes
  const docente1 = await prisma.user.upsert({
    where: { email: "docente@imetro.ao" },
    update: {},
    create: {
      name: "Prof. Carlos Santos",
      email: "docente@imetro.ao",
      password: senha,
      role: "DOCENTE",
      numero: "DOC001",
      departamento: "Engenharia Informática",
    },
  });

  await prisma.user.upsert({
    where: { email: "docente2@imetro.ao" },
    update: {},
    create: {
      name: "Prof.ª Maria Oliveira",
      email: "docente2@imetro.ao",
      password: senha,
      role: "DOCENTE",
      numero: "DOC002",
      departamento: "Sistemas de Informação",
    },
  });

  // 3. Estudantes
  const estudante1 = await prisma.user.upsert({
    where: { email: "estudante@imetro.ao" },
    update: {},
    create: {
      name: "João Estudante",
      email: "estudante@imetro.ao",
      password: senha,
      role: "ESTUDANTE",
      numero: "EST2024001",
      departamento: "Engenharia Informática",
    },
  });

  await prisma.user.upsert({
    where: { email: "estudante2@imetro.ao" },
    update: {},
    create: {
      name: "Beatriz Ferreira",
      email: "estudante2@imetro.ao",
      password: senha,
      role: "ESTUDANTE",
      numero: "EST2024002",
      departamento: "Sistemas de Informação",
    },
  });

  // ─── Proposta TFC de demonstração ───────────────────────────────────────

  const proposta = await prisma.propostaTFC.upsert({
    where: { id: "demo-proposta-001" },
    update: {},
    create: {
      id: "demo-proposta-001",
      titulo:
        "Sistema de Gestão de Biblioteca Digital para Instituições de Ensino Superior",
      resumo:
        "Plataforma web para gestão de acervos digitais em instituições de ensino superior angolanas, priorizando acessibilidade e usabilidade mobile.",
      descricao:
        "Este trabalho propõe o desenvolvimento de uma plataforma web para gestão de acervos digitais em instituições de ensino superior angolanas, com foco na acessibilidade e usabilidade.",
      objetivos:
        "Objetivo Geral: Desenvolver um sistema de gestão de biblioteca digital. Objetivos Específicos: 1) Analisar as necessidades das instituições; 2) Implementar módulo de catalogação; 3) Integrar sistema de empréstimos digitais.",
      area: "Engenharia de Software",
      status: "APROVADA",
      estudanteId: estudante1.id,
    },
  });

  // ─── Orientação ──────────────────────────────────────────────────────────

  await prisma.orientacao.upsert({
    where: { propostaId: proposta.id },
    update: {},
    create: {
      propostaId: proposta.id,
      orientadorId: docente1.id,
      cargaHoraria: 40,
    },
  });

  // ─── Entrega ─────────────────────────────────────────────────────────────

  await prisma.entrega.create({
    data: {
      titulo: "Capítulo 1 — Introdução e Revisão da Literatura",
      tipo: "PRE_PROJETO",
      status: "APROVADA",
      propostaId: proposta.id,
      nota: 16.5,
      comentarioOrientador: "Boa introdução e revisão bibliográfica bem fundamentada. Continue o bom trabalho!",
      entregueEm: new Date("2024-03-15"),
      avaliadoEm: new Date("2024-03-22"),
    },
  });

  console.log("✅ Seed concluído com sucesso!");
  console.log("\n📋 Credenciais de acesso:");
  console.log("  Coordenação: coord@imetro.ao / Demo@1234");
  console.log("  Docente:     docente@imetro.ao / Demo@1234");
  console.log("  Estudante:   estudante@imetro.ao / Demo@1234");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
