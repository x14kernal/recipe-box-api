import { NotFoundError, UnauthorizedError } from '../errors/index.js';
import { mapSession } from '../mappers/sessionMapper.js';
import * as userSessionRepo from '../repositories/userSessionRepository.js';
import type { Session } from '../types/session.js';
import { hashSessionToken } from '../utils/crypto.js';

export async function getAll(userId: string, currentSessionId: string): Promise<Session[]> {
  const sessions = await userSessionRepo.findMany(userId);
  return sessions.map((session) => mapSession(session, session.id === currentSessionId));
}

type TUserSession = { userId: string; sessionId: string };

export async function deleteBySessionId({ userId, sessionId }: TUserSession) {
  const result = await userSessionRepo.deleteWhere({ userId, id: sessionId });
  if (!result) throw new NotFoundError('Session not found');
}

export async function validateSession(token: string) {
  const hashedToken = hashSessionToken(token);
  const session = await userSessionRepo.findByHashedToken(hashedToken);

  if (!session) throw new UnauthorizedError('Not allowed');

  if (session.expires_at < new Date()) {
    await userSessionRepo.deleteByHashedToken(hashedToken);
    throw new UnauthorizedError('Session expired');
  }

  return session;
}
