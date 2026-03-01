/**
 * @theseus/database
 * Prisma Client 工厂 + 类型导出
 */

export { createPrisma, type TXPrisma } from './client';

// Re-export Prisma types for repos
export type { PrismaClient, Prisma } from './generated/prisma';
