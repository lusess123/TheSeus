/**
 * User Service — 框架无关的业务逻辑
 */
import type { AppContext } from '../context';
import * as UserRepo from '../repos/user.repo';

export async function list(ctx: AppContext) {
  return UserRepo.findMany(ctx.db, { prismaArgs: {} });
}

export async function getById(ctx: AppContext, id: string) {
  return UserRepo.findUnique(ctx.db, {
    prismaArgs: { where: { id } },
  });
}

export async function create(ctx: AppContext, data: { email: string; name?: string }) {
  return UserRepo.create(ctx.db, {
    prismaArgs: { data },
  });
}
