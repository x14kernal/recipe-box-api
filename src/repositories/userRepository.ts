import { prisma } from '../lib/prisma.js';

export async function findById(id: string) {
  return prisma.users.findUnique({
    where: {
      id,
    },
  });
}

export async function findByEmail(email: string) {
  return prisma.users.findUnique({
    where: {
      email,
    },
  });
}

type UserPayload = {
  email: string;
  password_hash: string;
};
export async function create({ email, password_hash }: UserPayload) {
  return prisma.users.create({
    data: {
      email,
      password_hash,
    },
  });
}
