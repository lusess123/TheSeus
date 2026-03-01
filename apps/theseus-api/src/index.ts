/**
 * @theseus/api
 * Cloudflare Workers 入口 — 薄层，只负责路由绑定和环境初始化
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createPrisma } from '@theseus/database';
import { createContext } from '@theseus/server';
import { v1 } from './routes/v1';

type Bindings = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS（不同子域名方案）
app.use(
  '*',
  cors({
    origin: (origin) => origin, // 开发阶段允许所有，生产环境按需收紧
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

// 注入 AppContext 中间件
app.use('/api/*', async (c, next) => {
  const prisma = createPrisma(c.env.DATABASE_URL);
  const ctx = createContext({ db: prisma });
  c.set('ctx' as never, ctx);
  await next();
});

// 挂载 v1 路由
app.route('/api/v1', v1);

// 健康检查
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
