/**
 * 应用上下文
 * 由入口层（theseus-api）组装，传给 Service 层
 * 框架无关，不依赖 Hono/Express 等
 */
import type { PrismaClient } from '@theseus/database';

export interface AppContext {
  db: PrismaClient;
  // 未来可扩展：
  // config: AppConfig;
  // logger: Logger;
  // cache: CacheClient;
}

/**
 * 创建应用上下文
 */
export function createContext(deps: { db: PrismaClient }): AppContext {
  return {
    db: deps.db,
  };
}
