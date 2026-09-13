import { prisma } from '../lib/prisma.js';
import type { DbClient } from '../types/database.js';
import type { NewTag } from '../types/recipe.js';
import { slugify } from '../utils/slugify.js';

export async function findMany(client: DbClient = prisma) {
  return client.tag.findMany();
}

export async function createMany(tagNames: NewTag[], client: DbClient = prisma) {
  const slugs = tagNames.map(({ name }) => slugify(name));

  const created = await client.tag.createManyAndReturn({
    data: tagNames.map(({ name }) => ({
      name: name.trim().toLowerCase(),
      slug: slugify(name),
    })),
    skipDuplicates: true,
  });

  if (created.length === slugs.length) {
    return new Map(created.map((row) => [row.name, row]));
  }

  const createdSlugs = new Set(created.map(({ name }) => slugify(name)));
  const missingSlugs = slugs.filter((n) => !createdSlugs.has(n));

  const existing = await client.tag.findMany({ where: { slug: { in: missingSlugs } } });

  return new Map([...created, ...existing].map((row) => [row.name.trim().toLowerCase(), row]));
}
