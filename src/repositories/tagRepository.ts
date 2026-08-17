import { prisma } from '../lib/prisma.js';
import type { DbClient } from '../types/database.js';

export async function create(tagsName: string[], client: DbClient = prisma) {
  await client.tags.createMany({
    data: tagsName.map((name) => ({ name: name.toLowerCase() })),
    skipDuplicates: true,
  });

  return client.tags.findMany({
    where: {
      name: {
        in: tagsName.map((t) => t.toLowerCase()),
      },
    },
  });
}
