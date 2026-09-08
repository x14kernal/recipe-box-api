import { prisma } from '../lib/prisma.js';
import type { DbClient } from '../types/database.js';

export async function findMany(userId: string, client: DbClient = prisma) {
  return client.userSession.findMany({
    where: { user_id: userId },
  });
}

type TWhere = {
  id?: string;
  userId?: string;
};
// export async function findWhere({ id, userId }: TWhere, client: DbClient = prisma) {
//   const where = {
//     ...(id && { id }),
//     ...(userId && { user_id: userId }),
//   };

//   return client.userSession.findFirst({ where });
// }

type TCreate = {
  userId: string;
  hashedToken: string;
  expiresAt: Date;
  ipAddr: string | null;
  userAgent: string | null;
};
export async function create(p: TCreate, client: DbClient = prisma) {
  return client.userSession.create({
    data: {
      user_id: p.userId,
      session_token_hash: p.hashedToken,
      expires_at: p.expiresAt,
      ip_address: p.ipAddr,
      user_agent: p.userAgent,
    },
  });
}

export async function findByHashedToken(hashedToken: string, client: DbClient = prisma) {
  return client.userSession.findUnique({ where: { session_token_hash: hashedToken } });
}

export async function deleteByHashedToken(hashedToken: string, client: DbClient = prisma) {
  return client.userSession.delete({ where: { session_token_hash: hashedToken } });
}

export async function deleteWhere({ id, userId }: TWhere, client: DbClient = prisma) {
  const result = await client.userSession.deleteMany({
    where: {
      ...(id && { id }),
      ...(userId && { user_id: userId }),
    },
  });

  return result.count > 0;
}

export async function deleteById(id: string, client: DbClient = prisma) {
  return client.userSession.delete({ where: { id } });
}
