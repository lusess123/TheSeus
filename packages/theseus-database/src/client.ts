/**
 * Prisma Client 工厂
 * 不使用单例，由入口层（theseus-api）传入连接配置
 * 适配 Cloudflare Workers + Prisma Postgres (Accelerate)
 */
import { PrismaClient } from './generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * 事务中的 Prisma Client 类型（排除连接管理方法）
 */
export type TXPrisma = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

/**
 * 创建 Prisma Client 实例（Prisma Postgres / Accelerate 协议）
 * @param databaseUrl - Prisma Postgres 连接 URL (prisma+postgres://...)
 */
export function createPrisma(databaseUrl: string) {
  return new PrismaClient({
    accelerateUrl: databaseUrl,
  }).$extends(withAccelerate());
}
