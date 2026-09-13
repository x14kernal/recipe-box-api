import { mapIngredeint } from '../mappers/ingredientMapper.js';
import * as ingredientRepo from '../repositories/ingredientRepository.js';

export async function getAll() {
  const ingredints = await ingredientRepo.findMany();
  return ingredints.map(mapIngredeint);
}
