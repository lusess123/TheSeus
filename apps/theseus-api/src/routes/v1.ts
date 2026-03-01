/**
 * API v1 路由
 */
import { Hono } from 'hono';
import type { AppContext } from '@theseus/server';
import { userService } from '@theseus/server';
import { ok, fail } from '@theseus/shared';

const v1 = new Hono();

// --- Users ---

v1.get('/users', async (c) => {
  const ctx = c.get('ctx' as never) as AppContext;
  const users = await userService.list(ctx);
  return c.json(ok(users));
});

v1.get('/users/:id', async (c) => {
  const ctx = c.get('ctx' as never) as AppContext;
  const user = await userService.getById(ctx, c.req.param('id'));
  if (!user) {
    return c.json(fail('NOT_FOUND', 'User not found'), 404);
  }
  return c.json(ok(user));
});

v1.post('/users', async (c) => {
  const ctx = c.get('ctx' as never) as AppContext;
  const body = await c.req.json<{ email: string; name?: string }>();
  const user = await userService.create(ctx, body);
  return c.json(ok(user), 201);
});

export { v1 };
