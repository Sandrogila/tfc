import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Role } from "@prisma/client";


const SALT_ROUNDS = 12;

export const userRepository = {
  /** Encontrar por email */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  },

  /** Encontrar por ID */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  /** Encontrar por número (estudante/docente) */
  async findByNumero(numero: string) {
    return prisma.user.findUnique({
      where: { numero },
    });
  },

  /** Listar todos os utilizadores com filtros opcionais */
  async findMany(params?: {
    role?: Role;
    ativo?: boolean;
    pagina?: number;
    limite?: number;
  }) {
    const { role, ativo, pagina = 1, limite = 20 } = params ?? {};
    return prisma.user.findMany({
      where: {
        ...(role && { role }),
        ...(ativo !== undefined && { ativo }),
      },
      skip: (pagina - 1) * limite,
      take: limite,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        numero: true,
        departamento: true,
        ativo: true,
        createdAt: true,
      },
    });
  },

  /** Criar novo utilizador */
  async create(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    numero?: string;
    departamento?: string;
  }) {
    const hashedPassword = await hash(data.password, SALT_ROUNDS);
    const { name, email, role, numero, departamento } = data;
    return prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        numero,
        departamento,
      },
    });
  },

  /** Atualizar dados do utilizador */
  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      password: string;
      image: string;
      departamento: string;
      ativo: boolean;
    }>,
  ) {
    const updateData = { ...data };
    if (updateData.password) {
      updateData.password = await hash(updateData.password, SALT_ROUNDS);
    }
    return prisma.user.update({ where: { id }, data: updateData });
  },

  /** Desativar conta (soft delete) */
  async deactivate(id: string) {
    return prisma.user.update({
      where: { id },
      data: { ativo: false },
    });
  },

  /** Contar utilizadores por role */
  async countByRole() {
    return prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true },
      where: { ativo: true },
    });
  },
};
