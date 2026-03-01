/**
 * 应用上下文
 * 使用 AsyncLocalStorage 实现请求级隐式注入
 * 框架无关，不依赖 Hono/Express 等
 */
import { AsyncLocalStorage } from 'node:async_hooks';
import type { PrismaClient } from '@theseus/database';
import { createPrisma } from '@theseus/database';

export interface AppContext {
  db: PrismaClient;
  // 未来可扩展：
  // config: AppConfig;
  // logger: Logger;
  // cache: CacheClient;
}

const asyncContext = new AsyncLocalStorage<AppContext>();

/**
 * 获取当前请求的 AppContext（从 AsyncLocalStorage 中取）
 */
export function getContext(): AppContext {
  const ctx = asyncContext.getStore();
  if (!ctx) {
    throw new Error('AppContext not available — was runWithContext() called?');
  }
  return ctx;
}

/**
 * 在 AsyncLocalStorage 作用域中执行函数
 * 入口层（如 Hono 中间件）调用此方法注入上下文
 */
export function runWithContext<T>(ctx: AppContext, fn: () => T): T {
  return asyncContext.run(ctx, fn);
}

/**
 * 创建应用上下文（Prisma 按需懒加载）
 */
export function createContext(deps: { databaseUrl: string }): AppContext {
  let _db: PrismaClient | undefined;
  return {
    get db() {
      if (!_db) _db = createPrisma(deps.databaseUrl);
      return _db;
    },
  };
}
