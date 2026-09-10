import type { User as DBPUser } from '../generated/prisma/client.js';
import type { User } from '../types/user.js';

type DbUser = DBPUser;

export function mapUser({ id, display_name, email, username }: DbUser): User {
  return {
    id,
    email,
    username,
    displayName: display_name,
  };
}
