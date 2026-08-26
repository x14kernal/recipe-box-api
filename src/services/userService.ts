import type { User } from '../types/user.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { UnauthorizedError } from '../errors/UnauthorizedError.js';

import * as userRepo from '../repositories/userRepository.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function getOne(id: string) {
  const user = await userRepo.findById(id);
  if (!user) throw new NotFoundError('User not found');
  return {
    id: user.id,
    email: user.email,
  };
}

export async function checkEmailAvailable(email: string) {
  const user = await userRepo.findByEmail(email);
  if (user) {
    throw new ConflictError('User with this email already exists');
  }
  return true;
}

type UserPayload = {
  email: string;
  password: string;
};
export async function create({ email, password }: UserPayload): Promise<User> {
  const password_hash = await bcrypt.hash(password, 12);
  const res = await userRepo.create({ email, password_hash });
  return { id: res.id, email: res.email };
}

export async function checkCredentials({
  email,
  password,
}: UserPayload): Promise<{ user: User; token: string }> {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new UnauthorizedError();

  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordCorrect) throw new UnauthorizedError();

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '20m', // for testing, change it later
  });

  return { user: { id: user.id, email: user.email }, token };
}
