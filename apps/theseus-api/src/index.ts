/**
 * @theseus/api
 * Cloudflare Workers 入口 — 薄层，只负责路由绑定和环境初始化
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createContext, runWithContext } from '@theseus/server';
import type { HonoEnv } from './env';
import { v1 } from './routes/v1';

const app = new Hono<HonoEnv>();

// CORS（不同子域名方案）
app.use(
  '*',
  cors({
    origin: (origin) => origin, // 开发阶段允许所有，生产环境按需收紧
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

// 注入 AppContext 中间件（Prisma 按需懒加载，只有访问 ctx.db 时才创建）
app.use('/api/*', async (c, next) => {
  const ctx = createContext({ databaseUrl: c.env.DATABASE_URL });
  await runWithContext(ctx, () => next());
});

// 挂载 v1 路由
app.route('/api/v1', v1);

// 健康检查
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
