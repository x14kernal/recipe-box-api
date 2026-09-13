import type { Tag as DbTag } from '../generated/prisma/client.js';
import type { Tag } from '../types/recipe.js';

export function mapTag(tag: DbTag): Tag {
  return { id: tag.id, name: tag.name, slug: tag.slug };
}
