/**
 * API v1 路由
 */
import { Hono } from 'hono';
import { userService } from '@theseus/server';
import { ok, fail } from '@theseus/shared';
import type { HonoEnv } from '../env';

const v1 = new Hono<HonoEnv>();

// --- Users ---

v1.get('/users', async (c) => {
  const users = await userService.list();
  return c.json(ok(users));
});

v1.get('/users/:id', async (c) => {
  const user = await userService.getById(c.req.param('id'));
  if (!user) {
    return c.json(fail('NOT_FOUND', 'User not found'), 404);
  }
  return c.json(ok(user));
});

v1.post('/users', async (c) => {
  const body = await c.req.json<{ email: string; name?: string }>();
  const user = await userService.create(body);
  return c.json(ok(user), 201);
});

export { v1 };
