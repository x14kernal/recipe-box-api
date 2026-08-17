import { NotFoundError } from '../errors/NotFoundError.js';
import { findRandomId } from '../repositories/userRepository.js';

export async function getRandomId() {
  const random = await findRandomId();
  if (!random) throw new NotFoundError('No user found');
  return random.id;
}
