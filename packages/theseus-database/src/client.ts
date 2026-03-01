/**
 * Prisma Client 工厂
 * 不使用单例，由入口层（theseus-api）传入连接配置
 * 适配 Cloudflare Workers 的环境变量机制
 */
import { PrismaClient } from './generated/prisma';

/**
 * 事务中的 Prisma Client 类型（排除连接管理方法）
 */
export type TXPrisma = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

/**
 * 创建 Prisma Client 实例
 * @param databaseUrl - Prisma Postgres 连接 URL
 */
export function createPrisma(databaseUrl: string): PrismaClient {
  return new PrismaClient({
    datasourceUrl: databaseUrl,
  });
}
