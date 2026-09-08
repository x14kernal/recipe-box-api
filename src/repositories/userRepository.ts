import { prisma } from '../lib/prisma.js';
import type { DbClient } from '../types/database.js';

export async function findById(id: string, client: DbClient = prisma) {
  client.userBookmark;
  return client.user.findUnique({ where: { id } });
}

export async function findByEmail(email: string, client: DbClient = prisma) {
  return client.user.findUnique({ where: { email } });
}

export async function findByUsername(username: string, client: DbClient = prisma) {
  return client.user.findUnique({ where: { username } });
}

type CreateUserData = {
  email: string;
  passwordHash: string;
  username: string;
  displayName: string | null;
};
export async function create(
  { email, passwordHash: password_hash, username, displayName: display_name }: CreateUserData,
  client: DbClient = prisma,
) {
  return client.user.create({
    data: {
      email,
      password_hash,
      username,
      display_name,
    },
  });
}
