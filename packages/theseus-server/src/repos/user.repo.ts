/**
 * User 表 Repository（防腐层）
 * 方法名与 Prisma 一致，支持 include 类型推断
 */
import type { PrismaClient, Prisma, TXPrisma } from '@theseus/database';

type Ops = Prisma.TypeMap['model']['User']['operations'];
type Args<Op extends keyof Ops> = Ops[Op]['args'];
type Subset<T, U> = Prisma.SelectSubset<T, U>;

const db = (prisma: PrismaClient, tx?: TXPrisma) => tx ?? prisma;

export async function findMany<T extends Args<'findMany'>>(
  prisma: PrismaClient,
  { prismaArgs, tx }: { prismaArgs: Subset<T, Args<'findMany'>>; tx?: TXPrisma },
) {
  return db(prisma, tx).user.findMany(prismaArgs);
}

export async function findFirst<T extends Args<'findFirst'>>(
  prisma: PrismaClient,
  { prismaArgs, tx }: { prismaArgs: Subset<T, Args<'findFirst'>>; tx?: TXPrisma },
) {
  return db(prisma, tx).user.findFirst(prismaArgs);
}

export async function findUnique<T extends Args<'findUnique'>>(
  prisma: PrismaClient,
  { prismaArgs, tx }: { prismaArgs: Subset<T, Args<'findUnique'>>; tx?: TXPrisma },
) {
  return db(prisma, tx).user.findUnique(prismaArgs);
}

export async function create<T extends Args<'create'>>(
  prisma: PrismaClient,
  { prismaArgs, tx }: { prismaArgs: Subset<T, Args<'create'>>; tx?: TXPrisma },
) {
  return db(prisma, tx).user.create(prismaArgs);
}

export async function update<T extends Args<'update'>>(
  prisma: PrismaClient,
  { prismaArgs, tx }: { prismaArgs: Subset<T, Args<'update'>>; tx?: TXPrisma },
) {
  return db(prisma, tx).user.update(prismaArgs);
}

export async function deleteOne<T extends Args<'delete'>>(
  prisma: PrismaClient,
  { prismaArgs, tx }: { prismaArgs: Subset<T, Args<'delete'>>; tx?: TXPrisma },
) {
  return db(prisma, tx).user.delete(prismaArgs);
}
