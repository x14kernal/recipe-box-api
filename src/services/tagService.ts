import { mapTag } from '../mappers/tagMapper.js';
import * as tagRepo from '../repositories/tagRepository.js';

export async function getAll() {
  const tags = await tagRepo.findMany();
  return tags.map(mapTag);
}
