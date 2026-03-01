/**
 * User Service — 框架无关的业务逻辑
 */
import { getContext } from '../context';
import * as UserRepo from '../repos/user.repo';

export async function list() {
  const { db } = getContext();
  return UserRepo.findMany(db, { prismaArgs: {} });
}

export async function getById(id: string) {
  const { db } = getContext();
  return UserRepo.findUnique(db, {
    prismaArgs: { where: { id } },
  });
}

export async function create(data: { email: string; name?: string }) {
  const { db } = getContext();
  return UserRepo.create(db, {
    prismaArgs: { data },
  });
}
