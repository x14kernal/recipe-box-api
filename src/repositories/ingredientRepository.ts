import { prisma } from '../lib/prisma.js';
import type { DbClient } from '../types/database.js';
import type { CreateIngredient } from '../types/recipe.js';
import { slugify } from '../utils/slugify.js';

export async function createMany(ingredients: CreateIngredient[], client: DbClient = prisma) {
  const slugs = ingredients.map(({ name }) => slugify(name));

  const created = await client.ingredient.createManyAndReturn({
    data: ingredients.map(({ name, image }) => ({
      name: name.trim().toLowerCase(),
      slug: slugify(name),
      image_url: image ?? null,
    })),
    skipDuplicates: true,
  });

  if (created.length === slugs.length) {
    return new Map(created.map((row) => [row.name, row]));
  }

  const createdSlugs = new Set(created.map(({ name }) => slugify(name)));
  const missingSlugs = slugs.filter((n) => !createdSlugs.has(n));

  const existing = await client.ingredient.findMany({ where: { slug: { in: missingSlugs } } });

  return new Map([...created, ...existing].map((row) => [row.name.trim().toLowerCase(), row]));
}
