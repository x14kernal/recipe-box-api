import { prisma } from '../lib/prisma.js';

export async function findRandomId() {
  const result = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id
    FROM users
    ORDER BY RANDOM()
    LIMIT 1
  `;

  return result[0] || null;
}
