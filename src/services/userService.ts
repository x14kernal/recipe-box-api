import z from 'zod';
import bcrypt from 'bcryptjs';
import type { LoginUserInput, RegisterUserInput, User } from '../types/user.js';
import { UnauthorizedError, ConflictError, NotFoundError } from '../errors/index.js';
import * as userRepo from '../repositories/userRepository.js';
import * as userSessionRepo from '../repositories/userSessionRepository.js';
import { generateRandomToken, hashSessionToken } from '../utils/crypto.js';

export async function getOne(id: string): Promise<User> {
  const user = await userRepo.findById(id);
  if (!user) throw new NotFoundError('User not found');
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.display_name,
  };
}

export async function checkEmailAvailable(email: string) {
  const user = await userRepo.findByEmail(email);
  if (user) {
    throw new ConflictError('User with this email already exists');
  }
  return true;
}

export async function checkUsernameAvailable(username: string) {
  const user = await userRepo.findByUsername(username);
  if (user) {
    throw new ConflictError('Username already exists.');
  }
  return true;
}

export async function create({ email, password, username, displayName }: RegisterUserInput): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 12);
  const res = await userRepo.create({
    email,
    passwordHash,
    username,
    displayName,
  });
  return {
    id: res.id,
    email: res.email,
    username: res.username,
    displayName: res.display_name,
  };
}

type LoginData = {
  payload: LoginUserInput;
  ipAddr: string | null;
  userAgent: string | null;
};
export async function login({
  payload: { identifier, password },
  ipAddr,
  userAgent,
}: LoginData): Promise<{ user: User; token: string }> {
  const isEmail = z.email().safeParse(identifier).success;

  const user = isEmail ? await userRepo.findByEmail(identifier) : await userRepo.findByUsername(identifier);

  if (!user) throw new UnauthorizedError();

  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordCorrect) throw new UnauthorizedError();

  /*
    - Instead of depending on JWT as a session, I'll depend on database session as the session
    - To support multi-sessions, logout all, logout specific device, see active session, etc.
  */
  const token = generateRandomToken();
  const hashedToken = hashSessionToken(token);
  const expiresAt = new Date();

  // The token is valid for 30 days
  expiresAt.setDate(expiresAt.getDate() + 30);

  await userSessionRepo.create({ userId: user.id, hashedToken, expiresAt, ipAddr, userAgent });

  return { user: { ...user, displayName: user.display_name }, token };
}

export async function logout(sessionId: string) {
  await userSessionRepo.deleteById(sessionId);
}
